const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    markdown: { type: String, required: false },
    createdDate: { type: Date, required: true},
    owner: {type: String, required: true}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('textBundle', schema);