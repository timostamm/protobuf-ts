import { InjectionToken } from "@angular/core";
import { TwirpOptions } from "@chippercash/protobuf-twirp-transport";

/**
 * Injection token for `TwirpOptions` for the `TwirpTransport`.
 *
 * For easy setup, just add TwirpAngularModule.forRoot() to the "imports"
 * of your `AppComponent`. The method takes a `TwirpOptions` argument.
 */
export const TWIRP_TRANSPORT_OPTIONS = new InjectionToken<TwirpOptions>('TwirpOptions');
