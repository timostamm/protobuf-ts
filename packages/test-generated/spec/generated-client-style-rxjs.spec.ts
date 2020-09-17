import {RpcError, TestTransport} from "@protobuf-ts/runtime-rpc";
import {Int32Value, StringValue} from "../ts-out/google/protobuf/wrappers";
import {catchError, tap} from "rxjs/operators";
import {AbortController} from "abort-controller";
import {RxjsStyleServiceClient} from "../ts-out/service-style-rxjs";
import {EMPTY} from "rxjs";

globalThis.AbortController = AbortController; // AbortController polyfill via https://github.com/mysticatea/abort-controller


describe('generated client style rx', () => {


    describe("unary", function () {

        it('should return message observable', async function () {
            const client = new RxjsStyleServiceClient(new TestTransport({
                response: {value: 123}
            }));
            const msg: Int32Value[] = [];
            await client.unary(StringValue.create())
                .pipe(
                    tap(x => msg.push(x)),
                )
                .toPromise();
            expect(msg).toEqual([{value: 123}]);
        });

        it('should reject on response error', async function () {
            const client = new RxjsStyleServiceClient(new TestTransport({
                response: new RpcError("response err", "ERR"),
            }));
            await expectAsync(
                client.unary(StringValue.create()).toPromise()
            ).toBeRejectedWithError("response err")
        });

        it('should reject on status error', async function () {
            const client = new RxjsStyleServiceClient(new TestTransport({
                status: new RpcError("status err", "ERR"),
            }));
            await expectAsync(
                client.unary(StringValue.create()).toPromise()
            ).toBeRejectedWithError("status err")
        });

        it('should complete empty if aborted', async function () {
            const client = new RxjsStyleServiceClient(new TestTransport());
            const abort = new AbortController();
            setTimeout(() => {
                abort.abort();
            }, 1)
            const msg: Int32Value[] = [];
            await client.unary(StringValue.create(), {abort: abort.signal})
                .pipe(
                    tap(x => msg.push(x)),
                )
                .toPromise();
            expect(msg.length).toBe(0);
        });

        it('should cancel on unsubscribe', async function () {
            const client = new RxjsStyleServiceClient(new TestTransport());
            const msg: Int32Value[] = [];
            let err: any = undefined;
            const sub = client.unary(StringValue.create())
                .subscribe(
                    value => msg.push(value),
                    error => err = error,
                );
            await new Promise(resolve => setTimeout(resolve, 1));
            sub.unsubscribe();
            await new Promise(resolve => setTimeout(resolve, 100));
            expect(err).toBeUndefined();
            expect(msg.length).toBe(0);
        });

    });


    describe("server-streaming", function () {

        it('should return message observable', async function () {
            const client = new RxjsStyleServiceClient(new TestTransport({
                response: [
                    {value: 1},
                    {value: 2},
                    {value: 3},
                ]
            }));
            const msg: Int32Value[] = [];
            await client.serverStream(StringValue.create())
                .pipe(
                    tap(x => msg.push(x)),
                )
                .toPromise();
            expect(msg).toEqual([
                {value: 1},
                {value: 2},
                {value: 3},
            ]);
        });

        it('should reject on response error', async function () {
            const client = new RxjsStyleServiceClient(new TestTransport({
                response: new RpcError("response err", "ERR"),
            }));
            const msg: Int32Value[] = [];
            let err: any = undefined;
            await client.serverStream(StringValue.create())
                .pipe(
                    tap(x => msg.push(x), e => err = e),
                    catchError(() => EMPTY),
                )
                .toPromise();
            expect(err).toBeInstanceOf(RpcError);
            expect(err.message).toBe("response err");
            expect(msg).toEqual([]);
        });

        it('should reject on status error', async function () {
            const client = new RxjsStyleServiceClient(new TestTransport({
                status: new RpcError("status err", "ERR"),
                response: [
                    {value: 1},
                    {value: 2},
                    {value: 3},
                ]
            }));
            const msg: Int32Value[] = [];
            let err: any = undefined;
            await client.serverStream(StringValue.create())
                .pipe(
                    tap(x => msg.push(x), e => err = e),
                    catchError(() => EMPTY),
                )
                .toPromise();
            expect(err).toBeInstanceOf(RpcError);
            expect(err.message).toBe("status err");
            expect(msg.length).toBe(3);
        });

        it('should complete empty if aborted', async function () {
            const client = new RxjsStyleServiceClient(new TestTransport({
                response: [
                    {value: 1},
                    {value: 2},
                    {value: 3},
                ]
            }));
            const abort = new AbortController();
            setTimeout(() => {
                abort.abort();
            }, 1)
            const msg: Int32Value[] = [];
            let err: any = undefined;
            await client.serverStream(StringValue.create(), {abort: abort.signal})
                .pipe(
                    tap(x => msg.push(x), e => err = e),
                    catchError(e => EMPTY)
                )
                .toPromise();
            expect(err).toBeUndefined();
            expect(msg.length).toBe(0);
        });

        it('should cancel on unsubscribe', async function () {
            const client = new RxjsStyleServiceClient(new TestTransport({
                response: [
                    {value: 1},
                    {value: 2},
                    {value: 3},
                ]
            }));
            const msg: Int32Value[] = [];
            let err: any = undefined;
            const sub = client.serverStream(StringValue.create())
                .subscribe(
                    value => msg.push(value),
                    error => err = error,
                );
            await new Promise(resolve => setTimeout(resolve, 1));
            sub.unsubscribe();
            await new Promise(resolve => setTimeout(resolve, 100));
            expect(err).toBeUndefined();
            expect(msg.length).toBe(0);
        });

    });


});

