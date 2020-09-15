import {Deferred, DeferredState} from "../src";


describe('Deferred', () => {


    it('should have state "pending" initially', function () {
        let d = new Deferred();
        expect(d.state).toBe(DeferredState.PENDING);
    });

    it('should provide "promise"', function () {
        let d = new Deferred();
        expect(d.promise).toBeDefined();
    });

    it('should resolve() promise', function () {
        let d = new Deferred();
        d.resolve(true);
        return d.promise.then(value => {
            expect(value).toBeTrue()
        })
    });

    it('should reject() promise', function () {
        let d = new Deferred();
        d.reject(new Error("test"));
        return d.promise.then(() => {
            fail();
        }).catch(e => {
            expect(e instanceof Error);
            expect(e.message).toBe("test");
        });
    });

    it('should resolvePending() promise', function () {
        let d = new Deferred();
        d.resolvePending(true);
        return d.promise.then(value => {
            expect(value).toBeTrue()
        })
    });

    it('should rejectPending() promise', function () {
        let d = new Deferred();
        d.rejectPending(new Error("test"));
        return d.promise.then(() => {
            fail();
        }).catch(e => {
            expect(e instanceof Error);
            expect(e.message).toBe("test");
        });
    });

    it('should have state "resolved" after resolve()', function () {
        let d = new Deferred();
        d.resolve(true);
        expect(d.state).toBe(DeferredState.RESOLVED);
    });

    it('should have state "rejected" after reject()', function () {
        let d = new Deferred();
        d.reject(new Error());
        expect(d.state).toBe(DeferredState.REJECTED);

        return d.promise.catch(() => {
        }); // make sure our interpreter does not complain about uncaught rejection
    });

    it('should throw if resolve() resolved', function () {
        let d = new Deferred();
        d.resolve(true);
        expect(() => d.resolve(true)).toThrowError("cannot resolve resolved");
    });

    it('should throw if reject() rejected', function () {
        let d = new Deferred();
        d.reject(new Error());
        expect(() => d.reject(new Error())).toThrowError("cannot reject rejected");

        return d.promise.catch(() => {
        }); // make sure our interpreter does not complain about uncaught rejection
    });

    it('should have state "resolved" after resolvePending()', function () {
        let d = new Deferred();
        d.resolvePending(true);
        expect(d.state).toBe(DeferredState.RESOLVED);
    });

    it('should have state "rejected" after rejectPending()', function () {
        let d = new Deferred();
        d.rejectPending(new Error());
        expect(d.state).toBe(DeferredState.REJECTED);

        return d.promise.catch(() => {
        }); // make sure our interpreter does not complain about uncaught rejection
    });

    it('should *not* throw if resolvePending() resolved', function () {
        let d = new Deferred();
        d.resolve(true);
        d.resolvePending(true);
        expect(d.state).toBe(DeferredState.RESOLVED);
    });

    it('should *not* throw if resolvePending() rejected', function () {
        let d = new Deferred();
        d.reject(new Error());
        d.resolvePending(true);
        expect(d.state).toBe(DeferredState.REJECTED);

        return d.promise.catch(() => {
        }); // make sure our interpreter does not complain about uncaught rejection
    });

    it('should *not* throw if rejectPending() resolved', function () {
        let d = new Deferred();
        d.resolve(true);
        d.rejectPending(new Error());
        expect(d.state).toBe(DeferredState.RESOLVED);
    });

    it('should *not* throw if rejectPending() rejected', function () {
        let d = new Deferred();
        d.reject(new Error());
        d.rejectPending(new Error());
        expect(d.state).toBe(DeferredState.REJECTED);

        return d.promise.catch(() => {
        }); // make sure our interpreter does not complain about uncaught rejection
    });


});
