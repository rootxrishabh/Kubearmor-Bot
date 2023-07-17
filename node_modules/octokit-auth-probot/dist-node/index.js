'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var authUnauthenticated = require('@octokit/auth-unauthenticated');
var authToken = require('@octokit/auth-token');
var authApp = require('@octokit/auth-app');

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

const _excluded = ["type", "factory"],
      _excluded2 = ["auth"],
      _excluded3 = ["auth"];
async function auth(state, options) {
  // return authentication from internal auth instance unless the event is "event-octokit"
  if (options.type !== "event-octokit") {
    if (state.type === "token" && options.type === "installation" && options.factory) {
      const {
        type,
        factory
      } = options,
            factoryAuthOptions = _objectWithoutProperties(options, _excluded); // @ts-expect-error - factory is typed as never because the `@octokit/auth-app` types are ... complicated.


      return factory(Object.assign({}, factoryAuthOptions, {
        octokit: state.octokit,
        octokitOptions: state.octokitOptions
      }));
    }

    return state.auth(options);
  } // unless the internal event type is "app", return the octokit
  // instance passed as strategy option


  if (state.type !== "app") {
    return state.octokit;
  }

  const action = options.event.payload.action;
  const installationId = options.event.payload.installation && options.event.payload.installation.id;
  const fullEventName = options.event.name + (action ? "." + action : "");
  const OctokitWithEventAuth = state.octokit.constructor;

  if (!installationId) {
    const _state$octokitOptions = state.octokitOptions,
          octokitOptions = _objectWithoutProperties(_state$octokitOptions, _excluded2);

    return new OctokitWithEventAuth(_objectSpread2({
      authStrategy: authUnauthenticated.createUnauthenticatedAuth,
      auth: {
        reason: `Handling a "${fullEventName}" event: an "installation" key is missing. The installation ID cannot be determined`
      }
    }, octokitOptions));
  }

  if (options.event.name === "installation" && ["suspend", "deleted"].includes(String(action))) {
    const _state$octokitOptions2 = state.octokitOptions,
          octokitOptions = _objectWithoutProperties(_state$octokitOptions2, _excluded3);

    return new OctokitWithEventAuth(_objectSpread2({
      authStrategy: authUnauthenticated.createUnauthenticatedAuth,
      auth: {
        reason: `Handling a "${fullEventName}" event: The app's access has been revoked from @octokit (id: ${installationId})`
      }
    }, octokitOptions));
  } // otherwise create a pre-authenticated (or unauthenticated) Octokit instance
  // depending on the event payload


  return state.auth({
    type: "installation",
    installationId,
    factory: auth => {
      const options = Object.assign({}, state.octokitOptions, {
        auth: Object.assign({}, auth, {
          installationId
        })
      });
      return new OctokitWithEventAuth(options);
    }
  });
}

function getState(options) {
  const common = {
    octokit: options.octokit,
    octokitOptions: options.octokitOptions
  };

  if ("token" in options) {
    return _objectSpread2({
      type: "token",
      auth: authToken.createTokenAuth(String(options.token))
    }, common);
  }

  if ("appId" in options && "privateKey" in options) {
    return _objectSpread2({
      type: "app",
      auth: authApp.createAppAuth(options)
    }, common);
  }

  return _objectSpread2({
    type: "unauthenticated",
    auth: authUnauthenticated.createUnauthenticatedAuth({
      reason: `Neither "appId"/"privateKey" nor "token" have been set as auth options`
    })
  }, common);
}

const VERSION = "0.0.0-development";

function createProbotAuth(options) {
  const state = getState(options);
  return Object.assign(auth.bind(null, state), {
    hook: state.auth.hook
  });
}
createProbotAuth.VERSION = VERSION;

exports.createProbotAuth = createProbotAuth;
//# sourceMappingURL=index.js.map
