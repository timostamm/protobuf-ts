// Copyright 2018 Twitch Interactive, Inc.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License"). You may not
// use this file except in compliance with the License. A copy of the License is
// located at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License
// for the specific language governing permissions and limitations under
// the License.

/**
 * See https://twitchtv.github.io/twirp/docs/spec_v5.html#error-codes
 *
 * Names and descriptions from [twirp / errors.go](https://github.com/twitchtv/twirp/blob/b2ecb97cf02a9bb55d730920f6a1cb5243899093/errors.go)
 *
 * Copyright 2018 by Twitch Interactive, Inc.
 */
export enum TwirpErrorCode {

    /**
     * The operation was cancelled.
     */
    cancelled,

    /**
     * An unknown error occurred. For example, this can be used when handling
     * errors raised by APIs that do not return any error information.
     */
        unknown,

    /**
     * The client specified an invalid argument. This indicates arguments that
     * are invalid regardless of the state of the system (i.e. a malformed
     * file name, required argument, number out of range, etc.).
     */
    invalid_argument,

    /**
     * The client sent a message which could not be decoded. This may mean that
     * the message was encoded improperly or that the client and server have
     * incompatible message definitions.
     */
    malformed,

    /**
     * Operation expired before completion. For operations that change the state
     * of the system, this error may be returned even if the operation has
     * completed successfully (timeout).
     */
    deadline_exceeded,

    /**
     * Some requested entity was not found.
     */
    not_found,

    /**
     * The requested URL path wasn't routable to a Twirp service and method.
     * This is returned by generated server code and should not be returned
     * by application code (use "not_found" or "unimplemented" instead).
     */
    bad_route,

    /**
     * An attempt to create an entity failed because one already exists.
     */
    already_exists,

    /**
     * The caller does not have permission to execute the specified operation.
     * It must not be used if the caller cannot be identified (use
     * "unauthenticated" instead).
     */
    permission_denied,

    /**
     * The request does not have valid authentication credentials for the
     * operation.
     */
    unauthenticated,

    /**
     * Some resource has been exhausted, perhaps a per-user quota, or
     * perhaps the entire file system is out of space.
     */
    resource_exhausted,

    /**
     * The operation was rejected because the system is not in a state
     * required for the operation's execution. For example, doing an rmdir
     * operation on a directory that is non-empty, or on a non-directory
     * object, or when having conflicting read-modify-write on the same
     * resource.
     */
    failed_precondition,

    /**
     * The operation was aborted, typically due to a concurrency issue
     * like sequencer check failures, transaction aborts, etc.
     */
    aborted,

    /**
     * The operation was attempted past the valid range. For example, seeking
     * or reading past end of a paginated collection. Unlike
     * "invalid_argument", this error indicates a problem that may be fixed if
     * the system state changes (i.e. adding more items to the collection).
     * There is a fair bit of overlap between "failed_precondition" and
     * "out_of_range". We recommend using "out_of_range" (the more specific
     * error) when it applies so that callers who are iterating through a space
     * can easily look for an "out_of_range" error to detect when they are done.
     */
    out_of_range,

    /**
     * The operation is not implemented or not supported/enabled in this service.
     */
    unimplemented,

    /**
     * When some invariants expected by the underlying system have been broken.
     * In other words, something bad happened in the library or backend service.
     * Twirp specific issues like wire and serialization problems are also
     * reported as "internal" errors.
     */
    internal,

    /**
     * The service is currently unavailable. This is most likely a transient
     * condition and may be corrected by retrying with a backoff.
     */
    unavailable,

    /**
     * The operation resulted in unrecoverable data loss or corruption.
     */
    dataloss,

}
