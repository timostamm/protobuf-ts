import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { RpcError, RpcOptions } from "@protobuf-ts/runtime-rpc";
import { TwirpFetchTransport, TwirpOptions } from "@protobuf-ts/twirp-transport";
import { HaberdasherClient, Size } from "../../protoc-gen-ts-out/service-twirp-example";
import { TWIRP_TRANSPORT_OPTIONS } from "@protobuf-ts/runtime-angular";


type Info = {
  mode: 'secondary' | 'primary' | 'alert',
  title: string,
  content: any,
};


@Component({
  selector: 'app-twirp-fetch',
  templateUrl: './twirp-fetch.component.html',
  styleUrls: ['./twirp-fetch.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwirpFetchComponent {

  readonly request: Size = {
    inches: 23
  };

  outcome$ = new BehaviorSubject<Info[]>([]);

  private readonly client: HaberdasherClient;

  constructor(@Inject(TWIRP_TRANSPORT_OPTIONS) options: TwirpOptions) {
    let transport = new TwirpFetchTransport(options);
    this.client = new HaberdasherClient(transport);
  }

  async send() {

    try {

      // call-specific option, will be merged with the GrpcWebOptions above
      let options: RpcOptions = {

        // you can set request headers here
        // meta: {},

        // ... or any other option

      };


      let call = this.client.makeHat(this.request, options);

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

      // Twirp does not support response trailers
      // let trailers = await call.trailers;
      // this.outcome$.next(this.outcome$.value.concat({
      //   title: "Response trailers", mode: "secondary", content: trailers
      // }));


      // above was a lot of code, here is a simple alternative:
      let justWantTheMessage = false;
      if (justWantTheMessage) {
        let {response} = await this.client.makeHat(this.request, options);
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
