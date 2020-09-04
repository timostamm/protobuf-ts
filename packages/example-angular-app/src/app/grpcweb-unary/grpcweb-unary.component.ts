import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GrpcWebFetchTransport, GrpcWebOptions} from "@protobuf-ts/grpcweb-transport";
import {AllMethodsRequest, AllMethodsServiceClient, FailRequest} from "../../protoc-gen-ts-out/service-all-methods";
import {EnumObjectValue, listEnumValues} from "@protobuf-ts/runtime";
import {BehaviorSubject} from "rxjs";
import {RpcError, RpcOptions, UnaryCall} from "@protobuf-ts/runtime-rpc";


type Info = {
  mode: 'secondary' | 'primary' | 'alert',
  title: string,
  content: any,
};


@Component({
  selector: 'app-grpcweb-unary',
  templateUrl: './grpcweb-unary.component.html',
  styleUrls: ['./grpcweb-unary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrpcwebUnaryComponent {


  readonly options: GrpcWebOptions = {
    baseUrl: "http://localhost:5000",
    deadline: 2000,
    format: "binary",

    // simple example for how to add auth headers to each request
    // see `RpcInterceptor` for documentation
    interceptors: [
      {
        interceptUnary(next, method, input, options): UnaryCall {
          let opt: RpcOptions = options ?? {};
          if (!opt.meta)
            opt.meta = {};
          opt.meta['Authorization'] = 'xxx';
          return next(method, input, opt);
        }
      }
    ],

    // you can set global request headers here
    meta: {}

  };

  readonly request: AllMethodsRequest = {
    question: "what's up?",
    pleaseFail: FailRequest.FAIL_REQUEST_NONE,
    disableSendingExampleResponseHeaders: false,
    pleaseDelayResponseMs: 750,
  };

  outcome$ = new BehaviorSubject<Info[]>([]);

  readonly pleaseFailOptions: EnumObjectValue[] = listEnumValues(FailRequest);

  constructor() {
  }

  async send() {

    try {

      let transport = new GrpcWebFetchTransport(this.options);
      let client = new AllMethodsServiceClient(transport);

      // call-specific option, will be merged with the GrpcWebOptions above
      let options: RpcOptions = {

        // you can set request headers here
        meta: {},

        // or a deadline
        // deadline: 123,

        // ... or any other option

      };


      let call = client.unary(this.request, options);

      this.clear();

      this.print({
        title: "Request headers", mode: "secondary", content: call.requestHeaders
      });

      this.print({
        title: "Request message", mode: "secondary", content: call.request
      });

      let headers = await call.headers;
      this.print({
        title: "Response headers", mode: "secondary", content: headers
      });

      let message = await call.response;
      this.print({
        title: "Response message", mode: "primary", content: message
      });

      let status = await call.status;
      this.print({
        title: "Response status", mode: "secondary", content: status
      });

      let trailers = await call.trailers;
      this.print({
        title: "Response trailers", mode: "secondary", content: trailers
      });


      // above was a lot of code, here is a simple alternative:
      let justWantTheMessage = false;
      if (justWantTheMessage) {
        let {response} = await client.unary(this.request, options);
      }


    } catch (e) {
      if (e instanceof RpcError) {
        this.print({
          title: "Caught RpcError", mode: "alert", content: {
            name: e.name,
            message: e.message,
            code: e.code,
            meta: e.meta,
          }
        });
      } else {
        this.print({
          title: "Caught Error", mode: "alert", content: e
        });
      }
    }

  }

  private print(info: Info): void {
    this.outcome$.next(this.outcome$.value.concat(info));
  }

  private clear(): void {
    this.outcome$.next([]);
  }


}
