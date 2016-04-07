var EventEmitter = require('events').EventEmitter;
var util = require('util');

var MUnicast = require('./messages').MUnicast;

util.inherits(Unicast, EventEmitter);

/*!
 * Unicast component that simply chose a random peer and send a message
 * \param source the protocol receiving the messages
 * \param name the name of the protocol, default is 'unicast'
 */
function Unicast(source, max, name) {
    EventEmitter.call(this);
    this.name = name || 'unicast';    
    this.source = source;
    var self = this;
    this.source.on(self.name+'-receive', function(socket, message){
        self.emit('receive', socket, message.payload);
    });    
};

/*!
 * \brief send the message to one random participant
 * \param message the message to send
 * \param id optionnal identifier of the channel to use for sending the msg
 * \param return true if it seems to have sent the message, false otherwise.
 */
Unicast.prototype.send = function(message, id){
    // #1 get the neighborhood and create the message
    var links = {o:[id], i:[]} || this.source.getPeers(1);
    var link;
    var mUnicast = new MUnicast(this.name, message);

    // #2 send the message
    if (links.o.length === 0 && links.i.length ===0){return false;};
    if (links.o.length > 0) {
        link = links.o[0];
    } else {
        link = links.i[0];
    };
    return this.source.send(link, mUnicast);
};

module.exports = Unicast;
