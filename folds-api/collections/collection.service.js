const config = require('config.json');
const db = require('_helpers/db');
const Collection = db.Collection;
const fileHelper = require('../_helpers/file-helper');
const path = require('path');

module.exports = {
    getAll,
    getById,
    getByName,
    getByUserAndName,
    getOwnerOf,
    create,
    update,
    deleteContainedBundleByUserAndName,
    delete: _delete
};

async function getAll() {
    return await Collection.find();
}

async function getById(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        return await Collection.findById(id);
    }else{
        return null;
    }
}

async function getByName(collectionname){
    return await Collection.findAll({ name: collectionname });
}

async function getByUserAndName(username, collectionname){
    return await Collection.findOne({ owner: username, name: collectionname });
}

async function getOwnerOf(id){
    const collection = await Collection.findById(id);

    // validate
    if (!collection) throw 'Collection not found';

    return collection.owner;
}

async function create(collectionParam) {
    //console.log(collectionParam);
    const collection = new Collection(collectionParam);

    // save collection
    await collection.save();
}

async function update(id, collectionParam) {
    const collection = await Collection.findById(id);

    // validate
    if (!collection) throw 'Collection not found';
    if (collectionParam.name && (collection.name !== collectionParam.name))
        throw 'Please change collection name in Edit User Page.'
    // copy collectionParam properties to collection
    console.log(collectionParam.bg + " | " + collection.bg);
    if(collectionParam.bg && (collection.bg !== collectionParam.bg)){
        if(collection.bg.indexOf('default')==-1){
            console.log("delete previous file "+collection.bg);
            await fileHelper.unlinkFile(path.join(__dirname, '../public', collection.bg))
            .catch(err=> {throw err});
        }
    }
    Object.assign(collection, collectionParam);

    await collection.save();
}

async function deleteContainedBundleByUserAndName(username, colName, bundleType, bundleId){
    const collection = await Collection.findOne({ owner: username, name: colName });
    if (!collection) throw 'Collection not found';
    if(collection.bundles){
        for(let i = 0; i<collection.bundles.length; i++){
            let bundle = collection.bundles[i];
            if(bundle.type===bundleType && bundle.id===bundleId){
                console.log(`delete bundle ${bundleId} from ${colName}`);
                collection.bundles.splice(i, 1);
                i--;
            }
        }
    }
    await collection.save();
    
}

async function _delete(id) {
    await Collection.findByIdAndRemove(id);
}