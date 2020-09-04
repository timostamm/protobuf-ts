import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {PbDatePipeModule, TwirpModule} from '@protobuf-ts/runtime-angular';
import {GrpcwebUnaryComponent} from './grpcweb-unary/grpcweb-unary.component';
import {FormsModule} from '@angular/forms';
import {GrpcwebServerStreamingComponent} from './grpcweb-server-streaming/grpcweb-server-streaming.component';
import {TwirpFetchComponent} from './twirp-fetch/twirp-fetch.component';
import {AllMethodsServiceClient} from '../protoc-gen-ts-out/service-all-methods';
import {TwirpAngularComponent} from './twirp-angular/twirp-angular.component';
import {PbDatePipeComponent} from './pb-date-pipe/pb-date-pipe.component';
import {HaberdasherClient} from '../protoc-gen-ts-out/service-twirp-example';
import {UnaryCall} from '@protobuf-ts/runtime-rpc';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,

    // Registers the `PbDatePipe` of @protobuf-ts/runtime-angular.
    // This pipe overrides the standard "date" pipe and adds support
    // for `google.protobuf.Timestamp` and `google.type.DateTime`.
    PbDatePipeModule,

    // Registers the `TwirpTransport` with the given options
    // and sets up dependency injection.
    TwirpModule.forRoot({
      // don't forget the "twirp" prefix if your server requires it
      baseUrl: 'http://localhost:8080/twirp/',
      sendJson: false,

      // You probably want to use Angular interceptors, but RPC
      // interceptors still work with the `TwirpTransport`.
      interceptors: [
        {
          interceptUnary(next, method, input, options): UnaryCall {
            if (!options.meta) {
              options.meta = {};
            }
            options.meta.Authorization = 'xxx';
            return next(method, input, options);
          }
        }
      ],

    })
  ],
  providers: [

    // Make this service available for dependency injection.
    // Now you can use it as a constructor argument of your component.
    AllMethodsServiceClient,
    HaberdasherClient,

  ],
  declarations: [
    AppComponent,
    GrpcwebUnaryComponent,
    GrpcwebServerStreamingComponent,
    TwirpFetchComponent,
    TwirpAngularComponent,
    PbDatePipeComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
