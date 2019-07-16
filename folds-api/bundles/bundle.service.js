//const config = require('config.json');
const db = require('_helpers/db');
const ImageBundle = db.ImageBundle;
const TextBundle = db.TextBundle;
const fileHelper = require('../_helpers/file-helper');
const path = require('path');

module.exports = {
    //getAll,
    getByTypeAndId,
    create,
    update,
    getImageOwnerOf,
    delete: _delete
};

async function getAll() {
    return await Collection.find();
}

async function getByTypeAndId(type, id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        if(type=="image"){
            return await ImageBundle.findById(id);
        }else if(type=="text"){
            return await TextBundle.findById(id);
        }else{
            return null;
        }
    }else{
        return null;
    }
}

async function getImageOwnerOf(id){
    const bundle = await ImageBundle.findById(id);

    // validate
    if (!bundle) throw 'Bundle not found';

    return bundle.owner;
}

async function create(type, bundleParam) {
    //console.log(collectionParam);
    let bundle=null;
    if(type=="image"){
        bundle = new ImageBundle(bundleParam);
    }else if(type=="text"){
        bundle = new TextBundle(bundleParam);
    }
    // save bundle
    await bundle.save();

    return bundle;
}

async function update(type, id, bundleParam) {
    let bundle=null;
    if(type=="image"){
        bundle = await ImageBundle.findById(id);
    }else if(type=="text"){
        bundle = await TextBundle.findById(id);
    }
    // validate
    if (!bundle) throw 'Bundle not found';

    console.log(bundleParam.image + " | " + bundle.image);
    if(bundleParam.image && (bundle.image !== bundleParam.image)){
        if(bundle.image.indexOf('default')==-1){
            console.log("delete previous file "+bundle.image);
            await fileHelper.unlinkFile(path.join(__dirname, '../public', bundle.image))
            .catch(err=> {throw err});
        }
    }

    // copy collectionParam properties to bundle
    Object.assign(bundle, bundleParam);

    await bundle.save();
}

async function _delete(type, id) {
    if(type=="image"){
        await ImageBundle.findByIdAndRemove(id); 
    }else if(type=="text"){
        //console.log(id);
        await TextBundle.findByIdAndRemove(id); 
    }
}