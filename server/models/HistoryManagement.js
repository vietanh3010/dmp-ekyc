const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    id: {type: String},
    name: {type: String},
    time: {type: Date},
    department: {type: String},
    image_link: {type: String},
    similarity: {type: Number},
    status: {type: String},
    updated_time: {type: String}
});

HistoryManagement = mongoose.model('history_results', HistorySchema);
module.exports = HistoryManagement;

