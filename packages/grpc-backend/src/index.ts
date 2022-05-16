// Public API.
// Note: we do not use `export * from ...` to help tree shakers,
// webpack verbose output hints that this should be useful


export {adaptService, createContext, createDefinition} from "./grpc-adapter";
