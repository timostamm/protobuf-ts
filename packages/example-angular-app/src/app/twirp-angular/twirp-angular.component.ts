import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {RpcError, RpcOptions} from '@protobuf-ts/runtime-rpc';
import {Size} from '../../protoc-gen-ts-out/service-twirp-example';
import {HaberdasherClient} from '../../protoc-gen-ts-out/service-twirp-example.client';


type Info = {
  mode: 'secondary' | 'primary' | 'alert',
  title: string,
  content: any,
};


@Component({
  selector: 'app-twirp-angular',
  templateUrl: './twirp-angular.component.html',
  styleUrls: ['./twirp-angular.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwirpAngularComponent {

  readonly request: Size = {
    inches: 23
  };

  outcome$ = new BehaviorSubject<Info[]>([]);

  constructor(private readonly client: HaberdasherClient) {
  }

  async send() {

    try {

      // call-specific option, will be merged with the GrpcWebOptions above
      const options: RpcOptions = {

        // you can set request headers here
        meta: {},

        // ... or any other option

      };


      const call = this.client.makeHat(this.request, options);

      this.clear();

      this.print({
        title: 'Request headers', mode: 'secondary', content: call.requestHeaders
      });

      this.print({
        title: 'Request message', mode: 'secondary', content: call.request
      });

      const headers = await call.headers;
      this.print({
        title: 'Response headers', mode: 'secondary', content: headers
      });

      const message = await call.response;
      this.print({
        title: 'Response message', mode: 'primary', content: message
      });

      const status = await call.status;
      this.print({
        title: 'Response status', mode: 'secondary', content: status
      });

      // Twirp does not support response trailers
      const trailers = await call.trailers;
      this.print({
        title: 'Response trailers (always empty, Twirp does not support hem)', mode: 'secondary', content: trailers
      });


      // above was a lot of code, here is a simple alternative:
      const justWantTheMessage = false;
      if (justWantTheMessage) {
        const {response} = await this.client.makeHat(this.request, options);
      }


    } catch (e) {
      if (e instanceof RpcError) {
        this.print({
          title: 'Caught RpcError', mode: 'alert', content: {
            name: e.name,
            message: e.message,
            code: e.code,
            meta: e.meta,
          }
        });
      } else {
        this.print({
          title: 'Caught Error', mode: 'alert', content: e
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
