/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Notification = mongoose.model('Notification');

module.exports = function(socketIo) {
    // open socket connection on this server
    socketIo.on('connection', function(socket) {
        var intervalIndex = 1,
            notificationInterval = setInterval(function() {
                // genrate notification on every 1 minuts
                (function(index) {
                    var body = {
                        name: 'satyam dev ' + index,
                        image: './img/satyam.jpg',
                        message: 'sent you dummy notification ' + index
                    }
                    Notification(body).save(function(err, data, count) {
                        if (!err) {
                            socket.emit('notificationCreated', data);
                        } else {
                            console.log(err);
                        }
                    });
                })(intervalIndex);
                intervalIndex++;
            }, 10000);

        socket.on('disconnect', function() {
            clearInterval(notificationInterval);
        });
    });

}
