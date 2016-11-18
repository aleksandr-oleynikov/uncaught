/**
 * @overview Node.js tests suites
 */

'use strict';

const childProcess = require('child_process');

describe('uncaught', function () {
    before(function () {
        this.processForUncaught = childProcess.fork(`${__dirname}/process-for-uncaught/index.js`);

        this.processForUncaught.send({command: 'start'});

        this.messageListener = message => {
            if (!this.checks || !this.done) {
                return;
            }

            this.checks(message.error);

            this.done();
        };

        this.processForUncaught.on('message', this.messageListener);
    });

    afterEach(function () {
        this.checks = null;
        this.done = null;
    });

    it('should catch synchronous errors as instances of class "Error"', function (done) {
        this.checks = error => {
            assert.strictEqual(error, 'synchronous-error-message');
        };

        this.done = done;

        const message = {
            command: 'throw',
            errorType: 'errorForWrapper',
            mustBeSynchronous: true,
            error: 'synchronous-error-message'
        };

        this.processForUncaught.send(message);
    });

    it('should catch synchronous custom errors', function (done) {
        this.checks = error => {
            assert.strictEqual(error, 'synchronous-custom-error-message');
        };

        this.done = done;

        const message = {
            command: 'throw',
            errorType: 'errorDirectly',
            mustBeSynchronous: true,
            error: 'synchronous-custom-error-message'
        };

        this.processForUncaught.send(message);
    });

    it('should catch asynchronous errors as instances of class "Error"', function (done) {
        this.checks = error => {
            assert.strictEqual(error, 'asynchronous-error-message');
        };

        this.done = done;

        const message = {
            command: 'throw',
            errorType: 'errorForWrapper',
            mustBeSynchronous: false,
            error: 'asynchronous-error-message'
        };

        this.processForUncaught.send(message);
    });

    it('should catch asynchronous custom errors', function (done) {
        this.checks = error => {
            assert.strictEqual(error, 'asynchronous-custom-error-message');
        };

        this.done = done;

        const message = {
            command: 'throw',
            errorType: 'errorDirectly',
            mustBeSynchronous: false,
            error: 'asynchronous-custom-error-message'
        };

        this.processForUncaught.send(message);
    });

    it('should catch promises rejections', function (done) {
        this.checks = error => {
            assert.strictEqual(error, 'reject-message');
        };

        this.done = done;

        const message = {
            command: 'throw',
            errorType: 'promise',
            mustBeSynchronous: true,
            error: 'reject-message'
        };

        this.processForUncaught.send(message);
    });

    it('should catch errors as boolean', function (done) {
        this.checks = error => {
            assert.strictEqual(error, true);
        };

        this.done = done;

        const message = {
            command: 'throw',
            errorType: 'errorDirectly',
            mustBeSynchronous: false,
            error: true
        };

        this.processForUncaught.send(message);
    });

    it('should catch errors as numbers', function (done) {
        this.checks = error => {
            assert.strictEqual(error, 4000);
        };

        this.done = done;

        const message = {
            command: 'throw',
            errorType: 'errorDirectly',
            mustBeSynchronous: false,
            error: 4000
        };

        this.processForUncaught.send(message);
    });

    it('should catch errors as objects', function (done) {
        this.checks = error => {
            assert.deepEqual(error, {description: {type: 'fatal', message: 'error-message'}});
        };

        this.done = done;

        const message = {
            command: 'throw',
            errorType: 'errorDirectly',
            mustBeSynchronous: false,
            error: {description: {type: 'fatal', message: 'error-message'}}
        };

        this.processForUncaught.send(message);
    });
});
