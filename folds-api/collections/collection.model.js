const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true },
    intro: { type: String, required: false },
    bg: { type: String, required: true, default: '/default-bg.jpg' },
    visible: {type: Boolean, default: true},
    owner: {type: String, required: true},
    bundles: {type: Array, required: false},
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Collection', schema);