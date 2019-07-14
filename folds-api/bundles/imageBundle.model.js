const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    media: { type: String, required: false },
    image: { type: String, required: true, default: '/default.jpg' },
    story: { type: String, required: false },
    createdDate: { type: Date, required: true},
    owner: {type: String, required: true}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('imageBundle', schema);