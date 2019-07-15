const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;
const collectionService = require('../collections/collection.service');
const bundleService = require('../bundles/bundle.service');

module.exports = {
    authenticate,
    getAll,
    getById,
    getByName,
    create,
    update,
    //updateAvatar,
    addCollection,
    deleteCollection,
    addBundle,
    deleteBundle,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    //console.log(password);
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        return await User.findById(id).select('-hash');
    }else{
        return null;
    }
}

async function getByName(username){
    return await User.findOne({ username: username }).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function addCollection(id, collection){
    const user = await User.findById(id);
    // validate
    if (!user) throw 'User not found';

    let updateError=null;
    let updateResult = null;
    await User.updateOne({ _id: id }, 
        { $addToSet: { collections: collection.name } }, 
        (err, result) => { 
            //if(err) throw err;//throw to mongodb utils.js
            //else if (result && result.nModified==0){
                //throw 'Collection name already exist.';
            //}
            updateError = err;
            updateResult = result;
        });
    if(updateError) throw updateError;
    else if (updateResult && updateResult.nModified==0){
        throw 'Collection name already exists.';
    }
    collectionService.create({...collection, owner: user.username});
    return await User.findById(id).select('collections');
}

async function deleteCollection(collectionId){
    //console.log(collectionId);
    const collection = await collectionService.getById(collectionId);
    if (!collection) throw 'Collection not found.';
    //console.log(collection.name+" | "+collection.owner);
    const user = await User.findOne({username: collection.owner});
    if (!user) throw 'User not found.';

    let updateError=null;
    let updateResult = null;
    await User.updateOne({ _id: user.id }, 
        { $pull: { collections: collection.name } }, 
        (err, result) => { 
            updateError = err;
            updateResult = result;
        });
    if(updateError) throw updateError;
    else if (updateResult && updateResult.nModified==0){
        throw 'User does not have this collection';
    }
    collectionService.delete(collectionId);
    return await User.findById(user.id).select('collections');
}

async function addBundle(id, bundleType, bundle){
    const user = await User.findById(id);
    if (!user) throw 'User not found.';

    let createdBundle = await bundleService.create(bundleType, {...bundle, owner: user.username});
    if (!createdBundle) throw 'Bundle cannot be created.'

    let updateError = null;
    let updateResult = null;
    if(bundleType=="image"){
        console.log("add image bundle");
        await User.updateOne({ _id: id }, 
                { $push: { imageBundles: createdBundle.id } }, 
                (err, result) => { 
                    updateError = err;
                    updateResult = result;
                });
    }else if(bundleType=="text"){
        console.log("add text bundle");
        await User.updateOne({ _id: id }, 
            { $push: { textBundles: createdBundle.id } }, 
            (err, result) => { 
                updateError = err;
                updateResult = result;
            });
    }else {
        throw "Bundle type not supported."
    }
    console.log(updateResult);
    if(updateError) {
        bundleService.delete(createdBundle.id);
        throw updateError;
    }else if (updateResult && updateResult.nModified==0){
        bundleService.delete(createdBundle.id);
        throw 'Somehow this bundle cannot be added to the user.';
    }
    return await User.findById(id).select(`${bundleType}Bundles`);
}

async function deleteBundle(bundleType, bundleId){
    //console.log(collectionId);
    const bundle = await bundleService.getByTypeAndId(bundleType, bundleId);
    if (!bundle) throw 'Bundle not found.';
    //console.log(collection.name+" | "+collection.owner);
    const user = await User.findOne({username: bundle.owner});
    if (!user) throw 'User not found.';

    let updateError=null;
    let updateResult = null;
    if(bundleType=="image"){
        await User.updateOne({ _id: user.id }, 
                { $pull: { imageBundles: bundle.id } }, 
                (err, result) => { 
                    updateError = err;
                    updateResult = result;
                });
    }else if(bundleType=="text"){
        await User.updateOne({ _id: user.id }, 
            { $pull: { textBundles: bundle.id } }, 
            (err, result) => { 
                updateError = err;
                updateResult = result;
            });
    }else {
        throw "Bundle type not supported."
    }
    if(updateError) throw updateError;
    else if (updateResult && updateResult.nModified==0){
        throw 'User does not have this bundle';
    }
    bundleService.delete(bundleType, bundleId);
    return await User.findById(user.id).select(`${bundleType}Bundles`);
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}