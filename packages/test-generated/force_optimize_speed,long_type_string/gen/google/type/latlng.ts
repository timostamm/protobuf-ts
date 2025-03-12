// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size,long_type_string
// @generated from protobuf file "google/type/latlng.proto" (package "google.type", syntax proto3)
// tslint:disable
//
// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
import { MessageType } from "@protobuf-ts/runtime";
/**
 * An object representing a latitude/longitude pair. This is expressed as a pair
 * of doubles representing degrees latitude and degrees longitude. Unless
 * specified otherwise, this must conform to the
 * <a href="http://www.unoosa.org/pdf/icg/2012/template/WGS_84.pdf">WGS84
 * standard</a>. Values must be within normalized ranges.
 *
 * @generated from protobuf message google.type.LatLng
 */
export interface LatLng {
    /**
     * The latitude in degrees. It must be in the range [-90.0, +90.0].
     *
     * @generated from protobuf field: double latitude = 1;
     */
    latitude: number;
    /**
     * The longitude in degrees. It must be in the range [-180.0, +180.0].
     *
     * @generated from protobuf field: double longitude = 2;
     */
    longitude: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class LatLng$Type extends MessageType<LatLng> {
    constructor() {
        super("google.type.LatLng", [
            { no: 1, name: "latitude", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "longitude", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message google.type.LatLng
 */
export const LatLng = new LatLng$Type();
