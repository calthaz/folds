const config = require('config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    Collection: require('../collections/collection.model'),
    ImageBundle: require('../bundles/imageBundle.model'),
    TextBundle: require('../bundles/textBundle.model'),
};