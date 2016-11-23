# uncaught [![Build Status](https://travis-ci.org/aleksandr-oleynikov/uncaught.svg?branch=master)](https://travis-ci.org/aleksandr-oleynikov/uncaught) [![npm version](https://badge.fury.io/js/uncaught.svg)](https://badge.fury.io/js/uncaught)

`uncaught` is the module, which allows you to handle all uncaught errors and promise rejections through only one interface.

# How it works

`uncaught` listens for global object errors and unhandled rejections events:

- For browser these are [error](https://developer.mozilla.org/en-US/docs/Web/Events/error) and [unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection).

- And for Node.js these are [uncaughtException](https://nodejs.org/api/process.html#process_event_uncaughtexception) and [unhandledRejection](https://nodejs.org/api/process.html#process_event_unhandledrejection).

After one of these events fires, the module transfers `error` (and also `event` for browser mode) object(s) to all registered listeners functions.
 
So be sure, that above events are supported by your environment.
 
# Install

```
$ npm install --save uncaught
```

# Usage examples

#### Browser environment, injected script

```html
<body>
    ...
    <script src="path_to_your_project_dir/node_modules/uncaught/lib/index.js"></script>
    <script>
        uncaught.start();
        uncaught.addListener(uncaughtErrorHandler);

        function uncaughtErrorHandler(error, event) {
            if (event instanceof ErrorEvent) {
                console.log('MY Uncaught error: ', error);
            } else {
                console.log('MY Uncaught promise rejection: ', error);
            }
        }
    </script>
    ...
</body>
```

#### Browser environment, module for webpack bundling

```js
var uncaught = require('uncaught');

uncaught.start();
uncaught.addListener(uncaughtErrorHandler);

function uncaughtErrorHandler(error, event) {
    if (event instanceof ErrorEvent) {
        console.log('Uncaught error: ', error);
    } else {
        console.log('Uncaught promise rejection: ', error);
    }
}
```

#### Node.js environment

```js
var uncaught = require('uncaught');

uncaught.start();
uncaught.addListener(uncaughtErrorHandler);

function uncaughtErrorHandler(error) {
    console.log('Uncaught error: ', error);
}
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

# Used events support

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

# License

MIT © https://github.com/aleksandr-oleynikov
