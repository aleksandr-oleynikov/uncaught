# uncaught [![Build Status](https://travis-ci.org/aleksandr-oleynikov/uncaught.svg?branch=master)](https://travis-ci.org/aleksandr-oleynikov/uncaught)

`uncaught` is the module, which allows you to handle all uncaught errors and promise rejections through only one interface.

# How it works
// todo: split on two sections Node / Browser  
`uncaught` listens for window [error](https://developer.mozilla.org/en-US/docs/Web/Events/error) and [unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection) events if it is working in browser.
Or for similar Node.JS [uncaughtException](https://nodejs.org/api/process.html#process_event_uncaughtexception) and [unhandledRejection](https://nodejs.org/api/process.html#process_event_unhandledrejection) events.

After one of these events fires, the module transfers `error` (and `event` for browser mode) object(s) to all registered listeners functions.
 
So be sure, that above events are supported by your environment.
 
# Install

```
$ npm install --save uncaught
```

# Usage

#### Browser
// todo: add script tag example

```
var uncaught = require('uncaught');

uncaught.listen();
uncaught.addListener(uncaughtErrorHandler);

function uncaughtErrorHandler(error, event) {
    if (event instanceof ErrorEvent) {
        console.log('Uncaught error: ', error);
    } else {
        console.log('Uncaught promise rejection: ', error);
    }
}
```

#### Node.js

```
var uncaught = require('uncaught');

uncaught.listen();
uncaught.addListener(uncaughtErrorHandler);

function uncaughtErrorHandler(error) {
    console.log('Uncaught error: ', error);
}
```

# API

List of methods for module management:

- `listen`
Starts handling of uncaught errors and promise rejection.

- `stopListen`
Stops handling.

- `addListener`
Adds listener function to list. This function is called with uncaught error or promise rejection information:

    - `error` object.

    - In browser mode `event` object is sent as well.


- `removeListener`
Removes listener function from list.

- `removeAllListeners`
Removes all listeners functions.

- `flush`
Flushes the module: removes all listeners functions and stops handling of uncaught errors and promise rejections.

# License

MIT © https://github.com/aleksandr-oleynikov
