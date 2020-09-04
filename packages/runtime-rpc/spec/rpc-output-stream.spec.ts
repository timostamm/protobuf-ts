import {RpcOutputStream, RpcOutputStreamController} from "../src";

type TestItem = { id: string };

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


describe('RpcOutputStreamController', function () {

    let ctrl: RpcOutputStreamController<TestItem>;

    beforeEach(function () {
        ctrl = new RpcOutputStreamController<TestItem>();
    });

    it('should throw when notifyComplete() twice', function () {
        ctrl.notifyComplete();
        try {
            ctrl.notifyComplete();
            fail('missing expected error');
        } catch (e) {
            expect(e.message).toBe('stream is already closed')
        }
    });

    it('should throw when notifyError() twice', function () {
        ctrl.notifyComplete();
        try {
            ctrl.notifyError(new Error('testing'));
            fail('missing expected error');
        } catch (e) {
            expect(e.message).toBe('stream is already closed')
        }
    });

    it('should throw when closed and notifyMessage()', function () {
        ctrl.notifyComplete();
        try {
            ctrl.notifyMessage({id: "foo"});
            fail('missing expected error');
        } catch (e) {
            expect(e.message).toBe('stream is already closed')
        }
    });

});


describe('RpcOutputStream', function () {


    describe('event handling', function () {

        let stream: RpcOutputStream<TestItem>;

        beforeEach(function () {
            let ctrl = new RpcOutputStreamController<TestItem>();
            stream = ctrl;
            (async function f() {
                await delay(1);
                ctrl.notifyMessage({id: "one"});
                await delay(1);
                ctrl.notifyMessage({id: "two"});
                await delay(1);
                ctrl.notifyMessage({id: "three"});
                await delay(1);
                ctrl.notifyComplete();
            })();
        });

        it('should allow to remove a listener', function (done) {
            let unsub = stream.onMessage(() => fail());
            unsub();
            stream.onComplete(() => done());
        });

    });

    describe('that is going to emit 3 messages', function () {

        let stream: RpcOutputStream<TestItem>;

        beforeEach(function () {
            let ctrl = new RpcOutputStreamController<TestItem>();
            stream = ctrl;
            (async function f() {
                await delay(1);
                ctrl.notifyMessage({id: "one"});
                await delay(1);
                ctrl.notifyMessage({id: "two"});
                await delay(1);
                ctrl.notifyMessage({id: "three"});
                await delay(1);
                ctrl.notifyComplete();
            })();
        });

        it('should invoke onMessage callback 3 times, then onComplete callback', function (done) {
            let callCount = 0;
            stream.onMessage(() => callCount++);
            stream.onComplete(() => {
                expect(callCount).toBe(3);
                done();
            });
        });

        it('should invoke onMessage callback 3 times', function (done) {
            let count = 0;
            stream.onMessage(() => count++);
            stream.onComplete(() => {
                expect(count).toBe(3);
                done();
            });
        }, 500);

        it('should invoke onNext callback 4 times', function (doneFn) {
            let count = 0;
            stream.onNext((message, error, done) => {
                count++;
                if (done) {
                    expect(count).toBe(4);
                    doneFn();
                }
            });
        }, 500);

        it('should invoke onNext with "done" = true once', function (doneFn) {
            let count = 0;
            stream.onNext((message, error, done) => {
                if (done) {
                    count++;
                    expect(count).toBe(1);
                    doneFn();
                }
            });
        }, 500);

        it('should invoke onNext with defined "message" 3 times', function (doneFn) {
            let count = 0;
            stream.onNext((message, error, done) => {
                if (message)
                    count++;
            });
            stream.onComplete(() => {
                expect(count).toBe(3);
                doneFn();
            });
        }, 500);

        it('should async iterate 3 items', async function () {
            let count = 0;
            for await (let item of stream) {
                count++;
                expect(count).toBeLessThanOrEqual(3);
            }
            expect(count).toBe(3);
        });

        it('should have empty async iterator after iteration', async function () {
            let firstCount = 0;
            for await (let item of stream) {
                firstCount++;
                expect(firstCount).toBeLessThanOrEqual(3);
            }
            for await (let item of stream) {
                fail();
            }
        });

    });


    describe('that errors after 1 message', function () {

        let stream: RpcOutputStream<TestItem>;

        beforeEach(function () {
            let ctrl = new RpcOutputStreamController<TestItem>();
            stream = ctrl;
            (async function f() {
                await delay(1);
                ctrl.notifyMessage({id: "one"});
                await delay(1);
                ctrl.notifyError(new Error('testing'));
            })();
        });

        it('should async iterate 1 message', async function () {
            let count = 0;
            try {
                for await (let item of stream) {
                    count++;
                }
            } catch (e) {
                //
            }
            expect(count).toBe(1)
        });

        it('should async iterate reject', async function () {
            try {
                for await (let item of stream) {
                    //
                }
                fail('missing expected error');
            } catch (e) {
                expect(e.message).toBe('testing')
            }
        });


        it('should invoke onError callback', function (done) {
            let count = 0;
            stream.onError(reason => {
                count++;
                expect(reason.message).toBe('testing');
                done();
            });
        }, 500);


        it('should not invoke onComplete callback', function (done) {
            stream.onComplete(() => fail());
            stream.onError(() => done());
        }, 500);


    });


    describe('that is already completed', function () {

        let stream: RpcOutputStream<TestItem>;
        beforeEach(function () {
            let ctrl = new RpcOutputStreamController<TestItem>();
            stream = ctrl;
            ctrl.notifyComplete();
        });

        it('should have an empty async iterator', async function () {
            let numItemsIterated = 0;
            for await (let item of stream) {
                numItemsIterated++;
            }
            expect(numItemsIterated).toBe(0);
        }, 10);

    });


    describe('that is already errored', function () {

        let stream: RpcOutputStream<TestItem>;
        beforeEach(function () {
            let ctrl = new RpcOutputStreamController<TestItem>();
            stream = ctrl;
            ctrl.notifyError(new Error('testing'));
        });

        it('should reject async iteration', async function () {
            try {
                for await (let item of stream) {
                    fail('missing expected error');
                }
            } catch (e) {
                expect(e.message).toBe('testing')
            }
        });

    });


});
