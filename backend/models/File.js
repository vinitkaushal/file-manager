const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: String,
    size: Number,
    path: String,
    isParentFile: { type: Boolean, default: false },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
}, {
    timestamps: true
});

module.exports = mongoose.model('File', fileSchema);
