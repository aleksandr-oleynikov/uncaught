/**
 * @overview Module for handle uncaught errors and promises rejections
 */

'use strict';

/**
 * Defines execution environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Listeners list, which are registered for uncaught errors and promises rejections
 */
const listeners = [];

/**
 * Sign of module own handlers registration
 */
let handlersAreRegistered = false;

/**
 * Sign of module own handlers working status
 */
let handlersAreTurnedOn = false;

module.exports = {

    /**
     * Starts handling for uncaught errors and promises rejections
     */
    start() {
        if (handlersAreTurnedOn) {
            return;
        }

        if (!handlersAreRegistered) {
            if (isBrowser) {
                // Listen to uncaught errors
                window.addEventListener('error', browserErrorHandler);
                // Listen to uncaught promises rejections
                window.addEventListener('unhandledrejection', browserRejectionHandler);
            } else {
                process.on('uncaughtException', nodeErrorHandler);
                process.on('unhandledRejection', nodeRejectionHandler);
            }

            handlersAreRegistered = true;
        }

        handlersAreTurnedOn = true;
    },

    /**
     * Stops handling
     */
    stop() {
        if (!handlersAreTurnedOn) {
            return;
        }

        if (isBrowser) {
            window.removeEventListener('error', browserErrorHandler);
            window.removeEventListener('unhandledrejection', browserRejectionHandler);

            handlersAreRegistered = false;
        }

        handlersAreTurnedOn = false;
    },

    /**
     * Adds listener to list
     * @param {Function} listener
     */
    addListener(listener) {
        if (typeof listener === 'function') {
            listeners.push(listener);
        }
    },

    /**
     * Removes listener from list
     * @param {Function} listener
     */
    removeListener(listener) {
        const index = listeners.indexOf(listener);

        if (index > -1) {
            listeners.splice(index, 1);
        }
    },

    /**
     * Removes all listeners
     */
    removeAllListeners() {
        listeners.length = 0;
    },

    /**
     * Flushes module: stops handling and removes all listeners
     */
    flush() {
        this.removeAllListeners();
        this.stop();
    }
};

/**
 * Handler for browser uncaught errors
 * @param {Object} event
 */
function browserErrorHandler(event) {
    const error = event ? event.error : undefined;
    callListeners(error, event);
}

/**
 * Handler for browser uncaught promises rejections
 * @param {Object} event
 */
function browserRejectionHandler(event) {
    const error = event ? event.reason : undefined;
    callListeners(error, event);
}

/**
 * Handler for Node.js uncaught errors
 * @param {Object} error
 */
function nodeErrorHandler(error) {
    if (handlersAreTurnedOn) {
        callListeners(error, null);
    }
}

/**
 * Handler for Node.js uncaught promises rejections
 * @param {Object} reason
 */
function nodeRejectionHandler(reason) {
    if (handlersAreTurnedOn) {
        callListeners(reason, null);
    }
}

/**
 * Send error data to all listeners
 * @param {Object} error
 * @param {Object} event
 */
function callListeners(error, event) {
    listeners.forEach(function (listener) {
        listener(error, event);
    });
}
