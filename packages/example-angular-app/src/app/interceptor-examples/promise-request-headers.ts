import {
  RpcError,
  RpcInterceptor,
  RpcOutputStreamController,
  ServerStreamingCall,
  UnaryCall
} from '@protobuf-ts/runtime-rpc';


/**
 * Shows how to add a token in the "authorization" request header,
 * with the token being provided by a promise.
 */
const fetchTokenInterceptor: RpcInterceptor = {

  interceptUnary(next, method, input, options): UnaryCall {
    console.log(`fetchTokenInterceptor intercepting unary call: ${method.service.typeName} / ${method.name}`);

    // next() creates a call instance, sending data (including headers) to the server.
    // we want to wait until we have our token:
    const callPromise = new Promise<UnaryCall<any, any>>((resolve, reject) => {
      fetchToken().then(token => {
        if (!options.meta) {
          options.meta = {};
        }
        console.log(`fetchTokenInterceptor setting authorization = ${token}`);
        options.meta.Authorization = token;
        resolve(next(method, input, options));
      }, reason => {
        console.error('fetchTokenInterceptor failed to fetch token', reason);
        reject(new RpcError(`Failed to fetch token`, 'INTERNAL'));
      });
    });

    // we have to return a valid call instance immediately.
    // we wrap the promised call.
    return new UnaryCall<any, any>(
      method,
      options.meta ?? {},
      input,
      callPromise.then(c => c.headers),
      callPromise.then(c => c.response),
      callPromise.then(c => c.status),
      callPromise.then(c => c.trailers),
    );
  },

  interceptServerStreaming(next, method, input, options): ServerStreamingCall {
    console.log(`fetchTokenInterceptor intercepting server streaming call: ${method.service.typeName} / ${method.name}`);

    // we have to return an output stream instance before we get one
    // from next(), so we create our own and delegate data below...
    const outputStream = new RpcOutputStreamController();

    // next() creates a call instance, sending data (including headers) to the server.
    // we want to wait until we have our token:
    const callPromise = new Promise<[ServerStreamingCall]>((resolve, reject) => {
      fetchToken().then(token => {
        if (!options.meta) {
          options.meta = {};
        }
        console.log(`fetchTokenInterceptor setting authorization = ${token}`);
        options.meta.Authorization = token;

        // start the call
        const call = next(method, input, options);

        // delegate from the original output stream to the one controlled by us
        call.response.onNext(outputStream.notifyNext.bind(outputStream));

        // deliberately returning a tuple. the call is awaitable - the promise chain
        // would wait until the call is finished.
        resolve([call]);
      }, reason => {
        console.error('fetchTokenInterceptor failed to fetch token', reason);
        const err = new RpcError(`Failed to fetch token`, 'INTERNAL');
        outputStream.notifyError(err);
        reject(err);
      });
    });

    // we have to return a valid call instance immediately.
    // we wrap the promised call.
    return new ServerStreamingCall(
      method,
      options.meta ?? {},
      input,
      callPromise.then(c => c[0].headers),
      outputStream,
      callPromise.then(c => c[0].status),
      callPromise.then(c => c[0].trailers),
    );
  }

};


function fetchToken(): Promise<string> {
  console.log('fetchToken() fetching a token asynchronously...');
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      console.log('fetchToken() got the token');
      // reject(new Error('random error from some backend'));
      resolve('example-token');
    }, 200);
  });
}

