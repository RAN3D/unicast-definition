'use strict';

const EventEmitter = require('events');

const MUnicast = require('../messages/municast.js');

/**
 * An interface providing easy-to-use event-like functions on top of a
 * peer-sampling protocol. As soon as protocols register, they get an
 * interface. They can send messages using unicast.emit('eventName', neighborId,
 * args) and the neighbor can catch them using unicast.on('eventName', args).
 */
class IUnicast extends EventEmitter {
    /**
     * @param {string} protocolId The identifier of the protocol that request
     * the interface.
     * @param {Unicast} parent The instanciator.
     */
    constructor (protocolId, parent) {
        super();      
        // #1 replace the basic behavior of eventemitter.emit
        this._emit = this.emit;
        /**
         * Send a message using the emit function.
         * @param {string} event The event name.
         * @param {string} peerId The identifier of the peer to send the event
         * to.
         * @param {object[]} [args] The arguments of the event.
         * @returns {Promise} Resolved if the message seems to have been sent,
         * rejected otherwise (e.g. timeout, unkown peers).
         */
        this.emit = (event, peerId, ...args) => {
            return parent.psp.send(peerId,
                                   new MUnicast(parent.options.uid,
                                                protocolId, event, args),
                                   parent.options.retry);
        };
    };

    /**
     * @private Destroy all listeners and remove the send capabilities
     */
    _destroy () {
        this.removeAllListener();
        this.emit = this._emit; // retrieve basic behavior
    };
    
    /**
     * @private Receiving an MUnicast message triggers an event
     * @param {MUnicast} message The message received.
     */
    _receive (message) {
        this._emit(message.event, ...(message.args));
    };

};

module.exports = IUnicast;
