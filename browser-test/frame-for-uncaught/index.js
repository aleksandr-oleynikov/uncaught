/**
 * @overview
 * Script for test frame,
 * which is listening throw errors requests from main frame and
 * sends back uncaught module results.
 */

'use strict';

window.uncaughtStart = uncaught.start;

window.addEventListener('message', event => {
    uncaught.removeAllListeners();

    const origin = event.origin || event.originalEvent.origin;

    if (origin !== 'http://localhost:9876')
        return;

    const errorType = event.data.errorType;

    let handler;
    let thrower;

    switch (errorType) {
        case 'errorDirectly':
            handler = error => {
                event.source.postMessage(error, 'http://localhost:9876');
            };
            thrower = () => {
                throw event.data.error;
            };
            break;
        case 'errorForWrapper':
            handler = error => {
                event.source.postMessage(error.message, 'http://localhost:9876');
            };
            thrower = () => {
                throw new Error(event.data.error);
            };
            break;
        case 'promise':
            handler = error => {
                event.source.postMessage(error, 'http://localhost:9876');
            };
            thrower = () => {
                Promise.reject(event.data.error);
            };
            break;
    }

    uncaught.addListener(handler);

    const synchronous = event.data.mustBeSynchronous;

    if (synchronous) {
        thrower();
    } else {
        setTimeout(thrower, 0);
    }
});
