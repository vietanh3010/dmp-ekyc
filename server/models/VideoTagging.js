const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  //https://www.npmjs.com/package/bcryptjs
const Schema = mongoose.Schema;

const VideoTaggingSchema = new Schema({
    url_video: {type: String},
    is_real: {type: Boolean},
    type_fake: {type: Number},
    is_processed: {type: Boolean},
    is_processing: {type: Boolean},
    user_id: {type: String},
    created_time: {type: Date},
    updated_time: {type: Date},
});

VideoTaggingManagement = mongoose.model('video_taggings', VideoTaggingSchema);
module.exports = VideoTaggingManagement;

