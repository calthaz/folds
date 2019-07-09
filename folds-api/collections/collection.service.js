const config = require('config.json');
const db = require('_helpers/db');
const Collection = db.Collection;

module.exports = {
    getAll,
    getById,
    getByName,
    getByUserAndName,
    create,
    update,
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

async function create(collectionParam) {
    //console.log(collectionParam);
    const collection = new Collection(collectionParam);

    // save collection
    await collection.save();
}

async function update(id, collectionParam) {
    const collection = await Collection.findById(id);

    // validate
    if (!collection) throw 'collection not found';

    // copy collectionParam properties to collection
    Object.assign(collection, collectionParam);

    await collection.save();
}

async function _delete(id) {
    await Collection.findByIdAndRemove(id);
}