// @generated by protobuf-ts 2.9.6 with parameter force_optimize_code_size
// @generated from protobuf file "google/type/quaternion.proto" (package "google.type", syntax proto3)
// tslint:disable
//
// Copyright 2019 Google LLC.
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
//
import { MessageType } from "@protobuf-ts/runtime";
/**
 * A quaternion is defined as the quotient of two directed lines in a
 * three-dimensional space or equivalently as the quotient of two Euclidean
 * vectors (https://en.wikipedia.org/wiki/Quaternion).
 *
 * Quaternions are often used in calculations involving three-dimensional
 * rotations (https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation),
 * as they provide greater mathematical robustness by avoiding the gimbal lock
 * problems that can be encountered when using Euler angles
 * (https://en.wikipedia.org/wiki/Gimbal_lock).
 *
 * Quaternions are generally represented in this form:
 *
 *     w + xi + yj + zk
 *
 * where x, y, z, and w are real numbers, and i, j, and k are three imaginary
 * numbers.
 *
 * Our naming choice `(x, y, z, w)` comes from the desire to avoid confusion for
 * those interested in the geometric properties of the quaternion in the 3D
 * Cartesian space. Other texts often use alternative names or subscripts, such
 * as `(a, b, c, d)`, `(1, i, j, k)`, or `(0, 1, 2, 3)`, which are perhaps
 * better suited for mathematical interpretations.
 *
 * To avoid any confusion, as well as to maintain compatibility with a large
 * number of software libraries, the quaternions represented using the protocol
 * buffer below *must* follow the Hamilton convention, which defines `ij = k`
 * (i.e. a right-handed algebra), and therefore:
 *
 *     i^2 = j^2 = k^2 = ijk = −1
 *     ij = −ji = k
 *     jk = −kj = i
 *     ki = −ik = j
 *
 * Please DO NOT use this to represent quaternions that follow the JPL
 * convention, or any of the other quaternion flavors out there.
 *
 * Definitions:
 *
 *   - Quaternion norm (or magnitude): `sqrt(x^2 + y^2 + z^2 + w^2)`.
 *   - Unit (or normalized) quaternion: a quaternion whose norm is 1.
 *   - Pure quaternion: a quaternion whose scalar component (`w`) is 0.
 *   - Rotation quaternion: a unit quaternion used to represent rotation.
 *   - Orientation quaternion: a unit quaternion used to represent orientation.
 *
 * A quaternion can be normalized by dividing it by its norm. The resulting
 * quaternion maintains the same direction, but has a norm of 1, i.e. it moves
 * on the unit sphere. This is generally necessary for rotation and orientation
 * quaternions, to avoid rounding errors:
 * https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions
 *
 * Note that `(x, y, z, w)` and `(-x, -y, -z, -w)` represent the same rotation,
 * but normalization would be even more useful, e.g. for comparison purposes, if
 * it would produce a unique representation. It is thus recommended that `w` be
 * kept positive, which can be achieved by changing all the signs when `w` is
 * negative.
 *
 *
 * @generated from protobuf message google.type.Quaternion
 */
export interface Quaternion {
    /**
     * The x component.
     *
     * @generated from protobuf field: double x = 1;
     */
    x: number;
    /**
     * The y component.
     *
     * @generated from protobuf field: double y = 2;
     */
    y: number;
    /**
     * The z component.
     *
     * @generated from protobuf field: double z = 3;
     */
    z: number;
    /**
     * The scalar component.
     *
     * @generated from protobuf field: double w = 4;
     */
    w: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class Quaternion$Type extends MessageType<Quaternion> {
    constructor() {
        super("google.type.Quaternion", [
            { no: 1, name: "x", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "y", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 3, name: "z", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 4, name: "w", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message google.type.Quaternion
 */
export const Quaternion = new Quaternion$Type();
