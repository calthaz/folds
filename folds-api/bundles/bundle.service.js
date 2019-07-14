//const config = require('config.json');
const db = require('_helpers/db');
const ImageBundle = db.ImageBundle;
const TextBundle = db.TextBundle;

module.exports = {
    //getAll,
    getByTypeAndId,
    create,
    update,
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

async function create(type, bundleParam) {
    //console.log(collectionParam);
    let bundle=null;
    if(type=="image"){
        bundle = new ImageBundle(bundleParam);
    }else if(type=="text"){
        bundle = new TextBundle(bundleParam);
    }
    // save collection
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

    // copy collectionParam properties to collection
    Object.assign(bundle, bundleParam);

    await bundle.save();
}

async function _delete(id) {
    await Collection.findByIdAndRemove(id);
}