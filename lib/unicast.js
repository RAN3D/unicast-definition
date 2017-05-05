'use strict';

const debug = require('debug')('unicast-definition');
const _ = require('lodash');

const IUnicast = require('./interfaces/iunicast.js');

const ExProtocol = require('./exceptions/exprotocol.js');
const ExMessage = require('./exceptions/exmessage.js');

/**
 * Unicast component that simply chooses a random peer from a peer-sampling
 * protocol and send a message.
 */
class Unicast {
    /**
     * @param {IPSP} psp The peer-sampling protocol.
     * @param {object} [options] The options of this unicast.
     * @param {string} [options.uid = 'default-unicast'] The name of this
     * unicast.
     * @param {number} [option.retry = 0] The number of attempt to send a
     * message.
     */
    constructor(psp, options = {}) {        
        this.options = ( {retry: 0, uid: 'default-unicast'}, options);
        // #1 create the table of registered protocols
        this.psp = psp;
        this.protocols = new Map();
        // #2 overload the receipt of messages from the peer-sampling protocol
        // (TODO) maybe a cleaner way ? 
        let __receive = psp._receive;
        psp._receive = (peerId, message) => {
            try {
                __receive.call(psp, peerId, message);
            } catch (e) {
                if (message.type && message.type === 'MUnicast' &&
                    message.uid === this.options.uid) {
                    if (this.protocols.has(message.pid)){
                        this.protocols.get(message.pid)._receive(message);
                    } else {
                        throw new ExProtocol('_receive',
                                             message.pid,
                                             'does not exist');
                    };
                } else {
                    throw (e);
                };
            };
        };
        
        debug('just initialized on top of %s@%s.', this.psp.PID, this.psp.PEER);
    };


    /**
     * Registers the protocol that wishes to use this module.
     * @param {string} protocolId The identifier of the protocol that registers.
     * @returns {IUnicast} An interface providing easy-to-use event-like
     * functions to send and receive messages.
     */
    register(protocolId) {
        if (!this.protocols.has(protocolId)) {
            this.protocols.set(protocolId, new IUnicast(protocolId, this));
            debug('Protocol %s just registered.', protocolId);
            return this.protocols.get(protocolId);
        } else {
            throw new ExProtocol('register', protocolId, 'already exists');
        };
    };
    
    /**
     * Unregisters the protocol.
     * @param {string} protocolId The identifier of the protocol that
     * unregisters.
     */
    unregister(protocolId) {
        if (this.protocols.has(protocolId)){
            this.protocols.get(protocolId).destroy();
            this.protocols.delete(protocolId);
            debug('Protocol %s just unregistered.', protocolId);
        } else {
            throw new ExProtocol('unregister', protocolId, 'does not exist');
        };
    };
    
};

module.exports = Unicast;
