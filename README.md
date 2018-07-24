# unicast-definition [![Build Status](https://travis-ci.org/RAN3D/unicast-definition.svg?branch=master)](https://travis-ci.org/RAN3D/unicast-definition)

<i>Keywords: Unicast, browser-to-browser communication, WebRTC</i>

Unicast component relying on a [n2n component](https://github.com/ran3d/n2n-overlay-wrtc). Similarly to
[socket.io](https://socket.io), this module provides an event-like API to send
and receive messages.

## Installation

```bash
npm install unicast-definition
```

## API

The API is available [here](https://ran3d.github.io/unicast-definition/).

## Usage

```javascript
// require as you want the N2N module
const S = require('n2n-overlay-wrtc')
// require this module
const U = require('unicast-definition')

// #1 create 3 peers
const s1 = new S({peer: '1', config: {trickle: true}})
const s2 = new S({peer: '2', config: {trickle: true}})
const s3 = new S({peer: '3', config: {trickle: true}})
// #2 associate a unicast protocol to each peer
const u1 = new U(s1, {retry: 1, pid: 'com1'})
const u2 = new U(s2, {retry: 1, pid: 'com1'})
const u3 = new U(s3, {retry: 1, pid: 'com1'})

u1.on('meow', (from, i, am, a, cat) => console.log('@s1 from %s: %s %s %s %s', from, i, am, a, cat))
u2.on('meow', (from, i, am, a, cat) => console.log('@s2 from %s: %s %s %s %s', from, i, am, a, cat))
u3.on('meow', (from, i, am, a, cat) => console.log('@s3 from %s: %s %s %s %s', from, i, am, a, cat))

const u4 = new U(s1, {retry: 1, pid: 'com2'})
const u5 = new U(s2, {retry: 1, pid: 'com2'})
const u6 = new U(s3, {retry: 1, pid: 'com2'})

u4.on(':3', (from, i, is, cat) => console.log('@s1: miaw'))
u5.on(':3', (from, i, is, cat) => console.log('@s2: meow'))
u6.on(':3', (from, i, is, cat) => console.log('@s3: miou'))

// #4 simulate signaling server
const callback = (from, to) => {
  return (offer) => {
    to.connect((answer) => { from.connect(answer) }, offer)
  }
}

// #4 s1 contacts s2, 2-peers network
s1.connection(s2).then(() => {
  console.log('s1 <=> s2.')
  s3.connection(s2).then(() => {
    console.log('s1 <=> s2; s1 -> s3; s3 -> s2'))
    u3.emit('meow', s2.getOutviewId(), 'i', 'am', 'a', 'cat').then(() => {
      u3.emit(':3', s2.getOutviewId(), 'parameters', 'dont', 'matter')).then(() => {
        u6.emit(':3', s2.getOutviewId(), 'parameters', 'dont', 'matter')
      })
    })
  })
})
