'use strict';

/**
 * Message that triggers an event remotely for the protocol.
 */
class MUnicast {
    /**
     * @param {string} unicastId The identifier of the unicast protocol.
     * @param {string} protocolId The identifier of the protocol that sent the
     * message and that will receive the message.
     * @param {string} eventName The name of the event to trigger.
     * @param {object[]} [args] The arguments of the event.
     */
    constructor(unicastId, protocolId, eventName, args){
        this.uid = unicastId;
        this.pid = protocolId;
        this.event = eventName;
        this.args = args;
        this.type = 'MUnicast';
    };
};

module.exports = MUnicast;
