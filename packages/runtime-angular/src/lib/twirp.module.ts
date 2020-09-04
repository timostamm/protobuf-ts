import { ModuleWithProviders, NgModule } from "@angular/core";
import { TwirpTransport } from "./twirp-transport.service";
import { TwirpOptions } from "@protobuf-ts/twirp-transport";
import { HttpClientModule } from "@angular/common/http";
import { TWIRP_TRANSPORT_OPTIONS } from "./twirp-transport-options";
import { RPC_TRANSPORT } from "./rpc-transport";


/**
 * Provides the Twirp transport `TwirpTransport`, which uses
 * `HttpClient` of @angular/common/http for requests.
 */
@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    TwirpTransport,
  ]
})
export class TwirpModule {

  public static forRoot(twirpOptions: TwirpOptions): ModuleWithProviders<TwirpModule> {
    return {
      ngModule: TwirpModule,
      providers: [
        {provide: TWIRP_TRANSPORT_OPTIONS, useValue: twirpOptions},
        {provide: RPC_TRANSPORT, useExisting: TwirpTransport}
      ]
    };
  }
}
