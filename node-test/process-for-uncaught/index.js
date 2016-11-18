/**
 * @overview
 * Node.js script for test child process,
 * which is listening throw errors requests from main frame and
 * sends back uncaught module results.
 */

'use strict';

const uncaught = require('../../lib');

process.on('message', message => {
    switch (message.command) {
        case 'start':
            uncaught.start();
            break;
        case 'throw':
            throwError(message.errorType, message.error, message.mustBeSynchronous);
            break;
    }
});

function throwError(errorType, error, mustBeSynchronous) {
    uncaught.removeAllListeners();

    let handler;
    let thrower;

    switch (errorType) {
        case 'errorDirectly':
            handler = error => {
                process.send({error: error});
            };
            thrower = () => {
                throw error;
            };
            break;
        case 'errorForWrapper':
            handler = error => {
                process.send({error: error.message});
            };
            thrower = () => {
                throw new Error(error);
            };
            break;
        case 'promise':
            handler = error => {
                process.send({error: error});
            };
            thrower = () => {
                Promise.reject(error);
            };
            break;
    }

    uncaught.addListener(handler);

    if (mustBeSynchronous) {
        thrower();
    } else {
        setTimeout(thrower, 0);
    }
}
