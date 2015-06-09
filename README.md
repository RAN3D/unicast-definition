# UnicastDefinition

Unicast component on top of a communication overlay. It simply sends a message
to one peer in the neighborhood and possibly gets a response.

## Installation

```
$ npm install unicast-definition
```
or
```
$ bower install unicast-definition
```

## Usage

The module has been [browserified](http://browserify.org) and
[uglified](https://github.com/mishoo/UglifyJS). To include it within your
browser, put the following line in your html:
```html
  <script src='./build/unicast-definition.bundle.js'></script>
  <script src='./build/random-peer-sampling-example.bundle.js'></script>
```

In any case:
```javascript
  var Unicast = require('unicast-definition');
  var RandomPeerSampling = require('random-peer-sampling-example');

  // #1 initialize the protocols
  rps = new RandomPeerSampling(args1);
  unicast = new Unicast(rps, name);

  // #2 define the receive event
  unicast.on('receive', function(socket, unicastMessage){
    if (unicastMessage.example.ping){
      console.log('ping');
      socket.send(new MPongExample());
    } else {
      console.log('pong');
      socket.send(new MPingExample());
    };
  });

  // #3 send a message to a random peer in the neigbhborhood
  unicast.send(new MPingExample());
```
