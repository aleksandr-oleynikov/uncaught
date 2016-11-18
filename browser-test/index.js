/**
 * @overview Browser tests suites
 */

'use strict';

describe('uncaught', function () {
    before(function (done) {
        const testFrame = document.createElement('iframe');
        testFrame.id = 'test';
        testFrame.src = 'base/browser-test/frame-for-uncaught/index.html';
        testFrame.style = 'display: none';
        document.body.appendChild(testFrame);

        testFrame.addEventListener('load', () => {
            this.frameWindow = document.getElementById('test').contentWindow;
            this.frameWindow.uncaughtStart();
            this.messageListener = event => {
                if (!this.checks || !this.done) {
                    return;
                }

                const origin = event.origin || event.originalEvent.origin;

                if (origin !== 'http://localhost:9876') {
                    return;
                }

                this.checks(event.data);

                this.done();
            };

            window.addEventListener('message', this.messageListener);

            done();
        });
    });

    afterEach(function () {
        this.checks = null;
        this.done = null;
    });

    it('should catch synchronous errors as instances of class "Error"', function (done) {
        this.checks = data => {
            assert.strictEqual(data, 'synchronous-error-message');
        };

        this.done = done;

        const errorSettings = {
            errorType: 'errorForWrapper',
            mustBeSynchronous: true,
            error: 'synchronous-error-message'
        };

        this.frameWindow.postMessage(errorSettings, 'http://localhost:9876');
    });

    it('should catch synchronous custom errors', function (done) {
        this.checks = data => {
            assert.strictEqual(data, 'synchronous-custom-error-message');
        };

        this.done = done;

        const errorSettings = {
            errorType: 'errorDirectly',
            mustBeSynchronous: true,
            error: 'synchronous-custom-error-message'
        };

        this.frameWindow.postMessage(errorSettings, 'http://localhost:9876');
    });

    it('should catch asynchronous errors as instances of class "Error"', function (done) {
        this.checks = data => {
            assert.strictEqual(data, 'asynchronous-error-message');
        };

        this.done = done;

        const errorSettings = {
            errorType: 'errorForWrapper',
            mustBeSynchronous: false,
            error: 'asynchronous-error-message'
        };

        this.frameWindow.postMessage(errorSettings, 'http://localhost:9876');
    });

    it('should catch asynchronous custom errors', function (done) {
        this.checks = data => {
            assert.strictEqual(data, 'asynchronous-custom-error-message');
        };

        this.done = done;

        const errorSettings = {
            errorType: 'errorDirectly',
            mustBeSynchronous: false,
            error: 'asynchronous-custom-error-message'
        };

        this.frameWindow.postMessage(errorSettings, 'http://localhost:9876');
    });

    it('should catch promises rejections', function (done) {
        this.checks = data => {
            assert.strictEqual(data, 'reject-message');
        };

        this.done = done;

        const errorSettings = {
            errorType: 'promise',
            mustBeSynchronous: true,
            error: 'reject-message'
        };

        this.frameWindow.postMessage(errorSettings, 'http://localhost:9876');
    });

    it('should catch errors as boolean', function (done) {
        this.checks = data => {
            assert.strictEqual(data, true);
        };

        this.done = done;

        const errorSettings = {
            errorType: 'errorDirectly',
            mustBeSynchronous: false,
            error: true
        };

        this.frameWindow.postMessage(errorSettings, 'http://localhost:9876');
    });

    it('should catch errors as numbers', function (done) {
        this.checks = data => {
            assert.strictEqual(data, 4000);
        };

        this.done = done;

        const errorSettings = {
            errorType: 'errorDirectly',
            mustBeSynchronous: false,
            error: 4000
        };

        this.frameWindow.postMessage(errorSettings, 'http://localhost:9876');
    });

    it('should catch errors as objects', function (done) {
        this.checks = data => {
            assert.deepEqual(data, {description: {type: 'fatal', message: 'error-message'}});
        };

        this.done = done;

        const errorSettings = {
            errorType: 'errorDirectly',
            mustBeSynchronous: false,
            error: {description: {type: 'fatal', message: 'error-message'}}
        };

        this.frameWindow.postMessage(errorSettings, 'http://localhost:9876');
    });
});
