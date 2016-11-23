# uncaught [![Build Status](https://travis-ci.org/aleksandr-oleynikov/uncaught.svg?branch=master)](https://travis-ci.org/aleksandr-oleynikov/uncaught) [![npm version](https://badge.fury.io/js/uncaught.svg)](https://badge.fury.io/js/uncaught)

`uncaught` is the module, which allows you to handle all uncaught errors and promise rejections through only one interface.

# How it works

`uncaught` listens for global object errors and unhandled rejections events:

- For browser these are [error](https://developer.mozilla.org/en-US/docs/Web/Events/error) and [unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection).

- And for Node.js these are [uncaughtException](https://nodejs.org/api/process.html#process_event_uncaughtexception) and [unhandledRejection](https://nodejs.org/api/process.html#process_event_unhandledrejection).

After one of these events fires, the module transfers `error` (and also `event` for browser mode) object(s) to all registered listeners functions.
 
# Browser support

#### Global error

- Google Chrome 30+
- Edge (All versions)
- Internet Explorer 11
- Firefox 33+
- Opera 41+
- Safari 10+
- Yandex.Browser 16+
- Android 4.4+
- iOS 10.0+

#### Global unhandled rejection

- Google Chrome 49+
- Opera 41+
- Yandex.Browser 16+

# Node.js support

- Event `uncaughtException` added in v0.1.18.
- Event `unhandledRejection` added in v1.4.1.

# Install

```
$ npm install --save uncaught
```

# Usage examples

#### Browser

```html
<body>
    ...
    <script src="path_to_your_project_dir/node_modules/uncaught/lib/index.js"></script>
    <script>
        uncaught.start();
        uncaught.addListener(function (error) {
            console.log('Uncaught error or rejection: ', error.message);
        });
    </script>
    ...
</body>
```

#### Browser + webpack
 
```js
var uncaught = require('uncaught');

uncaught.start();
uncaught.addListener(function (error) {
    console.log('Uncaught error or rejection: ', error.message);
});
```

#### Node.js

```js
var uncaught = require('uncaught');

uncaught.start();
uncaught.addListener(function (error) {
    console.log('Uncaught error or rejection: ', error.message);
});
```

# API

List of methods for module management:

- `start`
Starts handling of uncaught errors and promise rejection.

- `stop`
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
