const S = require('spray-wrtc');
const U = require('unicast-definition');

// #1 create 3 peers
const s1 = new S({config:{trickle:true}});
const s2 = new S({config:{trickle:true}});
const s3 = new S({config:{trickle:true}});
// #2 associate a unicast protocol to each peer
const u1 = new U(s1, {retry:1});
const u2 = new U(s2, {retry:1});
const u3 = new U(s3, {retry:1});
// #3 register 2 protocols per peer
const p1u1 = u1.register('1');
const p1u2 = u2.register('1');
const p1u3 = u3.register('1');

p1u1.on('meow',(i, am, a, cat) => console.log('@s1: %s %s %s %s', i, am, a, cat));
p1u2.on('meow',(i, am, a, cat) => console.log('@s2: %s %s %s %s', i, am, a, cat));
p1u3.on('meow',(i, am, a, cat) => console.log('@s3: %s %s %s %s', i, am, a, cat));

const p2u1 = u1.register('2');
const p2u2 = u2.register('2');
const p2u3 = u3.register('2');

p2u1.on(':3',(i, is, cat) => console.log('@s1: miaw', i, is, cat));
p2u2.on(':3',(i, is, cat) => console.log('@s2: meow', i, is, cat));
p2u3.on(':3',(i, is, cat) => console.log('@s3: miou', i, is, cat));

// #4 simulate signaling server
const callback = (from, to) => {
    return (offer) => {
        to.connect( (answer) => { from.connect(answer); }, offer);
    };
};

// #4 s1 contacts s2, 2-peers network
s1.join(callback(s1, s2)).then(console.log('s1 <=> s2.'));
// #5 s3 contacts s2, 3-peers network
setTimeout( () => s3.join(callback(s3, s2))
            .then(console.log('s1 <=> s2; s1 -> s3; s3 -> s2')),
            4000);
// #6 s2 should log 2 different messages.
setTimeout( () => p1u3.emit('meow',
                            s3.getPeers(1)[0], 'i', 'am', 'a', 'cat')
            .then(p1u3.emit(':3',
                            s3.getPeers(1)[0], 'parameters', 'dont', 'matter'))
            .then(p2u3.emit(':3',
                            s3.getPeers(1)[0], 'parameters', 'dont', 'matter')),
            6000);
