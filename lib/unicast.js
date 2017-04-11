'use strict';

const MUnicast = require('./messages/municast.js');

/**
 * Unicast component that simply chooses a random peer from a peer-sampling
 * protocol and send a message.
 */
class Unicast {
    /**
     * @param {IPeerSamplingProtocol} psp The peer-sampling protocol.
     */
    constructor(psp) {
        this.psp = psp;
        this.protocols = new Map();        
    };

};

module.exports = Unicast;
