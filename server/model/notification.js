/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NotificationSchema = new Schema({
    name: {
        type: String,
        required: 'Name is required!'
    },
    message: {
        type: String,
        required: 'Message code is required!'
    },
    image: {
        type: String
    },
    unread: {
        type: Boolean,
        default: true
    },
    createdDate: {
        type: Date,
        default: new Date()
    }
});
mongoose.model('Notification', NotificationSchema);
