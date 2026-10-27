var __defProp = Object.defineProperty;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};

// node_modules/zod/v4/classic/external.js
var exports_external = {};
__export(exports_external, {
  $brand: () => $brand,
  $input: () => $input,
  $output: () => $output,
  NEVER: () => NEVER,
  TimePrecision: () => TimePrecision,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBase64: () => ZodBase64,
  ZodBase64URL: () => ZodBase64URL,
  ZodBigInt: () => ZodBigInt,
  ZodBigIntFormat: () => ZodBigIntFormat,
  ZodBoolean: () => ZodBoolean,
  ZodCIDRv4: () => ZodCIDRv4,
  ZodCIDRv6: () => ZodCIDRv6,
  ZodCUID: () => ZodCUID,
  ZodCUID2: () => ZodCUID2,
  ZodCatch: () => ZodCatch,
  ZodCodec: () => ZodCodec,
  ZodCustom: () => ZodCustom,
  ZodCustomStringFormat: () => ZodCustomStringFormat,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodE164: () => ZodE164,
  ZodEmail: () => ZodEmail,
  ZodEmoji: () => ZodEmoji,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodExactOptional: () => ZodExactOptional,
  ZodFile: () => ZodFile,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodGUID: () => ZodGUID,
  ZodIPv4: () => ZodIPv4,
  ZodIPv6: () => ZodIPv6,
  ZodISODate: () => ZodISODate,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODuration: () => ZodISODuration,
  ZodISOTime: () => ZodISOTime,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodJWT: () => ZodJWT,
  ZodKSUID: () => ZodKSUID,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMAC: () => ZodMAC,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNanoID: () => ZodNanoID,
  ZodNever: () => ZodNever,
  ZodNonOptional: () => ZodNonOptional,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodNumberFormat: () => ZodNumberFormat,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodPipe: () => ZodPipe,
  ZodPrefault: () => ZodPrefault,
  ZodPreprocess: () => ZodPreprocess,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRealError: () => ZodRealError,
  ZodRecord: () => ZodRecord,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodStringFormat: () => ZodStringFormat,
  ZodSuccess: () => ZodSuccess,
  ZodSymbol: () => ZodSymbol,
  ZodTemplateLiteral: () => ZodTemplateLiteral,
  ZodTransform: () => ZodTransform,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodULID: () => ZodULID,
  ZodURL: () => ZodURL,
  ZodUUID: () => ZodUUID,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  ZodXID: () => ZodXID,
  ZodXor: () => ZodXor,
  _ZodString: () => _ZodString,
  _default: () => _default2,
  _function: () => _function,
  any: () => any,
  array: () => array,
  base64: () => base642,
  base64url: () => base64url2,
  bigint: () => bigint2,
  boolean: () => boolean2,
  catch: () => _catch2,
  check: () => check,
  cidrv4: () => cidrv42,
  cidrv6: () => cidrv62,
  clone: () => clone2,
  codec: () => codec,
  coerce: () => exports_coerce,
  config: () => config,
  core: () => exports_core2,
  cuid: () => cuid3,
  cuid2: () => cuid22,
  custom: () => custom,
  date: () => date3,
  decode: () => decode2,
  decodeAsync: () => decodeAsync2,
  describe: () => describe2,
  discriminatedUnion: () => discriminatedUnion,
  e164: () => e1642,
  email: () => email2,
  emoji: () => emoji2,
  encode: () => encode2,
  encodeAsync: () => encodeAsync2,
  endsWith: () => _endsWith,
  enum: () => _enum2,
  exactOptional: () => exactOptional,
  file: () => file,
  flattenError: () => flattenError,
  float32: () => float32,
  float64: () => float64,
  formatError: () => formatError,
  fromJSONSchema: () => fromJSONSchema,
  function: () => _function,
  getErrorMap: () => getErrorMap,
  globalRegistry: () => globalRegistry,
  gt: () => _gt,
  gte: () => _gte,
  guid: () => guid2,
  hash: () => hash,
  hex: () => hex2,
  hostname: () => hostname2,
  httpUrl: () => httpUrl,
  includes: () => _includes,
  instanceof: () => _instanceof,
  int: () => int,
  int32: () => int32,
  int64: () => int64,
  intersection: () => intersection,
  invertCodec: () => invertCodec,
  ipv4: () => ipv42,
  ipv6: () => ipv62,
  iso: () => exports_iso,
  json: () => json,
  jwt: () => jwt,
  keyof: () => keyof,
  ksuid: () => ksuid2,
  lazy: () => lazy,
  length: () => _length,
  literal: () => literal,
  locales: () => exports_locales,
  looseObject: () => looseObject,
  looseRecord: () => looseRecord,
  lowercase: () => _lowercase,
  lt: () => _lt,
  lte: () => _lte,
  mac: () => mac2,
  map: () => map,
  maxLength: () => _maxLength,
  maxSize: () => _maxSize,
  meta: () => meta2,
  mime: () => _mime,
  minLength: () => _minLength,
  minSize: () => _minSize,
  multipleOf: () => _multipleOf,
  nan: () => nan,
  nanoid: () => nanoid2,
  nativeEnum: () => nativeEnum,
  negative: () => _negative,
  never: () => never,
  nonnegative: () => _nonnegative,
  nonoptional: () => nonoptional,
  nonpositive: () => _nonpositive,
  normalize: () => _normalize,
  null: () => _null3,
  nullable: () => nullable,
  nullish: () => nullish2,
  number: () => number2,
  object: () => object,
  optional: () => optional,
  overwrite: () => _overwrite,
  parse: () => parse3,
  parseAsync: () => parseAsync2,
  partialRecord: () => partialRecord,
  pipe: () => pipe,
  positive: () => _positive,
  prefault: () => prefault,
  preprocess: () => preprocess,
  prettifyError: () => prettifyError,
  promise: () => promise,
  property: () => _property,
  readonly: () => readonly,
  record: () => record,
  refine: () => refine,
  regex: () => _regex,
  regexes: () => exports_regexes,
  registry: () => registry,
  safeDecode: () => safeDecode2,
  safeDecodeAsync: () => safeDecodeAsync2,
  safeEncode: () => safeEncode2,
  safeEncodeAsync: () => safeEncodeAsync2,
  safeParse: () => safeParse2,
  safeParseAsync: () => safeParseAsync2,
  set: () => set,
  setErrorMap: () => setErrorMap,
  size: () => _size,
  slugify: () => _slugify,
  startsWith: () => _startsWith,
  strictObject: () => strictObject,
  string: () => string2,
  stringFormat: () => stringFormat,
  stringbool: () => stringbool,
  success: () => success,
  superRefine: () => superRefine,
  symbol: () => symbol,
  templateLiteral: () => templateLiteral,
  toJSONSchema: () => toJSONSchema,
  toLowerCase: () => _toLowerCase,
  toUpperCase: () => _toUpperCase,
  transform: () => transform,
  treeifyError: () => treeifyError,
  trim: () => _trim,
  tuple: () => tuple,
  uint32: () => uint32,
  uint64: () => uint64,
  ulid: () => ulid2,
  undefined: () => _undefined3,
  union: () => union,
  unknown: () => unknown,
  uppercase: () => _uppercase,
  url: () => url,
  util: () => exports_util,
  uuid: () => uuid2,
  uuidv4: () => uuidv4,
  uuidv6: () => uuidv6,
  uuidv7: () => uuidv7,
  void: () => _void2,
  xid: () => xid2,
  xor: () => xor
});

// node_modules/zod/v4/core/index.js
var exports_core2 = {};
__export(exports_core2, {
  $ZodAny: () => $ZodAny,
  $ZodArray: () => $ZodArray,
  $ZodAsyncError: () => $ZodAsyncError,
  $ZodBase64: () => $ZodBase64,
  $ZodBase64URL: () => $ZodBase64URL,
  $ZodBigInt: () => $ZodBigInt,
  $ZodBigIntFormat: () => $ZodBigIntFormat,
  $ZodBoolean: () => $ZodBoolean,
  $ZodCIDRv4: () => $ZodCIDRv4,
  $ZodCIDRv6: () => $ZodCIDRv6,
  $ZodCUID: () => $ZodCUID,
  $ZodCUID2: () => $ZodCUID2,
  $ZodCatch: () => $ZodCatch,
  $ZodCheck: () => $ZodCheck,
  $ZodCheckBigIntFormat: () => $ZodCheckBigIntFormat,
  $ZodCheckEndsWith: () => $ZodCheckEndsWith,
  $ZodCheckGreaterThan: () => $ZodCheckGreaterThan,
  $ZodCheckIncludes: () => $ZodCheckIncludes,
  $ZodCheckLengthEquals: () => $ZodCheckLengthEquals,
  $ZodCheckLessThan: () => $ZodCheckLessThan,
  $ZodCheckLowerCase: () => $ZodCheckLowerCase,
  $ZodCheckMaxLength: () => $ZodCheckMaxLength,
  $ZodCheckMaxSize: () => $ZodCheckMaxSize,
  $ZodCheckMimeType: () => $ZodCheckMimeType,
  $ZodCheckMinLength: () => $ZodCheckMinLength,
  $ZodCheckMinSize: () => $ZodCheckMinSize,
  $ZodCheckMultipleOf: () => $ZodCheckMultipleOf,
  $ZodCheckNumberFormat: () => $ZodCheckNumberFormat,
  $ZodCheckOverwrite: () => $ZodCheckOverwrite,
  $ZodCheckProperty: () => $ZodCheckProperty,
  $ZodCheckRegex: () => $ZodCheckRegex,
  $ZodCheckSizeEquals: () => $ZodCheckSizeEquals,
  $ZodCheckStartsWith: () => $ZodCheckStartsWith,
  $ZodCheckStringFormat: () => $ZodCheckStringFormat,
  $ZodCheckUpperCase: () => $ZodCheckUpperCase,
  $ZodCodec: () => $ZodCodec,
  $ZodCustom: () => $ZodCustom,
  $ZodCustomStringFormat: () => $ZodCustomStringFormat,
  $ZodDate: () => $ZodDate,
  $ZodDefault: () => $ZodDefault,
  $ZodDiscriminatedUnion: () => $ZodDiscriminatedUnion,
  $ZodE164: () => $ZodE164,
  $ZodEmail: () => $ZodEmail,
  $ZodEmoji: () => $ZodEmoji,
  $ZodEncodeError: () => $ZodEncodeError,
  $ZodEnum: () => $ZodEnum,
  $ZodError: () => $ZodError,
  $ZodExactOptional: () => $ZodExactOptional,
  $ZodFile: () => $ZodFile,
  $ZodFunction: () => $ZodFunction,
  $ZodGUID: () => $ZodGUID,
  $ZodIPv4: () => $ZodIPv4,
  $ZodIPv6: () => $ZodIPv6,
  $ZodISODate: () => $ZodISODate,
  $ZodISODateTime: () => $ZodISODateTime,
  $ZodISODuration: () => $ZodISODuration,
  $ZodISOTime: () => $ZodISOTime,
  $ZodIntersection: () => $ZodIntersection,
  $ZodJWT: () => $ZodJWT,
  $ZodKSUID: () => $ZodKSUID,
  $ZodLazy: () => $ZodLazy,
  $ZodLiteral: () => $ZodLiteral,
  $ZodMAC: () => $ZodMAC,
  $ZodMap: () => $ZodMap,
  $ZodNaN: () => $ZodNaN,
  $ZodNanoID: () => $ZodNanoID,
  $ZodNever: () => $ZodNever,
  $ZodNonOptional: () => $ZodNonOptional,
  $ZodNull: () => $ZodNull,
  $ZodNullable: () => $ZodNullable,
  $ZodNumber: () => $ZodNumber,
  $ZodNumberFormat: () => $ZodNumberFormat,
  $ZodObject: () => $ZodObject,
  $ZodObjectJIT: () => $ZodObjectJIT,
  $ZodOptional: () => $ZodOptional,
  $ZodPipe: () => $ZodPipe,
  $ZodPrefault: () => $ZodPrefault,
  $ZodPreprocess: () => $ZodPreprocess,
  $ZodPromise: () => $ZodPromise,
  $ZodReadonly: () => $ZodReadonly,
  $ZodRealError: () => $ZodRealError,
  $ZodRecord: () => $ZodRecord,
  $ZodRegistry: () => $ZodRegistry,
  $ZodSet: () => $ZodSet,
  $ZodString: () => $ZodString,
  $ZodStringFormat: () => $ZodStringFormat,
  $ZodSuccess: () => $ZodSuccess,
  $ZodSymbol: () => $ZodSymbol,
  $ZodTemplateLiteral: () => $ZodTemplateLiteral,
  $ZodTransform: () => $ZodTransform,
  $ZodTuple: () => $ZodTuple,
  $ZodType: () => $ZodType,
  $ZodULID: () => $ZodULID,
  $ZodURL: () => $ZodURL,
  $ZodUUID: () => $ZodUUID,
  $ZodUndefined: () => $ZodUndefined,
  $ZodUnion: () => $ZodUnion,
  $ZodUnknown: () => $ZodUnknown,
  $ZodVoid: () => $ZodVoid,
  $ZodXID: () => $ZodXID,
  $ZodXor: () => $ZodXor,
  $brand: () => $brand,
  $constructor: () => $constructor,
  $input: () => $input,
  $output: () => $output,
  Doc: () => Doc,
  JSONSchema: () => exports_json_schema,
  JSONSchemaGenerator: () => JSONSchemaGenerator,
  NEVER: () => NEVER,
  TimePrecision: () => TimePrecision,
  _any: () => _any,
  _array: () => _array,
  _base64: () => _base64,
  _base64url: () => _base64url,
  _bigint: () => _bigint,
  _boolean: () => _boolean,
  _catch: () => _catch,
  _check: () => _check,
  _cidrv4: () => _cidrv4,
  _cidrv6: () => _cidrv6,
  _coercedBigint: () => _coercedBigint,
  _coercedBoolean: () => _coercedBoolean,
  _coercedDate: () => _coercedDate,
  _coercedNumber: () => _coercedNumber,
  _coercedString: () => _coercedString,
  _cuid: () => _cuid,
  _cuid2: () => _cuid2,
  _custom: () => _custom,
  _date: () => _date,
  _decode: () => _decode,
  _decodeAsync: () => _decodeAsync,
  _default: () => _default,
  _discriminatedUnion: () => _discriminatedUnion,
  _e164: () => _e164,
  _email: () => _email,
  _emoji: () => _emoji2,
  _encode: () => _encode,
  _encodeAsync: () => _encodeAsync,
  _endsWith: () => _endsWith,
  _enum: () => _enum,
  _file: () => _file,
  _float32: () => _float32,
  _float64: () => _float64,
  _gt: () => _gt,
  _gte: () => _gte,
  _guid: () => _guid,
  _includes: () => _includes,
  _int: () => _int,
  _int32: () => _int32,
  _int64: () => _int64,
  _intersection: () => _intersection,
  _ipv4: () => _ipv4,
  _ipv6: () => _ipv6,
  _isoDate: () => _isoDate,
  _isoDateTime: () => _isoDateTime,
  _isoDuration: () => _isoDuration,
  _isoTime: () => _isoTime,
  _jwt: () => _jwt,
  _ksuid: () => _ksuid,
  _lazy: () => _lazy,
  _length: () => _length,
  _literal: () => _literal,
  _lowercase: () => _lowercase,
  _lt: () => _lt,
  _lte: () => _lte,
  _mac: () => _mac,
  _map: () => _map,
  _max: () => _lte,
  _maxLength: () => _maxLength,
  _maxSize: () => _maxSize,
  _mime: () => _mime,
  _min: () => _gte,
  _minLength: () => _minLength,
  _minSize: () => _minSize,
  _multipleOf: () => _multipleOf,
  _nan: () => _nan,
  _nanoid: () => _nanoid,
  _nativeEnum: () => _nativeEnum,
  _negative: () => _negative,
  _never: () => _never,
  _nonnegative: () => _nonnegative,
  _nonoptional: () => _nonoptional,
  _nonpositive: () => _nonpositive,
  _normalize: () => _normalize,
  _null: () => _null2,
  _nullable: () => _nullable,
  _number: () => _number,
  _optional: () => _optional,
  _overwrite: () => _overwrite,
  _parse: () => _parse,
  _parseAsync: () => _parseAsync,
  _pipe: () => _pipe,
  _positive: () => _positive,
  _promise: () => _promise,
  _property: () => _property,
  _readonly: () => _readonly,
  _record: () => _record,
  _refine: () => _refine,
  _regex: () => _regex,
  _safeDecode: () => _safeDecode,
  _safeDecodeAsync: () => _safeDecodeAsync,
  _safeEncode: () => _safeEncode,
  _safeEncodeAsync: () => _safeEncodeAsync,
  _safeParse: () => _safeParse,
  _safeParseAsync: () => _safeParseAsync,
  _set: () => _set,
  _size: () => _size,
  _slugify: () => _slugify,
  _startsWith: () => _startsWith,
  _string: () => _string,
  _stringFormat: () => _stringFormat,
  _stringbool: () => _stringbool,
  _success: () => _success,
  _superRefine: () => _superRefine,
  _symbol: () => _symbol,
  _templateLiteral: () => _templateLiteral,
  _toLowerCase: () => _toLowerCase,
  _toUpperCase: () => _toUpperCase,
  _transform: () => _transform,
  _trim: () => _trim,
  _tuple: () => _tuple,
  _uint32: () => _uint32,
  _uint64: () => _uint64,
  _ulid: () => _ulid,
  _undefined: () => _undefined2,
  _union: () => _union,
  _unknown: () => _unknown,
  _uppercase: () => _uppercase,
  _url: () => _url,
  _uuid: () => _uuid,
  _uuidv4: () => _uuidv4,
  _uuidv6: () => _uuidv6,
  _uuidv7: () => _uuidv7,
  _void: () => _void,
  _xid: () => _xid,
  _xor: () => _xor,
  clone: () => clone2,
  config: () => config,
  createStandardJSONSchemaMethod: () => createStandardJSONSchemaMethod,
  createToJSONSchemaMethod: () => createToJSONSchemaMethod,
  decode: () => decode,
  decodeAsync: () => decodeAsync,
  describe: () => describe,
  encode: () => encode,
  encodeAsync: () => encodeAsync,
  extractDefs: () => extractDefs,
  finalize: () => finalize,
  flattenError: () => flattenError,
  formatError: () => formatError,
  globalConfig: () => globalConfig,
  globalRegistry: () => globalRegistry,
  initializeContext: () => initializeContext,
  isValidBase64: () => isValidBase64,
  isValidBase64URL: () => isValidBase64URL,
  isValidJWT: () => isValidJWT,
  locales: () => exports_locales,
  meta: () => meta,
  parse: () => parse,
  parseAsync: () => parseAsync,
  prettifyError: () => prettifyError,
  process: () => process,
  regexes: () => exports_regexes,
  registry: () => registry,
  safeDecode: () => safeDecode,
  safeDecodeAsync: () => safeDecodeAsync,
  safeEncode: () => safeEncode,
  safeEncodeAsync: () => safeEncodeAsync,
  safeParse: () => safeParse,
  safeParseAsync: () => safeParseAsync,
  toDotPath: () => toDotPath,
  toJSONSchema: () => toJSONSchema,
  treeifyError: () => treeifyError,
  util: () => exports_util,
  version: () => version
});

// node_modules/zod/v4/core/util.js
var exports_util = {};
__export(exports_util, {
  BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES,
  Class: () => Class,
  NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
  aborted: () => aborted,
  allowsEval: () => allowsEval,
  assert: () => assert,
  assertEqual: () => assertEqual,
  assertIs: () => assertIs,
  assertNever: () => assertNever,
  assertNotEqual: () => assertNotEqual,
  assignProp: () => assignProp,
  base64ToUint8Array: () => base64ToUint8Array,
  base64urlToUint8Array: () => base64urlToUint8Array,
  cached: () => cached,
  captureStackTrace: () => captureStackTrace,
  cleanEnum: () => cleanEnum,
  cleanRegex: () => cleanRegex,
  clone: () => clone2,
  cloneDef: () => cloneDef,
  createTransparentProxy: () => createTransparentProxy,
  defineLazy: () => defineLazy,
  esc: () => esc,
  escapeRegex: () => escapeRegex,
  explicitlyAborted: () => explicitlyAborted,
  extend: () => extend,
  finalizeIssue: () => finalizeIssue,
  floatSafeRemainder: () => floatSafeRemainder,
  getElementAtPath: () => getElementAtPath,
  getEnumValues: () => getEnumValues,
  getLengthableOrigin: () => getLengthableOrigin,
  getParsedType: () => getParsedType,
  getSizableOrigin: () => getSizableOrigin,
  hexToUint8Array: () => hexToUint8Array,
  isObject: () => isObject2,
  isPlainObject: () => isPlainObject2,
  issue: () => issue,
  joinValues: () => joinValues,
  jsonStringifyReplacer: () => jsonStringifyReplacer,
  merge: () => merge2,
  mergeDefs: () => mergeDefs,
  normalizeParams: () => normalizeParams,
  nullish: () => nullish,
  numKeys: () => numKeys,
  objectClone: () => objectClone,
  omit: () => omit,
  optionalKeys: () => optionalKeys,
  parsedType: () => parsedType,
  partial: () => partial,
  pick: () => pick2,
  prefixIssues: () => prefixIssues,
  primitiveTypes: () => primitiveTypes,
  promiseAllObject: () => promiseAllObject,
  propertyKeyTypes: () => propertyKeyTypes,
  randomString: () => randomString,
  required: () => required,
  safeExtend: () => safeExtend,
  shallowClone: () => shallowClone,
  slugify: () => slugify,
  stringifyPrimitive: () => stringifyPrimitive,
  uint8ArrayToBase64: () => uint8ArrayToBase64,
  uint8ArrayToBase64url: () => uint8ArrayToBase64url,
  uint8ArrayToHex: () => uint8ArrayToHex,
  unwrapMessage: () => unwrapMessage
});

// node_modules/zod/v4/core/regexes.js
var exports_regexes = {};
__export(exports_regexes, {
  base64: () => base64,
  base64url: () => base64url,
  bigint: () => bigint,
  boolean: () => boolean,
  browserEmail: () => browserEmail,
  cidrv4: () => cidrv4,
  cidrv6: () => cidrv6,
  cuid: () => cuid,
  cuid2: () => cuid2,
  date: () => date,
  datetime: () => datetime,
  domain: () => domain,
  duration: () => duration,
  e164: () => e164,
  email: () => email,
  emoji: () => emoji,
  extendedDuration: () => extendedDuration,
  guid: () => guid,
  hex: () => hex,
  hostname: () => hostname,
  html5Email: () => html5Email,
  httpProtocol: () => httpProtocol,
  idnEmail: () => idnEmail,
  integer: () => integer,
  ipv4: () => ipv4,
  ipv6: () => ipv6,
  ksuid: () => ksuid,
  lowercase: () => lowercase,
  mac: () => mac,
  md5_base64: () => md5_base64,
  md5_base64url: () => md5_base64url,
  md5_hex: () => md5_hex,
  nanoid: () => nanoid,
  null: () => _null,
  number: () => number,
  rfc5322Email: () => rfc5322Email,
  sha1_base64: () => sha1_base64,
  sha1_base64url: () => sha1_base64url,
  sha1_hex: () => sha1_hex,
  sha256_base64: () => sha256_base64,
  sha256_base64url: () => sha256_base64url,
  sha256_hex: () => sha256_hex,
  sha384_base64: () => sha384_base64,
  sha384_base64url: () => sha384_base64url,
  sha384_hex: () => sha384_hex,
  sha512_base64: () => sha512_base64,
  sha512_base64url: () => sha512_base64url,
  sha512_hex: () => sha512_hex,
  string: () => string,
  time: () => time,
  ulid: () => ulid,
  undefined: () => _undefined,
  unicodeEmail: () => unicodeEmail,
  uppercase: () => uppercase,
  uuid: () => uuid,
  uuid4: () => uuid4,
  uuid6: () => uuid6,
  uuid7: () => uuid7,
  xid: () => xid
});

// node_modules/zod/v4/locales/index.js
var exports_locales = {};
__export(exports_locales, {
  ar: () => ar_default,
  az: () => az_default,
  be: () => be_default,
  bg: () => bg_default,
  ca: () => ca_default,
  cs: () => cs_default,
  da: () => da_default,
  de: () => de_default,
  el: () => el_default,
  en: () => en_default,
  eo: () => eo_default,
  es: () => es_default,
  fa: () => fa_default,
  fi: () => fi_default,
  fr: () => fr_default,
  frCA: () => fr_CA_default,
  he: () => he_default,
  hr: () => hr_default,
  hu: () => hu_default,
  hy: () => hy_default,
  id: () => id_default,
  is: () => is_default,
  it: () => it_default,
  ja: () => ja_default,
  ka: () => ka_default,
  kh: () => kh_default,
  km: () => km_default,
  ko: () => ko_default,
  lt: () => lt_default,
  mk: () => mk_default,
  ms: () => ms_default,
  nl: () => nl_default,
  no: () => no_default,
  ota: () => ota_default,
  pl: () => pl_default,
  ps: () => ps_default,
  pt: () => pt_default,
  ro: () => ro_default,
  ru: () => ru_default,
  sl: () => sl_default,
  sv: () => sv_default,
  ta: () => ta_default,
  th: () => th_default,
  tr: () => tr_default,
  ua: () => ua_default,
  uk: () => uk_default,
  ur: () => ur_default,
  uz: () => uz_default,
  vi: () => vi_default,
  yo: () => yo_default,
  zhCN: () => zh_CN_default,
  zhTW: () => zh_TW_default
});

// node_modules/zod/v4/core/json-schema.js
var exports_json_schema = {};

// node_modules/zod/v4/classic/schemas.js
var exports_schemas2 = {};
__export(exports_schemas2, {
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBase64: () => ZodBase64,
  ZodBase64URL: () => ZodBase64URL,
  ZodBigInt: () => ZodBigInt,
  ZodBigIntFormat: () => ZodBigIntFormat,
  ZodBoolean: () => ZodBoolean,
  ZodCIDRv4: () => ZodCIDRv4,
  ZodCIDRv6: () => ZodCIDRv6,
  ZodCUID: () => ZodCUID,
  ZodCUID2: () => ZodCUID2,
  ZodCatch: () => ZodCatch,
  ZodCodec: () => ZodCodec,
  ZodCustom: () => ZodCustom,
  ZodCustomStringFormat: () => ZodCustomStringFormat,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodE164: () => ZodE164,
  ZodEmail: () => ZodEmail,
  ZodEmoji: () => ZodEmoji,
  ZodEnum: () => ZodEnum,
  ZodExactOptional: () => ZodExactOptional,
  ZodFile: () => ZodFile,
  ZodFunction: () => ZodFunction,
  ZodGUID: () => ZodGUID,
  ZodIPv4: () => ZodIPv4,
  ZodIPv6: () => ZodIPv6,
  ZodIntersection: () => ZodIntersection,
  ZodJWT: () => ZodJWT,
  ZodKSUID: () => ZodKSUID,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMAC: () => ZodMAC,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNanoID: () => ZodNanoID,
  ZodNever: () => ZodNever,
  ZodNonOptional: () => ZodNonOptional,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodNumberFormat: () => ZodNumberFormat,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodPipe: () => ZodPipe,
  ZodPrefault: () => ZodPrefault,
  ZodPreprocess: () => ZodPreprocess,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodStringFormat: () => ZodStringFormat,
  ZodSuccess: () => ZodSuccess,
  ZodSymbol: () => ZodSymbol,
  ZodTemplateLiteral: () => ZodTemplateLiteral,
  ZodTransform: () => ZodTransform,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodULID: () => ZodULID,
  ZodURL: () => ZodURL,
  ZodUUID: () => ZodUUID,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  ZodXID: () => ZodXID,
  ZodXor: () => ZodXor,
  _ZodString: () => _ZodString,
  _default: () => _default2,
  _function: () => _function,
  any: () => any,
  array: () => array,
  base64: () => base642,
  base64url: () => base64url2,
  bigint: () => bigint2,
  boolean: () => boolean2,
  catch: () => _catch2,
  check: () => check,
  cidrv4: () => cidrv42,
  cidrv6: () => cidrv62,
  codec: () => codec,
  cuid: () => cuid3,
  cuid2: () => cuid22,
  custom: () => custom,
  date: () => date3,
  describe: () => describe2,
  discriminatedUnion: () => discriminatedUnion,
  e164: () => e1642,
  email: () => email2,
  emoji: () => emoji2,
  enum: () => _enum2,
  exactOptional: () => exactOptional,
  file: () => file,
  float32: () => float32,
  float64: () => float64,
  function: () => _function,
  guid: () => guid2,
  hash: () => hash,
  hex: () => hex2,
  hostname: () => hostname2,
  httpUrl: () => httpUrl,
  instanceof: () => _instanceof,
  int: () => int,
  int32: () => int32,
  int64: () => int64,
  intersection: () => intersection,
  invertCodec: () => invertCodec,
  ipv4: () => ipv42,
  ipv6: () => ipv62,
  json: () => json,
  jwt: () => jwt,
  keyof: () => keyof,
  ksuid: () => ksuid2,
  lazy: () => lazy,
  literal: () => literal,
  looseObject: () => looseObject,
  looseRecord: () => looseRecord,
  mac: () => mac2,
  map: () => map,
  meta: () => meta2,
  nan: () => nan,
  nanoid: () => nanoid2,
  nativeEnum: () => nativeEnum,
  never: () => never,
  nonoptional: () => nonoptional,
  null: () => _null3,
  nullable: () => nullable,
  nullish: () => nullish2,
  number: () => number2,
  object: () => object,
  optional: () => optional,
  partialRecord: () => partialRecord,
  pipe: () => pipe,
  prefault: () => prefault,
  preprocess: () => preprocess,
  promise: () => promise,
  readonly: () => readonly,
  record: () => record,
  refine: () => refine,
  set: () => set,
  strictObject: () => strictObject,
  string: () => string2,
  stringFormat: () => stringFormat,
  stringbool: () => stringbool,
  success: () => success,
  superRefine: () => superRefine,
  symbol: () => symbol,
  templateLiteral: () => templateLiteral,
  transform: () => transform,
  tuple: () => tuple,
  uint32: () => uint32,
  uint64: () => uint64,
  ulid: () => ulid2,
  undefined: () => _undefined3,
  union: () => union,
  unknown: () => unknown,
  url: () => url,
  uuid: () => uuid2,
  uuidv4: () => uuidv4,
  uuidv6: () => uuidv6,
  uuidv7: () => uuidv7,
  void: () => _void2,
  xid: () => xid2,
  xor: () => xor
});

// node_modules/zod/v4/classic/checks.js
var exports_checks2 = {};
__export(exports_checks2, {
  endsWith: () => _endsWith,
  gt: () => _gt,
  gte: () => _gte,
  includes: () => _includes,
  length: () => _length,
  lowercase: () => _lowercase,
  lt: () => _lt,
  lte: () => _lte,
  maxLength: () => _maxLength,
  maxSize: () => _maxSize,
  mime: () => _mime,
  minLength: () => _minLength,
  minSize: () => _minSize,
  multipleOf: () => _multipleOf,
  negative: () => _negative,
  nonnegative: () => _nonnegative,
  nonpositive: () => _nonpositive,
  normalize: () => _normalize,
  overwrite: () => _overwrite,
  positive: () => _positive,
  property: () => _property,
  regex: () => _regex,
  size: () => _size,
  slugify: () => _slugify,
  startsWith: () => _startsWith,
  toLowerCase: () => _toLowerCase,
  toUpperCase: () => _toUpperCase,
  trim: () => _trim,
  uppercase: () => _uppercase
});

// node_modules/zod/v4/classic/iso.js
var exports_iso = {};
__export(exports_iso, {
  ZodISODate: () => ZodISODate,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODuration: () => ZodISODuration,
  ZodISOTime: () => ZodISOTime,
  date: () => date2,
  datetime: () => datetime2,
  duration: () => duration2,
  time: () => time2
});

// node_modules/zod/v4/classic/coerce.js
var exports_coerce = {};
__export(exports_coerce, {
  bigint: () => bigint3,
  boolean: () => boolean3,
  date: () => date4,
  number: () => number3,
  string: () => string3
});

// node_modules/@deepseek-ai/dsh-api-gateway/lib/client.node.js
var exports_client_node = {};
__export(exports_client_node, {
  RemoteJournalStream: () => RemoteJournalStream,
  RemoteSnapshotStream: () => RemoteSnapshotStream,
  RemoteStream: () => RemoteStream,
  RemoteStreamCarrierError: () => RemoteStreamCarrierError,
  apply: () => apply,
  cancelledFailure: () => cancelledFailure,
  carrierFailure: () => carrierFailure,
  inject: () => inject,
  isRemoteFailure: () => isRemoteFailure
});

// node_modules/@deepseek-ai/cosmokit/lib/index.js
function isNullable(value) {
  return value === null || value === undefined;
}
function isPlainObject(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}
function filterKeys(object, filter) {
  return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
}
function mapValues(object, transform) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
}
function pick(source, keys, forced) {
  if (!keys)
    return { ...source };
  const result = {};
  for (const key of keys)
    if (forced || source[key] !== undefined)
      result[key] = source[key];
  return result;
}
function defineProperty(object, key, value) {
  return Object.defineProperty(object, key, {
    writable: true,
    value,
    enumerable: false
  });
}
var write = Symbol.for("cosmokit.volatile.write");
function snapshot(value, ancestors = /* @__PURE__ */ new Set) {
  if (typeof value === "function")
    throw new TypeError("volatile config cannot contain functions");
  if (value === null || typeof value !== "object")
    return value;
  if (ancestors.has(value))
    throw new TypeError("volatile config cannot contain cycles");
  ancestors.add(value);
  try {
    if (Array.isArray(value))
      return Object.freeze(value.map((item) => snapshot(item, ancestors)));
    if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null)
      throw new TypeError("volatile config objects must be plain objects or arrays");
    return Object.freeze(Object.fromEntries(Object.entries(value).map(([key, item]) => [key, snapshot(item, ancestors)])));
  } finally {
    ancestors.delete(value);
  }
}
function createVolatile(value) {
  let current = snapshot(value);
  return Object.freeze({
    get: () => current,
    [write]: (value) => {
      current = value;
    }
  });
}
function isVolatile(value) {
  return typeof value === "object" && value !== null && write in value;
}
function is(type, value) {
  if (arguments.length === 1)
    return (value) => is(type, value);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
function isArrayBufferLike(value) {
  return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
function isArrayBufferSource(value) {
  return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
var Binary;
(function(Binary) {
  Binary.is = isArrayBufferLike;
  Binary.isSource = isArrayBufferSource;
  function fromSource(source) {
    if (ArrayBuffer.isView(source))
      return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    else
      return source;
  }
  Binary.fromSource = fromSource;
  function toBase64(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined")
      return Buffer.from(source).toString("base64");
    let binary = "";
    const bytes = new Uint8Array(source);
    for (let i = 0;i < bytes.byteLength; i++)
      binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  Binary.toBase64 = toBase64;
  function fromBase64(source) {
    if (typeof Buffer !== "undefined")
      return fromSource(Buffer.from(source, "base64"));
    return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
  }
  Binary.fromBase64 = fromBase64;
  function toHex(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined")
      return Buffer.from(source).toString("hex");
    return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  Binary.toHex = toHex;
  function fromHex(source) {
    if (typeof Buffer !== "undefined")
      return fromSource(Buffer.from(source, "hex"));
    const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
    const buffer = [];
    for (let i = 0;i < hex.length; i += 2)
      buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
    return Uint8Array.from(buffer).buffer;
  }
  Binary.fromHex = fromHex;
})(Binary || (Binary = {}));
var base64ToArrayBuffer = Binary.fromBase64;
var arrayBufferToBase64 = Binary.toBase64;
var hexToArrayBuffer = Binary.fromHex;
var arrayBufferToHex = Binary.toHex;
function clone(source, refs = /* @__PURE__ */ new Map) {
  if (!source || typeof source !== "object")
    return source;
  if (is("Date", source))
    return new Date(source.valueOf());
  if (is("RegExp", source))
    return new RegExp(source.source, source.flags);
  if (isArrayBufferLike(source))
    return source.slice(0);
  if (ArrayBuffer.isView(source))
    return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const cached = refs.get(source);
  if (cached)
    return cached;
  if (Array.isArray(source)) {
    const result = [];
    refs.set(source, result);
    source.forEach((value, index) => {
      result[index] = Reflect.apply(clone, null, [value, refs]);
    });
    return result;
  }
  const result = Object.create(Object.getPrototypeOf(source));
  refs.set(source, result);
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
    if ("value" in descriptor)
      descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
    Reflect.defineProperty(result, key, descriptor);
  }
  return result;
}
function deepEqual(a, b, strict) {
  const ancestors = /* @__PURE__ */ new Set;
  function compare(a, b) {
    if (a === b)
      return true;
    if (isVolatile(a) || isVolatile(b))
      return isVolatile(a) && isVolatile(b);
    if (!strict && isNullable(a) && isNullable(b))
      return true;
    if (typeof a !== typeof b || typeof a !== "object" || !a || !b)
      return false;
    if (ancestors.has(a))
      return false;
    function check(test, then) {
      return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : undefined;
    }
    ancestors.add(a);
    try {
      return check(Array.isArray, (a, b) => {
        if (a.length !== b.length)
          return false;
        for (let index = 0;index < a.length; index++)
          if (!compare(a[index], b[index]))
            return false;
        return true;
      }) ?? check(is("Date"), (a, b) => a.valueOf() === b.valueOf()) ?? check(is("URL"), (a, b) => a.href === b.href) ?? check(is("RegExp"), (a, b) => a.source === b.source && a.flags === b.flags) ?? check(isArrayBufferLike, (a, b) => {
        if (a.byteLength !== b.byteLength)
          return false;
        const viewA = new Uint8Array(a);
        const viewB = new Uint8Array(b);
        for (let i = 0;i < viewA.length; i++)
          if (viewA[i] !== viewB[i])
            return false;
        return true;
      }) ?? ((!strict || [a, b].every((value) => Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)) && Object.keys({
        ...a,
        ...b
      }).every((key) => compare(a[key], b[key])));
    } finally {
      ancestors.delete(a);
    }
  }
  return compare(a, b);
}
function tokenize(source, delimiters, delimiter) {
  const output = [];
  let state = 0;
  for (let i = 0;i < source.length; i++) {
    const code = source.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      if (state === 1) {
        const next = source.charCodeAt(i + 1);
        if (next >= 97 && next <= 122)
          output.push(delimiter);
        output.push(code + 32);
      } else {
        if (state !== 0)
          output.push(delimiter);
        output.push(code + 32);
      }
      state = 1;
    } else if (code >= 97 && code <= 122) {
      output.push(code);
      state = 2;
    } else if (delimiters.includes(code)) {
      if (state !== 0)
        output.push(delimiter);
      state = 0;
    } else
      output.push(code);
  }
  return String.fromCharCode(...output);
}
function paramCase(source) {
  return tokenize(source, [45, 95], 45);
}
var hyphenate = paramCase;
var Time;
(function(Time) {
  Time.millisecond = 1;
  Time.second = 1000;
  Time.minute = Time.second * 60;
  Time.hour = Time.minute * 60;
  Time.day = Time.hour * 24;
  Time.week = Time.day * 7;
  let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  Time.setTimezoneOffset = setTimezoneOffset;
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  Time.getTimezoneOffset = getTimezoneOffset;
  function getDateNumber(date = /* @__PURE__ */ new Date, offset) {
    if (typeof date === "number")
      date = new Date(date);
    if (offset === undefined)
      offset = timezoneOffset;
    return Math.floor((date.valueOf() / Time.minute - offset) / 1440);
  }
  Time.getDateNumber = getDateNumber;
  function fromDateNumber(value, offset) {
    const date = new Date(value * Time.day);
    if (offset === undefined)
      offset = timezoneOffset;
    return new Date(+date + offset * Time.minute);
  }
  Time.fromDateNumber = fromDateNumber;
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture)
      return 0;
    return (parseFloat(capture[1]) * Time.week || 0) + (parseFloat(capture[2]) * Time.day || 0) + (parseFloat(capture[3]) * Time.hour || 0) + (parseFloat(capture[4]) * Time.minute || 0) + (parseFloat(capture[5]) * Time.second || 0);
  }
  Time.parseTime = parseTime;
  function parseDate(date) {
    const parsed = parseTime(date);
    if (parsed)
      date = Date.now() + parsed;
    else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date))
      date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
    else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date))
      date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
    return date ? new Date(date) : /* @__PURE__ */ new Date;
  }
  Time.parseDate = parseDate;
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time.day - Time.hour / 2)
      return Math.round(ms / Time.day) + "d";
    else if (abs >= Time.hour - Time.minute / 2)
      return Math.round(ms / Time.hour) + "h";
    else if (abs >= Time.minute - Time.second / 2)
      return Math.round(ms / Time.minute) + "m";
    else if (abs >= Time.second)
      return Math.round(ms / Time.second) + "s";
    return ms + "ms";
  }
  Time.format = format;
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  Time.toDigits = toDigits;
  function template(template, time = /* @__PURE__ */ new Date) {
    return template.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
  }
  Time.template = template;
})(Time || (Time = {}));

// node_modules/@deepseek-ai/cordis/lib/index.js
var DisposableList = class {
  sn = 0;
  map = /* @__PURE__ */ new Map;
  weak = /* @__PURE__ */ new WeakMap;
  get length() {
    return this.map.size;
  }
  push(value) {
    const sn = ++this.sn;
    this.map.set(sn, value);
    this.weak.set(value, sn);
    return () => this.map.delete(sn);
  }
  delete(value) {
    const sn = this.weak.get(value);
    if (!sn)
      return false;
    return this.map.delete(sn);
  }
  clear() {
    const values = [...this.map.values()];
    this.map.clear();
    return values.reverse();
  }
  [Symbol.iterator]() {
    return this.map.values();
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this];
  }
};
var symbols = {
  shadow: Symbol.for("cordis.shadow"),
  receiver: Symbol.for("cordis.receiver"),
  original: Symbol.for("cordis.original"),
  metadata: Symbol.for("cordis.metadata"),
  initHooks: Symbol.for("cordis.initHooks"),
  checkProto: Symbol.for("cordis.checkProto"),
  effect: Symbol.for("cordis.effect"),
  filter: Symbol.for("cordis.filter"),
  isolate: Symbol.for("cordis.isolate"),
  intercept: Symbol.for("cordis.intercept"),
  init: Symbol.for("cordis.init"),
  check: Symbol.for("cordis.check"),
  config: Symbol.for("cordis.config"),
  invoke: Symbol.for("cordis.invoke"),
  extend: Symbol.for("cordis.extend"),
  tracker: Symbol.for("cordis.tracker"),
  resolveConfig: Symbol.for("cordis.resolveConfig")
};
var GeneratorFunction = function* () {}.constructor;
var AsyncGeneratorFunction = async function* () {}.constructor;
function isConstructor(func) {
  if (!func.prototype)
    return false;
  if (func instanceof GeneratorFunction)
    return false;
  if (AsyncGeneratorFunction !== Function && func instanceof AsyncGeneratorFunction)
    return false;
  return true;
}
function joinPrototype(proto1, proto2) {
  if (proto1 === Object.prototype)
    return proto2;
  const result = Object.create(joinPrototype(Object.getPrototypeOf(proto1), proto2));
  for (const key of Reflect.ownKeys(proto1))
    Object.defineProperty(result, key, Object.getOwnPropertyDescriptor(proto1, key));
  return result;
}
function isObject(value) {
  return value && (typeof value === "object" || typeof value === "function");
}
function getPropertyDescriptor(target, prop) {
  let proto = target;
  while (proto) {
    const desc = Reflect.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = Object.getPrototypeOf(proto);
  }
}
function getTraceable(ctx, value) {
  if (!isObject(value))
    return value;
  if (Object.hasOwn(value, symbols.shadow))
    return Object.getPrototypeOf(value);
  const tracker = value[symbols.tracker];
  if (!tracker)
    return value;
  return createTraceable(ctx, value, tracker);
}
function withProps(target, props) {
  if (!props)
    return target;
  return new Proxy(target, {
    get: (target, prop, receiver) => {
      if (prop in props && prop !== "constructor")
        return Reflect.get(props, prop, receiver);
      return Reflect.get(target, prop, receiver);
    },
    set: (target, prop, value, receiver) => {
      if (prop in props && prop !== "constructor")
        return Reflect.set(props, prop, value, receiver);
      return Reflect.set(target, prop, value, receiver);
    }
  });
}
function withProp(target, prop, value) {
  return withProps(target, Object.defineProperty(Object.create(null), prop, {
    value,
    writable: false
  }));
}
function createShadow(ctx, target, property, receiver) {
  if (!property)
    return receiver;
  const origin = Reflect.getOwnPropertyDescriptor(target, property)?.value;
  if (!origin)
    return receiver;
  return withProp(receiver, property, ctx.extend({ [symbols.shadow]: origin }));
}
function createShadowMethod(ctx, value, outer, shadow) {
  return new Proxy(value, { apply: (target, thisArg, args) => {
    if (thisArg === outer)
      thisArg = shadow;
    return getTraceable(ctx, Reflect.apply(target, thisArg, args));
  } });
}
function createTraceable(ctx, value, tracker) {
  if (ctx[symbols.shadow] && !tracker.noShadow)
    ctx = Object.getPrototypeOf(ctx);
  const proxy = new Proxy(value, {
    get: (target, prop, receiver) => {
      if (prop === symbols.original)
        return target;
      if (prop === tracker.property)
        return ctx;
      if (typeof prop === "symbol")
        return Reflect.get(target, prop, receiver);
      if (tracker.associate && ctx.reflect.props[`${tracker.associate}.${prop}`])
        return Reflect.get(ctx, `${tracker.associate}.${prop}`, withProp(ctx, symbols.receiver, receiver));
      let shadow, innerValue;
      const desc = getPropertyDescriptor(target, prop);
      if (desc && "value" in desc)
        innerValue = desc.value;
      else {
        shadow = createShadow(ctx, target, tracker.property, receiver);
        innerValue = Reflect.get(target, prop, shadow);
      }
      const innerTracker = innerValue?.[symbols.tracker];
      if (innerTracker)
        return createTraceable(ctx, innerValue, innerTracker);
      else if (!tracker.noShadow && typeof innerValue === "function") {
        shadow ??= createShadow(ctx, target, tracker.property, receiver);
        return createShadowMethod(ctx, innerValue, receiver, shadow);
      } else
        return innerValue;
    },
    set: (target, prop, value, receiver) => {
      if (prop === symbols.original)
        return false;
      if (prop === tracker.property)
        return false;
      if (typeof prop === "symbol")
        return Reflect.set(target, prop, value, receiver);
      if (tracker.associate && ctx.reflect.props[`${tracker.associate}.${prop}`])
        return Reflect.set(ctx, `${tracker.associate}.${prop}`, value, withProp(ctx, symbols.receiver, receiver));
      const shadow = createShadow(ctx, target, tracker.property, receiver);
      return Reflect.set(target, prop, value, shadow);
    },
    apply: (target, thisArg, args) => {
      return applyTraceable(proxy, target, thisArg, args);
    }
  });
  return proxy;
}
function applyTraceable(proxy, value, thisArg, args) {
  if (!value[symbols.invoke])
    return Reflect.apply(value, thisArg, args);
  return value[symbols.invoke].apply(proxy, args);
}
function createCallable(name, proto, tracker) {
  const self = function(...args) {
    return applyTraceable(createTraceable(self["ctx"], self, tracker), self, this, args);
  };
  defineProperty(self, "name", name);
  return Object.setPrototypeOf(self, proto);
}
function handleError(info, reason, getOuterStack) {
  const innerLines = info.error.stack.split(`
`);
  if (typeof reason?.stack !== "string") {
    const outerError = new Error(reason);
    const lines = outerError.stack.split(`
`);
    lines.splice(1, Infinity, ...getOuterStack());
    outerError.stack = lines.join(`
`);
    throw outerError;
  }
  const lines = reason.stack.split(`
`);
  let index = lines.indexOf(innerLines[2]);
  if (index === -1)
    throw reason;
  index -= info.offset;
  while (index > 0) {
    if (!lines[index - 1].endsWith(" (<anonymous>)"))
      break;
    index -= 1;
  }
  lines.splice(index, Infinity, ...getOuterStack());
  reason.stack = lines.join(`
`);
  throw reason;
}
function composeError(callback, getOuterStack = buildOuterStack()) {
  const info = {
    offset: 1,
    error: /* @__PURE__ */ new Error
  };
  try {
    const result = callback(info);
    if (isObject(result) && "then" in result)
      return result.then(undefined, (reason) => handleError(info, reason, getOuterStack));
    else
      return result;
  } catch (reason) {
    handleError(info, reason, getOuterStack);
  }
}
function buildOuterStack(offset = 0) {
  const outerError = /* @__PURE__ */ new Error;
  return () => outerError.stack.split(`
`).slice(3 + offset);
}
function isBailed(value) {
  return value !== null && value !== false && value !== undefined;
}
var EventsService = class {
  ctx;
  _hooks = {};
  constructor(ctx) {
    this.ctx = ctx;
    defineProperty(this, symbols.tracker, {
      property: "ctx",
      noShadow: true
    });
    this.on("internal/listener", function(name, listener, options) {
      if (name === "internal/update" && !options.global)
        return (this.fiber._hooks["internal/update"] ??= new DisposableList)[options.prepend ? "unshift" : "push"](listener);
    });
    this.on("internal/update", function(config, noSave, next) {
      const cbs = [...this._hooks["internal/update"] || []];
      const _next = () => {
        return (cbs.shift() ?? next).call(this, config, noSave, _next);
      };
      return _next();
    }, {
      global: true,
      prepend: true
    });
  }
  dispatch(type, args) {
    const thisArg = typeof args[0] === "object" || typeof args[0] === "function" ? args.shift() : null;
    const name = args.shift();
    if (!name.startsWith("internal/"))
      this.emit("internal/dispatch", type, name, args, thisArg);
    const filter = thisArg?.[Context.filter];
    return (this._hooks[name] || []).filter((hook) => hook.global || !filter || filter.call(thisArg, hook.ctx)).map((hook) => hook.callback.bind(thisArg));
  }
  async parallel(...args) {
    const errors = (await Promise.allSettled(this.dispatch("emit", args).map(async (cb) => cb(...args)))).filter((result) => result.status === "rejected");
    if (errors.length)
      throw new AggregateError(errors.map((error) => error.reason));
  }
  emit(...args) {
    this.dispatch("emit", args).map((cb) => cb(...args));
  }
  async serial(...args) {
    for (const cb of this.dispatch("serial", args)) {
      const result = await cb(...args);
      if (isBailed(result))
        return result;
    }
  }
  bail(...args) {
    for (const cb of this.dispatch("bail", args)) {
      const result = cb(...args);
      if (isBailed(result))
        return result;
    }
  }
  waterfall(...args) {
    const cbs = this.dispatch("waterfall", args);
    const inner = args.pop();
    const next = () => {
      return (cbs.shift() ?? inner)(...args);
    };
    args.push(next);
    return next();
  }
  register(label, hooks, callback, options) {
    const method = options.prepend ? "unshift" : "push";
    return this.ctx.fiber.effect(() => {
      hooks[method]({
        ctx: this.ctx,
        callback,
        ...options
      });
      return () => this.unregister(hooks, callback);
    }, label);
  }
  unregister(hooks, callback) {
    const index = hooks.findIndex((hook) => hook.callback === callback);
    if (index >= 0) {
      hooks.splice(index, 1);
      return true;
    }
  }
  on(name, listener, options) {
    if (typeof options !== "object")
      options = { prepend: options };
    this.ctx.fiber.assertActive();
    listener = this.ctx.reflect.bind(listener);
    const result = this.bail(this.ctx, "internal/listener", name, listener, options);
    if (result)
      return result;
    const hooks = this._hooks[name] ||= [];
    const label = `ctx.on(${typeof name === "string" ? JSON.stringify(name) : name.toString()})`;
    return this.register(label, hooks, listener, options);
  }
  once(name, listener, options) {
    const dispose = this.on(name, function(...args) {
      dispose();
      return listener.apply(this, args);
    }, options);
    return dispose;
  }
};
var defaultFormatters = {
  s: (value) => String(value),
  d: (value) => Math.trunc(Number(value)),
  i: (value) => Math.trunc(Number(value)),
  f: (value) => Number(value),
  o: (value) => JSON.stringify(value),
  O: (value) => JSON.stringify(value),
  c: () => "",
  C: (value, exporter, message) => {
    return Logger.color(exporter, Logger.code(message.name, exporter.colors), value);
  }
};
function isAggregateError(error) {
  return error instanceof Error && Array.isArray(error["errors"]);
}
var Logger = class {
  service;
  static color(exporter, code, value, decoration = "") {
    if (!exporter.colors)
      return "" + value;
    return `\x1B[3${code < 8 ? code : "8;5;" + code}${exporter.colors >= 2 ? decoration : ""}m${value}\x1B[0m`;
  }
  static code(name, level) {
    let hash = 0;
    for (let i = 0;i < name.length; i++) {
      hash = (hash << 3) - hash + name.charCodeAt(i) + 13;
      hash |= 0;
    }
    const colors = !level ? [] : level >= 2 ? c256 : c16;
    return colors[Math.abs(hash) % colors.length];
  }
  static format(exporter, message) {
    const args = message.args.slice();
    if (args[0] instanceof Error) {
      args[0] = args[0].stack || args[0].message;
      args.unshift("%s");
    } else if (typeof args[0] !== "string")
      args.unshift("%o");
    let format = args.shift();
    format = format.replace(/%([a-zA-Z%])/g, (match, char) => {
      if (match === "%%")
        return "%";
      const formatter = exporter.formatters?.[char] ?? defaultFormatters[char];
      if (typeof formatter === "function")
        return formatter(args.shift(), exporter, message);
      return match;
    });
    const oFormatter = exporter.formatters?.o ?? defaultFormatters.o;
    for (let arg of args) {
      if (typeof arg === "object" && arg)
        arg = oFormatter(arg, exporter, message);
      format += " " + arg;
    }
    const { maxLength = 10240 } = exporter;
    return format.split(/\r?\n/g).map((line) => {
      return line.slice(0, maxLength) + (line.length > maxLength ? "..." : "");
    }).join(`
`);
  }
  constructor(options, service) {
    this.service = service;
    Object.assign(this, options);
    this.error = this._method("error", 0);
    this.info = this._method("info", 1);
    this.warn = this._method("warn", 2);
    this.debug = this._method("debug", 3);
  }
  _method(type, level) {
    return (...args) => {
      if (args.length === 1 && args[0] instanceof Error) {
        if (args[0].cause)
          this[type](args[0].cause);
        else if (isAggregateError(args[0])) {
          args[0].errors.forEach((error) => this[type](error));
          return;
        }
      }
      const sn = ++this.service._snMessage;
      const ts = Date.now();
      for (const exporter of this.service.exporters.values()) {
        if ((exporter.levels?.[this.name] ?? exporter.levels?.default ?? this.level ?? 1) < level)
          continue;
        const message = {
          sn,
          ts,
          type,
          level,
          name: this.name,
          ...this.meta,
          args
        };
        exporter.export(message);
      }
    };
  }
};
var c16 = [
  6,
  2,
  3,
  4,
  5,
  1
];
var c256 = [
  20,
  21,
  26,
  27,
  32,
  33,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  56,
  57,
  62,
  63,
  68,
  69,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
  92,
  93,
  98,
  99,
  112,
  113,
  129,
  134,
  135,
  148,
  149,
  160,
  161,
  162,
  163,
  164,
  165,
  166,
  167,
  168,
  169,
  170,
  171,
  172,
  173,
  178,
  179,
  184,
  185,
  196,
  197,
  198,
  199,
  200,
  201,
  202,
  203,
  204,
  205,
  206,
  207,
  208,
  209,
  214,
  215,
  220,
  221
];
var LoggerService = class LoggerService {
  bufferSize = 1000;
  buffer = [];
  ctx;
  _snMessage = 0;
  _snExporter = 0;
  exporters = /* @__PURE__ */ new Map;
  constructor(ctx) {
    const tracker = {
      property: "ctx",
      noShadow: true
    };
    const self = createCallable("logger", joinPrototype(Object.getPrototypeOf(this), Function.prototype), tracker);
    Object.assign(self, this);
    self.ctx = ctx;
    defineProperty(self, symbols.tracker, tracker);
    self.exporter({
      colors: 3,
      export: (message) => {
        self.buffer.push(message);
        if (self.buffer.length > self.bufferSize)
          self.buffer = self.buffer.slice(-self.bufferSize);
      }
    });
    return self;
  }
  exporter(exporter) {
    return this.ctx.effect(() => {
      const id = ++this._snExporter;
      this.exporters.set(id, exporter);
      return () => this.exporters.delete(id);
    }, "ctx.logger.exporter()");
  }
  _resolveConfig() {
    let intercept = this.ctx[symbols.intercept];
    const configs = [];
    while ("logger" in intercept) {
      if (Object.hasOwn(intercept, "logger"))
        configs.unshift(intercept["logger"]);
      intercept = Object.getPrototypeOf(intercept);
    }
    return Object.assign({}, ...configs);
  }
  [symbols.invoke](name) {
    const config = this._resolveConfig();
    const fiber = (this.ctx[symbols.shadow] ?? this.ctx).fiber;
    name ??= config.name;
    name ??= hyphenate(fiber.name);
    return new Logger({
      name,
      level: config.level,
      meta: { fiber: new WeakRef(fiber) }
    }, this);
  }
  static {
    for (const type of [
      "error",
      "info",
      "warn",
      "debug"
    ])
      LoggerService.prototype[type] = function(...args) {
        return this()[type](...args);
      };
  }
};
function enhanceError(error) {
  const lines = error.stack.split(`
`);
  lines.splice(0, 2, `Error: ${error.message}`);
  error.stack = lines.join(`
`);
  return error;
}
var RESERVED_WORDS = ["prototype", "then"];
function isSpecialProperty(prop) {
  return typeof prop === "symbol" || RESERVED_WORDS.includes(prop) || parseInt(prop).toString() === prop || prop.startsWith("_");
}
var ReflectService = class {
  ctx;
  static handler = {
    get: (target, prop, ctx) => {
      if (isSpecialProperty(prop))
        return Reflect.get(target, prop, ctx);
      if (Reflect.has(target, prop))
        return getTraceable(ctx, Reflect.get(target, prop, ctx));
      const error = /* @__PURE__ */ new Error(`cannot get property "${prop}" without inject`);
      try {
        const def = target.reflect.props[prop];
        if (def?.type === "accessor")
          return def.get.call(ctx, ctx[symbols.receiver], error);
        if (!ctx.fiber.runtime)
          return ctx.reflect.get(prop, false);
        return ctx.events.waterfall("internal/get", ctx, prop, error, () => {
          const key = target[symbols.isolate][prop];
          let fiber = (ctx[symbols.shadow] ?? ctx).fiber;
          while (true) {
            const impl = fiber.store?.[prop];
            if (impl)
              return getTraceable(ctx, impl.value);
            if (prop in fiber.inject) {
              error.message = `cannot get required service "${prop}" in inactive context`;
              throw error;
            }
            if (!fiber.runtime)
              throw error;
            if (fiber.parent[symbols.isolate][prop] !== key)
              throw error;
            fiber = fiber.parent.fiber;
          }
        });
      } catch (e) {
        throw e === error ? enhanceError(e) : e;
      }
    },
    set: (target, prop, value, ctx) => {
      if (isSpecialProperty(prop))
        return Reflect.set(target, prop, value, ctx);
      const error = /* @__PURE__ */ new Error(`cannot set property "${prop}" without provide`);
      const def = target.reflect.props[prop];
      if (!def) {
        if (!ctx.fiber.runtime)
          return Reflect.set(target, prop, value, ctx);
        throw enhanceError(error);
      }
      try {
        if (def.type === "accessor") {
          if (!def.set)
            return false;
          return def.set.call(ctx, value, ctx[symbols.receiver], error);
        }
        return ctx.events.waterfall("internal/set", ctx, prop, value, error, () => {
          return ctx.reflect.set(prop, value, error);
        });
      } catch (e) {
        throw e === error ? enhanceError(e) : e;
      }
    },
    has: (target, prop) => {
      if (isSpecialProperty(prop))
        return Reflect.has(target, prop);
      if (Reflect.has(target, prop))
        return true;
      return !!target.reflect.props[prop];
    }
  };
  store = Object.create(null);
  props = Object.create(null);
  constructor(ctx) {
    this.ctx = ctx;
    defineProperty(this, symbols.tracker, {
      property: "ctx",
      noShadow: true
    });
    this.mixin("reflect", [
      "get",
      "set",
      "provide",
      "accessor",
      "mixin"
    ]);
    this.mixin("fiber", ["runtime", "effect"]);
    this.mixin("registry", ["inject", "plugin"]);
    this.mixin("events", [
      "on",
      "once",
      "parallel",
      "emit",
      "serial",
      "bail",
      "waterfall"
    ]);
  }
  get(name, strict = true) {
    return getTraceable(this.ctx, this._getImpl(name, strict)?.value);
  }
  _getImpl(name, strict = true) {
    const key = this.ctx[symbols.isolate][name];
    const impl = key && this.store[key];
    if (!impl)
      return;
    if (strict && impl.fiber.state !== 2)
      return;
    return impl;
  }
  set(name, value, error) {
    const key = this.ctx[symbols.isolate][name];
    const impl = this.store[key];
    if (!impl)
      throw new Error(`cannot set property "${name}" without provide`);
    if (impl.fiber !== this.ctx.fiber)
      throw new Error(`cannot set property "${name}" in multiple fibers`);
    impl.value = value;
    return true;
  }
  provide(name, value, check) {
    return this.ctx.fiber.effect(() => {
      if (!this.props[name])
        this.props[name] ??= { type: "service" };
      else if (this.props[name].type !== "service")
        throw new Error(`property "${name}" is already declared as ${this.props[name].type}`);
      this.props[name] = { type: "service" };
      this.ctx.root[symbols.isolate][name] ??= Symbol(name);
      const key = this.ctx[symbols.isolate][name];
      const impl = {
        name,
        value,
        fiber: this.ctx.fiber,
        check
      };
      if (this.store[key])
        throw new Error(`service "${name}" has been registered at <${this.store[key].fiber.name}>`);
      this.store[key] = impl;
      this.ctx.fiber.store[name] = impl;
      if (this.ctx.fiber.state === 2)
        this.notify([name]);
      return async () => {
        delete this.store[key];
        const fibers = this.notify([name]);
        await Promise.allSettled(fibers.map((fiber) => fiber.await()));
        delete this.ctx.fiber.store[name];
      };
    }, `ctx.provide(${JSON.stringify(name)})`);
  }
  notify(names, filter = (ctx, name) => ctx[symbols.isolate][name] === this.ctx[symbols.isolate][name]) {
    const fibers = [];
    for (const runtime of this.ctx.registry.values())
      for (const fiber of runtime.fibers) {
        let hasUpdate = false;
        for (const name of names) {
          if (!(name in fiber.inject))
            continue;
          if (!filter(fiber.ctx, name))
            continue;
          hasUpdate = true;
          fiber._checkImpl(name);
        }
        if (!hasUpdate)
          continue;
        fiber._refresh();
        fibers.push(fiber);
      }
    for (const name of names) {
      const self = Object.create(this.ctx);
      self[symbols.filter] = (target) => filter(target, name);
      this.ctx.events.emit(self, "internal/service", name, this._getImpl(name, false)?.value);
    }
    return fibers;
  }
  accessor(name, options) {
    return this.ctx.fiber.effect(() => {
      if (name in this.props)
        throw new Error(`property "${name}" is already declared as ${this.props[name].type}`);
      this.props[name] = {
        type: "accessor",
        ...options
      };
      return () => delete this.props[name];
    }, `ctx.accessor(${JSON.stringify(name)})`);
  }
  mixin(source, mixins) {
    const self = this;
    return this.ctx.fiber.effect(function* () {
      const entries = Array.isArray(mixins) ? mixins.map((key) => [key, key]) : Object.entries(mixins);
      const getTarget = (ctx, error) => {
        return ctx[source];
      };
      for (const [key, value] of entries)
        yield self.accessor(value, {
          get(receiver, error) {
            const service = getTarget(this, error);
            if (isNullable(service))
              return service;
            const mixin = receiver ? withProps(receiver, service) : service;
            const value = Reflect.get(service, key, mixin);
            if (typeof value !== "function")
              return value;
            return value.bind(mixin ?? service);
          },
          set(value, receiver, error) {
            const service = getTarget(this, error);
            const mixin = receiver ? withProps(receiver, service) : service;
            return Reflect.set(service, key, value, mixin);
          }
        });
    }, `ctx.mixin(${JSON.stringify(source)})`);
  }
  trace(value) {
    return getTraceable(this.ctx, value);
  }
  bind(callback) {
    return new Proxy(callback, {
      apply: (target, thisArg, args) => {
        return Reflect.apply(target, this.trace(thisArg), args.map((arg) => this.trace(arg)));
      },
      construct: (target, args, newTarget) => {
        return Reflect.construct(target, args.map((arg) => this.trace(arg)), newTarget);
      }
    });
  }
};
var kValidationError = Symbol.for("ValidationError");
var ValidationError = class extends TypeError {
  name = "ValidationError";
  constructor(issues) {
    super(`invalid config:
` + issues.map((issue) => {
      if (issue.path)
        return `  - ${issue.message} (at ${issue.path.join(".")})`;
      else
        return `  - ${issue.message}`;
    }).join(`
`));
  }
};
Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
function resolveConfig(runtime, config) {
  if (!runtime.Config)
    return config;
  const result = runtime.Config["~standard"].validate(config);
  if ("then" in result)
    throw new TypeError("Async config validation is not supported");
  if (result.issues)
    throw new ValidationError(result.issues);
  else
    return result.value;
}
var effectInertia = /* @__PURE__ */ new WeakMap;
function runDisposable(dispose) {
  const result = dispose();
  return effectInertia.get(dispose)?.() ?? result;
}
function emitPluginDisposed(context, fiber) {
  const args = ["internal/plugin", fiber];
  let callbacks;
  try {
    callbacks = context.events.dispatch("emit", args);
  } catch (error) {
    context.logger.error(error);
    return;
  }
  for (const callback of callbacks)
    try {
      const returned = callback(...args);
      Promise.resolve(returned).catch((error) => context.logger.error(error));
    } catch (error) {
      context.logger.error(error);
    }
}
var CordisError = class CordisError extends Error {
  code;
  constructor(code, message) {
    super(message ?? CordisError.Code[code]);
    this.code = code;
  }
};
(function(CordisError) {
  CordisError.Code = { INACTIVE_EFFECT: "cannot create effect on inactive context" };
})(CordisError || (CordisError = {}));
var INACTIVE = "__INACTIVE__";
var Fiber = class {
  parent;
  inject;
  runtime;
  uid;
  ctx;
  config;
  _config;
  state = 0;
  dispose;
  store;
  inertia;
  _hooks = Object.create(null);
  _disposables = new DisposableList;
  context;
  _error;
  _runner;
  _store = Object.create(null);
  constructor(parent, config, inject, runtime, getOuterStack) {
    this.parent = parent;
    this.inject = inject;
    this.runtime = runtime;
    this._config = config;
    const collect = (dispose) => {
      this._disposables.push(dispose);
    };
    if (runtime) {
      this.uid = parent.registry.counter;
      this.ctx = this.context = parent.extend({ fiber: this });
      const injectEntries = Object.entries(this.inject);
      if (injectEntries.length) {
        this.ctx[Context.intercept] = Object.create(parent[Context.intercept]);
        for (const [name, config] of injectEntries) {
          if (isNullable(config))
            continue;
          this.ctx[Context.intercept][name] = config;
        }
      }
      this._runner = {
        epoch: INACTIVE,
        getOuterStack,
        execute: function() {
          if (isConstructor(runtime.callback)) {
            const instance = new runtime.callback(this.ctx, this.config);
            for (const hook of instance?.[symbols.initHooks] ?? [])
              hook();
            return instance?.[symbols.init]?.();
          } else
            return runtime.callback(this.ctx, this.config);
        },
        collect
      };
      this.dispose = parent.fiber.effect(() => {
        const remove = runtime.fibers.push(this);
        return async () => {
          this.uid = null;
          emitPluginDisposed(this.context, this);
          if (this.ctx.registry.has(runtime.callback)) {
            remove();
            if (!runtime.fibers.length)
              this.ctx.registry.delete(runtime.callback);
          }
          this._setEpoch(INACTIVE);
          if (!this.inertia)
            this._updateState(() => {
              this.inertia = this._unload();
              return 5;
            });
          while (this.inertia)
            await this.inertia;
        };
      }, "ctx.plugin()");
      try {
        this.context.emit("internal/plugin", this);
      } catch (error) {
        Promise.resolve(this.dispose()).catch((reason) => this.ctx.logger.error(reason));
        throw error;
      }
      if (this.uid !== null && parent.fiber.state !== 5) {
        for (const name of Object.keys(this.inject))
          this._checkImpl(name);
        this._refresh();
      }
    } else {
      this.uid = 0;
      this.ctx = this.context = parent;
      this.state = 2;
      this.store = Object.create(null);
      this._runner = {
        epoch: "",
        getOuterStack,
        execute: () => {},
        collect
      };
      this.dispose = () => this.restart();
    }
  }
  get name() {
    let fiber = this;
    do {
      if (fiber.runtime?.name)
        return fiber.runtime.name;
      fiber = fiber.parent.fiber;
    } while (fiber !== fiber.parent.fiber);
    return "root";
  }
  assertActive() {
    if (this.uid !== null)
      return;
    throw new CordisError("INACTIVE_EFFECT");
  }
  _execute(runner) {
    const oldEpoch = runner.epoch;
    return composeError((info) => {
      const safeCollect = (dispose) => {
        if (typeof dispose === "function")
          runner.collect(dispose);
        else if (!isNullable(dispose))
          throw new TypeError("Invalid effect");
      };
      const effect = runner.execute.call(this);
      if (typeof effect === "function")
        return runner.collect(effect);
      else if (isNullable(effect)) {} else if (!isObject(effect))
        throw new TypeError("Invalid effect");
      else if ("then" in effect)
        return effect.then(safeCollect);
      else if (Symbol.iterator in effect) {
        info.error = /* @__PURE__ */ new Error;
        const iter = effect[Symbol.iterator]();
        while (true) {
          const result = iter.next();
          safeCollect(result.value);
          if (result.done)
            return;
        }
      } else if (Symbol.asyncIterator in effect) {
        const iter = effect[Symbol.asyncIterator]();
        return (async () => {
          await Promise.resolve();
          info.error = /* @__PURE__ */ new Error;
          while (true) {
            if (runner.epoch !== oldEpoch)
              return;
            const result = await iter.next();
            safeCollect(result.value);
            if (result.done)
              return;
          }
        })();
      } else
        throw new TypeError("Invalid effect");
    }, runner.getOuterStack);
  }
  effect(execute, label = "anonymous") {
    this.assertActive();
    if (this.state === 5)
      throw new CordisError("INACTIVE_EFFECT");
    const disposables = [];
    let disposing = false;
    let disposalTask;
    const dispose = () => {
      if (disposing)
        return disposalTask;
      disposing = true;
      let task;
      for (const disposable of disposables.splice(0).reverse())
        if (task)
          task = task.then(() => runDisposable(disposable));
        else {
          const result = runDisposable(disposable);
          if (isObject(result) && "then" in result)
            task = result;
        }
      return disposalTask = task;
    };
    const meta = {
      label,
      children: []
    };
    const runner = {
      execute,
      epoch: true,
      collect: (dispose) => {
        disposables.push(dispose);
        this._disposables.delete(dispose);
        if (dispose[symbols.effect])
          meta.children.push(dispose[symbols.effect]);
      },
      getOuterStack: buildOuterStack()
    };
    let task;
    let executing = true;
    let resolveSetup;
    let rejectSetup;
    let setupBarrier;
    let setupFailed = false;
    let inFlight;
    let removeWrapper = () => false;
    const waitForSetup = () => {
      setupBarrier ??= new Promise((resolve, reject) => {
        resolveSetup = resolve;
        rejectSetup = reject;
      });
      return setupBarrier;
    };
    const disposeAfter = (setup) => {
      return Promise.resolve(setup).then(() => dispose(), async (reason) => {
        await dispose();
        throw reason;
      });
    };
    const finalizeDisposal = (callback) => {
      let result;
      try {
        result = callback();
      } catch (error) {
        removeWrapper();
        throw error;
      }
      if (isObject(result) && "then" in result) {
        const pending = Promise.resolve(result).finally(() => {
          removeWrapper();
          if (inFlight === pending)
            inFlight = undefined;
        });
        return inFlight = pending;
      }
      removeWrapper();
      return result;
    };
    const wrapper = defineProperty(() => {
      if (!runner.epoch)
        return setupFailed ? inFlight : undefined;
      runner.epoch = false;
      return finalizeDisposal(() => {
        if (executing)
          return disposeAfter(waitForSetup());
        return task ? disposeAfter(task) : dispose();
      });
    }, symbols.effect, meta);
    effectInertia.set(wrapper, () => inFlight);
    removeWrapper = this._disposables.push(wrapper);
    try {
      task = this._execute(runner);
    } catch (reason) {
      executing = false;
      setupFailed = true;
      runner.epoch = false;
      let cleanup;
      try {
        cleanup = finalizeDisposal(dispose);
      } finally {
        rejectSetup?.(reason);
      }
      if (isObject(cleanup) && "then" in cleanup)
        cleanup.catch((error) => this.ctx.logger.error(error));
      throw reason;
    }
    executing = false;
    if (setupBarrier)
      Promise.resolve(task).then(resolveSetup, rejectSetup);
    task?.catch(() => {
      if (!runner.epoch)
        return dispose();
      return finalizeDisposal(dispose);
    }).catch((error) => this.ctx.logger.error(error));
    const disposeAsync = () => {
      if (!runner.epoch)
        return;
      runner.epoch = false;
      return finalizeDisposal(dispose);
    };
    wrapper.then = async (onFulfilled, onRejected) => {
      return Promise.resolve(task).then(() => disposeAsync).then(onFulfilled, onRejected);
    };
    return wrapper;
  }
  getEffects() {
    return [...this._disposables].map((dispose) => dispose[symbols.effect]).filter(Boolean);
  }
  _getState() {
    if (this.uid === null)
      return 4;
    if (this._error)
      return 3;
    if (this._runner.epoch !== INACTIVE)
      return 2;
    return 0;
  }
  _updateState(callback) {
    const oldState = this.state;
    this.state = callback() ?? this._getState();
    if (oldState === this.state)
      return;
    this.context.emit("internal/status", this, oldState);
    if (oldState !== 2 && this.state !== 2)
      return;
    for (const key of Reflect.ownKeys(this.ctx.reflect.store)) {
      const impl = this.ctx.reflect.store[key];
      if (impl.fiber !== this)
        continue;
      this.ctx.reflect.notify([impl.name]);
    }
  }
  _checkImpl(name) {
    const impl = this.ctx.reflect._getImpl(name, true);
    if (!impl)
      return delete this._store[name];
    try {
      if (impl.check && !impl.check.call(getTraceable(this.ctx, impl.value)))
        return delete this._store[name];
    } catch (error) {
      impl.fiber.ctx.logger.error(error);
      return delete this._store[name];
    }
    this._store[name] = impl;
  }
  _refresh() {
    let epoch = false;
    epoch = "";
    for (const name of Object.keys(this.inject)) {
      const impl = this._store[name];
      if (!impl) {
        epoch = INACTIVE;
        break;
      }
      epoch += ":" + impl.fiber.uid;
    }
    this._setEpoch(epoch);
  }
  _setEpoch(epoch) {
    const oldEpoch = this._runner.epoch;
    if (epoch === oldEpoch)
      return;
    this._runner.epoch = epoch;
    if (this.inertia)
      return;
    this._updateState(() => {
      if (epoch !== INACTIVE && oldEpoch === INACTIVE) {
        this.inertia = this._reload();
        return 1;
      } else {
        this.inertia = this._unload();
        return 5;
      }
    });
  }
  _resolveConfig(config) {
    config = this.context.waterfall(this, "internal/config", config, () => config);
    return this.runtime ? resolveConfig(this.runtime, config) : config;
  }
  async _reload() {
    this.store = { ...this._store };
    const oldEpoch = this._runner.epoch;
    try {
      await Promise.resolve();
      if (this._runner.epoch === oldEpoch) {
        this.config = this._resolveConfig(this._config);
        await this._execute(this._runner);
        this._error = undefined;
      }
    } catch (reason) {
      this.ctx.logger.error(reason);
      this._error = reason;
      this._runner.epoch = INACTIVE;
    }
    this._updateState(() => {
      if (this._runner.epoch === oldEpoch)
        this.inertia = undefined;
      else {
        this.inertia = this._unload();
        return 5;
      }
    });
  }
  async _unload() {
    await Promise.all(this._disposables.clear().map(async (dispose) => {
      try {
        await composeError(async (info) => {
          await Promise.resolve();
          info.error = /* @__PURE__ */ new Error;
          await runDisposable(dispose);
        }, this._runner.getOuterStack);
      } catch (reason) {
        this.ctx.logger.error(reason);
      }
    }));
    this.store = undefined;
    this._updateState(() => {
      if (this._runner.epoch === INACTIVE)
        this.inertia = undefined;
      else {
        this.inertia = this._reload();
        return 1;
      }
    });
  }
  async await() {
    while (this.inertia)
      await this.inertia;
    if (this._error)
      throw this._error;
    return this;
  }
  async restart() {
    this.assertActive();
    this._setEpoch(INACTIVE);
    this._refresh();
    await this.await();
  }
  update(config, noSave = false) {
    this.assertActive();
    this._config = config;
    if (this.state !== 2) {
      this._error = undefined;
      this._setEpoch(INACTIVE);
      this._refresh();
      return;
    }
    config = this._resolveConfig(config);
    this.context.waterfall(this, "internal/update", config, noSave, () => {
      this.config = config;
      this._error = undefined;
      return this.restart();
    });
  }
};
function isApplicable(object) {
  return object && typeof object === "object" && typeof object.apply === "function";
}
function Inject(name, config) {
  return function(value, decorator) {
    if (decorator.kind === "class") {
      if (!Object.hasOwn(value, "inject")) {
        defineProperty(value, "inject", Object.create(Object.getPrototypeOf(value).inject ?? null));
        defineProperty(value.inject, symbols.checkProto, true);
      }
      value.inject[name] = config;
    } else if (decorator.kind === "method") {
      const inject = (value[symbols.metadata] ??= {}).inject ??= Object.create(null);
      inject[name] = config;
      decorator.addInitializer(function() {
        const property = this[symbols.tracker]?.property;
        (this[symbols.initHooks] ??= []).push(() => {
          this.ctx.inject(inject, (ctx) => {
            return value.call(property ? withProps(this, { [property]: ctx }) : this);
          });
        });
      });
    } else
      throw new Error("@Inject() can only be used on class or class methods");
  };
}
(function(Inject) {
  function resolve(inject, result = Object.create(null)) {
    if (!inject)
      return result;
    if (Array.isArray(inject))
      for (const name of inject)
        result[name] = null;
    else if (Reflect.has(inject, symbols.checkProto)) {
      Object.assign(result, resolve(Object.getPrototypeOf(inject)));
      for (const name of Object.keys(inject))
        result[name] = inject[name] ?? null;
    } else
      for (const name of Object.keys(inject))
        result[name] = inject[name] ?? null;
    return result;
  }
  Inject.resolve = resolve;
})(Inject || (Inject = {}));
var RegistryService = class {
  ctx;
  _counter = 0;
  _internal = /* @__PURE__ */ new Map;
  constructor(ctx) {
    this.ctx = ctx;
    defineProperty(this, symbols.tracker, {
      property: "ctx",
      noShadow: true
    });
  }
  get counter() {
    return ++this._counter;
  }
  get size() {
    return this._internal.size;
  }
  resolve(plugin) {
    try {
      if (typeof plugin === "function")
        return plugin;
      if (isApplicable(plugin))
        return plugin.apply;
    } catch {}
  }
  get(plugin) {
    const key = this.resolve(plugin);
    return key && this._internal.get(key);
  }
  has(plugin) {
    const key = this.resolve(plugin);
    return !!key && this._internal.has(key);
  }
  delete(plugin) {
    const key = this.resolve(plugin);
    const runtime = key && this._internal.get(key);
    if (!runtime)
      return;
    this._internal.delete(key);
    for (const fiber of runtime.fibers)
      fiber.dispose();
    return runtime;
  }
  keys() {
    return this._internal.keys();
  }
  values() {
    return this._internal.values();
  }
  entries() {
    return this._internal.entries();
  }
  forEach(callback) {
    return this._internal.forEach(callback);
  }
  inject(inject, callback) {
    return this.plugin({
      inject,
      apply: callback,
      name: callback.name
    });
  }
  plugin(plugin, config, getOuterStack = buildOuterStack()) {
    const callback = this.resolve(plugin);
    if (!callback)
      throw new Error('invalid plugin, expect function or object with an "apply" method, received ' + typeof plugin);
    this.ctx.fiber.assertActive();
    let runtime = this._internal.get(callback);
    if (!runtime) {
      let name = plugin.name;
      if (name === "apply")
        name = undefined;
      runtime = {
        name,
        callback,
        fibers: new DisposableList,
        Config: plugin.Config
      };
      this._internal.set(callback, runtime);
    }
    const fiber = new Fiber(this.ctx, config, Inject.resolve(plugin.inject), runtime, getOuterStack);
    const wrapped = Object.create(fiber);
    wrapped.then = (onFulfilled, onRejected) => {
      return fiber.await().then(onFulfilled, onRejected);
    };
    return wrapped;
  }
};
var Context = class Context {
  static effect = symbols.effect;
  static filter = symbols.filter;
  static isolate = symbols.isolate;
  static intercept = symbols.intercept;
  static is(value) {
    return !!value?.[Context.is];
  }
  static {
    Context.is[Symbol.toPrimitive] = () => Symbol.for("cordis.is");
    Context.prototype[Context.is] = true;
  }
  constructor() {
    this[symbols.isolate] = Object.create(null);
    this[symbols.intercept] = Object.create(null);
    const self = new Proxy(this, ReflectService.handler);
    this.root = self;
    this.baseUrl = undefined;
    this.fiber = new Fiber(self, {}, Object.create(null), null, () => []);
    this.reflect = new ReflectService(self);
    this.registry = new RegistryService(self);
    this.events = new EventsService(self);
    this.logger = new LoggerService(self);
    this.fiber._disposables.clear();
    return self;
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `Context <${this.fiber.name}>`;
  }
  extend(meta = {}) {
    const shadow = Reflect.getOwnPropertyDescriptor(this, symbols.shadow)?.value;
    const self = Object.create(getTraceable(this, this));
    for (const prop of Reflect.ownKeys(meta))
      Object.defineProperty(self, prop, Reflect.getOwnPropertyDescriptor(meta, prop));
    if (!shadow)
      return self;
    return Object.assign(Object.create(self), { [symbols.shadow]: shadow });
  }
  isolate(name, label) {
    const shadow = Object.create(this[symbols.isolate]);
    shadow[name] = label ?? Symbol(name);
    return this.extend({ [symbols.isolate]: shadow });
  }
  intercept(name, config) {
    const intercept = Object.create(this[symbols.intercept]);
    intercept[name] = config;
    return this.extend({ [symbols.intercept]: intercept });
  }
};
var Service = class Service {
  ctx;
  static init = symbols.init;
  static check = symbols.check;
  static config = symbols.config;
  static invoke = symbols.invoke;
  static extend = symbols.extend;
  static tracker = symbols.tracker;
  static resolveConfig = symbols.resolveConfig;
  name;
  constructor(ctx, name) {
    this.ctx = ctx;
    name ??= this.constructor["provide"];
    let self = this;
    const tracker = {
      associate: name,
      property: "ctx"
    };
    if (self[symbols.invoke])
      self = createCallable(name, joinPrototype(Object.getPrototypeOf(this), Function.prototype), tracker);
    self.ctx = ctx;
    self.name = name;
    defineProperty(self, symbols.tracker, tracker);
    self.ctx.reflect.provide(name, self, this[symbols.check]);
    return self;
  }
  [symbols.filter](ctx) {
    return ctx[symbols.isolate][this.name] === this.ctx[symbols.isolate][this.name];
  }
  [symbols.extend](props) {
    let self;
    if (this[Service.invoke])
      self = createCallable(this.name, this, this[symbols.tracker]);
    else
      self = Object.create(this);
    return Object.assign(self, props);
  }
  [symbols.resolveConfig](base, head) {
    let intercept = this.ctx[Context.intercept];
    const configs = [];
    while (this.name in intercept) {
      if (Object.hasOwn(intercept, this.name))
        configs.unshift(intercept[this.name]);
      intercept = Object.getPrototypeOf(intercept);
    }
    if (base)
      configs.unshift(base);
    if (head)
      configs.push(head);
    if (this["Config"]?.merge)
      return this["Config"].merge(...configs);
    else
      return Object.assign({}, ...configs);
  }
  static [Symbol.hasInstance](instance) {
    if (!instance)
      return false;
    let constructor = instance.constructor;
    while (constructor) {
      constructor = constructor.prototype?.constructor;
      if (constructor === this)
        return true;
      constructor &&= Object.getPrototypeOf(constructor);
    }
    return false;
  }
};
// node_modules/@deepseek-ai/schemastery/lib/index.mjs
var kSchema = Symbol.for("schemastery");
var kValidationError2 = Symbol.for("ValidationError");
globalThis.__schemastery_index__ ??= 0;
globalThis.__schemastery_refs__ = undefined;
var ValidationError2 = class extends TypeError {
  options;
  name = "ValidationError";
  constructor(message, options) {
    let prefix = "$";
    for (const segment of options.path || [])
      if (typeof segment === "string")
        prefix += "." + segment;
      else if (typeof segment === "number")
        prefix += "[" + segment + "]";
      else if (typeof segment === "symbol")
        prefix += `[Symbol(${segment.toString()})]`;
    if (prefix.startsWith("."))
      prefix = prefix.slice(1);
    super((prefix === "$" ? "" : `${prefix} `) + message);
    this.options = options;
  }
  static is(error) {
    return !!error?.[kValidationError2];
  }
};
Object.defineProperty(ValidationError2.prototype, kValidationError2, { value: true });
var Schema = function(options) {
  const schema = function(data, options = {}) {
    return Schema.resolve(data, schema, options)[0];
  };
  if (options.refs) {
    const refs = mapValues(options.refs, (options) => new Schema(options));
    const getRef = (uid) => refs[uid];
    for (const key in refs) {
      const options = refs[key];
      options.sKey = getRef(options.sKey);
      options.inner = getRef(options.inner);
      options.list = options.list && options.list.map(getRef);
      options.dict = options.dict && mapValues(options.dict, getRef);
    }
    return refs[options.uid];
  }
  Object.assign(schema, options);
  if (typeof schema.callback === "string")
    try {
      schema.callback = new Function("return " + schema.callback)();
    } catch {}
  Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
  Object.setPrototypeOf(schema, Schema.prototype);
  schema.meta ||= {};
  schema.toString = schema.toString.bind(schema);
  return schema;
};
Schema.prototype = Object.create(Function.prototype);
Schema.prototype[kSchema] = true;
Object.defineProperty(Schema.prototype, "~standard", { get() {
  return {
    version: 1,
    vendor: "schemastery",
    validate: (value) => {
      try {
        return { value: Schema.resolve(value, this, {})[0] };
      } catch (error) {
        if (ValidationError2.is(error))
          return { issues: [{
            message: error.message,
            path: error.options.path
          }] };
        throw error;
      }
    }
  };
} });
Schema.ValidationError = ValidationError2;
Schema.prototype.toJSON = function toJSON() {
  if (globalThis.__schemastery_refs__) {
    globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
    return this.uid;
  }
  globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
  globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
  const result = {
    uid: this.uid,
    refs: globalThis.__schemastery_refs__
  };
  globalThis.__schemastery_refs__ = undefined;
  return result;
};
Schema.prototype.set = function set(key, value) {
  this.dict[key] = value;
  return this;
};
Schema.prototype.push = function push(value) {
  this.list.push(value);
  return this;
};
function mergeDesc(original, messages) {
  const result = typeof original === "string" ? { "": original } : { ...original };
  for (const locale in messages) {
    const value = messages[locale];
    if (value?.$description || value?.$desc)
      result[locale] = value.$description || value.$desc;
    else if (typeof value === "string")
      result[locale] = value;
  }
  return result;
}
function getInner(value) {
  return value?.$value ?? value?.$inner;
}
function extractKeys(data) {
  return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
}
Schema.prototype.i18n = function i18n(messages) {
  const schema = Schema(this);
  const desc = mergeDesc(schema.meta.description, messages);
  if (Object.keys(desc).length)
    schema.meta.description = desc;
  if (schema.dict)
    schema.dict = mapValues(schema.dict, (inner, key) => {
      return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
    });
  if (schema.list)
    schema.list = schema.list.map((inner, index) => {
      return inner.i18n(mapValues(messages, (data = {}) => {
        if (Array.isArray(getInner(data)))
          return getInner(data)[index];
        if (Array.isArray(data))
          return data[index];
        return extractKeys(data);
      }));
    });
  if (schema.inner)
    schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
      if (getInner(data))
        return getInner(data);
      return extractKeys(data);
    }));
  if (schema.sKey)
    schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
  return schema;
};
Schema.prototype.extra = function extra(key, value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
};
for (const key of [
  "required",
  "disabled",
  "collapse",
  "hidden",
  "loose"
])
  Object.assign(Schema.prototype, { [key](value = true) {
    const schema = Schema(this);
    schema.meta = {
      ...schema.meta,
      [key]: value
    };
    return schema;
  } });
Schema.prototype.deprecated = function deprecated() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "deprecated",
    type: "danger"
  });
  return schema;
};
Schema.prototype.experimental = function experimental() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "experimental",
    type: "warning"
  });
  return schema;
};
Schema.prototype.pattern = function pattern(regexp) {
  const schema = Schema(this);
  const pattern = pick(regexp, ["source", "flags"]);
  schema.meta = {
    ...schema.meta,
    pattern
  };
  return schema;
};
Schema.prototype.simplify = function simplify(value) {
  if (isVolatile(value))
    value = value.get();
  if (deepEqual(value, this.meta.default, this.type === "dict"))
    return null;
  if (isNullable(value))
    return value;
  if (this.type === "object" || this.type === "dict") {
    const result = {};
    for (const key in value) {
      const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
      if (this.type === "dict" || !isNullable(item))
        result[key] = item;
    }
    if (deepEqual(result, this.meta.default, this.type === "dict"))
      return null;
    return result;
  } else if (this.type === "array" || this.type === "tuple") {
    const result = [];
    value.forEach((value, index) => {
      const schema = this.type === "array" ? this.inner : this.list[index];
      const item = schema ? schema.simplify(value) : value;
      result.push(item);
    });
    return result;
  } else if (this.type === "intersect") {
    const result = {};
    for (const item of this.list)
      Object.assign(result, item.simplify(value));
    return result;
  } else if (this.type === "union")
    for (const schema of this.list)
      try {
        Schema.resolve(value, schema, {});
        return schema.simplify(value);
      } catch {}
  return value;
};
Schema.prototype.toString = function toString(inline) {
  return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
};
Schema.prototype.role = function role(role, extra) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    role,
    extra
  };
  return schema;
};
for (const key of [
  "default",
  "link",
  "comment",
  "description",
  "max",
  "min",
  "step"
])
  Object.assign(Schema.prototype, { [key](value) {
    const schema = Schema(this);
    schema.meta = {
      ...schema.meta,
      [key]: value
    };
    return schema;
  } });
Schema.prototype.volatile = function volatile() {
  if (this.meta.volatile)
    throw new TypeError("volatile schema is already wrapped");
  return this.extra("volatile", true);
};
var resolvers = {};
var checkedVolatile = Symbol("checked-volatile-schema");
function validateVolatileSchema(schema, path = [], blocked = false, seen = /* @__PURE__ */ new Map) {
  const states = seen.get(schema) ?? /* @__PURE__ */ new Set;
  if (states.has(blocked))
    return;
  states.add(blocked);
  seen.set(schema, states);
  if (schema.meta?.volatile && blocked)
    throw new ValidationError2("volatile fields require a fixed object path without an enclosing volatile field", { path });
  const nested = blocked || !!schema.meta?.volatile;
  if (schema.dict)
    for (const [key, child] of Object.entries(schema.dict))
      validateVolatileSchema(child, [...path, key], nested, seen);
  if (schema.sKey)
    validateVolatileSchema(schema.sKey, [...path, "<key>"], true, seen);
  if (schema.inner && (schema.type !== "lazy" || schema.inner[kSchema]))
    validateVolatileSchema(schema.inner, [...path, "*"], true, seen);
  if (schema.list)
    for (let index = 0;index < schema.list.length; index++)
      validateVolatileSchema(schema.list[index], [...path, String(index)], true, seen);
}
Schema.extend = function extend(type, resolve) {
  resolvers[type] = resolve;
};
Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
  if (!schema)
    return [data];
  if (!options[checkedVolatile]) {
    validateVolatileSchema(schema, options.path);
    options = {
      ...options,
      [checkedVolatile]: true
    };
  }
  if (schema.meta?.volatile) {
    const inner = Schema(schema);
    inner.meta = {
      ...schema.meta,
      volatile: false
    };
    const [value, adapted] = Schema.resolve(data, inner, options, strict);
    try {
      return [createVolatile(value), adapted];
    } catch (error) {
      throw new ValidationError2(error instanceof Error ? error.message : String(error), options);
    }
  }
  if (options.ignore?.(data, schema))
    return [data];
  if (isNullable(data) && schema.type !== "lazy") {
    if (schema.meta.required)
      throw new ValidationError2(`missing required value`, options);
    let current = schema;
    let fallback = schema.meta.default;
    while (current?.type === "intersect" && isNullable(fallback)) {
      current = current.list[0];
      fallback = current?.meta.default;
    }
    if (isNullable(fallback))
      return [data];
    data = clone(fallback);
  }
  const callback = resolvers[schema.type];
  if (!callback)
    throw new ValidationError2(`unsupported type "${schema.type}"`, options);
  try {
    return callback(data, schema, options, strict);
  } catch (error) {
    if (!schema.meta.loose)
      throw error;
    return [schema.meta.default];
  }
};
Schema.from = function from(source) {
  if (isNullable(source))
    return Schema.any();
  else if ([
    "string",
    "number",
    "boolean"
  ].includes(typeof source))
    return Schema.const(source).required();
  else if (source[kSchema])
    return source;
  else if (typeof source === "function")
    switch (source) {
      case String:
        return Schema.string().required();
      case Number:
        return Schema.number().required();
      case Boolean:
        return Schema.boolean().required();
      case Function:
        return Schema.function().required();
      default:
        return Schema.is(source).required();
    }
  else
    throw new TypeError(`cannot infer schema from ${source}`);
};
Schema.lazy = function lazy(builder) {
  const toJSON = () => {
    if (!schema.inner[kSchema]) {
      schema.inner = schema.builder();
      schema.inner.meta = {
        ...schema.meta,
        ...schema.inner.meta
      };
    }
    return schema.inner.toJSON();
  };
  const schema = new Schema({
    type: "lazy",
    builder,
    inner: { toJSON }
  });
  return schema;
};
Schema.natural = function natural() {
  return Schema.number().step(1).min(0);
};
Schema.percent = function percent() {
  return Schema.number().step(0.01).min(0).max(1).role("slider");
};
Schema.date = function date() {
  return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
    const date = new Date(value);
    if (isNaN(+date))
      throw new ValidationError2(`invalid date "${value}"`, options);
    return date;
  }, true)]);
};
Schema.regExp = function regExp(flag = "") {
  return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
    try {
      return new RegExp(value, flag);
    } catch (e) {
      throw new ValidationError2(e.message, options);
    }
  }, true)]);
};
Schema.arrayBuffer = function arrayBuffer(encoding) {
  return Schema.union([
    Schema.is(ArrayBuffer),
    Schema.is(SharedArrayBuffer),
    Schema.transform(Schema.any(), (value, options) => {
      if (Binary.isSource(value))
        return Binary.fromSource(value);
      throw new ValidationError2(`expected ArrayBufferSource but got ${value}`, options);
    }, true),
    ...encoding ? [Schema.transform(Schema.string(), (value, options) => {
      try {
        return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
      } catch (e) {
        throw new ValidationError2(e.message, options);
      }
    }, true)] : []
  ]);
};
Schema.extend("lazy", (data, schema, options, strict) => {
  if (!schema.inner[kSchema]) {
    schema.inner = schema.builder();
    schema.inner.meta = {
      ...schema.meta,
      ...schema.inner.meta
    };
    validateVolatileSchema(schema.inner, options.path, true);
  }
  return Schema.resolve(data, schema.inner, options, strict);
});
Schema.extend("any", (data) => {
  return [data];
});
Schema.extend("never", (data, _, options) => {
  throw new ValidationError2(`expected nullable but got ${data}`, options);
});
Schema.extend("const", (data, { value }, options) => {
  if (deepEqual(data, value))
    return [value];
  throw new ValidationError2(`expected ${value} but got ${data}`, options);
});
function checkWithinRange(data, meta, description, options, skipMin = false) {
  const { max = Infinity, min = -Infinity } = meta;
  if (data > max)
    throw new ValidationError2(`expected ${description} <= ${max} but got ${data}`, options);
  if (data < min && !skipMin)
    throw new ValidationError2(`expected ${description} >= ${min} but got ${data}`, options);
}
Schema.extend("string", (data, { meta }, options) => {
  if (typeof data !== "string")
    throw new ValidationError2(`expected string but got ${data}`, options);
  if (meta.pattern) {
    const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
    if (!regexp.test(data))
      throw new ValidationError2(`expect string to match regexp ${regexp}`, options);
  }
  checkWithinRange(data.length, meta, "string length", options);
  return [data];
});
function decimalShift(data, digits) {
  const str = data.toString();
  if (str.includes("e"))
    return data * Math.pow(10, digits);
  const index = str.indexOf(".");
  if (index === -1)
    return data * Math.pow(10, digits);
  const frac = str.slice(index + 1);
  const integer = str.slice(0, index);
  if (frac.length <= digits)
    return +(integer + frac.padEnd(digits, "0"));
  return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
}
function isMultipleOf(data, min, step) {
  step = Math.abs(step);
  if (!/^\d+\.\d+$/.test(step.toString()))
    return (data - min) % step === 0;
  const index = step.toString().indexOf(".");
  const digits = step.toString().slice(index + 1).length;
  return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
}
Schema.extend("number", (data, { meta }, options) => {
  if (typeof data !== "number")
    throw new ValidationError2(`expected number but got ${data}`, options);
  checkWithinRange(data, meta, "number", options);
  const { step } = meta;
  if (step && !isMultipleOf(data, meta.min ?? 0, step))
    throw new ValidationError2(`expected number multiple of ${step} but got ${data}`, options);
  return [data];
});
Schema.extend("boolean", (data, _, options) => {
  if (typeof data === "boolean")
    return [data];
  throw new ValidationError2(`expected boolean but got ${data}`, options);
});
Schema.extend("bitset", (data, { bits, meta }, options) => {
  let value = 0, keys = [];
  if (typeof data === "number") {
    value = data;
    for (const key in bits)
      if (data & bits[key])
        keys.push(key);
  } else if (Array.isArray(data)) {
    keys = data;
    for (const key of keys) {
      if (typeof key !== "string")
        throw new ValidationError2(`expected string but got ${key}`, options);
      if (key in bits)
        value |= bits[key];
    }
  } else
    throw new ValidationError2(`expected number or array but got ${data}`, options);
  if (value === meta.default)
    return [value];
  return [value, keys];
});
Schema.extend("function", (data, _, options) => {
  if (typeof data === "function")
    return [data];
  throw new ValidationError2(`expected function but got ${data}`, options);
});
Schema.extend("is", (data, { constructor }, options) => {
  if (typeof constructor === "function") {
    if (data instanceof constructor)
      return [data];
    throw new ValidationError2(`expected ${constructor.name} but got ${data}`, options);
  } else {
    if (isNullable(data))
      throw new ValidationError2(`expected ${constructor} but got ${data}`, options);
    let prototype = Object.getPrototypeOf(data);
    while (prototype) {
      if (prototype.constructor?.name === constructor)
        return [data];
      prototype = Object.getPrototypeOf(prototype);
    }
    throw new ValidationError2(`expected ${constructor} but got ${data}`, options);
  }
});
function property(data, key, schema, options) {
  try {
    const [value, adapted] = Schema.resolve(data[key], schema, {
      ...options,
      path: [...options.path || [], key]
    });
    if (adapted !== undefined)
      data[key] = adapted;
    return value;
  } catch (e) {
    if (!options?.autofix)
      throw e;
    delete data[key];
    return schema.meta.volatile ? createVolatile(schema.meta.default) : schema.meta.default;
  }
}
Schema.extend("array", (data, { inner, meta }, options) => {
  if (!Array.isArray(data))
    throw new ValidationError2(`expected array but got ${data}`, options);
  checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
  return [data.map((_, index) => property(data, index, inner, options))];
});
Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
  if (!isPlainObject(data))
    throw new ValidationError2(`expected object but got ${data}`, options);
  const result = {};
  for (const key in data) {
    let rKey;
    try {
      rKey = Schema.resolve(key, sKey, options)[0];
    } catch (error) {
      if (strict)
        continue;
      throw error;
    }
    result[rKey] = property(data, key, inner, options);
    data[rKey] = data[key];
    if (key !== rKey)
      delete data[key];
  }
  return [result];
});
Schema.extend("tuple", (data, { list }, options, strict) => {
  if (!Array.isArray(data))
    throw new ValidationError2(`expected array but got ${data}`, options);
  const result = list.map((inner, index) => property(data, index, inner, options));
  if (strict)
    return [result];
  result.push(...data.slice(list.length));
  return [result];
});
function merge(result, data) {
  for (const key in data) {
    if (key in result)
      continue;
    result[key] = data[key];
  }
}
Schema.extend("object", (data, { dict }, options, strict) => {
  if (!isPlainObject(data))
    throw new ValidationError2(`expected object but got ${data}`, options);
  const result = {};
  for (const key in dict) {
    const value = property(data, key, dict[key], options);
    if (!isNullable(value) || key in data)
      result[key] = value;
  }
  if (!strict)
    merge(result, data);
  return [result];
});
Schema.extend("union", (data, { list, toString }, options, strict) => {
  const messages = [];
  for (const inner of list)
    try {
      return Schema.resolve(data, inner, options, strict);
    } catch (error) {
      messages.push(error);
    }
  throw new ValidationError2(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
});
Schema.extend("intersect", (data, { list, toString }, options, strict) => {
  if (!list.length)
    return [data];
  let result;
  for (const inner of list) {
    const value = Schema.resolve(data, inner, options, true)[0];
    if (isNullable(value))
      continue;
    if (isNullable(result))
      result = value;
    else if (typeof result !== typeof value)
      throw new ValidationError2(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
    else if (typeof value === "object")
      merge(result ??= {}, value);
    else if (result !== value)
      throw new ValidationError2(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
  }
  if (!strict && isPlainObject(data))
    merge(result, data);
  return [result];
});
Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
  const [result, adapted = data] = Schema.resolve(data, inner, options, true);
  if (preserve)
    return [callback(result)];
  else
    return [callback(result), callback(adapted)];
});
var formatters = {};
function defineMethod(name, keys, format) {
  formatters[name] = format;
  Object.assign(Schema, { [name](...args) {
    const schema = new Schema({ type: name });
    keys.forEach((key, index) => {
      switch (key) {
        case "sKey":
          schema.sKey = args[index] ?? Schema.string();
          break;
        case "inner":
          schema.inner = Schema.from(args[index]);
          break;
        case "list":
          schema.list = args[index].map(Schema.from);
          break;
        case "dict":
          schema.dict = mapValues(args[index], Schema.from);
          break;
        case "bits":
          schema.bits = {};
          for (const key in args[index]) {
            if (typeof args[index][key] !== "number")
              continue;
            schema.bits[key] = args[index][key];
          }
          break;
        case "callback": {
          const callback = schema.callback = args[index];
          callback["toJSON"] ||= () => callback.toString();
          break;
        }
        case "constructor": {
          const constructor = schema.constructor = args[index];
          if (typeof constructor === "function")
            constructor["toJSON"] ||= () => constructor["name"];
          break;
        }
        default:
          schema[key] = args[index];
      }
    });
    if (name === "object" || name === "dict")
      schema.meta.default = {};
    else if (name === "array" || name === "tuple")
      schema.meta.default = [];
    else if (name === "bitset")
      schema.meta.default = 0;
    return schema;
  } });
}
defineMethod("is", ["constructor"], ({ constructor }) => {
  if (typeof constructor === "function")
    return constructor.name;
  else
    return constructor;
});
defineMethod("any", [], () => "any");
defineMethod("never", [], () => "never");
defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
defineMethod("string", [], () => "string");
defineMethod("number", [], () => "number");
defineMethod("boolean", [], () => "boolean");
defineMethod("bitset", ["bits"], () => "bitset");
defineMethod("function", [], () => "function");
defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
defineMethod("object", ["dict"], ({ dict }) => {
  if (Object.keys(dict).length === 0)
    return "{}";
  return `{ ${Object.entries(dict).map(([key, inner]) => {
    return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
  }).join(", ")} }`;
});
defineMethod("union", ["list"], ({ list }, inline) => {
  const result = list.map(({ toString: format }) => format()).join(" | ");
  return inline ? `(${result})` : result;
});
defineMethod("intersect", ["list"], ({ list }) => {
  return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
});
defineMethod("transform", [
  "inner",
  "callback",
  "preserve"
], ({ inner }, isInner) => inner.toString(isInner));

// node_modules/@deepseek-ai/dsh-client-connection/lib/client.node.js
var MAX_TIMER_MS = 2147483647;
var ConnectionRecoveryConfigSchema = Schema.object({
  backoffBaseMs: Schema.natural().min(1).max(MAX_TIMER_MS).default(500),
  backoffFactor: Schema.number().min(1).max(Number.MAX_VALUE).default(2),
  backoffMaxMs: Schema.natural().min(1).max(MAX_TIMER_MS).default(1e4),
  generationReadyWarnMs: Schema.natural().min(1).max(MAX_TIMER_MS).default(3000),
  generationReadyTimeoutMs: Schema.natural().min(1).max(MAX_TIMER_MS).default(15000)
});
function resolveConnectionConfig(config = {}) {
  const resolved = ConnectionRecoveryConfigSchema(config);
  if (!Number.isFinite(resolved.backoffFactor))
    throw new RangeError("connection recovery backoffFactor must be finite");
  return resolved;
}
var MANUAL_RECONNECT = /* @__PURE__ */ new Error("connection: manual reconnect requested");
var NETWORK_STATE_CHANGED = /* @__PURE__ */ new Error("connection: browser network state changed");
function sleep(ms, signal) {
  return new Promise((resolve) => {
    const t = setTimeout(done, ms);
    signal.addEventListener("abort", done, { once: true });
    function done() {
      clearTimeout(t);
      signal.removeEventListener("abort", done);
      resolve();
    }
  });
}
function waitForAbort(signal) {
  if (signal.aborted)
    return Promise.resolve();
  return new Promise((resolve) => {
    signal.addEventListener("abort", () => {
      resolve();
    }, { once: true });
  });
}
var ConnectionController = class {
  source;
  sinks;
  generation = 0;
  attempt = 0;
  current = null;
  retryDelay = null;
  running = false;
  immediateRetry = false;
  networkAvailable = true;
  lastState;
  config;
  constructor(source, sinks = {}, config = {}) {
    this.source = source;
    this.sinks = sinks;
    this.config = resolveConnectionConfig(config);
  }
  start() {
    if (this.running)
      return;
    this.running = true;
    this.loop();
  }
  stop() {
    this.running = false;
    this.current?.abort();
    this.current = null;
    this.retryDelay?.abort();
    this.retryDelay = null;
  }
  reconnect() {
    if (!this.running)
      return;
    this.attempt = 0;
    this.immediateRetry = true;
    this.emitState("connecting");
    if (!this.isRunning())
      return;
    this.current?.abort(MANUAL_RECONNECT);
    this.retryDelay?.abort(MANUAL_RECONNECT);
  }
  setNetworkAvailable(available) {
    if (this.networkAvailable === available)
      return;
    this.networkAvailable = available;
    this.attempt = 0;
    this.immediateRetry = false;
    if (!this.running)
      return;
    this.emitState(available ? "connecting" : "disconnected");
    if (!this.isRunning())
      return;
    this.current?.abort(NETWORK_STATE_CHANGED);
    this.retryDelay?.abort(NETWORK_STATE_CHANGED);
  }
  backoffCap(attempt) {
    const { backoffBaseMs, backoffFactor, backoffMaxMs } = this.config;
    return Math.min(backoffMaxMs, backoffBaseMs * backoffFactor ** Math.max(0, attempt - 1));
  }
  backoffDelay(attempt) {
    const cap = this.backoffCap(attempt);
    return cap / 2 + Math.random() * (cap / 2);
  }
  isRetryInterrupted(immediate) {
    return this.immediateRetry || !this.networkAvailable && !immediate;
  }
  isRunning() {
    return this.running;
  }
  isGenerationActive(controller) {
    return this.isRunning() && !controller.signal.aborted;
  }
  async loop() {
    let retry = false;
    while (this.running) {
      if (!this.networkAvailable && !this.immediateRetry) {
        const retryDelay = new AbortController;
        this.retryDelay = retryDelay;
        this.emitState("disconnected");
        await waitForAbort(retryDelay.signal);
        if (this.retryDelay === retryDelay)
          this.retryDelay = null;
        if (!this.isRunning())
          return;
        retry = true;
        continue;
      }
      let manualAttempt = false;
      if (retry) {
        const immediate = this.immediateRetry;
        this.immediateRetry = false;
        if (immediate)
          this.attempt = 0;
        manualAttempt = immediate;
        const attempt = ++this.attempt;
        this.emitState("connecting");
        if (!this.isRunning())
          return;
        if (this.isRetryInterrupted(immediate))
          continue;
        if (!immediate) {
          const retryDelay = new AbortController;
          this.retryDelay = retryDelay;
          await sleep(this.backoffDelay(attempt), retryDelay.signal);
          if (this.retryDelay === retryDelay)
            this.retryDelay = null;
          if (!this.isRunning())
            return;
          if (retryDelay.signal.aborted)
            continue;
        }
        console.warn(`[connection] connection lost, retry #${String(attempt)}`);
        this.callSink(() => {
          this.sinks.onReconnectRequested?.();
        });
        if (!this.isRunning())
          return;
      }
      const gen = ++this.generation;
      const ac = new AbortController;
      this.current = ac;
      let sourceReady = false;
      let resolveReady;
      let rejectReady;
      let rejectSourceLost;
      const ready = new Promise((resolve, reject) => {
        resolveReady = resolve;
        rejectReady = reject;
      });
      const sourceLost = new Promise((_resolve, reject) => {
        rejectSourceLost = reject;
      });
      const reportReady = (host) => {
        if (sourceReady || gen !== this.generation || !this.isGenerationActive(ac))
          return;
        sourceReady = true;
        resolveReady(host);
      };
      const failed = new Promise((resolve) => {
        const settle = () => {
          if (gen === this.generation && !ac.signal.aborted)
            ac.abort();
          resolve();
        };
        Promise.resolve().then(() => this.source(ac.signal, reportReady)).then(() => {
          const error = /* @__PURE__ */ new Error("connection generation ended");
          if (!sourceReady)
            rejectReady(error);
          rejectSourceLost(error);
          settle();
        }, (error) => {
          const failure = error instanceof Error ? error : new Error("connection generation failed", { cause: error });
          if (!sourceReady)
            rejectReady(failure);
          rejectSourceLost(failure);
          settle();
        });
      });
      try {
        const host = await Promise.race([waitForReady(ready, this.config, ac.signal), sourceLost]);
        if (ac.signal.aborted)
          throw new Error("generation aborted during readiness handshake");
        this.attempt = 0;
        this.emitState("connected");
        if (this.isGenerationActive(ac))
          this.callSink(() => {
            this.sinks.onConnected?.(host);
          });
      } catch (error) {
        if (!ac.signal.aborted)
          ac.abort(error);
      }
      await failed;
      if (!this.isRunning())
        return;
      if (manualAttempt)
        this.attempt = 0;
      retry = true;
    }
  }
  emitState(state) {
    if (this.lastState === state)
      return;
    this.lastState = state;
    this.callSink(() => this.sinks.onStateChange?.(state));
  }
  callSink(fn) {
    try {
      fn();
    } catch (error) {
      console.error("[connection] connection sink threw:", error);
    }
  }
};
function waitForReady(ready, config, signal) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const warning = setTimeout(() => {
      console.warn(`[connection] generation is still not ready after ${String(config.generationReadyWarnMs)}ms`);
    }, config.generationReadyWarnMs);
    const timeout = setTimeout(() => {
      const error = /* @__PURE__ */ new Error(`connection generation was not ready within ${String(config.generationReadyTimeoutMs)}ms`);
      console.warn(`[connection] ${error.message}; cancelling generation`);
      finish({ error });
    }, config.generationReadyTimeoutMs);
    const aborted = () => {
      finish({ error: new Error("connection generation aborted", { cause: signal.reason }) });
    };
    const finish = (outcome) => {
      if (settled)
        return;
      settled = true;
      clearTimeout(warning);
      clearTimeout(timeout);
      signal.removeEventListener("abort", aborted);
      if ("error" in outcome)
        reject(outcome.error);
      else
        resolve(outcome.value);
    };
    signal.addEventListener("abort", aborted, { once: true });
    ready.then((value) => {
      finish({ value });
    }, (error) => {
      finish({ error });
    });
  });
}
function RpcId(id) {
  return id;
}
function randomUuid() {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  view.setUint8(6, view.getUint8(6) & 15 | 64);
  view.setUint8(8, view.getUint8(8) & 63 | 128);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
var CHANNEL_PATTERN = /^\/[A-Za-z0-9._~-]+$/;
var ENDPOINT_SEGMENT_PATTERN = /^[A-Za-z0-9_$.-]+$/;
function createWebConnectionRpc(doFetch, openStream) {
  const send = doFetch ?? ((input, init) => globalThis.fetch(input, init));
  return {
    async call(channel, endpoint, payload, signal) {
      assertTarget(channel, endpoint);
      const rpcId = RpcId(randomUuid());
      const message = {
        type: "client-request",
        rpcId,
        method: endpoint,
        payload
      };
      const response = await send(`${channel}/${endpoint}`.slice(1), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(message),
        ...signal === undefined ? {} : { signal }
      });
      if (!response.ok)
        throw new Error(`transport failure for ${channel}/${endpoint}: HTTP ${response.status}`);
      const full = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() === "multipart/form-data" ? await parseBinaryResponse(response) : parseConnectionResponse(await response.json());
      signal?.throwIfAborted();
      if (full.rpcId !== rpcId)
        throw new Error(`rpcId mismatch for ${endpoint}: sent ${rpcId}, got ${full.rpcId}`);
      return full.result;
    },
    ...openStream === undefined ? {} : { open(channel, endpoint, payload, signal, uplink) {
      assertTarget(channel, endpoint);
      if (channel !== "/api")
        throw new Error(`connection: worker-local streams require the /api channel, got ${JSON.stringify(channel)}`);
      return openStream(endpoint, payload, signal, uplink);
    } }
  };
}
async function parseBinaryResponse(response) {
  const body = await response.formData();
  const fields = /* @__PURE__ */ new Map;
  for (const [name, value] of body) {
    if (fields.has(name))
      throw new TypeError("connection: invalid binary response fields");
    fields.set(name, value);
  }
  const metadata = fields.get("metadata");
  fields.delete("metadata");
  if (typeof metadata !== "string")
    throw new TypeError("connection: invalid binary response fields");
  const envelope = JSON.parse(metadata);
  const full = parseConnectionResponse(envelope);
  if (!full.result.ok || !isRecord(envelope) || !Array.isArray(envelope.attachments) || envelope.attachments.length === 0)
    throw new TypeError("connection: invalid binary response result");
  const root = { value: full.result.value };
  for (const attachment of envelope.attachments) {
    if (!isRecord(attachment) || attachment.codec !== "bytes" || typeof attachment.part !== "string" || !Array.isArray(attachment.path))
      throw new TypeError("connection: invalid binary response attachment");
    const data = fields.get(attachment.part);
    fields.delete(attachment.part);
    if (!(data instanceof Blob))
      throw new TypeError("connection: invalid binary response fields");
    let parent = root;
    let key = "value";
    for (const segment of attachment.path) {
      const value = Reflect.get(parent, key);
      if (typeof value !== "object" || value === null)
        throw new TypeError("connection: invalid binary response path");
      if (Array.isArray(value)) {
        if (typeof segment !== "number" || !Number.isSafeInteger(segment) || segment < 0 || segment >= value.length)
          throw new TypeError("connection: invalid binary response path");
      } else if (typeof segment !== "string")
        throw new TypeError("connection: invalid binary response path");
      if (!Object.hasOwn(value, segment))
        throw new TypeError("connection: invalid binary response path");
      parent = value;
      key = segment;
    }
    if (Reflect.get(parent, key) !== null)
      throw new TypeError("connection: invalid binary response placeholder");
    Object.defineProperty(parent, key, {
      value: new Uint8Array(await data.arrayBuffer()),
      enumerable: true,
      writable: true,
      configurable: true
    });
  }
  if (fields.size !== 0)
    throw new TypeError("connection: invalid binary response fields");
  return {
    rpcId: full.rpcId,
    result: {
      ok: true,
      value: root.value
    }
  };
}
function parseConnectionResponse(value) {
  if (!isRecord(value) || value.type !== "server-response" || typeof value.rpcId !== "string")
    throw new TypeError("connection: invalid server-response envelope");
  const result = value.result;
  if (!isRecord(result))
    throw new TypeError("connection: invalid server-response result");
  if (result.ok === true)
    return {
      rpcId: RpcId(value.rpcId),
      result: {
        ok: true,
        value: result.value
      }
    };
  if (result.ok !== false || !isRecord(result.error))
    throw new TypeError("connection: invalid server-response result");
  const error = result.error;
  if (typeof error.code !== "string" || typeof error.message !== "string" || !isRecord(error.details))
    throw new TypeError("connection: invalid server-response failure");
  return {
    rpcId: RpcId(value.rpcId),
    result: {
      ok: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    }
  };
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function assertTarget(channel, endpoint) {
  const segments = endpoint.split("/");
  if (!CHANNEL_PATTERN.test(channel) || segments.some((segment) => segment === "" || segment === "." || segment === ".." || !ENDPOINT_SEGMENT_PATTERN.test(segment)))
    throw new Error(`connection: invalid RPC target ${JSON.stringify(`${channel}/${endpoint}`)}`);
}
function isLoopbackHostname(hostname) {
  if (hostname === "localhost" || hostname === "[::1]")
    return true;
  const parts = hostname.split(".");
  return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
function openConnectionWebSocket(path, factory = (url) => new WebSocket(url), baseUrl) {
  const base = baseUrl ?? (typeof document === "undefined" ? undefined : document.baseURI);
  if (base === undefined)
    throw new Error("connection: WebSocket carrier requires streamBaseUrl outside a document");
  const url = new URL(path.slice(1), base);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return factory(url.href);
}
function watchBrowserNetwork(controller) {
  const browser = globalThis.window;
  const initiallyAvailable = browser?.navigator?.onLine;
  if (browser === undefined || initiallyAvailable === undefined)
    return () => {};
  const online = () => {
    controller.setNetworkAvailable(true);
  };
  const offline = () => {
    controller.setNetworkAvailable(false);
  };
  controller.setNetworkAvailable(initiallyAvailable);
  browser.addEventListener("online", online);
  browser.addEventListener("offline", offline);
  return () => {
    browser.removeEventListener("online", online);
    browser.removeEventListener("offline", offline);
  };
}
function installConnection(ctx, options = {}) {
  const pageLocation = options.location;
  const transport = options.transport;
  const recovery = options.recovery ?? {};
  const interactions = options.interactions ?? (pageLocation === undefined ? "none" : "answer");
  const rpc = transport?.rpc ?? createWebConnectionRpc(transport?.fetch, transport?.openStream);
  let generationSource;
  let owner;
  let generationId = 0;
  let generation;
  let state;
  const generationListeners = /* @__PURE__ */ new Set;
  const stateListeners = /* @__PURE__ */ new Set;
  const publishGeneration = (next) => {
    if (Object.is(generation, next))
      return;
    generation = next;
    for (const listener of [...generationListeners])
      try {
        listener();
      } catch (error) {
        console.error("[connection] generation listener threw:", error);
      }
  };
  const publishState = (next) => {
    if (state === next)
      return;
    state = next;
    for (const listener of [...stateListeners])
      try {
        listener();
      } catch (error) {
        console.error("[connection] state listener threw:", error);
      }
  };
  const releaseOwner = (current) => {
    if (owner !== current)
      return;
    owner = undefined;
    current.stopNetworkWatch();
    current.controller.stop();
    publishGeneration(undefined);
    publishState(undefined);
  };
  const handle = {
    interactions,
    openWebSocket: (path) => openConnectionWebSocket(path, transport?.createWebSocket, transport?.streamBaseUrl),
    isLoopback: transport?.ownsHost === true || pageLocation === undefined || isLoopbackHostname(pageLocation.hostname),
    generation: {
      getSnapshot: () => generation,
      subscribe: (listener) => {
        generationListeners.add(listener);
        return () => {
          generationListeners.delete(listener);
        };
      }
    },
    state: {
      getSnapshot: () => state,
      subscribe: (listener) => {
        stateListeners.add(listener);
        return () => {
          stateListeners.delete(listener);
        };
      }
    },
    rpc,
    reconnect() {
      owner?.controller.reconnect();
    },
    registerGenerationSource(source) {
      if (generationSource !== undefined)
        throw new Error("connection: a generation source is already registered");
      generationSource = source;
      return () => {
        if (generationSource !== source)
          return;
        generationSource = undefined;
        const current = owner;
        if (current?.source === source)
          releaseOwner(current);
      };
    },
    start(sinks, config) {
      if (owner !== undefined)
        throw new Error("connection: the stream loop is already owned by another consumer");
      const source = generationSource;
      if (source === undefined)
        throw new Error("connection: no generation source is registered");
      const token = {};
      const ownsGeneration = () => owner?.token === token;
      const controller = new ConnectionController(source, {
        ...sinks,
        onConnected: (host) => {
          const nextGeneration = {
            id: ++generationId,
            host
          };
          publishGeneration(nextGeneration);
          if (!ownsGeneration() || !Object.is(generation, nextGeneration))
            return;
          sinks.onConnected?.(host);
        },
        onStateChange: (state) => {
          if (state !== "connected")
            publishGeneration(undefined);
          if (!ownsGeneration())
            return;
          publishState(state);
          sinks.onStateChange?.(state);
        }
      }, {
        ...recovery,
        ...config
      });
      const current = {
        token,
        source,
        controller,
        stopNetworkWatch: watchBrowserNetwork(controller)
      };
      owner = current;
      controller.start();
      return { stop: () => {
        releaseOwner(current);
      } };
    }
  };
  ctx.provide("connection", handle);
}
// node_modules/zod/v4/core/core.js
var _a;
var NEVER = /* @__PURE__ */ Object.freeze({
  status: "aborted"
});
function $constructor(name, initializer, params) {
  function init(inst, def) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _,
          traits: new Set
        },
        enumerable: false
      });
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer(inst, def);
    const proto = _.prototype;
    const keys = Object.keys(proto);
    for (let i = 0;i < keys.length; i++) {
      const k = keys[i];
      if (!(k in inst)) {
        inst[k] = proto[k].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    var _a;
    const inst = params?.Parent ? new Definition : this;
    init(inst, def);
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
var $brand = Symbol("zod_brand");

class $ZodAsyncError extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
}

class $ZodEncodeError extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
// node_modules/zod/v4/core/util.js
function assertEqual(val) {
  return val;
}
function assertNotEqual(val) {
  return val;
}
function assertIs(_arg) {}
function assertNever(_x) {
  throw new Error("Unexpected value in exhaustive check");
}
function assert(_) {}
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function joinValues(array, separator = "|") {
  return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
function cached(getter) {
  const set = false;
  return {
    get value() {
      if (!set) {
        const value = getter();
        Object.defineProperty(this, "value", { value });
        return value;
      }
      throw new Error("cached value already set");
    }
  };
}
function nullish(input) {
  return input === null || input === undefined;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object, key, getter) {
  let value = undefined;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING) {
        return;
      }
      if (value === undefined) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v
      });
    },
    configurable: true
  });
}
function objectClone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function cloneDef(schema) {
  return mergeDefs(schema._zod.def);
}
function getElementAtPath(obj, path) {
  if (!path)
    return obj;
  return path.reduce((acc, key) => acc?.[key], obj);
}
function promiseAllObject(promisesObj) {
  const keys = Object.keys(promisesObj);
  const promises = keys.map((key) => promisesObj[key]);
  return Promise.all(promises).then((results) => {
    const resolvedObj = {};
    for (let i = 0;i < keys.length; i++) {
      resolvedObj[keys[i]] = results[i];
    }
    return resolvedObj;
  });
}
function randomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0;i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject2(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject2(o) {
  if (isObject2(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === undefined)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject2(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject2(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
function numKeys(data) {
  let keyCount = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      keyCount++;
    }
  }
  return keyCount;
}
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return "promise";
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return "map";
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return "set";
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return "date";
      }
      if (typeof File !== "undefined" && data instanceof File) {
        return "file";
      }
      return "object";
    default:
      throw new Error(`Unknown data type: ${t}`);
  }
};
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
var primitiveTypes = /* @__PURE__ */ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined"
]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone2(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== undefined) {
    if (params?.error !== undefined)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function createTransparentProxy(getter) {
  let target;
  return new Proxy({}, {
    get(_, prop, receiver) {
      target ?? (target = getter());
      return Reflect.get(target, prop, receiver);
    },
    set(_, prop, value, receiver) {
      target ?? (target = getter());
      return Reflect.set(target, prop, value, receiver);
    },
    has(_, prop) {
      target ?? (target = getter());
      return Reflect.has(target, prop);
    },
    deleteProperty(_, prop) {
      target ?? (target = getter());
      return Reflect.deleteProperty(target, prop);
    },
    ownKeys(_) {
      target ?? (target = getter());
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(_, prop) {
      target ?? (target = getter());
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    defineProperty(_, prop, descriptor) {
      target ?? (target = getter());
      return Reflect.defineProperty(target, prop, descriptor);
    }
  });
}
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
  });
}
var NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
var BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick2(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = {};
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        newShape[key] = currDef.shape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone2(schema, def);
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = { ...schema._zod.def.shape };
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        delete newShape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone2(schema, def);
}
function extend(schema, shape) {
  if (!isPlainObject2(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = schema._zod.def.shape;
    for (const key in shape) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== undefined) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone2(schema, def);
}
function safeExtend(schema, shape) {
  if (!isPlainObject2(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone2(schema, def);
}
function merge2(a, b) {
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const def = mergeDefs(a._zod.def, {
    get shape() {
      const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone2(a, def);
}
function partial(Class2, schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in oldShape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = Class2 ? new Class2({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      } else {
        for (const key in oldShape) {
          shape[key] = Class2 ? new Class2({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    },
    checks: []
  });
  return clone2(schema, def);
}
function required(Class2, schema, mask) {
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = new Class2({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      } else {
        for (const key in oldShape) {
          shape[key] = new Class2({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    }
  });
  return clone2(schema, def);
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a;
    (_a = iss).path ?? (_a.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
  const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
  rest.path ?? (rest.path = []);
  rest.message = message;
  if (ctx?.reportInput) {
    rest.input = _input;
  }
  return rest;
}
function getSizableOrigin(input) {
  if (input instanceof Set)
    return "set";
  if (input instanceof Map)
    return "map";
  if (input instanceof File)
    return "file";
  return "unknown";
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function parsedType(data) {
  const t = typeof data;
  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "nan" : "number";
    }
    case "object": {
      if (data === null) {
        return "null";
      }
      if (Array.isArray(data)) {
        return "array";
      }
      const obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
        return obj.constructor.name;
      }
    }
  }
  return t;
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
function cleanEnum(obj) {
  return Object.entries(obj).filter(([k, _]) => {
    return Number.isNaN(Number.parseInt(k, 10));
  }).map((el) => el[1]);
}
function base64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0;i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
function uint8ArrayToBase64(bytes) {
  let binaryString = "";
  for (let i = 0;i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}
function base64urlToUint8Array(base64url) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - base64.length % 4) % 4);
  return base64ToUint8Array(base64 + padding);
}
function uint8ArrayToBase64url(bytes) {
  return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function hexToUint8Array(hex) {
  const cleanHex = hex.replace(/^0x/, "");
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0;i < cleanHex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
  }
  return bytes;
}
function uint8ArrayToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

class Class {
  constructor(..._args) {}
}

// node_modules/zod/v4/core/errors.js
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: false
  });
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue) => issue.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error, path = []) => {
    for (const issue of error.issues) {
      if (issue.code === "invalid_union" && issue.errors.length) {
        issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
      } else if (issue.code === "invalid_key") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else if (issue.code === "invalid_element") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else {
        const fullpath = [...path, ...issue.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }
  };
  processError(error);
  return fieldErrors;
}
function treeifyError(error, mapper = (issue) => issue.message) {
  const result = { errors: [] };
  const processError = (error, path = []) => {
    var _a, _b;
    for (const issue of error.issues) {
      if (issue.code === "invalid_union" && issue.errors.length) {
        issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
      } else if (issue.code === "invalid_key") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else if (issue.code === "invalid_element") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else {
        const fullpath = [...path, ...issue.path];
        if (fullpath.length === 0) {
          result.errors.push(mapper(issue));
          continue;
        }
        let curr = result;
        let i = 0;
        while (i < fullpath.length) {
          const el = fullpath[i];
          const terminal = i === fullpath.length - 1;
          if (typeof el === "string") {
            curr.properties ?? (curr.properties = {});
            (_a = curr.properties)[el] ?? (_a[el] = { errors: [] });
            curr = curr.properties[el];
          } else {
            curr.items ?? (curr.items = []);
            (_b = curr.items)[el] ?? (_b[el] = { errors: [] });
            curr = curr.items[el];
          }
          if (terminal) {
            curr.errors.push(mapper(issue));
          }
          i++;
        }
      }
    }
  };
  processError(error);
  return result;
}
function toDotPath(_path) {
  const segs = [];
  const path = _path.map((seg) => typeof seg === "object" ? seg.key : seg);
  for (const seg of path) {
    if (typeof seg === "number")
      segs.push(`[${seg}]`);
    else if (typeof seg === "symbol")
      segs.push(`[${JSON.stringify(String(seg))}]`);
    else if (/[^\w$]/.test(seg))
      segs.push(`[${JSON.stringify(seg)}]`);
    else {
      if (segs.length)
        segs.push(".");
      segs.push(seg);
    }
  }
  return segs.join("");
}
function prettifyError(error) {
  const lines = [];
  const issues = [...error.issues].sort((a, b) => (a.path ?? []).length - (b.path ?? []).length);
  for (const issue of issues) {
    lines.push(`✖ ${issue.message}`);
    if (issue.path?.length)
      lines.push(`  → at ${toDotPath(issue.path)}`);
  }
  return lines.join(`
`);
}

// node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
};
var parse = /* @__PURE__ */ _parse($ZodRealError);
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
};
var parseAsync = /* @__PURE__ */ _parseAsync($ZodRealError);
var _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
var _encode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parse(_Err)(schema, value, ctx);
};
var encode = /* @__PURE__ */ _encode($ZodRealError);
var _decode = (_Err) => (schema, value, _ctx) => {
  return _parse(_Err)(schema, value, _ctx);
};
var decode = /* @__PURE__ */ _decode($ZodRealError);
var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parseAsync(_Err)(schema, value, ctx);
};
var encodeAsync = /* @__PURE__ */ _encodeAsync($ZodRealError);
var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _parseAsync(_Err)(schema, value, _ctx);
};
var decodeAsync = /* @__PURE__ */ _decodeAsync($ZodRealError);
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var safeEncode = /* @__PURE__ */ _safeEncode($ZodRealError);
var _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
var safeDecode = /* @__PURE__ */ _safeDecode($ZodRealError);
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync($ZodRealError);
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync($ZodRealError);
// node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var extendedDuration = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var uuid4 = /* @__PURE__ */ uuid(4);
var uuid6 = /* @__PURE__ */ uuid(6);
var uuid7 = /* @__PURE__ */ uuid(7);
var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var html5Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
var rfc5322Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
var idnEmail = unicodeEmail;
var browserEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
var _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var mac = (delimiter) => {
  const escapedDelim = escapeRegex(delimiter ?? ":");
  return new RegExp(`^(?:[0-9A-F]{2}${escapedDelim}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${escapedDelim}){5}[0-9a-f]{2}$`);
};
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^[A-Za-z0-9_-]*$/;
var hostname = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
var domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
var date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  const time2 = timeSource({ precision: args.precision });
  const opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const timeRegex = `${time2}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var string = (params) => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
};
var bigint = /^-?\d+n?$/;
var integer = /^-?\d+$/;
var number = /^-?\d+(?:\.\d+)?$/;
var boolean = /^(?:true|false)$/i;
var _null = /^null$/i;
var _undefined = /^undefined$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;
var hex = /^[0-9a-fA-F]*$/;
function fixedBase64(bodyLength, padding) {
  return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
}
function fixedBase64url(length) {
  return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
}
var md5_hex = /^[0-9a-fA-F]{32}$/;
var md5_base64 = /* @__PURE__ */ fixedBase64(22, "==");
var md5_base64url = /* @__PURE__ */ fixedBase64url(22);
var sha1_hex = /^[0-9a-fA-F]{40}$/;
var sha1_base64 = /* @__PURE__ */ fixedBase64(27, "=");
var sha1_base64url = /* @__PURE__ */ fixedBase64url(27);
var sha256_hex = /^[0-9a-fA-F]{64}$/;
var sha256_base64 = /* @__PURE__ */ fixedBase64(43, "=");
var sha256_base64url = /* @__PURE__ */ fixedBase64url(43);
var sha384_hex = /^[0-9a-fA-F]{96}$/;
var sha384_base64 = /* @__PURE__ */ fixedBase64(64, "");
var sha384_base64url = /* @__PURE__ */ fixedBase64url(64);
var sha512_hex = /^[0-9a-fA-F]{128}$/;
var sha512_base64 = /* @__PURE__ */ fixedBase64(86, "==");
var sha512_base64url = /* @__PURE__ */ fixedBase64url(86);

// node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a = inst._zod).onattach ?? (_a.onattach = []);
});
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    if (def.value < curr) {
      if (def.inclusive)
        bag.maximum = def.value;
      else
        bag.exclusiveMaximum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    if (def.value > curr) {
      if (def.inclusive)
        bag.minimum = def.value;
      else
        bag.exclusiveMinimum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst) => {
    var _a;
    (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
  });
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = def.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
    if (isInt)
      bag.pattern = integer;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCheckBigIntFormat = /* @__PURE__ */ $constructor("$ZodCheckBigIntFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  const [minimum, maximum] = BIGINT_FORMAT_RANGES[def.format];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = def.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (input < minimum) {
      payload.issues.push({
        origin: "bigint",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "bigint",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCheckMaxSize = /* @__PURE__ */ $constructor("$ZodCheckMaxSize", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.size !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const size = input.size;
    if (size <= def.maximum)
      return;
    payload.issues.push({
      origin: getSizableOrigin(input),
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinSize = /* @__PURE__ */ $constructor("$ZodCheckMinSize", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.size !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const size = input.size;
    if (size >= def.minimum)
      return;
    payload.issues.push({
      origin: getSizableOrigin(input),
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckSizeEquals = /* @__PURE__ */ $constructor("$ZodCheckSizeEquals", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.size !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.minimum = def.size;
    bag.maximum = def.size;
    bag.size = def.size;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const size = input.size;
    if (size === def.size)
      return;
    const tooBig = size > def.size;
    payload.issues.push({
      origin: getSizableOrigin(input),
      ...tooBig ? { code: "too_big", maximum: def.size } : { code: "too_small", minimum: def.size },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.minimum = def.length;
    bag.maximum = def.length;
    bag.length = def.length;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a, _b;
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = def.format;
    if (def.pattern) {
      bag.patterns ?? (bag.patterns = new Set);
      bag.patterns.add(def.pattern);
    }
  });
  if (def.pattern)
    (_a = inst._zod).check ?? (_a.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {});
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function handleCheckPropertyResult(result, payload, property) {
  if (result.issues.length) {
    payload.issues.push(...prefixIssues(property, result.issues));
  }
}
var $ZodCheckProperty = /* @__PURE__ */ $constructor("$ZodCheckProperty", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    const result = def.schema._zod.run({
      value: payload.value[def.property],
      issues: []
    }, {});
    if (result instanceof Promise) {
      return result.then((result) => handleCheckPropertyResult(result, payload, def.property));
    }
    handleCheckPropertyResult(result, payload, def.property);
    return;
  };
});
var $ZodCheckMimeType = /* @__PURE__ */ $constructor("$ZodCheckMimeType", (inst, def) => {
  $ZodCheck.init(inst, def);
  const mimeSet = new Set(def.mime);
  inst._zod.onattach.push((inst) => {
    inst._zod.bag.mime = def.mime;
  });
  inst._zod.check = (payload) => {
    if (mimeSet.has(payload.value.type))
      return;
    payload.issues.push({
      code: "invalid_value",
      values: def.mime,
      input: payload.value.type,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
class Doc {
  constructor(args = []) {
    this.content = [];
    this.indent = 0;
    if (this)
      this.args = args;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split(`
`).filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const args = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map((x) => `  ${x}`)];
    return new F(...args, lines.join(`
`));
  }
}

// node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 4,
  patch: 3
};

// node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const checks = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck")) {
    checks.unshift(inst);
  }
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks, ctx) => {
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError;
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary) => {
            return handleCanaryResult(canary, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return result.then((result) => runChecks(result, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
  defineLazy(inst, "~standard", () => ({
    validate: (value) => {
      try {
        const r = safeParse(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
});
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag);
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_) {}
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === undefined)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      if (!def.normalize && def.protocol?.source === httpProtocol.source) {
        if (!/^https?:\/\//i.test(trimmed)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid URL format",
            input: payload.value,
            inst,
            continue: !def.abort
          });
          return;
        }
      }
      const url = new URL(trimmed);
      if (def.hostname) {
        def.hostname.lastIndex = 0;
        if (!def.hostname.test(url.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def.hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.protocol) {
        def.protocol.lastIndex = 0;
        if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.normalize) {
        payload.value = url.href;
      } else {
        payload.value = trimmed;
      }
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  def.pattern ?? (def.pattern = nanoid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date);
  $ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration);
  $ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv4`;
});
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv6`;
  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodMAC = /* @__PURE__ */ $constructor("$ZodMAC", (inst, def) => {
  def.pattern ?? (def.pattern = mac(def.delimiter));
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `mac`;
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    const parts = payload.value.split("/");
    try {
      if (parts.length !== 2)
        throw new Error;
      const [address, prefix] = parts;
      if (!prefix)
        throw new Error;
      const prefixNum = Number(prefix);
      if (`${prefixNum}` !== prefix)
        throw new Error;
      if (prefixNum < 0 || prefixNum > 128)
        throw new Error;
      new URL(`http://[${address}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64";
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return false;
  const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64url);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64url";
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCustomStringFormat = /* @__PURE__ */ $constructor("$ZodCustomStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (def.fn(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: def.format,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = inst._zod.bag.pattern ?? number;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : undefined : undefined;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodBigInt = /* @__PURE__ */ $constructor("$ZodBigInt", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = bigint;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = BigInt(payload.value);
      } catch (_) {}
    if (typeof payload.value === "bigint")
      return payload;
    payload.issues.push({
      expected: "bigint",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodBigIntFormat = /* @__PURE__ */ $constructor("$ZodBigIntFormat", (inst, def) => {
  $ZodCheckBigIntFormat.init(inst, def);
  $ZodBigInt.init(inst, def);
});
var $ZodSymbol = /* @__PURE__ */ $constructor("$ZodSymbol", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (typeof input === "symbol")
      return payload;
    payload.issues.push({
      expected: "symbol",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUndefined = /* @__PURE__ */ $constructor("$ZodUndefined", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = _undefined;
  inst._zod.values = new Set([undefined]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (typeof input === "undefined")
      return payload;
    payload.issues.push({
      expected: "undefined",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = _null;
  inst._zod.values = new Set([null]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input === null)
      return payload;
    payload.issues.push({
      expected: "null",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodAny = /* @__PURE__ */ $constructor("$ZodAny", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodVoid = /* @__PURE__ */ $constructor("$ZodVoid", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (typeof input === "undefined")
      return payload;
    payload.issues.push({
      expected: "void",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodDate = /* @__PURE__ */ $constructor("$ZodDate", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce) {
      try {
        payload.value = new Date(payload.value);
      } catch (_err) {}
    }
    const input = payload.value;
    const isDate = input instanceof Date;
    const isValidDate = isDate && !Number.isNaN(input.getTime());
    if (isValidDate)
      return payload;
    payload.issues.push({
      expected: "date",
      code: "invalid_type",
      input,
      ...isDate ? { received: "Invalid Date" } : {},
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = Array(input.length);
    const proms = [];
    for (let i = 0;i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result) => handleArrayResult(result, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
  const isPresent = key in input;
  if (result.issues.length) {
    if (isOptionalIn && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && !isOptionalIn) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: undefined,
        path: [key]
      });
    }
    return;
  }
  if (result.value === undefined) {
    if (isPresent) {
      final.value[key] = undefined;
    }
  } else {
    final.value[key] = result.value;
  }
}
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  for (const k of keys) {
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    keys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t = _catchall.def.type;
  const isOptionalIn = _catchall.optin === "optional";
  const isOptionalOut = _catchall.optout === "optional";
  for (const key in input) {
    if (key === "__proto__")
      continue;
    if (keySet.has(key))
      continue;
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
    } else {
      handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  if (!desc?.get) {
    const sh = def.shape;
    Object.defineProperty(def, "shape", {
      get: () => {
        const newSh = { ...sh };
        Object.defineProperty(def, "shape", {
          value: newSh
        });
        return newSh;
      }
    });
  }
  const _normalized = cached(() => normalizeDef(def));
  defineLazy(inst._zod, "propValues", () => {
    const shape = def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        propValues[key] ?? (propValues[key] = new Set);
        for (const v of field.values)
          propValues[key].add(v);
      }
    }
    return propValues;
  });
  const isObject = isObject2;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = {};
    const proms = [];
    const shape = value.shape;
    for (const key of value.keys) {
      const el = shape[key];
      const isOptionalIn = el._zod.optin === "optional";
      const isOptionalOut = el._zod.optout === "optional";
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
      } else {
        handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const generateFastpass = (shape) => {
    const doc = new Doc(["shape", "payload", "ctx"]);
    const normalized = _normalized.value;
    const parseStr = (key) => {
      const k = esc(key);
      return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    };
    doc.write(`const input = payload.value;`);
    const ids = Object.create(null);
    let counter = 0;
    for (const key of normalized.keys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(`const newResult = {};`);
    for (const key of normalized.keys) {
      const id = ids[key];
      const k = esc(key);
      const schema = shape[key];
      const isOptionalIn = schema?._zod?.optin === "optional";
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc.write(`const ${id} = ${parseStr(key)};`);
      if (isOptionalIn && isOptionalOut) {
        doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      } else if (!isOptionalIn) {
        doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else {
        doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    const fn = doc.compile();
    return (payload, ctx) => fn(shape, payload, ctx);
  };
  let fastpass;
  const isObject = isObject2;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
  defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
  defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values)) {
      return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return;
  });
  defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      const patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results) => {
      return handleUnionResults(results, payload, inst, ctx);
    });
  };
});
function handleExclusiveUnionResults(results, final, inst, ctx) {
  const successes = results.filter((r) => r.issues.length === 0);
  if (successes.length === 1) {
    final.value = successes[0].value;
    return final;
  }
  if (successes.length === 0) {
    final.issues.push({
      code: "invalid_union",
      input: final.value,
      inst,
      errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    });
  } else {
    final.issues.push({
      code: "invalid_union",
      input: final.value,
      inst,
      errors: [],
      inclusive: false
    });
  }
  return final;
}
var $ZodXor = /* @__PURE__ */ $constructor("$ZodXor", (inst, def) => {
  $ZodUnion.init(inst, def);
  def.inclusive = false;
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        results.push(result);
      }
    }
    if (!async)
      return handleExclusiveUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results) => {
      return handleExclusiveUnionResults(results, payload, inst, ctx);
    });
  };
});
var $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
  def.inclusive = false;
  $ZodUnion.init(inst, def);
  const _super = inst._zod.parse;
  defineLazy(inst._zod, "propValues", () => {
    const propValues = {};
    for (const option of def.options) {
      const pv = option._zod.propValues;
      if (!pv || Object.keys(pv).length === 0)
        throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
      for (const [k, v] of Object.entries(pv)) {
        if (!propValues[k])
          propValues[k] = new Set;
        for (const val of v) {
          propValues[k].add(val);
        }
      }
    }
    return propValues;
  });
  const disc = cached(() => {
    const opts = def.options;
    const map = new Map;
    for (const o of opts) {
      const values = o._zod.propValues?.[def.discriminator];
      if (!values || values.size === 0)
        throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
      for (const v of values) {
        if (map.has(v)) {
          throw new Error(`Duplicate discriminator value "${String(v)}"`);
        }
        map.set(v, o);
      }
    }
    return map;
  });
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        code: "invalid_type",
        expected: "object",
        input,
        inst
      });
      return payload;
    }
    const opt = disc.value.get(input?.[def.discriminator]);
    if (opt) {
      return opt._zod.run(payload, ctx);
    }
    if (def.unionFallback || ctx.direction === "backward") {
      return _super(payload, ctx);
    }
    payload.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: def.discriminator,
      options: Array.from(disc.value.keys()),
      input,
      path: [def.discriminator],
      inst
    });
    return payload;
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left, right]) => {
        return handleIntersectionResults(payload, left, right);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject2(a) && isPlainObject2(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = new Map;
  let unrecIssue;
  for (const iss of left.issues) {
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).l = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  for (const iss of right.issues) {
    if (iss.code === "unrecognized_keys") {
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).r = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length && unrecIssue) {
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
var $ZodTuple = /* @__PURE__ */ $constructor("$ZodTuple", (inst, def) => {
  $ZodType.init(inst, def);
  const items = def.items;
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        input,
        inst,
        expected: "tuple",
        code: "invalid_type"
      });
      return payload;
    }
    payload.value = [];
    const proms = [];
    const optinStart = getTupleOptStart(items, "optin");
    const optoutStart = getTupleOptStart(items, "optout");
    if (!def.rest) {
      if (input.length < optinStart) {
        payload.issues.push({
          code: "too_small",
          minimum: optinStart,
          inclusive: true,
          input,
          inst,
          origin: "array"
        });
        return payload;
      }
      if (input.length > items.length) {
        payload.issues.push({
          code: "too_big",
          maximum: items.length,
          inclusive: true,
          input,
          inst,
          origin: "array"
        });
      }
    }
    const itemResults = new Array(items.length);
    for (let i = 0;i < items.length; i++) {
      const r = items[i]._zod.run({ value: input[i], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((rr) => {
          itemResults[i] = rr;
        }));
      } else {
        itemResults[i] = r;
      }
    }
    if (def.rest) {
      let i = items.length - 1;
      const rest = input.slice(items.length);
      for (const el of rest) {
        i++;
        const result = def.rest._zod.run({ value: el, issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((r) => handleTupleResult(r, payload, i)));
        } else {
          handleTupleResult(result, payload, i);
        }
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => handleTupleResults(itemResults, payload, items, input, optoutStart));
    }
    return handleTupleResults(itemResults, payload, items, input, optoutStart);
  };
});
function getTupleOptStart(items, key) {
  for (let i = items.length - 1;i >= 0; i--) {
    if (items[i]._zod[key] !== "optional")
      return i + 1;
  }
  return 0;
}
function handleTupleResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
function handleTupleResults(itemResults, final, items, input, optoutStart) {
  for (let i = 0;i < items.length; i++) {
    const r = itemResults[i];
    const isPresent = i < input.length;
    if (r.issues.length) {
      if (!isPresent && i >= optoutStart) {
        final.value.length = i;
        break;
      }
      final.issues.push(...prefixIssues(i, r.issues));
    }
    final.value[i] = r.value;
  }
  for (let i = final.value.length - 1;i >= input.length; i--) {
    if (items[i]._zod.optout === "optional" && final.value[i] === undefined) {
      final.value.length = i;
    } else {
      break;
    }
  }
  return final;
}
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject2(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def.keyType._zod.values;
    if (values) {
      payload.value = {};
      const recordKeys = new Set;
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result) => {
              if (result.issues.length) {
                payload.issues.push(...prefixIssues(key, result.issues));
              }
              payload.value[outKey] = result.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          unrecognized = unrecognized ?? [];
          unrecognized.push(key);
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized
        });
      }
    } else {
      payload.value = {};
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            payload.value[key] = input[key];
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result) => {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[keyResult.value] = result.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[keyResult.value] = result.value;
        }
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
var $ZodMap = /* @__PURE__ */ $constructor("$ZodMap", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!(input instanceof Map)) {
      payload.issues.push({
        expected: "map",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    payload.value = new Map;
    for (const [key, value] of input) {
      const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
      const valueResult = def.valueType._zod.run({ value, issues: [] }, ctx);
      if (keyResult instanceof Promise || valueResult instanceof Promise) {
        proms.push(Promise.all([keyResult, valueResult]).then(([keyResult, valueResult]) => {
          handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
        }));
      } else {
        handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
      }
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  };
});
function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
  if (keyResult.issues.length) {
    if (propertyKeyTypes.has(typeof key)) {
      final.issues.push(...prefixIssues(key, keyResult.issues));
    } else {
      final.issues.push({
        code: "invalid_key",
        origin: "map",
        input,
        inst,
        issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
      });
    }
  }
  if (valueResult.issues.length) {
    if (propertyKeyTypes.has(typeof key)) {
      final.issues.push(...prefixIssues(key, valueResult.issues));
    } else {
      final.issues.push({
        origin: "map",
        code: "invalid_element",
        input,
        inst,
        key,
        issues: valueResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
      });
    }
  }
  final.value.set(keyResult.value, valueResult.value);
}
var $ZodSet = /* @__PURE__ */ $constructor("$ZodSet", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!(input instanceof Set)) {
      payload.issues.push({
        input,
        inst,
        expected: "set",
        code: "invalid_type"
      });
      return payload;
    }
    const proms = [];
    payload.value = new Set;
    for (const item of input) {
      const result = def.valueType._zod.run({ value: item, issues: [] }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result) => handleSetResult(result, payload)));
      } else
        handleSetResult(result, payload);
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  };
});
function handleSetResult(result, final) {
  if (result.issues.length) {
    final.issues.push(...result.issues);
  }
  final.value.add(result.value);
}
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  if (def.values.length === 0) {
    throw new Error("Cannot create literal schema with no valid values");
  }
  const values = new Set(def.values);
  inst._zod.values = values;
  inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodFile = /* @__PURE__ */ $constructor("$ZodFile", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input instanceof File)
      return payload;
    payload.issues.push({
      expected: "file",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output) => {
        payload.value = output;
        payload.fallback = true;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError;
    }
    payload.value = _out;
    payload.fallback = true;
    return payload;
  };
});
function handleOptionalResult(result, input) {
  if (input === undefined && (result.issues.length || result.fallback)) {
    return { issues: [], value: undefined };
  }
  return result;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.optout = "optional";
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
  });
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (def.innerType._zod.optin === "optional") {
      const input = payload.value;
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((r) => handleOptionalResult(r, input));
      return handleOptionalResult(result, input);
    }
    if (payload.value === undefined) {
      return payload;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
  });
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleDefaultResult(result, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === undefined) {
    payload.value = def.defaultValue;
  }
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => {
    const v = def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleNonOptionalResult(result, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === undefined) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
var $ZodSuccess = /* @__PURE__ */ $constructor("$ZodSuccess", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError("ZodSuccess");
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => {
        payload.value = result.issues.length === 0;
        return payload;
      });
    }
    payload.value = result.issues.length === 0;
    return payload;
  };
});
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => {
        payload.value = result.value;
        if (result.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
          payload.fallback = true;
        }
        return payload;
      });
    }
    payload.value = result.value;
    if (result.issues.length) {
      payload.value = def.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      });
      payload.issues = [];
      payload.fallback = true;
    }
    return payload;
  };
});
var $ZodNaN = /* @__PURE__ */ $constructor("$ZodNaN", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
      payload.issues.push({
        input: payload.value,
        inst,
        expected: "nan",
        code: "invalid_type"
      });
      return payload;
    }
    return payload;
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right) => handlePipeResult(right, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left) => handlePipeResult(left, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
}
var $ZodCodec = /* @__PURE__ */ $constructor("$ZodCodec", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    const direction = ctx.direction || "forward";
    if (direction === "forward") {
      const left = def.in._zod.run(payload, ctx);
      if (left instanceof Promise) {
        return left.then((left) => handleCodecAResult(left, def, ctx));
      }
      return handleCodecAResult(left, def, ctx);
    } else {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right) => handleCodecAResult(right, def, ctx));
      }
      return handleCodecAResult(right, def, ctx);
    }
  };
});
function handleCodecAResult(result, def, ctx) {
  if (result.issues.length) {
    result.aborted = true;
    return result;
  }
  const direction = ctx.direction || "forward";
  if (direction === "forward") {
    const transformed = def.transform(result.value, result);
    if (transformed instanceof Promise) {
      return transformed.then((value) => handleCodecTxResult(result, value, def.out, ctx));
    }
    return handleCodecTxResult(result, transformed, def.out, ctx);
  } else {
    const transformed = def.reverseTransform(result.value, result);
    if (transformed instanceof Promise) {
      return transformed.then((value) => handleCodecTxResult(result, value, def.in, ctx));
    }
    return handleCodecTxResult(result, transformed, def.in, ctx);
  }
}
function handleCodecTxResult(left, value, nextSchema, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return nextSchema._zod.run({ value, issues: left.issues }, ctx);
}
var $ZodPreprocess = /* @__PURE__ */ $constructor("$ZodPreprocess", (inst, def) => {
  $ZodPipe.init(inst, def);
});
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
  defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodTemplateLiteral = /* @__PURE__ */ $constructor("$ZodTemplateLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  const regexParts = [];
  for (const part of def.parts) {
    if (typeof part === "object" && part !== null) {
      if (!part._zod.pattern) {
        throw new Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
      }
      const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
      if (!source)
        throw new Error(`Invalid template literal part: ${part._zod.traits}`);
      const start = source.startsWith("^") ? 1 : 0;
      const end = source.endsWith("$") ? source.length - 1 : source.length;
      regexParts.push(source.slice(start, end));
    } else if (part === null || primitiveTypes.has(typeof part)) {
      regexParts.push(escapeRegex(`${part}`));
    } else {
      throw new Error(`Invalid template literal part: ${part}`);
    }
  }
  inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
  inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "string") {
      payload.issues.push({
        input: payload.value,
        inst,
        expected: "string",
        code: "invalid_type"
      });
      return payload;
    }
    inst._zod.pattern.lastIndex = 0;
    if (!inst._zod.pattern.test(payload.value)) {
      payload.issues.push({
        input: payload.value,
        inst,
        code: "invalid_format",
        format: def.format ?? "template_literal",
        pattern: inst._zod.pattern.source
      });
      return payload;
    }
    return payload;
  };
});
var $ZodFunction = /* @__PURE__ */ $constructor("$ZodFunction", (inst, def) => {
  $ZodType.init(inst, def);
  inst._def = def;
  inst._zod.def = def;
  inst.implement = (func) => {
    if (typeof func !== "function") {
      throw new Error("implement() must be called with a function");
    }
    return function(...args) {
      const parsedArgs = inst._def.input ? parse(inst._def.input, args) : args;
      const result = Reflect.apply(func, this, parsedArgs);
      if (inst._def.output) {
        return parse(inst._def.output, result);
      }
      return result;
    };
  };
  inst.implementAsync = (func) => {
    if (typeof func !== "function") {
      throw new Error("implementAsync() must be called with a function");
    }
    return async function(...args) {
      const parsedArgs = inst._def.input ? await parseAsync(inst._def.input, args) : args;
      const result = await Reflect.apply(func, this, parsedArgs);
      if (inst._def.output) {
        return await parseAsync(inst._def.output, result);
      }
      return result;
    };
  };
  inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "function") {
      payload.issues.push({
        code: "invalid_type",
        expected: "function",
        input: payload.value,
        inst
      });
      return payload;
    }
    const hasPromiseOutput = inst._def.output && inst._def.output._zod.def.type === "promise";
    if (hasPromiseOutput) {
      payload.value = inst.implementAsync(payload.value);
    } else {
      payload.value = inst.implement(payload.value);
    }
    return payload;
  };
  inst.input = (...args) => {
    const F = inst.constructor;
    if (Array.isArray(args[0])) {
      return new F({
        type: "function",
        input: new $ZodTuple({
          type: "tuple",
          items: args[0],
          rest: args[1]
        }),
        output: inst._def.output
      });
    }
    return new F({
      type: "function",
      input: args[0],
      output: inst._def.output
    });
  };
  inst.output = (output) => {
    const F = inst.constructor;
    return new F({
      type: "function",
      input: inst._def.input,
      output
    });
  };
  return inst;
});
var $ZodPromise = /* @__PURE__ */ $constructor("$ZodPromise", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    return Promise.resolve(payload.value).then((inner) => def.innerType._zod.run({ value: inner, issues: [] }, ctx));
  };
});
var $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "innerType", () => {
    const d = def;
    if (!d._cachedInner)
      d._cachedInner = def.getter();
    return d._cachedInner;
  });
  defineLazy(inst._zod, "pattern", () => inst._zod.innerType?._zod?.pattern);
  defineLazy(inst._zod, "propValues", () => inst._zod.innerType?._zod?.propValues);
  defineLazy(inst._zod, "optin", () => inst._zod.innerType?._zod?.optin ?? undefined);
  defineLazy(inst._zod, "optout", () => inst._zod.innerType?._zod?.optout ?? undefined);
  inst._zod.parse = (payload, ctx) => {
    const inner = inst._zod.innerType;
    return inner._zod.run(payload, ctx);
  };
});
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r) => handleRefineResult(r, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
// node_modules/zod/v4/locales/ar.js
var error = () => {
  const Sizable = {
    string: { unit: "حرف", verb: "أن يحوي" },
    file: { unit: "بايت", verb: "أن يحوي" },
    array: { unit: "عنصر", verb: "أن يحوي" },
    set: { unit: "عنصر", verb: "أن يحوي" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "مدخل",
    email: "بريد إلكتروني",
    url: "رابط",
    emoji: "إيموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاريخ ووقت بمعيار ISO",
    date: "تاريخ بمعيار ISO",
    time: "وقت بمعيار ISO",
    duration: "مدة بمعيار ISO",
    ipv4: "عنوان IPv4",
    ipv6: "عنوان IPv6",
    cidrv4: "مدى عناوين بصيغة IPv4",
    cidrv6: "مدى عناوين بصيغة IPv6",
    base64: "نَص بترميز base64-encoded",
    base64url: "نَص بترميز base64url-encoded",
    json_string: "نَص على هيئة JSON",
    e164: "رقم هاتف بمعيار E.164",
    jwt: "JWT",
    template_literal: "مدخل"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `مدخلات غير مقبولة: يفترض إدخال instanceof ${issue.expected}، ولكن تم إدخال ${received}`;
        }
        return `مدخلات غير مقبولة: يفترض إدخال ${expected}، ولكن تم إدخال ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `مدخلات غير مقبولة: يفترض إدخال ${stringifyPrimitive(issue.values[0])}`;
        return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return ` أكبر من اللازم: يفترض أن تكون ${issue.origin ?? "القيمة"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "عنصر"}`;
        return `أكبر من اللازم: يفترض أن تكون ${issue.origin ?? "القيمة"} ${adj} ${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `نَص غير مقبول: يجب أن يبدأ بـ "${issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `نَص غير مقبول: يجب أن ينتهي بـ "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `نَص غير مقبول: يجب أن يتضمَّن "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `نَص غير مقبول: يجب أن يطابق النمط ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue.format} غير مقبول`;
      }
      case "not_multiple_of":
        return `رقم غير مقبول: يجب أن يكون من مضاعفات ${issue.divisor}`;
      case "unrecognized_keys":
        return `معرف${issue.keys.length > 1 ? "ات" : ""} غريب${issue.keys.length > 1 ? "ة" : ""}: ${joinValues(issue.keys, "، ")}`;
      case "invalid_key":
        return `معرف غير مقبول في ${issue.origin}`;
      case "invalid_union":
        return "مدخل غير مقبول";
      case "invalid_element":
        return `مدخل غير مقبول في ${issue.origin}`;
      default:
        return "مدخل غير مقبول";
    }
  };
};
function ar_default() {
  return {
    localeError: error()
  };
}
// node_modules/zod/v4/locales/az.js
var error2 = () => {
  const Sizable = {
    string: { unit: "simvol", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "element", verb: "olmalıdır" },
    set: { unit: "element", verb: "olmalıdır" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Yanlış dəyər: gözlənilən instanceof ${issue.expected}, daxil olan ${received}`;
        }
        return `Yanlış dəyər: gözlənilən ${expected}, daxil olan ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Yanlış dəyər: gözlənilən ${stringifyPrimitive(issue.values[0])}`;
        return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Çox böyük: gözlənilən ${issue.origin ?? "dəyər"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
        return `Çox böyük: gözlənilən ${issue.origin ?? "dəyər"} ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Yanlış mətn: "${_issue.prefix}" ilə başlamalıdır`;
        if (_issue.format === "ends_with")
          return `Yanlış mətn: "${_issue.suffix}" ilə bitməlidir`;
        if (_issue.format === "includes")
          return `Yanlış mətn: "${_issue.includes}" daxil olmalıdır`;
        if (_issue.format === "regex")
          return `Yanlış mətn: ${_issue.pattern} şablonuna uyğun olmalıdır`;
        return `Yanlış ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Yanlış ədəd: ${issue.divisor} ilə bölünə bilən olmalıdır`;
      case "unrecognized_keys":
        return `Tanınmayan açar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `${issue.origin} daxilində yanlış açar`;
      case "invalid_union":
        return "Yanlış dəyər";
      case "invalid_element":
        return `${issue.origin} daxilində yanlış dəyər`;
      default:
        return `Yanlış dəyər`;
    }
  };
};
function az_default() {
  return {
    localeError: error2()
  };
}
// node_modules/zod/v4/locales/be.js
function getBelarusianPlural(count, one, few, many) {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return many;
  }
  if (lastDigit === 1) {
    return one;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }
  return many;
}
var error3 = () => {
  const Sizable = {
    string: {
      unit: {
        one: "сімвал",
        few: "сімвалы",
        many: "сімвалаў"
      },
      verb: "мець"
    },
    array: {
      unit: {
        one: "элемент",
        few: "элементы",
        many: "элементаў"
      },
      verb: "мець"
    },
    set: {
      unit: {
        one: "элемент",
        few: "элементы",
        many: "элементаў"
      },
      verb: "мець"
    },
    file: {
      unit: {
        one: "байт",
        few: "байты",
        many: "байтаў"
      },
      verb: "мець"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "увод",
    email: "email адрас",
    url: "URL",
    emoji: "эмодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата і час",
    date: "ISO дата",
    time: "ISO час",
    duration: "ISO працягласць",
    ipv4: "IPv4 адрас",
    ipv6: "IPv6 адрас",
    cidrv4: "IPv4 дыяпазон",
    cidrv6: "IPv6 дыяпазон",
    base64: "радок у фармаце base64",
    base64url: "радок у фармаце base64url",
    json_string: "JSON радок",
    e164: "нумар E.164",
    jwt: "JWT",
    template_literal: "увод"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "лік",
    array: "масіў"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Няправільны ўвод: чакаўся instanceof ${issue.expected}, атрымана ${received}`;
        }
        return `Няправільны ўвод: чакаўся ${expected}, атрымана ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Няправільны ўвод: чакалася ${stringifyPrimitive(issue.values[0])}`;
        return `Няправільны варыянт: чакаўся адзін з ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          const maxValue = Number(issue.maximum);
          const unit = getBelarusianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Занадта вялікі: чакалася, што ${issue.origin ?? "значэнне"} павінна ${sizing.verb} ${adj}${issue.maximum.toString()} ${unit}`;
        }
        return `Занадта вялікі: чакалася, што ${issue.origin ?? "значэнне"} павінна быць ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          const minValue = Number(issue.minimum);
          const unit = getBelarusianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Занадта малы: чакалася, што ${issue.origin} павінна ${sizing.verb} ${adj}${issue.minimum.toString()} ${unit}`;
        }
        return `Занадта малы: чакалася, што ${issue.origin} павінна быць ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Няправільны радок: павінен пачынацца з "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Няправільны радок: павінен заканчвацца на "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Няправільны радок: павінен змяшчаць "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Няправільны радок: павінен адпавядаць шаблону ${_issue.pattern}`;
        return `Няправільны ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Няправільны лік: павінен быць кратным ${issue.divisor}`;
      case "unrecognized_keys":
        return `Нераспазнаны ${issue.keys.length > 1 ? "ключы" : "ключ"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Няправільны ключ у ${issue.origin}`;
      case "invalid_union":
        return "Няправільны ўвод";
      case "invalid_element":
        return `Няправільнае значэнне ў ${issue.origin}`;
      default:
        return `Няправільны ўвод`;
    }
  };
};
function be_default() {
  return {
    localeError: error3()
  };
}
// node_modules/zod/v4/locales/bg.js
var error4 = () => {
  const Sizable = {
    string: { unit: "символа", verb: "да съдържа" },
    file: { unit: "байта", verb: "да съдържа" },
    array: { unit: "елемента", verb: "да съдържа" },
    set: { unit: "елемента", verb: "да съдържа" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "вход",
    email: "имейл адрес",
    url: "URL",
    emoji: "емоджи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO време",
    date: "ISO дата",
    time: "ISO време",
    duration: "ISO продължителност",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "base64-кодиран низ",
    base64url: "base64url-кодиран низ",
    json_string: "JSON низ",
    e164: "E.164 номер",
    jwt: "JWT",
    template_literal: "вход"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "число",
    array: "масив"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Невалиден вход: очакван instanceof ${issue.expected}, получен ${received}`;
        }
        return `Невалиден вход: очакван ${expected}, получен ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Невалиден вход: очакван ${stringifyPrimitive(issue.values[0])}`;
        return `Невалидна опция: очаквано едно от ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Твърде голямо: очаква се ${issue.origin ?? "стойност"} да съдържа ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елемента"}`;
        return `Твърде голямо: очаква се ${issue.origin ?? "стойност"} да бъде ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Твърде малко: очаква се ${issue.origin} да съдържа ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Твърде малко: очаква се ${issue.origin} да бъде ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Невалиден низ: трябва да започва с "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Невалиден низ: трябва да завършва с "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Невалиден низ: трябва да включва "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Невалиден низ: трябва да съвпада с ${_issue.pattern}`;
        let invalid_adj = "Невалиден";
        if (_issue.format === "emoji")
          invalid_adj = "Невалидно";
        if (_issue.format === "datetime")
          invalid_adj = "Невалидно";
        if (_issue.format === "date")
          invalid_adj = "Невалидна";
        if (_issue.format === "time")
          invalid_adj = "Невалидно";
        if (_issue.format === "duration")
          invalid_adj = "Невалидна";
        return `${invalid_adj} ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Невалидно число: трябва да бъде кратно на ${issue.divisor}`;
      case "unrecognized_keys":
        return `Неразпознат${issue.keys.length > 1 ? "и" : ""} ключ${issue.keys.length > 1 ? "ове" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Невалиден ключ в ${issue.origin}`;
      case "invalid_union":
        return "Невалиден вход";
      case "invalid_element":
        return `Невалидна стойност в ${issue.origin}`;
      default:
        return `Невалиден вход`;
    }
  };
};
function bg_default() {
  return {
    localeError: error4()
  };
}
// node_modules/zod/v4/locales/ca.js
var error5 = () => {
  const Sizable = {
    string: { unit: "caràcters", verb: "contenir" },
    file: { unit: "bytes", verb: "contenir" },
    array: { unit: "elements", verb: "contenir" },
    set: { unit: "elements", verb: "contenir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entrada",
    email: "adreça electrònica",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "durada ISO",
    ipv4: "adreça IPv4",
    ipv6: "adreça IPv6",
    cidrv4: "rang IPv4",
    cidrv6: "rang IPv6",
    base64: "cadena codificada en base64",
    base64url: "cadena codificada en base64url",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Tipus invàlid: s'esperava instanceof ${issue.expected}, s'ha rebut ${received}`;
        }
        return `Tipus invàlid: s'esperava ${expected}, s'ha rebut ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Valor invàlid: s'esperava ${stringifyPrimitive(issue.values[0])}`;
        return `Opció invàlida: s'esperava una de ${joinValues(issue.values, " o ")}`;
      case "too_big": {
        const adj = issue.inclusive ? "com a màxim" : "menys de";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} contingués ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} fos ${adj} ${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? "com a mínim" : "més de";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Massa petit: s'esperava que ${issue.origin} contingués ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Massa petit: s'esperava que ${issue.origin} fos ${adj} ${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Format invàlid: ha de començar amb "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Format invàlid: ha d'acabar amb "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Format invàlid: ha d'incloure "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Format invàlid: ha de coincidir amb el patró ${_issue.pattern}`;
        return `Format invàlid per a ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Número invàlid: ha de ser múltiple de ${issue.divisor}`;
      case "unrecognized_keys":
        return `Clau${issue.keys.length > 1 ? "s" : ""} no reconeguda${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Clau invàlida a ${issue.origin}`;
      case "invalid_union":
        return "Entrada invàlida";
      case "invalid_element":
        return `Element invàlid a ${issue.origin}`;
      default:
        return `Entrada invàlida`;
    }
  };
};
function ca_default() {
  return {
    localeError: error5()
  };
}
// node_modules/zod/v4/locales/cs.js
var error6 = () => {
  const Sizable = {
    string: { unit: "znaků", verb: "mít" },
    file: { unit: "bajtů", verb: "mít" },
    array: { unit: "prvků", verb: "mít" },
    set: { unit: "prvků", verb: "mít" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "regulární výraz",
    email: "e-mailová adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "datum a čas ve formátu ISO",
    date: "datum ve formátu ISO",
    time: "čas ve formátu ISO",
    duration: "doba trvání ISO",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "rozsah IPv4",
    cidrv6: "rozsah IPv6",
    base64: "řetězec zakódovaný ve formátu base64",
    base64url: "řetězec zakódovaný ve formátu base64url",
    json_string: "řetězec ve formátu JSON",
    e164: "číslo E.164",
    jwt: "JWT",
    template_literal: "vstup"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "číslo",
    string: "řetězec",
    function: "funkce",
    array: "pole"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Neplatný vstup: očekáváno instanceof ${issue.expected}, obdrženo ${received}`;
        }
        return `Neplatný vstup: očekáváno ${expected}, obdrženo ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Neplatný vstup: očekáváno ${stringifyPrimitive(issue.values[0])}`;
        return `Neplatná možnost: očekávána jedna z hodnot ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Hodnota je příliš velká: ${issue.origin ?? "hodnota"} musí mít ${adj}${issue.maximum.toString()} ${sizing.unit ?? "prvků"}`;
        }
        return `Hodnota je příliš velká: ${issue.origin ?? "hodnota"} musí být ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Hodnota je příliš malá: ${issue.origin ?? "hodnota"} musí mít ${adj}${issue.minimum.toString()} ${sizing.unit ?? "prvků"}`;
        }
        return `Hodnota je příliš malá: ${issue.origin ?? "hodnota"} musí být ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Neplatný řetězec: musí začínat na "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Neplatný řetězec: musí končit na "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Neplatný řetězec: musí obsahovat "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Neplatný řetězec: musí odpovídat vzoru ${_issue.pattern}`;
        return `Neplatný formát ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Neplatné číslo: musí být násobkem ${issue.divisor}`;
      case "unrecognized_keys":
        return `Neznámé klíče: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Neplatný klíč v ${issue.origin}`;
      case "invalid_union":
        return "Neplatný vstup";
      case "invalid_element":
        return `Neplatná hodnota v ${issue.origin}`;
      default:
        return `Neplatný vstup`;
    }
  };
};
function cs_default() {
  return {
    localeError: error6()
  };
}
// node_modules/zod/v4/locales/da.js
var error7 = () => {
  const Sizable = {
    string: { unit: "tegn", verb: "havde" },
    file: { unit: "bytes", verb: "havde" },
    array: { unit: "elementer", verb: "indeholdt" },
    set: { unit: "elementer", verb: "indeholdt" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "e-mailadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslæt",
    date: "ISO-dato",
    time: "ISO-klokkeslæt",
    duration: "ISO-varighed",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodet streng",
    base64url: "base64url-kodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "streng",
    number: "tal",
    boolean: "boolean",
    array: "liste",
    object: "objekt",
    set: "sæt",
    file: "fil"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Ugyldigt input: forventede instanceof ${issue.expected}, fik ${received}`;
        }
        return `Ugyldigt input: forventede ${expected}, fik ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Ugyldig værdi: forventede ${stringifyPrimitive(issue.values[0])}`;
        return `Ugyldigt valg: forventede en af følgende ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing)
          return `For stor: forventede ${origin ?? "value"} ${sizing.verb} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elementer"}`;
        return `For stor: forventede ${origin ?? "value"} havde ${adj} ${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing) {
          return `For lille: forventede ${origin} ${sizing.verb} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `For lille: forventede ${origin} havde ${adj} ${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Ugyldig streng: skal starte med "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Ugyldig streng: skal ende med "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ugyldig streng: skal indeholde "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ugyldig streng: skal matche mønsteret ${_issue.pattern}`;
        return `Ugyldig ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Ugyldigt tal: skal være deleligt med ${issue.divisor}`;
      case "unrecognized_keys":
        return `${issue.keys.length > 1 ? "Ukendte nøgler" : "Ukendt nøgle"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøgle i ${issue.origin}`;
      case "invalid_union":
        return "Ugyldigt input: matcher ingen af de tilladte typer";
      case "invalid_element":
        return `Ugyldig værdi i ${issue.origin}`;
      default:
        return `Ugyldigt input`;
    }
  };
};
function da_default() {
  return {
    localeError: error7()
  };
}
// node_modules/zod/v4/locales/de.js
var error8 = () => {
  const Sizable = {
    string: { unit: "Zeichen", verb: "zu haben" },
    file: { unit: "Bytes", verb: "zu haben" },
    array: { unit: "Elemente", verb: "zu haben" },
    set: { unit: "Elemente", verb: "zu haben" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "Eingabe",
    email: "E-Mail-Adresse",
    url: "URL",
    emoji: "Emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-Datum und -Uhrzeit",
    date: "ISO-Datum",
    time: "ISO-Uhrzeit",
    duration: "ISO-Dauer",
    ipv4: "IPv4-Adresse",
    ipv6: "IPv6-Adresse",
    cidrv4: "IPv4-Bereich",
    cidrv6: "IPv6-Bereich",
    base64: "Base64-codierter String",
    base64url: "Base64-URL-codierter String",
    json_string: "JSON-String",
    e164: "E.164-Nummer",
    jwt: "JWT",
    template_literal: "Eingabe"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "Zahl",
    array: "Array"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Ungültige Eingabe: erwartet instanceof ${issue.expected}, erhalten ${received}`;
        }
        return `Ungültige Eingabe: erwartet ${expected}, erhalten ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Ungültige Eingabe: erwartet ${stringifyPrimitive(issue.values[0])}`;
        return `Ungültige Option: erwartet eine von ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Zu groß: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "Elemente"} hat`;
        return `Zu groß: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ist`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} hat`;
        }
        return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ist`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Ungültiger String: muss mit "${_issue.prefix}" beginnen`;
        if (_issue.format === "ends_with")
          return `Ungültiger String: muss mit "${_issue.suffix}" enden`;
        if (_issue.format === "includes")
          return `Ungültiger String: muss "${_issue.includes}" enthalten`;
        if (_issue.format === "regex")
          return `Ungültiger String: muss dem Muster ${_issue.pattern} entsprechen`;
        return `Ungültig: ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Ungültige Zahl: muss ein Vielfaches von ${issue.divisor} sein`;
      case "unrecognized_keys":
        return `${issue.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Ungültiger Schlüssel in ${issue.origin}`;
      case "invalid_union":
        return "Ungültige Eingabe";
      case "invalid_element":
        return `Ungültiger Wert in ${issue.origin}`;
      default:
        return `Ungültige Eingabe`;
    }
  };
};
function de_default() {
  return {
    localeError: error8()
  };
}
// node_modules/zod/v4/locales/el.js
var error9 = () => {
  const Sizable = {
    string: { unit: "χαρακτήρες", verb: "να έχει" },
    file: { unit: "bytes", verb: "να έχει" },
    array: { unit: "στοιχεία", verb: "να έχει" },
    set: { unit: "στοιχεία", verb: "να έχει" },
    map: { unit: "καταχωρήσεις", verb: "να έχει" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "είσοδος",
    email: "διεύθυνση email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO ημερομηνία και ώρα",
    date: "ISO ημερομηνία",
    time: "ISO ώρα",
    duration: "ISO διάρκεια",
    ipv4: "διεύθυνση IPv4",
    ipv6: "διεύθυνση IPv6",
    mac: "διεύθυνση MAC",
    cidrv4: "εύρος IPv4",
    cidrv6: "εύρος IPv6",
    base64: "συμβολοσειρά κωδικοποιημένη σε base64",
    base64url: "συμβολοσειρά κωδικοποιημένη σε base64url",
    json_string: "συμβολοσειρά JSON",
    e164: "αριθμός E.164",
    jwt: "JWT",
    template_literal: "είσοδος"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (typeof issue.expected === "string" && /^[A-Z]/.test(issue.expected)) {
          return `Μη έγκυρη είσοδος: αναμενόταν instanceof ${issue.expected}, λήφθηκε ${received}`;
        }
        return `Μη έγκυρη είσοδος: αναμενόταν ${expected}, λήφθηκε ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Μη έγκυρη είσοδος: αναμενόταν ${stringifyPrimitive(issue.values[0])}`;
        return `Μη έγκυρη επιλογή: αναμενόταν ένα από ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Πολύ μεγάλο: αναμενόταν ${issue.origin ?? "τιμή"} να έχει ${adj}${issue.maximum.toString()} ${sizing.unit ?? "στοιχεία"}`;
        return `Πολύ μεγάλο: αναμενόταν ${issue.origin ?? "τιμή"} να είναι ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Πολύ μικρό: αναμενόταν ${issue.origin} να έχει ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Πολύ μικρό: αναμενόταν ${issue.origin} να είναι ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Μη έγκυρη συμβολοσειρά: πρέπει να ξεκινά με "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Μη έγκυρη συμβολοσειρά: πρέπει να τελειώνει με "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Μη έγκυρη συμβολοσειρά: πρέπει να περιέχει "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Μη έγκυρη συμβολοσειρά: πρέπει να ταιριάζει με το μοτίβο ${_issue.pattern}`;
        return `Μη έγκυρο: ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Μη έγκυρος αριθμός: πρέπει να είναι πολλαπλάσιο του ${issue.divisor}`;
      case "unrecognized_keys":
        return `Άγνωστ${issue.keys.length > 1 ? "α" : "ο"} κλειδ${issue.keys.length > 1 ? "ιά" : "ί"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Μη έγκυρο κλειδί στο ${issue.origin}`;
      case "invalid_union":
        return "Μη έγκυρη είσοδος";
      case "invalid_element":
        return `Μη έγκυρη τιμή στο ${issue.origin}`;
      default:
        return `Μη έγκυρη είσοδος`;
    }
  };
};
function el_default() {
  return {
    localeError: error9()
  };
}
// node_modules/zod/v4/locales/en.js
var error10 = () => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue.origin}`;
      case "invalid_union":
        if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) {
          const opts = issue.options.map((o) => `'${o}'`).join(" | ");
          return `Invalid discriminator value. Expected ${opts}`;
        }
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue.origin}`;
      default:
        return `Invalid input`;
    }
  };
};
function en_default() {
  return {
    localeError: error10()
  };
}
// node_modules/zod/v4/locales/eo.js
var error11 = () => {
  const Sizable = {
    string: { unit: "karaktrojn", verb: "havi" },
    file: { unit: "bajtojn", verb: "havi" },
    array: { unit: "elementojn", verb: "havi" },
    set: { unit: "elementojn", verb: "havi" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "enigo",
    email: "retadreso",
    url: "URL",
    emoji: "emoĝio",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datotempo",
    date: "ISO-dato",
    time: "ISO-tempo",
    duration: "ISO-daŭro",
    ipv4: "IPv4-adreso",
    ipv6: "IPv6-adreso",
    cidrv4: "IPv4-rango",
    cidrv6: "IPv6-rango",
    base64: "64-ume kodita karaktraro",
    base64url: "URL-64-ume kodita karaktraro",
    json_string: "JSON-karaktraro",
    e164: "E.164-nombro",
    jwt: "JWT",
    template_literal: "enigo"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nombro",
    array: "tabelo",
    null: "senvalora"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Nevalida enigo: atendiĝis instanceof ${issue.expected}, riceviĝis ${received}`;
        }
        return `Nevalida enigo: atendiĝis ${expected}, riceviĝis ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Nevalida enigo: atendiĝis ${stringifyPrimitive(issue.values[0])}`;
        return `Nevalida opcio: atendiĝis unu el ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Tro granda: atendiĝis ke ${issue.origin ?? "valoro"} havu ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementojn"}`;
        return `Tro granda: atendiĝis ke ${issue.origin ?? "valoro"} havu ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Tro malgranda: atendiĝis ke ${issue.origin} havu ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Tro malgranda: atendiĝis ke ${issue.origin} estu ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Nevalida karaktraro: devas komenciĝi per "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Nevalida karaktraro: devas finiĝi per "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Nevalida karaktraro: devas inkluzivi "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Nevalida karaktraro: devas kongrui kun la modelo ${_issue.pattern}`;
        return `Nevalida ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Nevalida nombro: devas esti oblo de ${issue.divisor}`;
      case "unrecognized_keys":
        return `Nekonata${issue.keys.length > 1 ? "j" : ""} ŝlosilo${issue.keys.length > 1 ? "j" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Nevalida ŝlosilo en ${issue.origin}`;
      case "invalid_union":
        return "Nevalida enigo";
      case "invalid_element":
        return `Nevalida valoro en ${issue.origin}`;
      default:
        return `Nevalida enigo`;
    }
  };
};
function eo_default() {
  return {
    localeError: error11()
  };
}
// node_modules/zod/v4/locales/es.js
var error12 = () => {
  const Sizable = {
    string: { unit: "caracteres", verb: "tener" },
    file: { unit: "bytes", verb: "tener" },
    array: { unit: "elementos", verb: "tener" },
    set: { unit: "elementos", verb: "tener" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entrada",
    email: "dirección de correo electrónico",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "fecha y hora ISO",
    date: "fecha ISO",
    time: "hora ISO",
    duration: "duración ISO",
    ipv4: "dirección IPv4",
    ipv6: "dirección IPv6",
    cidrv4: "rango IPv4",
    cidrv6: "rango IPv6",
    base64: "cadena codificada en base64",
    base64url: "URL codificada en base64",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "texto",
    number: "número",
    boolean: "booleano",
    array: "arreglo",
    object: "objeto",
    set: "conjunto",
    file: "archivo",
    date: "fecha",
    bigint: "número grande",
    symbol: "símbolo",
    undefined: "indefinido",
    null: "nulo",
    function: "función",
    map: "mapa",
    record: "registro",
    tuple: "tupla",
    enum: "enumeración",
    union: "unión",
    literal: "literal",
    promise: "promesa",
    void: "vacío",
    never: "nunca",
    unknown: "desconocido",
    any: "cualquiera"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Entrada inválida: se esperaba instanceof ${issue.expected}, recibido ${received}`;
        }
        return `Entrada inválida: se esperaba ${expected}, recibido ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Entrada inválida: se esperaba ${stringifyPrimitive(issue.values[0])}`;
        return `Opción inválida: se esperaba una de ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing)
          return `Demasiado grande: se esperaba que ${origin ?? "valor"} tuviera ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
        return `Demasiado grande: se esperaba que ${origin ?? "valor"} fuera ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing) {
          return `Demasiado pequeño: se esperaba que ${origin} tuviera ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Demasiado pequeño: se esperaba que ${origin} fuera ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Cadena inválida: debe comenzar con "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Cadena inválida: debe terminar en "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Cadena inválida: debe incluir "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Cadena inválida: debe coincidir con el patrón ${_issue.pattern}`;
        return `Inválido ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Número inválido: debe ser múltiplo de ${issue.divisor}`;
      case "unrecognized_keys":
        return `Llave${issue.keys.length > 1 ? "s" : ""} desconocida${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Llave inválida en ${TypeDictionary[issue.origin] ?? issue.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido en ${TypeDictionary[issue.origin] ?? issue.origin}`;
      default:
        return `Entrada inválida`;
    }
  };
};
function es_default() {
  return {
    localeError: error12()
  };
}
// node_modules/zod/v4/locales/fa.js
var error13 = () => {
  const Sizable = {
    string: { unit: "کاراکتر", verb: "داشته باشد" },
    file: { unit: "بایت", verb: "داشته باشد" },
    array: { unit: "آیتم", verb: "داشته باشد" },
    set: { unit: "آیتم", verb: "داشته باشد" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ورودی",
    email: "آدرس ایمیل",
    url: "URL",
    emoji: "ایموجی",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاریخ و زمان ایزو",
    date: "تاریخ ایزو",
    time: "زمان ایزو",
    duration: "مدت زمان ایزو",
    ipv4: "IPv4 آدرس",
    ipv6: "IPv6 آدرس",
    cidrv4: "IPv4 دامنه",
    cidrv6: "IPv6 دامنه",
    base64: "base64-encoded رشته",
    base64url: "base64url-encoded رشته",
    json_string: "JSON رشته",
    e164: "E.164 عدد",
    jwt: "JWT",
    template_literal: "ورودی"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "عدد",
    array: "آرایه"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `ورودی نامعتبر: می‌بایست instanceof ${issue.expected} می‌بود، ${received} دریافت شد`;
        }
        return `ورودی نامعتبر: می‌بایست ${expected} می‌بود، ${received} دریافت شد`;
      }
      case "invalid_value":
        if (issue.values.length === 1) {
          return `ورودی نامعتبر: می‌بایست ${stringifyPrimitive(issue.values[0])} می‌بود`;
        }
        return `گزینه نامعتبر: می‌بایست یکی از ${joinValues(issue.values, "|")} می‌بود`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `خیلی بزرگ: ${issue.origin ?? "مقدار"} باید ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عنصر"} باشد`;
        }
        return `خیلی بزرگ: ${issue.origin ?? "مقدار"} باید ${adj}${issue.maximum.toString()} باشد`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} باشد`;
        }
        return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} باشد`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `رشته نامعتبر: باید با "${_issue.prefix}" شروع شود`;
        }
        if (_issue.format === "ends_with") {
          return `رشته نامعتبر: باید با "${_issue.suffix}" تمام شود`;
        }
        if (_issue.format === "includes") {
          return `رشته نامعتبر: باید شامل "${_issue.includes}" باشد`;
        }
        if (_issue.format === "regex") {
          return `رشته نامعتبر: باید با الگوی ${_issue.pattern} مطابقت داشته باشد`;
        }
        return `${FormatDictionary[_issue.format] ?? issue.format} نامعتبر`;
      }
      case "not_multiple_of":
        return `عدد نامعتبر: باید مضرب ${issue.divisor} باشد`;
      case "unrecognized_keys":
        return `کلید${issue.keys.length > 1 ? "های" : ""} ناشناس: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `کلید ناشناس در ${issue.origin}`;
      case "invalid_union":
        return `ورودی نامعتبر`;
      case "invalid_element":
        return `مقدار نامعتبر در ${issue.origin}`;
      default:
        return `ورودی نامعتبر`;
    }
  };
};
function fa_default() {
  return {
    localeError: error13()
  };
}
// node_modules/zod/v4/locales/fi.js
var error14 = () => {
  const Sizable = {
    string: { unit: "merkkiä", subject: "merkkijonon" },
    file: { unit: "tavua", subject: "tiedoston" },
    array: { unit: "alkiota", subject: "listan" },
    set: { unit: "alkiota", subject: "joukon" },
    number: { unit: "", subject: "luvun" },
    bigint: { unit: "", subject: "suuren kokonaisluvun" },
    int: { unit: "", subject: "kokonaisluvun" },
    date: { unit: "", subject: "päivämäärän" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "säännöllinen lauseke",
    email: "sähköpostiosoite",
    url: "URL-osoite",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-aikaleima",
    date: "ISO-päivämäärä",
    time: "ISO-aika",
    duration: "ISO-kesto",
    ipv4: "IPv4-osoite",
    ipv6: "IPv6-osoite",
    cidrv4: "IPv4-alue",
    cidrv6: "IPv6-alue",
    base64: "base64-koodattu merkkijono",
    base64url: "base64url-koodattu merkkijono",
    json_string: "JSON-merkkijono",
    e164: "E.164-luku",
    jwt: "JWT",
    template_literal: "templaattimerkkijono"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Virheellinen tyyppi: odotettiin instanceof ${issue.expected}, oli ${received}`;
        }
        return `Virheellinen tyyppi: odotettiin ${expected}, oli ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Virheellinen syöte: täytyy olla ${stringifyPrimitive(issue.values[0])}`;
        return `Virheellinen valinta: täytyy olla yksi seuraavista: ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Liian suuri: ${sizing.subject} täytyy olla ${adj}${issue.maximum.toString()} ${sizing.unit}`.trim();
        }
        return `Liian suuri: arvon täytyy olla ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Liian pieni: ${sizing.subject} täytyy olla ${adj}${issue.minimum.toString()} ${sizing.unit}`.trim();
        }
        return `Liian pieni: arvon täytyy olla ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Virheellinen syöte: täytyy alkaa "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Virheellinen syöte: täytyy loppua "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Virheellinen syöte: täytyy sisältää "${_issue.includes}"`;
        if (_issue.format === "regex") {
          return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${_issue.pattern}`;
        }
        return `Virheellinen ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Virheellinen luku: täytyy olla luvun ${issue.divisor} monikerta`;
      case "unrecognized_keys":
        return `${issue.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return "Virheellinen avain tietueessa";
      case "invalid_union":
        return "Virheellinen unioni";
      case "invalid_element":
        return "Virheellinen arvo joukossa";
      default:
        return `Virheellinen syöte`;
    }
  };
};
function fi_default() {
  return {
    localeError: error14()
  };
}
// node_modules/zod/v4/locales/fr.js
var error15 = () => {
  const Sizable = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entrée",
    email: "adresse e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date et heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
  };
  const TypeDictionary = {
    string: "chaîne",
    number: "nombre",
    int: "entier",
    boolean: "booléen",
    bigint: "grand entier",
    symbol: "symbole",
    undefined: "indéfini",
    null: "null",
    never: "jamais",
    void: "vide",
    date: "date",
    array: "tableau",
    object: "objet",
    tuple: "tuple",
    record: "enregistrement",
    map: "carte",
    set: "ensemble",
    file: "fichier",
    nonoptional: "non-optionnel",
    nan: "NaN",
    function: "fonction"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Entrée invalide : instanceof ${issue.expected} attendu, ${received} reçu`;
        }
        return `Entrée invalide : ${expected} attendu, ${received} reçu`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Entrée invalide : ${stringifyPrimitive(issue.values[0])} attendu`;
        return `Option invalide : une valeur parmi ${joinValues(issue.values, "|")} attendue`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Trop grand : ${TypeDictionary[issue.origin] ?? "valeur"} doit ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "élément(s)"}`;
        return `Trop grand : ${TypeDictionary[issue.origin] ?? "valeur"} doit être ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Trop petit : ${TypeDictionary[issue.origin] ?? "valeur"} doit ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        return `Trop petit : ${TypeDictionary[issue.origin] ?? "valeur"} doit être ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Chaîne invalide : doit inclure "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Chaîne invalide : doit correspondre au modèle ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
      case "unrecognized_keys":
        return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${issue.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${issue.origin}`;
      default:
        return `Entrée invalide`;
    }
  };
};
function fr_default() {
  return {
    localeError: error15()
  };
}
// node_modules/zod/v4/locales/fr-CA.js
var error16 = () => {
  const Sizable = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entrée",
    email: "adresse courriel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date-heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Entrée invalide : attendu instanceof ${issue.expected}, reçu ${received}`;
        }
        return `Entrée invalide : attendu ${expected}, reçu ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Entrée invalide : attendu ${stringifyPrimitive(issue.values[0])}`;
        return `Option invalide : attendu l'une des valeurs suivantes ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "≤" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Trop grand : attendu que ${issue.origin ?? "la valeur"} ait ${adj}${issue.maximum.toString()} ${sizing.unit}`;
        return `Trop grand : attendu que ${issue.origin ?? "la valeur"} soit ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? "≥" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Trop petit : attendu que ${issue.origin} ait ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Trop petit : attendu que ${issue.origin} soit ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Chaîne invalide : doit inclure "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Chaîne invalide : doit correspondre au motif ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
      case "unrecognized_keys":
        return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${issue.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${issue.origin}`;
      default:
        return `Entrée invalide`;
    }
  };
};
function fr_CA_default() {
  return {
    localeError: error16()
  };
}
// node_modules/zod/v4/locales/he.js
var error17 = () => {
  const TypeNames = {
    string: { label: "מחרוזת", gender: "f" },
    number: { label: "מספר", gender: "m" },
    boolean: { label: "ערך בוליאני", gender: "m" },
    bigint: { label: "BigInt", gender: "m" },
    date: { label: "תאריך", gender: "m" },
    array: { label: "מערך", gender: "m" },
    object: { label: "אובייקט", gender: "m" },
    null: { label: "ערך ריק (null)", gender: "m" },
    undefined: { label: "ערך לא מוגדר (undefined)", gender: "m" },
    symbol: { label: "סימבול (Symbol)", gender: "m" },
    function: { label: "פונקציה", gender: "f" },
    map: { label: "מפה (Map)", gender: "f" },
    set: { label: "קבוצה (Set)", gender: "f" },
    file: { label: "קובץ", gender: "m" },
    promise: { label: "Promise", gender: "m" },
    NaN: { label: "NaN", gender: "m" },
    unknown: { label: "ערך לא ידוע", gender: "m" },
    value: { label: "ערך", gender: "m" }
  };
  const Sizable = {
    string: { unit: "תווים", shortLabel: "קצר", longLabel: "ארוך" },
    file: { unit: "בייטים", shortLabel: "קטן", longLabel: "גדול" },
    array: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    set: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    number: { unit: "", shortLabel: "קטן", longLabel: "גדול" }
  };
  const typeEntry = (t) => t ? TypeNames[t] : undefined;
  const typeLabel = (t) => {
    const e = typeEntry(t);
    if (e)
      return e.label;
    return t ?? TypeNames.unknown.label;
  };
  const withDefinite = (t) => `ה${typeLabel(t)}`;
  const verbFor = (t) => {
    const e = typeEntry(t);
    const gender = e?.gender ?? "m";
    return gender === "f" ? "צריכה להיות" : "צריך להיות";
  };
  const getSizing = (origin) => {
    if (!origin)
      return null;
    return Sizable[origin] ?? null;
  };
  const FormatDictionary = {
    regex: { label: "קלט", gender: "m" },
    email: { label: "כתובת אימייל", gender: "f" },
    url: { label: "כתובת רשת", gender: "f" },
    emoji: { label: "אימוג'י", gender: "m" },
    uuid: { label: "UUID", gender: "m" },
    nanoid: { label: "nanoid", gender: "m" },
    guid: { label: "GUID", gender: "m" },
    cuid: { label: "cuid", gender: "m" },
    cuid2: { label: "cuid2", gender: "m" },
    ulid: { label: "ULID", gender: "m" },
    xid: { label: "XID", gender: "m" },
    ksuid: { label: "KSUID", gender: "m" },
    datetime: { label: "תאריך וזמן ISO", gender: "m" },
    date: { label: "תאריך ISO", gender: "m" },
    time: { label: "זמן ISO", gender: "m" },
    duration: { label: "משך זמן ISO", gender: "m" },
    ipv4: { label: "כתובת IPv4", gender: "f" },
    ipv6: { label: "כתובת IPv6", gender: "f" },
    cidrv4: { label: "טווח IPv4", gender: "m" },
    cidrv6: { label: "טווח IPv6", gender: "m" },
    base64: { label: "מחרוזת בבסיס 64", gender: "f" },
    base64url: { label: "מחרוזת בבסיס 64 לכתובות רשת", gender: "f" },
    json_string: { label: "מחרוזת JSON", gender: "f" },
    e164: { label: "מספר E.164", gender: "m" },
    jwt: { label: "JWT", gender: "m" },
    ends_with: { label: "קלט", gender: "m" },
    includes: { label: "קלט", gender: "m" },
    lowercase: { label: "קלט", gender: "m" },
    starts_with: { label: "קלט", gender: "m" },
    uppercase: { label: "קלט", gender: "m" }
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expectedKey = issue.expected;
        const expected = TypeDictionary[expectedKey ?? ""] ?? typeLabel(expectedKey);
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? TypeNames[receivedType]?.label ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `קלט לא תקין: צריך להיות instanceof ${issue.expected}, התקבל ${received}`;
        }
        return `קלט לא תקין: צריך להיות ${expected}, התקבל ${received}`;
      }
      case "invalid_value": {
        if (issue.values.length === 1) {
          return `ערך לא תקין: הערך חייב להיות ${stringifyPrimitive(issue.values[0])}`;
        }
        const stringified = issue.values.map((v) => stringifyPrimitive(v));
        if (issue.values.length === 2) {
          return `ערך לא תקין: האפשרויות המתאימות הן ${stringified[0]} או ${stringified[1]}`;
        }
        const lastValue = stringified[stringified.length - 1];
        const restValues = stringified.slice(0, -1).join(", ");
        return `ערך לא תקין: האפשרויות המתאימות הן ${restValues} או ${lastValue}`;
      }
      case "too_big": {
        const sizing = getSizing(issue.origin);
        const subject = withDefinite(issue.origin ?? "value");
        if (issue.origin === "string") {
          return `${sizing?.longLabel ?? "ארוך"} מדי: ${subject} צריכה להכיל ${issue.maximum.toString()} ${sizing?.unit ?? ""} ${issue.inclusive ? "או פחות" : "לכל היותר"}`.trim();
        }
        if (issue.origin === "number") {
          const comparison = issue.inclusive ? `קטן או שווה ל-${issue.maximum}` : `קטן מ-${issue.maximum}`;
          return `גדול מדי: ${subject} צריך להיות ${comparison}`;
        }
        if (issue.origin === "array" || issue.origin === "set") {
          const verb = issue.origin === "set" ? "צריכה" : "צריך";
          const comparison = issue.inclusive ? `${issue.maximum} ${sizing?.unit ?? ""} או פחות` : `פחות מ-${issue.maximum} ${sizing?.unit ?? ""}`;
          return `גדול מדי: ${subject} ${verb} להכיל ${comparison}`.trim();
        }
        const adj = issue.inclusive ? "<=" : "<";
        const be = verbFor(issue.origin ?? "value");
        if (sizing?.unit) {
          return `${sizing.longLabel} מדי: ${subject} ${be} ${adj}${issue.maximum.toString()} ${sizing.unit}`;
        }
        return `${sizing?.longLabel ?? "גדול"} מדי: ${subject} ${be} ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const sizing = getSizing(issue.origin);
        const subject = withDefinite(issue.origin ?? "value");
        if (issue.origin === "string") {
          return `${sizing?.shortLabel ?? "קצר"} מדי: ${subject} צריכה להכיל ${issue.minimum.toString()} ${sizing?.unit ?? ""} ${issue.inclusive ? "או יותר" : "לפחות"}`.trim();
        }
        if (issue.origin === "number") {
          const comparison = issue.inclusive ? `גדול או שווה ל-${issue.minimum}` : `גדול מ-${issue.minimum}`;
          return `קטן מדי: ${subject} צריך להיות ${comparison}`;
        }
        if (issue.origin === "array" || issue.origin === "set") {
          const verb = issue.origin === "set" ? "צריכה" : "צריך";
          if (issue.minimum === 1 && issue.inclusive) {
            const singularPhrase = issue.origin === "set" ? "לפחות פריט אחד" : "לפחות פריט אחד";
            return `קטן מדי: ${subject} ${verb} להכיל ${singularPhrase}`;
          }
          const comparison = issue.inclusive ? `${issue.minimum} ${sizing?.unit ?? ""} או יותר` : `יותר מ-${issue.minimum} ${sizing?.unit ?? ""}`;
          return `קטן מדי: ${subject} ${verb} להכיל ${comparison}`.trim();
        }
        const adj = issue.inclusive ? ">=" : ">";
        const be = verbFor(issue.origin ?? "value");
        if (sizing?.unit) {
          return `${sizing.shortLabel} מדי: ${subject} ${be} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `${sizing?.shortLabel ?? "קטן"} מדי: ${subject} ${be} ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `המחרוזת חייבת להתחיל ב "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `המחרוזת חייבת להסתיים ב "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `המחרוזת חייבת לכלול "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `המחרוזת חייבת להתאים לתבנית ${_issue.pattern}`;
        const nounEntry = FormatDictionary[_issue.format];
        const noun = nounEntry?.label ?? _issue.format;
        const gender = nounEntry?.gender ?? "m";
        const adjective = gender === "f" ? "תקינה" : "תקין";
        return `${noun} לא ${adjective}`;
      }
      case "not_multiple_of":
        return `מספר לא תקין: חייב להיות מכפלה של ${issue.divisor}`;
      case "unrecognized_keys":
        return `מפתח${issue.keys.length > 1 ? "ות" : ""} לא מזוה${issue.keys.length > 1 ? "ים" : "ה"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key": {
        return `שדה לא תקין באובייקט`;
      }
      case "invalid_union":
        return "קלט לא תקין";
      case "invalid_element": {
        const place = withDefinite(issue.origin ?? "array");
        return `ערך לא תקין ב${place}`;
      }
      default:
        return `קלט לא תקין`;
    }
  };
};
function he_default() {
  return {
    localeError: error17()
  };
}
// node_modules/zod/v4/locales/hr.js
var error18 = () => {
  const Sizable = {
    string: { unit: "znakova", verb: "imati" },
    file: { unit: "bajtova", verb: "imati" },
    array: { unit: "stavki", verb: "imati" },
    set: { unit: "stavki", verb: "imati" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "unos",
    email: "email adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum i vrijeme",
    date: "ISO datum",
    time: "ISO vrijeme",
    duration: "ISO trajanje",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "IPv4 raspon",
    cidrv6: "IPv6 raspon",
    base64: "base64 kodirani tekst",
    base64url: "base64url kodirani tekst",
    json_string: "JSON tekst",
    e164: "E.164 broj",
    jwt: "JWT",
    template_literal: "unos"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "tekst",
    number: "broj",
    boolean: "boolean",
    array: "niz",
    object: "objekt",
    set: "skup",
    file: "datoteka",
    date: "datum",
    bigint: "bigint",
    symbol: "simbol",
    undefined: "undefined",
    null: "null",
    function: "funkcija",
    map: "mapa"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Neispravan unos: očekuje se instanceof ${issue.expected}, a primljeno je ${received}`;
        }
        return `Neispravan unos: očekuje se ${expected}, a primljeno je ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Neispravna vrijednost: očekivano ${stringifyPrimitive(issue.values[0])}`;
        return `Neispravna opcija: očekivano jedno od ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing)
          return `Preveliko: očekivano da ${origin ?? "vrijednost"} ima ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemenata"}`;
        return `Preveliko: očekivano da ${origin ?? "vrijednost"} bude ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing) {
          return `Premalo: očekivano da ${origin} ima ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Premalo: očekivano da ${origin} bude ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Neispravan tekst: mora započinjati s "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Neispravan tekst: mora završavati s "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Neispravan tekst: mora sadržavati "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Neispravan tekst: mora odgovarati uzorku ${_issue.pattern}`;
        return `Neispravna ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Neispravan broj: mora biti višekratnik od ${issue.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznat${issue.keys.length > 1 ? "i ključevi" : " ključ"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Neispravan ključ u ${TypeDictionary[issue.origin] ?? issue.origin}`;
      case "invalid_union":
        return "Neispravan unos";
      case "invalid_element":
        return `Neispravna vrijednost u ${TypeDictionary[issue.origin] ?? issue.origin}`;
      default:
        return `Neispravan unos`;
    }
  };
};
function hr_default() {
  return {
    localeError: error18()
  };
}
// node_modules/zod/v4/locales/hu.js
var error19 = () => {
  const Sizable = {
    string: { unit: "karakter", verb: "legyen" },
    file: { unit: "byte", verb: "legyen" },
    array: { unit: "elem", verb: "legyen" },
    set: { unit: "elem", verb: "legyen" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "bemenet",
    email: "email cím",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO időbélyeg",
    date: "ISO dátum",
    time: "ISO idő",
    duration: "ISO időintervallum",
    ipv4: "IPv4 cím",
    ipv6: "IPv6 cím",
    cidrv4: "IPv4 tartomány",
    cidrv6: "IPv6 tartomány",
    base64: "base64-kódolt string",
    base64url: "base64url-kódolt string",
    json_string: "JSON string",
    e164: "E.164 szám",
    jwt: "JWT",
    template_literal: "bemenet"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "szám",
    array: "tömb"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Érvénytelen bemenet: a várt érték instanceof ${issue.expected}, a kapott érték ${received}`;
        }
        return `Érvénytelen bemenet: a várt érték ${expected}, a kapott érték ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Érvénytelen bemenet: a várt érték ${stringifyPrimitive(issue.values[0])}`;
        return `Érvénytelen opció: valamelyik érték várt ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Túl nagy: ${issue.origin ?? "érték"} mérete túl nagy ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elem"}`;
        return `Túl nagy: a bemeneti érték ${issue.origin ?? "érték"} túl nagy: ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Túl kicsi: a bemeneti érték ${issue.origin} mérete túl kicsi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Túl kicsi: a bemeneti érték ${issue.origin} túl kicsi ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Érvénytelen string: "${_issue.prefix}" értékkel kell kezdődnie`;
        if (_issue.format === "ends_with")
          return `Érvénytelen string: "${_issue.suffix}" értékkel kell végződnie`;
        if (_issue.format === "includes")
          return `Érvénytelen string: "${_issue.includes}" értéket kell tartalmaznia`;
        if (_issue.format === "regex")
          return `Érvénytelen string: ${_issue.pattern} mintának kell megfelelnie`;
        return `Érvénytelen ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Érvénytelen szám: ${issue.divisor} többszörösének kell lennie`;
      case "unrecognized_keys":
        return `Ismeretlen kulcs${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Érvénytelen kulcs ${issue.origin}`;
      case "invalid_union":
        return "Érvénytelen bemenet";
      case "invalid_element":
        return `Érvénytelen érték: ${issue.origin}`;
      default:
        return `Érvénytelen bemenet`;
    }
  };
};
function hu_default() {
  return {
    localeError: error19()
  };
}
// node_modules/zod/v4/locales/hy.js
function getArmenianPlural(count, one, many) {
  return Math.abs(count) === 1 ? one : many;
}
function withDefiniteArticle(word) {
  if (!word)
    return "";
  const vowels = ["ա", "ե", "ը", "ի", "ո", "ու", "օ"];
  const lastChar = word[word.length - 1];
  return word + (vowels.includes(lastChar) ? "ն" : "ը");
}
var error20 = () => {
  const Sizable = {
    string: {
      unit: {
        one: "նշան",
        many: "նշաններ"
      },
      verb: "ունենալ"
    },
    file: {
      unit: {
        one: "բայթ",
        many: "բայթեր"
      },
      verb: "ունենալ"
    },
    array: {
      unit: {
        one: "տարր",
        many: "տարրեր"
      },
      verb: "ունենալ"
    },
    set: {
      unit: {
        one: "տարր",
        many: "տարրեր"
      },
      verb: "ունենալ"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "մուտք",
    email: "էլ. հասցե",
    url: "URL",
    emoji: "էմոջի",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO ամսաթիվ և ժամ",
    date: "ISO ամսաթիվ",
    time: "ISO ժամ",
    duration: "ISO տևողություն",
    ipv4: "IPv4 հասցե",
    ipv6: "IPv6 հասցե",
    cidrv4: "IPv4 միջակայք",
    cidrv6: "IPv6 միջակայք",
    base64: "base64 ձևաչափով տող",
    base64url: "base64url ձևաչափով տող",
    json_string: "JSON տող",
    e164: "E.164 համար",
    jwt: "JWT",
    template_literal: "մուտք"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "թիվ",
    array: "զանգված"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Սխալ մուտքագրում․ սպասվում էր instanceof ${issue.expected}, ստացվել է ${received}`;
        }
        return `Սխալ մուտքագրում․ սպասվում էր ${expected}, ստացվել է ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Սխալ մուտքագրում․ սպասվում էր ${stringifyPrimitive(issue.values[1])}`;
        return `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          const maxValue = Number(issue.maximum);
          const unit = getArmenianPlural(maxValue, sizing.unit.one, sizing.unit.many);
          return `Չափազանց մեծ արժեք․ սպասվում է, որ ${withDefiniteArticle(issue.origin ?? "արժեք")} կունենա ${adj}${issue.maximum.toString()} ${unit}`;
        }
        return `Չափազանց մեծ արժեք․ սպասվում է, որ ${withDefiniteArticle(issue.origin ?? "արժեք")} լինի ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          const minValue = Number(issue.minimum);
          const unit = getArmenianPlural(minValue, sizing.unit.one, sizing.unit.many);
          return `Չափազանց փոքր արժեք․ սպասվում է, որ ${withDefiniteArticle(issue.origin)} կունենա ${adj}${issue.minimum.toString()} ${unit}`;
        }
        return `Չափազանց փոքր արժեք․ սպասվում է, որ ${withDefiniteArticle(issue.origin)} լինի ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Սխալ տող․ պետք է սկսվի "${_issue.prefix}"-ով`;
        if (_issue.format === "ends_with")
          return `Սխալ տող․ պետք է ավարտվի "${_issue.suffix}"-ով`;
        if (_issue.format === "includes")
          return `Սխալ տող․ պետք է պարունակի "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Սխալ տող․ պետք է համապատասխանի ${_issue.pattern} ձևաչափին`;
        return `Սխալ ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${issue.divisor}-ի`;
      case "unrecognized_keys":
        return `Չճանաչված բանալի${issue.keys.length > 1 ? "ներ" : ""}. ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Սխալ բանալի ${withDefiniteArticle(issue.origin)}-ում`;
      case "invalid_union":
        return "Սխալ մուտքագրում";
      case "invalid_element":
        return `Սխալ արժեք ${withDefiniteArticle(issue.origin)}-ում`;
      default:
        return `Սխալ մուտքագրում`;
    }
  };
};
function hy_default() {
  return {
    localeError: error20()
  };
}
// node_modules/zod/v4/locales/id.js
var error21 = () => {
  const Sizable = {
    string: { unit: "karakter", verb: "memiliki" },
    file: { unit: "byte", verb: "memiliki" },
    array: { unit: "item", verb: "memiliki" },
    set: { unit: "item", verb: "memiliki" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "alamat email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tanggal dan waktu format ISO",
    date: "tanggal format ISO",
    time: "jam format ISO",
    duration: "durasi format ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "rentang alamat IPv4",
    cidrv6: "rentang alamat IPv6",
    base64: "string dengan enkode base64",
    base64url: "string dengan enkode base64url",
    json_string: "string JSON",
    e164: "angka E.164",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Input tidak valid: diharapkan instanceof ${issue.expected}, diterima ${received}`;
        }
        return `Input tidak valid: diharapkan ${expected}, diterima ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Input tidak valid: diharapkan ${stringifyPrimitive(issue.values[0])}`;
        return `Pilihan tidak valid: diharapkan salah satu dari ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Terlalu besar: diharapkan ${issue.origin ?? "value"} memiliki ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
        return `Terlalu besar: diharapkan ${issue.origin ?? "value"} menjadi ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Terlalu kecil: diharapkan ${issue.origin} memiliki ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Terlalu kecil: diharapkan ${issue.origin} menjadi ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `String tidak valid: harus menyertakan "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue.format} tidak valid`;
      }
      case "not_multiple_of":
        return `Angka tidak valid: harus kelipatan dari ${issue.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali ${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak valid di ${issue.origin}`;
      case "invalid_union":
        return "Input tidak valid";
      case "invalid_element":
        return `Nilai tidak valid di ${issue.origin}`;
      default:
        return `Input tidak valid`;
    }
  };
};
function id_default() {
  return {
    localeError: error21()
  };
}
// node_modules/zod/v4/locales/is.js
var error22 = () => {
  const Sizable = {
    string: { unit: "stafi", verb: "að hafa" },
    file: { unit: "bæti", verb: "að hafa" },
    array: { unit: "hluti", verb: "að hafa" },
    set: { unit: "hluti", verb: "að hafa" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "gildi",
    email: "netfang",
    url: "vefslóð",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dagsetning og tími",
    date: "ISO dagsetning",
    time: "ISO tími",
    duration: "ISO tímalengd",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded strengur",
    base64url: "base64url-encoded strengur",
    json_string: "JSON strengur",
    e164: "E.164 tölugildi",
    jwt: "JWT",
    template_literal: "gildi"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "númer",
    array: "fylki"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Rangt gildi: Þú slóst inn ${received} þar sem á að vera instanceof ${issue.expected}`;
        }
        return `Rangt gildi: Þú slóst inn ${received} þar sem á að vera ${expected}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Rangt gildi: gert ráð fyrir ${stringifyPrimitive(issue.values[0])}`;
        return `Ógilt val: má vera eitt af eftirfarandi ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Of stórt: gert er ráð fyrir að ${issue.origin ?? "gildi"} hafi ${adj}${issue.maximum.toString()} ${sizing.unit ?? "hluti"}`;
        return `Of stórt: gert er ráð fyrir að ${issue.origin ?? "gildi"} sé ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Of lítið: gert er ráð fyrir að ${issue.origin} hafi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Of lítið: gert er ráð fyrir að ${issue.origin} sé ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Ógildur strengur: verður að byrja á "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Ógildur strengur: verður að enda á "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ógildur strengur: verður að innihalda "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ógildur strengur: verður að fylgja mynstri ${_issue.pattern}`;
        return `Rangt ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Röng tala: verður að vera margfeldi af ${issue.divisor}`;
      case "unrecognized_keys":
        return `Óþekkt ${issue.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Rangur lykill í ${issue.origin}`;
      case "invalid_union":
        return "Rangt gildi";
      case "invalid_element":
        return `Rangt gildi í ${issue.origin}`;
      default:
        return `Rangt gildi`;
    }
  };
};
function is_default() {
  return {
    localeError: error22()
  };
}
// node_modules/zod/v4/locales/it.js
var error23 = () => {
  const Sizable = {
    string: { unit: "caratteri", verb: "avere" },
    file: { unit: "byte", verb: "avere" },
    array: { unit: "elementi", verb: "avere" },
    set: { unit: "elementi", verb: "avere" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "indirizzo email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e ora ISO",
    date: "data ISO",
    time: "ora ISO",
    duration: "durata ISO",
    ipv4: "indirizzo IPv4",
    ipv6: "indirizzo IPv6",
    cidrv4: "intervallo IPv4",
    cidrv6: "intervallo IPv6",
    base64: "stringa codificata in base64",
    base64url: "URL codificata in base64",
    json_string: "stringa JSON",
    e164: "numero E.164",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "numero",
    array: "vettore"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Input non valido: atteso instanceof ${issue.expected}, ricevuto ${received}`;
        }
        return `Input non valido: atteso ${expected}, ricevuto ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Input non valido: atteso ${stringifyPrimitive(issue.values[0])}`;
        return `Opzione non valida: atteso uno tra ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Troppo grande: ${issue.origin ?? "valore"} deve avere ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementi"}`;
        return `Troppo grande: ${issue.origin ?? "valore"} deve essere ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Troppo piccolo: ${issue.origin} deve avere ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Troppo piccolo: ${issue.origin} deve essere ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Stringa non valida: deve includere "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
        return `Input non valido: ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Numero non valido: deve essere un multiplo di ${issue.divisor}`;
      case "unrecognized_keys":
        return `Chiav${issue.keys.length > 1 ? "i" : "e"} non riconosciut${issue.keys.length > 1 ? "e" : "a"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Chiave non valida in ${issue.origin}`;
      case "invalid_union":
        return "Input non valido";
      case "invalid_element":
        return `Valore non valido in ${issue.origin}`;
      default:
        return `Input non valido`;
    }
  };
};
function it_default() {
  return {
    localeError: error23()
  };
}
// node_modules/zod/v4/locales/ja.js
var error24 = () => {
  const Sizable = {
    string: { unit: "文字", verb: "である" },
    file: { unit: "バイト", verb: "である" },
    array: { unit: "要素", verb: "である" },
    set: { unit: "要素", verb: "である" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "入力値",
    email: "メールアドレス",
    url: "URL",
    emoji: "絵文字",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日時",
    date: "ISO日付",
    time: "ISO時刻",
    duration: "ISO期間",
    ipv4: "IPv4アドレス",
    ipv6: "IPv6アドレス",
    cidrv4: "IPv4範囲",
    cidrv6: "IPv6範囲",
    base64: "base64エンコード文字列",
    base64url: "base64urlエンコード文字列",
    json_string: "JSON文字列",
    e164: "E.164番号",
    jwt: "JWT",
    template_literal: "入力値"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "数値",
    array: "配列"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `無効な入力: instanceof ${issue.expected}が期待されましたが、${received}が入力されました`;
        }
        return `無効な入力: ${expected}が期待されましたが、${received}が入力されました`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `無効な入力: ${stringifyPrimitive(issue.values[0])}が期待されました`;
        return `無効な選択: ${joinValues(issue.values, "、")}のいずれかである必要があります`;
      case "too_big": {
        const adj = issue.inclusive ? "以下である" : "より小さい";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `大きすぎる値: ${issue.origin ?? "値"}は${issue.maximum.toString()}${sizing.unit ?? "要素"}${adj}必要があります`;
        return `大きすぎる値: ${issue.origin ?? "値"}は${issue.maximum.toString()}${adj}必要があります`;
      }
      case "too_small": {
        const adj = issue.inclusive ? "以上である" : "より大きい";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${sizing.unit}${adj}必要があります`;
        return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${adj}必要があります`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `無効な文字列: "${_issue.prefix}"で始まる必要があります`;
        if (_issue.format === "ends_with")
          return `無効な文字列: "${_issue.suffix}"で終わる必要があります`;
        if (_issue.format === "includes")
          return `無効な文字列: "${_issue.includes}"を含む必要があります`;
        if (_issue.format === "regex")
          return `無効な文字列: パターン${_issue.pattern}に一致する必要があります`;
        return `無効な${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `無効な数値: ${issue.divisor}の倍数である必要があります`;
      case "unrecognized_keys":
        return `認識されていないキー${issue.keys.length > 1 ? "群" : ""}: ${joinValues(issue.keys, "、")}`;
      case "invalid_key":
        return `${issue.origin}内の無効なキー`;
      case "invalid_union":
        return "無効な入力";
      case "invalid_element":
        return `${issue.origin}内の無効な値`;
      default:
        return `無効な入力`;
    }
  };
};
function ja_default() {
  return {
    localeError: error24()
  };
}
// node_modules/zod/v4/locales/ka.js
var error25 = () => {
  const Sizable = {
    string: { unit: "სიმბოლო", verb: "უნდა შეიცავდეს" },
    file: { unit: "ბაიტი", verb: "უნდა შეიცავდეს" },
    array: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" },
    set: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "შეყვანა",
    email: "ელ-ფოსტის მისამართი",
    url: "URL",
    emoji: "ემოჯი",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "თარიღი-დრო",
    date: "თარიღი",
    time: "დრო",
    duration: "ხანგრძლივობა",
    ipv4: "IPv4 მისამართი",
    ipv6: "IPv6 მისამართი",
    cidrv4: "IPv4 დიაპაზონი",
    cidrv6: "IPv6 დიაპაზონი",
    base64: "base64-კოდირებული ველი",
    base64url: "base64url-კოდირებული ველი",
    json_string: "JSON ველი",
    e164: "E.164 ნომერი",
    jwt: "JWT",
    template_literal: "შეყვანა"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "რიცხვი",
    string: "ველი",
    boolean: "ბულეანი",
    function: "ფუნქცია",
    array: "მასივი"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `არასწორი შეყვანა: მოსალოდნელი instanceof ${issue.expected}, მიღებული ${received}`;
        }
        return `არასწორი შეყვანა: მოსალოდნელი ${expected}, მიღებული ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `არასწორი შეყვანა: მოსალოდნელი ${stringifyPrimitive(issue.values[0])}`;
        return `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${joinValues(issue.values, "|")}-დან`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `ზედმეტად დიდი: მოსალოდნელი ${issue.origin ?? "მნიშვნელობა"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit}`;
        return `ზედმეტად დიდი: მოსალოდნელი ${issue.origin ?? "მნიშვნელობა"} იყოს ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `ზედმეტად პატარა: მოსალოდნელი ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `ზედმეტად პატარა: მოსალოდნელი ${issue.origin} იყოს ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `არასწორი ველი: უნდა იწყებოდეს "${_issue.prefix}"-ით`;
        }
        if (_issue.format === "ends_with")
          return `არასწორი ველი: უნდა მთავრდებოდეს "${_issue.suffix}"-ით`;
        if (_issue.format === "includes")
          return `არასწორი ველი: უნდა შეიცავდეს "${_issue.includes}"-ს`;
        if (_issue.format === "regex")
          return `არასწორი ველი: უნდა შეესაბამებოდეს შაბლონს ${_issue.pattern}`;
        return `არასწორი ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `არასწორი რიცხვი: უნდა იყოს ${issue.divisor}-ის ჯერადი`;
      case "unrecognized_keys":
        return `უცნობი გასაღებ${issue.keys.length > 1 ? "ები" : "ი"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `არასწორი გასაღები ${issue.origin}-ში`;
      case "invalid_union":
        return "არასწორი შეყვანა";
      case "invalid_element":
        return `არასწორი მნიშვნელობა ${issue.origin}-ში`;
      default:
        return `არასწორი შეყვანა`;
    }
  };
};
function ka_default() {
  return {
    localeError: error25()
  };
}
// node_modules/zod/v4/locales/km.js
var error26 = () => {
  const Sizable = {
    string: { unit: "តួអក្សរ", verb: "គួរមាន" },
    file: { unit: "បៃ", verb: "គួរមាន" },
    array: { unit: "ធាតុ", verb: "គួរមាន" },
    set: { unit: "ធាតុ", verb: "គួរមាន" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ទិន្នន័យបញ្ចូល",
    email: "អាសយដ្ឋានអ៊ីមែល",
    url: "URL",
    emoji: "សញ្ញាអារម្មណ៍",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
    date: "កាលបរិច្ឆេទ ISO",
    time: "ម៉ោង ISO",
    duration: "រយៈពេល ISO",
    ipv4: "អាសយដ្ឋាន IPv4",
    ipv6: "អាសយដ្ឋាន IPv6",
    cidrv4: "ដែនអាសយដ្ឋាន IPv4",
    cidrv6: "ដែនអាសយដ្ឋាន IPv6",
    base64: "ខ្សែអក្សរអ៊ិកូដ base64",
    base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
    json_string: "ខ្សែអក្សរ JSON",
    e164: "លេខ E.164",
    jwt: "JWT",
    template_literal: "ទិន្នន័យបញ្ចូល"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "លេខ",
    array: "អារេ (Array)",
    null: "គ្មានតម្លៃ (null)"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${issue.expected} ប៉ុន្តែទទួលបាន ${received}`;
        }
        return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${expected} ប៉ុន្តែទទួលបាន ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${stringifyPrimitive(issue.values[0])}`;
        return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `ធំពេក៖ ត្រូវការ ${issue.origin ?? "តម្លៃ"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "ធាតុ"}`;
        return `ធំពេក៖ ត្រូវការ ${issue.origin ?? "តម្លៃ"} ${adj} ${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `តូចពេក៖ ត្រូវការ ${issue.origin} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `តូចពេក៖ ត្រូវការ ${issue.origin} ${adj} ${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${_issue.pattern}`;
        return `មិនត្រឹមត្រូវ៖ ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${issue.divisor}`;
      case "unrecognized_keys":
        return `រកឃើញសោមិនស្គាល់៖ ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `សោមិនត្រឹមត្រូវនៅក្នុង ${issue.origin}`;
      case "invalid_union":
        return `ទិន្នន័យមិនត្រឹមត្រូវ`;
      case "invalid_element":
        return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${issue.origin}`;
      default:
        return `ទិន្នន័យមិនត្រឹមត្រូវ`;
    }
  };
};
function km_default() {
  return {
    localeError: error26()
  };
}

// node_modules/zod/v4/locales/kh.js
function kh_default() {
  return km_default();
}
// node_modules/zod/v4/locales/ko.js
var error27 = () => {
  const Sizable = {
    string: { unit: "문자", verb: "to have" },
    file: { unit: "바이트", verb: "to have" },
    array: { unit: "개", verb: "to have" },
    set: { unit: "개", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "입력",
    email: "이메일 주소",
    url: "URL",
    emoji: "이모지",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 날짜시간",
    date: "ISO 날짜",
    time: "ISO 시간",
    duration: "ISO 기간",
    ipv4: "IPv4 주소",
    ipv6: "IPv6 주소",
    cidrv4: "IPv4 범위",
    cidrv6: "IPv6 범위",
    base64: "base64 인코딩 문자열",
    base64url: "base64url 인코딩 문자열",
    json_string: "JSON 문자열",
    e164: "E.164 번호",
    jwt: "JWT",
    template_literal: "입력"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `잘못된 입력: 예상 타입은 instanceof ${issue.expected}, 받은 타입은 ${received}입니다`;
        }
        return `잘못된 입력: 예상 타입은 ${expected}, 받은 타입은 ${received}입니다`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `잘못된 입력: 값은 ${stringifyPrimitive(issue.values[0])} 이어야 합니다`;
        return `잘못된 옵션: ${joinValues(issue.values, "또는 ")} 중 하나여야 합니다`;
      case "too_big": {
        const adj = issue.inclusive ? "이하" : "미만";
        const suffix = adj === "미만" ? "이어야 합니다" : "여야 합니다";
        const sizing = getSizing(issue.origin);
        const unit = sizing?.unit ?? "요소";
        if (sizing)
          return `${issue.origin ?? "값"}이 너무 큽니다: ${issue.maximum.toString()}${unit} ${adj}${suffix}`;
        return `${issue.origin ?? "값"}이 너무 큽니다: ${issue.maximum.toString()} ${adj}${suffix}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? "이상" : "초과";
        const suffix = adj === "이상" ? "이어야 합니다" : "여야 합니다";
        const sizing = getSizing(issue.origin);
        const unit = sizing?.unit ?? "요소";
        if (sizing) {
          return `${issue.origin ?? "값"}이 너무 작습니다: ${issue.minimum.toString()}${unit} ${adj}${suffix}`;
        }
        return `${issue.origin ?? "값"}이 너무 작습니다: ${issue.minimum.toString()} ${adj}${suffix}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `잘못된 문자열: "${_issue.prefix}"(으)로 시작해야 합니다`;
        }
        if (_issue.format === "ends_with")
          return `잘못된 문자열: "${_issue.suffix}"(으)로 끝나야 합니다`;
        if (_issue.format === "includes")
          return `잘못된 문자열: "${_issue.includes}"을(를) 포함해야 합니다`;
        if (_issue.format === "regex")
          return `잘못된 문자열: 정규식 ${_issue.pattern} 패턴과 일치해야 합니다`;
        return `잘못된 ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `잘못된 숫자: ${issue.divisor}의 배수여야 합니다`;
      case "unrecognized_keys":
        return `인식할 수 없는 키: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `잘못된 키: ${issue.origin}`;
      case "invalid_union":
        return `잘못된 입력`;
      case "invalid_element":
        return `잘못된 값: ${issue.origin}`;
      default:
        return `잘못된 입력`;
    }
  };
};
function ko_default() {
  return {
    localeError: error27()
  };
}
// node_modules/zod/v4/locales/lt.js
var capitalizeFirstCharacter = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
function getUnitTypeFromNumber(number) {
  const abs = Math.abs(number);
  const last = abs % 10;
  const last2 = abs % 100;
  if (last2 >= 11 && last2 <= 19 || last === 0)
    return "many";
  if (last === 1)
    return "one";
  return "few";
}
var error28 = () => {
  const Sizable = {
    string: {
      unit: {
        one: "simbolis",
        few: "simboliai",
        many: "simbolių"
      },
      verb: {
        smaller: {
          inclusive: "turi būti ne ilgesnė kaip",
          notInclusive: "turi būti trumpesnė kaip"
        },
        bigger: {
          inclusive: "turi būti ne trumpesnė kaip",
          notInclusive: "turi būti ilgesnė kaip"
        }
      }
    },
    file: {
      unit: {
        one: "baitas",
        few: "baitai",
        many: "baitų"
      },
      verb: {
        smaller: {
          inclusive: "turi būti ne didesnis kaip",
          notInclusive: "turi būti mažesnis kaip"
        },
        bigger: {
          inclusive: "turi būti ne mažesnis kaip",
          notInclusive: "turi būti didesnis kaip"
        }
      }
    },
    array: {
      unit: {
        one: "elementą",
        few: "elementus",
        many: "elementų"
      },
      verb: {
        smaller: {
          inclusive: "turi turėti ne daugiau kaip",
          notInclusive: "turi turėti mažiau kaip"
        },
        bigger: {
          inclusive: "turi turėti ne mažiau kaip",
          notInclusive: "turi turėti daugiau kaip"
        }
      }
    },
    set: {
      unit: {
        one: "elementą",
        few: "elementus",
        many: "elementų"
      },
      verb: {
        smaller: {
          inclusive: "turi turėti ne daugiau kaip",
          notInclusive: "turi turėti mažiau kaip"
        },
        bigger: {
          inclusive: "turi turėti ne mažiau kaip",
          notInclusive: "turi turėti daugiau kaip"
        }
      }
    }
  };
  function getSizing(origin, unitType, inclusive, targetShouldBe) {
    const result = Sizable[origin] ?? null;
    if (result === null)
      return result;
    return {
      unit: result.unit[unitType],
      verb: result.verb[targetShouldBe][inclusive ? "inclusive" : "notInclusive"]
    };
  }
  const FormatDictionary = {
    regex: "įvestis",
    email: "el. pašto adresas",
    url: "URL",
    emoji: "jaustukas",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO data ir laikas",
    date: "ISO data",
    time: "ISO laikas",
    duration: "ISO trukmė",
    ipv4: "IPv4 adresas",
    ipv6: "IPv6 adresas",
    cidrv4: "IPv4 tinklo prefiksas (CIDR)",
    cidrv6: "IPv6 tinklo prefiksas (CIDR)",
    base64: "base64 užkoduota eilutė",
    base64url: "base64url užkoduota eilutė",
    json_string: "JSON eilutė",
    e164: "E.164 numeris",
    jwt: "JWT",
    template_literal: "įvestis"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "skaičius",
    bigint: "sveikasis skaičius",
    string: "eilutė",
    boolean: "loginė reikšmė",
    undefined: "neapibrėžta reikšmė",
    function: "funkcija",
    symbol: "simbolis",
    array: "masyvas",
    object: "objektas",
    null: "nulinė reikšmė"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Gautas tipas ${received}, o tikėtasi - instanceof ${issue.expected}`;
        }
        return `Gautas tipas ${received}, o tikėtasi - ${expected}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Privalo būti ${stringifyPrimitive(issue.values[0])}`;
        return `Privalo būti vienas iš ${joinValues(issue.values, "|")} pasirinkimų`;
      case "too_big": {
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.maximum)), issue.inclusive ?? false, "smaller");
        if (sizing?.verb)
          return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} ${sizing.verb} ${issue.maximum.toString()} ${sizing.unit ?? "elementų"}`;
        const adj = issue.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
        return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} turi būti ${adj} ${issue.maximum.toString()} ${sizing?.unit}`;
      }
      case "too_small": {
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.minimum)), issue.inclusive ?? false, "bigger");
        if (sizing?.verb)
          return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} ${sizing.verb} ${issue.minimum.toString()} ${sizing.unit ?? "elementų"}`;
        const adj = issue.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
        return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} turi būti ${adj} ${issue.minimum.toString()} ${sizing?.unit}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Eilutė privalo prasidėti "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Eilutė privalo pasibaigti "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Eilutė privalo įtraukti "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Eilutė privalo atitikti ${_issue.pattern}`;
        return `Neteisingas ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Skaičius privalo būti ${issue.divisor} kartotinis.`;
      case "unrecognized_keys":
        return `Neatpažint${issue.keys.length > 1 ? "i" : "as"} rakt${issue.keys.length > 1 ? "ai" : "as"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return "Rastas klaidingas raktas";
      case "invalid_union":
        return "Klaidinga įvestis";
      case "invalid_element": {
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} turi klaidingą įvestį`;
      }
      default:
        return "Klaidinga įvestis";
    }
  };
};
function lt_default() {
  return {
    localeError: error28()
  };
}
// node_modules/zod/v4/locales/mk.js
var error29 = () => {
  const Sizable = {
    string: { unit: "знаци", verb: "да имаат" },
    file: { unit: "бајти", verb: "да имаат" },
    array: { unit: "ставки", verb: "да имаат" },
    set: { unit: "ставки", verb: "да имаат" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "внес",
    email: "адреса на е-пошта",
    url: "URL",
    emoji: "емоџи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO датум и време",
    date: "ISO датум",
    time: "ISO време",
    duration: "ISO времетраење",
    ipv4: "IPv4 адреса",
    ipv6: "IPv6 адреса",
    cidrv4: "IPv4 опсег",
    cidrv6: "IPv6 опсег",
    base64: "base64-енкодирана низа",
    base64url: "base64url-енкодирана низа",
    json_string: "JSON низа",
    e164: "E.164 број",
    jwt: "JWT",
    template_literal: "внес"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "број",
    array: "низа"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Грешен внес: се очекува instanceof ${issue.expected}, примено ${received}`;
        }
        return `Грешен внес: се очекува ${expected}, примено ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
        return `Грешана опција: се очекува една ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Премногу голем: се очекува ${issue.origin ?? "вредноста"} да има ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елементи"}`;
        return `Премногу голем: се очекува ${issue.origin ?? "вредноста"} да биде ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Премногу мал: се очекува ${issue.origin} да има ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Премногу мал: се очекува ${issue.origin} да биде ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Неважечка низа: мора да започнува со "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Неважечка низа: мора да завршува со "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Неважечка низа: мора да вклучува "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Неважечка низа: мора да одгоара на патернот ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Грешен број: мора да биде делив со ${issue.divisor}`;
      case "unrecognized_keys":
        return `${issue.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Грешен клуч во ${issue.origin}`;
      case "invalid_union":
        return "Грешен внес";
      case "invalid_element":
        return `Грешна вредност во ${issue.origin}`;
      default:
        return `Грешен внес`;
    }
  };
};
function mk_default() {
  return {
    localeError: error29()
  };
}
// node_modules/zod/v4/locales/ms.js
var error30 = () => {
  const Sizable = {
    string: { unit: "aksara", verb: "mempunyai" },
    file: { unit: "bait", verb: "mempunyai" },
    array: { unit: "elemen", verb: "mempunyai" },
    set: { unit: "elemen", verb: "mempunyai" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "alamat e-mel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tarikh masa ISO",
    date: "tarikh ISO",
    time: "masa ISO",
    duration: "tempoh ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "julat IPv4",
    cidrv6: "julat IPv6",
    base64: "string dikodkan base64",
    base64url: "string dikodkan base64url",
    json_string: "string JSON",
    e164: "nombor E.164",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nombor"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Input tidak sah: dijangka instanceof ${issue.expected}, diterima ${received}`;
        }
        return `Input tidak sah: dijangka ${expected}, diterima ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Input tidak sah: dijangka ${stringifyPrimitive(issue.values[0])}`;
        return `Pilihan tidak sah: dijangka salah satu daripada ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
        return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} adalah ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Terlalu kecil: dijangka ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Terlalu kecil: dijangka ${issue.origin} adalah ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue.format} tidak sah`;
      }
      case "not_multiple_of":
        return `Nombor tidak sah: perlu gandaan ${issue.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak sah dalam ${issue.origin}`;
      case "invalid_union":
        return "Input tidak sah";
      case "invalid_element":
        return `Nilai tidak sah dalam ${issue.origin}`;
      default:
        return `Input tidak sah`;
    }
  };
};
function ms_default() {
  return {
    localeError: error30()
  };
}
// node_modules/zod/v4/locales/nl.js
var error31 = () => {
  const Sizable = {
    string: { unit: "tekens", verb: "heeft" },
    file: { unit: "bytes", verb: "heeft" },
    array: { unit: "elementen", verb: "heeft" },
    set: { unit: "elementen", verb: "heeft" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "invoer",
    email: "emailadres",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum en tijd",
    date: "ISO datum",
    time: "ISO tijd",
    duration: "ISO duur",
    ipv4: "IPv4-adres",
    ipv6: "IPv6-adres",
    cidrv4: "IPv4-bereik",
    cidrv6: "IPv6-bereik",
    base64: "base64-gecodeerde tekst",
    base64url: "base64 URL-gecodeerde tekst",
    json_string: "JSON string",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "invoer"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "getal"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Ongeldige invoer: verwacht instanceof ${issue.expected}, ontving ${received}`;
        }
        return `Ongeldige invoer: verwacht ${expected}, ontving ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Ongeldige invoer: verwacht ${stringifyPrimitive(issue.values[0])}`;
        return `Ongeldige optie: verwacht één van ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        const longName = issue.origin === "date" ? "laat" : issue.origin === "string" ? "lang" : "groot";
        if (sizing)
          return `Te ${longName}: verwacht dat ${issue.origin ?? "waarde"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementen"} ${sizing.verb}`;
        return `Te ${longName}: verwacht dat ${issue.origin ?? "waarde"} ${adj}${issue.maximum.toString()} is`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        const shortName = issue.origin === "date" ? "vroeg" : issue.origin === "string" ? "kort" : "klein";
        if (sizing) {
          return `Te ${shortName}: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
        }
        return `Te ${shortName}: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} is`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Ongeldige tekst: moet met "${_issue.prefix}" beginnen`;
        }
        if (_issue.format === "ends_with")
          return `Ongeldige tekst: moet op "${_issue.suffix}" eindigen`;
        if (_issue.format === "includes")
          return `Ongeldige tekst: moet "${_issue.includes}" bevatten`;
        if (_issue.format === "regex")
          return `Ongeldige tekst: moet overeenkomen met patroon ${_issue.pattern}`;
        return `Ongeldig: ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Ongeldig getal: moet een veelvoud van ${issue.divisor} zijn`;
      case "unrecognized_keys":
        return `Onbekende key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Ongeldige key in ${issue.origin}`;
      case "invalid_union":
        return "Ongeldige invoer";
      case "invalid_element":
        return `Ongeldige waarde in ${issue.origin}`;
      default:
        return `Ongeldige invoer`;
    }
  };
};
function nl_default() {
  return {
    localeError: error31()
  };
}
// node_modules/zod/v4/locales/no.js
var error32 = () => {
  const Sizable = {
    string: { unit: "tegn", verb: "å ha" },
    file: { unit: "bytes", verb: "å ha" },
    array: { unit: "elementer", verb: "å inneholde" },
    set: { unit: "elementer", verb: "å inneholde" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "e-postadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslett",
    date: "ISO-dato",
    time: "ISO-klokkeslett",
    duration: "ISO-varighet",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spekter",
    cidrv6: "IPv6-spekter",
    base64: "base64-enkodet streng",
    base64url: "base64url-enkodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "tall",
    array: "liste"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Ugyldig input: forventet instanceof ${issue.expected}, fikk ${received}`;
        }
        return `Ugyldig input: forventet ${expected}, fikk ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Ugyldig verdi: forventet ${stringifyPrimitive(issue.values[0])}`;
        return `Ugyldig valg: forventet en av ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `For stor(t): forventet ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementer"}`;
        return `For stor(t): forventet ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Ugyldig streng: må starte med "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Ugyldig streng: må ende med "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ugyldig streng: må inneholde "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ugyldig streng: må matche mønsteret ${_issue.pattern}`;
        return `Ugyldig ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Ugyldig tall: må være et multiplum av ${issue.divisor}`;
      case "unrecognized_keys":
        return `${issue.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøkkel i ${issue.origin}`;
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return `Ugyldig verdi i ${issue.origin}`;
      default:
        return `Ugyldig input`;
    }
  };
};
function no_default() {
  return {
    localeError: error32()
  };
}
// node_modules/zod/v4/locales/ota.js
var error33 = () => {
  const Sizable = {
    string: { unit: "harf", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "unsur", verb: "olmalıdır" },
    set: { unit: "unsur", verb: "olmalıdır" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "giren",
    email: "epostagâh",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO hengâmı",
    date: "ISO tarihi",
    time: "ISO zamanı",
    duration: "ISO müddeti",
    ipv4: "IPv4 nişânı",
    ipv6: "IPv6 nişânı",
    cidrv4: "IPv4 menzili",
    cidrv6: "IPv6 menzili",
    base64: "base64-şifreli metin",
    base64url: "base64url-şifreli metin",
    json_string: "JSON metin",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "giren"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "numara",
    array: "saf",
    null: "gayb"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Fâsit giren: umulan instanceof ${issue.expected}, alınan ${received}`;
        }
        return `Fâsit giren: umulan ${expected}, alınan ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Fâsit giren: umulan ${stringifyPrimitive(issue.values[0])}`;
        return `Fâsit tercih: mûteberler ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Fazla büyük: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"} sahip olmalıydı.`;
        return `Fazla büyük: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} olmalıydı.`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} ${sizing.unit} sahip olmalıydı.`;
        }
        return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} olmalıydı.`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Fâsit metin: "${_issue.prefix}" ile başlamalı.`;
        if (_issue.format === "ends_with")
          return `Fâsit metin: "${_issue.suffix}" ile bitmeli.`;
        if (_issue.format === "includes")
          return `Fâsit metin: "${_issue.includes}" ihtivâ etmeli.`;
        if (_issue.format === "regex")
          return `Fâsit metin: ${_issue.pattern} nakşına uymalı.`;
        return `Fâsit ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Fâsit sayı: ${issue.divisor} katı olmalıydı.`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar ${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `${issue.origin} için tanınmayan anahtar var.`;
      case "invalid_union":
        return "Giren tanınamadı.";
      case "invalid_element":
        return `${issue.origin} için tanınmayan kıymet var.`;
      default:
        return `Kıymet tanınamadı.`;
    }
  };
};
function ota_default() {
  return {
    localeError: error33()
  };
}
// node_modules/zod/v4/locales/ps.js
var error34 = () => {
  const Sizable = {
    string: { unit: "توکي", verb: "ولري" },
    file: { unit: "بایټس", verb: "ولري" },
    array: { unit: "توکي", verb: "ولري" },
    set: { unit: "توکي", verb: "ولري" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ورودي",
    email: "بریښنالیک",
    url: "یو آر ال",
    emoji: "ایموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "نیټه او وخت",
    date: "نېټه",
    time: "وخت",
    duration: "موده",
    ipv4: "د IPv4 پته",
    ipv6: "د IPv6 پته",
    cidrv4: "د IPv4 ساحه",
    cidrv6: "د IPv6 ساحه",
    base64: "base64-encoded متن",
    base64url: "base64url-encoded متن",
    json_string: "JSON متن",
    e164: "د E.164 شمېره",
    jwt: "JWT",
    template_literal: "ورودي"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "عدد",
    array: "ارې"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `ناسم ورودي: باید instanceof ${issue.expected} وای, مګر ${received} ترلاسه شو`;
        }
        return `ناسم ورودي: باید ${expected} وای, مګر ${received} ترلاسه شو`;
      }
      case "invalid_value":
        if (issue.values.length === 1) {
          return `ناسم ورودي: باید ${stringifyPrimitive(issue.values[0])} وای`;
        }
        return `ناسم انتخاب: باید یو له ${joinValues(issue.values, "|")} څخه وای`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `ډیر لوی: ${issue.origin ?? "ارزښت"} باید ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عنصرونه"} ولري`;
        }
        return `ډیر لوی: ${issue.origin ?? "ارزښت"} باید ${adj}${issue.maximum.toString()} وي`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `ډیر کوچنی: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} ولري`;
        }
        return `ډیر کوچنی: ${issue.origin} باید ${adj}${issue.minimum.toString()} وي`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `ناسم متن: باید د "${_issue.prefix}" سره پیل شي`;
        }
        if (_issue.format === "ends_with") {
          return `ناسم متن: باید د "${_issue.suffix}" سره پای ته ورسيږي`;
        }
        if (_issue.format === "includes") {
          return `ناسم متن: باید "${_issue.includes}" ولري`;
        }
        if (_issue.format === "regex") {
          return `ناسم متن: باید د ${_issue.pattern} سره مطابقت ولري`;
        }
        return `${FormatDictionary[_issue.format] ?? issue.format} ناسم دی`;
      }
      case "not_multiple_of":
        return `ناسم عدد: باید د ${issue.divisor} مضرب وي`;
      case "unrecognized_keys":
        return `ناسم ${issue.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `ناسم کلیډ په ${issue.origin} کې`;
      case "invalid_union":
        return `ناسمه ورودي`;
      case "invalid_element":
        return `ناسم عنصر په ${issue.origin} کې`;
      default:
        return `ناسمه ورودي`;
    }
  };
};
function ps_default() {
  return {
    localeError: error34()
  };
}
// node_modules/zod/v4/locales/pl.js
var error35 = () => {
  const Sizable = {
    string: { unit: "znaków", verb: "mieć" },
    file: { unit: "bajtów", verb: "mieć" },
    array: { unit: "elementów", verb: "mieć" },
    set: { unit: "elementów", verb: "mieć" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "wyrażenie",
    email: "adres email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i godzina w formacie ISO",
    date: "data w formacie ISO",
    time: "godzina w formacie ISO",
    duration: "czas trwania ISO",
    ipv4: "adres IPv4",
    ipv6: "adres IPv6",
    cidrv4: "zakres IPv4",
    cidrv6: "zakres IPv6",
    base64: "ciąg znaków zakodowany w formacie base64",
    base64url: "ciąg znaków zakodowany w formacie base64url",
    json_string: "ciąg znaków w formacie JSON",
    e164: "liczba E.164",
    jwt: "JWT",
    template_literal: "wejście"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "liczba",
    array: "tablica"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${issue.expected}, otrzymano ${received}`;
        }
        return `Nieprawidłowe dane wejściowe: oczekiwano ${expected}, otrzymano ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Nieprawidłowe dane wejściowe: oczekiwano ${stringifyPrimitive(issue.values[0])}`;
        return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Za duża wartość: oczekiwano, że ${issue.origin ?? "wartość"} będzie mieć ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementów"}`;
        }
        return `Zbyt duż(y/a/e): oczekiwano, że ${issue.origin ?? "wartość"} będzie wynosić ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Za mała wartość: oczekiwano, że ${issue.origin ?? "wartość"} będzie mieć ${adj}${issue.minimum.toString()} ${sizing.unit ?? "elementów"}`;
        }
        return `Zbyt mał(y/a/e): oczekiwano, że ${issue.origin ?? "wartość"} będzie wynosić ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Nieprawidłowy ciąg znaków: musi kończyć się na "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Nieprawidłowy ciąg znaków: musi zawierać "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${_issue.pattern}`;
        return `Nieprawidłow(y/a/e) ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Nieprawidłowa liczba: musi być wielokrotnością ${issue.divisor}`;
      case "unrecognized_keys":
        return `Nierozpoznane klucze${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Nieprawidłowy klucz w ${issue.origin}`;
      case "invalid_union":
        return "Nieprawidłowe dane wejściowe";
      case "invalid_element":
        return `Nieprawidłowa wartość w ${issue.origin}`;
      default:
        return `Nieprawidłowe dane wejściowe`;
    }
  };
};
function pl_default() {
  return {
    localeError: error35()
  };
}
// node_modules/zod/v4/locales/pt.js
var error36 = () => {
  const Sizable = {
    string: { unit: "caracteres", verb: "ter" },
    file: { unit: "bytes", verb: "ter" },
    array: { unit: "itens", verb: "ter" },
    set: { unit: "itens", verb: "ter" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "padrão",
    email: "endereço de e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "duração ISO",
    ipv4: "endereço IPv4",
    ipv6: "endereço IPv6",
    cidrv4: "faixa de IPv4",
    cidrv6: "faixa de IPv6",
    base64: "texto codificado em base64",
    base64url: "URL codificada em base64",
    json_string: "texto JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "número",
    null: "nulo"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Tipo inválido: esperado instanceof ${issue.expected}, recebido ${received}`;
        }
        return `Tipo inválido: esperado ${expected}, recebido ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Entrada inválida: esperado ${stringifyPrimitive(issue.values[0])}`;
        return `Opção inválida: esperada uma das ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Muito grande: esperado que ${issue.origin ?? "valor"} tivesse ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
        return `Muito grande: esperado que ${issue.origin ?? "valor"} fosse ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Muito pequeno: esperado que ${issue.origin} tivesse ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Muito pequeno: esperado que ${issue.origin} fosse ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Texto inválido: deve começar com "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Texto inválido: deve terminar com "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Texto inválido: deve incluir "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Texto inválido: deve corresponder ao padrão ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue.format} inválido`;
      }
      case "not_multiple_of":
        return `Número inválido: deve ser múltiplo de ${issue.divisor}`;
      case "unrecognized_keys":
        return `Chave${issue.keys.length > 1 ? "s" : ""} desconhecida${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Chave inválida em ${issue.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido em ${issue.origin}`;
      default:
        return `Campo inválido`;
    }
  };
};
function pt_default() {
  return {
    localeError: error36()
  };
}
// node_modules/zod/v4/locales/ro.js
var error37 = () => {
  const Sizable = {
    string: { unit: "caractere", verb: "să aibă" },
    file: { unit: "octeți", verb: "să aibă" },
    array: { unit: "elemente", verb: "să aibă" },
    set: { unit: "elemente", verb: "să aibă" },
    map: { unit: "intrări", verb: "să aibă" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "intrare",
    email: "adresă de email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "dată și oră ISO",
    date: "dată ISO",
    time: "oră ISO",
    duration: "durată ISO",
    ipv4: "adresă IPv4",
    ipv6: "adresă IPv6",
    mac: "adresă MAC",
    cidrv4: "interval IPv4",
    cidrv6: "interval IPv6",
    base64: "șir codat base64",
    base64url: "șir codat base64url",
    json_string: "șir JSON",
    e164: "număr E.164",
    jwt: "JWT",
    template_literal: "intrare"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "șir",
    number: "număr",
    boolean: "boolean",
    function: "funcție",
    array: "matrice",
    object: "obiect",
    undefined: "nedefinit",
    symbol: "simbol",
    bigint: "număr mare",
    void: "void",
    never: "never",
    map: "hartă",
    set: "set"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        return `Intrare invalidă: așteptat ${expected}, primit ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Intrare invalidă: așteptat ${stringifyPrimitive(issue.values[0])}`;
        return `Opțiune invalidă: așteptat una dintre ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Prea mare: așteptat ca ${issue.origin ?? "valoarea"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemente"}`;
        return `Prea mare: așteptat ca ${issue.origin ?? "valoarea"} să fie ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Prea mic: așteptat ca ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Prea mic: așteptat ca ${issue.origin} să fie ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Șir invalid: trebuie să înceapă cu "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Șir invalid: trebuie să se termine cu "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Șir invalid: trebuie să includă "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Șir invalid: trebuie să se potrivească cu modelul ${_issue.pattern}`;
        return `Format invalid: ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Număr invalid: trebuie să fie multiplu de ${issue.divisor}`;
      case "unrecognized_keys":
        return `Chei nerecunoscute: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Cheie invalidă în ${issue.origin}`;
      case "invalid_union":
        return "Intrare invalidă";
      case "invalid_element":
        return `Valoare invalidă în ${issue.origin}`;
      default:
        return `Intrare invalidă`;
    }
  };
};
function ro_default() {
  return {
    localeError: error37()
  };
}
// node_modules/zod/v4/locales/ru.js
function getRussianPlural(count, one, few, many) {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return many;
  }
  if (lastDigit === 1) {
    return one;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }
  return many;
}
var error38 = () => {
  const Sizable = {
    string: {
      unit: {
        one: "символ",
        few: "символа",
        many: "символов"
      },
      verb: "иметь"
    },
    file: {
      unit: {
        one: "байт",
        few: "байта",
        many: "байт"
      },
      verb: "иметь"
    },
    array: {
      unit: {
        one: "элемент",
        few: "элемента",
        many: "элементов"
      },
      verb: "иметь"
    },
    set: {
      unit: {
        one: "элемент",
        few: "элемента",
        many: "элементов"
      },
      verb: "иметь"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ввод",
    email: "email адрес",
    url: "URL",
    emoji: "эмодзи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата и время",
    date: "ISO дата",
    time: "ISO время",
    duration: "ISO длительность",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "строка в формате base64",
    base64url: "строка в формате base64url",
    json_string: "JSON строка",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "ввод"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "число",
    array: "массив"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Неверный ввод: ожидалось instanceof ${issue.expected}, получено ${received}`;
        }
        return `Неверный ввод: ожидалось ${expected}, получено ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Неверный ввод: ожидалось ${stringifyPrimitive(issue.values[0])}`;
        return `Неверный вариант: ожидалось одно из ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          const maxValue = Number(issue.maximum);
          const unit = getRussianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Слишком большое значение: ожидалось, что ${issue.origin ?? "значение"} будет иметь ${adj}${issue.maximum.toString()} ${unit}`;
        }
        return `Слишком большое значение: ожидалось, что ${issue.origin ?? "значение"} будет ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          const minValue = Number(issue.minimum);
          const unit = getRussianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет иметь ${adj}${issue.minimum.toString()} ${unit}`;
        }
        return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Неверная строка: должна начинаться с "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Неверная строка: должна заканчиваться на "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Неверная строка: должна содержать "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Неверная строка: должна соответствовать шаблону ${_issue.pattern}`;
        return `Неверный ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Неверное число: должно быть кратным ${issue.divisor}`;
      case "unrecognized_keys":
        return `Нераспознанн${issue.keys.length > 1 ? "ые" : "ый"} ключ${issue.keys.length > 1 ? "и" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Неверный ключ в ${issue.origin}`;
      case "invalid_union":
        return "Неверные входные данные";
      case "invalid_element":
        return `Неверное значение в ${issue.origin}`;
      default:
        return `Неверные входные данные`;
    }
  };
};
function ru_default() {
  return {
    localeError: error38()
  };
}
// node_modules/zod/v4/locales/sl.js
var error39 = () => {
  const Sizable = {
    string: { unit: "znakov", verb: "imeti" },
    file: { unit: "bajtov", verb: "imeti" },
    array: { unit: "elementov", verb: "imeti" },
    set: { unit: "elementov", verb: "imeti" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "vnos",
    email: "e-poštni naslov",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum in čas",
    date: "ISO datum",
    time: "ISO čas",
    duration: "ISO trajanje",
    ipv4: "IPv4 naslov",
    ipv6: "IPv6 naslov",
    cidrv4: "obseg IPv4",
    cidrv6: "obseg IPv6",
    base64: "base64 kodiran niz",
    base64url: "base64url kodiran niz",
    json_string: "JSON niz",
    e164: "E.164 številka",
    jwt: "JWT",
    template_literal: "vnos"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "število",
    array: "tabela"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Neveljaven vnos: pričakovano instanceof ${issue.expected}, prejeto ${received}`;
        }
        return `Neveljaven vnos: pričakovano ${expected}, prejeto ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Neveljaven vnos: pričakovano ${stringifyPrimitive(issue.values[0])}`;
        return `Neveljavna možnost: pričakovano eno izmed ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Preveliko: pričakovano, da bo ${issue.origin ?? "vrednost"} imelo ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementov"}`;
        return `Preveliko: pričakovano, da bo ${issue.origin ?? "vrednost"} ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Premajhno: pričakovano, da bo ${issue.origin} imelo ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Premajhno: pričakovano, da bo ${issue.origin} ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Neveljaven niz: mora se začeti z "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Neveljaven niz: mora se končati z "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
        return `Neveljaven ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Neveljavno število: mora biti večkratnik ${issue.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznan${issue.keys.length > 1 ? "i ključi" : " ključ"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Neveljaven ključ v ${issue.origin}`;
      case "invalid_union":
        return "Neveljaven vnos";
      case "invalid_element":
        return `Neveljavna vrednost v ${issue.origin}`;
      default:
        return "Neveljaven vnos";
    }
  };
};
function sl_default() {
  return {
    localeError: error39()
  };
}
// node_modules/zod/v4/locales/sv.js
var error40 = () => {
  const Sizable = {
    string: { unit: "tecken", verb: "att ha" },
    file: { unit: "bytes", verb: "att ha" },
    array: { unit: "objekt", verb: "att innehålla" },
    set: { unit: "objekt", verb: "att innehålla" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "reguljärt uttryck",
    email: "e-postadress",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datum och tid",
    date: "ISO-datum",
    time: "ISO-tid",
    duration: "ISO-varaktighet",
    ipv4: "IPv4-intervall",
    ipv6: "IPv6-intervall",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodad sträng",
    base64url: "base64url-kodad sträng",
    json_string: "JSON-sträng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "mall-literal"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "antal",
    array: "lista"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Ogiltig inmatning: förväntat instanceof ${issue.expected}, fick ${received}`;
        }
        return `Ogiltig inmatning: förväntat ${expected}, fick ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Ogiltig inmatning: förväntat ${stringifyPrimitive(issue.values[0])}`;
        return `Ogiltigt val: förväntade en av ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `För stor(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
        }
        return `För stor(t): förväntat ${issue.origin ?? "värdet"} att ha ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `För lite(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `För lite(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Ogiltig sträng: måste börja med "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Ogiltig sträng: måste sluta med "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ogiltig sträng: måste innehålla "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ogiltig sträng: måste matcha mönstret "${_issue.pattern}"`;
        return `Ogiltig(t) ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Ogiltigt tal: måste vara en multipel av ${issue.divisor}`;
      case "unrecognized_keys":
        return `${issue.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Ogiltig nyckel i ${issue.origin ?? "värdet"}`;
      case "invalid_union":
        return "Ogiltig input";
      case "invalid_element":
        return `Ogiltigt värde i ${issue.origin ?? "värdet"}`;
      default:
        return `Ogiltig input`;
    }
  };
};
function sv_default() {
  return {
    localeError: error40()
  };
}
// node_modules/zod/v4/locales/ta.js
var error41 = () => {
  const Sizable = {
    string: { unit: "எழுத்துக்கள்", verb: "கொண்டிருக்க வேண்டும்" },
    file: { unit: "பைட்டுகள்", verb: "கொண்டிருக்க வேண்டும்" },
    array: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
    set: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "உள்ளீடு",
    email: "மின்னஞ்சல் முகவரி",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO தேதி நேரம்",
    date: "ISO தேதி",
    time: "ISO நேரம்",
    duration: "ISO கால அளவு",
    ipv4: "IPv4 முகவரி",
    ipv6: "IPv6 முகவரி",
    cidrv4: "IPv4 வரம்பு",
    cidrv6: "IPv6 வரம்பு",
    base64: "base64-encoded சரம்",
    base64url: "base64url-encoded சரம்",
    json_string: "JSON சரம்",
    e164: "E.164 எண்",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "எண்",
    array: "அணி",
    null: "வெறுமை"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${issue.expected}, பெறப்பட்டது ${received}`;
        }
        return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${expected}, பெறப்பட்டது ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${stringifyPrimitive(issue.values[0])}`;
        return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${joinValues(issue.values, "|")} இல் ஒன்று`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue.origin ?? "மதிப்பு"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
        }
        return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue.origin ?? "மதிப்பு"} ${adj}${issue.maximum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ஆக இருக்க வேண்டும்`;
        }
        return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `தவறான சரம்: "${_issue.prefix}" இல் தொடங்க வேண்டும்`;
        if (_issue.format === "ends_with")
          return `தவறான சரம்: "${_issue.suffix}" இல் முடிவடைய வேண்டும்`;
        if (_issue.format === "includes")
          return `தவறான சரம்: "${_issue.includes}" ஐ உள்ளடக்க வேண்டும்`;
        if (_issue.format === "regex")
          return `தவறான சரம்: ${_issue.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
        return `தவறான ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `தவறான எண்: ${issue.divisor} இன் பலமாக இருக்க வேண்டும்`;
      case "unrecognized_keys":
        return `அடையாளம் தெரியாத விசை${issue.keys.length > 1 ? "கள்" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `${issue.origin} இல் தவறான விசை`;
      case "invalid_union":
        return "தவறான உள்ளீடு";
      case "invalid_element":
        return `${issue.origin} இல் தவறான மதிப்பு`;
      default:
        return `தவறான உள்ளீடு`;
    }
  };
};
function ta_default() {
  return {
    localeError: error41()
  };
}
// node_modules/zod/v4/locales/th.js
var error42 = () => {
  const Sizable = {
    string: { unit: "ตัวอักษร", verb: "ควรมี" },
    file: { unit: "ไบต์", verb: "ควรมี" },
    array: { unit: "รายการ", verb: "ควรมี" },
    set: { unit: "รายการ", verb: "ควรมี" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ข้อมูลที่ป้อน",
    email: "ที่อยู่อีเมล",
    url: "URL",
    emoji: "อิโมจิ",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "วันที่เวลาแบบ ISO",
    date: "วันที่แบบ ISO",
    time: "เวลาแบบ ISO",
    duration: "ช่วงเวลาแบบ ISO",
    ipv4: "ที่อยู่ IPv4",
    ipv6: "ที่อยู่ IPv6",
    cidrv4: "ช่วง IP แบบ IPv4",
    cidrv6: "ช่วง IP แบบ IPv6",
    base64: "ข้อความแบบ Base64",
    base64url: "ข้อความแบบ Base64 สำหรับ URL",
    json_string: "ข้อความแบบ JSON",
    e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
    jwt: "โทเคน JWT",
    template_literal: "ข้อมูลที่ป้อน"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "ตัวเลข",
    array: "อาร์เรย์ (Array)",
    null: "ไม่มีค่า (null)"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${issue.expected} แต่ได้รับ ${received}`;
        }
        return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${expected} แต่ได้รับ ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `ค่าไม่ถูกต้อง: ควรเป็น ${stringifyPrimitive(issue.values[0])}`;
        return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "ไม่เกิน" : "น้อยกว่า";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `เกินกำหนด: ${issue.origin ?? "ค่า"} ควรมี${adj} ${issue.maximum.toString()} ${sizing.unit ?? "รายการ"}`;
        return `เกินกำหนด: ${issue.origin ?? "ค่า"} ควรมี${adj} ${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? "อย่างน้อย" : "มากกว่า";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${_issue.includes}" อยู่ในข้อความ`;
        if (_issue.format === "regex")
          return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${_issue.pattern}`;
        return `รูปแบบไม่ถูกต้อง: ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${issue.divisor} ได้ลงตัว`;
      case "unrecognized_keys":
        return `พบคีย์ที่ไม่รู้จัก: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `คีย์ไม่ถูกต้องใน ${issue.origin}`;
      case "invalid_union":
        return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
      case "invalid_element":
        return `ข้อมูลไม่ถูกต้องใน ${issue.origin}`;
      default:
        return `ข้อมูลไม่ถูกต้อง`;
    }
  };
};
function th_default() {
  return {
    localeError: error42()
  };
}
// node_modules/zod/v4/locales/tr.js
var error43 = () => {
  const Sizable = {
    string: { unit: "karakter", verb: "olmalı" },
    file: { unit: "bayt", verb: "olmalı" },
    array: { unit: "öğe", verb: "olmalı" },
    set: { unit: "öğe", verb: "olmalı" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "girdi",
    email: "e-posta adresi",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO tarih ve saat",
    date: "ISO tarih",
    time: "ISO saat",
    duration: "ISO süre",
    ipv4: "IPv4 adresi",
    ipv6: "IPv6 adresi",
    cidrv4: "IPv4 aralığı",
    cidrv6: "IPv6 aralığı",
    base64: "base64 ile şifrelenmiş metin",
    base64url: "base64url ile şifrelenmiş metin",
    json_string: "JSON dizesi",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "Şablon dizesi"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Geçersiz değer: beklenen instanceof ${issue.expected}, alınan ${received}`;
        }
        return `Geçersiz değer: beklenen ${expected}, alınan ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Geçersiz değer: beklenen ${stringifyPrimitive(issue.values[0])}`;
        return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Çok büyük: beklenen ${issue.origin ?? "değer"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "öğe"}`;
        return `Çok büyük: beklenen ${issue.origin ?? "değer"} ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Geçersiz metin: "${_issue.prefix}" ile başlamalı`;
        if (_issue.format === "ends_with")
          return `Geçersiz metin: "${_issue.suffix}" ile bitmeli`;
        if (_issue.format === "includes")
          return `Geçersiz metin: "${_issue.includes}" içermeli`;
        if (_issue.format === "regex")
          return `Geçersiz metin: ${_issue.pattern} desenine uymalı`;
        return `Geçersiz ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Geçersiz sayı: ${issue.divisor} ile tam bölünebilmeli`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `${issue.origin} içinde geçersiz anahtar`;
      case "invalid_union":
        return "Geçersiz değer";
      case "invalid_element":
        return `${issue.origin} içinde geçersiz değer`;
      default:
        return `Geçersiz değer`;
    }
  };
};
function tr_default() {
  return {
    localeError: error43()
  };
}
// node_modules/zod/v4/locales/uk.js
var error44 = () => {
  const Sizable = {
    string: { unit: "символів", verb: "матиме" },
    file: { unit: "байтів", verb: "матиме" },
    array: { unit: "елементів", verb: "матиме" },
    set: { unit: "елементів", verb: "матиме" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "вхідні дані",
    email: "адреса електронної пошти",
    url: "URL",
    emoji: "емодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "дата та час ISO",
    date: "дата ISO",
    time: "час ISO",
    duration: "тривалість ISO",
    ipv4: "адреса IPv4",
    ipv6: "адреса IPv6",
    cidrv4: "діапазон IPv4",
    cidrv6: "діапазон IPv6",
    base64: "рядок у кодуванні base64",
    base64url: "рядок у кодуванні base64url",
    json_string: "рядок JSON",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "вхідні дані"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "число",
    array: "масив"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Неправильні вхідні дані: очікується instanceof ${issue.expected}, отримано ${received}`;
        }
        return `Неправильні вхідні дані: очікується ${expected}, отримано ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Неправильні вхідні дані: очікується ${stringifyPrimitive(issue.values[0])}`;
        return `Неправильна опція: очікується одне з ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Занадто велике: очікується, що ${issue.origin ?? "значення"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елементів"}`;
        return `Занадто велике: очікується, що ${issue.origin ?? "значення"} буде ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Занадто мале: очікується, що ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Занадто мале: очікується, що ${issue.origin} буде ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Неправильний рядок: повинен починатися з "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Неправильний рядок: повинен закінчуватися на "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Неправильний рядок: повинен містити "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Неправильний рядок: повинен відповідати шаблону ${_issue.pattern}`;
        return `Неправильний ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Неправильне число: повинно бути кратним ${issue.divisor}`;
      case "unrecognized_keys":
        return `Нерозпізнаний ключ${issue.keys.length > 1 ? "і" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Неправильний ключ у ${issue.origin}`;
      case "invalid_union":
        return "Неправильні вхідні дані";
      case "invalid_element":
        return `Неправильне значення у ${issue.origin}`;
      default:
        return `Неправильні вхідні дані`;
    }
  };
};
function uk_default() {
  return {
    localeError: error44()
  };
}

// node_modules/zod/v4/locales/ua.js
function ua_default() {
  return uk_default();
}
// node_modules/zod/v4/locales/ur.js
var error45 = () => {
  const Sizable = {
    string: { unit: "حروف", verb: "ہونا" },
    file: { unit: "بائٹس", verb: "ہونا" },
    array: { unit: "آئٹمز", verb: "ہونا" },
    set: { unit: "آئٹمز", verb: "ہونا" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ان پٹ",
    email: "ای میل ایڈریس",
    url: "یو آر ایل",
    emoji: "ایموجی",
    uuid: "یو یو آئی ڈی",
    uuidv4: "یو یو آئی ڈی وی 4",
    uuidv6: "یو یو آئی ڈی وی 6",
    nanoid: "نینو آئی ڈی",
    guid: "جی یو آئی ڈی",
    cuid: "سی یو آئی ڈی",
    cuid2: "سی یو آئی ڈی 2",
    ulid: "یو ایل آئی ڈی",
    xid: "ایکس آئی ڈی",
    ksuid: "کے ایس یو آئی ڈی",
    datetime: "آئی ایس او ڈیٹ ٹائم",
    date: "آئی ایس او تاریخ",
    time: "آئی ایس او وقت",
    duration: "آئی ایس او مدت",
    ipv4: "آئی پی وی 4 ایڈریس",
    ipv6: "آئی پی وی 6 ایڈریس",
    cidrv4: "آئی پی وی 4 رینج",
    cidrv6: "آئی پی وی 6 رینج",
    base64: "بیس 64 ان کوڈڈ سٹرنگ",
    base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
    json_string: "جے ایس او این سٹرنگ",
    e164: "ای 164 نمبر",
    jwt: "جے ڈبلیو ٹی",
    template_literal: "ان پٹ"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "نمبر",
    array: "آرے",
    null: "نل"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `غلط ان پٹ: instanceof ${issue.expected} متوقع تھا، ${received} موصول ہوا`;
        }
        return `غلط ان پٹ: ${expected} متوقع تھا، ${received} موصول ہوا`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `غلط ان پٹ: ${stringifyPrimitive(issue.values[0])} متوقع تھا`;
        return `غلط آپشن: ${joinValues(issue.values, "|")} میں سے ایک متوقع تھا`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `بہت بڑا: ${issue.origin ?? "ویلیو"} کے ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عناصر"} ہونے متوقع تھے`;
        return `بہت بڑا: ${issue.origin ?? "ویلیو"} کا ${adj}${issue.maximum.toString()} ہونا متوقع تھا`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `بہت چھوٹا: ${issue.origin} کے ${adj}${issue.minimum.toString()} ${sizing.unit} ہونے متوقع تھے`;
        }
        return `بہت چھوٹا: ${issue.origin} کا ${adj}${issue.minimum.toString()} ہونا متوقع تھا`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `غلط سٹرنگ: "${_issue.prefix}" سے شروع ہونا چاہیے`;
        }
        if (_issue.format === "ends_with")
          return `غلط سٹرنگ: "${_issue.suffix}" پر ختم ہونا چاہیے`;
        if (_issue.format === "includes")
          return `غلط سٹرنگ: "${_issue.includes}" شامل ہونا چاہیے`;
        if (_issue.format === "regex")
          return `غلط سٹرنگ: پیٹرن ${_issue.pattern} سے میچ ہونا چاہیے`;
        return `غلط ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `غلط نمبر: ${issue.divisor} کا مضاعف ہونا چاہیے`;
      case "unrecognized_keys":
        return `غیر تسلیم شدہ کی${issue.keys.length > 1 ? "ز" : ""}: ${joinValues(issue.keys, "، ")}`;
      case "invalid_key":
        return `${issue.origin} میں غلط کی`;
      case "invalid_union":
        return "غلط ان پٹ";
      case "invalid_element":
        return `${issue.origin} میں غلط ویلیو`;
      default:
        return `غلط ان پٹ`;
    }
  };
};
function ur_default() {
  return {
    localeError: error45()
  };
}
// node_modules/zod/v4/locales/uz.js
var error46 = () => {
  const Sizable = {
    string: { unit: "belgi", verb: "bo‘lishi kerak" },
    file: { unit: "bayt", verb: "bo‘lishi kerak" },
    array: { unit: "element", verb: "bo‘lishi kerak" },
    set: { unit: "element", verb: "bo‘lishi kerak" },
    map: { unit: "yozuv", verb: "bo‘lishi kerak" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "kirish",
    email: "elektron pochta manzili",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO sana va vaqti",
    date: "ISO sana",
    time: "ISO vaqt",
    duration: "ISO davomiylik",
    ipv4: "IPv4 manzil",
    ipv6: "IPv6 manzil",
    mac: "MAC manzil",
    cidrv4: "IPv4 diapazon",
    cidrv6: "IPv6 diapazon",
    base64: "base64 kodlangan satr",
    base64url: "base64url kodlangan satr",
    json_string: "JSON satr",
    e164: "E.164 raqam",
    jwt: "JWT",
    template_literal: "kirish"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "raqam",
    array: "massiv"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Noto‘g‘ri kirish: kutilgan instanceof ${issue.expected}, qabul qilingan ${received}`;
        }
        return `Noto‘g‘ri kirish: kutilgan ${expected}, qabul qilingan ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Noto‘g‘ri kirish: kutilgan ${stringifyPrimitive(issue.values[0])}`;
        return `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Juda katta: kutilgan ${issue.origin ?? "qiymat"} ${adj}${issue.maximum.toString()} ${sizing.unit} ${sizing.verb}`;
        return `Juda katta: kutilgan ${issue.origin ?? "qiymat"} ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Juda kichik: kutilgan ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
        }
        return `Juda kichik: kutilgan ${issue.origin} ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Noto‘g‘ri satr: "${_issue.prefix}" bilan boshlanishi kerak`;
        if (_issue.format === "ends_with")
          return `Noto‘g‘ri satr: "${_issue.suffix}" bilan tugashi kerak`;
        if (_issue.format === "includes")
          return `Noto‘g‘ri satr: "${_issue.includes}" ni o‘z ichiga olishi kerak`;
        if (_issue.format === "regex")
          return `Noto‘g‘ri satr: ${_issue.pattern} shabloniga mos kelishi kerak`;
        return `Noto‘g‘ri ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Noto‘g‘ri raqam: ${issue.divisor} ning karralisi bo‘lishi kerak`;
      case "unrecognized_keys":
        return `Noma’lum kalit${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `${issue.origin} dagi kalit noto‘g‘ri`;
      case "invalid_union":
        return "Noto‘g‘ri kirish";
      case "invalid_element":
        return `${issue.origin} da noto‘g‘ri qiymat`;
      default:
        return `Noto‘g‘ri kirish`;
    }
  };
};
function uz_default() {
  return {
    localeError: error46()
  };
}
// node_modules/zod/v4/locales/vi.js
var error47 = () => {
  const Sizable = {
    string: { unit: "ký tự", verb: "có" },
    file: { unit: "byte", verb: "có" },
    array: { unit: "phần tử", verb: "có" },
    set: { unit: "phần tử", verb: "có" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "đầu vào",
    email: "địa chỉ email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ngày giờ ISO",
    date: "ngày ISO",
    time: "giờ ISO",
    duration: "khoảng thời gian ISO",
    ipv4: "địa chỉ IPv4",
    ipv6: "địa chỉ IPv6",
    cidrv4: "dải IPv4",
    cidrv6: "dải IPv6",
    base64: "chuỗi mã hóa base64",
    base64url: "chuỗi mã hóa base64url",
    json_string: "chuỗi JSON",
    e164: "số E.164",
    jwt: "JWT",
    template_literal: "đầu vào"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "số",
    array: "mảng"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Đầu vào không hợp lệ: mong đợi instanceof ${issue.expected}, nhận được ${received}`;
        }
        return `Đầu vào không hợp lệ: mong đợi ${expected}, nhận được ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Đầu vào không hợp lệ: mong đợi ${stringifyPrimitive(issue.values[0])}`;
        return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Quá lớn: mong đợi ${issue.origin ?? "giá trị"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "phần tử"}`;
        return `Quá lớn: mong đợi ${issue.origin ?? "giá trị"} ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Quá nhỏ: mong đợi ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Quá nhỏ: mong đợi ${issue.origin} ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Chuỗi không hợp lệ: phải bắt đầu bằng "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Chuỗi không hợp lệ: phải kết thúc bằng "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Chuỗi không hợp lệ: phải bao gồm "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Chuỗi không hợp lệ: phải khớp với mẫu ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue.format} không hợp lệ`;
      }
      case "not_multiple_of":
        return `Số không hợp lệ: phải là bội số của ${issue.divisor}`;
      case "unrecognized_keys":
        return `Khóa không được nhận dạng: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Khóa không hợp lệ trong ${issue.origin}`;
      case "invalid_union":
        return "Đầu vào không hợp lệ";
      case "invalid_element":
        return `Giá trị không hợp lệ trong ${issue.origin}`;
      default:
        return `Đầu vào không hợp lệ`;
    }
  };
};
function vi_default() {
  return {
    localeError: error47()
  };
}
// node_modules/zod/v4/locales/zh-CN.js
var error48 = () => {
  const Sizable = {
    string: { unit: "字符", verb: "包含" },
    file: { unit: "字节", verb: "包含" },
    array: { unit: "项", verb: "包含" },
    set: { unit: "项", verb: "包含" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "输入",
    email: "电子邮件",
    url: "URL",
    emoji: "表情符号",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日期时间",
    date: "ISO日期",
    time: "ISO时间",
    duration: "ISO时长",
    ipv4: "IPv4地址",
    ipv6: "IPv6地址",
    cidrv4: "IPv4网段",
    cidrv6: "IPv6网段",
    base64: "base64编码字符串",
    base64url: "base64url编码字符串",
    json_string: "JSON字符串",
    e164: "E.164号码",
    jwt: "JWT",
    template_literal: "输入"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "数字",
    array: "数组",
    null: "空值(null)"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `无效输入：期望 instanceof ${issue.expected}，实际接收 ${received}`;
        }
        return `无效输入：期望 ${expected}，实际接收 ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `无效输入：期望 ${stringifyPrimitive(issue.values[0])}`;
        return `无效选项：期望以下之一 ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `数值过大：期望 ${issue.origin ?? "值"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "个元素"}`;
        return `数值过大：期望 ${issue.origin ?? "值"} ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `无效字符串：必须以 "${_issue.prefix}" 开头`;
        if (_issue.format === "ends_with")
          return `无效字符串：必须以 "${_issue.suffix}" 结尾`;
        if (_issue.format === "includes")
          return `无效字符串：必须包含 "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `无效字符串：必须满足正则表达式 ${_issue.pattern}`;
        return `无效${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `无效数字：必须是 ${issue.divisor} 的倍数`;
      case "unrecognized_keys":
        return `出现未知的键(key): ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `${issue.origin} 中的键(key)无效`;
      case "invalid_union":
        return "无效输入";
      case "invalid_element":
        return `${issue.origin} 中包含无效值(value)`;
      default:
        return `无效输入`;
    }
  };
};
function zh_CN_default() {
  return {
    localeError: error48()
  };
}
// node_modules/zod/v4/locales/zh-TW.js
var error49 = () => {
  const Sizable = {
    string: { unit: "字元", verb: "擁有" },
    file: { unit: "位元組", verb: "擁有" },
    array: { unit: "項目", verb: "擁有" },
    set: { unit: "項目", verb: "擁有" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "輸入",
    email: "郵件地址",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 日期時間",
    date: "ISO 日期",
    time: "ISO 時間",
    duration: "ISO 期間",
    ipv4: "IPv4 位址",
    ipv6: "IPv6 位址",
    cidrv4: "IPv4 範圍",
    cidrv6: "IPv6 範圍",
    base64: "base64 編碼字串",
    base64url: "base64url 編碼字串",
    json_string: "JSON 字串",
    e164: "E.164 數值",
    jwt: "JWT",
    template_literal: "輸入"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `無效的輸入值：預期為 instanceof ${issue.expected}，但收到 ${received}`;
        }
        return `無效的輸入值：預期為 ${expected}，但收到 ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `無效的輸入值：預期為 ${stringifyPrimitive(issue.values[0])}`;
        return `無效的選項：預期為以下其中之一 ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `數值過大：預期 ${issue.origin ?? "值"} 應為 ${adj}${issue.maximum.toString()} ${sizing.unit ?? "個元素"}`;
        return `數值過大：預期 ${issue.origin ?? "值"} 應為 ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `無效的字串：必須以 "${_issue.prefix}" 開頭`;
        }
        if (_issue.format === "ends_with")
          return `無效的字串：必須以 "${_issue.suffix}" 結尾`;
        if (_issue.format === "includes")
          return `無效的字串：必須包含 "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `無效的字串：必須符合格式 ${_issue.pattern}`;
        return `無效的 ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `無效的數字：必須為 ${issue.divisor} 的倍數`;
      case "unrecognized_keys":
        return `無法識別的鍵值${issue.keys.length > 1 ? "們" : ""}：${joinValues(issue.keys, "、")}`;
      case "invalid_key":
        return `${issue.origin} 中有無效的鍵值`;
      case "invalid_union":
        return "無效的輸入值";
      case "invalid_element":
        return `${issue.origin} 中有無效的值`;
      default:
        return `無效的輸入值`;
    }
  };
};
function zh_TW_default() {
  return {
    localeError: error49()
  };
}
// node_modules/zod/v4/locales/yo.js
var error50 = () => {
  const Sizable = {
    string: { unit: "àmi", verb: "ní" },
    file: { unit: "bytes", verb: "ní" },
    array: { unit: "nkan", verb: "ní" },
    set: { unit: "nkan", verb: "ní" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ẹ̀rọ ìbáwọlé",
    email: "àdírẹ́sì ìmẹ́lì",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "àkókò ISO",
    date: "ọjọ́ ISO",
    time: "àkókò ISO",
    duration: "àkókò tó pé ISO",
    ipv4: "àdírẹ́sì IPv4",
    ipv6: "àdírẹ́sì IPv6",
    cidrv4: "àgbègbè IPv4",
    cidrv6: "àgbègbè IPv6",
    base64: "ọ̀rọ̀ tí a kọ́ ní base64",
    base64url: "ọ̀rọ̀ base64url",
    json_string: "ọ̀rọ̀ JSON",
    e164: "nọ́mbà E.164",
    jwt: "JWT",
    template_literal: "ẹ̀rọ ìbáwọlé"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nọ́mbà",
    array: "akopọ"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return `Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${issue.expected}, àmọ̀ a rí ${received}`;
        }
        return `Ìbáwọlé aṣìṣe: a ní láti fi ${expected}, àmọ̀ a rí ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Ìbáwọlé aṣìṣe: a ní láti fi ${stringifyPrimitive(issue.values[0])}`;
        return `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Tó pọ̀ jù: a ní láti jẹ́ pé ${issue.origin ?? "iye"} ${sizing.verb} ${adj}${issue.maximum} ${sizing.unit}`;
        return `Tó pọ̀ jù: a ní láti jẹ́ ${adj}${issue.maximum}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Kéré ju: a ní láti jẹ́ pé ${issue.origin} ${sizing.verb} ${adj}${issue.minimum} ${sizing.unit}`;
        return `Kéré ju: a ní láti jẹ́ ${adj}${issue.minimum}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${_issue.pattern}`;
        return `Aṣìṣe: ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${issue.divisor}`;
      case "unrecognized_keys":
        return `Bọtìnì àìmọ̀: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Bọtìnì aṣìṣe nínú ${issue.origin}`;
      case "invalid_union":
        return "Ìbáwọlé aṣìṣe";
      case "invalid_element":
        return `Iye aṣìṣe nínú ${issue.origin}`;
      default:
        return "Ìbáwọlé aṣìṣe";
    }
  };
};
function yo_default() {
  return {
    localeError: error50()
  };
}
// node_modules/zod/v4/core/registries.js
var _a2;
var $output = Symbol("ZodOutput");
var $input = Symbol("ZodInput");

class $ZodRegistry {
  constructor() {
    this._map = new WeakMap;
    this._idmap = new Map;
  }
  add(schema, ..._meta) {
    const meta = _meta[0];
    this._map.set(schema, meta);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.set(meta.id, schema);
    }
    return this;
  }
  clear() {
    this._map = new WeakMap;
    this._idmap = new Map;
    return this;
  }
  remove(schema) {
    const meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : undefined;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry;
}
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
// node_modules/zod/v4/core/api.js
function _string(Class, params) {
  return new Class({
    type: "string",
    ...normalizeParams(params)
  });
}
function _coercedString(Class, params) {
  return new Class({
    type: "string",
    coerce: true,
    ...normalizeParams(params)
  });
}
function _email(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _guid(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuid(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuidv4(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
function _uuidv6(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
function _uuidv7(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
function _url(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _emoji2(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _nanoid(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid2(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ulid(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _xid(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ksuid(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv4(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv6(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _mac(Class, params) {
  return new Class({
    type: "string",
    format: "mac",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv4(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv6(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64url(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _e164(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _jwt(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
var TimePrecision = {
  Any: null,
  Minute: -1,
  Second: 0,
  Millisecond: 3,
  Microsecond: 6
};
function _isoDateTime(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDate(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _isoTime(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDuration(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _number(Class, params) {
  return new Class({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
function _coercedNumber(Class, params) {
  return new Class({
    type: "number",
    coerce: true,
    checks: [],
    ...normalizeParams(params)
  });
}
function _int(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
function _float32(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "float32",
    ...normalizeParams(params)
  });
}
function _float64(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "float64",
    ...normalizeParams(params)
  });
}
function _int32(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "int32",
    ...normalizeParams(params)
  });
}
function _uint32(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "uint32",
    ...normalizeParams(params)
  });
}
function _boolean(Class, params) {
  return new Class({
    type: "boolean",
    ...normalizeParams(params)
  });
}
function _coercedBoolean(Class, params) {
  return new Class({
    type: "boolean",
    coerce: true,
    ...normalizeParams(params)
  });
}
function _bigint(Class, params) {
  return new Class({
    type: "bigint",
    ...normalizeParams(params)
  });
}
function _coercedBigint(Class, params) {
  return new Class({
    type: "bigint",
    coerce: true,
    ...normalizeParams(params)
  });
}
function _int64(Class, params) {
  return new Class({
    type: "bigint",
    check: "bigint_format",
    abort: false,
    format: "int64",
    ...normalizeParams(params)
  });
}
function _uint64(Class, params) {
  return new Class({
    type: "bigint",
    check: "bigint_format",
    abort: false,
    format: "uint64",
    ...normalizeParams(params)
  });
}
function _symbol(Class, params) {
  return new Class({
    type: "symbol",
    ...normalizeParams(params)
  });
}
function _undefined2(Class, params) {
  return new Class({
    type: "undefined",
    ...normalizeParams(params)
  });
}
function _null2(Class, params) {
  return new Class({
    type: "null",
    ...normalizeParams(params)
  });
}
function _any(Class) {
  return new Class({
    type: "any"
  });
}
function _unknown(Class) {
  return new Class({
    type: "unknown"
  });
}
function _never(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams(params)
  });
}
function _void(Class, params) {
  return new Class({
    type: "void",
    ...normalizeParams(params)
  });
}
function _date(Class, params) {
  return new Class({
    type: "date",
    ...normalizeParams(params)
  });
}
function _coercedDate(Class, params) {
  return new Class({
    type: "date",
    coerce: true,
    ...normalizeParams(params)
  });
}
function _nan(Class, params) {
  return new Class({
    type: "nan",
    ...normalizeParams(params)
  });
}
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _positive(params) {
  return _gt(0, params);
}
function _negative(params) {
  return _lt(0, params);
}
function _nonpositive(params) {
  return _lte(0, params);
}
function _nonnegative(params) {
  return _gte(0, params);
}
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
function _maxSize(maximum, params) {
  return new $ZodCheckMaxSize({
    check: "max_size",
    ...normalizeParams(params),
    maximum
  });
}
function _minSize(minimum, params) {
  return new $ZodCheckMinSize({
    check: "min_size",
    ...normalizeParams(params),
    minimum
  });
}
function _size(size, params) {
  return new $ZodCheckSizeEquals({
    check: "size_equals",
    ...normalizeParams(params),
    size
  });
}
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
function _property(property, schema, params) {
  return new $ZodCheckProperty({
    check: "property",
    property,
    schema,
    ...normalizeParams(params)
  });
}
function _mime(types, params) {
  return new $ZodCheckMimeType({
    check: "mime_type",
    mime: types,
    ...normalizeParams(params)
  });
}
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
function _normalize(form) {
  return _overwrite((input) => input.normalize(form));
}
function _trim() {
  return _overwrite((input) => input.trim());
}
function _toLowerCase() {
  return _overwrite((input) => input.toLowerCase());
}
function _toUpperCase() {
  return _overwrite((input) => input.toUpperCase());
}
function _slugify() {
  return _overwrite((input) => slugify(input));
}
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    ...normalizeParams(params)
  });
}
function _union(Class, options, params) {
  return new Class({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
function _xor(Class, options, params) {
  return new Class({
    type: "union",
    options,
    inclusive: false,
    ...normalizeParams(params)
  });
}
function _discriminatedUnion(Class, discriminator, options, params) {
  return new Class({
    type: "union",
    options,
    discriminator,
    ...normalizeParams(params)
  });
}
function _intersection(Class, left, right) {
  return new Class({
    type: "intersection",
    left,
    right
  });
}
function _tuple(Class, items, _paramsOrRest, _params) {
  const hasRest = _paramsOrRest instanceof $ZodType;
  const params = hasRest ? _params : _paramsOrRest;
  const rest = hasRest ? _paramsOrRest : null;
  return new Class({
    type: "tuple",
    items,
    rest,
    ...normalizeParams(params)
  });
}
function _record(Class, keyType, valueType, params) {
  return new Class({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
function _map(Class, keyType, valueType, params) {
  return new Class({
    type: "map",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
function _set(Class, valueType, params) {
  return new Class({
    type: "set",
    valueType,
    ...normalizeParams(params)
  });
}
function _enum(Class, values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new Class({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
function _nativeEnum(Class, entries, params) {
  return new Class({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
function _literal(Class, value, params) {
  return new Class({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...normalizeParams(params)
  });
}
function _file(Class, params) {
  return new Class({
    type: "file",
    ...normalizeParams(params)
  });
}
function _transform(Class, fn) {
  return new Class({
    type: "transform",
    transform: fn
  });
}
function _optional(Class, innerType) {
  return new Class({
    type: "optional",
    innerType
  });
}
function _nullable(Class, innerType) {
  return new Class({
    type: "nullable",
    innerType
  });
}
function _default(Class, innerType, defaultValue) {
  return new Class({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
function _nonoptional(Class, innerType, params) {
  return new Class({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
function _success(Class, innerType) {
  return new Class({
    type: "success",
    innerType
  });
}
function _catch(Class, innerType, catchValue) {
  return new Class({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
function _pipe(Class, in_, out) {
  return new Class({
    type: "pipe",
    in: in_,
    out
  });
}
function _readonly(Class, innerType) {
  return new Class({
    type: "readonly",
    innerType
  });
}
function _templateLiteral(Class, parts, params) {
  return new Class({
    type: "template_literal",
    parts,
    ...normalizeParams(params)
  });
}
function _lazy(Class, getter) {
  return new Class({
    type: "lazy",
    getter
  });
}
function _promise(Class, innerType) {
  return new Class({
    type: "promise",
    innerType
  });
}
function _custom(Class, fn, _params) {
  const norm = normalizeParams(_params);
  norm.abort ?? (norm.abort = true);
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...norm
  });
  return schema;
}
function _refine(Class, fn, _params) {
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
function _superRefine(fn, params) {
  const ch = _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
function describe(description) {
  const ch = new $ZodCheck({ check: "describe" });
  ch._zod.onattach = [
    (inst) => {
      const existing = globalRegistry.get(inst) ?? {};
      globalRegistry.add(inst, { ...existing, description });
    }
  ];
  ch._zod.check = () => {};
  return ch;
}
function meta(metadata) {
  const ch = new $ZodCheck({ check: "meta" });
  ch._zod.onattach = [
    (inst) => {
      const existing = globalRegistry.get(inst) ?? {};
      globalRegistry.add(inst, { ...existing, ...metadata });
    }
  ];
  ch._zod.check = () => {};
  return ch;
}
function _stringbool(Classes, _params) {
  const params = normalizeParams(_params);
  let truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"];
  let falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  if (params.case !== "sensitive") {
    truthyArray = truthyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
    falsyArray = falsyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
  }
  const truthySet = new Set(truthyArray);
  const falsySet = new Set(falsyArray);
  const _Codec = Classes.Codec ?? $ZodCodec;
  const _Boolean = Classes.Boolean ?? $ZodBoolean;
  const _String = Classes.String ?? $ZodString;
  const stringSchema = new _String({ type: "string", error: params.error });
  const booleanSchema = new _Boolean({ type: "boolean", error: params.error });
  const codec = new _Codec({
    type: "pipe",
    in: stringSchema,
    out: booleanSchema,
    transform: (input, payload) => {
      let data = input;
      if (params.case !== "sensitive")
        data = data.toLowerCase();
      if (truthySet.has(data)) {
        return true;
      } else if (falsySet.has(data)) {
        return false;
      } else {
        payload.issues.push({
          code: "invalid_value",
          expected: "stringbool",
          values: [...truthySet, ...falsySet],
          input: payload.value,
          inst: codec,
          continue: false
        });
        return {};
      }
    },
    reverseTransform: (input, _payload) => {
      if (input === true) {
        return truthyArray[0] || "true";
      } else {
        return falsyArray[0] || "false";
      }
    },
    error: params.error
  });
  return codec;
}
function _stringFormat(Class, format, fnOrRegex, _params = {}) {
  const params = normalizeParams(_params);
  const def = {
    ...normalizeParams(_params),
    check: "string_format",
    type: "string",
    format,
    fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
    ...params
  };
  if (fnOrRegex instanceof RegExp) {
    def.pattern = fnOrRegex;
  }
  const inst = new Class(def);
  return inst;
}
// node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {}),
    io: params?.io ?? "output",
    counter: 0,
    seen: new Map,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? undefined
  };
}
function process(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
  ctx.seen.set(schema, result);
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta = ctx.metadataRegistry.get(schema);
  if (meta)
    Object.assign(result.schema, meta);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a = result.schema).default ?? (_a.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const idToSchema = new Map;
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id) => id);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
    }
    if (entry[1] === root) {
      return { ref: "#" };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema = seen.schema;
    for (const key in schema) {
      delete schema[key];
    }
    schema.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error("Cycle detected: " + `#/${seen.cycle?.join("/")}/<root>` + '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema = seen.def ?? seen.schema;
    const _cached = { ...schema };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema.allOf = schema.allOf ?? [];
        schema.allOf.push(refSchema);
      } else {
        Object.assign(schema, refSchema);
      }
      Object.assign(schema, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema,
      path: seen.path ?? []
    });
  };
  for (const entry of [...ctx.seen.entries()].reverse()) {
    flattenRef(entry[0]);
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {}
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  Object.assign(result, root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== undefined && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      if (seen.def.id === seen.defId)
        delete seen.def.id;
      defs[seen.defId] = seen.def;
    }
  }
  if (ctx.external) {} else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: new Set };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  process(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  process(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
// node_modules/zod/v4/core/json-schema-processors.js
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
};
var stringProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  json.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    json.format = formatMap[format] ?? format;
    if (json.format === "")
      delete json.format;
    if (format === "time") {
      delete json.format;
    }
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const regexes = [...patterns];
    if (regexes.length === 1)
      json.pattern = regexes[0].source;
    else if (regexes.length > 1) {
      json.allOf = [
        ...regexes.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
};
var numberProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
  if (typeof format === "string" && format.includes("int"))
    json.type = "integer";
  else
    json.type = "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json.minimum = exclusiveMinimum;
      json.exclusiveMinimum = true;
    } else {
      json.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json.maximum = exclusiveMaximum;
      json.exclusiveMaximum = true;
    } else {
      json.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json.maximum = maximum;
  }
  if (typeof multipleOf === "number")
    json.multipleOf = multipleOf;
};
var booleanProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var bigintProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("BigInt cannot be represented in JSON Schema");
  }
};
var symbolProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Symbols cannot be represented in JSON Schema");
  }
};
var nullProcessor = (_schema, ctx, json, _params) => {
  if (ctx.target === "openapi-3.0") {
    json.type = "string";
    json.nullable = true;
    json.enum = [null];
  } else {
    json.type = "null";
  }
};
var undefinedProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Undefined cannot be represented in JSON Schema");
  }
};
var voidProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Void cannot be represented in JSON Schema");
  }
};
var neverProcessor = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var anyProcessor = (_schema, _ctx, _json, _params) => {};
var unknownProcessor = (_schema, _ctx, _json, _params) => {};
var dateProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Date cannot be represented in JSON Schema");
  }
};
var enumProcessor = (schema, _ctx, json, _params) => {
  const def = schema._zod.def;
  const values = getEnumValues(def.entries);
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
};
var literalProcessor = (schema, ctx, json, _params) => {
  const def = schema._zod.def;
  const vals = [];
  for (const val of def.values) {
    if (val === undefined) {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
      }
    } else if (typeof val === "bigint") {
      if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      } else {
        vals.push(Number(val));
      }
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {} else if (vals.length === 1) {
    const val = vals[0];
    json.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json.enum = [val];
    } else {
      json.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json.type = "boolean";
    if (vals.every((v) => v === null))
      json.type = "null";
    json.enum = vals;
  }
};
var nanProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("NaN cannot be represented in JSON Schema");
  }
};
var templateLiteralProcessor = (schema, _ctx, json, _params) => {
  const _json = json;
  const pattern = schema._zod.pattern;
  if (!pattern)
    throw new Error("Pattern not found in template literal");
  _json.type = "string";
  _json.pattern = pattern.source;
};
var fileProcessor = (schema, _ctx, json, _params) => {
  const _json = json;
  const file = {
    type: "string",
    format: "binary",
    contentEncoding: "binary"
  };
  const { minimum, maximum, mime } = schema._zod.bag;
  if (minimum !== undefined)
    file.minLength = minimum;
  if (maximum !== undefined)
    file.maxLength = maximum;
  if (mime) {
    if (mime.length === 1) {
      file.contentMediaType = mime[0];
      Object.assign(_json, file);
    } else {
      Object.assign(_json, file);
      _json.anyOf = mime.map((m) => ({ contentMediaType: m }));
    }
  } else {
    Object.assign(_json, file);
  }
};
var successProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var customProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Custom types cannot be represented in JSON Schema");
  }
};
var functionProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Function types cannot be represented in JSON Schema");
  }
};
var transformProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Transforms cannot be represented in JSON Schema");
  }
};
var mapProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Map cannot be represented in JSON Schema");
  }
};
var setProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Set cannot be represented in JSON Schema");
  }
};
var arrayProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array";
  json.items = process(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
var objectProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  json.properties = {};
  const shape = def.shape;
  for (const key in shape) {
    json.properties[key] = process(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    });
  }
  const allKeys = new Set(Object.keys(shape));
  const requiredKeys = new Set([...allKeys].filter((key) => {
    const v = def.shape[key]._zod;
    if (ctx.io === "input") {
      return v.optin === undefined;
    } else {
      return v.optout === undefined;
    }
  }));
  if (requiredKeys.size > 0) {
    json.required = Array.from(requiredKeys);
  }
  if (def.catchall?._zod.def.type === "never") {
    json.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = false;
  } else if (def.catchall) {
    json.additionalProperties = process(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
};
var unionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => process(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json.oneOf = options;
  } else {
    json.anyOf = options;
  }
};
var intersectionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const a = process(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = process(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf;
};
var tupleProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "array";
  const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
  const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
  const prefixItems = def.items.map((x, i) => process(x, ctx, {
    ...params,
    path: [...params.path, prefixPath, i]
  }));
  const rest = def.rest ? process(def.rest, ctx, {
    ...params,
    path: [...params.path, restPath, ...ctx.target === "openapi-3.0" ? [def.items.length] : []]
  }) : null;
  if (ctx.target === "draft-2020-12") {
    json.prefixItems = prefixItems;
    if (rest) {
      json.items = rest;
    }
  } else if (ctx.target === "openapi-3.0") {
    json.items = {
      anyOf: prefixItems
    };
    if (rest) {
      json.items.anyOf.push(rest);
    }
    json.minItems = prefixItems.length;
    if (!rest) {
      json.maxItems = prefixItems.length;
    }
  } else {
    json.items = prefixItems;
    if (rest) {
      json.additionalItems = rest;
    }
  }
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
};
var recordProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  const keyType = def.keyType;
  const keyBag = keyType._zod.bag;
  const patterns = keyBag?.patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = process(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (const pattern of patterns) {
      json.patternProperties[pattern.source] = valueSchema;
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = process(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
    }
    json.additionalProperties = process(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  if (keyValues) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json.required = validKeyValues;
    }
  }
};
var nullableProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const inner = process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json.nullable = true;
  } else {
    json.anyOf = [inner, { type: "null" }];
  }
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var defaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
var prefaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io === "input")
    json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
var catchProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(undefined);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  process(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.readOnly = true;
};
var promiseProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var lazyProcessor = (schema, ctx, _json, params) => {
  const innerType = schema._zod.innerType;
  process(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
var allProcessors = {
  string: stringProcessor,
  number: numberProcessor,
  boolean: booleanProcessor,
  bigint: bigintProcessor,
  symbol: symbolProcessor,
  null: nullProcessor,
  undefined: undefinedProcessor,
  void: voidProcessor,
  never: neverProcessor,
  any: anyProcessor,
  unknown: unknownProcessor,
  date: dateProcessor,
  enum: enumProcessor,
  literal: literalProcessor,
  nan: nanProcessor,
  template_literal: templateLiteralProcessor,
  file: fileProcessor,
  success: successProcessor,
  custom: customProcessor,
  function: functionProcessor,
  transform: transformProcessor,
  map: mapProcessor,
  set: setProcessor,
  array: arrayProcessor,
  object: objectProcessor,
  union: unionProcessor,
  intersection: intersectionProcessor,
  tuple: tupleProcessor,
  record: recordProcessor,
  nullable: nullableProcessor,
  nonoptional: nonoptionalProcessor,
  default: defaultProcessor,
  prefault: prefaultProcessor,
  catch: catchProcessor,
  pipe: pipeProcessor,
  readonly: readonlyProcessor,
  promise: promiseProcessor,
  optional: optionalProcessor,
  lazy: lazyProcessor
};
function toJSONSchema(input, params) {
  if ("_idmap" in input) {
    const registry = input;
    const ctx = initializeContext({ ...params, processors: allProcessors });
    const defs = {};
    for (const entry of registry._idmap.entries()) {
      const [_, schema] = entry;
      process(schema, ctx);
    }
    const schemas = {};
    const external = {
      registry,
      uri: params?.uri,
      defs
    };
    ctx.external = external;
    for (const entry of registry._idmap.entries()) {
      const [key, schema] = entry;
      extractDefs(ctx, schema);
      schemas[key] = finalize(ctx, schema);
    }
    if (Object.keys(defs).length > 0) {
      const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
      schemas.__shared = {
        [defsSegment]: defs
      };
    }
    return { schemas };
  }
  const ctx = initializeContext({ ...params, processors: allProcessors });
  process(input, ctx);
  extractDefs(ctx, input);
  return finalize(ctx, input);
}
// node_modules/zod/v4/core/json-schema-generator.js
class JSONSchemaGenerator {
  get metadataRegistry() {
    return this.ctx.metadataRegistry;
  }
  get target() {
    return this.ctx.target;
  }
  get unrepresentable() {
    return this.ctx.unrepresentable;
  }
  get override() {
    return this.ctx.override;
  }
  get io() {
    return this.ctx.io;
  }
  get counter() {
    return this.ctx.counter;
  }
  set counter(value) {
    this.ctx.counter = value;
  }
  get seen() {
    return this.ctx.seen;
  }
  constructor(params) {
    let normalizedTarget = params?.target ?? "draft-2020-12";
    if (normalizedTarget === "draft-4")
      normalizedTarget = "draft-04";
    if (normalizedTarget === "draft-7")
      normalizedTarget = "draft-07";
    this.ctx = initializeContext({
      processors: allProcessors,
      target: normalizedTarget,
      ...params?.metadata && { metadata: params.metadata },
      ...params?.unrepresentable && { unrepresentable: params.unrepresentable },
      ...params?.override && { override: params.override },
      ...params?.io && { io: params.io }
    });
  }
  process(schema, _params = { path: [], schemaPath: [] }) {
    return process(schema, this.ctx, _params);
  }
  emit(schema, _params) {
    if (_params) {
      if (_params.cycles)
        this.ctx.cycles = _params.cycles;
      if (_params.reused)
        this.ctx.reused = _params.reused;
      if (_params.external)
        this.ctx.external = _params.external;
    }
    extractDefs(this.ctx, schema);
    const result = finalize(this.ctx, schema);
    const { "~standard": _, ...plainResult } = result;
    return plainResult;
  }
}
// node_modules/zod/v4/classic/iso.js
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function date2(params) {
  return _isoDate(ZodISODate, params);
}
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}

// node_modules/zod/v4/classic/errors.js
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: (mapper) => formatError(inst, mapper)
    },
    flatten: {
      value: (mapper) => flattenError(inst, mapper)
    },
    addIssue: {
      value: (issue) => {
        inst.issues.push(issue);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    addIssues: {
      value: (issues) => {
        inst.issues.push(...issues);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
    }
  });
};
var ZodError = /* @__PURE__ */ $constructor("ZodError", initializer2);
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse3 = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync2 = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse2 = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode2 = /* @__PURE__ */ _encode(ZodRealError);
var decode2 = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync2 = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync2 = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode2 = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode2 = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync2 = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync2 = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// node_modules/zod/v4/classic/schemas.js
var _installedGroups = /* @__PURE__ */ new WeakMap;
function _installLazyMethods(inst, group, methods) {
  const proto = Object.getPrototypeOf(inst);
  let installed = _installedGroups.get(proto);
  if (!installed) {
    installed = new Set;
    _installedGroups.set(proto, installed);
  }
  if (installed.has(group))
    return;
  installed.add(group);
  for (const key in methods) {
    const fn = methods[key];
    Object.defineProperty(proto, key, {
      configurable: true,
      enumerable: false,
      get() {
        const bound = fn.bind(this);
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: bound
        });
        return bound;
      },
      set(v) {
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: v
        });
      }
    });
  }
}
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  $ZodType.init(inst, def);
  Object.assign(inst["~standard"], {
    jsonSchema: {
      input: createStandardJSONSchemaMethod(inst, "input"),
      output: createStandardJSONSchemaMethod(inst, "output")
    }
  });
  inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
  inst.def = def;
  inst.type = def.type;
  Object.defineProperty(inst, "_def", { value: def });
  inst.parse = (data, params) => parse3(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => safeParse2(inst, data, params);
  inst.parseAsync = async (data, params) => parseAsync2(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
  inst.spa = inst.safeParseAsync;
  inst.encode = (data, params) => encode2(inst, data, params);
  inst.decode = (data, params) => decode2(inst, data, params);
  inst.encodeAsync = async (data, params) => encodeAsync2(inst, data, params);
  inst.decodeAsync = async (data, params) => decodeAsync2(inst, data, params);
  inst.safeEncode = (data, params) => safeEncode2(inst, data, params);
  inst.safeDecode = (data, params) => safeDecode2(inst, data, params);
  inst.safeEncodeAsync = async (data, params) => safeEncodeAsync2(inst, data, params);
  inst.safeDecodeAsync = async (data, params) => safeDecodeAsync2(inst, data, params);
  _installLazyMethods(inst, "ZodType", {
    check(...chks) {
      const def = this.def;
      return this.clone(mergeDefs(def, {
        checks: [
          ...def.checks ?? [],
          ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
        ]
      }), { parent: true });
    },
    with(...chks) {
      return this.check(...chks);
    },
    clone(def, params) {
      return clone2(this, def, params);
    },
    brand() {
      return this;
    },
    register(reg, meta) {
      reg.add(this, meta);
      return this;
    },
    refine(check2, params) {
      return this.check(refine(check2, params));
    },
    superRefine(refinement, params) {
      return this.check(superRefine(refinement, params));
    },
    overwrite(fn) {
      return this.check(_overwrite(fn));
    },
    optional() {
      return optional(this);
    },
    exactOptional() {
      return exactOptional(this);
    },
    nullable() {
      return nullable(this);
    },
    nullish() {
      return optional(nullable(this));
    },
    nonoptional(params) {
      return nonoptional(this, params);
    },
    array() {
      return array(this);
    },
    or(arg) {
      return union([this, arg]);
    },
    and(arg) {
      return intersection(this, arg);
    },
    transform(tx) {
      return pipe(this, transform(tx));
    },
    default(d) {
      return _default2(this, d);
    },
    prefault(d) {
      return prefault(this, d);
    },
    catch(params) {
      return _catch2(this, params);
    },
    pipe(target) {
      return pipe(this, target);
    },
    readonly() {
      return readonly(this);
    },
    describe(description) {
      const cl = this.clone();
      globalRegistry.add(cl, { description });
      return cl;
    },
    meta(...args) {
      if (args.length === 0)
        return globalRegistry.get(this);
      const cl = this.clone();
      globalRegistry.add(cl, args[0]);
      return cl;
    },
    isOptional() {
      return this.safeParse(undefined).success;
    },
    isNullable() {
      return this.safeParse(null).success;
    },
    apply(fn) {
      return fn(this);
    }
  });
  Object.defineProperty(inst, "description", {
    get() {
      return globalRegistry.get(inst)?.description;
    },
    configurable: true
  });
  return inst;
});
var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => stringProcessor(inst, ctx, json2, params);
  const bag = inst._zod.bag;
  inst.format = bag.format ?? null;
  inst.minLength = bag.minimum ?? null;
  inst.maxLength = bag.maximum ?? null;
  _installLazyMethods(inst, "_ZodString", {
    regex(...args) {
      return this.check(_regex(...args));
    },
    includes(...args) {
      return this.check(_includes(...args));
    },
    startsWith(...args) {
      return this.check(_startsWith(...args));
    },
    endsWith(...args) {
      return this.check(_endsWith(...args));
    },
    min(...args) {
      return this.check(_minLength(...args));
    },
    max(...args) {
      return this.check(_maxLength(...args));
    },
    length(...args) {
      return this.check(_length(...args));
    },
    nonempty(...args) {
      return this.check(_minLength(1, ...args));
    },
    lowercase(params) {
      return this.check(_lowercase(params));
    },
    uppercase(params) {
      return this.check(_uppercase(params));
    },
    trim() {
      return this.check(_trim());
    },
    normalize(...args) {
      return this.check(_normalize(...args));
    },
    toLowerCase() {
      return this.check(_toLowerCase());
    },
    toUpperCase() {
      return this.check(_toUpperCase());
    },
    slugify() {
      return this.check(_slugify());
    }
  });
});
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
  inst.email = (params) => inst.check(_email(ZodEmail, params));
  inst.url = (params) => inst.check(_url(ZodURL, params));
  inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
  inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
  inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
  inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
  inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
  inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
  inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
  inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
  inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
  inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
  inst.xid = (params) => inst.check(_xid(ZodXID, params));
  inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
  inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
  inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
  inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
  inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
  inst.e164 = (params) => inst.check(_e164(ZodE164, params));
  inst.datetime = (params) => inst.check(datetime2(params));
  inst.date = (params) => inst.check(date2(params));
  inst.time = (params) => inst.check(time2(params));
  inst.duration = (params) => inst.check(duration2(params));
});
function string2(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function email2(params) {
  return _email(ZodEmail, params);
}
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function guid2(params) {
  return _guid(ZodGUID, params);
}
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function uuid2(params) {
  return _uuid(ZodUUID, params);
}
function uuidv4(params) {
  return _uuidv4(ZodUUID, params);
}
function uuidv6(params) {
  return _uuidv6(ZodUUID, params);
}
function uuidv7(params) {
  return _uuidv7(ZodUUID, params);
}
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function url(params) {
  return _url(ZodURL, params);
}
function httpUrl(params) {
  return _url(ZodURL, {
    protocol: httpProtocol,
    hostname: domain,
    ...normalizeParams(params)
  });
}
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function emoji2(params) {
  return _emoji2(ZodEmoji, params);
}
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function nanoid2(params) {
  return _nanoid(ZodNanoID, params);
}
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function cuid3(params) {
  return _cuid(ZodCUID, params);
}
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function cuid22(params) {
  return _cuid2(ZodCUID2, params);
}
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function ulid2(params) {
  return _ulid(ZodULID, params);
}
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function xid2(params) {
  return _xid(ZodXID, params);
}
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function ksuid2(params) {
  return _ksuid(ZodKSUID, params);
}
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function ipv42(params) {
  return _ipv4(ZodIPv4, params);
}
var ZodMAC = /* @__PURE__ */ $constructor("ZodMAC", (inst, def) => {
  $ZodMAC.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function mac2(params) {
  return _mac(ZodMAC, params);
}
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function ipv62(params) {
  return _ipv6(ZodIPv6, params);
}
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function cidrv42(params) {
  return _cidrv4(ZodCIDRv4, params);
}
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function cidrv62(params) {
  return _cidrv6(ZodCIDRv6, params);
}
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function base642(params) {
  return _base64(ZodBase64, params);
}
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function base64url2(params) {
  return _base64url(ZodBase64URL, params);
}
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function e1642(params) {
  return _e164(ZodE164, params);
}
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function jwt(params) {
  return _jwt(ZodJWT, params);
}
var ZodCustomStringFormat = /* @__PURE__ */ $constructor("ZodCustomStringFormat", (inst, def) => {
  $ZodCustomStringFormat.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function stringFormat(format, fnOrRegex, _params = {}) {
  return _stringFormat(ZodCustomStringFormat, format, fnOrRegex, _params);
}
function hostname2(_params) {
  return _stringFormat(ZodCustomStringFormat, "hostname", hostname, _params);
}
function hex2(_params) {
  return _stringFormat(ZodCustomStringFormat, "hex", hex, _params);
}
function hash(alg, params) {
  const enc = params?.enc ?? "hex";
  const format = `${alg}_${enc}`;
  const regex = exports_regexes[format];
  if (!regex)
    throw new Error(`Unrecognized hash format: ${format}`);
  return _stringFormat(ZodCustomStringFormat, format, regex, params);
}
var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
  $ZodNumber.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => numberProcessor(inst, ctx, json2, params);
  _installLazyMethods(inst, "ZodNumber", {
    gt(value, params) {
      return this.check(_gt(value, params));
    },
    gte(value, params) {
      return this.check(_gte(value, params));
    },
    min(value, params) {
      return this.check(_gte(value, params));
    },
    lt(value, params) {
      return this.check(_lt(value, params));
    },
    lte(value, params) {
      return this.check(_lte(value, params));
    },
    max(value, params) {
      return this.check(_lte(value, params));
    },
    int(params) {
      return this.check(int(params));
    },
    safe(params) {
      return this.check(int(params));
    },
    positive(params) {
      return this.check(_gt(0, params));
    },
    nonnegative(params) {
      return this.check(_gte(0, params));
    },
    negative(params) {
      return this.check(_lt(0, params));
    },
    nonpositive(params) {
      return this.check(_lte(0, params));
    },
    multipleOf(value, params) {
      return this.check(_multipleOf(value, params));
    },
    step(value, params) {
      return this.check(_multipleOf(value, params));
    },
    finite() {
      return this;
    }
  });
  const bag = inst._zod.bag;
  inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
  inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
  inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
  inst.isFinite = true;
  inst.format = bag.format ?? null;
});
function number2(params) {
  return _number(ZodNumber, params);
}
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
function float32(params) {
  return _float32(ZodNumberFormat, params);
}
function float64(params) {
  return _float64(ZodNumberFormat, params);
}
function int32(params) {
  return _int32(ZodNumberFormat, params);
}
function uint32(params) {
  return _uint32(ZodNumberFormat, params);
}
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => booleanProcessor(inst, ctx, json2, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
var ZodBigInt = /* @__PURE__ */ $constructor("ZodBigInt", (inst, def) => {
  $ZodBigInt.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => bigintProcessor(inst, ctx, json2, params);
  inst.gte = (value, params) => inst.check(_gte(value, params));
  inst.min = (value, params) => inst.check(_gte(value, params));
  inst.gt = (value, params) => inst.check(_gt(value, params));
  inst.gte = (value, params) => inst.check(_gte(value, params));
  inst.min = (value, params) => inst.check(_gte(value, params));
  inst.lt = (value, params) => inst.check(_lt(value, params));
  inst.lte = (value, params) => inst.check(_lte(value, params));
  inst.max = (value, params) => inst.check(_lte(value, params));
  inst.positive = (params) => inst.check(_gt(BigInt(0), params));
  inst.negative = (params) => inst.check(_lt(BigInt(0), params));
  inst.nonpositive = (params) => inst.check(_lte(BigInt(0), params));
  inst.nonnegative = (params) => inst.check(_gte(BigInt(0), params));
  inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
  const bag = inst._zod.bag;
  inst.minValue = bag.minimum ?? null;
  inst.maxValue = bag.maximum ?? null;
  inst.format = bag.format ?? null;
});
function bigint2(params) {
  return _bigint(ZodBigInt, params);
}
var ZodBigIntFormat = /* @__PURE__ */ $constructor("ZodBigIntFormat", (inst, def) => {
  $ZodBigIntFormat.init(inst, def);
  ZodBigInt.init(inst, def);
});
function int64(params) {
  return _int64(ZodBigIntFormat, params);
}
function uint64(params) {
  return _uint64(ZodBigIntFormat, params);
}
var ZodSymbol = /* @__PURE__ */ $constructor("ZodSymbol", (inst, def) => {
  $ZodSymbol.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => symbolProcessor(inst, ctx, json2, params);
});
function symbol(params) {
  return _symbol(ZodSymbol, params);
}
var ZodUndefined = /* @__PURE__ */ $constructor("ZodUndefined", (inst, def) => {
  $ZodUndefined.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => undefinedProcessor(inst, ctx, json2, params);
});
function _undefined3(params) {
  return _undefined2(ZodUndefined, params);
}
var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
  $ZodNull.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nullProcessor(inst, ctx, json2, params);
});
function _null3(params) {
  return _null2(ZodNull, params);
}
var ZodAny = /* @__PURE__ */ $constructor("ZodAny", (inst, def) => {
  $ZodAny.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => anyProcessor(inst, ctx, json2, params);
});
function any() {
  return _any(ZodAny);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => unknownProcessor(inst, ctx, json2, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => neverProcessor(inst, ctx, json2, params);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodVoid = /* @__PURE__ */ $constructor("ZodVoid", (inst, def) => {
  $ZodVoid.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => voidProcessor(inst, ctx, json2, params);
});
function _void2(params) {
  return _void(ZodVoid, params);
}
var ZodDate = /* @__PURE__ */ $constructor("ZodDate", (inst, def) => {
  $ZodDate.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => dateProcessor(inst, ctx, json2, params);
  inst.min = (value, params) => inst.check(_gte(value, params));
  inst.max = (value, params) => inst.check(_lte(value, params));
  const c = inst._zod.bag;
  inst.minDate = c.minimum ? new Date(c.minimum) : null;
  inst.maxDate = c.maximum ? new Date(c.maximum) : null;
});
function date3(params) {
  return _date(ZodDate, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => arrayProcessor(inst, ctx, json2, params);
  inst.element = def.element;
  _installLazyMethods(inst, "ZodArray", {
    min(n, params) {
      return this.check(_minLength(n, params));
    },
    nonempty(params) {
      return this.check(_minLength(1, params));
    },
    max(n, params) {
      return this.check(_maxLength(n, params));
    },
    length(n, params) {
      return this.check(_length(n, params));
    },
    unwrap() {
      return this.element;
    }
  });
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
function keyof(schema) {
  const shape = schema._zod.def.shape;
  return _enum2(Object.keys(shape));
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => objectProcessor(inst, ctx, json2, params);
  defineLazy(inst, "shape", () => {
    return def.shape;
  });
  _installLazyMethods(inst, "ZodObject", {
    keyof() {
      return _enum2(Object.keys(this._zod.def.shape));
    },
    catchall(catchall) {
      return this.clone({ ...this._zod.def, catchall });
    },
    passthrough() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    loose() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    strict() {
      return this.clone({ ...this._zod.def, catchall: never() });
    },
    strip() {
      return this.clone({ ...this._zod.def, catchall: undefined });
    },
    extend(incoming) {
      return extend(this, incoming);
    },
    safeExtend(incoming) {
      return safeExtend(this, incoming);
    },
    merge(other) {
      return merge2(this, other);
    },
    pick(mask) {
      return pick2(this, mask);
    },
    omit(mask) {
      return omit(this, mask);
    },
    partial(...args) {
      return partial(ZodOptional, this, args[0]);
    },
    required(...args) {
      return required(ZodNonOptional, this, args[0]);
    }
  });
});
function object(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...normalizeParams(params)
  };
  return new ZodObject(def);
}
function strictObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: never(),
    ...normalizeParams(params)
  });
}
function looseObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: unknown(),
    ...normalizeParams(params)
  });
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => unionProcessor(inst, ctx, json2, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
var ZodXor = /* @__PURE__ */ $constructor("ZodXor", (inst, def) => {
  ZodUnion.init(inst, def);
  $ZodXor.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => unionProcessor(inst, ctx, json2, params);
  inst.options = def.options;
});
function xor(options, params) {
  return new ZodXor({
    type: "union",
    options,
    inclusive: false,
    ...normalizeParams(params)
  });
}
var ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
  ZodUnion.init(inst, def);
  $ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
  return new ZodDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
    ...normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => intersectionProcessor(inst, ctx, json2, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodTuple = /* @__PURE__ */ $constructor("ZodTuple", (inst, def) => {
  $ZodTuple.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => tupleProcessor(inst, ctx, json2, params);
  inst.rest = (rest) => inst.clone({
    ...inst._zod.def,
    rest
  });
});
function tuple(items, _paramsOrRest, _params) {
  const hasRest = _paramsOrRest instanceof $ZodType;
  const params = hasRest ? _params : _paramsOrRest;
  const rest = hasRest ? _paramsOrRest : null;
  return new ZodTuple({
    type: "tuple",
    items,
    rest,
    ...normalizeParams(params)
  });
}
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  $ZodRecord.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => recordProcessor(inst, ctx, json2, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string2(),
      valueType: keyType,
      ...normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
function partialRecord(keyType, valueType, params) {
  const k = clone2(keyType);
  k._zod.values = undefined;
  return new ZodRecord({
    type: "record",
    keyType: k,
    valueType,
    ...normalizeParams(params)
  });
}
function looseRecord(keyType, valueType, params) {
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    mode: "loose",
    ...normalizeParams(params)
  });
}
var ZodMap = /* @__PURE__ */ $constructor("ZodMap", (inst, def) => {
  $ZodMap.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => mapProcessor(inst, ctx, json2, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
  inst.min = (...args) => inst.check(_minSize(...args));
  inst.nonempty = (params) => inst.check(_minSize(1, params));
  inst.max = (...args) => inst.check(_maxSize(...args));
  inst.size = (...args) => inst.check(_size(...args));
});
function map(keyType, valueType, params) {
  return new ZodMap({
    type: "map",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
var ZodSet = /* @__PURE__ */ $constructor("ZodSet", (inst, def) => {
  $ZodSet.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => setProcessor(inst, ctx, json2, params);
  inst.min = (...args) => inst.check(_minSize(...args));
  inst.nonempty = (params) => inst.check(_minSize(1, params));
  inst.max = (...args) => inst.check(_maxSize(...args));
  inst.size = (...args) => inst.check(_size(...args));
});
function set(valueType, params) {
  return new ZodSet({
    type: "set",
    valueType,
    ...normalizeParams(params)
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => enumProcessor(inst, ctx, json2, params);
  inst.enum = def.entries;
  inst.options = Object.values(def.entries);
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum2(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
function nativeEnum(entries, params) {
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => literalProcessor(inst, ctx, json2, params);
  inst.values = new Set(def.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...normalizeParams(params)
  });
}
var ZodFile = /* @__PURE__ */ $constructor("ZodFile", (inst, def) => {
  $ZodFile.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => fileProcessor(inst, ctx, json2, params);
  inst.min = (size, params) => inst.check(_minSize(size, params));
  inst.max = (size, params) => inst.check(_maxSize(size, params));
  inst.mime = (types, params) => inst.check(_mime(Array.isArray(types) ? types : [types], params));
});
function file(params) {
  return _file(ZodFile, params);
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => transformProcessor(inst, ctx, json2, params);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output) => {
        payload.value = output;
        payload.fallback = true;
        return payload;
      });
    }
    payload.value = output;
    payload.fallback = true;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => optionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => optionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nullableProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
function nullish2(innerType) {
  return optional(nullable(innerType));
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => defaultProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default2(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => prefaultProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nonoptionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
var ZodSuccess = /* @__PURE__ */ $constructor("ZodSuccess", (inst, def) => {
  $ZodSuccess.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => successProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function success(innerType) {
  return new ZodSuccess({
    type: "success",
    innerType
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => catchProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch2(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
var ZodNaN = /* @__PURE__ */ $constructor("ZodNaN", (inst, def) => {
  $ZodNaN.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nanProcessor(inst, ctx, json2, params);
});
function nan(params) {
  return _nan(ZodNaN, params);
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => pipeProcessor(inst, ctx, json2, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
  });
}
var ZodCodec = /* @__PURE__ */ $constructor("ZodCodec", (inst, def) => {
  ZodPipe.init(inst, def);
  $ZodCodec.init(inst, def);
});
function codec(in_, out, params) {
  return new ZodCodec({
    type: "pipe",
    in: in_,
    out,
    transform: params.decode,
    reverseTransform: params.encode
  });
}
function invertCodec(codec2) {
  const def = codec2._zod.def;
  return new ZodCodec({
    type: "pipe",
    in: def.out,
    out: def.in,
    transform: def.reverseTransform,
    reverseTransform: def.transform
  });
}
var ZodPreprocess = /* @__PURE__ */ $constructor("ZodPreprocess", (inst, def) => {
  ZodPipe.init(inst, def);
  $ZodPreprocess.init(inst, def);
});
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => readonlyProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodTemplateLiteral = /* @__PURE__ */ $constructor("ZodTemplateLiteral", (inst, def) => {
  $ZodTemplateLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => templateLiteralProcessor(inst, ctx, json2, params);
});
function templateLiteral(parts, params) {
  return new ZodTemplateLiteral({
    type: "template_literal",
    parts,
    ...normalizeParams(params)
  });
}
var ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def) => {
  $ZodLazy.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => lazyProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
  return new ZodLazy({
    type: "lazy",
    getter
  });
}
var ZodPromise = /* @__PURE__ */ $constructor("ZodPromise", (inst, def) => {
  $ZodPromise.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => promiseProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function promise(innerType) {
  return new ZodPromise({
    type: "promise",
    innerType
  });
}
var ZodFunction = /* @__PURE__ */ $constructor("ZodFunction", (inst, def) => {
  $ZodFunction.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => functionProcessor(inst, ctx, json2, params);
});
function _function(params) {
  return new ZodFunction({
    type: "function",
    input: Array.isArray(params?.input) ? tuple(params?.input) : params?.input ?? array(unknown()),
    output: params?.output ?? unknown()
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => customProcessor(inst, ctx, json2, params);
});
function check(fn) {
  const ch = new $ZodCheck({
    check: "custom"
  });
  ch._zod.check = fn;
  return ch;
}
function custom(fn, _params) {
  return _custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return _superRefine(fn, params);
}
var describe2 = describe;
var meta2 = meta;
function _instanceof(cls, params = {}) {
  const inst = new ZodCustom({
    type: "custom",
    check: "custom",
    fn: (data) => data instanceof cls,
    abort: true,
    ...normalizeParams(params)
  });
  inst._zod.bag.Class = cls;
  inst._zod.check = (payload) => {
    if (!(payload.value instanceof cls)) {
      payload.issues.push({
        code: "invalid_type",
        expected: cls.name,
        input: payload.value,
        inst,
        path: [...inst._zod.def.path ?? []]
      });
    }
  };
  return inst;
}
var stringbool = (...args) => _stringbool({
  Codec: ZodCodec,
  Boolean: ZodBoolean,
  String: ZodString
}, ...args);
function json(params) {
  const jsonSchema = lazy(() => {
    return union([string2(params), number2(), boolean2(), _null3(), array(jsonSchema), record(string2(), jsonSchema)]);
  });
  return jsonSchema;
}
function preprocess(fn, schema) {
  return new ZodPreprocess({
    type: "pipe",
    in: transform(fn),
    out: schema
  });
}
// node_modules/zod/v4/classic/compat.js
var ZodIssueCode = {
  invalid_type: "invalid_type",
  too_big: "too_big",
  too_small: "too_small",
  invalid_format: "invalid_format",
  not_multiple_of: "not_multiple_of",
  unrecognized_keys: "unrecognized_keys",
  invalid_union: "invalid_union",
  invalid_key: "invalid_key",
  invalid_element: "invalid_element",
  invalid_value: "invalid_value",
  custom: "custom"
};
function setErrorMap(map) {
  config({
    customError: map
  });
}
function getErrorMap() {
  return config().customError;
}
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind) {})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
// node_modules/zod/v4/classic/from-json-schema.js
var z = {
  ...exports_schemas2,
  ...exports_checks2,
  iso: exports_iso
};
var RECOGNIZED_KEYS = /* @__PURE__ */ new Set([
  "$schema",
  "$ref",
  "$defs",
  "definitions",
  "$id",
  "id",
  "$comment",
  "$anchor",
  "$vocabulary",
  "$dynamicRef",
  "$dynamicAnchor",
  "type",
  "enum",
  "const",
  "anyOf",
  "oneOf",
  "allOf",
  "not",
  "properties",
  "required",
  "additionalProperties",
  "patternProperties",
  "propertyNames",
  "minProperties",
  "maxProperties",
  "items",
  "prefixItems",
  "additionalItems",
  "minItems",
  "maxItems",
  "uniqueItems",
  "contains",
  "minContains",
  "maxContains",
  "minLength",
  "maxLength",
  "pattern",
  "format",
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  "description",
  "default",
  "contentEncoding",
  "contentMediaType",
  "contentSchema",
  "unevaluatedItems",
  "unevaluatedProperties",
  "if",
  "then",
  "else",
  "dependentSchemas",
  "dependentRequired",
  "nullable",
  "readOnly"
]);
function detectVersion(schema, defaultTarget) {
  const $schema = schema.$schema;
  if ($schema === "https://json-schema.org/draft/2020-12/schema") {
    return "draft-2020-12";
  }
  if ($schema === "http://json-schema.org/draft-07/schema#") {
    return "draft-7";
  }
  if ($schema === "http://json-schema.org/draft-04/schema#") {
    return "draft-4";
  }
  return defaultTarget ?? "draft-2020-12";
}
function resolveRef(ref, ctx) {
  if (!ref.startsWith("#")) {
    throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
  }
  const path = ref.slice(1).split("/").filter(Boolean);
  if (path.length === 0) {
    return ctx.rootSchema;
  }
  const defsKey = ctx.version === "draft-2020-12" ? "$defs" : "definitions";
  if (path[0] === defsKey) {
    const key = path[1];
    if (!key || !ctx.defs[key]) {
      throw new Error(`Reference not found: ${ref}`);
    }
    return ctx.defs[key];
  }
  throw new Error(`Reference not found: ${ref}`);
}
function convertBaseSchema(schema, ctx) {
  if (schema.not !== undefined) {
    if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) {
      return z.never();
    }
    throw new Error("not is not supported in Zod (except { not: {} } for never)");
  }
  if (schema.unevaluatedItems !== undefined) {
    throw new Error("unevaluatedItems is not supported");
  }
  if (schema.unevaluatedProperties !== undefined) {
    throw new Error("unevaluatedProperties is not supported");
  }
  if (schema.if !== undefined || schema.then !== undefined || schema.else !== undefined) {
    throw new Error("Conditional schemas (if/then/else) are not supported");
  }
  if (schema.dependentSchemas !== undefined || schema.dependentRequired !== undefined) {
    throw new Error("dependentSchemas and dependentRequired are not supported");
  }
  if (schema.$ref) {
    const refPath = schema.$ref;
    if (ctx.refs.has(refPath)) {
      return ctx.refs.get(refPath);
    }
    if (ctx.processing.has(refPath)) {
      return z.lazy(() => {
        if (!ctx.refs.has(refPath)) {
          throw new Error(`Circular reference not resolved: ${refPath}`);
        }
        return ctx.refs.get(refPath);
      });
    }
    ctx.processing.add(refPath);
    const resolved = resolveRef(refPath, ctx);
    const zodSchema = convertSchema(resolved, ctx);
    ctx.refs.set(refPath, zodSchema);
    ctx.processing.delete(refPath);
    return zodSchema;
  }
  if (schema.enum !== undefined) {
    const enumValues = schema.enum;
    if (ctx.version === "openapi-3.0" && schema.nullable === true && enumValues.length === 1 && enumValues[0] === null) {
      return z.null();
    }
    if (enumValues.length === 0) {
      return z.never();
    }
    if (enumValues.length === 1) {
      return z.literal(enumValues[0]);
    }
    if (enumValues.every((v) => typeof v === "string")) {
      return z.enum(enumValues);
    }
    const literalSchemas = enumValues.map((v) => z.literal(v));
    if (literalSchemas.length < 2) {
      return literalSchemas[0];
    }
    return z.union([literalSchemas[0], literalSchemas[1], ...literalSchemas.slice(2)]);
  }
  if (schema.const !== undefined) {
    return z.literal(schema.const);
  }
  const type = schema.type;
  if (Array.isArray(type)) {
    const typeSchemas = type.map((t) => {
      const typeSchema = { ...schema, type: t };
      return convertBaseSchema(typeSchema, ctx);
    });
    if (typeSchemas.length === 0) {
      return z.never();
    }
    if (typeSchemas.length === 1) {
      return typeSchemas[0];
    }
    return z.union(typeSchemas);
  }
  if (!type) {
    return z.any();
  }
  let zodSchema;
  switch (type) {
    case "string": {
      let stringSchema = z.string();
      if (schema.format) {
        const format = schema.format;
        if (format === "email") {
          stringSchema = stringSchema.check(z.email());
        } else if (format === "uri" || format === "uri-reference") {
          stringSchema = stringSchema.check(z.url());
        } else if (format === "uuid" || format === "guid") {
          stringSchema = stringSchema.check(z.uuid());
        } else if (format === "date-time") {
          stringSchema = stringSchema.check(z.iso.datetime());
        } else if (format === "date") {
          stringSchema = stringSchema.check(z.iso.date());
        } else if (format === "time") {
          stringSchema = stringSchema.check(z.iso.time());
        } else if (format === "duration") {
          stringSchema = stringSchema.check(z.iso.duration());
        } else if (format === "ipv4") {
          stringSchema = stringSchema.check(z.ipv4());
        } else if (format === "ipv6") {
          stringSchema = stringSchema.check(z.ipv6());
        } else if (format === "mac") {
          stringSchema = stringSchema.check(z.mac());
        } else if (format === "cidr") {
          stringSchema = stringSchema.check(z.cidrv4());
        } else if (format === "cidr-v6") {
          stringSchema = stringSchema.check(z.cidrv6());
        } else if (format === "base64") {
          stringSchema = stringSchema.check(z.base64());
        } else if (format === "base64url") {
          stringSchema = stringSchema.check(z.base64url());
        } else if (format === "e164") {
          stringSchema = stringSchema.check(z.e164());
        } else if (format === "jwt") {
          stringSchema = stringSchema.check(z.jwt());
        } else if (format === "emoji") {
          stringSchema = stringSchema.check(z.emoji());
        } else if (format === "nanoid") {
          stringSchema = stringSchema.check(z.nanoid());
        } else if (format === "cuid") {
          stringSchema = stringSchema.check(z.cuid());
        } else if (format === "cuid2") {
          stringSchema = stringSchema.check(z.cuid2());
        } else if (format === "ulid") {
          stringSchema = stringSchema.check(z.ulid());
        } else if (format === "xid") {
          stringSchema = stringSchema.check(z.xid());
        } else if (format === "ksuid") {
          stringSchema = stringSchema.check(z.ksuid());
        }
      }
      if (typeof schema.minLength === "number") {
        stringSchema = stringSchema.min(schema.minLength);
      }
      if (typeof schema.maxLength === "number") {
        stringSchema = stringSchema.max(schema.maxLength);
      }
      if (schema.pattern) {
        stringSchema = stringSchema.regex(new RegExp(schema.pattern));
      }
      zodSchema = stringSchema;
      break;
    }
    case "number":
    case "integer": {
      let numberSchema = type === "integer" ? z.number().int() : z.number();
      if (typeof schema.minimum === "number") {
        numberSchema = numberSchema.min(schema.minimum);
      }
      if (typeof schema.maximum === "number") {
        numberSchema = numberSchema.max(schema.maximum);
      }
      if (typeof schema.exclusiveMinimum === "number") {
        numberSchema = numberSchema.gt(schema.exclusiveMinimum);
      } else if (schema.exclusiveMinimum === true && typeof schema.minimum === "number") {
        numberSchema = numberSchema.gt(schema.minimum);
      }
      if (typeof schema.exclusiveMaximum === "number") {
        numberSchema = numberSchema.lt(schema.exclusiveMaximum);
      } else if (schema.exclusiveMaximum === true && typeof schema.maximum === "number") {
        numberSchema = numberSchema.lt(schema.maximum);
      }
      if (typeof schema.multipleOf === "number") {
        numberSchema = numberSchema.multipleOf(schema.multipleOf);
      }
      zodSchema = numberSchema;
      break;
    }
    case "boolean": {
      zodSchema = z.boolean();
      break;
    }
    case "null": {
      zodSchema = z.null();
      break;
    }
    case "object": {
      const shape = {};
      const properties = schema.properties || {};
      const requiredSet = new Set(schema.required || []);
      for (const [key, propSchema] of Object.entries(properties)) {
        const propZodSchema = convertSchema(propSchema, ctx);
        shape[key] = requiredSet.has(key) ? propZodSchema : propZodSchema.optional();
      }
      if (schema.propertyNames) {
        const keySchema = convertSchema(schema.propertyNames, ctx);
        const valueSchema = schema.additionalProperties && typeof schema.additionalProperties === "object" ? convertSchema(schema.additionalProperties, ctx) : z.any();
        if (Object.keys(shape).length === 0) {
          zodSchema = z.record(keySchema, valueSchema);
          break;
        }
        const objectSchema = z.object(shape).passthrough();
        const recordSchema = z.looseRecord(keySchema, valueSchema);
        zodSchema = z.intersection(objectSchema, recordSchema);
        break;
      }
      if (schema.patternProperties) {
        const patternProps = schema.patternProperties;
        const patternKeys = Object.keys(patternProps);
        const looseRecords = [];
        for (const pattern of patternKeys) {
          const patternValue = convertSchema(patternProps[pattern], ctx);
          const keySchema = z.string().regex(new RegExp(pattern));
          looseRecords.push(z.looseRecord(keySchema, patternValue));
        }
        const schemasToIntersect = [];
        if (Object.keys(shape).length > 0) {
          schemasToIntersect.push(z.object(shape).passthrough());
        }
        schemasToIntersect.push(...looseRecords);
        if (schemasToIntersect.length === 0) {
          zodSchema = z.object({}).passthrough();
        } else if (schemasToIntersect.length === 1) {
          zodSchema = schemasToIntersect[0];
        } else {
          let result = z.intersection(schemasToIntersect[0], schemasToIntersect[1]);
          for (let i = 2;i < schemasToIntersect.length; i++) {
            result = z.intersection(result, schemasToIntersect[i]);
          }
          zodSchema = result;
        }
        break;
      }
      const objectSchema = z.object(shape);
      if (schema.additionalProperties === false) {
        zodSchema = objectSchema.strict();
      } else if (typeof schema.additionalProperties === "object") {
        zodSchema = objectSchema.catchall(convertSchema(schema.additionalProperties, ctx));
      } else {
        zodSchema = objectSchema.passthrough();
      }
      break;
    }
    case "array": {
      const prefixItems = schema.prefixItems;
      const items = schema.items;
      if (prefixItems && Array.isArray(prefixItems)) {
        const tupleItems = prefixItems.map((item) => convertSchema(item, ctx));
        const rest = items && typeof items === "object" && !Array.isArray(items) ? convertSchema(items, ctx) : undefined;
        if (rest) {
          zodSchema = z.tuple(tupleItems).rest(rest);
        } else {
          zodSchema = z.tuple(tupleItems);
        }
        if (typeof schema.minItems === "number") {
          zodSchema = zodSchema.check(z.minLength(schema.minItems));
        }
        if (typeof schema.maxItems === "number") {
          zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
        }
      } else if (Array.isArray(items)) {
        const tupleItems = items.map((item) => convertSchema(item, ctx));
        const rest = schema.additionalItems && typeof schema.additionalItems === "object" ? convertSchema(schema.additionalItems, ctx) : undefined;
        if (rest) {
          zodSchema = z.tuple(tupleItems).rest(rest);
        } else {
          zodSchema = z.tuple(tupleItems);
        }
        if (typeof schema.minItems === "number") {
          zodSchema = zodSchema.check(z.minLength(schema.minItems));
        }
        if (typeof schema.maxItems === "number") {
          zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
        }
      } else if (items !== undefined) {
        const element = convertSchema(items, ctx);
        let arraySchema = z.array(element);
        if (typeof schema.minItems === "number") {
          arraySchema = arraySchema.min(schema.minItems);
        }
        if (typeof schema.maxItems === "number") {
          arraySchema = arraySchema.max(schema.maxItems);
        }
        zodSchema = arraySchema;
      } else {
        zodSchema = z.array(z.any());
      }
      break;
    }
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
  return zodSchema;
}
function convertSchema(schema, ctx) {
  if (typeof schema === "boolean") {
    return schema ? z.any() : z.never();
  }
  let baseSchema = convertBaseSchema(schema, ctx);
  const hasExplicitType = schema.type || schema.enum !== undefined || schema.const !== undefined;
  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    const options = schema.anyOf.map((s) => convertSchema(s, ctx));
    const anyOfUnion = z.union(options);
    baseSchema = hasExplicitType ? z.intersection(baseSchema, anyOfUnion) : anyOfUnion;
  }
  if (schema.oneOf && Array.isArray(schema.oneOf)) {
    const options = schema.oneOf.map((s) => convertSchema(s, ctx));
    const oneOfUnion = z.xor(options);
    baseSchema = hasExplicitType ? z.intersection(baseSchema, oneOfUnion) : oneOfUnion;
  }
  if (schema.allOf && Array.isArray(schema.allOf)) {
    if (schema.allOf.length === 0) {
      baseSchema = hasExplicitType ? baseSchema : z.any();
    } else {
      let result = hasExplicitType ? baseSchema : convertSchema(schema.allOf[0], ctx);
      const startIdx = hasExplicitType ? 0 : 1;
      for (let i = startIdx;i < schema.allOf.length; i++) {
        result = z.intersection(result, convertSchema(schema.allOf[i], ctx));
      }
      baseSchema = result;
    }
  }
  if (schema.nullable === true && ctx.version === "openapi-3.0") {
    baseSchema = z.nullable(baseSchema);
  }
  if (schema.readOnly === true) {
    baseSchema = z.readonly(baseSchema);
  }
  if (schema.default !== undefined) {
    baseSchema = baseSchema.default(schema.default);
  }
  const extraMeta = {};
  const coreMetadataKeys = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (const key of coreMetadataKeys) {
    if (key in schema) {
      extraMeta[key] = schema[key];
    }
  }
  const contentMetadataKeys = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (const key of contentMetadataKeys) {
    if (key in schema) {
      extraMeta[key] = schema[key];
    }
  }
  for (const key of Object.keys(schema)) {
    if (!RECOGNIZED_KEYS.has(key)) {
      extraMeta[key] = schema[key];
    }
  }
  if (Object.keys(extraMeta).length > 0) {
    ctx.registry.add(baseSchema, extraMeta);
  }
  if (schema.description) {
    baseSchema = baseSchema.describe(schema.description);
  }
  return baseSchema;
}
function fromJSONSchema(schema, params) {
  if (typeof schema === "boolean") {
    return schema ? z.any() : z.never();
  }
  let normalized;
  try {
    normalized = JSON.parse(JSON.stringify(schema));
  } catch {
    throw new Error("fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas");
  }
  const version = detectVersion(normalized, params?.defaultTarget);
  const defs = normalized.$defs || normalized.definitions || {};
  const ctx = {
    version,
    defs,
    refs: new Map,
    processing: new Set,
    rootSchema: normalized,
    registry: params?.registry ?? globalRegistry
  };
  return convertSchema(normalized, ctx);
}
// node_modules/zod/v4/classic/coerce.js
function string3(params) {
  return _coercedString(ZodString, params);
}
function number3(params) {
  return _coercedNumber(ZodNumber, params);
}
function boolean3(params) {
  return _coercedBoolean(ZodBoolean, params);
}
function bigint3(params) {
  return _coercedBigint(ZodBigInt, params);
}
function date4(params) {
  return _coercedDate(ZodDate, params);
}

// node_modules/zod/v4/classic/external.js
config(en_default());
// node_modules/@deepseek-ai/dsh-typert-registry/lib/index.js
function typertKey(packageName, name) {
  return `${packageName}#${name}`;
}
function typertPackageKey(packageName, face) {
  return `${packageName}#${face}`;
}
function typertEndpoint(descriptor) {
  return `${descriptor.namespace}/${descriptor.method}`;
}
var ChangeSource = class {
  report;
  listeners = /* @__PURE__ */ new Set;
  constructor(report) {
    this.report = report;
  }
  subscribe(ctx, listener) {
    const { listeners } = this;
    return ctx.effect(function* () {
      listeners.add(listener);
      yield () => {
        listeners.delete(listener);
      };
    }, "typert registry subscription");
  }
  emit(change) {
    for (const listener of [...this.listeners])
      try {
        listener(change);
      } catch (error) {
        this.report(change, error);
      }
  }
};
var DescriptorStore = class {
  kind;
  entries = /* @__PURE__ */ new Map;
  ids = /* @__PURE__ */ new Map;
  history = /* @__PURE__ */ new Set;
  changes;
  constructor(kind, report) {
    this.kind = kind;
    this.changes = new ChangeSource(report);
  }
  validate(descriptors) {
    const endpoints = /* @__PURE__ */ new Set;
    const ids = /* @__PURE__ */ new Set;
    for (const descriptor of descriptors) {
      validateInvocation(descriptor);
      const endpoint = typertEndpoint(descriptor);
      if (endpoints.has(endpoint) || this.entries.has(endpoint))
        throw new Error(`typert: ${this.kind} endpoint "${endpoint}" is already registered`);
      if (ids.has(descriptor.id) || this.ids.has(descriptor.id))
        throw new Error(`typert: ${this.kind} invocation id "${descriptor.id}" is already registered`);
      endpoints.add(endpoint);
      ids.add(descriptor.id);
    }
  }
  commit(owner, descriptors) {
    for (const descriptor of descriptors) {
      const entry = {
        descriptor,
        owner
      };
      const endpoint = typertEndpoint(descriptor);
      this.entries.set(endpoint, entry);
      this.ids.set(descriptor.id, entry);
      this.history.add(endpoint);
    }
    for (const descriptor of descriptors)
      this.changes.emit({
        kind: this.kind,
        key: typertEndpoint(descriptor)
      });
  }
  withdraw(owner, descriptors) {
    const removed = [];
    for (const descriptor of descriptors) {
      const endpoint = typertEndpoint(descriptor);
      const entry = this.entries.get(endpoint);
      if (entry?.owner !== owner)
        continue;
      this.entries.delete(endpoint);
      if (this.ids.get(descriptor.id) === entry)
        this.ids.delete(descriptor.id);
      removed.push(endpoint);
    }
    for (const endpoint of removed)
      this.changes.emit({
        kind: this.kind,
        key: endpoint
      });
  }
  get(endpoint) {
    return this.entries.get(endpoint)?.descriptor;
  }
  hasSeen(endpoint) {
    return this.history.has(endpoint);
  }
  list() {
    return [...this.entries.values()].map((entry) => entry.descriptor);
  }
  subscribe(ctx, listener) {
    return this.changes.subscribe(ctx, listener);
  }
};
var RemoteStore = class {
  descriptors;
  packages = /* @__PURE__ */ new Map;
  constructor(descriptors) {
    this.descriptors = descriptors;
  }
  view(ctx) {
    return {
      register: (contribution) => this.register(ctx, contribution),
      get: (endpoint) => this.descriptors.get(endpoint),
      list: () => this.descriptors.list(),
      subscribe: (listener) => this.descriptors.subscribe(ctx, listener)
    };
  }
  register(ctx, contribution) {
    validateSegment("Remote package name", contribution.package);
    if (this.packages.has(contribution.package))
      throw new Error(`typert: Remote package "${contribution.package}" is already registered`);
    this.descriptors.validate(contribution.descriptors);
    const owner = {};
    const { packages, descriptors } = this;
    return ctx.effect(function* () {
      packages.set(contribution.package, owner);
      descriptors.commit(owner, contribution.descriptors);
      yield () => {
        if (packages.get(contribution.package) === owner)
          packages.delete(contribution.package);
        descriptors.withdraw(owner, contribution.descriptors);
      };
    }, `typert.remotes.register(${JSON.stringify(contribution.package)})`);
  }
};
var LookupStore = class {
  providers = /* @__PURE__ */ new Map;
  resolvers = /* @__PURE__ */ new Map;
  definitions = /* @__PURE__ */ new Map;
  changes;
  constructor(report) {
    this.changes = new ChangeSource(report);
  }
  view(ctx) {
    return {
      register: (key, provider) => this.register(ctx, key, provider),
      configure: (key, resolver) => this.configure(ctx, key, resolver),
      get: (key) => this.get(key),
      definitions: () => [...this.definitions.values()],
      keys: () => [...this.providers.keys()],
      subscribe: (listener) => this.changes.subscribe(ctx, listener)
    };
  }
  get(key) {
    const provider = this.providers.get(key)?.provider;
    if (provider === undefined)
      return;
    const resolver = this.resolvers.get(key)?.provider;
    if (resolver === undefined)
      return provider;
    return {
      parameter: provider.parameter,
      wire: provider.wire,
      ...provider.resource === undefined ? {} : { resource: provider.resource },
      hostTypeSymbol: provider.hostTypeSymbol,
      wireTypeSymbol: provider.wireTypeSymbol,
      resolve: (id) => resolver.resolve(id)
    };
  }
  configure(ctx, key, resolver) {
    validateSegment("lookup key", key);
    if (this.resolvers.has(key))
      throw new Error(`typert: lookup "${key}" resolver is already configured`);
    const entry = {
      provider: { resolve: async (id) => resolver(id) },
      owner: {}
    };
    const { resolvers, changes } = this;
    return ctx.effect(function* () {
      resolvers.set(key, entry);
      changes.emit({
        kind: "lookup",
        key
      });
      yield () => {
        if (resolvers.get(key) !== entry)
          return;
        resolvers.delete(key);
        changes.emit({
          kind: "lookup",
          key
        });
      };
    }, `typert.lookups.configure(${JSON.stringify(key)})`);
  }
  register(ctx, key, provider) {
    validateSegment("lookup key", key);
    validateSegment("lookup parameter", provider.parameter);
    validateWireName("lookup wire field", provider.wire);
    validateNonempty("lookup Host type symbol", provider.hostTypeSymbol);
    validateNonempty("lookup wire type symbol", provider.wireTypeSymbol);
    if (this.providers.has(key))
      throw new Error(`typert: lookup "${key}" is already registered`);
    const definition = {
      key,
      parameter: provider.parameter,
      wire: provider.wire,
      hostTypeSymbol: provider.hostTypeSymbol,
      wireTypeSymbol: provider.wireTypeSymbol
    };
    const known = this.definitions.get(key);
    if (known !== undefined && !lookupDefinitionEquals(known, definition))
      throw new Error(`typert: lookup "${key}" changed its wire declaration during this registry lifetime`);
    const entry = {
      provider,
      owner: {}
    };
    const { definitions, providers, changes } = this;
    return ctx.effect(function* () {
      definitions.set(key, definition);
      providers.set(key, entry);
      changes.emit({
        kind: "lookup",
        key
      });
      yield () => {
        if (providers.get(key) !== entry)
          return;
        providers.delete(key);
        changes.emit({
          kind: "lookup",
          key
        });
      };
    }, `typert.lookups.register(${JSON.stringify(key)})`);
  }
};
function lookupDefinitionEquals(left, right) {
  return left.parameter === right.parameter && left.wire === right.wire && left.hostTypeSymbol === right.hostTypeSymbol && left.wireTypeSymbol === right.wireTypeSymbol;
}
var ContextStore = class {
  hosts = /* @__PURE__ */ new Map;
  hostResolvers = /* @__PURE__ */ new Map;
  clients = /* @__PURE__ */ new Map;
  changes;
  constructor(report) {
    this.changes = new ChangeSource(report);
  }
  view(ctx) {
    return {
      registerHost: (key, adapter) => this.registerHost(ctx, key, adapter),
      configureHost: (key, resolver) => this.configureHost(ctx, key, resolver),
      registerClient: (key, adapter) => this.registerClient(ctx, key, adapter),
      getHost: (key) => this.getHost(key),
      getClient: (key) => this.clients.get(key)?.provider,
      subscribe: (listener) => this.changes.subscribe(ctx, listener)
    };
  }
  getHost(key) {
    const adapter = this.hosts.get(key)?.provider;
    if (adapter === undefined)
      return;
    const resolver = this.hostResolvers.get(key)?.provider;
    if (resolver === undefined)
      return adapter;
    return {
      wire: adapter.wire,
      wireTypeSymbol: adapter.wireTypeSymbol,
      ...adapter.resource === undefined ? {} : { resource: adapter.resource },
      resolve: (id) => resolver.resolve(id)
    };
  }
  configureHost(ctx, key, resolver) {
    validateSegment("Context key", key);
    if (this.hostResolvers.has(key))
      throw new Error(`typert: host-context "${key}" resolver is already configured`);
    const entry = {
      provider: { resolve: async (id) => resolver(id) },
      owner: {}
    };
    const { hostResolvers, changes } = this;
    return ctx.effect(function* () {
      hostResolvers.set(key, entry);
      changes.emit({
        kind: "host-context",
        key
      });
      yield () => {
        if (hostResolvers.get(key) !== entry)
          return;
        hostResolvers.delete(key);
        changes.emit({
          kind: "host-context",
          key
        });
      };
    }, `typert.contexts.configureHost(${JSON.stringify(key)})`);
  }
  registerHost(ctx, key, adapter) {
    validateSegment("Context key", key);
    validateWireName("Context wire field", adapter.wire);
    validateNonempty("Context wire type symbol", adapter.wireTypeSymbol);
    return this.registerProvider(ctx, this.hosts, "host-context", key, adapter);
  }
  registerClient(ctx, key, adapter) {
    validateSegment("Context key", key);
    return this.registerProvider(ctx, this.clients, "client-context", key, adapter);
  }
  registerProvider(ctx, table, kind, key, provider) {
    if (table.has(key))
      throw new Error(`typert: ${kind} provider "${key}" is already registered`);
    const entry = {
      provider,
      owner: {}
    };
    const { changes } = this;
    return ctx.effect(function* () {
      table.set(key, entry);
      changes.emit({
        kind,
        key
      });
      yield () => {
        if (table.get(key) !== entry)
          return;
        table.delete(key);
        changes.emit({
          kind,
          key
        });
      };
    }, `typert.contexts.register(${JSON.stringify(key)})`);
  }
};
var GLOBAL_RESOURCE_KIND = "global";
var ResourceStore = class {
  declarations = /* @__PURE__ */ new Map;
  changes;
  constructor(report) {
    this.changes = new ChangeSource(report);
  }
  view(ctx) {
    return {
      register: (kind, declaration) => this.register(ctx, kind, declaration),
      get: (kind) => this.declarations.get(kind)?.provider,
      entries: () => [...this.declarations].map(([kind, entry]) => Object.freeze({
        kind,
        field: entry.provider.field
      })),
      subscribe: (listener) => this.changes.subscribe(ctx, listener)
    };
  }
  register(ctx, kind, declaration) {
    validateSegment("resource kind", kind);
    if (kind === GLOBAL_RESOURCE_KIND)
      throw new Error(`typert: resource kind "${GLOBAL_RESOURCE_KIND}" is reserved for the built-in global resource`);
    validateWireName("resource field", declaration.field);
    if (this.declarations.has(kind))
      throw new Error(`typert: resource kind "${kind}" is already registered`);
    const entry = {
      provider: { field: declaration.field },
      owner: {}
    };
    const { declarations, changes } = this;
    return ctx.effect(function* () {
      declarations.set(kind, entry);
      changes.emit({
        kind: "resource",
        key: kind
      });
      yield () => {
        if (declarations.get(kind) !== entry)
          return;
        declarations.delete(kind);
        changes.emit({
          kind: "resource",
          key: kind
        });
      };
    }, `typert.resources.register(${JSON.stringify(kind)})`);
  }
};
var TypertRegistry = class extends Service {
  schemas = /* @__PURE__ */ new Map;
  packages = /* @__PURE__ */ new Map;
  localStore;
  remoteStore;
  lookupStore;
  contextStore;
  resourceStore;
  constructor(ctx) {
    super(ctx, "typert");
    const report = (change, error) => {
      ctx.logger.warn(`typert: ${change.kind} observer for "${change.key}" failed`);
      ctx.logger.warn(error);
    };
    this.localStore = new DescriptorStore("local", report);
    this.remoteStore = new RemoteStore(new DescriptorStore("remote", report));
    this.lookupStore = new LookupStore(report);
    this.contextStore = new ContextStore(report);
    this.resourceStore = new ResourceStore(report);
  }
  get local() {
    const ctx = this.ctx;
    return {
      get: (endpoint) => this.localStore.get(endpoint),
      hasSeen: (endpoint) => this.localStore.hasSeen(endpoint),
      list: () => this.localStore.list(),
      subscribe: (listener) => this.localStore.subscribe(ctx, listener)
    };
  }
  get remotes() {
    return this.remoteStore.view(this.ctx);
  }
  get lookups() {
    return this.lookupStore.view(this.ctx);
  }
  get contexts() {
    return this.contextStore.view(this.ctx);
  }
  get resources() {
    return this.resourceStore.view(this.ctx);
  }
  register(contribution) {
    const packageRecord = this.validatePackage(contribution);
    const schemaRecords = this.validateSchemas(contribution);
    const invocations = contribution.invocations;
    this.localStore.validate(invocations);
    const owner = {};
    const { schemas, packages, localStore } = this;
    return this.ctx.effect(function* () {
      packages.set(packageRecord.key, packageRecord);
      for (const record of schemaRecords)
        schemas.set(record.key, record);
      localStore.commit(owner, invocations);
      yield () => {
        if (packages.get(packageRecord.key) === packageRecord)
          packages.delete(packageRecord.key);
        for (const record of schemaRecords)
          if (schemas.get(record.key) === record)
            schemas.delete(record.key);
        localStore.withdraw(owner, invocations);
      };
    }, "typert.register()");
  }
  get(key) {
    const record = this.schemas.get(key);
    return record === undefined ? undefined : materializeSchema(record);
  }
  resolve(key) {
    const record = this.schemas.get(key);
    if (record !== undefined)
      return materializeSchema(record);
    const hash = key.indexOf("#");
    if (hash <= 0 || hash === key.length - 1)
      throw new Error(`typert: invalid schema key "${key}" — expected "<package>#<name>"`);
    const packageName = key.slice(0, hash);
    if ([...this.packages.values()].some((candidate) => candidate.package === packageName))
      throw new Error(`typert: cannot resolve "${key}" — package "${packageName}" is registered but contributes no schema named "${key.slice(hash + 1)}"`);
    throw new Error(`typert: cannot resolve "${key}" — package "${packageName}" has no registered contribution`);
  }
  list(filter = {}) {
    return [...this.schemas.values()].filter((record) => matches(record, filter)).map(materializeSchema);
  }
  getPackage(packageName, face = "host") {
    return this.packages.get(typertPackageKey(packageName, face));
  }
  listPackages(filter = {}) {
    return [...this.packages.values()].filter((record) => matches(record, filter));
  }
  toJSONSchema(key, params) {
    return toJSONSchema(this.resolve(key).schema, params);
  }
  validatePackage(contribution) {
    validateSegment("package name", contribution.package);
    const face = contribution.face;
    if (face !== "host" && face !== "client")
      throw new Error(`typert: invalid face ${JSON.stringify(face)} — expected "host" or "client"`);
    const key = typertPackageKey(contribution.package, contribution.face);
    if (this.packages.has(key))
      throw new Error(`typert: package face "${key}" is already registered`);
    return {
      package: contribution.package,
      face,
      key,
      model: contribution.model
    };
  }
  validateSchemas(contribution) {
    const records = [];
    const batch = /* @__PURE__ */ new Set;
    for (const schema of contribution.schemas) {
      validateSegment("schema name", schema.name);
      if (typeof schema.create !== "function")
        throw new Error(`typert: schema "${schema.name}" has no create() factory`);
      const key = typertKey(contribution.package, schema.name);
      if (batch.has(key) || this.schemas.has(key))
        throw new Error(`typert: schema "${key}" is already registered`);
      batch.add(key);
      records.push({
        ...schema,
        package: contribution.package,
        face: contribution.face,
        key
      });
    }
    return records;
  }
};
function materializeSchema(record) {
  const schema = record.value ??= record.create();
  return {
    name: record.name,
    schema,
    package: record.package,
    face: record.face,
    key: record.key
  };
}
function matches(record, filter) {
  return (filter.package === undefined || record.package === filter.package) && (filter.face === undefined || record.face === filter.face);
}
function validateInvocation(descriptor) {
  validateNonempty("invocation id", descriptor.id);
  validateSegment("invocation service key", descriptor.service);
  validateWireName("invocation namespace", descriptor.namespace);
  validateWireName("invocation method", descriptor.method);
  if (descriptor.implementation !== undefined)
    validateWireName("invocation implementation method", descriptor.implementation);
  validateCodec(descriptor.result, `${descriptor.id} result`);
  const wires = /* @__PURE__ */ new Set;
  for (const parameter of descriptor.parameters) {
    validateWireName("parameter name", parameter.name);
    validateWireName("parameter wire field", parameter.wire);
    if (wires.has(parameter.wire))
      throw new Error(`typert: invocation "${descriptor.id}" repeats wire field "${parameter.wire}"`);
    wires.add(parameter.wire);
    if (parameter.source === "lookup") {
      if (parameter.acceptsUndefined !== undefined)
        throw new Error(`typert: invocation "${descriptor.id}" lookup parameter "${parameter.name}" cannot accept undefined`);
      if (parameter.lookup === undefined)
        throw new Error(`typert: invocation "${descriptor.id}" lookup parameter "${parameter.name}" has no lookup key`);
      validateSegment("lookup key", parameter.lookup);
    } else if (parameter.lookup !== undefined)
      throw new Error(`typert: invocation "${descriptor.id}" JSON parameter "${parameter.name}" declares a lookup key`);
    validateCodec(parameter.codec, `${descriptor.id} parameter ${parameter.name}`);
  }
  const cancellation = descriptor.cancellation;
  if (cancellation !== undefined && cancellation.parameter !== "signal")
    throw new Error(`typert: invocation "${descriptor.id}" cancellation parameter must be "signal"`);
  const mode = descriptor.mode;
  if (mode !== undefined && mode !== "stream")
    throw new Error(`typert: invocation "${descriptor.id}" mode must be "stream"`);
  if (descriptor.uplink !== undefined)
    validateCodec(descriptor.uplink.codec, `${descriptor.id} uplink`);
  if (descriptor.scope !== undefined) {
    if (descriptor.invocation.kind !== "direct")
      throw new Error(`typert: invocation "${descriptor.id}" Context receiver cannot declare a direct scope projection`);
    validateSegment("scope Context key", descriptor.scope.context);
    validateWireName("scope wire field", descriptor.scope.wire);
    const lookups = descriptor.parameters.filter((candidate) => candidate.source === "lookup");
    const parameter = lookups.length === 1 ? lookups[0] : undefined;
    if (parameter === undefined || parameter.wire !== descriptor.scope.wire || parameter.lookup !== descriptor.scope.context)
      throw new Error(`typert: invocation "${descriptor.id}" scope wire "${descriptor.scope.wire}" must select its only lookup parameter`);
  }
  if (descriptor.invocation.kind === "context") {
    validateSegment("Context key", descriptor.invocation.context);
    validateWireName("Context wire field", descriptor.invocation.wire);
    if (wires.has(descriptor.invocation.wire))
      throw new Error(`typert: invocation "${descriptor.id}" repeats wire field "${descriptor.invocation.wire}"`);
    validateCodec(descriptor.invocation.codec, `${descriptor.id} Context`);
  }
}
function validateCodec(codec, subject) {
  if (codec.mode === "src-json")
    return;
  validateNonempty(`${subject} type symbol`, codec.typeSymbol);
  if (typeof codec.create !== "function")
    throw new Error(`typert: ${subject} strict codec has no create() factory`);
}
function validateWireName(subject, value) {
  if (value === "." || value === ".." || !/^[A-Za-z0-9_$.-]+$/.test(value))
    throw new Error(`typert: invalid ${subject} "${value}" — must contain only RPC endpoint segment characters`);
}
function validateSegment(subject, value) {
  if (value.length === 0 || value.includes("#"))
    throw new Error(`typert: invalid ${subject} "${value}" — must be nonempty and must not contain "#"`);
}
function validateNonempty(subject, value) {
  if (value.length === 0)
    throw new Error(`typert: invalid ${subject} — must be nonempty`);
}
// node_modules/@deepseek-ai/dsh-typert-protocol/lib/index.js
var RemoteError = class extends Error {
  code;
  details;
  isDSHRemoteError = true;
  constructor(code, message, details, options) {
    super(message, options);
    this.code = code;
    this.details = details;
    this.name = "RemoteError";
  }
};
function remoteErrorOf(value) {
  if (typeof value === "object" && value !== null && value.isDSHRemoteError === true && typeof value.code === "string")
    return value;
}
var TYPERT_OWNED_VALUE = Symbol.for("dsh.typert.owned-value");
function isTypertOwnedValue(value) {
  return typeof value === "object" && value !== null && TYPERT_OWNED_VALUE in value && value[TYPERT_OWNED_VALUE] === true;
}
function isRemoteJsonValue(value) {
  return visitJsonValue(value, /* @__PURE__ */ new Set);
}
function isRemoteUplinkItem(value) {
  return value === undefined || isRemoteJsonValue(value);
}
function visitJsonValue(value, ancestors) {
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return true;
  if (typeof value === "number")
    return Number.isFinite(value) && !Object.is(value, -0);
  if (typeof value !== "object")
    return false;
  if (ancestors.has(value))
    return false;
  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      if (Object.getPrototypeOf(value) !== Array.prototype || Reflect.ownKeys(value).length !== value.length + 1)
        return false;
      for (let index = 0;index < value.length; index++)
        if (!Object.hasOwn(value, index) || !visitJsonValue(value[index], ancestors))
          return false;
      return true;
    }
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null)
      return false;
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== "string")
        return false;
      if (Object.getOwnPropertyDescriptor(value, key)?.enumerable !== true || !visitJsonValue(Reflect.get(value, key), ancestors))
        return false;
    }
    return true;
  } finally {
    ancestors.delete(value);
  }
}
var REMOTE_OPTION_KEYS = new Set([
  "name",
  "mode",
  "resources"
]);
var REMOTE_SCOPE_OPTION_KEYS = new Set(["name", "resources"]);

// node_modules/@deepseek-ai/dsh-deque/lib/index.js
var MIN_CAPACITY = 16;
var Deque = class {
  buffer = new Array(MIN_CAPACITY);
  head = 0;
  count = 0;
  get size() {
    return this.count;
  }
  pushBack(value) {
    this.ensureCapacity();
    const tail = this.head + this.count;
    this.buffer[tail < this.buffer.length ? tail : tail - this.buffer.length] = value;
    this.count += 1;
  }
  pushFront(value) {
    this.ensureCapacity();
    this.head = this.head === 0 ? this.buffer.length - 1 : this.head - 1;
    this.buffer[this.head] = value;
    this.count += 1;
  }
  popFront() {
    if (this.count === 0)
      return;
    const value = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head += 1;
    if (this.head === this.buffer.length)
      this.head = 0;
    this.count -= 1;
    this.compact();
    return value;
  }
  clear() {
    this.buffer = new Array(MIN_CAPACITY);
    this.head = 0;
    this.count = 0;
  }
  ensureCapacity() {
    if (this.count < this.buffer.length)
      return;
    this.resize(this.buffer.length * 2);
  }
  compact() {
    if (this.count === 0) {
      this.head = 0;
      return;
    }
    if (this.buffer.length > MIN_CAPACITY && this.count <= this.buffer.length / 4)
      this.resize(Math.max(MIN_CAPACITY, this.buffer.length / 2));
  }
  resize(capacity) {
    const next = new Array(capacity);
    let source = this.head;
    for (let index = 0;index < this.count; index += 1) {
      next[index] = this.buffer[source];
      source += 1;
      if (source === this.buffer.length)
        source = 0;
    }
    this.buffer = next;
    this.head = 0;
  }
};

// node_modules/@deepseek-ai/dsh-api-gateway/lib/client.node.js
var REMOTE_STREAM_MUX_PATH = "/api/remote.mux";
var REMOTE_EVENT_STREAM_ENDPOINT = "$events";
var REMOTE_EVENT_RESULT_ENDPOINT = "$events/result";
var REMOTE_EVENT_STREAM_PAYLOAD = { args: {} };
function projectRemoteEventRejection(reason) {
  const record = typeof reason === "object" && reason !== null ? reason : undefined;
  const name = stringProperty(record, "name") ?? "Error";
  const message = stringProperty(record, "message") ?? String(reason);
  const code = stringProperty(record, "code");
  const details = record === undefined ? undefined : Reflect.get(record, "details");
  return {
    name,
    message,
    ...code === undefined ? {} : { code },
    ...details === undefined || !isRemoteJsonValue(details) ? {} : { details }
  };
}
function isRemoteEventId(value) {
  return typeof value === "string" && value.length > 0;
}
function isRemoteEventClientId(value) {
  return typeof value === "string" && value.length > 0;
}
function isRemoteEventAgentId(value) {
  return typeof value === "string" && value.length > 0;
}
function parseRemoteStreamServerMessage(text) {
  return parseMessage(text, (value) => {
    if (value.type === "item" && (exactKeys(value, ["type", "streamId"]) || exactKeys(value, [
      "type",
      "streamId",
      "value"
    ])) && validId(value.streamId))
      return value;
    if (value.type === "end" && exactKeys(value, ["type", "streamId"]) && validId(value.streamId))
      return value;
    if (value.type === "error" && exactKeys(value, [
      "type",
      "streamId",
      "error"
    ]) && validId(value.streamId) && isRecord2(value.error) && exactKeys(value.error, [
      "code",
      "message",
      "details"
    ]) && typeof value.error.code === "string" && typeof value.error.message === "string" && isRecord2(value.error.details))
      return value;
    throw new Error("api gateway: invalid Remote stream server message");
  });
}
function parseMessage(text, validate) {
  let decoded;
  try {
    decoded = JSON.parse(text);
  } catch (cause) {
    throw new Error("api gateway: Remote stream message is not JSON", { cause });
  }
  if (!isRecord2(decoded))
    throw new Error("api gateway: Remote stream message must be an object");
  return validate(decoded);
}
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function exactKeys(value, expected) {
  return Reflect.ownKeys(value).length === expected.length && expected.every((key) => Object.hasOwn(value, key));
}
function validId(value) {
  return typeof value === "string" && value.length > 0;
}
function stringProperty(value, key) {
  if (value === undefined)
    return;
  const candidate = Reflect.get(value, key);
  return typeof candidate === "string" ? candidate : undefined;
}
function randomUUID() {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes, (byte, index) => {
    return (index === 6 ? byte & 15 | 64 : index === 8 ? byte & 63 | 128 : byte).toString(16).padStart(2, "0");
  }).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
var RemoteStreamCarrierError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "RemoteStreamCarrierError";
  }
};
var UPLINK_DONE = {
  value: undefined,
  done: true
};
var RemoteStreamMuxClient = class {
  openSocket;
  waitForReconnect;
  socket;
  cancelCandidate;
  keepAlive;
  revision = 0;
  streams = /* @__PURE__ */ new Map;
  waiters = /* @__PURE__ */ new Set;
  socketClosures = /* @__PURE__ */ new Set;
  running = false;
  disposed = false;
  failure;
  constructor(openSocket = () => new WebSocket(remoteStreamUrl()), waitForReconnect = false) {
    this.openSocket = openSocket;
    this.waitForReconnect = waitForReconnect;
  }
  start() {
    if (this.disposed)
      return;
    this.running = true;
    if (this.socket?.readyState === 1)
      return;
    const pending = this.keepAlive;
    if (pending === undefined)
      this.maintain();
    else
      pending.then(() => {
        this.maintain();
      });
  }
  reconnect() {
    if (!this.running || this.disposed)
      return;
    const failure = new RemoteStreamCarrierError("api gateway: Remote stream reconnect requested");
    const pending = this.keepAlive;
    this.revision++;
    this.failure = undefined;
    this.cancelCandidate?.(failure);
    const socket = this.socket;
    if (socket !== undefined) {
      this.socket = undefined;
      this.failAll(failure);
      socket.close(4000, "reconnect requested");
    }
    if (pending === undefined)
      this.maintain();
    else
      pending.then(() => {
        this.maintain();
      });
  }
  async* open(endpoint, payload, signal, uplink) {
    signal.throwIfAborted();
    const streamId = randomUUID();
    const inbox = new StreamInbox;
    const stream = {
      inbox,
      pump: undefined
    };
    let carrier;
    let opened = false;
    let terminal = false;
    const abort = () => {
      inbox.fail(signal.reason);
    };
    signal.addEventListener("abort", abort, { once: true });
    try {
      const socket = await this.waitForSocket(signal);
      signal.throwIfAborted();
      carrier = socket;
      this.streams.set(streamId, stream);
      this.send(socket, {
        type: "open",
        streamId,
        endpoint,
        payload
      });
      opened = true;
      if (uplink !== undefined)
        stream.pump = this.pumpUplink(socket, streamId, uplink, signal, inbox);
      while (true) {
        const frame = await inbox.next();
        signal.throwIfAborted();
        if (frame.type === "item") {
          yield frame.value;
          continue;
        }
        terminal = true;
        if (frame.type === "error")
          throw new RemoteError(frame.error.code, frame.error.message, frame.error.details);
        return;
      }
    } finally {
      signal.removeEventListener("abort", abort);
      this.streams.delete(streamId);
      stream.pump?.stop();
      if (opened && !terminal && carrier?.readyState === 1)
        this.send(carrier, {
          type: "cancel",
          streamId
        });
      if (stream.pump !== undefined)
        await stream.pump.done;
    }
  }
  pumpUplink(socket, streamId, uplink, signal, inbox) {
    let stopped;
    const interruption = {
      value: undefined,
      done: true
    };
    const uplinkIterator = uplink[Symbol.asyncIterator]();
    const state = {
      stopping: false,
      exhausted: false,
      released: false
    };
    const release = () => {
      if (state.released || state.exhausted)
        return;
      state.released = true;
      if (uplink instanceof ClientUplinkQueue)
        uplink.close();
      Promise.resolve().then(() => uplinkIterator.return?.()).catch(() => {
        return;
      });
    };
    return {
      done: (async () => {
        try {
          while (true) {
            if (state.stopping)
              return;
            stopped = Promise.withResolvers();
            const next = await Promise.race([uplinkIterator.next(), stopped.promise]);
            stopped = undefined;
            if (state.stopping || next === interruption || signal.aborted || this.socket !== socket)
              return;
            if (next.done === true) {
              state.exhausted = true;
              break;
            }
            this.send(socket, {
              type: "item",
              streamId,
              value: next.value
            });
          }
          this.send(socket, {
            type: "end",
            streamId
          });
        } catch (error) {
          inbox.fail(error);
        } finally {
          stopped = undefined;
          release();
        }
      })(),
      stop: () => {
        if (state.stopping)
          return;
        state.stopping = true;
        stopped?.resolve(interruption);
        release();
      }
    };
  }
  async close() {
    if (!this.disposed) {
      this.disposed = true;
      this.running = false;
      const error = /* @__PURE__ */ new Error("api gateway: Remote stream client disposed");
      this.failAll(error);
      for (const waiter of [...this.waiters])
        waiter.reject(error);
      this.cancelCandidate?.(error);
      const socket = this.socket;
      this.socket = undefined;
      socket?.close(1000, "disposed");
    }
    await this.keepAlive;
    await Promise.all(this.socketClosures);
  }
  async connect() {
    const socket = this.openSocket(REMOTE_STREAM_MUX_PATH);
    const closed = new Promise((resolve) => {
      socket.addEventListener("close", () => {
        resolve();
      }, { once: true });
    });
    this.socketClosures.add(closed);
    closed.then(() => {
      this.socketClosures.delete(closed);
    });
    return new Promise((resolve, reject) => {
      let settled = false;
      const rejectCandidate = (error) => {
        settled = true;
        socket.removeEventListener("open", opened);
        socket.removeEventListener("message", received);
        this.cancelCandidate = undefined;
        if (socket.readyState < 2)
          socket.close();
        reject(error);
      };
      const opened = () => {
        settled = true;
        this.cancelCandidate = undefined;
        this.socket = socket;
        for (const waiter of [...this.waiters])
          waiter.resolve(socket);
        resolve(socket);
      };
      const failed = () => {
        if (!settled) {
          rejectCandidate(new RemoteStreamCarrierError("api gateway: Remote stream WebSocket failed to open"));
          return;
        }
        const error = new RemoteStreamCarrierError("api gateway: Remote stream WebSocket failed");
        this.lost(socket, error);
        if (socket.readyState < 2)
          socket.close();
      };
      const closed = () => {
        socket.removeEventListener("open", opened);
        socket.removeEventListener("error", failed);
        socket.removeEventListener("message", received);
        if (!settled) {
          rejectCandidate(new RemoteStreamCarrierError("api gateway: Remote stream WebSocket closed before opening"));
          return;
        }
        this.lost(socket);
      };
      const received = (event) => {
        this.receive(socket, event.data);
      };
      this.cancelCandidate = rejectCandidate;
      socket.addEventListener("open", opened, { once: true });
      socket.addEventListener("error", failed);
      socket.addEventListener("message", received);
      socket.addEventListener("close", closed, { once: true });
    });
  }
  waitForSocket(signal) {
    signal.throwIfAborted();
    if (this.socket?.readyState === 1)
      return Promise.resolve(this.socket);
    if (this.disposed)
      return Promise.reject(/* @__PURE__ */ new Error("api gateway: Remote stream client disposed"));
    if (!this.running)
      return Promise.reject(/* @__PURE__ */ new Error("api gateway: Remote stream client not started"));
    if (this.failure !== undefined)
      return Promise.reject(this.failure);
    return new Promise((resolve, reject) => {
      const aborted = () => {
        waiter.reject(signal.reason);
      };
      const cleanup = () => {
        this.waiters.delete(waiter);
        signal.removeEventListener("abort", aborted);
      };
      const waiter = {
        revision: this.revision,
        resolve: (socket) => {
          cleanup();
          resolve(socket);
        },
        reject: (error) => {
          cleanup();
          reject(error);
        }
      };
      this.waiters.add(waiter);
      signal.addEventListener("abort", aborted, { once: true });
    });
  }
  receive(socket, data) {
    if (socket !== this.socket)
      return;
    try {
      if (typeof data !== "string")
        throw new Error("api gateway: Remote stream WebSocket requires text messages");
      const frame = parseRemoteStreamServerMessage(data);
      const stream = this.streams.get(frame.streamId);
      if (stream === undefined)
        return;
      stream.inbox.push(frame);
      if (frame.type !== "item")
        stream.pump?.stop();
    } catch (error) {
      const failure = new RemoteStreamCarrierError("api gateway: invalid Remote stream frame", { cause: error });
      this.failAll(failure);
      this.lost(socket, failure);
      socket.close(4002, "invalid Remote stream frame");
    }
  }
  lost(socket, error = new RemoteStreamCarrierError("api gateway: Remote stream WebSocket closed")) {
    if (this.socket !== socket)
      return;
    this.socket = undefined;
    if (!this.waitForReconnect)
      this.failure = error;
    this.failAll(error);
    if (!this.waitForReconnect)
      for (const waiter of [...this.waiters])
        waiter.reject(error);
  }
  maintain() {
    if (!this.running || this.disposed)
      return;
    if (this.socket?.readyState === 1 || this.keepAlive !== undefined)
      return;
    const revision = this.revision;
    this.failure = undefined;
    const task = this.connect().then(() => {
      return;
    }, (error) => {
      if (!this.running)
        return;
      const failure = error instanceof RemoteStreamCarrierError ? error : new RemoteStreamCarrierError("api gateway: Remote stream WebSocket failed to open", { cause: error });
      if (this.revision === revision)
        this.failure = failure;
      for (const waiter of [...this.waiters])
        if (waiter.revision <= revision)
          waiter.reject(failure);
    });
    this.keepAlive = task;
    task.then(() => {
      this.keepAlive = undefined;
    });
  }
  failAll(error) {
    for (const stream of this.streams.values()) {
      stream.inbox.fail(error);
      stream.pump?.stop();
    }
  }
  send(socket, message) {
    socket.send(JSON.stringify(message));
  }
};
var StreamInbox = class {
  frames = new Deque;
  wake;
  failure;
  push(frame) {
    if (this.failure !== undefined)
      return;
    this.frames.pushBack(frame);
    this.wake?.();
    this.wake = undefined;
  }
  fail(error) {
    if (this.failure !== undefined)
      return;
    this.failure = error instanceof Error ? error : new Error(String(error), { cause: error });
    this.frames.clear();
    this.wake?.();
    this.wake = undefined;
  }
  async next() {
    while (this.frames.size === 0) {
      if (this.failure !== undefined)
        throw this.failure;
      await new Promise((resolve) => {
        this.wake = resolve;
      });
    }
    return this.frames.popFront();
  }
};
var ClientUplinkQueue = class {
  endpoint;
  items = new Deque;
  ended = false;
  closed = false;
  wake;
  constructor(endpoint) {
    this.endpoint = endpoint;
  }
  push(item) {
    if (this.closed)
      throw new Error(`client api: ${this.endpoint} stream has terminated`);
    if (this.ended)
      throw new Error(`client api: ${this.endpoint} uplink was ended`);
    this.items.pushBack(item);
    this.signal();
  }
  end() {
    if (this.ended || this.closed)
      return;
    this.ended = true;
    this.signal();
  }
  close() {
    if (this.closed)
      return;
    this.closed = true;
    this.items.clear();
    this.signal();
  }
  [Symbol.asyncIterator]() {
    return this;
  }
  async next() {
    while (true) {
      if (this.closed)
        return UPLINK_DONE;
      if (this.items.size > 0)
        return {
          value: this.items.popFront(),
          done: false
        };
      if (this.ended)
        return UPLINK_DONE;
      if (this.wake !== undefined)
        throw new Error(`client api: ${this.endpoint} uplink has one pending read`);
      await new Promise((resolve) => {
        this.wake = resolve;
      });
    }
  }
  return() {
    this.close();
    return Promise.resolve(UPLINK_DONE);
  }
  signal() {
    const wake = this.wake;
    this.wake = undefined;
    wake?.();
  }
};
function remoteStreamUrl() {
  const globals = globalThis;
  const url = new URL(REMOTE_STREAM_MUX_PATH.slice(1), globals.__DSH_TRANSPORT__?.streamBaseUrl ?? document.baseURI);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.href;
}
var REMOTE_EVENT_NEXT = Symbol("api-gateway.remote-event.next");
var ClientRemoteEvents = class {
  ownerCtx;
  connection;
  openStream;
  eventPrefix = `internal/api-gateway/remote-event/${randomUUID()}/`;
  unregisterGeneration;
  activeGeneration;
  constructor(ownerCtx, connection, openStream) {
    this.ownerCtx = ownerCtx;
    this.connection = connection;
    this.openStream = openStream;
    this.unregisterGeneration = connection.registerGenerationSource(this.runGeneration);
  }
  subscribe(callerCtx, event, listener) {
    const dispose = privateEvents(callerCtx).on(this.eventKey(event), listener);
    return () => {
      dispose();
    };
  }
  async dispose() {
    this.unregisterGeneration();
    await Promise.allSettled([this.activeGeneration]);
  }
  runGeneration = (signal, ready) => {
    const tracked = this.pumpEvents(signal, ready).finally(() => {
      if (this.activeGeneration === tracked)
        this.activeGeneration = undefined;
    });
    this.activeGeneration = tracked;
    return tracked;
  };
  deliver(frame) {
    privateEvents(this.ownerCtx).parallel(this.eventKey(frame.event), ...frame.args).catch((error) => {
      this.reportError(frame.event, error);
    });
  }
  async pumpEvents(signal, ready) {
    let clientId;
    const failed = new AbortController;
    const generationSignal = AbortSignal.any([signal, failed.signal]);
    const active = /* @__PURE__ */ new Map;
    const tasks = /* @__PURE__ */ new Set;
    const source = this.openStream(REMOTE_EVENT_STREAM_ENDPOINT, REMOTE_EVENT_STREAM_PAYLOAD, generationSignal);
    let streamFailed = false;
    let streamError;
    try {
      for await (const value of source) {
        if (clientId === undefined) {
          const opening = parseRemoteEventReady(value);
          clientId = opening.clientId;
          ready(opening.host);
          continue;
        }
        const frame = parseRemoteEventFrame(value);
        if (frame.type === "cancel") {
          active.get(frame.eventId)?.abort(/* @__PURE__ */ new Error("client api: Remote event was cancelled by the Host"));
          continue;
        }
        if (frame.type === "emit") {
          this.deliver(frame);
          continue;
        }
        const controller = new AbortController;
        active.set(frame.eventId, controller);
        const deliverySignal = AbortSignal.any([generationSignal, controller.signal]);
        const task = this.answer(frame, clientId, deliverySignal).catch((error) => {
          if (!deliverySignal.aborted)
            failed.abort(error);
        }).finally(() => {
          active.delete(frame.eventId);
          tasks.delete(task);
        });
        tasks.add(task);
      }
    } catch (error) {
      streamFailed = true;
      streamError = error;
    } finally {
      for (const controller of active.values())
        controller.abort(/* @__PURE__ */ new Error("client api: Remote event generation ended"));
      await Promise.allSettled(tasks);
    }
    if (failed.signal.aborted)
      throw toError(failed.signal.reason, "client api: Remote event result delivery failed");
    if (signal.aborted)
      return;
    if (streamFailed)
      throw streamError;
    throw new Error("client api: forwarded Remote event stream ended unexpectedly");
  }
  async answer(frame, clientId, signal) {
    const adapter = this.ownerCtx.typert.contexts.getClient("agent");
    let resolved;
    try {
      resolved = adapter?.resolve(frame.agentId);
    } catch (error) {
      this.reportError(frame.event, error);
    }
    const owned = isTypertOwnedValue(resolved) ? resolved : undefined;
    try {
      const target = isTypertOwnedValue(resolved) ? resolved.value : resolved;
      let outcome = { kind: "next" };
      if (target !== undefined)
        try {
          outcome = await this.dispatchWaterfall(target, frame, signal);
        } catch (error) {
          if (signal.aborted)
            return;
          outcome = {
            kind: "rejected",
            error: projectRemoteEventRejection(error)
          };
        }
      if (signal.aborted)
        return;
      const result = {
        clientId,
        eventId: frame.eventId,
        outcome: outcome.kind === "result" && outcome.value === undefined ? { kind: "result" } : outcome
      };
      const response = await this.connection.rpc.call("/api", REMOTE_EVENT_RESULT_ENDPOINT, { args: result }, signal);
      if (!response.ok)
        throw new Error(response.error.message);
    } finally {
      owned?.[Symbol.dispose]();
    }
  }
  async dispatchWaterfall(target, frame, signal) {
    const request = {
      ...frame.request,
      agent: target,
      signal
    };
    const value = await privateEvents(target).waterfall(target, this.eventKey(frame.event), request, () => Promise.resolve(REMOTE_EVENT_NEXT));
    if (value !== REMOTE_EVENT_NEXT && value !== undefined && !isRemoteJsonValue(value))
      throw new TypeError("Remote event listener result is not lossless JSON data");
    return value === REMOTE_EVENT_NEXT ? { kind: "next" } : {
      kind: "result",
      value
    };
  }
  eventKey(event) {
    return `${this.eventPrefix}${event}`;
  }
  reportError(event, error) {
    console.error(`client api: Remote event ${JSON.stringify(event)} listener threw:`, error);
  }
};
function parseRemoteEventReady(value) {
  if (!isRemoteEventRecord(value) || !hasExactRemoteEventKeys(value, [
    "type",
    "clientId",
    "host"
  ]) || value.type !== "ready" || !isRemoteEventClientId(value.clientId) || !isRemoteEventRecord(value.host) || !hasExactRemoteEventKeys(value.host, ["home"]) || typeof value.host.home !== "string")
    throw new TypeError("client api: forwarded Remote event stream did not begin with ready");
  return {
    clientId: value.clientId,
    host: { home: value.host.home }
  };
}
function parseRemoteEventFrame(value) {
  if (!isRemoteEventRecord(value))
    invalidRemoteEventFrame();
  if (value.type === "cancel" && hasExactRemoteEventKeys(value, ["type", "eventId"]) && isRemoteEventId(value.eventId))
    return {
      type: "cancel",
      eventId: value.eventId
    };
  if (value.type === "emit" && hasExactRemoteEventKeys(value, [
    "type",
    "event",
    "args"
  ]) && validRemoteEventName(value.event) && Array.isArray(value.args) && isRemoteJsonValue(value.args))
    return {
      type: "emit",
      event: value.event,
      args: value.args
    };
  if (value.type === "waterfall" && hasExactRemoteEventKeys(value, [
    "type",
    "event",
    "eventId",
    "agentId",
    "request"
  ]) && validRemoteEventName(value.event) && isRemoteEventId(value.eventId) && isRemoteEventAgentId(value.agentId) && isRemoteEventRecord(value.request) && !Object.hasOwn(value.request, "agent") && !Object.hasOwn(value.request, "signal") && isRemoteJsonValue(value.request))
    return {
      type: "waterfall",
      event: value.event,
      eventId: value.eventId,
      agentId: value.agentId,
      request: value.request
    };
  invalidRemoteEventFrame();
}
function isRemoteEventRecord(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function hasExactRemoteEventKeys(value, keys) {
  return Reflect.ownKeys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}
function validRemoteEventName(value) {
  return typeof value === "string" && value.length > 0;
}
function invalidRemoteEventFrame() {
  throw new TypeError("client api: invalid forwarded Remote event frame");
}
function privateEvents(ctx) {
  return ctx;
}
function toError(reason, message) {
  return reason instanceof Error ? reason : new Error(message, { cause: reason });
}
var RemoteStream = class {
  connection;
  options;
  lifetime = new AbortController;
  generationAbort;
  iterator;
  closing;
  revision = 0;
  taken = false;
  constructor(connection, options) {
    this.connection = connection;
    this.options = options;
  }
  get signal() {
    return this.lifetime.signal;
  }
  restart() {
    if (this.lifetime.signal.aborted)
      return;
    this.revision++;
    this.generationAbort?.abort(/* @__PURE__ */ new Error(`${this.options.name} generation restarted`));
  }
  dispose() {
    if (this.closing !== undefined)
      return this.closing;
    if (!this.lifetime.signal.aborted) {
      const reason = /* @__PURE__ */ new Error(`${this.options.name} disposed`);
      this.lifetime.abort(reason);
      this.generationAbort?.abort(reason);
    }
    const iterator = this.iterator;
    if (iterator === undefined)
      return Promise.resolve();
    const closing = closeRemoteStreamIterator(iterator);
    this.closing = closing;
    return closing;
  }
  [Symbol.asyncIterator]() {
    if (this.taken)
      throw new Error(`${this.options.name} already has a consumer`);
    this.taken = true;
    const iterator = this.read();
    this.iterator = iterator;
    return iterator;
  }
  async* read() {
    let attempt = 0;
    let generation = 0;
    let observedRevision = this.revision;
    try {
      while (!isAborted(this.lifetime.signal)) {
        if (observedRevision !== this.revision) {
          observedRevision = this.revision;
          attempt = 0;
        }
        const revision = this.revision;
        const generationAbort = new AbortController;
        this.generationAbort = generationAbort;
        const signal = AbortSignal.any([this.lifetime.signal, generationAbort.signal]);
        const generationId = ++generation;
        let accepted = false;
        try {
          for await (const value of this.options.open(signal)) {
            if (isAborted(this.lifetime.signal))
              return;
            if (revision !== this.revision)
              break;
            yield {
              generation: generationId,
              value,
              signal,
              accept: () => {
                if (this.generationAbort !== generationAbort || revision !== this.revision)
                  return;
                accepted = true;
                attempt = 0;
              }
            };
          }
          if (isAborted(this.lifetime.signal))
            return;
          if (revision !== this.revision)
            continue;
          throw this.options.ended(accepted);
        } catch (error) {
          if (isAborted(this.lifetime.signal))
            return;
          if (revision !== this.revision)
            continue;
          if (!(error instanceof RemoteStreamCarrierError))
            throw terminalStreamFailure(error);
          this.options.carrierFailed?.(error);
          if (revision !== this.revision)
            continue;
          attempt++;
          try {
            await waitForRemoteStreamRetry(this.connection, error, attempt, signal);
          } catch (retryError) {
            if (isAborted(this.lifetime.signal))
              return;
            if (revision !== this.revision)
              continue;
            throw terminalStreamFailure(retryError);
          }
        } finally {
          this.generationAbort = undefined;
          if (!generationAbort.signal.aborted)
            generationAbort.abort(/* @__PURE__ */ new Error(`${this.options.name} generation ended`));
        }
      }
    } finally {
      if (!this.lifetime.signal.aborted)
        this.lifetime.abort(/* @__PURE__ */ new Error(`${this.options.name} consumer closed`));
      this.generationAbort?.abort(this.lifetime.signal.reason);
      this.generationAbort = undefined;
    }
  }
};
async function waitForRemoteStreamRetry(connection, error, attempt, signal) {
  signal.throwIfAborted();
  if (connection.generation.getSnapshot() !== undefined) {
    if (attempt === 1)
      return;
    throw error;
  }
  await new Promise((resolve, reject) => {
    const subscription = { finished: false };
    const finish = (failure) => {
      if (subscription.finished)
        return;
      subscription.finished = true;
      subscription.dispose?.();
      signal.removeEventListener("abort", aborted);
      if (failure === undefined)
        resolve();
      else
        reject(failure);
    };
    const inspect = () => {
      if (connection.generation.getSnapshot() !== undefined)
        finish();
    };
    const aborted = () => {
      finish(new Error("Remote stream retry aborted", { cause: signal.reason }));
    };
    const dispose = connection.generation.subscribe(inspect);
    subscription.dispose = dispose;
    if (subscription.finished)
      dispose();
    signal.addEventListener("abort", aborted, { once: true });
    if (signal.aborted)
      aborted();
    else
      inspect();
  });
}
function terminalStreamFailure(error) {
  return remoteErrorOf(error) ?? new RemoteError("gateway/internal", error instanceof Error ? error.message : String(error), {}, { cause: error });
}
function isAborted(signal) {
  return signal.aborted;
}
async function closeRemoteStreamIterator(iterator) {
  try {
    await iterator.return?.();
  } catch {}
}
function protocolViolation$1(message) {
  return new RemoteError("gateway/internal", message, {});
}
var RemoteJournalStream = class {
  options;
  stream;
  initialRequest;
  resumeCursor;
  hasResumeCursor = false;
  generation = 0;
  firstCursor;
  lastCursor;
  started = false;
  opened = false;
  disposed = false;
  done;
  closing;
  pendingNext;
  constructor(remote, options) {
    this.options = options;
    this.stream = remote.$stream({
      name: options.name,
      open: (signal) => this.follow(this.initialRequest, signal),
      ended: (accepted) => accepted ? new RemoteStreamCarrierError(`${options.name} ended without a terminal result`) : protocolViolation$1(`${this.hasResumeCursor ? "resumed " : ""}${options.name} ended before its opening cursor`),
      ...options.carrierFailed === undefined ? {} : { carrierFailed: options.carrierFailed }
    });
  }
  get signal() {
    return this.stream.signal;
  }
  async open(request) {
    if (this.started)
      throw new Error(`${this.options.name} already opened`);
    this.started = true;
    this.initialRequest = request;
    const iterator = this.stream[Symbol.asyncIterator]();
    try {
      const first = await this.takeNext(iterator);
      if (first.done)
        throw protocolViolation$1(`${this.options.name} ended before its opening cursor`);
      this.replaceGeneration(first.value, false);
      this.opened = true;
      this.done = this.consume(iterator);
    } catch (error) {
      await this.stream.dispose();
      throw error;
    }
  }
  async prepend(request) {
    if (!this.opened || this.disposed)
      throw new Error(`${this.options.name} is not open`);
    const page = await this.readPage(request, this.currentCursor(), this.stream.signal);
    this.stream.signal.throwIfAborted();
    const entries = this.options.entries(page);
    this.assertPage(entries);
    const before = this.firstCursor;
    const accepted = before === undefined ? [...entries] : entries.filter((entry) => this.options.compare(this.options.first(entry), before) < 0);
    const tail = accepted.at(-1);
    if (tail !== undefined && before !== undefined && !this.options.follows(this.options.last(tail), before)) {
      this.options.publish({
        type: "prepend",
        page,
        entries: [],
        hasMore: false
      });
      throw protocolViolation$1(`${this.options.name} history page is discontinuous`);
    }
    const first = accepted[0];
    if (first !== undefined)
      this.firstCursor = this.options.first(first);
    this.options.publish({
      type: "prepend",
      page,
      entries: accepted,
      hasMore: this.options.hasMore(page)
    });
  }
  restart() {
    this.stream.restart();
  }
  dispose() {
    if (this.closing !== undefined)
      return this.closing;
    this.disposed = true;
    const done = this.done;
    const closing = (async () => {
      await this.stream.dispose();
      await done;
    })();
    this.closing = closing;
    return closing;
  }
  async consume(iterator) {
    try {
      while (true) {
        const next = await this.takeNext(iterator);
        if (next.done)
          return;
        const item = next.value;
        if (item.generation !== this.generation) {
          this.replaceGeneration(item, true);
          continue;
        }
        if (item.value.type === "opened")
          throw protocolViolation$1(`${this.options.name} emitted more than one opening cursor`);
        if (item.value.type === "notification") {
          this.publishNotification(item.value.notification);
          continue;
        }
        await this.acceptEntry(item.value.entry, item, iterator);
      }
    } catch (error) {
      if (!this.disposed)
        this.options.failed(error);
    }
  }
  replaceGeneration(initial, resumed) {
    const opening = this.opening(initial, resumed);
    this.replaceFromOpening(opening.page, opening.cursor);
  }
  opening(item, resumed) {
    if (item.value.type !== "opened")
      throw protocolViolation$1(`${resumed ? "resumed " : ""}${this.options.name} emitted an entry before its opening cursor`);
    const cursor = item.value.cursor;
    if (resumed && this.lastCursor !== undefined && this.options.compare(cursor, this.lastCursor) < 0)
      throw protocolViolation$1(`${this.options.name} resumed at a cursor behind the last applied entry`);
    this.generation = item.generation;
    item.accept();
    return {
      cursor,
      page: item.value.page
    };
  }
  replaceFromOpening(page, cursor) {
    this.assertPageThrough(page, cursor);
    const entries = [...this.options.entries(page)];
    this.assertPage(entries);
    const first = entries[0];
    this.firstCursor = first === undefined ? undefined : this.options.first(first);
    this.lastCursor = cursor;
    this.setResumeCursor(cursor);
    this.options.publish({
      type: "replace",
      page,
      entries,
      hasMore: this.options.hasMore(page)
    });
  }
  async acceptEntry(entry, item, iterator) {
    const { first, last: cursor } = this.entryRange(entry);
    const last = this.lastCursor;
    if (this.options.compare(cursor, last) <= 0)
      return;
    if (this.options.compare(first, last) <= 0)
      throw protocolViolation$1(`${this.options.name} emitted a partially overlapping entry`);
    if (!this.options.follows(last, first)) {
      const request = this.repairPageRequest();
      const superseded = await this.replaceThrough(request, cursor, item.generation, item.signal, iterator, [entry], []);
      if (superseded !== undefined)
        this.replaceGeneration(superseded, true);
      return;
    }
    if (this.firstCursor === undefined)
      this.firstCursor = first;
    this.lastCursor = cursor;
    this.setResumeCursor(cursor);
    this.options.publish({
      type: "append",
      entry
    });
  }
  async replaceThrough(request, requiredCursor, generation, signal, iterator, queued, notifications) {
    let read = await this.readPageWhileFollowing(request, requiredCursor, generation, signal, iterator, queued, notifications);
    if (read.type === "superseded")
      return read.item;
    let page = read.page;
    this.assertPageThrough(page, requiredCursor);
    let entries = this.mergeReplacement(page, queued);
    let target = this.maxCursor(requiredCursor, queued);
    if (entries === undefined || this.options.compare(this.tailCursor(entries), target) < 0) {
      read = await this.readPageWhileFollowing(this.repairPageRequest(), target, generation, signal, iterator, queued, notifications);
      if (read.type === "superseded")
        return read.item;
      page = read.page;
      this.assertPageThrough(page, target);
      entries = this.mergeReplacement(page, queued);
      target = this.maxCursor(requiredCursor, queued);
    }
    if (entries === undefined || this.options.compare(this.tailCursor(entries), target) < 0)
      throw protocolViolation$1(`${this.options.name} page did not reach its opening cursor`);
    const first = entries[0];
    this.firstCursor = first === undefined ? undefined : this.options.first(first);
    this.lastCursor = this.tailCursor(entries);
    this.setResumeCursor(this.lastCursor);
    this.options.publish({
      type: "replace",
      page,
      entries,
      hasMore: this.options.hasMore(page)
    });
    for (const notification of notifications)
      this.publishNotification(notification);
  }
  async readPageWhileFollowing(request, through, generation, signal, iterator, queued, notifications) {
    const page = this.readPage(request, through, signal).then((value) => ({
      type: "page",
      value
    }), (error) => ({
      type: "page-error",
      error
    }));
    while (true) {
      const pending = this.nextResult(iterator);
      const next = pending.then((value) => ({
        type: "next",
        value
      }), (error) => ({
        type: "next-error",
        error
      }));
      const result = await Promise.race([page, next]);
      if (result.type === "page") {
        signal.throwIfAborted();
        return {
          type: "page",
          page: result.value
        };
      }
      if (result.type === "page-error") {
        if (!signal.aborted || this.stream.signal.aborted)
          throw result.error;
        return this.awaitReplacementGeneration(generation, iterator, pending);
      }
      this.releaseNext();
      if (result.type === "next-error")
        throw result.error;
      if (result.value.done) {
        signal.throwIfAborted();
        throw protocolViolation$1(`${this.options.name} ended while reading its replacement page`);
      }
      const item = result.value.value;
      if (item.generation !== generation)
        return {
          type: "superseded",
          item
        };
      if (item.value.type === "opened")
        throw protocolViolation$1(`${this.options.name} emitted more than one opening cursor`);
      if (item.value.type === "notification") {
        notifications.push(item.value.notification);
        continue;
      }
      queued.push(item.value.entry);
    }
  }
  async awaitReplacementGeneration(generation, iterator, initial) {
    let pending = initial;
    while (true) {
      let next;
      try {
        next = await pending;
      } finally {
        this.releaseNext();
      }
      if (next.done) {
        this.stream.signal.throwIfAborted();
        throw protocolViolation$1(`${this.options.name} ended while replacing an aborted page generation`);
      }
      const item = next.value;
      if (item.generation !== generation)
        return {
          type: "superseded",
          item
        };
      if (item.value.type === "opened")
        throw protocolViolation$1(`${this.options.name} emitted more than one opening cursor`);
      pending = this.nextResult(iterator);
    }
  }
  mergeReplacement(page, queued) {
    const entries = [...this.options.entries(page)];
    this.assertPage(entries);
    for (const entry of queued)
      this.entryRange(entry);
    const sorted = [...queued].sort((left, right) => this.options.compare(this.options.first(left), this.options.first(right)));
    let tail = this.tailCursor(entries);
    for (const entry of sorted) {
      const first = this.options.first(entry);
      const last = this.options.last(entry);
      if (this.options.compare(last, tail) <= 0)
        continue;
      if (this.options.compare(first, tail) <= 0)
        throw protocolViolation$1(`${this.options.name} replacement contains a partially overlapping entry`);
      if (!this.options.follows(tail, first))
        return;
      entries.push(entry);
      tail = last;
    }
    return entries;
  }
  maxCursor(cursor, entries) {
    let result = cursor;
    for (const entry of entries) {
      const candidate = this.options.last(entry);
      if (this.options.compare(candidate, result) > 0)
        result = candidate;
    }
    return result;
  }
  nextResult(iterator) {
    this.pendingNext ??= iterator.next();
    return this.pendingNext;
  }
  async takeNext(iterator) {
    const pending = this.nextResult(iterator);
    try {
      return await pending;
    } finally {
      this.releaseNext();
    }
  }
  releaseNext() {
    this.pendingNext = undefined;
  }
  publishNotification(notification) {
    this.options.publish({
      type: "notification",
      notification
    });
  }
  repairPageRequest() {
    return this.repairRequest(this.initialRequest);
  }
  setResumeCursor(cursor) {
    this.resumeCursor = cursor;
    this.hasResumeCursor = true;
  }
  currentCursor() {
    return this.resumeCursor;
  }
  tailCursor(entries) {
    const tail = entries.at(-1);
    return tail === undefined ? this.options.emptyCursor : this.options.last(tail);
  }
  assertPage(entries) {
    const iterator = entries[Symbol.iterator]();
    const first = iterator.next();
    if (first.done)
      return;
    let previousRange = this.entryRange(first.value);
    for (const entry of iterator) {
      const range = this.entryRange(entry);
      if (!this.options.follows(previousRange.last, range.first))
        throw protocolViolation$1(`${this.options.name} page contains discontinuous entries`);
      previousRange = range;
    }
  }
  entryRange(entry) {
    const first = this.options.first(entry);
    const last = this.options.last(entry);
    if (this.options.compare(first, last) > 0)
      throw protocolViolation$1(`${this.options.name} entry has an inverted cursor range`);
    return {
      first,
      last
    };
  }
  assertPageThrough(page, through) {
    const tail = this.tailCursor(this.options.entries(page));
    if (this.options.compare(tail, through) !== 0)
      throw protocolViolation$1(`${this.options.name} page did not end at its requested cursor`);
  }
};
function protocolViolation(message) {
  return new RemoteError("gateway/internal", message, {});
}
var RemoteSnapshotStream = class {
  stream;
  options;
  started = false;
  disposed = false;
  done;
  constructor(stream, options) {
    this.stream = stream;
    this.options = options;
  }
  start() {
    if (this.started)
      return;
    this.started = true;
    this.done = this.consume();
  }
  restart() {
    this.stream.restart();
  }
  async dispose() {
    this.disposed = true;
    await this.stream.dispose();
    await this.done;
  }
  async consume() {
    let generation = 0;
    let snapshotSeen = false;
    try {
      for await (const item of this.stream) {
        if (item.generation !== generation) {
          generation = item.generation;
          snapshotSeen = false;
        }
        if (this.options.isSnapshot(item.value)) {
          if (snapshotSeen)
            throw protocolViolation(`${this.options.name} emitted more than one opening snapshot`);
          this.options.replace(item.value);
          snapshotSeen = true;
          item.accept();
          continue;
        }
        if (!snapshotSeen)
          throw protocolViolation(`${this.options.name} emitted an update before its opening snapshot`);
        this.options.update(item.value);
      }
    } catch (error) {
      if (!this.disposed)
        this.options.failed(error);
    }
  }
};
var inject = ["typert", "connection"];
function apply(ctx) {
  new ClientRemoteService(ctx);
}
var ClientRemoteService = class extends Service {
  ownerCtx;
  connection;
  namespaces = /* @__PURE__ */ new Map;
  hostFacts;
  streams;
  events;
  mutations = Promise.resolve();
  constructor(ctx) {
    super(ctx, "remote");
    this.ownerCtx = ctx;
    const connection = ctx.get("connection");
    this.connection = connection;
    this.streams = new RemoteStreamMuxClient((path) => connection.openWebSocket(path), connection.interactions === "answer");
    if (connection.interactions === "answer")
      this.events = new ClientRemoteEvents(ctx, connection, (endpoint, payload, signal) => this.openRemoteStream(endpoint, payload, signal));
    if (connection.rpc.open === undefined)
      this.streams.start();
    let disposed = false;
    let loop;
    const start = () => {
      if (disposed || connection.interactions === "none")
        return;
      if (connection.rpc.open === undefined)
        this.streams.start();
      loop = connection.start({
        onConnected: () => {
          this.ownerCtx.emit("connection/reset");
        },
        onReconnectRequested: () => {
          if (connection.rpc.open === undefined)
            this.streams.reconnect();
        }
      });
    };
    const loader = ctx.get("loader");
    if (loader === undefined)
      start();
    else
      loader.await().then(start, () => {});
    ctx.effect(() => async () => {
      disposed = true;
      loop?.stop();
      await this.events?.dispose();
      await this.streams.close();
    }, "api-gateway.client.transport");
  }
  $stream(options) {
    if (this.connection.interactions === "none")
      throw new Error("client api: $stream requires interactions=answer; use a generated stream method");
    return new RemoteStream(this.connection, options);
  }
  get $host() {
    const home = this.connection.generation.getSnapshot()?.host.home;
    if (this.hostFacts === undefined || this.hostFacts.home !== home)
      this.hostFacts = {
        home,
        isLoopback: this.connection.isLoopback
      };
    return this.hostFacts;
  }
  async $mount(contribution) {
    const callerCtx = this.ctx;
    const owned = callerCtx.effect(async () => {
      const dispose = await this.enqueue(() => this.mountContribution(callerCtx, contribution));
      return () => this.enqueue(dispose);
    }, `api-gateway.client.$mount(${JSON.stringify(contribution.package)})`);
    await owned;
    return async () => {
      await owned();
    };
  }
  $on(event, listener) {
    if (this.events === undefined)
      throw new Error("client api: forwarded events require interactions=answer");
    return this.events.subscribe(this.ctx, event, listener);
  }
  openRemoteStream(endpoint, payload, signal, uplink, noConnection = `client api: ${endpoint} has no active Connection`) {
    const connection = this.ownerCtx.get("connection");
    if (connection === undefined)
      throw new Error(noConnection);
    const local = connection.rpc.open?.("/api", endpoint, payload, signal, uplink);
    return local === undefined ? this.streams.open(endpoint, payload, signal, uplink) : normalizeConnectionStream(local);
  }
  enqueue(operation) {
    const result = this.mutations.then(operation, operation);
    this.mutations = result.then(() => {
      return;
    }, () => {
      return;
    });
    return result;
  }
  async mountContribution(callerCtx, contribution) {
    this.validateContribution(contribution);
    const disposeRemote = callerCtx.typert.remotes.register(contribution);
    const groups = /* @__PURE__ */ new Map;
    for (const descriptor of contribution.descriptors) {
      const group = groups.get(descriptor.namespace);
      if (group === undefined)
        groups.set(descriptor.namespace, [descriptor]);
      else
        group.push(descriptor);
    }
    const installed = [];
    try {
      for (const [namespace, descriptors] of groups)
        installed.push(await this.installNamespace(namespace, descriptors));
    } catch (error) {
      for (const dispose of installed.reverse())
        await dispose();
      await disposeRemote();
      throw error;
    }
    return async () => {
      for (const dispose of installed.reverse())
        await dispose();
      await disposeRemote();
    };
  }
  validateContribution(contribution) {
    const direct = /* @__PURE__ */ new Map;
    const scoped = /* @__PURE__ */ new Map;
    const add = (table, descriptor, kind) => {
      const methods = table.get(descriptor.namespace) ?? /* @__PURE__ */ new Set;
      if (methods.has(descriptor.method))
        throw new Error(`client api: contribution repeats ${kind} method ${endpointOf(descriptor)}`);
      methods.add(descriptor.method);
      table.set(descriptor.namespace, methods);
      if (this.namespaces.get(descriptor.namespace)?.service?.has(kind, descriptor.method) === true)
        throw new Error(`client api: ${kind} method ${endpointOf(descriptor)} is already mounted`);
    };
    for (const descriptor of contribution.descriptors) {
      requireStrictInputs(descriptor);
      if (descriptor.invocation.kind === "direct")
        add(direct, descriptor, "direct");
      if (scopedProjection(descriptor) !== undefined)
        add(scoped, descriptor, "scoped");
    }
    const namespaces = new Set([...direct.keys(), ...scoped.keys()]);
    for (const namespace of namespaces) {
      const service = this.namespaces.get(namespace)?.service;
      if (service === undefined) {
        if (namespace in this)
          throw new Error(`client api: namespace ${JSON.stringify(namespace)} conflicts with the Remote service`);
        const serviceKey = remoteServiceKey(namespace);
        if (this.ownerCtx.reflect.props[serviceKey]?.type === "accessor" || this.ownerCtx.get(serviceKey) !== undefined)
          throw new Error(`client api: namespace ${JSON.stringify(namespace)} conflicts with an existing Remote namespace`);
      }
      for (const method of new Set([...direct.get(namespace) ?? [], ...scoped.get(namespace) ?? []]))
        if (service === undefined)
          RemoteNamespaceService.assertMethodAvailable(namespace, method);
        else
          service.assertMethodAvailable(method);
    }
  }
  async installNamespace(name, descriptors) {
    let namespace = this.namespaces.get(name);
    let installed;
    if (namespace === undefined)
      ({ namespace, installed } = await this.createNamespace(name, descriptors));
    else
      installed = installMethods(namespace.service, descriptors);
    const handle = namespace;
    return async () => {
      for (const method of [...installed].reverse()) {
        if (!method.token.active)
          continue;
        method.token.active = false;
        method.token.abort.abort();
        if (method.scoped)
          handle.service.remove("scoped", method.descriptor.method, method.token);
        if (method.direct)
          handle.service.remove("direct", method.descriptor.method, method.token);
      }
      await this.disposeNamespace(name, handle);
    };
  }
  async createNamespace(name, descriptors) {
    let service;
    let installed;
    const fiber = this.ownerCtx.plugin({
      name: remoteServiceKey(name),
      apply: (ctx) => {
        service = new RemoteNamespaceService(ctx, name, (direct, scoped, caller, args) => this.invokeMethod(direct, scoped, caller, args));
        installed = installMethods(service, descriptors);
      }
    });
    try {
      await fiber;
    } catch (error) {
      await fiber.dispose();
      throw error;
    }
    if (service === undefined || installed === undefined)
      throw new Error(`client api: namespace ${JSON.stringify(name)} did not start`);
    const namespace = {
      service,
      dispose: fiber.dispose
    };
    this.namespaces.set(name, namespace);
    return {
      namespace,
      installed
    };
  }
  async disposeNamespace(name, namespace) {
    if (!namespace.service.empty || this.namespaces.get(name) !== namespace)
      return;
    this.namespaces.delete(name);
    await namespace.dispose();
  }
  invokeMethod(direct, scoped, callerCtx, values) {
    if (scoped !== undefined) {
      const identity = this.ownerCtx.typert.contexts.getClient(scoped.projection.context)?.identity(callerCtx);
      if (identity !== undefined)
        return this.invokeSelected(scoped.descriptor, scoped.projection, scoped.token, callerCtx, values, { value: identity });
    }
    if (direct !== undefined)
      return this.invokeSelected(direct.descriptor, undefined, direct.token, callerCtx, values);
    if (scoped !== undefined)
      return this.invokeSelected(scoped.descriptor, scoped.projection, scoped.token, callerCtx, values);
    throw new Error("client api: Remote method is no longer mounted");
  }
  invokeSelected(descriptor, projection, token, callerCtx, values, boundIdentity) {
    if (descriptor.mode !== undefined)
      return this.invokeStream(descriptor, projection, token, callerCtx, values, boundIdentity);
    return this.invoke(descriptor, projection, token, callerCtx, values, boundIdentity);
  }
  async invoke(descriptor, projection, token, callerCtx, values, boundIdentity) {
    const endpoint = endpointOf(descriptor);
    if (!token.active)
      return withdrawn(endpoint);
    const prepared = this.prepareInvocation(descriptor, projection, token, callerCtx, values, boundIdentity);
    const connection = this.ownerCtx.get("connection");
    if (connection === undefined)
      throw new Error(`client api: ${endpoint} has no active Connection`);
    try {
      const result = await connection.rpc.call("/api", endpoint, { args: prepared.args }, prepared.signal);
      if (!mountActive(token))
        return withdrawn(endpoint);
      prepared.signal.throwIfAborted();
      if (!result.ok)
        return {
          ok: false,
          error: rebuiltFailure(result.error)
        };
      return {
        ok: true,
        value: descriptor.result.mode === "strict" && descriptor.result.decode !== undefined ? descriptor.result.decode(result.value) : result.value
      };
    } catch (error) {
      if (prepared.signal.aborted)
        return cancelledFailure(endpoint, error);
      return carrierFailure(endpoint, error);
    }
  }
  invokeStream(descriptor, projection, token, callerCtx, values, boundIdentity) {
    const endpoint = endpointOf(descriptor);
    if (!token.active)
      throw new Error(withdrawn(endpoint).error.message);
    const prepared = this.prepareInvocation(descriptor, projection, token, callerCtx, values, boundIdentity);
    const generation = new AbortController;
    const uplink = new ClientUplinkQueue(endpoint);
    return new ClientStreamHandle(endpoint, this.openRemoteStream(endpoint, { args: prepared.args }, AbortSignal.any([prepared.signal, generation.signal]), uplink), uplink, generation, token);
  }
  prepareInvocation(descriptor, projection, token, callerCtx, values, boundIdentity) {
    const endpoint = endpointOf(descriptor);
    const expected = descriptor.parameters.length - (projection?.parameterIndex === undefined ? 0 : 1);
    const hasCallerSignal = descriptor.cancellation !== undefined && values.length === expected + 1;
    if (values.length !== expected && !hasCallerSignal) {
      const contract = descriptor.cancellation === undefined ? `${String(expected)} argument(s)` : `${String(expected)} business argument(s) plus an optional AbortSignal`;
      throw new Error(`client api: ${endpoint} expected ${contract}, got ${String(values.length)}`);
    }
    const args = Object.create(null);
    if (projection !== undefined) {
      const adapter = boundIdentity === undefined ? this.ownerCtx.typert.contexts.getClient(projection.context) : undefined;
      if (boundIdentity === undefined && adapter === undefined)
        throw new Error(`client api: ${endpoint} has no Client Context adapter for ${JSON.stringify(projection.context)}`);
      const identity = boundIdentity === undefined ? adapter?.identity(callerCtx) : boundIdentity.value;
      if (identity === undefined)
        throw new Error(`client api: ${endpoint} requires a ${JSON.stringify(projection.context)} Context`);
      args[projection.wire] = identity;
    }
    let valueIndex = 0;
    descriptor.parameters.forEach((parameter, parameterIndex) => {
      if (parameterIndex === projection?.parameterIndex)
        return;
      const value = values[valueIndex];
      if (value !== undefined)
        args[parameter.wire] = value;
      valueIndex += 1;
    });
    const callerSignal = hasCallerSignal ? values[expected] : undefined;
    return {
      endpoint,
      args,
      signal: callerSignal === undefined ? token.abort.signal : AbortSignal.any([token.abort.signal, callerSignal])
    };
  }
};
var ClientStreamHandle = class {
  endpoint;
  uplink;
  generation;
  token;
  downlink;
  primed;
  consumed = false;
  disposed = false;
  constructor(endpoint, downlink, uplink, generation, token) {
    this.endpoint = endpoint;
    this.uplink = uplink;
    this.generation = generation;
    this.token = token;
    this.downlink = downlink[Symbol.asyncIterator]();
    this.primed = this.downlink.next();
    this.primed.catch(() => {
      this.uplink.close();
    });
  }
  send(item) {
    if (!isRemoteUplinkItem(item))
      throw new Error(`client api: ${this.endpoint} uplink item is not a lossless JSON value`);
    this.uplink.push(item);
  }
  end() {
    this.uplink.end();
  }
  dispose() {
    if (this.disposed)
      return;
    this.disposed = true;
    this.uplink.close();
    this.generation.abort(/* @__PURE__ */ new Error(`client api: ${this.endpoint} stream disposed`));
    Promise.resolve(this.downlink.return?.()).catch(() => {
      return;
    });
  }
  [Symbol.asyncIterator]() {
    if (this.consumed)
      throw new Error(`client api: ${this.endpoint} stream has one consumer`);
    this.consumed = true;
    const iteration = this.iterate();
    return {
      next: () => iteration.next(),
      return: (value) => {
        this.dispose();
        return iteration.return(value);
      }
    };
  }
  async* iterate() {
    try {
      while (true) {
        const next = await (this.primed ?? this.downlink.next());
        this.primed = undefined;
        if (this.disposed || next.done === true)
          return;
        if (!mountActive(this.token))
          throw new Error(withdrawn(this.endpoint).error.message);
        yield next.value;
      }
    } catch (error) {
      if (this.disposed)
        return;
      throw error;
    } finally {
      this.dispose();
      await this.downlink.return?.();
    }
  }
};
var RemoteNamespaceService = class RemoteNamespaceService extends Service {
  invokeRemote;
  methods = /* @__PURE__ */ new Map;
  namespace;
  static assertMethodAvailable(namespace, method) {
    if (REMOTE_NAMESPACE_FIELDS.has(method) || method in RemoteNamespaceService.prototype)
      throw new Error(`client api: method ${JSON.stringify(`${namespace}/${method}`)} conflicts with its namespace service`);
  }
  constructor(ctx, name, invokeRemote) {
    super(ctx, remoteServiceKey(name));
    this.invokeRemote = invokeRemote;
    this.namespace = name;
  }
  assertMethodAvailable(method) {
    RemoteNamespaceService.assertMethodAvailable(this.namespace, method);
    if (method in this && !this.methods.has(method))
      throw new Error(`client api: method ${JSON.stringify(`${this.namespace}/${method}`)} conflicts with its namespace service`);
  }
  get empty() {
    return this.methods.size === 0;
  }
  has(kind, method) {
    return this.methods.get(method)?.[kind] !== undefined;
  }
  installDirect(descriptor, token) {
    this.install(descriptor.method, "direct", {
      descriptor,
      token
    });
  }
  installScoped(descriptor, projection, token) {
    this.install(descriptor.method, "scoped", {
      descriptor,
      projection,
      token
    });
  }
  install(method, kind, value) {
    this.assertMethodAvailable(method);
    let record = this.methods.get(method);
    const fresh = record === undefined;
    record ??= {};
    if (fresh) {
      Object.defineProperty(this, method, {
        configurable: true,
        enumerable: true,
        get: function() {
          const callerCtx = this.ctx;
          const current = this.methods.get(method);
          const direct = current?.direct;
          const scoped = current?.scoped;
          return (...args) => {
            return this.invokeRemote(direct, scoped, callerCtx, args);
          };
        }
      });
      this.methods.set(method, record);
    }
    if (kind === "direct")
      record.direct = value;
    else
      record.scoped = value;
  }
  remove(kind, method, token) {
    const record = this.methods.get(method);
    const current = record?.[kind];
    if (record === undefined || current?.token !== token)
      return;
    if (kind === "direct")
      delete record.direct;
    else
      delete record.scoped;
    if (record.direct !== undefined || record.scoped !== undefined)
      return;
    this.methods.delete(method);
    Reflect.deleteProperty(this, method);
  }
};
function installMethods(service, descriptors) {
  const installed = [];
  try {
    for (const descriptor of descriptors) {
      const method = {
        descriptor,
        token: {
          active: true,
          abort: new AbortController
        },
        direct: false,
        scoped: false
      };
      installed.push(method);
      if (descriptor.invocation.kind === "direct") {
        service.installDirect(descriptor, method.token);
        method.direct = true;
      }
      const projection = scopedProjection(descriptor);
      if (projection !== undefined) {
        service.installScoped(descriptor, projection, method.token);
        method.scoped = true;
      }
    }
  } catch (error) {
    for (const method of [...installed].reverse()) {
      method.token.active = false;
      method.token.abort.abort();
      if (method.scoped)
        service.remove("scoped", method.descriptor.method, method.token);
      if (method.direct)
        service.remove("direct", method.descriptor.method, method.token);
    }
    throw error;
  }
  return installed;
}
var REMOTE_NAMESPACE_FIELDS = new Set([
  "ctx",
  "empty",
  "invokeRemote",
  "methods",
  "name",
  "namespace"
]);
function remoteServiceKey(namespace) {
  return `remote.${namespace}`;
}
function endpointOf(descriptor) {
  return `${descriptor.namespace}/${descriptor.method}`;
}
function mountActive(token) {
  return token.active;
}
function scopedProjection(descriptor) {
  if (descriptor.invocation.kind === "context")
    return {
      context: descriptor.invocation.context,
      wire: descriptor.invocation.wire
    };
  if (descriptor.scope === undefined)
    return;
  const lookupParameters = descriptor.parameters.map((parameter, index) => ({
    parameter,
    index
  })).filter((candidate) => candidate.parameter.source === "lookup");
  const selected = lookupParameters.length === 1 ? lookupParameters[0] : undefined;
  if (selected === undefined || selected.parameter.wire !== descriptor.scope.wire || selected.parameter.lookup !== descriptor.scope.context)
    throw new Error(`client api: generated Remote ${endpointOf(descriptor)} scope must select its only lookup parameter`);
  return {
    context: descriptor.scope.context,
    wire: descriptor.scope.wire,
    parameterIndex: selected.index
  };
}
function requireStrictInputs(descriptor) {
  const endpoint = endpointOf(descriptor);
  for (const parameter of descriptor.parameters)
    requireStrictCodec(parameter.codec, endpoint, parameter.wire);
  if (descriptor.uplink !== undefined)
    requireStrictCodec(descriptor.uplink.codec, endpoint, "uplink");
  if (descriptor.invocation.kind === "context")
    requireStrictCodec(descriptor.invocation.codec, endpoint, descriptor.invocation.wire);
}
function requireStrictCodec(codec, endpoint, field) {
  if (codec.mode !== "strict")
    throw new Error(`client api: generated Remote ${endpoint} field ${JSON.stringify(field)} has no strict codec`);
}
function withdrawn(endpoint) {
  return internalFailure(`client api: Remote method ${endpoint} is no longer mounted`);
}
function carrierFailure(endpoint, error) {
  return internalFailure(`client api: ${endpoint} failed: ${error instanceof Error ? error.message : String(error)}`);
}
function cancelledFailure(endpoint, cause) {
  return {
    ok: false,
    error: new RemoteError("gateway/cancelled", `client api: Remote invocation "${endpoint}" was aborted`, {}, { cause })
  };
}
function internalFailure(message) {
  return {
    ok: false,
    error: new RemoteError("gateway/internal", message, {})
  };
}
function isRemoteFailure(error) {
  return remoteErrorOf(error) !== undefined;
}
function rebuiltFailure(error) {
  return new RemoteError(error.code, error.message, error.details);
}
async function* normalizeConnectionStream(source) {
  try {
    yield* source;
  } catch (error) {
    if (!(error instanceof Error))
      throw error;
    const marker = error.dshRemoteStreamFailure;
    if (marker?.kind === "remote")
      throw new RemoteError(marker.code, error.message, marker.details);
    if (marker?.kind === "carrier")
      throw new RemoteStreamCarrierError(error.message, { cause: error });
    throw error;
  }
}
// node_modules/@deepseek-ai/dsh-typert-protocol/lib/types/remote-info.js
function createTypertRemoteInfo(spec, zod) {
  return new RemoteInfo(spec, zod);
}

class RemoteInfo {
  spec;
  zod;
  index;
  constructor(spec, zod) {
    this.spec = spec;
    this.zod = zod;
  }
  get package() {
    return this.spec.package;
  }
  get descriptors() {
    return this.resolve().descriptors;
  }
  get methods() {
    return this.resolve().methods;
  }
  resolve() {
    if (this.index !== undefined)
      return this.index;
    const zod = this.zod;
    const descriptors = [];
    const methods = Object.create(null);
    for (const [endpoint, definition] of Object.entries(this.spec.methods)) {
      const separator = endpoint.indexOf("/");
      const namespace = endpoint.slice(0, separator);
      const method = endpoint.slice(separator + 1);
      const parameters = definition.parameters.map((parameter) => ({ ...parameter, wire: parameter.wire ?? parameter.name }));
      const descriptor = {
        ...definition,
        id: `${this.spec.package}#${endpoint}`,
        namespace,
        method,
        parameters,
        result: definition.result.description === undefined ? definition.result : new ResultValue(definition.result)
      };
      if (definition.invocation.kind === "direct") {
        const inputs = [];
        const direct = Object.assign(descriptor, {
          input(options) {
            const strict = options?.strict === true;
            return inputs[strict ? 1 : 0] ??= new NamedInput(parameters, strict, zod);
          },
          invoke(remote, input, signal) {
            const named = input;
            const values = parameters.map((parameter) => named[parameter.wire]);
            if (definition.cancellation !== undefined)
              values.push(signal);
            const receiver = Reflect.get(remote, namespace);
            const call = Reflect.get(receiver, method);
            return call.apply(receiver, values);
          }
        });
        methods[endpoint] = direct;
      }
      descriptors.push(descriptor);
    }
    return this.index = { descriptors, methods };
  }
}
function optional2(parameter) {
  return parameter.source === "json" && parameter.acceptsUndefined === true;
}

class NamedInput {
  parameters;
  strict;
  zod;
  schema;
  projection;
  constructor(parameters, strict, zod) {
    this.parameters = parameters;
    this.strict = strict;
    this.zod = zod;
  }
  codec(parameter) {
    return this.strict ? parameter.strictCodec : parameter.codec;
  }
  create = () => this.schema ??= this.zod.strictObject(Object.fromEntries(this.parameters.map((parameter) => {
    const value = this.codec(parameter).create();
    return [parameter.wire, optional2(parameter) ? value.optional() : value.nonoptional()];
  })));
  get jsonSchema() {
    return this.project().jsonSchema;
  }
  get jsonSchemaError() {
    return this.project().jsonSchemaError;
  }
  project() {
    if (this.projection !== undefined)
      return this.projection;
    const unavailable = this.parameters.find((parameter) => this.codec(parameter).jsonSchema === undefined);
    if (unavailable !== undefined) {
      return this.projection = { jsonSchemaError: this.codec(unavailable).jsonSchemaError ?? `No JSON Schema for parameter ${unavailable.wire}` };
    }
    return this.projection = {
      jsonSchema: {
        type: "object",
        properties: Object.fromEntries(this.parameters.map((parameter) => [parameter.wire, {
          ...this.codec(parameter).jsonSchema,
          ...parameter.description === undefined ? {} : { description: parameter.description }
        }])),
        required: this.parameters.filter((parameter) => !optional2(parameter)).map((parameter) => parameter.wire),
        additionalProperties: false
      }
    };
  }
}

class ResultValue {
  spec;
  projection;
  constructor(spec) {
    this.spec = spec;
  }
  get mode() {
    return this.spec.mode;
  }
  get typeSymbol() {
    return this.spec.typeSymbol;
  }
  get create() {
    return this.spec.create;
  }
  get decode() {
    return this.spec.decode;
  }
  get encode() {
    return this.spec.encode;
  }
  get description() {
    return this.spec.description;
  }
  get jsonSchemaError() {
    return this.spec.jsonSchemaError;
  }
  get jsonSchema() {
    if (this.projection === undefined) {
      const schema = this.spec.jsonSchema;
      this.projection = { value: schema === undefined ? undefined : { ...schema, description: this.spec.description } };
    }
    return this.projection.value;
  }
}

// node_modules/@deepseek-ai/dsh-api-session-controller/lib/typert.remote-client.js
var _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_0$schema$value ??= string2();
var _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_1$schema$value;
var _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_1$schema = () => _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_1$schema$value ??= string2();
var _deepseek_ai_dsh_api_session_controller_fileReferences_list_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_fileReferences_list_result$schema = () => _deepseek_ai_dsh_api_session_controller_fileReferences_list_result$schema$value ??= array(object({
  path: string2().describe("User-facing path accepted by normal prompts and filesystem tools."),
  kind: union([literal("file"), literal("directory")]).describe("Directories keep completion open; files finish the mention.")
}));
var _deepseek_ai_dsh_api_session_controller_session_attachment_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_attachment_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_attachment_parameter_0$schema$value ??= object({
  sessionId: string2().readonly(),
  attachmentId: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_attachment_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_attachment_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_attachment_result$schema$value ??= object({
  attachment: object({
    attachmentId: string2().describe("Opaque storage identifier; never a filesystem path or bearer URL."),
    mediaType: union([literal("image/png"), literal("image/jpeg"), literal("image/webp"), literal("image/gif")]).describe("Media type verified from the stored bytes."),
    bytes: number2().describe("Exact encoded byte length."),
    width: number2().describe("Intrinsic encoded width in pixels."),
    height: number2().describe("Intrinsic encoded height in pixels."),
    name: string2().optional().describe("Optional display name stripped of local path information."),
    originalDimensions: object({
      width: number2(),
      height: number2()
    }).optional().describe("Input dimensions after applying EXIF orientation and before normalization scaling. Present only when normalization reduced the image.")
  }).readonly(),
  data: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_cancel_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_cancel_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_cancel_parameter_0$schema$value ??= object({
  sessionId: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_cancel_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_cancel_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_cancel_result$schema$value ??= object({
  accepted: literal(true).readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_canOpenWorkspacePath_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_canOpenWorkspacePath_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_canOpenWorkspacePath_result$schema$value ??= boolean2();
var _deepseek_ai_dsh_api_session_controller_session_control_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_control_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_control_result$schema$value ??= union([object({
  type: literal("baseline").readonly(),
  value: object({
    projections: record(string2(), object({
      asOfSeq: number2().readonly(),
      values: intersection(object({
        inbox: object({
          "next-turn": array(json()).readonly(),
          "next-step": array(json()).readonly()
        }).optional().describe("Pending agent input reconstructed from durable inbox splices."),
        workingDirectory: union([literal(null), string2()]).optional().describe("Recorded current directory for Session observations, or null when none is recorded."),
        agentPreset: union([literal(null), string2()]).optional().describe("Preset the Session runs, or null when the deployment composes none."),
        title: union([literal(null), string2()]).optional().describe("The session's current normalized title — the latest `session/title` event's text (last-wins), or `null` before the first title lands. A plain string: the shape the client list rows consume."),
        todos: union([literal(null), array(object({
          content: string2().describe("What this task is — a short imperative line shown in the UI."),
          status: union([literal("completed"), literal("pending"), literal("in_progress")]).describe("Lifecycle state. `in_progress` marks a task being worked now; parallel work may mark several.")
        }))]).optional().describe("The agent's current whole todo list (the latest `todo/write` snapshot), or `null` before the first write. Whole-value rule: every `todo/write` carries the complete replacement list, so the fold is last-wins."),
        sessionListMetadata: object({
          blank: boolean2().readonly().describe("Whether the folded prefix contains no turn."),
          lastPromptAt: union([literal(null), number2()]).readonly().describe("Latest human-authored prompt time in the folded prefix.")
        }).optional().describe("Persisted facts used to summarize a Session without activating it."),
        imageLimits: object({
          maxImageBytes: number2(),
          maxImagesPerMessage: number2(),
          maxMessageImageBytes: number2(),
          maxImagePixels: number2(),
          maxImageDimension: number2().describe("Maximum intrinsic width and maximum intrinsic height in pixels for one image."),
          mediaTypes: array(union([literal("image/png"), literal("image/jpeg"), literal("image/webp"), literal("image/gif")]))
        }).optional().describe("Image-intake limits enforced by the Session prompt endpoint."),
        modelSelection: object({
          lastUsed: union([literal(null), object({
            provider: string2().readonly(),
            model: string2().readonly(),
            reasoningEffort: string2().readonly().optional()
          })]).readonly().describe("Selection consumed by the latest recorded model request."),
          next: union([literal(null), object({
            provider: string2().readonly(),
            model: string2().readonly(),
            reasoningEffort: string2().readonly().optional()
          })]).readonly().describe("Selection the next request should use, falling back to {@link lastUsed}.")
        }).optional().describe("Durable model selection already used and selected for the next request."),
        permissions: object({
          currentValue: string2().describe("The effective current value: a configured preset key, `auto`, or `custom`.")
        }).optional().describe("The session's current permission, folded from the three whole-value knob events (`permission/preset`, `sandbox/mode`, `approval/policy`) over the composition defaults. Selectable options come from the process-level catalog Remote. Key absence means no permission service is composed — clients hide the control."),
        subagentCatalog: array(union([object({
          id: string2().readonly(),
          createdAt: number2().readonly(),
          mode: literal("one-shot").readonly(),
          label: string2().readonly().optional()
        }), object({
          id: string2().readonly(),
          createdAt: number2().readonly(),
          mode: literal("external").readonly(),
          label: string2().readonly().optional()
        }), object({
          id: string2().readonly(),
          createdAt: number2().readonly(),
          mode: literal("continuable").readonly(),
          label: string2().readonly()
        }), object({
          id: string2().readonly(),
          createdAt: number2().readonly(),
          mode: literal("unknown").readonly(),
          label: string2().readonly().optional()
        })])).optional().describe("Direct children in parent catalog event order, excluding fork-inherited facts."),
        subagentTiming: object({
          settledMs: number2().describe("Milliseconds accumulated across completed turns after the child's own descriptor."),
          active: object({
            since: number2().describe("Start of the open turn."),
            through: number2().describe("Latest event time folded into this projection cut.")
          }).optional().describe("Same-cut bounds of the currently open turn, when one has not reached `turn/end`."),
          lastTurnCompleted: boolean2().optional().describe("Whether the latest closed turn after the child's own descriptor completed normally; absent while a turn is open or before one closes.")
        }).optional().describe("Active-turn duration and latest closed-turn completion for a descriptor-backed subagent session."),
        subagent: union([literal(null), object({
          mode: literal("one-shot").describe("A terminal one-shot child."),
          label: string2().optional().describe("Optional durable creation label from the child's descriptor."),
          seq: number2().describe("Seq of the `subagent/descriptor` event this identity was folded from. `session.isOwnSeq(seq)` proves the identity comes from the child's OWN log suffix — where a descriptor is immutable once appended — and not from a fork seed's replayed ancestor descriptor.")
        }), object({
          mode: literal("continuable").describe("A resumable conversation."),
          label: string2().describe("Durable creation label from the child's descriptor."),
          seq: number2().describe("Seq of the folded descriptor event; see the one-shot arm for the own-suffix proof.")
        })]).optional().describe("Identity of a descriptor-backed subagent session. `null` ⟺ no valid descriptor (missing, malformed, or unrecognized-version — deliberately undistinguished). The sentinel is deliberately serializable: a value pushed over JSON transports must survive `JSON.stringify` losslessly, where an `undefined` field would be dropped and a stale identity would survive on the receiving side. The entry itself stays non-optional."),
        tokenUsage: object({
          uncachedInputTokens: number2(),
          outputTokens: number2(),
          cacheReadTokens: number2(),
          cacheWriteTokens: number2()
        }).optional().describe("Provider-reported usage accumulated across the complete durable log."),
        contextPressure: object({
          pressureTokens: number2().optional().describe("Provider-reported prompt size of the most recent request: uncached input plus cache reads and writes. Response output is excluded, so this does not grow as the current turn streams. Absent until a provider reports usage."),
          projectedTokens: number2().optional().describe("What the NEXT request's prompt would cost: {@link pressureTokens} plus the heuristic repricing of everything the surface gained or lost since that sample. Only the delta is estimated, so the figure stays anchored to the provider while still reacting the moment a compaction shadows a span — which `pressureTokens` alone cannot do, since compaction reports no usage of its own. Absent until a provider reports usage."),
          contextWindow: number2().optional().describe("Newest recorded route capacity; absent when no adapter advertised one.")
        }).optional().describe("Newest request pressure paired with the newest known route capacity."),
        contextBreakdown: object({
          systemTokens: number2().describe("Heuristic tokens of the last nonempty surviving system prompt in surface order; 0 when none exists."),
          toolsTokens: number2().describe("Heuristic tokens of the newest request envelope's tool schemas; 0 before any request."),
          messageTokens: number2().describe("Heuristic tokens of every other visible surface node, including superseded system prompts.")
        }).optional().describe("Heuristic system/tools/message composition of the next request."),
        agentTeam: object({
          members: array(object({
            id: string2().readonly(),
            name: string2().readonly(),
            role: union([literal("lead"), literal("teammate")]).readonly(),
            phase: union([literal("failed"), literal("provisioning"), literal("active")]).readonly().describe("Durable lifecycle; the Lead row is always `active`. Turn activity comes from Session status."),
            error: string2().readonly().optional()
          })).readonly(),
          tasks: array(object({
            id: string2().readonly(),
            revision: number2().readonly(),
            subject: string2().readonly(),
            description: string2().readonly(),
            status: union([literal("completed"), literal("pending"), literal("in_progress"), literal("deleted")]).readonly(),
            blockedBy: array(string2()).readonly(),
            writeScopes: array(string2()).readonly(),
            ownerName: string2().readonly().optional(),
            ready: boolean2().readonly(),
            writeScopeWarnings: array(string2()).readonly()
          })).readonly(),
          failure: string2().readonly().optional()
        }).optional().describe("Durable roster and non-deleted task board of the Team rooted at the projected Session."),
        userQuestions: object({
          active: array(object({
            callId: string2().readonly(),
            questions: array(object({
              id: string2().describe("Stable caller-provided question id, echoed in the answer."),
              question: string2().describe("The question to display."),
              detail: string2().optional().describe("Optional supporting detail rendered with the question but kept out of option labels."),
              header: string2().optional().describe("Optional short heading/group label."),
              options: array(object({
                label: string2().describe("User-facing label."),
                description: string2().optional().describe("Optional extra context rendered by capable UIs.")
              })).optional().describe("Optional choices the UI can render as a menu."),
              multiSelect: boolean2().optional().describe("Whether more than one option may be selected. Defaults to single-select."),
              intent: object({
                kind: literal("plan-review").describe("A plan submitted for review: `detail` is the plan markdown `ask()` requires, and the decision approves or declines it."),
                approve: string2().describe("The option label that approves the plan; every other option declines it. Named rather than positional so no UI infers the verdict from option order. An `approve` naming no option of its own question is rejected at `ask()`."),
                callId: string2().optional().describe("Logged tool invocation whose arguments contain the reviewed plan.")
              }).optional().describe("Optional presentation intent for capable UIs; absent asks for the generic option list.")
            })).readonly(),
            state: union([literal("open"), literal("continued")]).readonly()
          })).readonly().describe("Calls that can still take an answer, in ask order."),
          settled: array(object({
            callId: string2().readonly().describe("The settled call."),
            answers: array(object({
              id: string2().describe("The answered question id."),
              selected: array(string2()).describe("Selected option labels. May accompany custom text for a multi-select question."),
              custom: string2().optional().describe('Optional free-text "Other" answer.')
            })).readonly().describe("The recorded batch, one entry per question; empty when the late reply carried none.")
          })).readonly().describe("Calls an answer settled, in settlement order.")
        }).optional().describe("Timed questions that remain answerable in this Session, and the ones a late reply settled."),
        goal: union([literal(null), object({
          goal: object({
            objective: string2().readonly().describe("Human-requested completion objective."),
            phase: union([literal("active"), literal("paused"), literal("blocked"), literal("complete")]).readonly().describe("Durable lifecycle phase."),
            blockedReason: object({
              code: string2().readonly().describe("Stable lower-kebab-case classification chosen by the blocking policy."),
              message: string2().readonly().describe("Non-empty explanation shown to humans and models.")
            }).readonly().optional().describe("Present exactly while `phase` is `blocked`."),
            maxGoalRounds: number2().readonly().describe("Total admitted goal-round cap."),
            id: string2().readonly().describe("Stable goal identity."),
            revision: number2().readonly().describe("Positive revision; every durable mutation increments it.")
          }).readonly().describe("Current durable goal snapshot (the CAS ref for mutations rides on it)."),
          roundsStarted: number2().readonly().describe("Highest admitted round number for this goal."),
          createdAt: number2().readonly().describe("Epoch milliseconds of the create mutation."),
          updatedAt: number2().readonly().describe("Epoch milliseconds of the latest mutation.")
        })]).optional().describe("The session's current goal and admitted-round count, or `null` before the first create and after a clear tombstone. `goal/change` supplies the whole lifecycle value; matching admitted `user/message` events advance `roundsStarted`."),
        plan: object({
          active: boolean2(),
          pending: boolean2()
        }).optional().describe("Plan collaboration state folded from the plan command lifecycle and `plan/mode` events.")
      }), record(string2(), json()).readonly()).readonly().describe("Provider-validated values; omitted keys are absent capabilities at this cut.")
    })).readonly().readonly()
  }).readonly()
}), object({
  type: literal("projection").readonly(),
  sessionId: string2().readonly(),
  key: string2().readonly(),
  value: json().readonly(),
  seq: number2().readonly()
})]);
var _deepseek_ai_dsh_api_session_controller_session_create_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_create_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_create_parameter_0$schema$value ??= object({
  workspaceId: string2().readonly().optional().describe("Workspace the Session joins; exclusive with `cwd`."),
  cwd: string2().readonly().optional().describe("Directory the Session owns when no Workspace is named."),
  sessionId: string2().readonly().optional().describe("Blank Session to reuse while it is reusable, or the identity of a new Session when none is stored under it."),
  agentPreset: string2().readonly().optional().describe("Preset the Session runs, replacing a reused Session's recorded preset; the configured default when omitted.")
});
var _deepseek_ai_dsh_api_session_controller_session_create_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_create_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_create_result$schema$value ??= object({
  sessionId: string2().readonly().describe("The created or reused Session, which may differ from the requested `sessionId`."),
  agentPreset: string2().readonly().optional().describe("Preset the Session runs, when the deployment composes a preset roster.")
});
var _deepseek_ai_dsh_api_session_controller_session_follow_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_follow_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_follow_parameter_0$schema$value ??= object({
  address: union([object({
    kind: literal("session").readonly(),
    sessionId: string2().readonly()
  }), object({
    kind: literal("subagent").readonly(),
    parentSessionId: string2().readonly(),
    childSessionId: string2().readonly(),
    mode: union([literal("one-shot"), literal("continuable"), literal("unknown")]).readonly()
  })]).readonly(),
  assistantStream: literal(true).readonly().optional().describe("Include process-local assistant presentation frames for the Web client."),
  maxMessages: number2().readonly().optional(),
  turnWindow: object({
    minMessages: number2().readonly().describe("Minimum append-origin user/assistant messages; must not exceed maxMessages."),
    minTurns: number2().readonly().describe("Minimum Turn starts crossed, including the partial Turn at beforeSeq.")
  }).readonly().optional().describe("Stop at a Turn start after both minima, unless maxMessages or history exhaustion wins.")
});
var _deepseek_ai_dsh_api_session_controller_session_follow_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_follow_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_follow_result$schema$value ??= union([object({
  type: literal("event").readonly(),
  event: object({
    type: string2().readonly(),
    seq: number2().readonly(),
    time: number2().readonly(),
    data: json().readonly(),
    ignorable: literal(true).readonly().optional(),
    sourceEventSeqs: json().readonly().optional().describe("Earlier sources on current surface events; opaque JSON on unknown ignorable events."),
    surfaceOp: json().readonly().optional().describe("Canonical placement on current surface events; opaque JSON on unknown ignorable events.")
  }).readonly()
}), object({
  type: literal("snapshot").readonly(),
  header: object({
    version: number2().readonly(),
    id: string2().readonly(),
    createdAt: number2().readonly(),
    cwd: string2().readonly().optional(),
    parentSession: string2().readonly().optional(),
    isSeeded: boolean2().readonly().describe("Whether the Session contains a fork-inherited prefix."),
    origin: literal("subagent").readonly().optional(),
    delegationDepth: number2().readonly().optional(),
    agentPreset: string2().readonly().optional()
  }).readonly(),
  cursor: number2().readonly(),
  records: array(object({
    type: literal("event").readonly(),
    event: object({
      type: string2().readonly(),
      seq: number2().readonly(),
      time: number2().readonly(),
      data: json().readonly(),
      ignorable: literal(true).readonly().optional(),
      sourceEventSeqs: json().readonly().optional().describe("Earlier sources on current surface events; opaque JSON on unknown ignorable events."),
      surfaceOp: json().readonly().optional().describe("Canonical placement on current surface events; opaque JSON on unknown ignorable events.")
    }).readonly()
  })).readonly(),
  hasMore: boolean2().readonly(),
  projections: object({
    asOfSeq: number2().readonly(),
    values: intersection(object({
      inbox: object({
        "next-turn": array(json()).readonly(),
        "next-step": array(json()).readonly()
      }).optional().describe("Pending agent input reconstructed from durable inbox splices."),
      workingDirectory: union([literal(null), string2()]).optional().describe("Recorded current directory for Session observations, or null when none is recorded."),
      agentPreset: union([literal(null), string2()]).optional().describe("Preset the Session runs, or null when the deployment composes none."),
      title: union([literal(null), string2()]).optional().describe("The session's current normalized title — the latest `session/title` event's text (last-wins), or `null` before the first title lands. A plain string: the shape the client list rows consume."),
      todos: union([literal(null), array(object({
        content: string2().describe("What this task is — a short imperative line shown in the UI."),
        status: union([literal("completed"), literal("pending"), literal("in_progress")]).describe("Lifecycle state. `in_progress` marks a task being worked now; parallel work may mark several.")
      }))]).optional().describe("The agent's current whole todo list (the latest `todo/write` snapshot), or `null` before the first write. Whole-value rule: every `todo/write` carries the complete replacement list, so the fold is last-wins."),
      sessionListMetadata: object({
        blank: boolean2().readonly().describe("Whether the folded prefix contains no turn."),
        lastPromptAt: union([literal(null), number2()]).readonly().describe("Latest human-authored prompt time in the folded prefix.")
      }).optional().describe("Persisted facts used to summarize a Session without activating it."),
      imageLimits: object({
        maxImageBytes: number2(),
        maxImagesPerMessage: number2(),
        maxMessageImageBytes: number2(),
        maxImagePixels: number2(),
        maxImageDimension: number2().describe("Maximum intrinsic width and maximum intrinsic height in pixels for one image."),
        mediaTypes: array(union([literal("image/png"), literal("image/jpeg"), literal("image/webp"), literal("image/gif")]))
      }).optional().describe("Image-intake limits enforced by the Session prompt endpoint."),
      modelSelection: object({
        lastUsed: union([literal(null), object({
          provider: string2().readonly(),
          model: string2().readonly(),
          reasoningEffort: string2().readonly().optional()
        })]).readonly().describe("Selection consumed by the latest recorded model request."),
        next: union([literal(null), object({
          provider: string2().readonly(),
          model: string2().readonly(),
          reasoningEffort: string2().readonly().optional()
        })]).readonly().describe("Selection the next request should use, falling back to {@link lastUsed}.")
      }).optional().describe("Durable model selection already used and selected for the next request."),
      permissions: object({
        currentValue: string2().describe("The effective current value: a configured preset key, `auto`, or `custom`.")
      }).optional().describe("The session's current permission, folded from the three whole-value knob events (`permission/preset`, `sandbox/mode`, `approval/policy`) over the composition defaults. Selectable options come from the process-level catalog Remote. Key absence means no permission service is composed — clients hide the control."),
      subagentCatalog: array(union([object({
        id: string2().readonly(),
        createdAt: number2().readonly(),
        mode: literal("one-shot").readonly(),
        label: string2().readonly().optional()
      }), object({
        id: string2().readonly(),
        createdAt: number2().readonly(),
        mode: literal("external").readonly(),
        label: string2().readonly().optional()
      }), object({
        id: string2().readonly(),
        createdAt: number2().readonly(),
        mode: literal("continuable").readonly(),
        label: string2().readonly()
      }), object({
        id: string2().readonly(),
        createdAt: number2().readonly(),
        mode: literal("unknown").readonly(),
        label: string2().readonly().optional()
      })])).optional().describe("Direct children in parent catalog event order, excluding fork-inherited facts."),
      subagentTiming: object({
        settledMs: number2().describe("Milliseconds accumulated across completed turns after the child's own descriptor."),
        active: object({
          since: number2().describe("Start of the open turn."),
          through: number2().describe("Latest event time folded into this projection cut.")
        }).optional().describe("Same-cut bounds of the currently open turn, when one has not reached `turn/end`."),
        lastTurnCompleted: boolean2().optional().describe("Whether the latest closed turn after the child's own descriptor completed normally; absent while a turn is open or before one closes.")
      }).optional().describe("Active-turn duration and latest closed-turn completion for a descriptor-backed subagent session."),
      subagent: union([literal(null), object({
        mode: literal("one-shot").describe("A terminal one-shot child."),
        label: string2().optional().describe("Optional durable creation label from the child's descriptor."),
        seq: number2().describe("Seq of the `subagent/descriptor` event this identity was folded from. `session.isOwnSeq(seq)` proves the identity comes from the child's OWN log suffix — where a descriptor is immutable once appended — and not from a fork seed's replayed ancestor descriptor.")
      }), object({
        mode: literal("continuable").describe("A resumable conversation."),
        label: string2().describe("Durable creation label from the child's descriptor."),
        seq: number2().describe("Seq of the folded descriptor event; see the one-shot arm for the own-suffix proof.")
      })]).optional().describe("Identity of a descriptor-backed subagent session. `null` ⟺ no valid descriptor (missing, malformed, or unrecognized-version — deliberately undistinguished). The sentinel is deliberately serializable: a value pushed over JSON transports must survive `JSON.stringify` losslessly, where an `undefined` field would be dropped and a stale identity would survive on the receiving side. The entry itself stays non-optional."),
      tokenUsage: object({
        uncachedInputTokens: number2(),
        outputTokens: number2(),
        cacheReadTokens: number2(),
        cacheWriteTokens: number2()
      }).optional().describe("Provider-reported usage accumulated across the complete durable log."),
      contextPressure: object({
        pressureTokens: number2().optional().describe("Provider-reported prompt size of the most recent request: uncached input plus cache reads and writes. Response output is excluded, so this does not grow as the current turn streams. Absent until a provider reports usage."),
        projectedTokens: number2().optional().describe("What the NEXT request's prompt would cost: {@link pressureTokens} plus the heuristic repricing of everything the surface gained or lost since that sample. Only the delta is estimated, so the figure stays anchored to the provider while still reacting the moment a compaction shadows a span — which `pressureTokens` alone cannot do, since compaction reports no usage of its own. Absent until a provider reports usage."),
        contextWindow: number2().optional().describe("Newest recorded route capacity; absent when no adapter advertised one.")
      }).optional().describe("Newest request pressure paired with the newest known route capacity."),
      contextBreakdown: object({
        systemTokens: number2().describe("Heuristic tokens of the last nonempty surviving system prompt in surface order; 0 when none exists."),
        toolsTokens: number2().describe("Heuristic tokens of the newest request envelope's tool schemas; 0 before any request."),
        messageTokens: number2().describe("Heuristic tokens of every other visible surface node, including superseded system prompts.")
      }).optional().describe("Heuristic system/tools/message composition of the next request."),
      agentTeam: object({
        members: array(object({
          id: string2().readonly(),
          name: string2().readonly(),
          role: union([literal("lead"), literal("teammate")]).readonly(),
          phase: union([literal("failed"), literal("provisioning"), literal("active")]).readonly().describe("Durable lifecycle; the Lead row is always `active`. Turn activity comes from Session status."),
          error: string2().readonly().optional()
        })).readonly(),
        tasks: array(object({
          id: string2().readonly(),
          revision: number2().readonly(),
          subject: string2().readonly(),
          description: string2().readonly(),
          status: union([literal("completed"), literal("pending"), literal("in_progress"), literal("deleted")]).readonly(),
          blockedBy: array(string2()).readonly(),
          writeScopes: array(string2()).readonly(),
          ownerName: string2().readonly().optional(),
          ready: boolean2().readonly(),
          writeScopeWarnings: array(string2()).readonly()
        })).readonly(),
        failure: string2().readonly().optional()
      }).optional().describe("Durable roster and non-deleted task board of the Team rooted at the projected Session."),
      userQuestions: object({
        active: array(object({
          callId: string2().readonly(),
          questions: array(object({
            id: string2().describe("Stable caller-provided question id, echoed in the answer."),
            question: string2().describe("The question to display."),
            detail: string2().optional().describe("Optional supporting detail rendered with the question but kept out of option labels."),
            header: string2().optional().describe("Optional short heading/group label."),
            options: array(object({
              label: string2().describe("User-facing label."),
              description: string2().optional().describe("Optional extra context rendered by capable UIs.")
            })).optional().describe("Optional choices the UI can render as a menu."),
            multiSelect: boolean2().optional().describe("Whether more than one option may be selected. Defaults to single-select."),
            intent: object({
              kind: literal("plan-review").describe("A plan submitted for review: `detail` is the plan markdown `ask()` requires, and the decision approves or declines it."),
              approve: string2().describe("The option label that approves the plan; every other option declines it. Named rather than positional so no UI infers the verdict from option order. An `approve` naming no option of its own question is rejected at `ask()`."),
              callId: string2().optional().describe("Logged tool invocation whose arguments contain the reviewed plan.")
            }).optional().describe("Optional presentation intent for capable UIs; absent asks for the generic option list.")
          })).readonly(),
          state: union([literal("open"), literal("continued")]).readonly()
        })).readonly().describe("Calls that can still take an answer, in ask order."),
        settled: array(object({
          callId: string2().readonly().describe("The settled call."),
          answers: array(object({
            id: string2().describe("The answered question id."),
            selected: array(string2()).describe("Selected option labels. May accompany custom text for a multi-select question."),
            custom: string2().optional().describe('Optional free-text "Other" answer.')
          })).readonly().describe("The recorded batch, one entry per question; empty when the late reply carried none.")
        })).readonly().describe("Calls an answer settled, in settlement order.")
      }).optional().describe("Timed questions that remain answerable in this Session, and the ones a late reply settled."),
      goal: union([literal(null), object({
        goal: object({
          objective: string2().readonly().describe("Human-requested completion objective."),
          phase: union([literal("active"), literal("paused"), literal("blocked"), literal("complete")]).readonly().describe("Durable lifecycle phase."),
          blockedReason: object({
            code: string2().readonly().describe("Stable lower-kebab-case classification chosen by the blocking policy."),
            message: string2().readonly().describe("Non-empty explanation shown to humans and models.")
          }).readonly().optional().describe("Present exactly while `phase` is `blocked`."),
          maxGoalRounds: number2().readonly().describe("Total admitted goal-round cap."),
          id: string2().readonly().describe("Stable goal identity."),
          revision: number2().readonly().describe("Positive revision; every durable mutation increments it.")
        }).readonly().describe("Current durable goal snapshot (the CAS ref for mutations rides on it)."),
        roundsStarted: number2().readonly().describe("Highest admitted round number for this goal."),
        createdAt: number2().readonly().describe("Epoch milliseconds of the create mutation."),
        updatedAt: number2().readonly().describe("Epoch milliseconds of the latest mutation.")
      })]).optional().describe("The session's current goal and admitted-round count, or `null` before the first create and after a clear tombstone. `goal/change` supplies the whole lifecycle value; matching admitted `user/message` events advance `roundsStarted`."),
      plan: object({
        active: boolean2(),
        pending: boolean2()
      }).optional().describe("Plan collaboration state folded from the plan command lifecycle and `plan/mode` events.")
    }), record(string2(), json()).readonly()).readonly().describe("Provider-validated values; omitted keys are absent capabilities at this cut.")
  }).readonly(),
  assistantStream: object({
    revision: number2().readonly(),
    activeAttempt: object({
      attemptId: string2().readonly(),
      startedAfterSeq: union([number2(), literal(-1)]).readonly().describe("Last durable Session seq observed when this attempt started."),
      turn: number2().readonly(),
      step: number2().readonly(),
      nextIndex: number2().readonly().describe("Dense position expected for the next live chunk frame."),
      stream: array(json()).readonly().describe("Compact detached stream accumulated at this opening revision.")
    }).readonly().optional()
  }).readonly().optional()
}), object({
  type: literal("assistant-stream").readonly(),
  frame: union([object({
    type: literal("start").readonly(),
    attemptId: string2().readonly(),
    revision: number2().readonly(),
    startedAfterSeq: union([number2(), literal(-1)]).readonly(),
    turn: number2().readonly(),
    step: number2().readonly()
  }), object({
    type: literal("chunk").readonly(),
    attemptId: string2().readonly(),
    revision: number2().readonly(),
    index: number2().readonly(),
    time: number2().readonly(),
    chunk: json().readonly()
  }), object({
    type: literal("end").readonly(),
    attemptId: string2().readonly(),
    revision: number2().readonly(),
    index: number2().readonly().describe("Number of chunk frames represented by this terminal marker."),
    outcome: union([object({
      kind: literal("committed").readonly(),
      eventType: union([literal("assistant/message"), literal("assistant/attempt")]).readonly(),
      seq: number2().readonly()
    }), object({
      kind: literal("abandoned").readonly()
    })]).readonly()
  })]).readonly()
})]);
var _deepseek_ai_dsh_api_session_controller_session_fork_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_fork_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_fork_parameter_0$schema$value ??= object({
  sessionId: string2().readonly(),
  atSeq: number2().readonly().optional().describe("Exact inclusive source event seq; omission selects the latest completed-turn prefix."),
  allowMigration: boolean2().readonly().optional().describe("False asks the Host to check for required migration before forking. Defaults to true.")
});
var _deepseek_ai_dsh_api_session_controller_session_fork_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_fork_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_fork_result$schema$value ??= object({
  sessionId: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_initializeDefaultModel_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_initializeDefaultModel_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_initializeDefaultModel_result$schema$value ??= _void2();
var _deepseek_ai_dsh_api_session_controller_session_list_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_list_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_list_parameter_0$schema$value ??= object({
  cursor: string2().readonly().optional()
});
var _deepseek_ai_dsh_api_session_controller_session_list_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_list_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_list_result$schema$value ??= object({
  items: array(object({
    agentAvailable: boolean2().readonly().describe("Whether this Session currently owns a live Agent."),
    formatStatus: union([literal("current"), literal("migration-required")]).readonly().optional().describe("Current for attached Sessions; otherwise the persistence format status when reported."),
    sessionId: string2().readonly(),
    updatedAt: number2().readonly(),
    running: boolean2().readonly(),
    blank: boolean2().readonly(),
    parentSessionId: string2().readonly().optional(),
    origin: literal("subagent").readonly().optional(),
    cwd: string2().readonly().optional(),
    projections: object({
      kind: union([literal("cached"), literal("sequenced")]).readonly().describe("`sequenced`: the Host's live registry produced the block for an attached Session, so `asOfSeq` is comparable with baselines and frames of the same connection. `cached`: a header-only listing viewed the block from the persisted projection cache, so `asOfSeq` is the stored record's own watermark and must not be compared with the connected Session's values."),
      asOfSeq: number2().readonly().describe("Watermark of the block in the sequence space named by `kind`."),
      values: intersection(object({
        inbox: object({
          "next-turn": array(json()).readonly(),
          "next-step": array(json()).readonly()
        }).optional().describe("Pending agent input reconstructed from durable inbox splices."),
        workingDirectory: union([literal(null), string2()]).optional().describe("Recorded current directory for Session observations, or null when none is recorded."),
        agentPreset: union([literal(null), string2()]).optional().describe("Preset the Session runs, or null when the deployment composes none."),
        title: union([literal(null), string2()]).optional().describe("The session's current normalized title — the latest `session/title` event's text (last-wins), or `null` before the first title lands. A plain string: the shape the client list rows consume."),
        todos: union([literal(null), array(object({
          content: string2().describe("What this task is — a short imperative line shown in the UI."),
          status: union([literal("completed"), literal("pending"), literal("in_progress")]).describe("Lifecycle state. `in_progress` marks a task being worked now; parallel work may mark several.")
        }))]).optional().describe("The agent's current whole todo list (the latest `todo/write` snapshot), or `null` before the first write. Whole-value rule: every `todo/write` carries the complete replacement list, so the fold is last-wins."),
        sessionListMetadata: object({
          blank: boolean2().readonly().describe("Whether the folded prefix contains no turn."),
          lastPromptAt: union([literal(null), number2()]).readonly().describe("Latest human-authored prompt time in the folded prefix.")
        }).optional().describe("Persisted facts used to summarize a Session without activating it."),
        imageLimits: object({
          maxImageBytes: number2(),
          maxImagesPerMessage: number2(),
          maxMessageImageBytes: number2(),
          maxImagePixels: number2(),
          maxImageDimension: number2().describe("Maximum intrinsic width and maximum intrinsic height in pixels for one image."),
          mediaTypes: array(union([literal("image/png"), literal("image/jpeg"), literal("image/webp"), literal("image/gif")]))
        }).optional().describe("Image-intake limits enforced by the Session prompt endpoint."),
        modelSelection: object({
          lastUsed: union([literal(null), object({
            provider: string2().readonly(),
            model: string2().readonly(),
            reasoningEffort: string2().readonly().optional()
          })]).readonly().describe("Selection consumed by the latest recorded model request."),
          next: union([literal(null), object({
            provider: string2().readonly(),
            model: string2().readonly(),
            reasoningEffort: string2().readonly().optional()
          })]).readonly().describe("Selection the next request should use, falling back to {@link lastUsed}.")
        }).optional().describe("Durable model selection already used and selected for the next request."),
        permissions: object({
          currentValue: string2().describe("The effective current value: a configured preset key, `auto`, or `custom`.")
        }).optional().describe("The session's current permission, folded from the three whole-value knob events (`permission/preset`, `sandbox/mode`, `approval/policy`) over the composition defaults. Selectable options come from the process-level catalog Remote. Key absence means no permission service is composed — clients hide the control."),
        subagentCatalog: array(union([object({
          id: string2().readonly(),
          createdAt: number2().readonly(),
          mode: literal("one-shot").readonly(),
          label: string2().readonly().optional()
        }), object({
          id: string2().readonly(),
          createdAt: number2().readonly(),
          mode: literal("external").readonly(),
          label: string2().readonly().optional()
        }), object({
          id: string2().readonly(),
          createdAt: number2().readonly(),
          mode: literal("continuable").readonly(),
          label: string2().readonly()
        }), object({
          id: string2().readonly(),
          createdAt: number2().readonly(),
          mode: literal("unknown").readonly(),
          label: string2().readonly().optional()
        })])).optional().describe("Direct children in parent catalog event order, excluding fork-inherited facts."),
        subagentTiming: object({
          settledMs: number2().describe("Milliseconds accumulated across completed turns after the child's own descriptor."),
          active: object({
            since: number2().describe("Start of the open turn."),
            through: number2().describe("Latest event time folded into this projection cut.")
          }).optional().describe("Same-cut bounds of the currently open turn, when one has not reached `turn/end`."),
          lastTurnCompleted: boolean2().optional().describe("Whether the latest closed turn after the child's own descriptor completed normally; absent while a turn is open or before one closes.")
        }).optional().describe("Active-turn duration and latest closed-turn completion for a descriptor-backed subagent session."),
        subagent: union([literal(null), object({
          mode: literal("one-shot").describe("A terminal one-shot child."),
          label: string2().optional().describe("Optional durable creation label from the child's descriptor."),
          seq: number2().describe("Seq of the `subagent/descriptor` event this identity was folded from. `session.isOwnSeq(seq)` proves the identity comes from the child's OWN log suffix — where a descriptor is immutable once appended — and not from a fork seed's replayed ancestor descriptor.")
        }), object({
          mode: literal("continuable").describe("A resumable conversation."),
          label: string2().describe("Durable creation label from the child's descriptor."),
          seq: number2().describe("Seq of the folded descriptor event; see the one-shot arm for the own-suffix proof.")
        })]).optional().describe("Identity of a descriptor-backed subagent session. `null` ⟺ no valid descriptor (missing, malformed, or unrecognized-version — deliberately undistinguished). The sentinel is deliberately serializable: a value pushed over JSON transports must survive `JSON.stringify` losslessly, where an `undefined` field would be dropped and a stale identity would survive on the receiving side. The entry itself stays non-optional."),
        tokenUsage: object({
          uncachedInputTokens: number2(),
          outputTokens: number2(),
          cacheReadTokens: number2(),
          cacheWriteTokens: number2()
        }).optional().describe("Provider-reported usage accumulated across the complete durable log."),
        contextPressure: object({
          pressureTokens: number2().optional().describe("Provider-reported prompt size of the most recent request: uncached input plus cache reads and writes. Response output is excluded, so this does not grow as the current turn streams. Absent until a provider reports usage."),
          projectedTokens: number2().optional().describe("What the NEXT request's prompt would cost: {@link pressureTokens} plus the heuristic repricing of everything the surface gained or lost since that sample. Only the delta is estimated, so the figure stays anchored to the provider while still reacting the moment a compaction shadows a span — which `pressureTokens` alone cannot do, since compaction reports no usage of its own. Absent until a provider reports usage."),
          contextWindow: number2().optional().describe("Newest recorded route capacity; absent when no adapter advertised one.")
        }).optional().describe("Newest request pressure paired with the newest known route capacity."),
        contextBreakdown: object({
          systemTokens: number2().describe("Heuristic tokens of the last nonempty surviving system prompt in surface order; 0 when none exists."),
          toolsTokens: number2().describe("Heuristic tokens of the newest request envelope's tool schemas; 0 before any request."),
          messageTokens: number2().describe("Heuristic tokens of every other visible surface node, including superseded system prompts.")
        }).optional().describe("Heuristic system/tools/message composition of the next request."),
        agentTeam: object({
          members: array(object({
            id: string2().readonly(),
            name: string2().readonly(),
            role: union([literal("lead"), literal("teammate")]).readonly(),
            phase: union([literal("failed"), literal("provisioning"), literal("active")]).readonly().describe("Durable lifecycle; the Lead row is always `active`. Turn activity comes from Session status."),
            error: string2().readonly().optional()
          })).readonly(),
          tasks: array(object({
            id: string2().readonly(),
            revision: number2().readonly(),
            subject: string2().readonly(),
            description: string2().readonly(),
            status: union([literal("completed"), literal("pending"), literal("in_progress"), literal("deleted")]).readonly(),
            blockedBy: array(string2()).readonly(),
            writeScopes: array(string2()).readonly(),
            ownerName: string2().readonly().optional(),
            ready: boolean2().readonly(),
            writeScopeWarnings: array(string2()).readonly()
          })).readonly(),
          failure: string2().readonly().optional()
        }).optional().describe("Durable roster and non-deleted task board of the Team rooted at the projected Session."),
        userQuestions: object({
          active: array(object({
            callId: string2().readonly(),
            questions: array(object({
              id: string2().describe("Stable caller-provided question id, echoed in the answer."),
              question: string2().describe("The question to display."),
              detail: string2().optional().describe("Optional supporting detail rendered with the question but kept out of option labels."),
              header: string2().optional().describe("Optional short heading/group label."),
              options: array(object({
                label: string2().describe("User-facing label."),
                description: string2().optional().describe("Optional extra context rendered by capable UIs.")
              })).optional().describe("Optional choices the UI can render as a menu."),
              multiSelect: boolean2().optional().describe("Whether more than one option may be selected. Defaults to single-select."),
              intent: object({
                kind: literal("plan-review").describe("A plan submitted for review: `detail` is the plan markdown `ask()` requires, and the decision approves or declines it."),
                approve: string2().describe("The option label that approves the plan; every other option declines it. Named rather than positional so no UI infers the verdict from option order. An `approve` naming no option of its own question is rejected at `ask()`."),
                callId: string2().optional().describe("Logged tool invocation whose arguments contain the reviewed plan.")
              }).optional().describe("Optional presentation intent for capable UIs; absent asks for the generic option list.")
            })).readonly(),
            state: union([literal("open"), literal("continued")]).readonly()
          })).readonly().describe("Calls that can still take an answer, in ask order."),
          settled: array(object({
            callId: string2().readonly().describe("The settled call."),
            answers: array(object({
              id: string2().describe("The answered question id."),
              selected: array(string2()).describe("Selected option labels. May accompany custom text for a multi-select question."),
              custom: string2().optional().describe('Optional free-text "Other" answer.')
            })).readonly().describe("The recorded batch, one entry per question; empty when the late reply carried none.")
          })).readonly().describe("Calls an answer settled, in settlement order.")
        }).optional().describe("Timed questions that remain answerable in this Session, and the ones a late reply settled."),
        goal: union([literal(null), object({
          goal: object({
            objective: string2().readonly().describe("Human-requested completion objective."),
            phase: union([literal("active"), literal("paused"), literal("blocked"), literal("complete")]).readonly().describe("Durable lifecycle phase."),
            blockedReason: object({
              code: string2().readonly().describe("Stable lower-kebab-case classification chosen by the blocking policy."),
              message: string2().readonly().describe("Non-empty explanation shown to humans and models.")
            }).readonly().optional().describe("Present exactly while `phase` is `blocked`."),
            maxGoalRounds: number2().readonly().describe("Total admitted goal-round cap."),
            id: string2().readonly().describe("Stable goal identity."),
            revision: number2().readonly().describe("Positive revision; every durable mutation increments it.")
          }).readonly().describe("Current durable goal snapshot (the CAS ref for mutations rides on it)."),
          roundsStarted: number2().readonly().describe("Highest admitted round number for this goal."),
          createdAt: number2().readonly().describe("Epoch milliseconds of the create mutation."),
          updatedAt: number2().readonly().describe("Epoch milliseconds of the latest mutation.")
        })]).optional().describe("The session's current goal and admitted-round count, or `null` before the first create and after a clear tombstone. `goal/change` supplies the whole lifecycle value; matching admitted `user/message` events advance `roundsStarted`."),
        plan: object({
          active: boolean2(),
          pending: boolean2()
        }).optional().describe("Plan collaboration state folded from the plan command lifecycle and `plan/mode` events.")
      }), record(string2(), json()).readonly()).readonly().describe("Provider-validated values present in the block; omitted keys remain unknown.")
    }).readonly().optional()
  })).readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_modelCatalog_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_modelCatalog_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_modelCatalog_result$schema$value ??= object({
  default: object({
    provider: string2().readonly(),
    model: string2().readonly(),
    reasoningEffort: string2().readonly().optional()
  }).readonly(),
  routableProviders: array(string2()).readonly().describe("Provider routes with at least one currently available catalog model."),
  groups: array(object({
    id: string2().readonly(),
    name: string2().readonly(),
    models: array(object({
      id: string2().readonly(),
      name: string2().readonly(),
      description: string2().readonly().optional(),
      reasoning: object({
        efforts: array(object({
          id: string2().readonly(),
          name: string2().readonly(),
          description: string2().readonly().optional()
        })).readonly(),
        defaultEffort: string2().readonly().optional()
      }).readonly().optional()
    })).readonly()
  })).readonly(),
  failures: array(object({
    id: string2().readonly(),
    name: string2().readonly(),
    message: string2().readonly()
  })).readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_parameter_0$schema$value ??= object({
  action: literal("reveal").readonly().optional().describe("File-manager navigation when requested; omission uses the default application."),
  application: string2().readonly().optional().describe("Registered application identifier; ignored for reveal. Omission preserves the operating system default."),
  path: string2().readonly().describe("Path after best-effort Session workspace resolution, in Host filesystem syntax.")
});
var _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_result$schema$value ??= object({
  opened: literal(true).readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_page_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_page_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_page_parameter_0$schema$value ??= object({
  address: union([object({
    kind: literal("session").readonly(),
    sessionId: string2().readonly()
  }), object({
    kind: literal("subagent").readonly(),
    parentSessionId: string2().readonly(),
    childSessionId: string2().readonly(),
    mode: union([literal("one-shot"), literal("continuable"), literal("unknown")]).readonly()
  })]).readonly(),
  throughSeq: number2().readonly().describe("Inclusive log cut obtained from the corresponding follow opening frame."),
  beforeSeq: number2().readonly().optional(),
  maxMessages: number2().readonly().optional(),
  turnWindow: object({
    minMessages: number2().readonly().describe("Minimum append-origin user/assistant messages; must not exceed maxMessages."),
    minTurns: number2().readonly().describe("Minimum Turn starts crossed, including the partial Turn at beforeSeq.")
  }).readonly().optional().describe("Stop at a Turn start after both minima, unless maxMessages or history exhaustion wins.")
});
var _deepseek_ai_dsh_api_session_controller_session_page_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_page_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_page_result$schema$value ??= object({
  records: array(object({
    type: literal("event").readonly(),
    event: object({
      type: string2().readonly(),
      seq: number2().readonly(),
      time: number2().readonly(),
      data: json().readonly(),
      ignorable: literal(true).readonly().optional(),
      sourceEventSeqs: json().readonly().optional().describe("Earlier sources on current surface events; opaque JSON on unknown ignorable events."),
      surfaceOp: json().readonly().optional().describe("Canonical placement on current surface events; opaque JSON on unknown ignorable events.")
    }).readonly()
  })).readonly(),
  hasMore: boolean2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_projections_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_projections_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_projections_parameter_0$schema$value ??= object({
  sessionId: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_projections_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_projections_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_projections_result$schema$value ??= union([literal(null), object({
  asOfSeq: number2().readonly(),
  values: intersection(object({
    inbox: object({
      "next-turn": array(json()).readonly(),
      "next-step": array(json()).readonly()
    }).optional().describe("Pending agent input reconstructed from durable inbox splices."),
    workingDirectory: union([literal(null), string2()]).optional().describe("Recorded current directory for Session observations, or null when none is recorded."),
    agentPreset: union([literal(null), string2()]).optional().describe("Preset the Session runs, or null when the deployment composes none."),
    title: union([literal(null), string2()]).optional().describe("The session's current normalized title — the latest `session/title` event's text (last-wins), or `null` before the first title lands. A plain string: the shape the client list rows consume."),
    todos: union([literal(null), array(object({
      content: string2().describe("What this task is — a short imperative line shown in the UI."),
      status: union([literal("completed"), literal("pending"), literal("in_progress")]).describe("Lifecycle state. `in_progress` marks a task being worked now; parallel work may mark several.")
    }))]).optional().describe("The agent's current whole todo list (the latest `todo/write` snapshot), or `null` before the first write. Whole-value rule: every `todo/write` carries the complete replacement list, so the fold is last-wins."),
    sessionListMetadata: object({
      blank: boolean2().readonly().describe("Whether the folded prefix contains no turn."),
      lastPromptAt: union([literal(null), number2()]).readonly().describe("Latest human-authored prompt time in the folded prefix.")
    }).optional().describe("Persisted facts used to summarize a Session without activating it."),
    imageLimits: object({
      maxImageBytes: number2(),
      maxImagesPerMessage: number2(),
      maxMessageImageBytes: number2(),
      maxImagePixels: number2(),
      maxImageDimension: number2().describe("Maximum intrinsic width and maximum intrinsic height in pixels for one image."),
      mediaTypes: array(union([literal("image/png"), literal("image/jpeg"), literal("image/webp"), literal("image/gif")]))
    }).optional().describe("Image-intake limits enforced by the Session prompt endpoint."),
    modelSelection: object({
      lastUsed: union([literal(null), object({
        provider: string2().readonly(),
        model: string2().readonly(),
        reasoningEffort: string2().readonly().optional()
      })]).readonly().describe("Selection consumed by the latest recorded model request."),
      next: union([literal(null), object({
        provider: string2().readonly(),
        model: string2().readonly(),
        reasoningEffort: string2().readonly().optional()
      })]).readonly().describe("Selection the next request should use, falling back to {@link lastUsed}.")
    }).optional().describe("Durable model selection already used and selected for the next request."),
    permissions: object({
      currentValue: string2().describe("The effective current value: a configured preset key, `auto`, or `custom`.")
    }).optional().describe("The session's current permission, folded from the three whole-value knob events (`permission/preset`, `sandbox/mode`, `approval/policy`) over the composition defaults. Selectable options come from the process-level catalog Remote. Key absence means no permission service is composed — clients hide the control."),
    subagentCatalog: array(union([object({
      id: string2().readonly(),
      createdAt: number2().readonly(),
      mode: literal("one-shot").readonly(),
      label: string2().readonly().optional()
    }), object({
      id: string2().readonly(),
      createdAt: number2().readonly(),
      mode: literal("external").readonly(),
      label: string2().readonly().optional()
    }), object({
      id: string2().readonly(),
      createdAt: number2().readonly(),
      mode: literal("continuable").readonly(),
      label: string2().readonly()
    }), object({
      id: string2().readonly(),
      createdAt: number2().readonly(),
      mode: literal("unknown").readonly(),
      label: string2().readonly().optional()
    })])).optional().describe("Direct children in parent catalog event order, excluding fork-inherited facts."),
    subagentTiming: object({
      settledMs: number2().describe("Milliseconds accumulated across completed turns after the child's own descriptor."),
      active: object({
        since: number2().describe("Start of the open turn."),
        through: number2().describe("Latest event time folded into this projection cut.")
      }).optional().describe("Same-cut bounds of the currently open turn, when one has not reached `turn/end`."),
      lastTurnCompleted: boolean2().optional().describe("Whether the latest closed turn after the child's own descriptor completed normally; absent while a turn is open or before one closes.")
    }).optional().describe("Active-turn duration and latest closed-turn completion for a descriptor-backed subagent session."),
    subagent: union([literal(null), object({
      mode: literal("one-shot").describe("A terminal one-shot child."),
      label: string2().optional().describe("Optional durable creation label from the child's descriptor."),
      seq: number2().describe("Seq of the `subagent/descriptor` event this identity was folded from. `session.isOwnSeq(seq)` proves the identity comes from the child's OWN log suffix — where a descriptor is immutable once appended — and not from a fork seed's replayed ancestor descriptor.")
    }), object({
      mode: literal("continuable").describe("A resumable conversation."),
      label: string2().describe("Durable creation label from the child's descriptor."),
      seq: number2().describe("Seq of the folded descriptor event; see the one-shot arm for the own-suffix proof.")
    })]).optional().describe("Identity of a descriptor-backed subagent session. `null` ⟺ no valid descriptor (missing, malformed, or unrecognized-version — deliberately undistinguished). The sentinel is deliberately serializable: a value pushed over JSON transports must survive `JSON.stringify` losslessly, where an `undefined` field would be dropped and a stale identity would survive on the receiving side. The entry itself stays non-optional."),
    tokenUsage: object({
      uncachedInputTokens: number2(),
      outputTokens: number2(),
      cacheReadTokens: number2(),
      cacheWriteTokens: number2()
    }).optional().describe("Provider-reported usage accumulated across the complete durable log."),
    contextPressure: object({
      pressureTokens: number2().optional().describe("Provider-reported prompt size of the most recent request: uncached input plus cache reads and writes. Response output is excluded, so this does not grow as the current turn streams. Absent until a provider reports usage."),
      projectedTokens: number2().optional().describe("What the NEXT request's prompt would cost: {@link pressureTokens} plus the heuristic repricing of everything the surface gained or lost since that sample. Only the delta is estimated, so the figure stays anchored to the provider while still reacting the moment a compaction shadows a span — which `pressureTokens` alone cannot do, since compaction reports no usage of its own. Absent until a provider reports usage."),
      contextWindow: number2().optional().describe("Newest recorded route capacity; absent when no adapter advertised one.")
    }).optional().describe("Newest request pressure paired with the newest known route capacity."),
    contextBreakdown: object({
      systemTokens: number2().describe("Heuristic tokens of the last nonempty surviving system prompt in surface order; 0 when none exists."),
      toolsTokens: number2().describe("Heuristic tokens of the newest request envelope's tool schemas; 0 before any request."),
      messageTokens: number2().describe("Heuristic tokens of every other visible surface node, including superseded system prompts.")
    }).optional().describe("Heuristic system/tools/message composition of the next request."),
    agentTeam: object({
      members: array(object({
        id: string2().readonly(),
        name: string2().readonly(),
        role: union([literal("lead"), literal("teammate")]).readonly(),
        phase: union([literal("failed"), literal("provisioning"), literal("active")]).readonly().describe("Durable lifecycle; the Lead row is always `active`. Turn activity comes from Session status."),
        error: string2().readonly().optional()
      })).readonly(),
      tasks: array(object({
        id: string2().readonly(),
        revision: number2().readonly(),
        subject: string2().readonly(),
        description: string2().readonly(),
        status: union([literal("completed"), literal("pending"), literal("in_progress"), literal("deleted")]).readonly(),
        blockedBy: array(string2()).readonly(),
        writeScopes: array(string2()).readonly(),
        ownerName: string2().readonly().optional(),
        ready: boolean2().readonly(),
        writeScopeWarnings: array(string2()).readonly()
      })).readonly(),
      failure: string2().readonly().optional()
    }).optional().describe("Durable roster and non-deleted task board of the Team rooted at the projected Session."),
    userQuestions: object({
      active: array(object({
        callId: string2().readonly(),
        questions: array(object({
          id: string2().describe("Stable caller-provided question id, echoed in the answer."),
          question: string2().describe("The question to display."),
          detail: string2().optional().describe("Optional supporting detail rendered with the question but kept out of option labels."),
          header: string2().optional().describe("Optional short heading/group label."),
          options: array(object({
            label: string2().describe("User-facing label."),
            description: string2().optional().describe("Optional extra context rendered by capable UIs.")
          })).optional().describe("Optional choices the UI can render as a menu."),
          multiSelect: boolean2().optional().describe("Whether more than one option may be selected. Defaults to single-select."),
          intent: object({
            kind: literal("plan-review").describe("A plan submitted for review: `detail` is the plan markdown `ask()` requires, and the decision approves or declines it."),
            approve: string2().describe("The option label that approves the plan; every other option declines it. Named rather than positional so no UI infers the verdict from option order. An `approve` naming no option of its own question is rejected at `ask()`."),
            callId: string2().optional().describe("Logged tool invocation whose arguments contain the reviewed plan.")
          }).optional().describe("Optional presentation intent for capable UIs; absent asks for the generic option list.")
        })).readonly(),
        state: union([literal("open"), literal("continued")]).readonly()
      })).readonly().describe("Calls that can still take an answer, in ask order."),
      settled: array(object({
        callId: string2().readonly().describe("The settled call."),
        answers: array(object({
          id: string2().describe("The answered question id."),
          selected: array(string2()).describe("Selected option labels. May accompany custom text for a multi-select question."),
          custom: string2().optional().describe('Optional free-text "Other" answer.')
        })).readonly().describe("The recorded batch, one entry per question; empty when the late reply carried none.")
      })).readonly().describe("Calls an answer settled, in settlement order.")
    }).optional().describe("Timed questions that remain answerable in this Session, and the ones a late reply settled."),
    goal: union([literal(null), object({
      goal: object({
        objective: string2().readonly().describe("Human-requested completion objective."),
        phase: union([literal("active"), literal("paused"), literal("blocked"), literal("complete")]).readonly().describe("Durable lifecycle phase."),
        blockedReason: object({
          code: string2().readonly().describe("Stable lower-kebab-case classification chosen by the blocking policy."),
          message: string2().readonly().describe("Non-empty explanation shown to humans and models.")
        }).readonly().optional().describe("Present exactly while `phase` is `blocked`."),
        maxGoalRounds: number2().readonly().describe("Total admitted goal-round cap."),
        id: string2().readonly().describe("Stable goal identity."),
        revision: number2().readonly().describe("Positive revision; every durable mutation increments it.")
      }).readonly().describe("Current durable goal snapshot (the CAS ref for mutations rides on it)."),
      roundsStarted: number2().readonly().describe("Highest admitted round number for this goal."),
      createdAt: number2().readonly().describe("Epoch milliseconds of the create mutation."),
      updatedAt: number2().readonly().describe("Epoch milliseconds of the latest mutation.")
    })]).optional().describe("The session's current goal and admitted-round count, or `null` before the first create and after a clear tombstone. `goal/change` supplies the whole lifecycle value; matching admitted `user/message` events advance `roundsStarted`."),
    plan: object({
      active: boolean2(),
      pending: boolean2()
    }).optional().describe("Plan collaboration state folded from the plan command lifecycle and `plan/mode` events.")
  }), record(string2(), json()).readonly()).readonly().describe("Provider-validated values; omitted keys are absent capabilities at this cut."),
  kind: literal("sequenced").readonly()
}), object({
  kind: literal("migration-required").readonly(),
  values: intersection(object({
    inbox: object({
      "next-turn": array(json()).readonly(),
      "next-step": array(json()).readonly()
    }).optional().describe("Pending agent input reconstructed from durable inbox splices."),
    workingDirectory: union([literal(null), string2()]).optional().describe("Recorded current directory for Session observations, or null when none is recorded."),
    agentPreset: union([literal(null), string2()]).optional().describe("Preset the Session runs, or null when the deployment composes none."),
    title: union([literal(null), string2()]).optional().describe("The session's current normalized title — the latest `session/title` event's text (last-wins), or `null` before the first title lands. A plain string: the shape the client list rows consume."),
    todos: union([literal(null), array(object({
      content: string2().describe("What this task is — a short imperative line shown in the UI."),
      status: union([literal("completed"), literal("pending"), literal("in_progress")]).describe("Lifecycle state. `in_progress` marks a task being worked now; parallel work may mark several.")
    }))]).optional().describe("The agent's current whole todo list (the latest `todo/write` snapshot), or `null` before the first write. Whole-value rule: every `todo/write` carries the complete replacement list, so the fold is last-wins."),
    sessionListMetadata: object({
      blank: boolean2().readonly().describe("Whether the folded prefix contains no turn."),
      lastPromptAt: union([literal(null), number2()]).readonly().describe("Latest human-authored prompt time in the folded prefix.")
    }).optional().describe("Persisted facts used to summarize a Session without activating it."),
    imageLimits: object({
      maxImageBytes: number2(),
      maxImagesPerMessage: number2(),
      maxMessageImageBytes: number2(),
      maxImagePixels: number2(),
      maxImageDimension: number2().describe("Maximum intrinsic width and maximum intrinsic height in pixels for one image."),
      mediaTypes: array(union([literal("image/png"), literal("image/jpeg"), literal("image/webp"), literal("image/gif")]))
    }).optional().describe("Image-intake limits enforced by the Session prompt endpoint."),
    modelSelection: object({
      lastUsed: union([literal(null), object({
        provider: string2().readonly(),
        model: string2().readonly(),
        reasoningEffort: string2().readonly().optional()
      })]).readonly().describe("Selection consumed by the latest recorded model request."),
      next: union([literal(null), object({
        provider: string2().readonly(),
        model: string2().readonly(),
        reasoningEffort: string2().readonly().optional()
      })]).readonly().describe("Selection the next request should use, falling back to {@link lastUsed}.")
    }).optional().describe("Durable model selection already used and selected for the next request."),
    permissions: object({
      currentValue: string2().describe("The effective current value: a configured preset key, `auto`, or `custom`.")
    }).optional().describe("The session's current permission, folded from the three whole-value knob events (`permission/preset`, `sandbox/mode`, `approval/policy`) over the composition defaults. Selectable options come from the process-level catalog Remote. Key absence means no permission service is composed — clients hide the control."),
    subagentCatalog: array(union([object({
      id: string2().readonly(),
      createdAt: number2().readonly(),
      mode: literal("one-shot").readonly(),
      label: string2().readonly().optional()
    }), object({
      id: string2().readonly(),
      createdAt: number2().readonly(),
      mode: literal("external").readonly(),
      label: string2().readonly().optional()
    }), object({
      id: string2().readonly(),
      createdAt: number2().readonly(),
      mode: literal("continuable").readonly(),
      label: string2().readonly()
    }), object({
      id: string2().readonly(),
      createdAt: number2().readonly(),
      mode: literal("unknown").readonly(),
      label: string2().readonly().optional()
    })])).optional().describe("Direct children in parent catalog event order, excluding fork-inherited facts."),
    subagentTiming: object({
      settledMs: number2().describe("Milliseconds accumulated across completed turns after the child's own descriptor."),
      active: object({
        since: number2().describe("Start of the open turn."),
        through: number2().describe("Latest event time folded into this projection cut.")
      }).optional().describe("Same-cut bounds of the currently open turn, when one has not reached `turn/end`."),
      lastTurnCompleted: boolean2().optional().describe("Whether the latest closed turn after the child's own descriptor completed normally; absent while a turn is open or before one closes.")
    }).optional().describe("Active-turn duration and latest closed-turn completion for a descriptor-backed subagent session."),
    subagent: union([literal(null), object({
      mode: literal("one-shot").describe("A terminal one-shot child."),
      label: string2().optional().describe("Optional durable creation label from the child's descriptor."),
      seq: number2().describe("Seq of the `subagent/descriptor` event this identity was folded from. `session.isOwnSeq(seq)` proves the identity comes from the child's OWN log suffix — where a descriptor is immutable once appended — and not from a fork seed's replayed ancestor descriptor.")
    }), object({
      mode: literal("continuable").describe("A resumable conversation."),
      label: string2().describe("Durable creation label from the child's descriptor."),
      seq: number2().describe("Seq of the folded descriptor event; see the one-shot arm for the own-suffix proof.")
    })]).optional().describe("Identity of a descriptor-backed subagent session. `null` ⟺ no valid descriptor (missing, malformed, or unrecognized-version — deliberately undistinguished). The sentinel is deliberately serializable: a value pushed over JSON transports must survive `JSON.stringify` losslessly, where an `undefined` field would be dropped and a stale identity would survive on the receiving side. The entry itself stays non-optional."),
    tokenUsage: object({
      uncachedInputTokens: number2(),
      outputTokens: number2(),
      cacheReadTokens: number2(),
      cacheWriteTokens: number2()
    }).optional().describe("Provider-reported usage accumulated across the complete durable log."),
    contextPressure: object({
      pressureTokens: number2().optional().describe("Provider-reported prompt size of the most recent request: uncached input plus cache reads and writes. Response output is excluded, so this does not grow as the current turn streams. Absent until a provider reports usage."),
      projectedTokens: number2().optional().describe("What the NEXT request's prompt would cost: {@link pressureTokens} plus the heuristic repricing of everything the surface gained or lost since that sample. Only the delta is estimated, so the figure stays anchored to the provider while still reacting the moment a compaction shadows a span — which `pressureTokens` alone cannot do, since compaction reports no usage of its own. Absent until a provider reports usage."),
      contextWindow: number2().optional().describe("Newest recorded route capacity; absent when no adapter advertised one.")
    }).optional().describe("Newest request pressure paired with the newest known route capacity."),
    contextBreakdown: object({
      systemTokens: number2().describe("Heuristic tokens of the last nonempty surviving system prompt in surface order; 0 when none exists."),
      toolsTokens: number2().describe("Heuristic tokens of the newest request envelope's tool schemas; 0 before any request."),
      messageTokens: number2().describe("Heuristic tokens of every other visible surface node, including superseded system prompts.")
    }).optional().describe("Heuristic system/tools/message composition of the next request."),
    agentTeam: object({
      members: array(object({
        id: string2().readonly(),
        name: string2().readonly(),
        role: union([literal("lead"), literal("teammate")]).readonly(),
        phase: union([literal("failed"), literal("provisioning"), literal("active")]).readonly().describe("Durable lifecycle; the Lead row is always `active`. Turn activity comes from Session status."),
        error: string2().readonly().optional()
      })).readonly(),
      tasks: array(object({
        id: string2().readonly(),
        revision: number2().readonly(),
        subject: string2().readonly(),
        description: string2().readonly(),
        status: union([literal("completed"), literal("pending"), literal("in_progress"), literal("deleted")]).readonly(),
        blockedBy: array(string2()).readonly(),
        writeScopes: array(string2()).readonly(),
        ownerName: string2().readonly().optional(),
        ready: boolean2().readonly(),
        writeScopeWarnings: array(string2()).readonly()
      })).readonly(),
      failure: string2().readonly().optional()
    }).optional().describe("Durable roster and non-deleted task board of the Team rooted at the projected Session."),
    userQuestions: object({
      active: array(object({
        callId: string2().readonly(),
        questions: array(object({
          id: string2().describe("Stable caller-provided question id, echoed in the answer."),
          question: string2().describe("The question to display."),
          detail: string2().optional().describe("Optional supporting detail rendered with the question but kept out of option labels."),
          header: string2().optional().describe("Optional short heading/group label."),
          options: array(object({
            label: string2().describe("User-facing label."),
            description: string2().optional().describe("Optional extra context rendered by capable UIs.")
          })).optional().describe("Optional choices the UI can render as a menu."),
          multiSelect: boolean2().optional().describe("Whether more than one option may be selected. Defaults to single-select."),
          intent: object({
            kind: literal("plan-review").describe("A plan submitted for review: `detail` is the plan markdown `ask()` requires, and the decision approves or declines it."),
            approve: string2().describe("The option label that approves the plan; every other option declines it. Named rather than positional so no UI infers the verdict from option order. An `approve` naming no option of its own question is rejected at `ask()`."),
            callId: string2().optional().describe("Logged tool invocation whose arguments contain the reviewed plan.")
          }).optional().describe("Optional presentation intent for capable UIs; absent asks for the generic option list.")
        })).readonly(),
        state: union([literal("open"), literal("continued")]).readonly()
      })).readonly().describe("Calls that can still take an answer, in ask order."),
      settled: array(object({
        callId: string2().readonly().describe("The settled call."),
        answers: array(object({
          id: string2().describe("The answered question id."),
          selected: array(string2()).describe("Selected option labels. May accompany custom text for a multi-select question."),
          custom: string2().optional().describe('Optional free-text "Other" answer.')
        })).readonly().describe("The recorded batch, one entry per question; empty when the late reply carried none.")
      })).readonly().describe("Calls an answer settled, in settlement order.")
    }).optional().describe("Timed questions that remain answerable in this Session, and the ones a late reply settled."),
    goal: union([literal(null), object({
      goal: object({
        objective: string2().readonly().describe("Human-requested completion objective."),
        phase: union([literal("active"), literal("paused"), literal("blocked"), literal("complete")]).readonly().describe("Durable lifecycle phase."),
        blockedReason: object({
          code: string2().readonly().describe("Stable lower-kebab-case classification chosen by the blocking policy."),
          message: string2().readonly().describe("Non-empty explanation shown to humans and models.")
        }).readonly().optional().describe("Present exactly while `phase` is `blocked`."),
        maxGoalRounds: number2().readonly().describe("Total admitted goal-round cap."),
        id: string2().readonly().describe("Stable goal identity."),
        revision: number2().readonly().describe("Positive revision; every durable mutation increments it.")
      }).readonly().describe("Current durable goal snapshot (the CAS ref for mutations rides on it)."),
      roundsStarted: number2().readonly().describe("Highest admitted round number for this goal."),
      createdAt: number2().readonly().describe("Epoch milliseconds of the create mutation."),
      updatedAt: number2().readonly().describe("Epoch milliseconds of the latest mutation.")
    })]).optional().describe("The session's current goal and admitted-round count, or `null` before the first create and after a clear tombstone. `goal/change` supplies the whole lifecycle value; matching admitted `user/message` events advance `roundsStarted`."),
    plan: object({
      active: boolean2(),
      pending: boolean2()
    }).optional().describe("Plan collaboration state folded from the plan command lifecycle and `plan/mode` events.")
  }), record(string2(), json()).readonly()).readonly()
})]);
var _deepseek_ai_dsh_api_session_controller_session_prompt_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_prompt_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_prompt_parameter_0$schema$value ??= object({
  requestId: string2().readonly().describe("Client-minted identity persisted on the exact accepted user message."),
  sessionId: string2().readonly(),
  mode: union([literal("queue"), literal("steer")]).readonly(),
  content: array(union([object({
    type: literal("text").readonly(),
    text: string2().readonly()
  }), object({
    type: literal("image").readonly(),
    mediaType: union([literal("image/png"), literal("image/jpeg"), literal("image/webp"), literal("image/gif")]).readonly(),
    data: string2().readonly(),
    name: string2().readonly().optional()
  }), object({
    type: literal("file").readonly(),
    receiptId: string2().readonly()
  })])).readonly().describe("At least one non-whitespace text part or attachment."),
  clientTimeZone: string2().readonly().optional()
});
var _deepseek_ai_dsh_api_session_controller_session_prompt_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_prompt_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_prompt_result$schema$value ??= object({
  accepted: literal(true).readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_rename_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_rename_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_rename_parameter_0$schema$value ??= object({
  sessionId: string2().readonly(),
  title: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_rename_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_rename_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_rename_result$schema$value ??= object({
  title: string2().readonly(),
  seq: number2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_search_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_search_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_search_parameter_0$schema$value ??= object({
  query: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_search_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_search_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_search_result$schema$value ??= object({
  items: array(object({
    sessionId: string2().readonly(),
    snippet: string2().readonly()
  })).readonly(),
  hasMore: boolean2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_selectModel_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_selectModel_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_selectModel_parameter_0$schema$value ??= object({
  sessionId: string2().readonly(),
  provider: string2().readonly(),
  model: string2().readonly(),
  reasoningEffort: string2().readonly().optional()
});
var _deepseek_ai_dsh_api_session_controller_session_selectModel_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_selectModel_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_selectModel_result$schema$value ??= object({
  selected: object({
    provider: string2().readonly(),
    model: string2().readonly(),
    reasoningEffort: string2().readonly().optional()
  }).readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_updateQueue_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_updateQueue_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_updateQueue_parameter_0$schema$value ??= object({
  sessionId: string2().readonly(),
  itemId: string2().readonly(),
  action: union([object({
    kind: literal("edit").readonly(),
    content: array(object({
      type: literal("text"),
      text: string2()
    })).readonly().describe("Non-empty text-only replacement content.")
  }), object({
    kind: literal("remove").readonly()
  }), object({
    kind: literal("steer").readonly()
  })]).readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_updateQueue_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_updateQueue_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_updateQueue_result$schema$value ??= object({
  accepted: literal(true).readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_parameter_0$schema$value ??= object({
  path: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_result$schema = () => _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_result$schema$value ??= array(object({
  id: string2().readonly().describe("OS application identifier; callers must revalidate it against the file's current handlers before opening."),
  name: string2().readonly(),
  default: boolean2().readonly(),
  icon: union([literal(null), string2()]).readonly().describe("PNG or SVG data URL, or null when the desktop supplies no icon.")
}));
var _deepseek_ai_dsh_api_session_controller_skills_list_parameter_0$schema$value;
var _deepseek_ai_dsh_api_session_controller_skills_list_parameter_0$schema = () => _deepseek_ai_dsh_api_session_controller_skills_list_parameter_0$schema$value ??= object({
  sessionId: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_skills_list_result$schema$value;
var _deepseek_ai_dsh_api_session_controller_skills_list_result$schema = () => _deepseek_ai_dsh_api_session_controller_skills_list_result$schema$value ??= object({
  skills: array(object({
    path: string2().readonly().optional().describe("Absolute SKILL.md path when supplied by a filesystem provider."),
    name: string2().readonly().describe("Kebab-case identifier referenced as `/name`."),
    description: string2().readonly().describe("Short routing description."),
    whenToUse: string2().readonly().optional().describe("Optional extra routing guidance."),
    modelInvocable: boolean2().readonly().describe("Whether the same skill is also advertised to the model.")
  })).readonly()
});
var _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_0_strict$schema$value ??= string2();
var _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_1_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_1_strict$schema = () => _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_1_strict$schema$value ??= string2();
var _deepseek_ai_dsh_api_session_controller_session_attachment_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_attachment_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_attachment_parameter_0_strict$schema$value ??= strictObject({
  sessionId: string2().readonly(),
  attachmentId: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_cancel_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_cancel_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_cancel_parameter_0_strict$schema$value ??= strictObject({
  sessionId: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_create_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_create_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_create_parameter_0_strict$schema$value ??= strictObject({
  workspaceId: string2().readonly().optional().describe("Workspace the Session joins; exclusive with `cwd`."),
  cwd: string2().readonly().optional().describe("Directory the Session owns when no Workspace is named."),
  sessionId: string2().readonly().optional().describe("Blank Session to reuse while it is reusable, or the identity of a new Session when none is stored under it."),
  agentPreset: string2().readonly().optional().describe("Preset the Session runs, replacing a reused Session's recorded preset; the configured default when omitted.")
});
var _deepseek_ai_dsh_api_session_controller_session_follow_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_follow_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_follow_parameter_0_strict$schema$value ??= strictObject({
  address: union([strictObject({
    kind: literal("session").readonly(),
    sessionId: string2().readonly()
  }), strictObject({
    kind: literal("subagent").readonly(),
    parentSessionId: string2().readonly(),
    childSessionId: string2().readonly(),
    mode: union([literal("one-shot"), literal("continuable"), literal("unknown")]).readonly()
  })]).readonly(),
  assistantStream: literal(true).readonly().optional().describe("Include process-local assistant presentation frames for the Web client."),
  maxMessages: number2().readonly().optional(),
  turnWindow: strictObject({
    minMessages: number2().readonly().describe("Minimum append-origin user/assistant messages; must not exceed maxMessages."),
    minTurns: number2().readonly().describe("Minimum Turn starts crossed, including the partial Turn at beforeSeq.")
  }).readonly().optional().describe("Stop at a Turn start after both minima, unless maxMessages or history exhaustion wins.")
});
var _deepseek_ai_dsh_api_session_controller_session_fork_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_fork_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_fork_parameter_0_strict$schema$value ??= strictObject({
  sessionId: string2().readonly(),
  atSeq: number2().readonly().optional().describe("Exact inclusive source event seq; omission selects the latest completed-turn prefix."),
  allowMigration: boolean2().readonly().optional().describe("False asks the Host to check for required migration before forking. Defaults to true.")
});
var _deepseek_ai_dsh_api_session_controller_session_list_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_list_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_list_parameter_0_strict$schema$value ??= strictObject({
  cursor: string2().readonly().optional()
});
var _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_parameter_0_strict$schema$value ??= strictObject({
  action: literal("reveal").readonly().optional().describe("File-manager navigation when requested; omission uses the default application."),
  application: string2().readonly().optional().describe("Registered application identifier; ignored for reveal. Omission preserves the operating system default."),
  path: string2().readonly().describe("Path after best-effort Session workspace resolution, in Host filesystem syntax.")
});
var _deepseek_ai_dsh_api_session_controller_session_page_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_page_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_page_parameter_0_strict$schema$value ??= strictObject({
  address: union([strictObject({
    kind: literal("session").readonly(),
    sessionId: string2().readonly()
  }), strictObject({
    kind: literal("subagent").readonly(),
    parentSessionId: string2().readonly(),
    childSessionId: string2().readonly(),
    mode: union([literal("one-shot"), literal("continuable"), literal("unknown")]).readonly()
  })]).readonly(),
  throughSeq: number2().readonly().describe("Inclusive log cut obtained from the corresponding follow opening frame."),
  beforeSeq: number2().readonly().optional(),
  maxMessages: number2().readonly().optional(),
  turnWindow: strictObject({
    minMessages: number2().readonly().describe("Minimum append-origin user/assistant messages; must not exceed maxMessages."),
    minTurns: number2().readonly().describe("Minimum Turn starts crossed, including the partial Turn at beforeSeq.")
  }).readonly().optional().describe("Stop at a Turn start after both minima, unless maxMessages or history exhaustion wins.")
});
var _deepseek_ai_dsh_api_session_controller_session_projections_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_projections_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_projections_parameter_0_strict$schema$value ??= strictObject({
  sessionId: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_prompt_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_prompt_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_prompt_parameter_0_strict$schema$value ??= strictObject({
  requestId: string2().readonly().describe("Client-minted identity persisted on the exact accepted user message."),
  sessionId: string2().readonly(),
  mode: union([literal("queue"), literal("steer")]).readonly(),
  content: array(union([strictObject({
    type: literal("text").readonly(),
    text: string2().readonly()
  }), strictObject({
    type: literal("image").readonly(),
    mediaType: union([literal("image/png"), literal("image/jpeg"), literal("image/webp"), literal("image/gif")]).readonly(),
    data: string2().readonly(),
    name: string2().readonly().optional()
  }), strictObject({
    type: literal("file").readonly(),
    receiptId: string2().readonly()
  })])).readonly().describe("At least one non-whitespace text part or attachment."),
  clientTimeZone: string2().readonly().optional()
});
var _deepseek_ai_dsh_api_session_controller_session_rename_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_rename_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_rename_parameter_0_strict$schema$value ??= strictObject({
  sessionId: string2().readonly(),
  title: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_search_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_search_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_search_parameter_0_strict$schema$value ??= strictObject({
  query: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_selectModel_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_selectModel_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_selectModel_parameter_0_strict$schema$value ??= strictObject({
  sessionId: string2().readonly(),
  provider: string2().readonly(),
  model: string2().readonly(),
  reasoningEffort: string2().readonly().optional()
});
var _deepseek_ai_dsh_api_session_controller_session_updateQueue_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_updateQueue_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_updateQueue_parameter_0_strict$schema$value ??= strictObject({
  sessionId: string2().readonly(),
  itemId: string2().readonly(),
  action: union([strictObject({
    kind: literal("edit").readonly(),
    content: array(strictObject({
      type: literal("text"),
      text: string2()
    })).readonly().describe("Non-empty text-only replacement content.")
  }), strictObject({
    kind: literal("remove").readonly()
  }), strictObject({
    kind: literal("steer").readonly()
  })]).readonly()
});
var _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_parameter_0_strict$schema$value ??= strictObject({
  path: string2().readonly()
});
var _deepseek_ai_dsh_api_session_controller_skills_list_parameter_0_strict$schema$value;
var _deepseek_ai_dsh_api_session_controller_skills_list_parameter_0_strict$schema = () => _deepseek_ai_dsh_api_session_controller_skills_list_parameter_0_strict$schema$value ??= strictObject({
  sessionId: string2().readonly()
});
var TYPERT_REMOTE = createTypertRemoteInfo({
  package: "@deepseek-ai/dsh-api-session-controller",
  methods: {
    "fileReferences/list": {
      service: "sessionFileReferences",
      description: "List file and directory candidates for one Agent's working directory.",
      invocation: { kind: "direct" },
      scope: {
        context: "agent",
        wire: "agentId"
      },
      parameters: [
        {
          name: "agent",
          wire: "agentId",
          description: "target Agent resolved from the Session identity on the wire.",
          source: "lookup",
          lookup: "agent",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-session/types#SessionId",
            create: _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_0$schema,
            jsonSchema: { type: "string" }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-session/types#SessionId",
            create: _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_0_strict$schema,
            jsonSchema: { type: "string" }
          }
        },
        {
          name: "query",
          description: 'path text following `@` or `@"`.',
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller#fileReferences/list:query",
            create: _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_1$schema,
            jsonSchema: { type: "string" }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller#fileReferences/list:query",
            create: _deepseek_ai_dsh_api_session_controller_fileReferences_list_parameter_1_strict$schema,
            jsonSchema: { type: "string" }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller#fileReferences/list:result",
        create: _deepseek_ai_dsh_api_session_controller_fileReferences_list_result$schema,
        description: "deterministic path-only candidates from the composed provider.",
        jsonSchema: { type: "array", items: { type: "object", properties: { path: { type: "string", description: "User-facing path accepted by normal prompts and filesystem tools." }, kind: { type: "string", enum: ["file", "directory"], description: "Directories keep completion open; files finish the mention." } }, required: ["path", "kind"], additionalProperties: true } }
      },
      sourceLocation: { file: "packages/api/session-controller/src/file-references.ts", line: 33, column: 3 }
    },
    "session/attachment": {
      service: "sessionController",
      description: "Read one image proven reachable from the addressed Session log.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "Session and attachment identities used for authorization.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionAttachmentRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_attachment_parameter_0$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" }, attachmentId: { type: "string" } }, required: ["sessionId", "attachmentId"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionAttachmentRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_attachment_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" }, attachmentId: { type: "string" } }, required: ["sessionId", "attachmentId"], additionalProperties: false }
          }
        }
      ],
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionAttachmentValue",
        create: _deepseek_ai_dsh_api_session_controller_session_attachment_result$schema,
        description: "the durable attachment reference and base64-encoded bytes.",
        jsonSchema: { type: "object", properties: { attachment: { type: "object", properties: { attachmentId: { type: "string", description: "Opaque storage identifier; never a filesystem path or bearer URL." }, mediaType: { type: "string", enum: ["image/png", "image/jpeg", "image/webp", "image/gif"], description: "Media type verified from the stored bytes." }, bytes: { type: "number", description: "Exact encoded byte length." }, width: { type: "number", description: "Intrinsic encoded width in pixels." }, height: { type: "number", description: "Intrinsic encoded height in pixels." }, name: { type: "string", description: "Optional display name stripped of local path information." }, originalDimensions: { type: "object", properties: { width: { type: "number" }, height: { type: "number" } }, required: ["width", "height"], additionalProperties: true, description: "Input dimensions after applying EXIF orientation and before normalization scaling. Present only when normalization reduced the image." } }, required: ["attachmentId", "mediaType", "bytes", "width", "height"], additionalProperties: true }, data: { type: "string" } }, required: ["attachment", "data"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 494, column: 3 }
    },
    "session/cancel": {
      service: "sessionController",
      description: "Cancel one active Agent turn without dropping its pending inbox.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "Session whose active Agent turn is cancelled.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionCancelRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_cancel_parameter_0$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionCancelRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_cancel_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"], additionalProperties: false }
          }
        }
      ],
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionCancelValue",
        create: _deepseek_ai_dsh_api_session_controller_session_cancel_result$schema,
        description: "acknowledgement that cancellation was requested.",
        jsonSchema: { type: "object", properties: { accepted: { type: "boolean", const: true } }, required: ["accepted"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 514, column: 3 }
    },
    "session/canOpenWorkspacePath": {
      service: "sessionController",
      description: "Report whether this deployment can hand a Session workspace path to a native desktop.",
      invocation: { kind: "direct" },
      parameters: [],
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller#session/canOpenWorkspacePath:result",
        create: _deepseek_ai_dsh_api_session_controller_session_canOpenWorkspacePath_result$schema,
        description: "true when the matching open operation is available.",
        jsonSchema: { type: "boolean" }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 347, column: 3 }
    },
    "session/control": {
      service: "sessionController",
      description: "Stream a complete live-control baseline followed by replacement frames.",
      mode: "stream",
      invocation: { kind: "direct" },
      parameters: [],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionControlFrame",
        create: _deepseek_ai_dsh_api_session_controller_session_control_result$schema,
        description: "one complete baseline followed by live replacement frames.",
        jsonSchemaError: "typert tool schema: selected dictionaries require string keys and unconstrained JSON values"
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 599, column: 10 }
    },
    "session/create": {
      service: "sessionController",
      description: "Create one ordinary Session for a new conversation, reusing the named blank Session while it is reusable.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "optional blank Session to reuse, location, and Agent preset.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionCreateRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_create_parameter_0$schema,
            jsonSchema: { type: "object", properties: { workspaceId: { type: "string", description: "Workspace the Session joins; exclusive with `cwd`." }, cwd: { type: "string", description: "Directory the Session owns when no Workspace is named." }, sessionId: { type: "string", description: "Blank Session to reuse while it is reusable, or the identity of a new Session when none is stored under it." }, agentPreset: { type: "string", description: "Preset the Session runs, replacing a reused Session's recorded preset; the configured default when omitted." } }, required: [], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionCreateRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_create_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { workspaceId: { type: "string", description: "Workspace the Session joins; exclusive with `cwd`." }, cwd: { type: "string", description: "Directory the Session owns when no Workspace is named." }, sessionId: { type: "string", description: "Blank Session to reuse while it is reusable, or the identity of a new Session when none is stored under it." }, agentPreset: { type: "string", description: "Preset the Session runs, replacing a reused Session's recorded preset; the configured default when omitted." } }, required: [], additionalProperties: false }
          }
        }
      ],
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionCreateValue",
        create: _deepseek_ai_dsh_api_session_controller_session_create_result$schema,
        description: "the created or reused Session identity and its preset when configured.",
        jsonSchema: { type: "object", properties: { sessionId: { type: "string", description: "The created or reused Session, which may differ from the requested `sessionId`." }, agentPreset: { type: "string", description: "Preset the Session runs, when the deployment composes a preset roster." } }, required: ["sessionId"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 301, column: 3 }
    },
    "session/follow": {
      service: "sessionController",
      description: "Follow one Session log from its opening or resume cursor.",
      mode: "stream",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "durable address and last committed sequence already held by the caller.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionFollowRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_follow_parameter_0$schema,
            jsonSchema: { type: "object", properties: { address: { oneOf: [{ type: "object", properties: { kind: { type: "string", const: "session" }, sessionId: { type: "string" } }, required: ["kind", "sessionId"], additionalProperties: true }, { type: "object", properties: { kind: { type: "string", const: "subagent" }, parentSessionId: { type: "string" }, childSessionId: { type: "string" }, mode: { type: "string", enum: ["one-shot", "continuable", "unknown"] } }, required: ["kind", "parentSessionId", "childSessionId", "mode"], additionalProperties: true }] }, assistantStream: { type: "boolean", const: true, description: "Include process-local assistant presentation frames for the Web client." }, maxMessages: { type: "number" }, turnWindow: { type: "object", properties: { minMessages: { type: "number", description: "Minimum append-origin user/assistant messages; must not exceed maxMessages." }, minTurns: { type: "number", description: "Minimum Turn starts crossed, including the partial Turn at beforeSeq." } }, required: ["minMessages", "minTurns"], additionalProperties: true, description: "Stop at a Turn start after both minima, unless maxMessages or history exhaustion wins." } }, required: ["address"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionFollowRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_follow_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { address: { oneOf: [{ type: "object", properties: { kind: { type: "string", const: "session" }, sessionId: { type: "string" } }, required: ["kind", "sessionId"], additionalProperties: false }, { type: "object", properties: { kind: { type: "string", const: "subagent" }, parentSessionId: { type: "string" }, childSessionId: { type: "string" }, mode: { type: "string", enum: ["one-shot", "continuable", "unknown"] } }, required: ["kind", "parentSessionId", "childSessionId", "mode"], additionalProperties: false }] }, assistantStream: { type: "boolean", const: true, description: "Include process-local assistant presentation frames for the Web client." }, maxMessages: { type: "number" }, turnWindow: { type: "object", properties: { minMessages: { type: "number", description: "Minimum append-origin user/assistant messages; must not exceed maxMessages." }, minTurns: { type: "number", description: "Minimum Turn starts crossed, including the partial Turn at beforeSeq." } }, required: ["minMessages", "minTurns"], additionalProperties: false, description: "Stop at a Turn start after both minima, unless maxMessages or history exhaustion wins." } }, required: ["address"], additionalProperties: false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionFollowFrame",
        create: _deepseek_ai_dsh_api_session_controller_session_follow_result$schema,
        description: "a complete opening snapshot followed by gap-free durable event frames and optional cursorless assistant-stream frames.",
        jsonSchema: { oneOf: [{ type: "object", properties: { type: { type: "string", const: "event" }, event: { type: "object", properties: { type: { type: "string" }, seq: { type: "number" }, time: { type: "number" }, data: {}, ignorable: { type: "boolean", const: true }, sourceEventSeqs: { description: "Earlier sources on current surface events; opaque JSON on unknown ignorable events." }, surfaceOp: { description: "Canonical placement on current surface events; opaque JSON on unknown ignorable events." } }, required: ["type", "seq", "time", "data"], additionalProperties: true } }, required: ["type", "event"], additionalProperties: true }, { type: "object", properties: { type: { type: "string", const: "snapshot" }, header: { type: "object", properties: { version: { type: "number" }, id: { type: "string" }, createdAt: { type: "number" }, cwd: { type: "string" }, parentSession: { type: "string" }, isSeeded: { type: "boolean", description: "Whether the Session contains a fork-inherited prefix." }, origin: { type: "string", const: "subagent" }, delegationDepth: { type: "number" }, agentPreset: { type: "string" } }, required: ["version", "id", "createdAt", "isSeeded"], additionalProperties: true }, cursor: { type: "number" }, records: { type: "array", items: { type: "object", properties: { type: { type: "string", const: "event" }, event: { type: "object", properties: { type: { type: "string" }, seq: { type: "number" }, time: { type: "number" }, data: {}, ignorable: { type: "boolean", const: true }, sourceEventSeqs: { description: "Earlier sources on current surface events; opaque JSON on unknown ignorable events." }, surfaceOp: { description: "Canonical placement on current surface events; opaque JSON on unknown ignorable events." } }, required: ["type", "seq", "time", "data"], additionalProperties: true } }, required: ["type", "event"], additionalProperties: true } }, hasMore: { type: "boolean" }, projections: { type: "object", properties: { asOfSeq: { type: "number" }, values: { type: "object", properties: { inbox: { type: "object", properties: { "next-turn": { type: "array", items: {} }, "next-step": { type: "array", items: {} } }, required: ["next-turn", "next-step"], additionalProperties: true, description: "Pending agent input reconstructed from durable inbox splices." }, workingDirectory: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "Recorded current directory for Session observations, or null when none is recorded." }, agentPreset: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "Preset the Session runs, or null when the deployment composes none." }, title: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "The session's current normalized title — the latest `session/title` event's text (last-wins), or `null` before the first title lands. A plain string: the shape the client list rows consume." }, todos: { oneOf: [{ type: "null", const: null }, { type: "array", items: { type: "object", properties: { content: { type: "string", description: "What this task is — a short imperative line shown in the UI." }, status: { type: "string", enum: ["completed", "pending", "in_progress"], description: "Lifecycle state. `in_progress` marks a task being worked now; parallel work may mark several." } }, required: ["content", "status"], additionalProperties: true } }], description: "The agent's current whole todo list (the latest `todo/write` snapshot), or `null` before the first write. Whole-value rule: every `todo/write` carries the complete replacement list, so the fold is last-wins." }, sessionListMetadata: { type: "object", properties: { blank: { type: "boolean", description: "Whether the folded prefix contains no turn." }, lastPromptAt: { oneOf: [{ type: "null", const: null }, { type: "number" }], description: "Latest human-authored prompt time in the folded prefix." } }, required: ["blank", "lastPromptAt"], additionalProperties: true, description: "Persisted facts used to summarize a Session without activating it." }, imageLimits: { type: "object", properties: { maxImageBytes: { type: "number" }, maxImagesPerMessage: { type: "number" }, maxMessageImageBytes: { type: "number" }, maxImagePixels: { type: "number" }, maxImageDimension: { type: "number", description: "Maximum intrinsic width and maximum intrinsic height in pixels for one image." }, mediaTypes: { type: "array", items: { type: "string", enum: ["image/png", "image/jpeg", "image/webp", "image/gif"] } } }, required: ["maxImageBytes", "maxImagesPerMessage", "maxMessageImageBytes", "maxImagePixels", "maxImageDimension", "mediaTypes"], additionalProperties: true, description: "Image-intake limits enforced by the Session prompt endpoint." }, modelSelection: { type: "object", properties: { lastUsed: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["provider", "model"], additionalProperties: true }], description: "Selection consumed by the latest recorded model request." }, next: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["provider", "model"], additionalProperties: true }], description: "Selection the next request should use, falling back to {@link lastUsed}." } }, required: ["lastUsed", "next"], additionalProperties: true, description: "Durable model selection already used and selected for the next request." }, permissions: { type: "object", properties: { currentValue: { type: "string", description: "The effective current value: a configured preset key, `auto`, or `custom`." } }, required: ["currentValue"], additionalProperties: true, description: "The session's current permission, folded from the three whole-value knob events (`permission/preset`, `sandbox/mode`, `approval/policy`) over the composition defaults. Selectable options come from the process-level catalog Remote. Key absence means no permission service is composed — clients hide the control." }, subagentCatalog: { type: "array", items: { oneOf: [{ type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "one-shot" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "external" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "continuable" }, label: { type: "string" } }, required: ["id", "createdAt", "mode", "label"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "unknown" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }] }, description: "Direct children in parent catalog event order, excluding fork-inherited facts." }, subagentTiming: { type: "object", properties: { settledMs: { type: "number", description: "Milliseconds accumulated across completed turns after the child's own descriptor." }, active: { type: "object", properties: { since: { type: "number", description: "Start of the open turn." }, through: { type: "number", description: "Latest event time folded into this projection cut." } }, required: ["since", "through"], additionalProperties: true, description: "Same-cut bounds of the currently open turn, when one has not reached `turn/end`." }, lastTurnCompleted: { type: "boolean", description: "Whether the latest closed turn after the child's own descriptor completed normally; absent while a turn is open or before one closes." } }, required: ["settledMs"], additionalProperties: true, description: "Active-turn duration and latest closed-turn completion for a descriptor-backed subagent session." }, subagent: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { mode: { type: "string", const: "one-shot", description: "A terminal one-shot child." }, label: { type: "string", description: "Optional durable creation label from the child's descriptor." }, seq: { type: "number", description: "Seq of the `subagent/descriptor` event this identity was folded from. `session.isOwnSeq(seq)` proves the identity comes from the child's OWN log suffix — where a descriptor is immutable once appended — and not from a fork seed's replayed ancestor descriptor." } }, required: ["mode", "seq"], additionalProperties: true }, { type: "object", properties: { mode: { type: "string", const: "continuable", description: "A resumable conversation." }, label: { type: "string", description: "Durable creation label from the child's descriptor." }, seq: { type: "number", description: "Seq of the folded descriptor event; see the one-shot arm for the own-suffix proof." } }, required: ["mode", "label", "seq"], additionalProperties: true }], description: "Identity of a descriptor-backed subagent session. `null` ⟺ no valid descriptor (missing, malformed, or unrecognized-version — deliberately undistinguished). The sentinel is deliberately serializable: a value pushed over JSON transports must survive `JSON.stringify` losslessly, where an `undefined` field would be dropped and a stale identity would survive on the receiving side. The entry itself stays non-optional." }, tokenUsage: { type: "object", properties: { uncachedInputTokens: { type: "number" }, outputTokens: { type: "number" }, cacheReadTokens: { type: "number" }, cacheWriteTokens: { type: "number" } }, required: ["uncachedInputTokens", "outputTokens", "cacheReadTokens", "cacheWriteTokens"], additionalProperties: true, description: "Provider-reported usage accumulated across the complete durable log." }, contextPressure: { type: "object", properties: { pressureTokens: { type: "number", description: "Provider-reported prompt size of the most recent request: uncached input plus cache reads and writes. Response output is excluded, so this does not grow as the current turn streams. Absent until a provider reports usage." }, projectedTokens: { type: "number", description: "What the NEXT request's prompt would cost: {@link pressureTokens} plus the heuristic repricing of everything the surface gained or lost since that sample. Only the delta is estimated, so the figure stays anchored to the provider while still reacting the moment a compaction shadows a span — which `pressureTokens` alone cannot do, since compaction reports no usage of its own. Absent until a provider reports usage." }, contextWindow: { type: "number", description: "Newest recorded route capacity; absent when no adapter advertised one." } }, required: [], additionalProperties: true, description: "Newest request pressure paired with the newest known route capacity." }, contextBreakdown: { type: "object", properties: { systemTokens: { type: "number", description: "Heuristic tokens of the last nonempty surviving system prompt in surface order; 0 when none exists." }, toolsTokens: { type: "number", description: "Heuristic tokens of the newest request envelope's tool schemas; 0 before any request." }, messageTokens: { type: "number", description: "Heuristic tokens of every other visible surface node, including superseded system prompts." } }, required: ["systemTokens", "toolsTokens", "messageTokens"], additionalProperties: true, description: "Heuristic system/tools/message composition of the next request." }, agentTeam: { type: "object", properties: { members: { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, role: { type: "string", enum: ["lead", "teammate"] }, phase: { type: "string", enum: ["failed", "provisioning", "active"], description: "Durable lifecycle; the Lead row is always `active`. Turn activity comes from Session status." }, error: { type: "string" } }, required: ["id", "name", "role", "phase"], additionalProperties: true } }, tasks: { type: "array", items: { type: "object", properties: { id: { type: "string" }, revision: { type: "number" }, subject: { type: "string" }, description: { type: "string" }, status: { type: "string", enum: ["completed", "pending", "in_progress", "deleted"] }, blockedBy: { type: "array", items: { type: "string" } }, writeScopes: { type: "array", items: { type: "string" } }, ownerName: { type: "string" }, ready: { type: "boolean" }, writeScopeWarnings: { type: "array", items: { type: "string" } } }, required: ["id", "revision", "subject", "description", "status", "blockedBy", "writeScopes", "ready", "writeScopeWarnings"], additionalProperties: true } }, failure: { type: "string" } }, required: ["members", "tasks"], additionalProperties: true, description: "Durable roster and non-deleted task board of the Team rooted at the projected Session." }, userQuestions: { type: "object", properties: { active: { type: "array", items: { type: "object", properties: { callId: { type: "string" }, questions: { type: "array", items: { type: "object", properties: { id: { type: "string", description: "Stable caller-provided question id, echoed in the answer." }, question: { type: "string", description: "The question to display." }, detail: { type: "string", description: "Optional supporting detail rendered with the question but kept out of option labels." }, header: { type: "string", description: "Optional short heading/group label." }, options: { type: "array", items: { type: "object", properties: { label: { type: "string", description: "User-facing label." }, description: { type: "string", description: "Optional extra context rendered by capable UIs." } }, required: ["label"], additionalProperties: true }, description: "Optional choices the UI can render as a menu." }, multiSelect: { type: "boolean", description: "Whether more than one option may be selected. Defaults to single-select." }, intent: { type: "object", properties: { kind: { type: "string", const: "plan-review", description: "A plan submitted for review: `detail` is the plan markdown `ask()` requires, and the decision approves or declines it." }, approve: { type: "string", description: "The option label that approves the plan; every other option declines it. Named rather than positional so no UI infers the verdict from option order. An `approve` naming no option of its own question is rejected at `ask()`." }, callId: { type: "string", description: "Logged tool invocation whose arguments contain the reviewed plan." } }, required: ["kind", "approve"], additionalProperties: true, description: "Optional presentation intent for capable UIs; absent asks for the generic option list." } }, required: ["id", "question"], additionalProperties: true } }, state: { type: "string", enum: ["open", "continued"] } }, required: ["callId", "questions", "state"], additionalProperties: true }, description: "Calls that can still take an answer, in ask order." }, settled: { type: "array", items: { type: "object", properties: { callId: { type: "string", description: "The settled call." }, answers: { type: "array", items: { type: "object", properties: { id: { type: "string", description: "The answered question id." }, selected: { type: "array", items: { type: "string" }, description: "Selected option labels. May accompany custom text for a multi-select question." }, custom: { type: "string", description: 'Optional free-text "Other" answer.' } }, required: ["id", "selected"], additionalProperties: true }, description: "The recorded batch, one entry per question; empty when the late reply carried none." } }, required: ["callId", "answers"], additionalProperties: true }, description: "Calls an answer settled, in settlement order." } }, required: ["active", "settled"], additionalProperties: true, description: "Timed questions that remain answerable in this Session, and the ones a late reply settled." }, goal: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { goal: { type: "object", properties: { objective: { type: "string", description: "Human-requested completion objective." }, phase: { type: "string", enum: ["active", "paused", "blocked", "complete"], description: "Durable lifecycle phase." }, blockedReason: { type: "object", properties: { code: { type: "string", description: "Stable lower-kebab-case classification chosen by the blocking policy." }, message: { type: "string", description: "Non-empty explanation shown to humans and models." } }, required: ["code", "message"], additionalProperties: true, description: "Present exactly while `phase` is `blocked`." }, maxGoalRounds: { type: "number", description: "Total admitted goal-round cap." }, id: { type: "string", description: "Stable goal identity." }, revision: { type: "number", description: "Positive revision; every durable mutation increments it." } }, required: ["objective", "phase", "maxGoalRounds", "id", "revision"], additionalProperties: true, description: "Current durable goal snapshot (the CAS ref for mutations rides on it)." }, roundsStarted: { type: "number", description: "Highest admitted round number for this goal." }, createdAt: { type: "number", description: "Epoch milliseconds of the create mutation." }, updatedAt: { type: "number", description: "Epoch milliseconds of the latest mutation." } }, required: ["goal", "roundsStarted", "createdAt", "updatedAt"], additionalProperties: true }], description: "The session's current goal and admitted-round count, or `null` before the first create and after a clear tombstone. `goal/change` supplies the whole lifecycle value; matching admitted `user/message` events advance `roundsStarted`." }, plan: { type: "object", properties: { active: { type: "boolean" }, pending: { type: "boolean" } }, required: ["active", "pending"], additionalProperties: true, description: "Plan collaboration state folded from the plan command lifecycle and `plan/mode` events." } }, required: [], additionalProperties: true, description: "Provider-validated values; omitted keys are absent capabilities at this cut." } }, required: ["asOfSeq", "values"], additionalProperties: true }, assistantStream: { type: "object", properties: { revision: { type: "number" }, activeAttempt: { type: "object", properties: { attemptId: { type: "string" }, startedAfterSeq: { type: "number", description: "Last durable Session seq observed when this attempt started." }, turn: { type: "number" }, step: { type: "number" }, nextIndex: { type: "number", description: "Dense position expected for the next live chunk frame." }, stream: { type: "array", items: {}, description: "Compact detached stream accumulated at this opening revision." } }, required: ["attemptId", "startedAfterSeq", "turn", "step", "nextIndex", "stream"], additionalProperties: true } }, required: ["revision"], additionalProperties: true } }, required: ["type", "header", "cursor", "records", "hasMore", "projections"], additionalProperties: true }, { type: "object", properties: { type: { type: "string", const: "assistant-stream" }, frame: { oneOf: [{ type: "object", properties: { type: { type: "string", const: "start" }, attemptId: { type: "string" }, revision: { type: "number" }, startedAfterSeq: { type: "number" }, turn: { type: "number" }, step: { type: "number" } }, required: ["type", "attemptId", "revision", "startedAfterSeq", "turn", "step"], additionalProperties: true }, { type: "object", properties: { type: { type: "string", const: "chunk" }, attemptId: { type: "string" }, revision: { type: "number" }, index: { type: "number" }, time: { type: "number" }, chunk: {} }, required: ["type", "attemptId", "revision", "index", "time", "chunk"], additionalProperties: true }, { type: "object", properties: { type: { type: "string", const: "end" }, attemptId: { type: "string" }, revision: { type: "number" }, index: { type: "number", description: "Number of chunk frames represented by this terminal marker." }, outcome: { oneOf: [{ type: "object", properties: { kind: { type: "string", const: "committed" }, eventType: { type: "string", enum: ["assistant/message", "assistant/attempt"] }, seq: { type: "number" } }, required: ["kind", "eventType", "seq"], additionalProperties: true }, { type: "object", properties: { kind: { type: "string", const: "abandoned" } }, required: ["kind"], additionalProperties: true }] } }, required: ["type", "attemptId", "revision", "index", "outcome"], additionalProperties: true }] } }, required: ["type", "frame"], additionalProperties: true }] }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 537, column: 3 }
    },
    "session/fork": {
      service: "sessionController",
      description: "Fork one cold-readable exact event prefix into a new Session. An omitted boundary selects the latest completed-turn prefix; an open cut receives synthetic fork closers.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "source Session, optional exact inclusive event boundary, and migration preflight choice.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionForkRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_fork_parameter_0$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" }, atSeq: { type: "number", description: "Exact inclusive source event seq; omission selects the latest completed-turn prefix." }, allowMigration: { type: "boolean", description: "False asks the Host to check for required migration before forking. Defaults to true." } }, required: ["sessionId"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionForkRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_fork_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" }, atSeq: { type: "number", description: "Exact inclusive source event seq; omission selects the latest completed-turn prefix." }, allowMigration: { type: "boolean", description: "False asks the Host to check for required migration before forking. Defaults to true." } }, required: ["sessionId"], additionalProperties: false }
          }
        }
      ],
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionForkValue",
        create: _deepseek_ai_dsh_api_session_controller_session_fork_result$schema,
        description: "the new Session identity.",
        jsonSchema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 443, column: 9 }
    },
    "session/initializeDefaultModel": {
      service: "sessionController",
      description: "Select the first available account model after login when no provider API key is configured.",
      invocation: { kind: "direct" },
      parameters: [],
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller#session/initializeDefaultModel:result",
        create: _deepseek_ai_dsh_api_session_controller_session_initializeDefaultModel_result$schema,
        description: "after saving the first available model or retaining the existing default.",
        jsonSchemaError: "typert tool schema: unsupported void value"
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 320, column: 9 }
    },
    "session/list": {
      service: "sessionController",
      description: "Read all visible Session rows without resuming an Agent.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "_request",
          description: "reserved empty list request.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionListRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_list_parameter_0$schema,
            jsonSchema: { type: "object", properties: { cursor: { type: "string" } }, required: [], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionListRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_list_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { cursor: { type: "string" } }, required: [], additionalProperties: false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionListValue",
        create: _deepseek_ai_dsh_api_session_controller_session_list_result$schema,
        description: "visible Session summaries ordered by activity.",
        jsonSchema: { type: "object", properties: { items: { type: "array", items: { type: "object", properties: { agentAvailable: { type: "boolean", description: "Whether this Session currently owns a live Agent." }, formatStatus: { type: "string", enum: ["current", "migration-required"], description: "Current for attached Sessions; otherwise the persistence format status when reported." }, sessionId: { type: "string" }, updatedAt: { type: "number" }, running: { type: "boolean" }, blank: { type: "boolean" }, parentSessionId: { type: "string" }, origin: { type: "string", const: "subagent" }, cwd: { type: "string" }, projections: { type: "object", properties: { kind: { type: "string", enum: ["cached", "sequenced"], description: "`sequenced`: the Host's live registry produced the block for an attached Session, so `asOfSeq` is comparable with baselines and frames of the same connection. `cached`: a header-only listing viewed the block from the persisted projection cache, so `asOfSeq` is the stored record's own watermark and must not be compared with the connected Session's values." }, asOfSeq: { type: "number", description: "Watermark of the block in the sequence space named by `kind`." }, values: { type: "object", properties: { inbox: { type: "object", properties: { "next-turn": { type: "array", items: {} }, "next-step": { type: "array", items: {} } }, required: ["next-turn", "next-step"], additionalProperties: true, description: "Pending agent input reconstructed from durable inbox splices." }, workingDirectory: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "Recorded current directory for Session observations, or null when none is recorded." }, agentPreset: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "Preset the Session runs, or null when the deployment composes none." }, title: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "The session's current normalized title — the latest `session/title` event's text (last-wins), or `null` before the first title lands. A plain string: the shape the client list rows consume." }, todos: { oneOf: [{ type: "null", const: null }, { type: "array", items: { type: "object", properties: { content: { type: "string", description: "What this task is — a short imperative line shown in the UI." }, status: { type: "string", enum: ["completed", "pending", "in_progress"], description: "Lifecycle state. `in_progress` marks a task being worked now; parallel work may mark several." } }, required: ["content", "status"], additionalProperties: true } }], description: "The agent's current whole todo list (the latest `todo/write` snapshot), or `null` before the first write. Whole-value rule: every `todo/write` carries the complete replacement list, so the fold is last-wins." }, sessionListMetadata: { type: "object", properties: { blank: { type: "boolean", description: "Whether the folded prefix contains no turn." }, lastPromptAt: { oneOf: [{ type: "null", const: null }, { type: "number" }], description: "Latest human-authored prompt time in the folded prefix." } }, required: ["blank", "lastPromptAt"], additionalProperties: true, description: "Persisted facts used to summarize a Session without activating it." }, imageLimits: { type: "object", properties: { maxImageBytes: { type: "number" }, maxImagesPerMessage: { type: "number" }, maxMessageImageBytes: { type: "number" }, maxImagePixels: { type: "number" }, maxImageDimension: { type: "number", description: "Maximum intrinsic width and maximum intrinsic height in pixels for one image." }, mediaTypes: { type: "array", items: { type: "string", enum: ["image/png", "image/jpeg", "image/webp", "image/gif"] } } }, required: ["maxImageBytes", "maxImagesPerMessage", "maxMessageImageBytes", "maxImagePixels", "maxImageDimension", "mediaTypes"], additionalProperties: true, description: "Image-intake limits enforced by the Session prompt endpoint." }, modelSelection: { type: "object", properties: { lastUsed: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["provider", "model"], additionalProperties: true }], description: "Selection consumed by the latest recorded model request." }, next: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["provider", "model"], additionalProperties: true }], description: "Selection the next request should use, falling back to {@link lastUsed}." } }, required: ["lastUsed", "next"], additionalProperties: true, description: "Durable model selection already used and selected for the next request." }, permissions: { type: "object", properties: { currentValue: { type: "string", description: "The effective current value: a configured preset key, `auto`, or `custom`." } }, required: ["currentValue"], additionalProperties: true, description: "The session's current permission, folded from the three whole-value knob events (`permission/preset`, `sandbox/mode`, `approval/policy`) over the composition defaults. Selectable options come from the process-level catalog Remote. Key absence means no permission service is composed — clients hide the control." }, subagentCatalog: { type: "array", items: { oneOf: [{ type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "one-shot" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "external" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "continuable" }, label: { type: "string" } }, required: ["id", "createdAt", "mode", "label"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "unknown" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }] }, description: "Direct children in parent catalog event order, excluding fork-inherited facts." }, subagentTiming: { type: "object", properties: { settledMs: { type: "number", description: "Milliseconds accumulated across completed turns after the child's own descriptor." }, active: { type: "object", properties: { since: { type: "number", description: "Start of the open turn." }, through: { type: "number", description: "Latest event time folded into this projection cut." } }, required: ["since", "through"], additionalProperties: true, description: "Same-cut bounds of the currently open turn, when one has not reached `turn/end`." }, lastTurnCompleted: { type: "boolean", description: "Whether the latest closed turn after the child's own descriptor completed normally; absent while a turn is open or before one closes." } }, required: ["settledMs"], additionalProperties: true, description: "Active-turn duration and latest closed-turn completion for a descriptor-backed subagent session." }, subagent: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { mode: { type: "string", const: "one-shot", description: "A terminal one-shot child." }, label: { type: "string", description: "Optional durable creation label from the child's descriptor." }, seq: { type: "number", description: "Seq of the `subagent/descriptor` event this identity was folded from. `session.isOwnSeq(seq)` proves the identity comes from the child's OWN log suffix — where a descriptor is immutable once appended — and not from a fork seed's replayed ancestor descriptor." } }, required: ["mode", "seq"], additionalProperties: true }, { type: "object", properties: { mode: { type: "string", const: "continuable", description: "A resumable conversation." }, label: { type: "string", description: "Durable creation label from the child's descriptor." }, seq: { type: "number", description: "Seq of the folded descriptor event; see the one-shot arm for the own-suffix proof." } }, required: ["mode", "label", "seq"], additionalProperties: true }], description: "Identity of a descriptor-backed subagent session. `null` ⟺ no valid descriptor (missing, malformed, or unrecognized-version — deliberately undistinguished). The sentinel is deliberately serializable: a value pushed over JSON transports must survive `JSON.stringify` losslessly, where an `undefined` field would be dropped and a stale identity would survive on the receiving side. The entry itself stays non-optional." }, tokenUsage: { type: "object", properties: { uncachedInputTokens: { type: "number" }, outputTokens: { type: "number" }, cacheReadTokens: { type: "number" }, cacheWriteTokens: { type: "number" } }, required: ["uncachedInputTokens", "outputTokens", "cacheReadTokens", "cacheWriteTokens"], additionalProperties: true, description: "Provider-reported usage accumulated across the complete durable log." }, contextPressure: { type: "object", properties: { pressureTokens: { type: "number", description: "Provider-reported prompt size of the most recent request: uncached input plus cache reads and writes. Response output is excluded, so this does not grow as the current turn streams. Absent until a provider reports usage." }, projectedTokens: { type: "number", description: "What the NEXT request's prompt would cost: {@link pressureTokens} plus the heuristic repricing of everything the surface gained or lost since that sample. Only the delta is estimated, so the figure stays anchored to the provider while still reacting the moment a compaction shadows a span — which `pressureTokens` alone cannot do, since compaction reports no usage of its own. Absent until a provider reports usage." }, contextWindow: { type: "number", description: "Newest recorded route capacity; absent when no adapter advertised one." } }, required: [], additionalProperties: true, description: "Newest request pressure paired with the newest known route capacity." }, contextBreakdown: { type: "object", properties: { systemTokens: { type: "number", description: "Heuristic tokens of the last nonempty surviving system prompt in surface order; 0 when none exists." }, toolsTokens: { type: "number", description: "Heuristic tokens of the newest request envelope's tool schemas; 0 before any request." }, messageTokens: { type: "number", description: "Heuristic tokens of every other visible surface node, including superseded system prompts." } }, required: ["systemTokens", "toolsTokens", "messageTokens"], additionalProperties: true, description: "Heuristic system/tools/message composition of the next request." }, agentTeam: { type: "object", properties: { members: { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, role: { type: "string", enum: ["lead", "teammate"] }, phase: { type: "string", enum: ["failed", "provisioning", "active"], description: "Durable lifecycle; the Lead row is always `active`. Turn activity comes from Session status." }, error: { type: "string" } }, required: ["id", "name", "role", "phase"], additionalProperties: true } }, tasks: { type: "array", items: { type: "object", properties: { id: { type: "string" }, revision: { type: "number" }, subject: { type: "string" }, description: { type: "string" }, status: { type: "string", enum: ["completed", "pending", "in_progress", "deleted"] }, blockedBy: { type: "array", items: { type: "string" } }, writeScopes: { type: "array", items: { type: "string" } }, ownerName: { type: "string" }, ready: { type: "boolean" }, writeScopeWarnings: { type: "array", items: { type: "string" } } }, required: ["id", "revision", "subject", "description", "status", "blockedBy", "writeScopes", "ready", "writeScopeWarnings"], additionalProperties: true } }, failure: { type: "string" } }, required: ["members", "tasks"], additionalProperties: true, description: "Durable roster and non-deleted task board of the Team rooted at the projected Session." }, userQuestions: { type: "object", properties: { active: { type: "array", items: { type: "object", properties: { callId: { type: "string" }, questions: { type: "array", items: { type: "object", properties: { id: { type: "string", description: "Stable caller-provided question id, echoed in the answer." }, question: { type: "string", description: "The question to display." }, detail: { type: "string", description: "Optional supporting detail rendered with the question but kept out of option labels." }, header: { type: "string", description: "Optional short heading/group label." }, options: { type: "array", items: { type: "object", properties: { label: { type: "string", description: "User-facing label." }, description: { type: "string", description: "Optional extra context rendered by capable UIs." } }, required: ["label"], additionalProperties: true }, description: "Optional choices the UI can render as a menu." }, multiSelect: { type: "boolean", description: "Whether more than one option may be selected. Defaults to single-select." }, intent: { type: "object", properties: { kind: { type: "string", const: "plan-review", description: "A plan submitted for review: `detail` is the plan markdown `ask()` requires, and the decision approves or declines it." }, approve: { type: "string", description: "The option label that approves the plan; every other option declines it. Named rather than positional so no UI infers the verdict from option order. An `approve` naming no option of its own question is rejected at `ask()`." }, callId: { type: "string", description: "Logged tool invocation whose arguments contain the reviewed plan." } }, required: ["kind", "approve"], additionalProperties: true, description: "Optional presentation intent for capable UIs; absent asks for the generic option list." } }, required: ["id", "question"], additionalProperties: true } }, state: { type: "string", enum: ["open", "continued"] } }, required: ["callId", "questions", "state"], additionalProperties: true }, description: "Calls that can still take an answer, in ask order." }, settled: { type: "array", items: { type: "object", properties: { callId: { type: "string", description: "The settled call." }, answers: { type: "array", items: { type: "object", properties: { id: { type: "string", description: "The answered question id." }, selected: { type: "array", items: { type: "string" }, description: "Selected option labels. May accompany custom text for a multi-select question." }, custom: { type: "string", description: 'Optional free-text "Other" answer.' } }, required: ["id", "selected"], additionalProperties: true }, description: "The recorded batch, one entry per question; empty when the late reply carried none." } }, required: ["callId", "answers"], additionalProperties: true }, description: "Calls an answer settled, in settlement order." } }, required: ["active", "settled"], additionalProperties: true, description: "Timed questions that remain answerable in this Session, and the ones a late reply settled." }, goal: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { goal: { type: "object", properties: { objective: { type: "string", description: "Human-requested completion objective." }, phase: { type: "string", enum: ["active", "paused", "blocked", "complete"], description: "Durable lifecycle phase." }, blockedReason: { type: "object", properties: { code: { type: "string", description: "Stable lower-kebab-case classification chosen by the blocking policy." }, message: { type: "string", description: "Non-empty explanation shown to humans and models." } }, required: ["code", "message"], additionalProperties: true, description: "Present exactly while `phase` is `blocked`." }, maxGoalRounds: { type: "number", description: "Total admitted goal-round cap." }, id: { type: "string", description: "Stable goal identity." }, revision: { type: "number", description: "Positive revision; every durable mutation increments it." } }, required: ["objective", "phase", "maxGoalRounds", "id", "revision"], additionalProperties: true, description: "Current durable goal snapshot (the CAS ref for mutations rides on it)." }, roundsStarted: { type: "number", description: "Highest admitted round number for this goal." }, createdAt: { type: "number", description: "Epoch milliseconds of the create mutation." }, updatedAt: { type: "number", description: "Epoch milliseconds of the latest mutation." } }, required: ["goal", "roundsStarted", "createdAt", "updatedAt"], additionalProperties: true }], description: "The session's current goal and admitted-round count, or `null` before the first create and after a clear tombstone. `goal/change` supplies the whole lifecycle value; matching admitted `user/message` events advance `roundsStarted`." }, plan: { type: "object", properties: { active: { type: "boolean" }, pending: { type: "boolean" } }, required: ["active", "pending"], additionalProperties: true, description: "Plan collaboration state folded from the plan command lifecycle and `plan/mode` events." } }, required: [], additionalProperties: true, description: "Provider-validated values present in the block; omitted keys remain unknown." } }, required: ["kind", "asOfSeq", "values"], additionalProperties: true } }, required: ["agentAvailable", "sessionId", "updatedAt", "running", "blank"], additionalProperties: true } } }, required: ["items"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 276, column: 9 }
    },
    "session/modelCatalog": {
      service: "sessionController",
      description: "Describe every currently routable model for Host-generation selectors.",
      invocation: { kind: "direct" },
      parameters: [],
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#ModelCatalog",
        create: _deepseek_ai_dsh_api_session_controller_session_modelCatalog_result$schema,
        description: "provider-grouped models, the deployment default, and isolated provider failures.",
        jsonSchema: { type: "object", properties: { default: { type: "object", properties: { provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["provider", "model"], additionalProperties: true }, routableProviders: { type: "array", items: { type: "string" }, description: "Provider routes with at least one currently available catalog model." }, groups: { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, models: { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, description: { type: "string" }, reasoning: { type: "object", properties: { efforts: { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, description: { type: "string" } }, required: ["id", "name"], additionalProperties: true } }, defaultEffort: { type: "string" } }, required: ["efforts"], additionalProperties: true } }, required: ["id", "name"], additionalProperties: true } } }, required: ["id", "name", "models"], additionalProperties: true } }, failures: { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, message: { type: "string" } }, required: ["id", "name", "message"], additionalProperties: true } } }, required: ["default", "routableProviders", "groups", "failures"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 338, column: 3 }
    },
    "session/openWorkspacePath": {
      service: "sessionController",
      description: "Verify one path through the composed filesystem and open it on the Host desktop.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "path after best-effort Session workspace resolution.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionOpenWorkspacePathRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_parameter_0$schema,
            jsonSchema: { type: "object", properties: { action: { type: "string", const: "reveal", description: "File-manager navigation when requested; omission uses the default application." }, application: { type: "string", description: "Registered application identifier; ignored for reveal. Omission preserves the operating system default." }, path: { type: "string", description: "Path after best-effort Session workspace resolution, in Host filesystem syntax." } }, required: ["path"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionOpenWorkspacePathRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { action: { type: "string", const: "reveal", description: "File-manager navigation when requested; omission uses the default application." }, application: { type: "string", description: "Registered application identifier; ignored for reveal. Omission preserves the operating system default." }, path: { type: "string", description: "Path after best-effort Session workspace resolution, in Host filesystem syntax." } }, required: ["path"], additionalProperties: false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionOpenWorkspacePathValue",
        create: _deepseek_ai_dsh_api_session_controller_session_openWorkspacePath_result$schema,
        description: "confirmation after the native opener accepts the path.",
        jsonSchema: { type: "object", properties: { opened: { type: "boolean", const: true } }, required: ["opened"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 368, column: 9 }
    },
    "session/page": {
      service: "sessionController",
      description: "Read one cold-safe, message-aligned Session history page.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "durable address, backward cursor, and page budget.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionPageRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_page_parameter_0$schema,
            jsonSchema: { type: "object", properties: { address: { oneOf: [{ type: "object", properties: { kind: { type: "string", const: "session" }, sessionId: { type: "string" } }, required: ["kind", "sessionId"], additionalProperties: true }, { type: "object", properties: { kind: { type: "string", const: "subagent" }, parentSessionId: { type: "string" }, childSessionId: { type: "string" }, mode: { type: "string", enum: ["one-shot", "continuable", "unknown"] } }, required: ["kind", "parentSessionId", "childSessionId", "mode"], additionalProperties: true }] }, throughSeq: { type: "number", description: "Inclusive log cut obtained from the corresponding follow opening frame." }, beforeSeq: { type: "number" }, maxMessages: { type: "number" }, turnWindow: { type: "object", properties: { minMessages: { type: "number", description: "Minimum append-origin user/assistant messages; must not exceed maxMessages." }, minTurns: { type: "number", description: "Minimum Turn starts crossed, including the partial Turn at beforeSeq." } }, required: ["minMessages", "minTurns"], additionalProperties: true, description: "Stop at a Turn start after both minima, unless maxMessages or history exhaustion wins." } }, required: ["address", "throughSeq"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionPageRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_page_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { address: { oneOf: [{ type: "object", properties: { kind: { type: "string", const: "session" }, sessionId: { type: "string" } }, required: ["kind", "sessionId"], additionalProperties: false }, { type: "object", properties: { kind: { type: "string", const: "subagent" }, parentSessionId: { type: "string" }, childSessionId: { type: "string" }, mode: { type: "string", enum: ["one-shot", "continuable", "unknown"] } }, required: ["kind", "parentSessionId", "childSessionId", "mode"], additionalProperties: false }] }, throughSeq: { type: "number", description: "Inclusive log cut obtained from the corresponding follow opening frame." }, beforeSeq: { type: "number" }, maxMessages: { type: "number" }, turnWindow: { type: "object", properties: { minMessages: { type: "number", description: "Minimum append-origin user/assistant messages; must not exceed maxMessages." }, minTurns: { type: "number", description: "Minimum Turn starts crossed, including the partial Turn at beforeSeq." } }, required: ["minMessages", "minTurns"], additionalProperties: false, description: "Stop at a Turn start after both minima, unless maxMessages or history exhaustion wins." } }, required: ["address", "throughSeq"], additionalProperties: false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionPage",
        create: _deepseek_ai_dsh_api_session_controller_session_page_result$schema,
        description: "one chronological page.",
        jsonSchema: { type: "object", properties: { records: { type: "array", items: { type: "object", properties: { type: { type: "string", const: "event" }, event: { type: "object", properties: { type: { type: "string" }, seq: { type: "number" }, time: { type: "number" }, data: {}, ignorable: { type: "boolean", const: true }, sourceEventSeqs: { description: "Earlier sources on current surface events; opaque JSON on unknown ignorable events." }, surfaceOp: { description: "Canonical placement on current surface events; opaque JSON on unknown ignorable events." } }, required: ["type", "seq", "time", "data"], additionalProperties: true } }, required: ["type", "event"], additionalProperties: true } }, hasMore: { type: "boolean" } }, required: ["records", "hasMore"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 525, column: 3 }
    },
    "session/projections": {
      service: "sessionController",
      description: "Read exact projections, returning cached hints only when migration is required.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "Session whose current values are required.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionProjectionsRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_projections_parameter_0$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionProjectionsRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_projections_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"], additionalProperties: false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionProjectionsValue",
        create: _deepseek_ai_dsh_api_session_controller_session_projections_result$schema,
        description: "a sequenced baseline, cached hints when migration is deferred, or null when absent.",
        jsonSchema: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { asOfSeq: { type: "number" }, values: { type: "object", properties: { inbox: { type: "object", properties: { "next-turn": { type: "array", items: {} }, "next-step": { type: "array", items: {} } }, required: ["next-turn", "next-step"], additionalProperties: true, description: "Pending agent input reconstructed from durable inbox splices." }, workingDirectory: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "Recorded current directory for Session observations, or null when none is recorded." }, agentPreset: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "Preset the Session runs, or null when the deployment composes none." }, title: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "The session's current normalized title — the latest `session/title` event's text (last-wins), or `null` before the first title lands. A plain string: the shape the client list rows consume." }, todos: { oneOf: [{ type: "null", const: null }, { type: "array", items: { type: "object", properties: { content: { type: "string", description: "What this task is — a short imperative line shown in the UI." }, status: { type: "string", enum: ["completed", "pending", "in_progress"], description: "Lifecycle state. `in_progress` marks a task being worked now; parallel work may mark several." } }, required: ["content", "status"], additionalProperties: true } }], description: "The agent's current whole todo list (the latest `todo/write` snapshot), or `null` before the first write. Whole-value rule: every `todo/write` carries the complete replacement list, so the fold is last-wins." }, sessionListMetadata: { type: "object", properties: { blank: { type: "boolean", description: "Whether the folded prefix contains no turn." }, lastPromptAt: { oneOf: [{ type: "null", const: null }, { type: "number" }], description: "Latest human-authored prompt time in the folded prefix." } }, required: ["blank", "lastPromptAt"], additionalProperties: true, description: "Persisted facts used to summarize a Session without activating it." }, imageLimits: { type: "object", properties: { maxImageBytes: { type: "number" }, maxImagesPerMessage: { type: "number" }, maxMessageImageBytes: { type: "number" }, maxImagePixels: { type: "number" }, maxImageDimension: { type: "number", description: "Maximum intrinsic width and maximum intrinsic height in pixels for one image." }, mediaTypes: { type: "array", items: { type: "string", enum: ["image/png", "image/jpeg", "image/webp", "image/gif"] } } }, required: ["maxImageBytes", "maxImagesPerMessage", "maxMessageImageBytes", "maxImagePixels", "maxImageDimension", "mediaTypes"], additionalProperties: true, description: "Image-intake limits enforced by the Session prompt endpoint." }, modelSelection: { type: "object", properties: { lastUsed: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["provider", "model"], additionalProperties: true }], description: "Selection consumed by the latest recorded model request." }, next: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["provider", "model"], additionalProperties: true }], description: "Selection the next request should use, falling back to {@link lastUsed}." } }, required: ["lastUsed", "next"], additionalProperties: true, description: "Durable model selection already used and selected for the next request." }, permissions: { type: "object", properties: { currentValue: { type: "string", description: "The effective current value: a configured preset key, `auto`, or `custom`." } }, required: ["currentValue"], additionalProperties: true, description: "The session's current permission, folded from the three whole-value knob events (`permission/preset`, `sandbox/mode`, `approval/policy`) over the composition defaults. Selectable options come from the process-level catalog Remote. Key absence means no permission service is composed — clients hide the control." }, subagentCatalog: { type: "array", items: { oneOf: [{ type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "one-shot" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "external" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "continuable" }, label: { type: "string" } }, required: ["id", "createdAt", "mode", "label"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "unknown" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }] }, description: "Direct children in parent catalog event order, excluding fork-inherited facts." }, subagentTiming: { type: "object", properties: { settledMs: { type: "number", description: "Milliseconds accumulated across completed turns after the child's own descriptor." }, active: { type: "object", properties: { since: { type: "number", description: "Start of the open turn." }, through: { type: "number", description: "Latest event time folded into this projection cut." } }, required: ["since", "through"], additionalProperties: true, description: "Same-cut bounds of the currently open turn, when one has not reached `turn/end`." }, lastTurnCompleted: { type: "boolean", description: "Whether the latest closed turn after the child's own descriptor completed normally; absent while a turn is open or before one closes." } }, required: ["settledMs"], additionalProperties: true, description: "Active-turn duration and latest closed-turn completion for a descriptor-backed subagent session." }, subagent: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { mode: { type: "string", const: "one-shot", description: "A terminal one-shot child." }, label: { type: "string", description: "Optional durable creation label from the child's descriptor." }, seq: { type: "number", description: "Seq of the `subagent/descriptor` event this identity was folded from. `session.isOwnSeq(seq)` proves the identity comes from the child's OWN log suffix — where a descriptor is immutable once appended — and not from a fork seed's replayed ancestor descriptor." } }, required: ["mode", "seq"], additionalProperties: true }, { type: "object", properties: { mode: { type: "string", const: "continuable", description: "A resumable conversation." }, label: { type: "string", description: "Durable creation label from the child's descriptor." }, seq: { type: "number", description: "Seq of the folded descriptor event; see the one-shot arm for the own-suffix proof." } }, required: ["mode", "label", "seq"], additionalProperties: true }], description: "Identity of a descriptor-backed subagent session. `null` ⟺ no valid descriptor (missing, malformed, or unrecognized-version — deliberately undistinguished). The sentinel is deliberately serializable: a value pushed over JSON transports must survive `JSON.stringify` losslessly, where an `undefined` field would be dropped and a stale identity would survive on the receiving side. The entry itself stays non-optional." }, tokenUsage: { type: "object", properties: { uncachedInputTokens: { type: "number" }, outputTokens: { type: "number" }, cacheReadTokens: { type: "number" }, cacheWriteTokens: { type: "number" } }, required: ["uncachedInputTokens", "outputTokens", "cacheReadTokens", "cacheWriteTokens"], additionalProperties: true, description: "Provider-reported usage accumulated across the complete durable log." }, contextPressure: { type: "object", properties: { pressureTokens: { type: "number", description: "Provider-reported prompt size of the most recent request: uncached input plus cache reads and writes. Response output is excluded, so this does not grow as the current turn streams. Absent until a provider reports usage." }, projectedTokens: { type: "number", description: "What the NEXT request's prompt would cost: {@link pressureTokens} plus the heuristic repricing of everything the surface gained or lost since that sample. Only the delta is estimated, so the figure stays anchored to the provider while still reacting the moment a compaction shadows a span — which `pressureTokens` alone cannot do, since compaction reports no usage of its own. Absent until a provider reports usage." }, contextWindow: { type: "number", description: "Newest recorded route capacity; absent when no adapter advertised one." } }, required: [], additionalProperties: true, description: "Newest request pressure paired with the newest known route capacity." }, contextBreakdown: { type: "object", properties: { systemTokens: { type: "number", description: "Heuristic tokens of the last nonempty surviving system prompt in surface order; 0 when none exists." }, toolsTokens: { type: "number", description: "Heuristic tokens of the newest request envelope's tool schemas; 0 before any request." }, messageTokens: { type: "number", description: "Heuristic tokens of every other visible surface node, including superseded system prompts." } }, required: ["systemTokens", "toolsTokens", "messageTokens"], additionalProperties: true, description: "Heuristic system/tools/message composition of the next request." }, agentTeam: { type: "object", properties: { members: { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, role: { type: "string", enum: ["lead", "teammate"] }, phase: { type: "string", enum: ["failed", "provisioning", "active"], description: "Durable lifecycle; the Lead row is always `active`. Turn activity comes from Session status." }, error: { type: "string" } }, required: ["id", "name", "role", "phase"], additionalProperties: true } }, tasks: { type: "array", items: { type: "object", properties: { id: { type: "string" }, revision: { type: "number" }, subject: { type: "string" }, description: { type: "string" }, status: { type: "string", enum: ["completed", "pending", "in_progress", "deleted"] }, blockedBy: { type: "array", items: { type: "string" } }, writeScopes: { type: "array", items: { type: "string" } }, ownerName: { type: "string" }, ready: { type: "boolean" }, writeScopeWarnings: { type: "array", items: { type: "string" } } }, required: ["id", "revision", "subject", "description", "status", "blockedBy", "writeScopes", "ready", "writeScopeWarnings"], additionalProperties: true } }, failure: { type: "string" } }, required: ["members", "tasks"], additionalProperties: true, description: "Durable roster and non-deleted task board of the Team rooted at the projected Session." }, userQuestions: { type: "object", properties: { active: { type: "array", items: { type: "object", properties: { callId: { type: "string" }, questions: { type: "array", items: { type: "object", properties: { id: { type: "string", description: "Stable caller-provided question id, echoed in the answer." }, question: { type: "string", description: "The question to display." }, detail: { type: "string", description: "Optional supporting detail rendered with the question but kept out of option labels." }, header: { type: "string", description: "Optional short heading/group label." }, options: { type: "array", items: { type: "object", properties: { label: { type: "string", description: "User-facing label." }, description: { type: "string", description: "Optional extra context rendered by capable UIs." } }, required: ["label"], additionalProperties: true }, description: "Optional choices the UI can render as a menu." }, multiSelect: { type: "boolean", description: "Whether more than one option may be selected. Defaults to single-select." }, intent: { type: "object", properties: { kind: { type: "string", const: "plan-review", description: "A plan submitted for review: `detail` is the plan markdown `ask()` requires, and the decision approves or declines it." }, approve: { type: "string", description: "The option label that approves the plan; every other option declines it. Named rather than positional so no UI infers the verdict from option order. An `approve` naming no option of its own question is rejected at `ask()`." }, callId: { type: "string", description: "Logged tool invocation whose arguments contain the reviewed plan." } }, required: ["kind", "approve"], additionalProperties: true, description: "Optional presentation intent for capable UIs; absent asks for the generic option list." } }, required: ["id", "question"], additionalProperties: true } }, state: { type: "string", enum: ["open", "continued"] } }, required: ["callId", "questions", "state"], additionalProperties: true }, description: "Calls that can still take an answer, in ask order." }, settled: { type: "array", items: { type: "object", properties: { callId: { type: "string", description: "The settled call." }, answers: { type: "array", items: { type: "object", properties: { id: { type: "string", description: "The answered question id." }, selected: { type: "array", items: { type: "string" }, description: "Selected option labels. May accompany custom text for a multi-select question." }, custom: { type: "string", description: 'Optional free-text "Other" answer.' } }, required: ["id", "selected"], additionalProperties: true }, description: "The recorded batch, one entry per question; empty when the late reply carried none." } }, required: ["callId", "answers"], additionalProperties: true }, description: "Calls an answer settled, in settlement order." } }, required: ["active", "settled"], additionalProperties: true, description: "Timed questions that remain answerable in this Session, and the ones a late reply settled." }, goal: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { goal: { type: "object", properties: { objective: { type: "string", description: "Human-requested completion objective." }, phase: { type: "string", enum: ["active", "paused", "blocked", "complete"], description: "Durable lifecycle phase." }, blockedReason: { type: "object", properties: { code: { type: "string", description: "Stable lower-kebab-case classification chosen by the blocking policy." }, message: { type: "string", description: "Non-empty explanation shown to humans and models." } }, required: ["code", "message"], additionalProperties: true, description: "Present exactly while `phase` is `blocked`." }, maxGoalRounds: { type: "number", description: "Total admitted goal-round cap." }, id: { type: "string", description: "Stable goal identity." }, revision: { type: "number", description: "Positive revision; every durable mutation increments it." } }, required: ["objective", "phase", "maxGoalRounds", "id", "revision"], additionalProperties: true, description: "Current durable goal snapshot (the CAS ref for mutations rides on it)." }, roundsStarted: { type: "number", description: "Highest admitted round number for this goal." }, createdAt: { type: "number", description: "Epoch milliseconds of the create mutation." }, updatedAt: { type: "number", description: "Epoch milliseconds of the latest mutation." } }, required: ["goal", "roundsStarted", "createdAt", "updatedAt"], additionalProperties: true }], description: "The session's current goal and admitted-round count, or `null` before the first create and after a clear tombstone. `goal/change` supplies the whole lifecycle value; matching admitted `user/message` events advance `roundsStarted`." }, plan: { type: "object", properties: { active: { type: "boolean" }, pending: { type: "boolean" } }, required: ["active", "pending"], additionalProperties: true, description: "Plan collaboration state folded from the plan command lifecycle and `plan/mode` events." } }, required: [], additionalProperties: true, description: "Provider-validated values; omitted keys are absent capabilities at this cut." }, kind: { type: "string", const: "sequenced" } }, required: ["asOfSeq", "values", "kind"], additionalProperties: true }, { type: "object", properties: { kind: { type: "string", const: "migration-required" }, values: { type: "object", properties: { inbox: { type: "object", properties: { "next-turn": { type: "array", items: {} }, "next-step": { type: "array", items: {} } }, required: ["next-turn", "next-step"], additionalProperties: true, description: "Pending agent input reconstructed from durable inbox splices." }, workingDirectory: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "Recorded current directory for Session observations, or null when none is recorded." }, agentPreset: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "Preset the Session runs, or null when the deployment composes none." }, title: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "The session's current normalized title — the latest `session/title` event's text (last-wins), or `null` before the first title lands. A plain string: the shape the client list rows consume." }, todos: { oneOf: [{ type: "null", const: null }, { type: "array", items: { type: "object", properties: { content: { type: "string", description: "What this task is — a short imperative line shown in the UI." }, status: { type: "string", enum: ["completed", "pending", "in_progress"], description: "Lifecycle state. `in_progress` marks a task being worked now; parallel work may mark several." } }, required: ["content", "status"], additionalProperties: true } }], description: "The agent's current whole todo list (the latest `todo/write` snapshot), or `null` before the first write. Whole-value rule: every `todo/write` carries the complete replacement list, so the fold is last-wins." }, sessionListMetadata: { type: "object", properties: { blank: { type: "boolean", description: "Whether the folded prefix contains no turn." }, lastPromptAt: { oneOf: [{ type: "null", const: null }, { type: "number" }], description: "Latest human-authored prompt time in the folded prefix." } }, required: ["blank", "lastPromptAt"], additionalProperties: true, description: "Persisted facts used to summarize a Session without activating it." }, imageLimits: { type: "object", properties: { maxImageBytes: { type: "number" }, maxImagesPerMessage: { type: "number" }, maxMessageImageBytes: { type: "number" }, maxImagePixels: { type: "number" }, maxImageDimension: { type: "number", description: "Maximum intrinsic width and maximum intrinsic height in pixels for one image." }, mediaTypes: { type: "array", items: { type: "string", enum: ["image/png", "image/jpeg", "image/webp", "image/gif"] } } }, required: ["maxImageBytes", "maxImagesPerMessage", "maxMessageImageBytes", "maxImagePixels", "maxImageDimension", "mediaTypes"], additionalProperties: true, description: "Image-intake limits enforced by the Session prompt endpoint." }, modelSelection: { type: "object", properties: { lastUsed: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["provider", "model"], additionalProperties: true }], description: "Selection consumed by the latest recorded model request." }, next: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["provider", "model"], additionalProperties: true }], description: "Selection the next request should use, falling back to {@link lastUsed}." } }, required: ["lastUsed", "next"], additionalProperties: true, description: "Durable model selection already used and selected for the next request." }, permissions: { type: "object", properties: { currentValue: { type: "string", description: "The effective current value: a configured preset key, `auto`, or `custom`." } }, required: ["currentValue"], additionalProperties: true, description: "The session's current permission, folded from the three whole-value knob events (`permission/preset`, `sandbox/mode`, `approval/policy`) over the composition defaults. Selectable options come from the process-level catalog Remote. Key absence means no permission service is composed — clients hide the control." }, subagentCatalog: { type: "array", items: { oneOf: [{ type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "one-shot" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "external" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "continuable" }, label: { type: "string" } }, required: ["id", "createdAt", "mode", "label"], additionalProperties: true }, { type: "object", properties: { id: { type: "string" }, createdAt: { type: "number" }, mode: { type: "string", const: "unknown" }, label: { type: "string" } }, required: ["id", "createdAt", "mode"], additionalProperties: true }] }, description: "Direct children in parent catalog event order, excluding fork-inherited facts." }, subagentTiming: { type: "object", properties: { settledMs: { type: "number", description: "Milliseconds accumulated across completed turns after the child's own descriptor." }, active: { type: "object", properties: { since: { type: "number", description: "Start of the open turn." }, through: { type: "number", description: "Latest event time folded into this projection cut." } }, required: ["since", "through"], additionalProperties: true, description: "Same-cut bounds of the currently open turn, when one has not reached `turn/end`." }, lastTurnCompleted: { type: "boolean", description: "Whether the latest closed turn after the child's own descriptor completed normally; absent while a turn is open or before one closes." } }, required: ["settledMs"], additionalProperties: true, description: "Active-turn duration and latest closed-turn completion for a descriptor-backed subagent session." }, subagent: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { mode: { type: "string", const: "one-shot", description: "A terminal one-shot child." }, label: { type: "string", description: "Optional durable creation label from the child's descriptor." }, seq: { type: "number", description: "Seq of the `subagent/descriptor` event this identity was folded from. `session.isOwnSeq(seq)` proves the identity comes from the child's OWN log suffix — where a descriptor is immutable once appended — and not from a fork seed's replayed ancestor descriptor." } }, required: ["mode", "seq"], additionalProperties: true }, { type: "object", properties: { mode: { type: "string", const: "continuable", description: "A resumable conversation." }, label: { type: "string", description: "Durable creation label from the child's descriptor." }, seq: { type: "number", description: "Seq of the folded descriptor event; see the one-shot arm for the own-suffix proof." } }, required: ["mode", "label", "seq"], additionalProperties: true }], description: "Identity of a descriptor-backed subagent session. `null` ⟺ no valid descriptor (missing, malformed, or unrecognized-version — deliberately undistinguished). The sentinel is deliberately serializable: a value pushed over JSON transports must survive `JSON.stringify` losslessly, where an `undefined` field would be dropped and a stale identity would survive on the receiving side. The entry itself stays non-optional." }, tokenUsage: { type: "object", properties: { uncachedInputTokens: { type: "number" }, outputTokens: { type: "number" }, cacheReadTokens: { type: "number" }, cacheWriteTokens: { type: "number" } }, required: ["uncachedInputTokens", "outputTokens", "cacheReadTokens", "cacheWriteTokens"], additionalProperties: true, description: "Provider-reported usage accumulated across the complete durable log." }, contextPressure: { type: "object", properties: { pressureTokens: { type: "number", description: "Provider-reported prompt size of the most recent request: uncached input plus cache reads and writes. Response output is excluded, so this does not grow as the current turn streams. Absent until a provider reports usage." }, projectedTokens: { type: "number", description: "What the NEXT request's prompt would cost: {@link pressureTokens} plus the heuristic repricing of everything the surface gained or lost since that sample. Only the delta is estimated, so the figure stays anchored to the provider while still reacting the moment a compaction shadows a span — which `pressureTokens` alone cannot do, since compaction reports no usage of its own. Absent until a provider reports usage." }, contextWindow: { type: "number", description: "Newest recorded route capacity; absent when no adapter advertised one." } }, required: [], additionalProperties: true, description: "Newest request pressure paired with the newest known route capacity." }, contextBreakdown: { type: "object", properties: { systemTokens: { type: "number", description: "Heuristic tokens of the last nonempty surviving system prompt in surface order; 0 when none exists." }, toolsTokens: { type: "number", description: "Heuristic tokens of the newest request envelope's tool schemas; 0 before any request." }, messageTokens: { type: "number", description: "Heuristic tokens of every other visible surface node, including superseded system prompts." } }, required: ["systemTokens", "toolsTokens", "messageTokens"], additionalProperties: true, description: "Heuristic system/tools/message composition of the next request." }, agentTeam: { type: "object", properties: { members: { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, role: { type: "string", enum: ["lead", "teammate"] }, phase: { type: "string", enum: ["failed", "provisioning", "active"], description: "Durable lifecycle; the Lead row is always `active`. Turn activity comes from Session status." }, error: { type: "string" } }, required: ["id", "name", "role", "phase"], additionalProperties: true } }, tasks: { type: "array", items: { type: "object", properties: { id: { type: "string" }, revision: { type: "number" }, subject: { type: "string" }, description: { type: "string" }, status: { type: "string", enum: ["completed", "pending", "in_progress", "deleted"] }, blockedBy: { type: "array", items: { type: "string" } }, writeScopes: { type: "array", items: { type: "string" } }, ownerName: { type: "string" }, ready: { type: "boolean" }, writeScopeWarnings: { type: "array", items: { type: "string" } } }, required: ["id", "revision", "subject", "description", "status", "blockedBy", "writeScopes", "ready", "writeScopeWarnings"], additionalProperties: true } }, failure: { type: "string" } }, required: ["members", "tasks"], additionalProperties: true, description: "Durable roster and non-deleted task board of the Team rooted at the projected Session." }, userQuestions: { type: "object", properties: { active: { type: "array", items: { type: "object", properties: { callId: { type: "string" }, questions: { type: "array", items: { type: "object", properties: { id: { type: "string", description: "Stable caller-provided question id, echoed in the answer." }, question: { type: "string", description: "The question to display." }, detail: { type: "string", description: "Optional supporting detail rendered with the question but kept out of option labels." }, header: { type: "string", description: "Optional short heading/group label." }, options: { type: "array", items: { type: "object", properties: { label: { type: "string", description: "User-facing label." }, description: { type: "string", description: "Optional extra context rendered by capable UIs." } }, required: ["label"], additionalProperties: true }, description: "Optional choices the UI can render as a menu." }, multiSelect: { type: "boolean", description: "Whether more than one option may be selected. Defaults to single-select." }, intent: { type: "object", properties: { kind: { type: "string", const: "plan-review", description: "A plan submitted for review: `detail` is the plan markdown `ask()` requires, and the decision approves or declines it." }, approve: { type: "string", description: "The option label that approves the plan; every other option declines it. Named rather than positional so no UI infers the verdict from option order. An `approve` naming no option of its own question is rejected at `ask()`." }, callId: { type: "string", description: "Logged tool invocation whose arguments contain the reviewed plan." } }, required: ["kind", "approve"], additionalProperties: true, description: "Optional presentation intent for capable UIs; absent asks for the generic option list." } }, required: ["id", "question"], additionalProperties: true } }, state: { type: "string", enum: ["open", "continued"] } }, required: ["callId", "questions", "state"], additionalProperties: true }, description: "Calls that can still take an answer, in ask order." }, settled: { type: "array", items: { type: "object", properties: { callId: { type: "string", description: "The settled call." }, answers: { type: "array", items: { type: "object", properties: { id: { type: "string", description: "The answered question id." }, selected: { type: "array", items: { type: "string" }, description: "Selected option labels. May accompany custom text for a multi-select question." }, custom: { type: "string", description: 'Optional free-text "Other" answer.' } }, required: ["id", "selected"], additionalProperties: true }, description: "The recorded batch, one entry per question; empty when the late reply carried none." } }, required: ["callId", "answers"], additionalProperties: true }, description: "Calls an answer settled, in settlement order." } }, required: ["active", "settled"], additionalProperties: true, description: "Timed questions that remain answerable in this Session, and the ones a late reply settled." }, goal: { oneOf: [{ type: "null", const: null }, { type: "object", properties: { goal: { type: "object", properties: { objective: { type: "string", description: "Human-requested completion objective." }, phase: { type: "string", enum: ["active", "paused", "blocked", "complete"], description: "Durable lifecycle phase." }, blockedReason: { type: "object", properties: { code: { type: "string", description: "Stable lower-kebab-case classification chosen by the blocking policy." }, message: { type: "string", description: "Non-empty explanation shown to humans and models." } }, required: ["code", "message"], additionalProperties: true, description: "Present exactly while `phase` is `blocked`." }, maxGoalRounds: { type: "number", description: "Total admitted goal-round cap." }, id: { type: "string", description: "Stable goal identity." }, revision: { type: "number", description: "Positive revision; every durable mutation increments it." } }, required: ["objective", "phase", "maxGoalRounds", "id", "revision"], additionalProperties: true, description: "Current durable goal snapshot (the CAS ref for mutations rides on it)." }, roundsStarted: { type: "number", description: "Highest admitted round number for this goal." }, createdAt: { type: "number", description: "Epoch milliseconds of the create mutation." }, updatedAt: { type: "number", description: "Epoch milliseconds of the latest mutation." } }, required: ["goal", "roundsStarted", "createdAt", "updatedAt"], additionalProperties: true }], description: "The session's current goal and admitted-round count, or `null` before the first create and after a clear tombstone. `goal/change` supplies the whole lifecycle value; matching admitted `user/message` events advance `roundsStarted`." }, plan: { type: "object", properties: { active: { type: "boolean" }, pending: { type: "boolean" } }, required: ["active", "pending"], additionalProperties: true, description: "Plan collaboration state folded from the plan command lifecycle and `plan/mode` events." } }, required: [], additionalProperties: true } }, required: ["kind", "values"], additionalProperties: true }] }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 548, column: 9 }
    },
    "session/prompt": {
      service: "sessionController",
      description: "Admit one prompt after explicitly resuming its Session.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "Session identity, prompt content, source metadata, and delivery mode.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionPromptRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_prompt_parameter_0$schema,
            jsonSchema: { type: "object", properties: { requestId: { type: "string", description: "Client-minted identity persisted on the exact accepted user message." }, sessionId: { type: "string" }, mode: { type: "string", enum: ["queue", "steer"] }, content: { type: "array", items: { oneOf: [{ type: "object", properties: { type: { type: "string", const: "text" }, text: { type: "string" } }, required: ["type", "text"], additionalProperties: true }, { type: "object", properties: { type: { type: "string", const: "image" }, mediaType: { type: "string", enum: ["image/png", "image/jpeg", "image/webp", "image/gif"] }, data: { type: "string" }, name: { type: "string" } }, required: ["type", "mediaType", "data"], additionalProperties: true }, { type: "object", properties: { type: { type: "string", const: "file" }, receiptId: { type: "string" } }, required: ["type", "receiptId"], additionalProperties: true }] }, description: "At least one non-whitespace text part or attachment." }, clientTimeZone: { type: "string" } }, required: ["requestId", "sessionId", "mode", "content"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionPromptRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_prompt_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { requestId: { type: "string", description: "Client-minted identity persisted on the exact accepted user message." }, sessionId: { type: "string" }, mode: { type: "string", enum: ["queue", "steer"] }, content: { type: "array", items: { oneOf: [{ type: "object", properties: { type: { type: "string", const: "text" }, text: { type: "string" } }, required: ["type", "text"], additionalProperties: false }, { type: "object", properties: { type: { type: "string", const: "image" }, mediaType: { type: "string", enum: ["image/png", "image/jpeg", "image/webp", "image/gif"] }, data: { type: "string" }, name: { type: "string" } }, required: ["type", "mediaType", "data"], additionalProperties: false }, { type: "object", properties: { type: { type: "string", const: "file" }, receiptId: { type: "string" } }, required: ["type", "receiptId"], additionalProperties: false }] }, description: "At least one non-whitespace text part or attachment." }, clientTimeZone: { type: "string" } }, required: ["requestId", "sessionId", "mode", "content"], additionalProperties: false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionPromptValue",
        create: _deepseek_ai_dsh_api_session_controller_session_prompt_result$schema,
        description: "acknowledgement that the Agent accepted the prompt.",
        jsonSchema: { type: "object", properties: { accepted: { type: "boolean", const: true } }, required: ["accepted"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 462, column: 9 }
    },
    "session/rename": {
      service: "sessionController",
      description: "Rename one Session after explicitly resuming it.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "Session identity and proposed title.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionRenameRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_rename_parameter_0$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" }, title: { type: "string" } }, required: ["sessionId", "title"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionRenameRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_rename_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" }, title: { type: "string" } }, required: ["sessionId", "title"], additionalProperties: false }
          }
        }
      ],
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionRenameValue",
        create: _deepseek_ai_dsh_api_session_controller_session_rename_result$schema,
        description: "the accepted title and durable event sequence.",
        jsonSchema: { type: "object", properties: { title: { type: "string" }, seq: { type: "number" } }, required: ["title", "seq"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 431, column: 3 }
    },
    "session/search": {
      service: "sessionController",
      description: "Search visible Session content without resuming an Agent. A non-owner receives only the hits whose Session `allows()` admits; `hasMore` describes the bounded result before that filtering.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "literal message-content query.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionSearchRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_search_parameter_0$schema,
            jsonSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionSearchRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_search_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionSearchValue",
        create: _deepseek_ai_dsh_api_session_controller_session_search_result$schema,
        description: "authorized bounded Session search results.",
        jsonSchema: { type: "object", properties: { items: { type: "array", items: { type: "object", properties: { sessionId: { type: "string" }, snippet: { type: "string" } }, required: ["sessionId", "snippet"], additionalProperties: true } }, hasMore: { type: "boolean" } }, required: ["items", "hasMore"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 290, column: 9 }
    },
    "session/selectModel": {
      service: "sessionController",
      description: "Select one Session-local model after explicitly resuming the Session; save the default in the background.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "Session identity and requested model selection.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionSelectModelRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_selectModel_parameter_0$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" }, provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["sessionId", "provider", "model"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionSelectModelRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_selectModel_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" }, provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["sessionId", "provider", "model"], additionalProperties: false }
          }
        }
      ],
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionSelectModelValue",
        create: _deepseek_ai_dsh_api_session_controller_session_selectModel_result$schema,
        description: "the normalized selection installed for the Session, without waiting for default persistence.",
        jsonSchema: { type: "object", properties: { selected: { type: "object", properties: { provider: { type: "string" }, model: { type: "string" }, reasoningEffort: { type: "string" } }, required: ["provider", "model"], additionalProperties: true } }, required: ["selected"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 311, column: 3 }
    },
    "session/updateQueue": {
      service: "sessionController",
      description: "Mutate one still-pending queue occurrence, resuming a cold Agent first.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "Session, queue item, and requested mutation.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionUpdateQueueRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_updateQueue_parameter_0$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" }, itemId: { type: "string" }, action: { oneOf: [{ type: "object", properties: { kind: { type: "string", const: "edit" }, content: { type: "array", items: { type: "object", properties: { type: { type: "string", const: "text" }, text: { type: "string" } }, required: ["type", "text"], additionalProperties: true }, description: "Non-empty text-only replacement content." } }, required: ["kind", "content"], additionalProperties: true }, { type: "object", properties: { kind: { type: "string", const: "remove" } }, required: ["kind"], additionalProperties: true }, { type: "object", properties: { kind: { type: "string", const: "steer" } }, required: ["kind"], additionalProperties: true }] } }, required: ["sessionId", "itemId", "action"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionUpdateQueueRequest",
            create: _deepseek_ai_dsh_api_session_controller_session_updateQueue_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" }, itemId: { type: "string" }, action: { oneOf: [{ type: "object", properties: { kind: { type: "string", const: "edit" }, content: { type: "array", items: { type: "object", properties: { type: { type: "string", const: "text" }, text: { type: "string" } }, required: ["type", "text"], additionalProperties: false }, description: "Non-empty text-only replacement content." } }, required: ["kind", "content"], additionalProperties: false }, { type: "object", properties: { kind: { type: "string", const: "remove" } }, required: ["kind"], additionalProperties: false }, { type: "object", properties: { kind: { type: "string", const: "steer" } }, required: ["kind"], additionalProperties: false }] } }, required: ["sessionId", "itemId", "action"], additionalProperties: false }
          }
        }
      ],
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SessionUpdateQueueValue",
        create: _deepseek_ai_dsh_api_session_controller_session_updateQueue_result$schema,
        description: "acknowledgement that the queue mutation was applied.",
        jsonSchema: { type: "object", properties: { accepted: { type: "boolean", const: true } }, required: ["accepted"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 504, column: 3 }
    },
    "session/workspacePathApplications": {
      service: "sessionController",
      description: "Query current file handlers on the serving desktop without activating an Agent.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "file path in Host filesystem syntax.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller#session/workspacePathApplications:request",
            create: _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_parameter_0$schema,
            jsonSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller#session/workspacePathApplications:request",
            create: _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"], additionalProperties: false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller#session/workspacePathApplications:result",
        create: _deepseek_ai_dsh_api_session_controller_session_workspacePathApplications_result$schema,
        description: "OS application names, icons, and default selection; empty when desktop opening is unavailable.",
        jsonSchema: { type: "array", items: { type: "object", properties: { id: { type: "string", description: "OS application identifier; callers must revalidate it against the file's current handlers before opening." }, name: { type: "string" }, default: { type: "boolean" }, icon: { oneOf: [{ type: "null", const: null }, { type: "string" }], description: "PNG or SVG data URL, or null when the desktop supplies no icon." } }, required: ["id", "name", "default", "icon"], additionalProperties: true } }
      },
      sourceLocation: { file: "packages/api/session-controller/src/index.ts", line: 398, column: 9 }
    },
    "skills/list": {
      service: "sessionSkillCatalog",
      description: "List the user-invocable skills visible to one Session composition.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          description: "Session identity whose cwd and preset select the catalog view.",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SkillListRequest",
            create: _deepseek_ai_dsh_api_session_controller_skills_list_parameter_0$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"], additionalProperties: true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SkillListRequest",
            create: _deepseek_ai_dsh_api_session_controller_skills_list_parameter_0_strict$schema,
            jsonSchema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"], additionalProperties: false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "@deepseek-ai/dsh-api-session-controller/types#SkillListValue",
        create: _deepseek_ai_dsh_api_session_controller_skills_list_result$schema,
        description: "user-invocable skill metadata without loading skill bodies.",
        jsonSchema: { type: "object", properties: { skills: { type: "array", items: { type: "object", properties: { path: { type: "string", description: "Absolute SKILL.md path when supplied by a filesystem provider." }, name: { type: "string", description: "Kebab-case identifier referenced as `/name`." }, description: { type: "string", description: "Short routing description." }, whenToUse: { type: "string", description: "Optional extra routing guidance." }, modelInvocable: { type: "boolean", description: "Whether the same skill is also advertised to the model." } }, required: ["name", "description", "modelInvocable"], additionalProperties: true } } }, required: ["skills"], additionalProperties: true }
      },
      sourceLocation: { file: "packages/api/session-controller/src/skill-catalog.ts", line: 36, column: 9 }
    }
  }
}, exports_external);
var typert_remote_client_default = TYPERT_REMOTE;
export {
  Context,
  exports_client_node as Gateway,
  TypertRegistry,
  installConnection,
  typert_remote_client_default as sessionRemote
};
