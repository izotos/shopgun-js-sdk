(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SGN = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var SGN, process;

if (typeof process === 'undefined') {
  process = {
    browser: true
  };
}

SGN = _dereq_('./sgn');

SGN.request = _dereq_('./request/browser');

SGN.AuthKit = _dereq_('./kits/auth');

SGN.AssetsKit = _dereq_('./kits/assets');

SGN.EventsKit = _dereq_('./kits/events');

SGN.GraphKit = _dereq_('./kits/graph');

SGN.CoreKit = _dereq_('./kits/core');

SGN.PagedPublicationKit = _dereq_('./kits/paged_publication');

SGN.storage = {
  local: _dereq_('./storage/client_local'),
  cookie: _dereq_('./storage/client_cookie')
};

SGN.client = (function() {
  var firstOpen, id;
  id = SGN.storage.local.get('client-id');
  firstOpen = id == null;
  if (firstOpen) {
    id = SGN.util.uuid();
    SGN.storage.local.set('client-id', id);
  }
  return {
    firstOpen: firstOpen,
    id: id
  };
})();

SGN.startSession = function() {
  var eventTracker;
  eventTracker = SGN.config.get('eventTracker');
  if (eventTracker != null) {
    if (SGN.client.firstOpen === true) {
      eventTracker.trackEvent('first-client-session-opened', {}, '1.0.0');
    }
    eventTracker.trackEvent('client-session-opened', {}, '1.0.0');
  }
};

module.exports = SGN;


},{"./kits/assets":6,"./kits/auth":7,"./kits/core":8,"./kits/events":11,"./kits/graph":13,"./kits/paged_publication":20,"./request/browser":25,"./sgn":26,"./storage/client_cookie":27,"./storage/client_local":28}],2:[function(_dereq_,module,exports){
var attrs, keys,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

attrs = {};

keys = ['appVersion', 'appKey', 'appSecret', 'authToken', 'sessionToken', 'eventTracker', 'locale'];

module.exports = {
  set: function(config) {
    var key, value;
    if (config == null) {
      config = {};
    }
    for (key in config) {
      value = config[key];
      if (indexOf.call(keys, key) >= 0) {
        attrs[key] = value;
      }
    }
  },
  get: function(option) {
    return attrs[option];
  }
};


},{}],3:[function(_dereq_,module,exports){
var config, util;

config = _dereq_('./config');

util = _dereq_('./util');

module.exports = {
  config: config,
  util: util
};


},{"./config":2,"./util":29}],4:[function(_dereq_,module,exports){
module.exports = {
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37,
  SPACE: 32,
  NUMBER_ONE: 49
};


},{}],5:[function(_dereq_,module,exports){
var SGN;

SGN = _dereq_('../../sgn');

module.exports = function(options, callback, progressCallback) {
  var body, timeout, url;
  if (options == null) {
    options = {};
  }
  if (options.file == null) {
    throw new Error('File is not defined');
  }
  url = 'https://assets.service.shopgun.com/upload';
  body = new FormData();
  timeout = 1000 * 60 * 60;
  body.append('file', options.file);
  SGN.request({
    method: 'post',
    url: url,
    body: body,
    timeout: timeout,
    headers: {
      'Accept': 'application/json'
    }
  }, function(err, data) {
    if (err != null) {
      callback(SGN.util.error(new Error('Request error'), {
        code: 'RequestError'
      }));
    } else {
      if (data.statusCode === 200) {
        callback(null, JSON.parse(data.body));
      } else {
        callback(SGN.util.error(new Error('Request error'), {
          code: 'RequestError',
          statusCode: data.statusCode
        }));
      }
    }
  }, function(loaded, total) {
    if (typeof progressCallback === 'function') {
      progressCallback({
        progress: loaded / total,
        loaded: loaded,
        total: total
      });
    }
  });
};


},{"../../sgn":26}],6:[function(_dereq_,module,exports){
module.exports = {
  fileUpload: _dereq_('./file_upload')
};


},{"./file_upload":5}],7:[function(_dereq_,module,exports){
module.exports = {};


},{}],8:[function(_dereq_,module,exports){
var SGN, request, session;

SGN = _dereq_('../../sgn');

request = _dereq_('./request');

session = _dereq_('./session');

module.exports = {
  request: request,
  session: session
};


},{"../../sgn":26,"./request":9,"./session":10}],9:[function(_dereq_,module,exports){
var SGN;

SGN = _dereq_('../../sgn');

module.exports = function(options, callback) {
  if (options == null) {
    options = {};
  }
  SGN.CoreKit.session.ensure(function(err) {
    var appSecret, appVersion, baseUrl, clientId, geo, headers, locale, qs, ref, ref1, token;
    if (err != null) {
      return callback(err);
    }
    baseUrl = 'https://api.etilbudsavis.dk';
    headers = (ref = options.headers) != null ? ref : {};
    token = SGN.CoreKit.session.get('token');
    clientId = SGN.CoreKit.session.get('client_id');
    appVersion = SGN.config.get('appVersion');
    appSecret = SGN.config.get('appSecret');
    locale = SGN.config.get('locale');
    qs = (ref1 = options.qs) != null ? ref1 : {};
    geo = options.geolocation;
    headers['X-Token'] = token;
    if (appSecret != null) {
      headers['X-Signature'] = SGN.CoreKit.session.sign(appSecret, token);
    }
    if (locale != null) {
      qs.r_locale = locale;
    }
    if (appVersion != null) {
      qs.api_av = appVersion;
    }
    if (clientId != null) {
      qs.client_id = clientId;
    }
    if (geo != null) {
      if ((geo.latitude != null) && (qs.r_lat == null)) {
        qs.r_lat = geo.latitude;
      }
      if ((geo.longitude != null) && (qs.r_lng == null)) {
        qs.r_lng = geo.longitude;
      }
      if ((geo.radius != null) && (qs.r_radius == null)) {
        qs.r_radius = geo.radius;
      }
      if ((geo.sensor != null) && (qs.r_sensor == null)) {
        qs.r_sensor = geo.sensor;
      }
    }
    return SGN.request({
      method: options.method,
      url: baseUrl + options.url,
      qs: qs,
      body: options.body,
      headers: headers,
      useCookies: false
    }, function(err, data) {
      var responseToken;
      if (err != null) {
        callback(err);
      } else {
        token = SGN.CoreKit.session.get('token');
        responseToken = data.headers['x-token'];
        if (token !== responseToken) {
          SGN.CoreKit.session.set('token', responseToken);
        }
        if (typeof callback === 'function') {
          callback(null, JSON.parse(data.body));
        }
      }
    });
  });
};


},{"../../sgn":26}],10:[function(_dereq_,module,exports){
var SGN, clientCookieStorage, session, sha256;

SGN = _dereq_('../../sgn');

sha256 = _dereq_('sha256');

clientCookieStorage = _dereq_('../../storage/client_cookie');

session = {
  url: 'https://api.etilbudsavis.dk/v2/sessions',
  tokenTTL: 1 * 60 * 60 * 24 * 60,
  attrs: (function() {
    var ref;
    return (ref = clientCookieStorage.get('sessions')) != null ? ref : {};
  })(),
  callbackQueue: [],
  get: function(key) {
    var appKey, ref, ref1;
    appKey = SGN.config.get('appKey');
    if (key != null) {
      return (ref = session.attrs[appKey]) != null ? ref[key] : void 0;
    } else {
      return (ref1 = session.attrs[appKey]) != null ? ref1 : {};
    }
  },
  set: function(key, value) {
    var appKey, attrs, sessions;
    attrs = null;
    if (typeof key === 'object') {
      attrs = key;
    } else if (typeof key === 'string' && (value != null)) {
      attrs = session.attrs;
      attrs[key] = value;
    }
    appKey = SGN.config.get('appKey');
    sessions = clientCookieStorage.get('sessions');
    if (sessions == null) {
      sessions = {};
    }
    sessions[appKey] = attrs;
    clientCookieStorage.set('sessions', sessions);
    session.attrs = sessions;
  },
  create: function(callback) {
    SGN.request({
      method: 'post',
      url: session.url,
      headers: {
        'Accept': 'application/json'
      },
      qs: {
        api_key: SGN.config.get('appKey'),
        token_ttl: session.tokenTTL
      }
    }, function(err, data) {
      if (err != null) {
        callback(err);
      } else {
        session.set(JSON.parse(data.body));
        callback(err, session.get());
      }
    });
  },
  update: function(callback) {
    var appSecret, headers, token;
    headers = {};
    token = session.get('token');
    appSecret = SGN.config.get('appSecret');
    headers['X-Token'] = token;
    if (appSecret != null) {
      headers['X-Signature'] = session.sign(appSecret, token);
    }
    headers['Accept'] = 'application/json';
    SGN.request({
      url: session.url,
      headers: headers
    }, function(err, data) {
      if (err != null) {
        callback(err);
      } else {
        session.set(JSON.parse(data.body));
        callback(err, session.get());
      }
    });
  },
  renew: function(callback) {
    var appSecret, headers, token;
    headers = {};
    token = session.get('token');
    appSecret = SGN.config.get('appSecret');
    headers['X-Token'] = token;
    if (appSecret != null) {
      headers['X-Signature'] = session.sign(appSecret, token);
    }
    headers['Accept'] = 'application/json';
    SGN.request({
      method: 'put',
      url: session.url,
      headers: headers
    }, function(err, data) {
      if (err != null) {
        callback(err);
      } else {
        session.set(JSON.parse(data.body));
        callback(err, session.get());
      }
    });
  },
  ensure: function(callback) {
    var complete, queueCount;
    queueCount = session.callbackQueue.length;
    complete = function(err) {
      session.callbackQueue = session.callbackQueue.filter(function(fn) {
        fn(err);
        return false;
      });
    };
    session.callbackQueue.push(callback);
    if (queueCount === 0) {
      if (session.get('token') == null) {
        session.create(complete);
      } else if (session.willExpireSoon(session.get('expires'))) {
        session.renew(complete);
      } else {
        complete();
      }
    }
  },
  willExpireSoon: function(expires) {
    return Date.now() >= Date.parse(expires) - 1000 * 60 * 60 * 24;
  },
  sign: function(appSecret, token) {
    return sha256([appSecret, token].join(''));
  }
};

module.exports = session;


},{"../../sgn":26,"../../storage/client_cookie":27,"sha256":37}],11:[function(_dereq_,module,exports){
module.exports = {
  Tracker: _dereq_('./tracker')
};


},{"./tracker":12}],12:[function(_dereq_,module,exports){
var SGN, Tracker, clientLocalStorage, getPool, pool;

SGN = _dereq_('../../sgn');

clientLocalStorage = _dereq_('../../storage/client_local');

getPool = function() {
  var data;
  data = clientLocalStorage.get('event-tracker-pool');
  if (Array.isArray(data) === false) {
    data = [];
  }
  return data;
};

pool = getPool();

clientLocalStorage.set('event-tracker-pool', []);

try {
  window.addEventListener('unload', function() {
    pool = pool.concat(getPool());
    clientLocalStorage.set('event-tracker-pool', pool);
  }, false);
} catch (error) {}

module.exports = Tracker = (function() {
  Tracker.prototype.defaultOptions = {
    baseUrl: 'https://events.service.shopgun.com',
    trackId: null,
    dispatchInterval: 3000,
    dispatchLimit: 100,
    poolLimit: 1000,
    dryRun: false
  };

  function Tracker(options) {
    var key, ref, value;
    if (options == null) {
      options = {};
    }
    ref = this.defaultOptions;
    for (key in ref) {
      value = ref[key];
      this[key] = options[key] || value;
    }
    this.dispatching = false;
    this.session = {
      id: SGN.util.uuid()
    };
    this.client = {
      trackId: this.trackId,
      id: SGN.client.id
    };
    this.view = {
      path: [],
      previousPath: [],
      uri: null
    };
    this.location = {};
    this.application = {};
    this.identity = {};
    this.interval = setInterval(this.dispatch.bind(this), this.dispatchInterval);
    return;
  }

  Tracker.prototype.trackEvent = function(type, properties, version) {
    if (properties == null) {
      properties = {};
    }
    if (version == null) {
      version = '1.0.0';
    }
    if (typeof type !== 'string') {
      throw SGN.util.error(new Error('Event type is required'));
    }
    if (this.trackId == null) {
      return;
    }
    pool.push({
      id: SGN.util.uuid(),
      type: type,
      version: version,
      recordedAt: new Date().toISOString(),
      sentAt: null,
      client: {
        id: this.client.id,
        trackId: this.client.trackId
      },
      context: this.getContext(),
      properties: properties
    });
    while (this.getPoolSize() > this.poolLimit) {
      pool.shift();
    }
    return this;
  };

  Tracker.prototype.identify = function(id) {
    this.identity.id = id;
    return this;
  };

  Tracker.prototype.setLocation = function(location) {
    var ref, ref1;
    if (location == null) {
      location = {};
    }
    this.location.determinedAt = new Date(location.timestamp).toISOString();
    this.location.latitude = location.latitude;
    this.location.longitude = location.longitude;
    this.location.altitude = location.altitude;
    this.location.accuracy = {
      horizontal: (ref = location.accuracy) != null ? ref.horizontal : void 0,
      vertical: (ref1 = location.accuracy) != null ? ref1.vertical : void 0
    };
    this.location.speed = location.speed;
    this.location.floor = location.floor;
    return this;
  };

  Tracker.prototype.setApplication = function(application) {
    if (application == null) {
      application = {};
    }
    this.application.name = application.name;
    this.application.version = application.version;
    this.application.build = application.build;
    return this;
  };

  Tracker.prototype.setView = function(path) {
    this.view.previousPath = this.view.path;
    if (Array.isArray(path) === true) {
      this.view.path = path;
    }
    this.view.uri = window.location.href;
    return this;
  };

  Tracker.prototype.getView = function() {
    var view;
    view = {};
    if (this.view.path.length > 0) {
      view.path = this.view.path;
    }
    if (this.view.previousPath.length > 0) {
      view.previousPath = this.view.previousPath;
    }
    if (this.view.uri != null) {
      view.uri = this.view.uri;
    }
    return view;
  };

  Tracker.prototype.getContext = function() {
    var application, campaign, context, loc, os, ref, ref1, screenDimensions;
    screenDimensions = SGN.util.getScreenDimensions();
    os = SGN.util.getOS();
    context = {
      userAgent: window.navigator.userAgent,
      locale: navigator.language,
      timeZone: {
        utcOffsetSeconds: SGN.util.getUtcOffsetSeconds(),
        utcDstOffsetSeconds: SGN.util.getUtcDstOffsetSeconds()
      },
      device: {
        screen: {
          width: screenDimensions.physical.width,
          height: screenDimensions.physical.height,
          density: screenDimensions.density
        }
      },
      session: {
        id: this.session.id
      },
      view: this.getView()
    };
    application = {
      name: this.application.name,
      version: this.application.version,
      build: this.application.build
    };
    campaign = {
      source: SGN.util.getQueryParam('utm_source'),
      medium: SGN.util.getQueryParam('utm_medium'),
      name: SGN.util.getQueryParam('utm_campaign'),
      term: SGN.util.getQueryParam('utm_term'),
      content: SGN.util.getQueryParam('utm_content')
    };
    loc = {
      determinedAt: this.location.determinedAt,
      latitude: this.location.latitude,
      longitude: this.location.longitude,
      altitude: this.location.altitude,
      speed: this.location.speed,
      floor: this.location.floor,
      accuracy: {
        horizontal: (ref = this.location.accuracy) != null ? ref.horizontal : void 0,
        vertical: (ref1 = this.location.accuracy) != null ? ref1.vertical : void 0
      }
    };
    if (os != null) {
      context.os = {
        name: os
      };
    }
    if (document.referrer.length > 0) {
      context.session.referrer = document.referrer;
    }
    ['name', 'version', 'build'].forEach(function(key) {
      if (typeof application[key] !== 'string' || application[key].length === 0) {
        delete application[key];
      }
    });
    if (Object.keys(application).length > 0) {
      context.application = application;
    }
    ['source', 'medium', 'name', 'term', 'content'].forEach(function(key) {
      if (typeof campaign[key] !== 'string' || campaign[key].length === 0) {
        delete campaign[key];
      }
    });
    if (Object.keys(campaign).length > 0) {
      context.campaign = campaign;
    }
    ['latitude', 'longitude', 'altitude', 'speed', 'floor'].forEach(function(key) {
      if (typeof loc[key] !== 'number') {
        delete loc[key];
      }
    });
    if (typeof loc.accuracy.horizontal !== 'number') {
      delete loc.accuracy.horizontal;
    }
    if (typeof loc.accuracy.vertical !== 'number') {
      delete loc.accuracy.vertical;
    }
    if (Object.keys(loc.accuracy).length === 0) {
      delete loc.accuracy;
    }
    if (typeof loc.determinedAt !== 'string' || loc.determinedAt.length === 0) {
      delete loc.determinedAt;
    }
    if (Object.keys(loc).length > 0) {
      context.location = loc;
    }
    if (this.identity.id != null) {
      context.personId = this.identity.id;
    }
    return context;
  };

  Tracker.prototype.getPoolSize = function() {
    return pool.length;
  };

  Tracker.prototype.dispatch = function() {
    var events, nacks;
    if (this.dispatching === true || this.getPoolSize() === 0) {
      return;
    }
    if (this.dryRun === true) {
      return pool.splice(0, this.dispatchLimit);
    }
    events = pool.slice(0, this.dispatchLimit);
    nacks = 0;
    this.dispatching = true;
    this.ship(events, (function(_this) {
      return function(err, response) {
        _this.dispatching = false;
        if (err == null) {
          response.events.forEach(function(resEvent) {
            if (resEvent.status === 'validation_error' || resEvent.status === 'ack') {
              pool = pool.filter(function(poolEvent) {
                return poolEvent.id !== resEvent.id;
              });
            } else if ('nack') {
              nacks++;
            }
          });
          if (_this.getPoolSize() >= _this.dispatchLimit && nacks === 0) {
            _this.dispatch();
          }
        }
      };
    })(this));
    return this;
  };

  Tracker.prototype.ship = function(events, callback) {
    var http, payload, url;
    if (events == null) {
      events = [];
    }
    http = new XMLHttpRequest();
    url = this.baseUrl + '/track';
    payload = {
      events: events.map(function(event) {
        event.sentAt = new Date().toISOString();
        return event;
      })
    };
    http.open('POST', url);
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Accept', 'application/json');
    http.timeout = 1000 * 20;
    http.onload = function() {
      var err;
      if (http.status === 200) {
        try {
          callback(null, JSON.parse(http.responseText));
        } catch (error) {
          err = error;
          callback(SGN.util.error(new Error('Could not parse JSON')));
        }
      } else {
        callback(SGN.util.error(new Error('Server did not accept request')));
      }
    };
    http.onerror = function() {
      callback(SGN.util.error(new Error('Could not perform network request')));
    };
    http.send(JSON.stringify(payload));
    return this;
  };

  return Tracker;

})();


},{"../../sgn":26,"../../storage/client_local":28}],13:[function(_dereq_,module,exports){
module.exports = {
  request: _dereq_('./request')
};


},{"./request":14}],14:[function(_dereq_,module,exports){
var SGN, parseCookies;

SGN = _dereq_('../../sgn');

parseCookies = function(cookies) {
  var parsedCookies;
  if (cookies == null) {
    cookies = [];
  }
  parsedCookies = {};
  cookies.map(function(cookie) {
    var key, keyValuePair, parts, value;
    parts = cookie.split('; ');
    keyValuePair = parts[0].split('=');
    key = keyValuePair[0];
    value = keyValuePair[1];
    parsedCookies[key] = value;
  });
  return parsedCookies;
};

module.exports = function(options, callback) {
  var appKey, authToken, authTokenCookieName, timeout, url;
  if (options == null) {
    options = {};
  }
  url = 'https://graph.service.shopgun.com';
  timeout = 1000 * 12;
  appKey = SGN.config.get('appKey');
  authToken = SGN.config.get('authToken');
  authTokenCookieName = 'shopgun-auth-token';
  options = {
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: timeout,
    body: JSON.stringify({
      query: options.query,
      operationName: options.operationName,
      variables: options.variables
    })
  };
  if (appKey != null) {
    options.headers.Authorization = 'Basic ' + SGN.util.btoa("app-key:" + appKey);
  }
  if (SGN.util.isNode() && (authToken != null)) {
    options.cookies = [
      {
        key: authTokenCookieName,
        value: authToken,
        url: url
      }
    ];
  }
  SGN.request(options, function(err, data) {
    var cookies, ref;
    if (err != null) {
      callback(SGN.util.error(new Error('Graph request error'), {
        code: 'GraphRequestError'
      }));
    } else {
      if (data.statusCode === 200) {
        if (SGN.util.isNode()) {
          cookies = parseCookies((ref = data.headers) != null ? ref['set-cookie'] : void 0);
          if (SGN.config.get('authToken') !== cookies[authTokenCookieName]) {
            SGN.config.set('authToken', cookies[authTokenCookieName]);
          }
        }
        callback(null, JSON.parse(data.body));
      } else {
        callback(SGN.util.error(new Error('Request error'), {
          code: 'RequestError',
          statusCode: data.statusCode
        }));
      }
    }
  });
};


},{"../../sgn":26}],15:[function(_dereq_,module,exports){
var MicroEvent, PagedPublicationControls, SGN, keyCodes;

MicroEvent = _dereq_('microevent');

SGN = _dereq_('../../sgn');

keyCodes = _dereq_('../../key_codes');

PagedPublicationControls = (function() {
  function PagedPublicationControls(el, options) {
    this.options = options != null ? options : {};
    this.els = {
      root: el,
      progress: el.querySelector('.sgn-pp__progress'),
      progressBar: el.querySelector('.sgn-pp-progress__bar'),
      progressLabel: el.querySelector('.sgn-pp__progress-label'),
      prevControl: el.querySelector('.sgn-pp__control[data-direction=prev]'),
      nextControl: el.querySelector('.sgn-pp__control[data-direction=next]')
    };
    this.keyDownListener = SGN.util.throttle(this.keyDown, 150, this);
    this.mouseMoveListener = SGN.util.throttle(this.mouseMove, 50, this);
    if (this.options.keyboard === true) {
      this.els.root.addEventListener('keydown', this.keyDownListener, false);
    }
    this.els.root.addEventListener('mousemove', this.mouseMoveListener, false);
    if (this.els.prevControl != null) {
      this.els.prevControl.addEventListener('click', this.prevClicked.bind(this), false);
    }
    if (this.els.nextControl != null) {
      this.els.nextControl.addEventListener('click', this.nextClicked.bind(this), false);
    }
    this.bind('beforeNavigation', this.beforeNavigation.bind(this));
    return;
  }

  PagedPublicationControls.prototype.destroy = function() {
    this.els.root.removeEventListener('keydown', this.keyDownListener);
    this.els.root.removeEventListener('mousemove', this.mouseMoveListener);
  };

  PagedPublicationControls.prototype.beforeNavigation = function(e) {
    var showProgress, visibilityClassName;
    showProgress = typeof e.progressLabel === 'string' && e.progressLabel.length > 0;
    visibilityClassName = 'sgn-pp--hidden';
    if ((this.els.progress != null) && (this.els.progressBar != null)) {
      this.els.progressBar.style.width = e.progress + "%";
      if (showProgress === true) {
        this.els.progress.classList.remove(visibilityClassName);
      } else {
        this.els.progress.classList.add(visibilityClassName);
      }
    }
    if (this.els.progressLabel != null) {
      if (showProgress === true) {
        this.els.progressLabel.textContent = e.progressLabel;
        this.els.progressLabel.classList.remove(visibilityClassName);
      } else {
        this.els.progressLabel.classList.add(visibilityClassName);
      }
    }
    if (this.els.prevControl != null) {
      if (e.verso.newPosition === 0) {
        this.els.prevControl.classList.add(visibilityClassName);
      } else {
        this.els.prevControl.classList.remove(visibilityClassName);
      }
    }
    if (this.els.nextControl != null) {
      if (e.verso.newPosition === e.pageSpreadCount - 1) {
        this.els.nextControl.classList.add(visibilityClassName);
      } else {
        this.els.nextControl.classList.remove(visibilityClassName);
      }
    }
  };

  PagedPublicationControls.prototype.prevClicked = function(e) {
    e.preventDefault();
    this.trigger('prev');
  };

  PagedPublicationControls.prototype.nextClicked = function(e) {
    e.preventDefault();
    this.trigger('next');
  };

  PagedPublicationControls.prototype.keyDown = function(e) {
    var keyCode;
    keyCode = e.keyCode;
    if (keyCodes.ARROW_LEFT === keyCode) {
      this.trigger('prev', {
        duration: 0
      });
    } else if (keyCodes.ARROW_RIGHT === keyCode || keyCodes.SPACE === keyCode) {
      this.trigger('next', {
        duration: 0
      });
    } else if (keyCodes.NUMBER_ONE === keyCode) {
      this.trigger('first', {
        duration: 0
      });
    }
  };

  PagedPublicationControls.prototype.mouseMove = function() {
    this.els.root.dataset.mouseMoving = true;
    clearTimeout(this.mouseMoveTimeout);
    this.mouseMoveTimeout = setTimeout((function(_this) {
      return function() {
        _this.els.root.dataset.mouseMoving = false;
      };
    })(this), 4000);
  };

  return PagedPublicationControls;

})();

MicroEvent.mixin(PagedPublicationControls);

module.exports = PagedPublicationControls;


},{"../../key_codes":4,"../../sgn":26,"microevent":35}],16:[function(_dereq_,module,exports){
var MicroEvent, PageSpreads, PagedPublicationCore, SGN, Verso, clientLocalStorage;

MicroEvent = _dereq_('microevent');

Verso = _dereq_('verso');

PageSpreads = _dereq_('./page_spreads');

clientLocalStorage = _dereq_('../../storage/client_local');

SGN = _dereq_('../../sgn');

PagedPublicationCore = (function() {
  PagedPublicationCore.prototype.defaults = {
    pages: [],
    pageSpreadWidth: 100,
    pageSpreadMaxZoomScale: 4,
    idleDelay: 1000,
    resizeDelay: 400,
    color: '#ffffff'
  };

  function PagedPublicationCore(el, options) {
    var ref;
    if (options == null) {
      options = {};
    }
    this.options = this.makeOptions(options, this.defaults);
    this.pageId = (ref = this.getOption('pageId')) != null ? ref : this.getSavedPageId();
    this.els = {
      root: el,
      pages: el.querySelector('.sgn-pp__pages'),
      verso: el.querySelector('.verso')
    };
    this.pageMode = this.getPageMode();
    this.pageSpreads = new PageSpreads({
      pages: this.getOption('pages'),
      maxZoomScale: this.getOption('pageSpreadMaxZoomScale'),
      width: this.getOption('pageSpreadWidth')
    });
    this.pageSpreads.bind('pageLoaded', this.pageLoaded.bind(this));
    this.pageSpreads.bind('pagesLoaded', this.pagesLoaded.bind(this));
    this.setColor(this.getOption('color'));
    this.els.pages.parentNode.insertBefore(this.pageSpreads.update(this.pageMode).getFrag(), this.els.pages);
    this.verso = this.createVerso();
    this.bind('started', this.start.bind(this));
    this.bind('destroyed', this.destroy.bind(this));
    return;
  }

  PagedPublicationCore.prototype.start = function() {
    this.getVerso().start();
    this.visibilityChangeListener = this.visibilityChange.bind(this);
    this.resizeListener = SGN.util.throttle(this.resize, this.getOption('resizeDelay'), this);
    this.unloadListener = this.unload.bind(this);
    document.addEventListener('visibilitychange', this.visibilityChangeListener, false);
    window.addEventListener('resize', this.resizeListener, false);
    window.addEventListener('beforeunload', this.unloadListener, false);
    this.els.root.dataset.started = '';
    this.els.root.setAttribute('tabindex', '-1');
    this.els.root.focus();
  };

  PagedPublicationCore.prototype.destroy = function() {
    this.getVerso().destroy();
    document.removeEventListener('visibilitychange', this.visibilityChangeListener, false);
    window.removeEventListener('resize', this.resizeListener, false);
  };

  PagedPublicationCore.prototype.makeOptions = function(options, defaults) {
    var key, opts, ref, value;
    opts = {};
    for (key in options) {
      value = options[key];
      opts[key] = (ref = options[key]) != null ? ref : defaults[key];
    }
    return opts;
  };

  PagedPublicationCore.prototype.getOption = function(key) {
    return this.options[key];
  };

  PagedPublicationCore.prototype.setColor = function(color) {
    this.els.root.dataset.colorBrightness = SGN.util.getColorBrightness(color);
    this.els.root.style.backgroundColor = color;
  };

  PagedPublicationCore.prototype.createVerso = function() {
    var verso;
    verso = new Verso(this.els.verso, {
      pageId: this.pageId
    });
    verso.pageSpreads.forEach((function(_this) {
      return function(pageSpread) {
        if (pageSpread.getType() === 'page') {
          pageSpread.getContentRect = function() {
            return _this.getContentRect(pageSpread);
          };
        }
      };
    })(this));
    verso.bind('beforeNavigation', this.beforeNavigation.bind(this));
    verso.bind('afterNavigation', this.afterNavigation.bind(this));
    verso.bind('attemptedNavigation', this.attemptedNavigation.bind(this));
    verso.bind('clicked', this.clicked.bind(this));
    verso.bind('doubleClicked', this.doubleClicked.bind(this));
    verso.bind('pressed', this.pressed.bind(this));
    verso.bind('panStart', this.panStart.bind(this));
    verso.bind('panEnd', this.panEnd.bind(this));
    verso.bind('zoomedIn', this.zoomedIn.bind(this));
    verso.bind('zoomedOut', this.zoomedOut.bind(this));
    return verso;
  };

  PagedPublicationCore.prototype.getVerso = function() {
    return this.verso;
  };

  PagedPublicationCore.prototype.getContentRect = function(pageSpread) {
    var actualHeight, actualWidth, clientRect, imageRatio, pageCount, pageEl, pageEls, pageHeight, pageWidth, rect, scale;
    rect = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0
    };
    pageEls = pageSpread.getPageEls();
    pageEl = pageEls[0];
    pageCount = pageEls.length;
    scale = this.getVerso().transform.scale;
    pageWidth = pageEl.offsetWidth * pageCount * scale;
    pageHeight = pageEl.offsetHeight * scale;
    imageRatio = +pageEl.dataset.height / (+pageEl.dataset.width * pageCount);
    actualHeight = pageHeight;
    actualWidth = actualHeight / imageRatio;
    actualWidth = Math.min(pageWidth, actualWidth);
    actualHeight = actualWidth * imageRatio;
    clientRect = pageEl.getBoundingClientRect();
    rect.width = actualWidth;
    rect.height = actualHeight;
    rect.top = clientRect.top + (pageHeight - actualHeight) / 2;
    rect.left = clientRect.left + (pageWidth - actualWidth) / 2;
    rect.right = rect.width + rect.left;
    rect.bottom = rect.height + rect.top;
    return rect;
  };

  PagedPublicationCore.prototype.formatProgressLabel = function(pageSpread) {
    var label, pageCount, pageIds, pageLabels, pages, ref;
    pages = (ref = pageSpread != null ? pageSpread.options.pages : void 0) != null ? ref : [];
    pageIds = pages.map(function(page) {
      return page.id;
    });
    pageLabels = pages.map(function(page) {
      return page.label;
    });
    pageCount = this.getOption('pages').length;
    label = pageIds.length > 0 ? pageLabels.join('-') + ' / ' + pageCount : null;
    return label;
  };

  PagedPublicationCore.prototype.renderPageSpreads = function() {
    this.getVerso().pageSpreads.forEach((function(_this) {
      return function(pageSpread) {
        var match, visibility;
        visibility = pageSpread.getVisibility();
        match = _this.pageSpreads.get(pageSpread.getId());
        if (match != null) {
          if (visibility === 'visible' && match.contentsRendered === false) {
            setTimeout(match.renderContents.bind(match), 0);
          }
          if (visibility === 'gone' && match.contentsRendered === true) {
            setTimeout(match.clearContents.bind(match), 0);
          }
        }
      };
    })(this));
    return this;
  };

  PagedPublicationCore.prototype.findPage = function(pageId) {
    return this.getOption('pages').find(function(page) {
      return page.id === pageId;
    });
  };

  PagedPublicationCore.prototype.getSavedPageId = function() {
    var id;
    id = this.getOption('id');
    return clientLocalStorage.get("paged-publication-progress-" + id);
  };

  PagedPublicationCore.prototype.saveCurrentPageId = function(pageId) {
    var id;
    id = this.getOption('id');
    clientLocalStorage.set("paged-publication-progress-" + id, pageId);
  };

  PagedPublicationCore.prototype.pageLoaded = function(e) {
    this.trigger('pageLoaded', e);
  };

  PagedPublicationCore.prototype.pagesLoaded = function(e) {
    this.trigger('pagesLoaded', e);
  };

  PagedPublicationCore.prototype.beforeNavigation = function(e) {
    var pageSpread, pageSpreadCount, position, progress, progressLabel, versoPageSpread;
    position = e.newPosition;
    versoPageSpread = this.getVerso().getPageSpreadFromPosition(position);
    pageSpread = this.pageSpreads.get(versoPageSpread.getId());
    pageSpreadCount = this.getVerso().getPageSpreadCount();
    progress = (position + 1) / pageSpreadCount * 100;
    progressLabel = this.formatProgressLabel(pageSpread);
    this.renderPageSpreads();
    this.saveCurrentPageId(versoPageSpread.getPageIds()[0]);
    this.resetIdleTimer();
    this.startIdleTimer();
    this.trigger('beforeNavigation', {
      verso: e,
      pageSpread: pageSpread,
      progress: progress,
      progressLabel: progressLabel,
      pageSpreadCount: pageSpreadCount
    });
  };

  PagedPublicationCore.prototype.afterNavigation = function(e) {
    var pageSpread, position, versoPageSpread;
    position = e.newPosition;
    versoPageSpread = this.getVerso().getPageSpreadFromPosition(position);
    pageSpread = this.pageSpreads.get(versoPageSpread.getId());
    this.trigger('afterNavigation', {
      verso: e,
      pageSpread: pageSpread
    });
  };

  PagedPublicationCore.prototype.attemptedNavigation = function(e) {
    this.trigger('attemptedNavigation', {
      verso: e
    });
  };

  PagedPublicationCore.prototype.clicked = function(e) {
    var page, pageId;
    if (e.isInsideContent) {
      pageId = e.pageEl.dataset.id;
      page = this.findPage(pageId);
      this.trigger('clicked', {
        verso: e,
        page: page
      });
    }
  };

  PagedPublicationCore.prototype.doubleClicked = function(e) {
    var page, pageId;
    if (e.isInsideContent) {
      pageId = e.pageEl.dataset.id;
      page = this.findPage(pageId);
      this.trigger('doubleClicked', {
        verso: e,
        page: page
      });
    }
  };

  PagedPublicationCore.prototype.pressed = function(e) {
    var page, pageId;
    if (e.isInsideContent) {
      pageId = e.pageEl.dataset.id;
      page = this.findPage(pageId);
      this.trigger('pressed', {
        verso: e,
        page: page
      });
    }
  };

  PagedPublicationCore.prototype.panStart = function() {
    this.resetIdleTimer();
    this.trigger('panStart', {
      scale: this.getVerso().transform.scale
    });
  };

  PagedPublicationCore.prototype.panEnd = function() {
    this.startIdleTimer();
    this.trigger('panEnd');
  };

  PagedPublicationCore.prototype.zoomedIn = function(e) {
    var pageSpread, position, versoPageSpread;
    position = e.position;
    versoPageSpread = this.getVerso().getPageSpreadFromPosition(position);
    pageSpread = this.pageSpreads.get(versoPageSpread.getId());
    if (pageSpread != null) {
      pageSpread.zoomIn();
    }
    this.els.root.dataset.zoomedIn = true;
    this.trigger('zoomedIn', {
      verso: e,
      pageSpread: pageSpread
    });
  };

  PagedPublicationCore.prototype.zoomedOut = function(e) {
    var pageSpread, position, versoPageSpread;
    position = e.position;
    versoPageSpread = this.getVerso().getPageSpreadFromPosition(position);
    pageSpread = this.pageSpreads.get(versoPageSpread.getId());
    if (pageSpread != null) {
      pageSpread.zoomOut();
    }
    this.els.root.dataset.zoomedIn = false;
    this.trigger('zoomedOut', {
      verso: e,
      pageSpread: pageSpread
    });
  };

  PagedPublicationCore.prototype.getPageMode = function() {
    var height, pageMode, ratio, width;
    pageMode = this.getOption('pageMode');
    if (pageMode == null) {
      width = this.els.root.offsetWidth;
      height = this.els.root.offsetHeight;
      ratio = height / width;
      pageMode = ratio >= 0.75 ? 'single' : 'double';
    }
    return pageMode;
  };

  PagedPublicationCore.prototype.resetIdleTimer = function() {
    clearTimeout(this.idleTimeout);
    this.els.root.dataset.idle = false;
    return this;
  };

  PagedPublicationCore.prototype.startIdleTimer = function() {
    this.idleTimeout = setTimeout((function(_this) {
      return function() {
        _this.els.root.dataset.idle = true;
      };
    })(this), this.getOption('idleDelay'));
    return this;
  };

  PagedPublicationCore.prototype.switchPageMode = function(pageMode) {
    var i, len, pageIds, pageSpreadEl, pageSpreadEls, verso;
    if (this.pageMode === pageMode) {
      return this;
    }
    verso = this.getVerso();
    pageIds = verso.getPageSpreadFromPosition(verso.getPosition()).getPageIds();
    pageSpreadEls = this.getVerso().el.querySelectorAll('.sgn-pp__page-spread');
    this.pageMode = pageMode;
    this.pageSpreads.update(this.pageMode);
    for (i = 0, len = pageSpreadEls.length; i < len; i++) {
      pageSpreadEl = pageSpreadEls[i];
      pageSpreadEl.parentNode.removeChild(pageSpreadEl);
    }
    this.els.pages.parentNode.insertBefore(this.pageSpreads.getFrag(), this.els.pages);
    verso.refresh();
    verso.navigateTo(verso.getPageSpreadPositionFromPageId(pageIds[0]), {
      duration: 0
    });
    return this;
  };

  PagedPublicationCore.prototype.visibilityChange = function() {
    var eventName, pageSpread;
    pageSpread = this.getVerso().getPageSpreadFromPosition(this.getVerso().getPosition());
    eventName = document.hidden === true ? 'disappeared' : 'appeared';
    this.trigger(eventName, {
      pageSpread: this.pageSpreads.get(pageSpread.id)
    });
  };

  PagedPublicationCore.prototype.resize = function() {
    if (this.getOption('pageMode') == null) {
      this.switchPageMode(this.getPageMode());
    }
    this.trigger('resized');
  };

  PagedPublicationCore.prototype.unload = function() {
    this.trigger('disappeared');
  };

  return PagedPublicationCore;

})();

MicroEvent.mixin(PagedPublicationCore);

module.exports = PagedPublicationCore;


},{"../../sgn":26,"../../storage/client_local":28,"./page_spreads":23,"microevent":35,"verso":38}],17:[function(_dereq_,module,exports){
var MicroEvent, PagedPublicationEventTracking,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

MicroEvent = _dereq_('microevent');

PagedPublicationEventTracking = (function() {
  function PagedPublicationEventTracking() {
    this.doubleClicked = bind(this.doubleClicked, this);
    this.hidden = true;
    this.pageSpread = null;
    this.bind('appeared', this.appeared.bind(this));
    this.bind('disappeared', this.disappeared.bind(this));
    this.bind('beforeNavigation', this.beforeNavigation.bind(this));
    this.bind('afterNavigation', this.afterNavigation.bind(this));
    this.bind('attemptedNavigation', this.attemptedNavigation.bind(this));
    this.bind('clicked', this.clicked.bind(this));
    this.bind('doubleClicked', this.doubleClicked.bind(this));
    this.bind('pressed', this.pressed.bind(this));
    this.bind('panStart', this.panStart.bind(this));
    this.bind('zoomedIn', this.zoomedIn.bind(this));
    this.bind('zoomedOut', this.zoomedOut.bind(this));
    this.bind('destroyed', this.destroy.bind(this));
    this.trackOpened();
    this.trackAppeared();
    return;
  }

  PagedPublicationEventTracking.prototype.destroy = function() {
    this.pageSpreadDisappeared();
    this.trackDisappeared();
  };

  PagedPublicationEventTracking.prototype.trackEvent = function(type, properties) {
    if (properties == null) {
      properties = {};
    }
    this.trigger('trackEvent', {
      type: type,
      properties: properties
    });
  };

  PagedPublicationEventTracking.prototype.trackOpened = function(properties) {
    this.trackEvent('paged-publication-opened', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.trackAppeared = function(properties) {
    this.trackEvent('paged-publication-appeared', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.trackDisappeared = function(properties) {
    this.trackEvent('paged-publication-disappeared', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.trackPageClicked = function(properties) {
    this.trackEvent('paged-publication-page-clicked', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.trackPageDoubleClicked = function(properties) {
    this.trackEvent('paged-publication-page-double-clicked', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.trackPageLongPressed = function(properties) {
    this.trackEvent('paged-publication-page-long-pressed', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.trackPageHotspotsClicked = function(properties) {
    this.trackEvent('paged-publication-page-hotspots-clicked', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.trackPageSpreadAppeared = function(properties) {
    this.trackEvent('paged-publication-page-spread-appeared', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.trackPageSpreadDisappeared = function(properties) {
    this.trackEvent('paged-publication-page-spread-disappeared', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.trackPageSpreadZoomedIn = function(properties) {
    this.trackEvent('paged-publication-page-spread-zoomed-in', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.trackPageSpreadZoomedOut = function(properties) {
    this.trackEvent('paged-publication-page-spread-zoomed-out', properties);
    return this;
  };

  PagedPublicationEventTracking.prototype.appeared = function(e) {
    this.trackAppeared();
    this.pageSpreadAppeared(e.pageSpread);
  };

  PagedPublicationEventTracking.prototype.disappeared = function() {
    this.pageSpreadDisappeared();
    this.trackDisappeared();
  };

  PagedPublicationEventTracking.prototype.beforeNavigation = function() {
    this.pageSpreadDisappeared();
  };

  PagedPublicationEventTracking.prototype.afterNavigation = function(e) {
    this.pageSpreadAppeared(e.pageSpread);
  };

  PagedPublicationEventTracking.prototype.attemptedNavigation = function(e) {
    this.pageSpreadAppeared(e.pageSpread);
  };

  PagedPublicationEventTracking.prototype.clicked = function(e) {
    var properties;
    if (e.page != null) {
      properties = {
        pageNumber: e.page.pageNumber,
        x: e.verso.pageX,
        y: e.verso.pageY
      };
      this.trackPageClicked({
        pagedPublicationPage: properties
      });
      if (e.verso.overlayEls.length > 0) {
        this.trackPageHotspotsClicked({
          pagedPublicationPage: properties
        });
      }
    }
  };

  PagedPublicationEventTracking.prototype.doubleClicked = function(e) {
    if (e.page != null) {
      this.trackPageDoubleClicked({
        pagedPublicationPage: {
          pageNumber: e.page.pageNumber,
          x: e.verso.pageX,
          y: e.verso.pageY
        }
      });
    }
  };

  PagedPublicationEventTracking.prototype.pressed = function(e) {
    if (e.page != null) {
      this.trackPageLongPressed({
        pagedPublicationPage: {
          pageNumber: e.page.pageNumber,
          x: e.verso.pageX,
          y: e.verso.pageY
        }
      });
    }
  };

  PagedPublicationEventTracking.prototype.panStart = function(e) {
    if (e.scale === 1) {
      this.pageSpreadDisappeared();
    }
  };

  PagedPublicationEventTracking.prototype.zoomedIn = function(e) {
    if (e.pageSpread != null) {
      this.trackPageSpreadZoomedIn({
        pagedPublicationPageSpread: {
          pageNumbers: e.pageSpread.getPages().map(function(page) {
            return page.pageNumber;
          })
        }
      });
    }
  };

  PagedPublicationEventTracking.prototype.zoomedOut = function(e) {
    if (e.pageSpread != null) {
      this.trackPageSpreadZoomedOut({
        pagedPublicationPageSpread: {
          pageNumbers: e.pageSpread.getPages().map(function(page) {
            return page.pageNumber;
          })
        }
      });
    }
  };

  PagedPublicationEventTracking.prototype.pageSpreadAppeared = function(pageSpread) {
    if ((pageSpread != null) && this.hidden === true) {
      this.pageSpread = pageSpread;
      this.trackPageSpreadAppeared({
        pagedPublicationPageSpread: {
          pageNumbers: pageSpread.getPages().map(function(page) {
            return page.pageNumber;
          })
        }
      });
      this.hidden = false;
    }
  };

  PagedPublicationEventTracking.prototype.pageSpreadDisappeared = function() {
    if ((this.pageSpread != null) && this.hidden === false) {
      this.trackPageSpreadDisappeared({
        pagedPublicationPageSpread: {
          pageNumbers: this.pageSpread.getPages().map(function(page) {
            return page.pageNumber;
          })
        }
      });
      this.hidden = true;
      this.pageSpread = null;
    }
  };

  return PagedPublicationEventTracking;

})();

MicroEvent.mixin(PagedPublicationEventTracking);

module.exports = PagedPublicationEventTracking;


},{"microevent":35}],18:[function(_dereq_,module,exports){
var PagedPublicationHotspotPicker;

module.exports = PagedPublicationHotspotPicker = (function() {
  function PagedPublicationHotspotPicker(options) {
    this.options = options != null ? options : {};
    this.el = document.createElement('div');
    this.render();
    return;
  }

  PagedPublicationHotspotPicker.prototype.render = function() {
    this.el.className = 'sgn-pp__hotspot-picker';
    this.el.style.top = this.options.y + "px";
    this.el.style.left = this.options.x + "px";
    this.options.hotspots.forEach((function(_this) {
      return function(hotspot) {
        var el;
        el = document.createElement('div');
        el.textContent = hotspot.title;
        _this.el.appendChild(el);
      };
    })(this));
    return this;
  };

  return PagedPublicationHotspotPicker;

})();


},{}],19:[function(_dereq_,module,exports){
var MicroEvent, PagedPublicationHotspots;

MicroEvent = _dereq_('microevent');

PagedPublicationHotspots = (function() {
  function PagedPublicationHotspots() {
    this.currentPageSpreadId = null;
    this.pageSpreadsLoaded = {};
    this.cache = {};
    this.bind('hotspotsReceived', this.hotspotsReceived.bind(this));
    this.bind('afterNavigation', this.afterNavigation.bind(this));
    this.bind('pagesLoaded', this.pagesLoaded.bind(this));
    this.bind('resized', this.resized.bind(this));
    return;
  }

  PagedPublicationHotspots.prototype.renderHotspots = function(data) {
    var contentRect, frag, hotspot, hotspotEl, hotspotEls, i, id, len, pageSpreadEl, position, ref;
    frag = document.createDocumentFragment();
    contentRect = data.versoPageSpread.getContentRect();
    pageSpreadEl = data.pageSpread.getEl();
    hotspotEls = pageSpreadEl.querySelectorAll('.sgn-pp__hotspot');
    ref = data.hotspots;
    for (id in ref) {
      hotspot = ref[id];
      position = this.getPosition(data.pages, data.ratio, hotspot);
      frag.appendChild(this.renderHotspot(hotspot, position, contentRect));
    }
    for (i = 0, len = hotspotEls.length; i < len; i++) {
      hotspotEl = hotspotEls[i];
      hotspotEl.parentNode.removeChild(hotspotEl);
    }
    pageSpreadEl.appendChild(frag);
    return this;
  };

  PagedPublicationHotspots.prototype.renderHotspot = function(hotspot, position, contentRect) {
    var el, height, left, top, width;
    el = document.createElement('div');
    top = Math.round(contentRect.height / 100 * position.top);
    left = Math.round(contentRect.width / 100 * position.left);
    width = Math.round(contentRect.width / 100 * position.width);
    height = Math.round(contentRect.height / 100 * position.height);
    top += Math.round(contentRect.top);
    left += Math.round(contentRect.left);
    el.className = 'sgn-pp__hotspot verso__overlay';
    if (hotspot.id != null) {
      el.setAttribute('data-id', hotspot.id);
    }
    if (hotspot.type != null) {
      el.setAttribute('data-type', hotspot.type);
    }
    el.style.top = top + "px";
    el.style.left = left + "px";
    el.style.width = width + "px";
    el.style.height = height + "px";
    return el;
  };

  PagedPublicationHotspots.prototype.getPosition = function(pages, ratio, hotspot) {
    var height, maxX, maxY, minX, minY, pageNumber, pageNumbers, poly, width;
    minX = null;
    minY = null;
    maxX = null;
    maxY = null;
    pageNumbers = pages.map(function(page) {
      return page.pageNumber;
    });
    for (pageNumber in hotspot.locations) {
      if (pageNumbers.indexOf(+pageNumber) === -1) {
        continue;
      }
      poly = hotspot.locations[pageNumber];
      poly.forEach(function(coords) {
        var x, y;
        x = coords[0];
        y = coords[1];
        if (pages[1] && pageNumbers[1] === +pageNumber) {
          x += 1;
        }
        x /= pages.length;
        if (minX == null) {
          minX = maxX = x;
          minY = maxY = y;
        }
        if (x < minX) {
          minX = x;
        }
        if (x > maxX) {
          maxX = x;
        }
        if (y < minY) {
          minY = y;
        }
        if (y > maxY) {
          return maxY = y;
        }
      });
    }
    width = maxX - minX;
    height = maxY - minY;
    return {
      top: minY / ratio * 100,
      left: minX * 100,
      width: width * 100,
      height: height / ratio * 100
    };
  };

  PagedPublicationHotspots.prototype.requestHotspots = function(pageSpreadId, pages) {
    this.trigger('hotspotsRequested', {
      id: pageSpreadId,
      pages: pages
    });
  };

  PagedPublicationHotspots.prototype.hotspotsReceived = function(e) {
    var pageSpreadId;
    pageSpreadId = e.pageSpread.getId();
    this.setCache(pageSpreadId, e);
    this.renderHotspots(e);
  };

  PagedPublicationHotspots.prototype.getCache = function(pageSpreadId) {
    return this.cache[pageSpreadId];
  };

  PagedPublicationHotspots.prototype.setCache = function(pageSpreadId, data) {
    this.cache[pageSpreadId] = data;
    return this;
  };

  PagedPublicationHotspots.prototype.afterNavigation = function(e) {
    var id;
    if (e.pageSpread != null) {
      id = e.pageSpread.getId();
      this.currentPageSpreadId = id;
      if (this.pageSpreadsLoaded[id]) {
        this.requestHotspots(id, e.pageSpread.getPages());
      }
    }
  };

  PagedPublicationHotspots.prototype.pagesLoaded = function(e) {
    this.pageSpreadsLoaded[e.pageSpreadId] = true;
    if (this.currentPageSpreadId === e.pageSpreadId) {
      this.requestHotspots(e.pageSpreadId, e.pages);
    }
  };

  PagedPublicationHotspots.prototype.resized = function() {
    var data;
    data = this.getCache(this.currentPageSpreadId);
    if (data != null) {
      this.renderHotspots(data);
    }
  };

  return PagedPublicationHotspots;

})();

MicroEvent.mixin(PagedPublicationHotspots);

module.exports = PagedPublicationHotspots;


},{"microevent":35}],20:[function(_dereq_,module,exports){
module.exports = {
  Viewer: _dereq_('./viewer'),
  HotspotPicker: _dereq_('./hotspot_picker')
};


},{"./hotspot_picker":18,"./viewer":24}],21:[function(_dereq_,module,exports){
var MicroEvent, PagedPublicationLegacyEventTracking;

MicroEvent = _dereq_('microevent');

PagedPublicationLegacyEventTracking = (function() {
  function PagedPublicationLegacyEventTracking() {
    this.bind('eventTracked', this.eventTracked.bind(this));
    this.zoomedIn = false;
    this.appearedAt = null;
    return;
  }

  PagedPublicationLegacyEventTracking.prototype.trackEvent = function(e) {
    this.trigger('trackEvent', e);
  };

  PagedPublicationLegacyEventTracking.prototype.eventTracked = function(e) {
    if (e.type === 'paged-publication-page-spread-appeared') {
      this.appearedAt = Date.now();
    }
    if (e.type === 'paged-publication-page-spread-disappeared') {
      this.trigger('trackEvent', {
        type: this.zoomedIn ? 'zoom' : 'view',
        ms: Date.now() - this.appearedAt,
        orientation: this.getOrientation(),
        pages: e.properties.pagedPublicationPageSpread.pageNumbers
      });
    } else if (e.type === 'paged-publication-page-spread-zoomed-in') {
      this.trigger('trackEvent', {
        type: 'view',
        ms: this.getDuration(),
        orientation: this.getOrientation(),
        pages: e.properties.pagedPublicationPageSpread.pageNumbers
      });
      this.zoomedIn = true;
      this.appearedAt = Date.now();
    } else if (e.type === 'paged-publication-page-spread-zoomed-out') {
      this.trigger('trackEvent', {
        type: 'zoom',
        ms: this.getDuration(),
        orientation: this.getOrientation(),
        pages: e.properties.pagedPublicationPageSpread.pageNumbers
      });
      this.zoomedIn = false;
      this.appearedAt = Date.now();
    }
  };

  PagedPublicationLegacyEventTracking.prototype.getOrientation = function() {
    if (window.innerWidth >= window.innerHeight) {
      return 'landscape';
    } else {
      return 'portrait';
    }
  };

  PagedPublicationLegacyEventTracking.prototype.getDuration = function() {
    return Date.now() - this.appearedAt;
  };

  return PagedPublicationLegacyEventTracking;

})();

MicroEvent.mixin(PagedPublicationLegacyEventTracking);

module.exports = PagedPublicationLegacyEventTracking;


},{"microevent":35}],22:[function(_dereq_,module,exports){
var MicroEvent, PagedPublicationPageSpread, SGN;

MicroEvent = _dereq_('microevent');

SGN = _dereq_('../../sgn');

PagedPublicationPageSpread = (function() {
  function PagedPublicationPageSpread(options) {
    this.options = options != null ? options : {};
    this.contentsRendered = false;
    this.hotspotsRendered = false;
    this.el = this.renderEl();
    return;
  }

  PagedPublicationPageSpread.prototype.getId = function() {
    return this.options.id;
  };

  PagedPublicationPageSpread.prototype.getEl = function() {
    return this.el;
  };

  PagedPublicationPageSpread.prototype.getPages = function() {
    return this.options.pages;
  };

  PagedPublicationPageSpread.prototype.renderEl = function() {
    var el, pageIds;
    el = document.createElement('div');
    pageIds = this.getPages().map(function(page) {
      return page.id;
    });
    el.className = 'verso__page-spread sgn-pp__page-spread';
    el.setAttribute('data-id', this.getId());
    el.setAttribute('data-type', 'page');
    el.setAttribute('data-width', this.options.width);
    el.setAttribute('data-page-ids', pageIds.join(','));
    el.setAttribute('data-max-zoom-scale', this.options.maxZoomScale);
    el.setAttribute('data-zoomable', false);
    return el;
  };

  PagedPublicationPageSpread.prototype.renderContents = function() {
    var el, id, imageLoads, pageCount, pages;
    id = this.getId();
    el = this.getEl();
    pages = this.getPages();
    pageCount = pages.length;
    imageLoads = 0;
    pages.forEach((function(_this) {
      return function(page, i) {
        var image, loaderEl, pageEl;
        image = page.images.medium;
        pageEl = document.createElement('div');
        loaderEl = document.createElement('div');
        pageEl.className = 'sgn-pp__page verso__page';
        if (page.id != null) {
          pageEl.dataset.id = page.id;
        }
        if (pageCount === 2) {
          pageEl.className += i === 0 ? ' verso-page--verso' : ' verso-page--recto';
        }
        pageEl.appendChild(loaderEl);
        el.appendChild(pageEl);
        loaderEl.className = 'sgn-pp-page__loader';
        loaderEl.innerHTML = "<span>" + page.label + "</span>";
        SGN.util.loadImage(image, function(err, width, height) {
          if (err == null) {
            pageEl.style.backgroundImage = "url(" + image + ")";
            pageEl.dataset.width = width;
            pageEl.dataset.height = height;
            pageEl.innerHTML = '&nbsp;';
            el.dataset.zoomable = true;
            imageLoads++;
            _this.trigger('pageLoaded', {
              pageSpreadId: id,
              page: page
            });
            if (imageLoads === pageCount) {
              _this.trigger('pagesLoaded', {
                pageSpreadId: id,
                pages: pages
              });
            }
          } else {
            loaderEl.innerHTML = '<span>!</span>';
          }
        });
      };
    })(this));
    this.contentsRendered = true;
    return this;
  };

  PagedPublicationPageSpread.prototype.clearContents = function(pageSpread, versoPageSpread) {
    this.el.innerHTML = '';
    this.contentsRendered = false;
    return this;
  };

  PagedPublicationPageSpread.prototype.zoomIn = function() {
    var pageEls, pages;
    pageEls = [].slice.call(this.el.querySelectorAll('.sgn-pp__page'));
    pages = this.getPages();
    pageEls.forEach((function(_this) {
      return function(pageEl) {
        var id, image, page;
        id = pageEl.dataset.id;
        page = pages.find(function(page) {
          return page.id === id;
        });
        image = page.images.large;
        SGN.util.loadImage(image, function(err) {
          if ((err == null) && _this.el.dataset.active === 'true') {
            pageEl.dataset.image = pageEl.style.backgroundImage;
            pageEl.style.backgroundImage = "url(" + image + ")";
          }
        });
      };
    })(this));
  };

  PagedPublicationPageSpread.prototype.zoomOut = function() {
    var pageEls;
    pageEls = [].slice.call(this.el.querySelectorAll('.sgn-pp__page[data-image]'));
    pageEls.forEach(function(pageEl) {
      pageEl.style.backgroundImage = pageEl.dataset.image;
      delete pageEl.dataset.image;
    });
  };

  return PagedPublicationPageSpread;

})();

MicroEvent.mixin(PagedPublicationPageSpread);

module.exports = PagedPublicationPageSpread;


},{"../../sgn":26,"microevent":35}],23:[function(_dereq_,module,exports){
var MicroEvent, PageSpread, PagedPublicationPageSpreads, SGN;

MicroEvent = _dereq_('microevent');

PageSpread = _dereq_('./page_spread');

SGN = _dereq_('../../sgn');

PagedPublicationPageSpreads = (function() {
  function PagedPublicationPageSpreads(options) {
    this.options = options;
    this.collection = [];
    this.ids = {};
    return;
  }

  PagedPublicationPageSpreads.prototype.get = function(id) {
    return this.ids[id];
  };

  PagedPublicationPageSpreads.prototype.getFrag = function() {
    var frag;
    frag = document.createDocumentFragment();
    this.collection.forEach(function(pageSpread) {
      return frag.appendChild(pageSpread.el);
    });
    return frag;
  };

  PagedPublicationPageSpreads.prototype.update = function(pageMode) {
    var firstPage, ids, lastPage, maxZoomScale, midstPageSpreads, pageSpreads, pages, width;
    if (pageMode == null) {
      pageMode = 'single';
    }
    pageSpreads = [];
    ids = {};
    pages = this.options.pages.slice();
    width = this.options.width;
    maxZoomScale = this.options.maxZoomScale;
    if (pageMode === 'single') {
      pages.forEach(function(page) {
        return pageSpreads.push([page]);
      });
    } else {
      firstPage = pages.shift();
      lastPage = pages.length % 2 === 1 ? pages.pop() : null;
      midstPageSpreads = SGN.util.chunk(pages, 2);
      if (firstPage != null) {
        pageSpreads.push([firstPage]);
      }
      midstPageSpreads.forEach(function(midstPages) {
        return pageSpreads.push(midstPages.map(function(page) {
          return page;
        }));
      });
      if (lastPage != null) {
        pageSpreads.push([lastPage]);
      }
    }
    this.collection = pageSpreads.map((function(_this) {
      return function(pages, i) {
        var id, pageSpread;
        id = i + '';
        pageSpread = new PageSpread({
          width: width,
          maxZoomScale: maxZoomScale,
          pages: pages,
          id: id
        });
        pageSpread.bind('pageLoaded', function(e) {
          return _this.trigger('pageLoaded', e);
        });
        pageSpread.bind('pagesLoaded', function(e) {
          return _this.trigger('pagesLoaded', e);
        });
        ids[id] = pageSpread;
        return pageSpread;
      };
    })(this));
    this.ids = ids;
    return this;
  };

  return PagedPublicationPageSpreads;

})();

MicroEvent.mixin(PagedPublicationPageSpreads);

module.exports = PagedPublicationPageSpreads;


},{"../../sgn":26,"./page_spread":22,"microevent":35}],24:[function(_dereq_,module,exports){
var Controls, Core, EventTracking, Hotspots, LegacyEventTracking, MicroEvent, SGN, Viewer;

MicroEvent = _dereq_('microevent');

SGN = _dereq_('../../core');

Core = _dereq_('./core');

Hotspots = _dereq_('./hotspots');

Controls = _dereq_('./controls');

EventTracking = _dereq_('./event_tracking');

LegacyEventTracking = _dereq_('./legacy_event_tracking');

Viewer = (function() {
  function Viewer(el, options1) {
    this.el = el;
    this.options = options1 != null ? options1 : {};
    this._core = new Core(this.el, {
      id: this.options.id,
      pages: this.options.pages,
      pageSpreadWidth: this.options.pageSpreadWidth,
      pageSpreadMaxZoomScale: this.options.pageSpreadMaxZoomScale,
      idleDelay: this.options.idleDelay,
      resizeDelay: this.options.resizeDelay,
      color: this.options.color
    });
    this._hotspots = new Hotspots();
    this._controls = new Controls(this.el, {
      keyboard: this.options.keyboard
    });
    this._eventTracking = new EventTracking();
    this._legacyEventTracking = new LegacyEventTracking();
    this.viewSession = SGN.util.uuid();
    this._setupEventListeners();
    return;
  }

  Viewer.prototype.start = function() {
    this._core.trigger('started');
    return this;
  };

  Viewer.prototype.destroy = function() {
    this._core.trigger('destroyed');
    this._hotspots.trigger('destroyed');
    this._controls.trigger('destroyed');
    this._eventTracking.trigger('destroyed');
    return this;
  };

  Viewer.prototype.navigateTo = function(position, options) {
    this._core.getVerso().navigateTo(position, options);
    return this;
  };

  Viewer.prototype.first = function(options) {
    this._core.getVerso().first(options);
    return this;
  };

  Viewer.prototype.prev = function(options) {
    this._core.getVerso().prev(options);
    return this;
  };

  Viewer.prototype.next = function(options) {
    this._core.getVerso().next(options);
    return this;
  };

  Viewer.prototype.last = function(options) {
    this._core.getVerso().last(options);
    return this;
  };

  Viewer.prototype._trackEvent = function(e) {
    var eventTracker, idType, key, properties, ref, type, value;
    type = e.type;
    idType = 'legacy';
    properties = {
      pagedPublication: {
        id: [idType, this.options.id],
        ownedBy: [idType, this.options.ownedBy]
      }
    };
    eventTracker = this.options.eventTracker;
    ref = e.properties;
    for (key in ref) {
      value = ref[key];
      properties[key] = value;
    }
    if (eventTracker != null) {
      eventTracker.trackEvent(type, properties);
    }
  };

  Viewer.prototype._trackLegacyEvent = function(e) {
    var eventTracker, geolocation;
    eventTracker = this.options.eventTracker;
    geolocation = {};
    if (eventTracker != null) {
      geolocation.latitude = eventTracker.location.latitude;
      geolocation.longitude = eventTracker.location.longitude;
      if (geolocation.latitude != null) {
        geolocation.sensor = true;
      }
      SGN.CoreKit.request({
        geolocation: geolocation,
        method: 'post',
        url: "/v2/catalogs/" + this.options.id + "/collect",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: e.type,
          ms: e.ms,
          orientation: e.orientation,
          pages: e.pages.join(','),
          view_session: this.viewSession
        })
      });
    }
  };

  Viewer.prototype._setupEventListeners = function() {
    this._eventTracking.bind('trackEvent', (function(_this) {
      return function(e) {
        _this._trackEvent(e);
        _this._legacyEventTracking.trigger('eventTracked', e);
      };
    })(this));
    this._legacyEventTracking.bind('trackEvent', (function(_this) {
      return function(e) {
        _this._trackLegacyEvent(e);
      };
    })(this));
    this._controls.bind('prev', (function(_this) {
      return function(e) {
        _this.prev(e);
      };
    })(this));
    this._controls.bind('next', (function(_this) {
      return function(e) {
        _this.next(e);
      };
    })(this));
    this._controls.bind('first', (function(_this) {
      return function(e) {
        _this.first(e);
      };
    })(this));
    this._controls.bind('last', (function(_this) {
      return function(e) {
        _this.last();
      };
    })(this));
    this._hotspots.bind('hotspotsRequested', (function(_this) {
      return function(e) {
        _this.trigger('hotspotsRequested', e);
      };
    })(this));
    this._core.bind('appeared', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('appeared', e);
        _this.trigger('appeared', e);
      };
    })(this));
    this._core.bind('disappeared', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('disappeared', e);
        _this.trigger('disappeared', e);
      };
    })(this));
    this._core.bind('beforeNavigation', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('beforeNavigation', e);
        _this._controls.trigger('beforeNavigation', e);
        _this.trigger('beforeNavigation', e);
      };
    })(this));
    this._core.bind('afterNavigation', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('afterNavigation', e);
        _this.trigger('afterNavigation', e);
      };
    })(this));
    this._core.bind('attemptedNavigation', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('attemptedNavigation', e);
        _this.trigger('attemptedNavigation', e);
      };
    })(this));
    this._core.bind('clicked', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('clicked', e);
        _this.trigger('clicked', e);
      };
    })(this));
    this._core.bind('doubleClicked', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('doubleClicked', e);
        _this.trigger('doubleClicked', e);
      };
    })(this));
    this._core.bind('pressed', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('pressed', e);
        _this.trigger('pressed', e);
      };
    })(this));
    this._core.bind('panStart', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('panStart', e);
        _this.trigger('panStart', e);
      };
    })(this));
    this._core.bind('zoomedIn', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('zoomedIn', e);
        _this.trigger('zoomedIn', e);
      };
    })(this));
    this._core.bind('zoomedOut', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('zoomedOut', e);
        _this.trigger('zoomedOut', e);
      };
    })(this));
    this._core.bind('pageLoaded', (function(_this) {
      return function(e) {
        _this._eventTracking.trigger('pageLoaded', e);
        _this.trigger('pageLoaded', e);
      };
    })(this));
    this._core.bind('afterNavigation', (function(_this) {
      return function(e) {
        _this._hotspots.trigger('afterNavigation', e);
        _this.trigger('afterNavigation', e);
      };
    })(this));
    this._core.bind('pagesLoaded', (function(_this) {
      return function(e) {
        _this._hotspots.trigger('pagesLoaded', e);
        _this.trigger('pagesLoaded', e);
      };
    })(this));
    this._core.bind('resized', (function(_this) {
      return function(e) {
        _this._hotspots.trigger('resized', e);
        _this.trigger('resized', e);
      };
    })(this));
    this.bind('hotspotsReceived', (function(_this) {
      return function(e) {
        _this._hotspots.trigger('hotspotsReceived', {
          pageSpread: _this._core.pageSpreads.get(e.id),
          versoPageSpread: _this._core.getVerso().pageSpreads.find(function(pageSpread) {
            return pageSpread.getId() === e.id;
          }),
          ratio: e.ratio,
          pages: e.pages,
          hotspots: e.hotspots
        });
      };
    })(this));
  };

  return Viewer;

})();

MicroEvent.mixin(Viewer);

module.exports = Viewer;


},{"../../core":3,"./controls":15,"./core":16,"./event_tracking":17,"./hotspots":19,"./legacy_event_tracking":21,"microevent":35}],25:[function(_dereq_,module,exports){
var SGN;

SGN = _dereq_('../sgn');

module.exports = function(options, callback, progressCallback) {
  var header, http, method, ref, ref1, url, value;
  if (options == null) {
    options = {};
  }
  http = new XMLHttpRequest();
  method = (ref = options.method) != null ? ref : 'get';
  url = options.url;
  if (options.qs != null) {
    url += SGN.util.formatQueryParams(options.qs);
  }
  http.open(method.toUpperCase(), url);
  if (options.timeout != null) {
    http.timeout = options.timeout;
  }
  if (options.useCookies !== false) {
    http.withCredentials = true;
  }
  if (options.headers != null) {
    ref1 = options.headers;
    for (header in ref1) {
      value = ref1[header];
      http.setRequestHeader(header, value);
    }
  }
  http.addEventListener('load', function() {
    var headers;
    headers = http.getAllResponseHeaders().split('\r\n');
    headers = headers.reduce(function(acc, current, i) {
      var parts;
      parts = current.split(': ');
      acc[parts[0].toLowerCase()] = parts[1];
      return acc;
    }, {});
    callback(null, {
      statusCode: http.status,
      headers: headers,
      body: http.responseText
    });
  });
  http.addEventListener('error', function() {
    callback(new Error());
  });
  http.addEventListener('timeout', function() {
    callback(new Error());
  });
  http.addEventListener('progress', function(e) {
    if (e.lengthComputable && typeof progressCallback === 'function') {
      progressCallback(e.loaded, e.total);
    }
  });
  http.send(options.body);
};


},{"../sgn":26}],26:[function(_dereq_,module,exports){
module.exports = _dereq_('./core');


},{"./core":3}],27:[function(_dereq_,module,exports){
var SGN;

SGN = _dereq_('../sgn');

module.exports = {
  key: 'sgn-',
  get: function(key) {
    var c, ca, ct, err, i, len, name, value;
    if (SGN.util.isNode()) {
      return;
    }
    try {
      name = "" + this.key + key + "=";
      ca = document.cookie.split(';');
      for (i = 0, len = ca.length; i < len; i++) {
        c = ca[i];
        ct = c.trim();
        if (ct.indexOf(name) === 0) {
          value = ct.substring(name.length, ct.length);
        }
      }
      value = JSON.parse(value);
    } catch (error) {
      err = error;
      value = {};
    }
    return value;
  },
  set: function(key, value) {
    var date, days, err, str;
    if (SGN.util.isNode()) {
      return;
    }
    try {
      days = 365;
      date = new Date();
      str = JSON.stringify(value);
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = "" + this.key + key + "=" + str + ";expires=" + (date.toUTCString()) + ";path=/";
    } catch (error) {
      err = error;
    }
  }
};


},{"../sgn":26}],28:[function(_dereq_,module,exports){
var SGN;

SGN = _dereq_('../sgn');

module.exports = {
  key: 'sgn-',
  storage: (function() {
    var storage;
    try {
      storage = window.localStorage;
      storage[this.key + "test-storage"] = 'foobar';
      delete storage[this.key + "test-storage"];
      return storage;
    } catch (error) {
      return {};
    }
  })(),
  get: function(key) {
    try {
      return JSON.parse(this.storage["" + this.key + key]);
    } catch (error) {}
  },
  set: function(key, value) {
    try {
      this.storage["" + this.key + key] = JSON.stringify(value);
    } catch (error) {}
    return this;
  }
};


},{"../sgn":26}],29:[function(_dereq_,module,exports){
(function (process,Buffer){
var util;

util = {
  isBrowser: function() {
    return typeof process !== 'undefined' && process.browser;
  },
  isNode: function() {
    return !util.isBrowser();
  },
  error: function(err, options) {
    var key, value;
    err.message = err.message || null;
    if (typeof options === 'string') {
      err.message = options;
    } else if (typeof options === 'object' && (options != null)) {
      for (key in options) {
        value = options[key];
        err[key] = value;
      }
      if (options.message != null) {
        err.message = options.message;
      }
      if ((options.code != null) || (options.message != null)) {
        err.code = options.code || options.name;
      }
      if (options.stack != null) {
        err.stack = options.stack;
      }
    }
    err.name = options && options.name || err.name || err.code || 'Error';
    err.time = new Date();
    return err;
  },
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  },
  getQueryParam: function(field, url) {
    var href, reg, string;
    href = url ? url : window.location.href;
    reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    string = reg.exec(href);
    if (string) {
      return string[1];
    } else {
      return void 0;
    }
  },
  formatQueryParams: function(queryParams) {
    return '?' + Object.keys(queryParams).map(function(key) {
      return key + '=' + encodeURIComponent(queryParams[key]);
    }).join('&');
  },
  getOS: function() {
    var name, ua;
    name = null;
    ua = window.navigator.userAgent;
    if (ua.indexOf('Windows') > -1) {
      name = 'Windows';
    } else if (ua.indexOf('Mac') > -1) {
      name = 'macOS';
    } else if (ua.indexOf('X11') > -1) {
      name = 'unix';
    } else if (ua.indexOf('Linux') > -1) {
      name = 'Linux';
    } else if (ua.indexOf('iOS') > -1) {
      name = 'iOS';
    } else if (ua.indexOf('Android') > -1) {
      name = 'Android';
    }
    return name;
  },
  btoa: function(str) {
    var buffer;
    if (util.isBrowser()) {
      return btoa(str);
    } else {
      buffer = null;
      if (str instanceof Buffer) {
        buffer = str;
      } else {
        buffer = new Buffer(str.toString(), 'binary');
      }
      return buffer.toString('base64');
    }
  },
  getScreenDimensions: function() {
    var density, logical, physical, ref;
    density = (ref = window.devicePixelRatio) != null ? ref : 1;
    logical = {
      width: window.screen.width,
      height: window.screen.height
    };
    physical = {
      width: Math.round(logical.width * density),
      height: Math.round(logical.height * density)
    };
    return {
      density: density,
      logical: logical,
      physical: physical
    };
  },
  getUtcOffsetSeconds: function() {
    var jan1, jan2, now, stdTimeOffset, tmp;
    now = new Date();
    jan1 = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    tmp = jan1.toGMTString();
    jan2 = new Date(tmp.substring(0, tmp.lastIndexOf(' ') - 1));
    stdTimeOffset = (jan1 - jan2) / 1000;
    return stdTimeOffset;
  },
  getUtcDstOffsetSeconds: function() {
    return new Date().getTimezoneOffset() * 60 * -1;
  },
  getColorBrightness: function(color) {
    var hex, rgb, s, sum, x;
    color = color.replace('#', '');
    hex = parseInt((hex + '').replace(/[^a-f0-9]/gi, ''), 16);
    rgb = [];
    sum = 0;
    x = 0;
    while (x < 3) {
      s = parseInt(color.substring(2 * x, 2), 16);
      rgb[x] = s;
      if (s > 0) {
        sum += s;
      }
      ++x;
    }
    if (sum <= 381) {
      return 'dark';
    } else {
      return 'light';
    }
  },
  chunk: function(arr, size) {
    var results;
    results = [];
    while (arr.length) {
      results.push(arr.splice(0, size));
    }
    return results;
  },
  throttle: function(fn, threshold, scope) {
    var deferTimer, last;
    if (threshold == null) {
      threshold = 250;
    }
    last = void 0;
    deferTimer = void 0;
    return function() {
      var args, context, now;
      context = scope || this;
      now = new Date().getTime();
      args = arguments;
      if (last && now < last + threshold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  },
  loadImage: function(src, callback) {
    var img;
    img = new Image();
    img.onload = function() {
      return callback(null, img.width, img.height);
    };
    img.onerror = function() {
      return callback(new Error());
    };
    img.src = src;
    return img;
  },
  distance: function(lat1, lng1, lat2, lng2) {
    var dist, radlat1, radlat2, radtheta, theta;
    radlat1 = Math.PI * lat1 / 180;
    radlat2 = Math.PI * lat2 / 180;
    theta = lng1 - lng2;
    radtheta = Math.PI * theta / 180;
    dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344 * 1000;
    return dist;
  },
  async: {
    parallel: function(asyncCalls, sharedCallback) {
      var allResults, counter, k, makeCallback;
      counter = asyncCalls.length;
      allResults = [];
      k = 0;
      makeCallback = function(index) {
        return function() {
          var i, results;
          results = [];
          i = 0;
          counter--;
          while (i < arguments.length) {
            results.push(arguments[i]);
            i++;
          }
          allResults[index] = results;
          if (counter === 0) {
            sharedCallback(allResults);
          }
        };
      };
      while (k < asyncCalls.length) {
        asyncCalls[k](makeCallback(k));
        k++;
      }
    }
  }
};

module.exports = util;


}).call(this,_dereq_('_process'),_dereq_("buffer").Buffer)

},{"_process":36,"buffer":31}],30:[function(_dereq_,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],31:[function(_dereq_,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = _dereq_('base64-js')
var ieee754 = _dereq_('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (isArrayBufferView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":30,"ieee754":34}],32:[function(_dereq_,module,exports){
!function(globals) {
'use strict'

var convertHex = {
  bytesToHex: function(bytes) {
    /*if (typeof bytes.byteLength != 'undefined') {
      var newBytes = []

      if (typeof bytes.buffer != 'undefined')
        bytes = new DataView(bytes.buffer)
      else
        bytes = new DataView(bytes)

      for (var i = 0; i < bytes.byteLength; ++i) {
        newBytes.push(bytes.getUint8(i))
      }
      bytes = newBytes
    }*/
    return arrBytesToHex(bytes)
  },
  hexToBytes: function(hex) {
    if (hex.length % 2 === 1) throw new Error("hexToBytes can't have a string with an odd number of characters.")
    if (hex.indexOf('0x') === 0) hex = hex.slice(2)
    return hex.match(/../g).map(function(x) { return parseInt(x,16) })
  }
}


// PRIVATE

function arrBytesToHex(bytes) {
  return bytes.map(function(x) { return padLeft(x.toString(16),2) }).join('')
}

function padLeft(orig, len) {
  if (orig.length > len) return orig
  return Array(len - orig.length + 1).join('0') + orig
}


if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = convertHex
} else {
  globals.convertHex = convertHex
}

}(this);
},{}],33:[function(_dereq_,module,exports){
!function(globals) {
'use strict'

var convertString = {
  bytesToString: function(bytes) {
    return bytes.map(function(x){ return String.fromCharCode(x) }).join('')
  },
  stringToBytes: function(str) {
    return str.split('').map(function(x) { return x.charCodeAt(0) })
  }
}

//http://hossa.in/2012/07/20/utf-8-in-javascript.html
convertString.UTF8 = {
   bytesToString: function(bytes) {
    return decodeURIComponent(escape(convertString.bytesToString(bytes)))
  },
  stringToBytes: function(str) {
   return convertString.stringToBytes(unescape(encodeURIComponent(str)))
  }
}

if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = convertString
} else {
  globals.convertString = convertString
}

}(this);
},{}],34:[function(_dereq_,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],35:[function(_dereq_,module,exports){
/**
 * MicroEvent - to make any js object an event emitter (server or browser)
 * 
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/

var MicroEvent	= function(){}
MicroEvent.prototype	= {
	bind	: function(event, fct){
		this._events = this._events || {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
	},
	unbind	: function(event, fct){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	},
	trigger	: function(event /* , args... */){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		for(var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
		}
	}
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/
MicroEvent.mixin	= function(destObject){
	var props	= ['bind', 'unbind', 'trigger'];
	for(var i = 0; i < props.length; i ++){
		destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
	}
}

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= MicroEvent
}

},{}],36:[function(_dereq_,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],37:[function(_dereq_,module,exports){
!function(globals) {
'use strict'

var _imports = {}

if (typeof module !== 'undefined' && module.exports) { //CommonJS
  _imports.bytesToHex = _dereq_('convert-hex').bytesToHex
  _imports.convertString = _dereq_('convert-string')
  module.exports = sha256
} else {
  _imports.bytesToHex = globals.convertHex.bytesToHex
  _imports.convertString = globals.convertString
  globals.sha256 = sha256
}

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

// Initialization round constants tables
var K = []

// Compute constants
!function () {
  function isPrime(n) {
    var sqrtN = Math.sqrt(n);
    for (var factor = 2; factor <= sqrtN; factor++) {
      if (!(n % factor)) return false
    }

    return true
  }

  function getFractionalBits(n) {
    return ((n - (n | 0)) * 0x100000000) | 0
  }

  var n = 2
  var nPrime = 0
  while (nPrime < 64) {
    if (isPrime(n)) {
      K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3))
      nPrime++
    }

    n++
  }
}()

var bytesToWords = function (bytes) {
  var words = []
  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
    words[b >>> 5] |= bytes[i] << (24 - b % 32)
  }
  return words
}

var wordsToBytes = function (words) {
  var bytes = []
  for (var b = 0; b < words.length * 32; b += 8) {
    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF)
  }
  return bytes
}

// Reusable object
var W = []

var processBlock = function (H, M, offset) {
  // Working variables
  var a = H[0], b = H[1], c = H[2], d = H[3]
  var e = H[4], f = H[5], g = H[6], h = H[7]

    // Computation
  for (var i = 0; i < 64; i++) {
    if (i < 16) {
      W[i] = M[offset + i] | 0
    } else {
      var gamma0x = W[i - 15]
      var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                    ((gamma0x << 14) | (gamma0x >>> 18)) ^
                    (gamma0x >>> 3)

      var gamma1x = W[i - 2];
      var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                    ((gamma1x << 13) | (gamma1x >>> 19)) ^
                    (gamma1x >>> 10)

      W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
    }

    var ch  = (e & f) ^ (~e & g);
    var maj = (a & b) ^ (a & c) ^ (b & c);

    var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
    var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

    var t1 = h + sigma1 + ch + K[i] + W[i];
    var t2 = sigma0 + maj;

    h = g;
    g = f;
    f = e;
    e = (d + t1) | 0;
    d = c;
    c = b;
    b = a;
    a = (t1 + t2) | 0;
  }

  // Intermediate hash value
  H[0] = (H[0] + a) | 0;
  H[1] = (H[1] + b) | 0;
  H[2] = (H[2] + c) | 0;
  H[3] = (H[3] + d) | 0;
  H[4] = (H[4] + e) | 0;
  H[5] = (H[5] + f) | 0;
  H[6] = (H[6] + g) | 0;
  H[7] = (H[7] + h) | 0;
}

function sha256(message, options) {;
  if (message.constructor === String) {
    message = _imports.convertString.UTF8.stringToBytes(message);
  }

  var H =[ 0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
           0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19 ];

  var m = bytesToWords(message);
  var l = message.length * 8;

  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;

  for (var i=0 ; i<m.length; i += 16) {
    processBlock(H, m, i);
  }

  var digestbytes = wordsToBytes(H);
  return options && options.asBytes ? digestbytes :
         options && options.asString ? _imports.convertString.bytesToString(digestbytes) :
         _imports.bytesToHex(digestbytes)
}

sha256.x2 = function(message, options) {
  return sha256(sha256(message, { asBytes:true }), options)
}

}(this);

},{"convert-hex":32,"convert-string":33}],38:[function(_dereq_,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Verso = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Animation;

module.exports = Animation = (function() {
  function Animation(el) {
    this.el = el;
    this.run = 0;
    return;
  }

  Animation.prototype.animate = function(options, callback) {
    var duration, easing, ref, ref1, ref2, ref3, ref4, run, scale, transform, transitionEnd, x, y;
    if (options == null) {
      options = {};
    }
    if (callback == null) {
      callback = function() {};
    }
    x = (ref = options.x) != null ? ref : 0;
    y = (ref1 = options.y) != null ? ref1 : 0;
    scale = (ref2 = options.scale) != null ? ref2 : 1;
    easing = (ref3 = options.easing) != null ? ref3 : 'ease-out';
    duration = (ref4 = options.duration) != null ? ref4 : 0;
    run = ++this.run;
    transform = "translate3d(" + x + ", " + y + ", 0px) scale3d(" + scale + ", " + scale + ", 1)";
    if (this.el.style.transform === transform) {
      callback();
    } else if (duration > 0) {
      transitionEnd = (function(_this) {
        return function() {
          if (run !== _this.run) {
            return;
          }
          _this.el.removeEventListener('transitionend', transitionEnd);
          _this.el.style.transition = 'none';
          callback();
        };
      })(this);
      this.el.addEventListener('transitionend', transitionEnd, false);
      this.el.style.transition = "transform " + easing + " " + duration + "ms";
      this.el.style.transform = transform;
    } else {
      this.el.style.transition = 'none';
      this.el.style.transform = transform;
      callback();
    }
    return this;
  };

  return Animation;

})();


},{}],2:[function(_dereq_,module,exports){
var PageSpread;

module.exports = PageSpread = (function() {
  function PageSpread(el, options) {
    this.el = el;
    this.options = options != null ? options : {};
    this.visibility = 'gone';
    this.positioned = false;
    this.active = false;
    this.id = this.options.id;
    this.type = this.options.type;
    this.pageIds = this.options.pageIds;
    this.width = this.options.width;
    this.left = this.options.left;
    this.maxZoomScale = this.options.maxZoomScale;
    return;
  }

  PageSpread.prototype.isZoomable = function() {
    return this.getMaxZoomScale() > 1 && this.getEl().dataset.zoomable !== 'false';
  };

  PageSpread.prototype.getEl = function() {
    return this.el;
  };

  PageSpread.prototype.getOverlayEls = function() {
    return this.getEl().querySelectorAll('.verso__overlay');
  };

  PageSpread.prototype.getPageEls = function() {
    return this.getEl().querySelectorAll('.verso__page');
  };

  PageSpread.prototype.getRect = function() {
    return this.getEl().getBoundingClientRect();
  };

  PageSpread.prototype.getContentRect = function() {
    var i, len, pageEl, pageRect, rect, ref, ref1, ref2, ref3, ref4;
    rect = {
      top: null,
      left: null,
      right: null,
      bottom: null,
      width: null,
      height: null
    };
    ref = this.getPageEls();
    for (i = 0, len = ref.length; i < len; i++) {
      pageEl = ref[i];
      pageRect = pageEl.getBoundingClientRect();
      if (pageRect.top < rect.top || (rect.top == null)) {
        rect.top = pageRect.top;
      }
      if (pageRect.left < rect.left || (rect.left == null)) {
        rect.left = pageRect.left;
      }
      if (pageRect.right > rect.right || (rect.right == null)) {
        rect.right = pageRect.right;
      }
      if (pageRect.bottom > rect.bottom || (rect.bottom == null)) {
        rect.bottom = pageRect.bottom;
      }
    }
    rect.top = (ref1 = rect.top) != null ? ref1 : 0;
    rect.left = (ref2 = rect.left) != null ? ref2 : 0;
    rect.right = (ref3 = rect.right) != null ? ref3 : 0;
    rect.bottom = (ref4 = rect.bottom) != null ? ref4 : 0;
    rect.width = rect.right - rect.left;
    rect.height = rect.bottom - rect.top;
    return rect;
  };

  PageSpread.prototype.getId = function() {
    return this.id;
  };

  PageSpread.prototype.getType = function() {
    return this.type;
  };

  PageSpread.prototype.getPageIds = function() {
    return this.pageIds;
  };

  PageSpread.prototype.getWidth = function() {
    return this.width;
  };

  PageSpread.prototype.getLeft = function() {
    return this.left;
  };

  PageSpread.prototype.getMaxZoomScale = function() {
    return this.maxZoomScale;
  };

  PageSpread.prototype.getVisibility = function() {
    return this.visibility;
  };

  PageSpread.prototype.setVisibility = function(visibility) {
    if (this.visibility !== visibility) {
      this.getEl().style.display = visibility === 'visible' ? 'block' : 'none';
      this.visibility = visibility;
    }
    return this;
  };

  PageSpread.prototype.position = function() {
    if (this.positioned === false) {
      this.getEl().style.left = (this.getLeft()) + "%";
      this.positioned = true;
    }
    return this;
  };

  PageSpread.prototype.activate = function() {
    this.active = true;
    this.getEl().dataset.active = true;
  };

  PageSpread.prototype.deactivate = function() {
    this.active = false;
    this.getEl().dataset.active = false;
  };

  return PageSpread;

})();


},{}],3:[function(_dereq_,module,exports){
var Animation, Hammer, MicroEvent, PageSpread, Verso;

Hammer = _dereq_('hammerjs');

MicroEvent = _dereq_('microevent');

PageSpread = _dereq_('./page_spread');

Animation = _dereq_('./animation');

Verso = (function() {
  function Verso(el1, options1) {
    var ref, ref1, ref2, ref3, ref4;
    this.el = el1;
    this.options = options1 != null ? options1 : {};
    this.swipeVelocity = (ref = this.options.swipeVelocity) != null ? ref : 0.3;
    this.swipeThreshold = (ref1 = this.options.swipeThreshold) != null ? ref1 : 10;
    this.navigationDuration = (ref2 = this.options.navigationDuration) != null ? ref2 : 240;
    this.navigationPanDuration = (ref3 = this.options.navigationPanDuration) != null ? ref3 : 200;
    this.zoomDuration = (ref4 = this.options.zoomDuration) != null ? ref4 : 200;
    this.position = -1;
    this.pinching = false;
    this.panning = false;
    this.transform = {
      left: 0,
      top: 0,
      scale: 1
    };
    this.startTransform = {
      left: 0,
      top: 0,
      scale: 1
    };
    this.tap = {
      count: 0,
      delay: 250,
      timeout: null
    };
    this.scrollerEl = this.el.querySelector('.verso__scroller');
    this.pageSpreadEls = this.el.querySelectorAll('.verso__page-spread');
    this.pageSpreads = this.traversePageSpreads(this.pageSpreadEls);
    this.pageIds = this.buildPageIds(this.pageSpreads);
    this.animation = new Animation(this.scrollerEl);
    this.hammer = new Hammer.Manager(this.scrollerEl, {
      touchAction: 'auto',
      enable: false,
      inputClass: 'ontouchstart' in window ? Hammer.TouchInput : null
    });
    this.hammer.add(new Hammer.Pan({
      direction: Hammer.DIRECTION_ALL
    }));
    this.hammer.add(new Hammer.Tap({
      event: 'singletap',
      interval: 0
    }));
    this.hammer.add(new Hammer.Pinch());
    this.hammer.add(new Hammer.Press({
      time: 500
    }));
    this.hammer.on('panstart', this.panStart.bind(this));
    this.hammer.on('panmove', this.panMove.bind(this));
    this.hammer.on('panend', this.panEnd.bind(this));
    this.hammer.on('pancancel', this.panEnd.bind(this));
    this.hammer.on('singletap', this.singletap.bind(this));
    this.hammer.on('pinchstart', this.pinchStart.bind(this));
    this.hammer.on('pinchmove', this.pinchMove.bind(this));
    this.hammer.on('pinchend', this.pinchEnd.bind(this));
    this.hammer.on('pinchcancel', this.pinchEnd.bind(this));
    this.hammer.on('press', this.press.bind(this));
    return;
  }

  Verso.prototype.start = function() {
    var pageId, ref;
    pageId = (ref = this.getPageSpreadPositionFromPageId(this.options.pageId)) != null ? ref : 0;
    this.hammer.set({
      enable: true
    });
    this.navigateTo(pageId, {
      duration: 0
    });
    this.resizeListener = this.resize.bind(this);
    window.addEventListener('resize', this.resizeListener, false);
  };

  Verso.prototype.destroy = function() {
    this.hammer.destroy();
    window.removeEventListener('resize', this.resizeListener);
    return this;
  };

  Verso.prototype.first = function(options) {
    return this.navigateTo(0, options);
  };

  Verso.prototype.prev = function(options) {
    return this.navigateTo(this.getPosition() - 1, options);
  };

  Verso.prototype.next = function(options) {
    return this.navigateTo(this.getPosition() + 1, options);
  };

  Verso.prototype.last = function(options) {
    return this.navigateTo(this.getPageSpreadCount() - 1, options);
  };

  Verso.prototype.navigateTo = function(position, options) {
    var activePageSpread, carousel, currentPageSpread, currentPosition, duration, ref, ref1, velocity;
    if (options == null) {
      options = {};
    }
    if (position < 0 || position > this.getPageSpreadCount() - 1) {
      return;
    }
    currentPosition = this.getPosition();
    currentPageSpread = this.getPageSpreadFromPosition(currentPosition);
    activePageSpread = this.getPageSpreadFromPosition(position);
    carousel = this.getCarouselFromPageSpread(activePageSpread);
    velocity = (ref = options.velocity) != null ? ref : 1;
    duration = (ref1 = options.duration) != null ? ref1 : this.navigationDuration;
    duration = duration / Math.abs(velocity);
    if (currentPageSpread != null) {
      currentPageSpread.deactivate();
    }
    activePageSpread.activate();
    carousel.visible.forEach(function(pageSpread) {
      return pageSpread.position().setVisibility('visible');
    });
    this.transform.left = this.getLeftTransformFromPageSpread(position, activePageSpread);
    this.setPosition(position);
    if (this.transform.scale > 1) {
      this.transform.top = 0;
      this.transform.scale = 1;
      this.trigger('zoomedOut', {
        position: currentPosition
      });
    }
    this.trigger('beforeNavigation', {
      currentPosition: currentPosition,
      newPosition: position
    });
    this.animation.animate({
      x: this.transform.left + "%",
      duration: duration
    }, (function(_this) {
      return function() {
        carousel = _this.getCarouselFromPageSpread(_this.getActivePageSpread());
        carousel.gone.forEach(function(pageSpread) {
          return pageSpread.setVisibility('gone');
        });
        _this.trigger('afterNavigation', {
          newPosition: _this.getPosition(),
          previousPosition: currentPosition
        });
      };
    })(this));
  };

  Verso.prototype.getPosition = function() {
    return this.position;
  };

  Verso.prototype.setPosition = function(position) {
    this.position = position;
    return this;
  };

  Verso.prototype.getLeftTransformFromPageSpread = function(position, pageSpread) {
    var left;
    left = 0;
    if (position === this.getPageSpreadCount() - 1) {
      left = (100 - pageSpread.getWidth()) - pageSpread.getLeft();
    } else if (position > 0) {
      left = (100 - pageSpread.getWidth()) / 2 - pageSpread.getLeft();
    }
    return left;
  };

  Verso.prototype.getCarouselFromPageSpread = function(pageSpreadSubject) {
    var carousel;
    carousel = {
      visible: [],
      gone: []
    };
    this.pageSpreads.forEach(function(pageSpread) {
      var visible;
      visible = false;
      if (pageSpread.getLeft() <= pageSpreadSubject.getLeft()) {
        if (pageSpread.getLeft() + pageSpread.getWidth() > pageSpreadSubject.getLeft() - 100) {
          visible = true;
        }
      } else {
        if (pageSpread.getLeft() - pageSpread.getWidth() < pageSpreadSubject.getLeft() + 100) {
          visible = true;
        }
      }
      if (visible === true) {
        carousel.visible.push(pageSpread);
      } else {
        carousel.gone.push(pageSpread);
      }
    });
    return carousel;
  };

  Verso.prototype.traversePageSpreads = function(els) {
    var el, id, j, left, len, maxZoomScale, pageIds, pageSpread, pageSpreads, type, width;
    pageSpreads = [];
    left = 0;
    for (j = 0, len = els.length; j < len; j++) {
      el = els[j];
      id = el.getAttribute('data-id');
      type = el.getAttribute('data-type');
      pageIds = el.getAttribute('data-page-ids');
      pageIds = pageIds != null ? pageIds.split(',').map(function(i) {
        return i;
      }) : [];
      maxZoomScale = el.getAttribute('data-max-zoom-scale');
      maxZoomScale = maxZoomScale != null ? +maxZoomScale : 1;
      width = el.getAttribute('data-width');
      width = width != null ? +width : 100;
      pageSpread = new PageSpread(el, {
        id: id,
        type: type,
        pageIds: pageIds,
        maxZoomScale: maxZoomScale,
        width: width,
        left: left
      });
      left += width;
      pageSpreads.push(pageSpread);
    }
    return pageSpreads;
  };

  Verso.prototype.buildPageIds = function(pageSpreads) {
    var pageIds;
    pageIds = {};
    pageSpreads.forEach(function(pageSpread, i) {
      pageSpread.options.pageIds.forEach(function(pageId) {
        pageIds[pageId] = pageSpread;
      });
    });
    return pageIds;
  };

  Verso.prototype.isCoordinateInsideElement = function(x, y, el) {
    var rect;
    rect = el.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  Verso.prototype.getCoordinateInfo = function(x, y, pageSpread) {
    var contentRect, info, j, k, len, len1, overlayEl, overlayEls, pageEl, pageEls;
    info = {
      x: x,
      y: y,
      contentX: 0,
      contentY: 0,
      pageX: 0,
      pageY: 0,
      overlayEls: [],
      pageEl: null,
      isInsideContentX: false,
      isInsideContentY: false,
      isInsideContent: false
    };
    contentRect = pageSpread.getContentRect();
    overlayEls = pageSpread.getOverlayEls();
    pageEls = pageSpread.getPageEls();
    for (j = 0, len = overlayEls.length; j < len; j++) {
      overlayEl = overlayEls[j];
      if (this.isCoordinateInsideElement(x, y, overlayEl)) {
        info.overlayEls.push(overlayEl);
      }
    }
    for (k = 0, len1 = pageEls.length; k < len1; k++) {
      pageEl = pageEls[k];
      if (this.isCoordinateInsideElement(x, y, pageEl)) {
        info.pageEl = pageEl;
        break;
      }
    }
    info.contentX = (x - contentRect.left) / contentRect.width;
    info.contentY = (y - contentRect.top) / contentRect.height;
    if (info.pageEl != null) {
      info.isInsideContentX = info.contentX >= 0 && info.contentX <= 1;
      info.isInsideContentY = info.contentY >= 0 && info.contentY <= 1;
      info.isInsideContent = info.isInsideContentX && info.isInsideContentY;
    }
    return info;
  };

  Verso.prototype.getPageSpreadCount = function() {
    return this.pageSpreads.length;
  };

  Verso.prototype.getActivePageSpread = function() {
    return this.getPageSpreadFromPosition(this.getPosition());
  };

  Verso.prototype.getPageSpreadFromPosition = function(position) {
    return this.pageSpreads[position];
  };

  Verso.prototype.getPageSpreadPositionFromPageId = function(pageId) {
    var idx, j, len, pageSpread, ref;
    ref = this.pageSpreads;
    for (idx = j = 0, len = ref.length; j < len; idx = ++j) {
      pageSpread = ref[idx];
      if (pageSpread.options.pageIds.indexOf(pageId) > -1) {
        return idx;
      }
    }
  };

  Verso.prototype.getPageSpreadBounds = function(pageSpread) {
    var pageSpreadContentRect, pageSpreadRect;
    pageSpreadRect = pageSpread.getRect();
    pageSpreadContentRect = pageSpread.getContentRect();
    return {
      left: (pageSpreadContentRect.left - pageSpreadRect.left) / pageSpreadRect.width * 100,
      top: (pageSpreadContentRect.top - pageSpreadRect.top) / pageSpreadRect.height * 100,
      width: pageSpreadContentRect.width / pageSpreadRect.width * 100,
      height: pageSpreadContentRect.height / pageSpreadRect.height * 100,
      pageSpreadRect: pageSpreadRect,
      pageSpreadContentRect: pageSpreadContentRect
    };
  };

  Verso.prototype.clipCoordinate = function(coordinate, scale, size, offset) {
    if (size * scale < 100) {
      coordinate = offset * -scale + 50 - (size * scale / 2);
    } else {
      coordinate = Math.min(coordinate, offset * -scale);
      coordinate = Math.max(coordinate, offset * -scale - size * scale + 100);
    }
    return coordinate;
  };

  Verso.prototype.zoomTo = function(options, callback) {
    var activePageSpread, carouselOffset, carouselScaledOffset, pageSpreadBounds, ref, ref1, scale, x, y;
    if (options == null) {
      options = {};
    }
    scale = options.scale;
    activePageSpread = this.getActivePageSpread();
    pageSpreadBounds = this.getPageSpreadBounds(activePageSpread);
    carouselOffset = activePageSpread.getLeft();
    carouselScaledOffset = carouselOffset * this.transform.scale;
    x = (ref = options.x) != null ? ref : 0;
    y = (ref1 = options.y) != null ? ref1 : 0;
    if (scale !== 1) {
      x -= pageSpreadBounds.pageSpreadRect.left;
      y -= pageSpreadBounds.pageSpreadRect.top;
      x = x / (pageSpreadBounds.pageSpreadRect.width / this.transform.scale) * 100;
      y = y / (pageSpreadBounds.pageSpreadRect.height / this.transform.scale) * 100;
      x = this.transform.left + carouselScaledOffset + x - (x * scale / this.transform.scale);
      y = this.transform.top + y - (y * scale / this.transform.scale);
      if (options.bounds !== false && scale > 1) {
        x = this.clipCoordinate(x, scale, pageSpreadBounds.width, pageSpreadBounds.left);
        y = this.clipCoordinate(y, scale, pageSpreadBounds.height, pageSpreadBounds.top);
      }
    } else {
      x = 0;
      y = 0;
    }
    x -= carouselOffset * scale;
    this.transform.left = x;
    this.transform.top = y;
    this.transform.scale = scale;
    this.animation.animate({
      x: x + "%",
      y: y + "%",
      scale: scale,
      easing: options.easing,
      duration: options.duration
    }, callback);
  };

  Verso.prototype.refresh = function() {
    this.pageSpreadEls = this.el.querySelectorAll('.verso__page-spread');
    this.pageSpreads = this.traversePageSpreads(this.pageSpreadEls);
    this.pageIds = this.buildPageIds(this.pageSpreads);
    return this;
  };

  Verso.prototype.panStart = function(e) {
    var edgeThreshold, width, x;
    x = e.center.x;
    edgeThreshold = 30;
    width = this.scrollerEl.offsetWidth;
    if (x > edgeThreshold && x < width - edgeThreshold) {
      this.startTransform.left = this.transform.left;
      this.startTransform.top = this.transform.top;
      this.panning = true;
      this.trigger('panStart');
    }
  };

  Verso.prototype.panMove = function(e) {
    var activePageSpread, carouselOffset, carouselScaledOffset, pageSpreadBounds, scale, x, y;
    if (this.pinching === true || this.panning === false) {
      return;
    }
    if (this.transform.scale > 1) {
      activePageSpread = this.getActivePageSpread();
      carouselOffset = activePageSpread.getLeft();
      carouselScaledOffset = carouselOffset * this.transform.scale;
      pageSpreadBounds = this.getPageSpreadBounds(activePageSpread);
      scale = this.transform.scale;
      x = this.startTransform.left + carouselScaledOffset + e.deltaX / this.scrollerEl.offsetWidth * 100;
      y = this.startTransform.top + e.deltaY / this.scrollerEl.offsetHeight * 100;
      x = this.clipCoordinate(x, scale, pageSpreadBounds.width, pageSpreadBounds.left);
      y = this.clipCoordinate(y, scale, pageSpreadBounds.height, pageSpreadBounds.top);
      x -= carouselScaledOffset;
      this.transform.left = x;
      this.transform.top = y;
      this.animation.animate({
        x: x + "%",
        y: y + "%",
        scale: scale,
        easing: 'linear'
      });
    } else {
      x = this.transform.left + e.deltaX / this.scrollerEl.offsetWidth * 100;
      this.animation.animate({
        x: x + "%",
        easing: 'linear'
      });
    }
  };

  Verso.prototype.panEnd = function(e) {
    var position, velocity;
    if (this.panning === false) {
      return;
    }
    this.panning = false;
    this.trigger('panEnd');
    if (this.transform.scale === 1 && this.pinching === false) {
      position = this.getPosition();
      velocity = e.overallVelocityX;
      if (Math.abs(velocity) >= this.swipeVelocity) {
        if (Math.abs(e.deltaX) >= this.swipeThreshold) {
          if (e.offsetDirection === Hammer.DIRECTION_LEFT) {
            this.next({
              velocity: velocity,
              duration: this.navigationPanDuration
            });
          } else if (e.offsetDirection === Hammer.DIRECTION_RIGHT) {
            this.prev({
              velocity: velocity,
              duration: this.navigationPanDuration
            });
          }
        }
      }
      if (position === this.getPosition()) {
        this.animation.animate({
          x: this.transform.left + "%",
          duration: this.navigationPanDuration
        });
        this.trigger('attemptedNavigation', {
          position: this.getPosition()
        });
      }
    }
  };

  Verso.prototype.pinchStart = function(e) {
    if (!this.getActivePageSpread().isZoomable()) {
      return;
    }
    this.pinching = true;
    this.el.dataset.pinching = true;
    this.startTransform.scale = this.transform.scale;
  };

  Verso.prototype.pinchMove = function(e) {
    if (this.pinching === false) {
      return;
    }
    this.zoomTo({
      x: e.center.x,
      y: e.center.y,
      scale: this.startTransform.scale * e.scale,
      bounds: false,
      easing: 'linear'
    });
  };

  Verso.prototype.pinchEnd = function(e) {
    var activePageSpread, maxZoomScale, position, scale;
    if (this.pinching === false) {
      return;
    }
    activePageSpread = this.getActivePageSpread();
    maxZoomScale = activePageSpread.getMaxZoomScale();
    scale = Math.max(1, Math.min(this.transform.scale, maxZoomScale));
    position = this.getPosition();
    if (this.startTransform.scale === 1 && scale > 1) {
      this.trigger('zoomedIn', {
        position: position
      });
    } else if (this.startTransform.scale > 1 && scale === 1) {
      this.trigger('zoomedOut', {
        position: position
      });
    }
    this.zoomTo({
      x: e.center.x,
      y: e.center.y,
      scale: scale,
      duration: this.zoomDuration
    }, (function(_this) {
      return function() {
        _this.pinching = false;
        _this.el.dataset.pinching = false;
      };
    })(this));
  };

  Verso.prototype.press = function(e) {
    this.trigger('pressed', this.getCoordinateInfo(e.center.x, e.center.y, this.getActivePageSpread()));
  };

  Verso.prototype.singletap = function(e) {
    var activePageSpread, coordinateInfo, isDoubleTap, maxZoomScale, position, scale, zoomEvent, zoomedIn;
    activePageSpread = this.getActivePageSpread();
    coordinateInfo = this.getCoordinateInfo(e.center.x, e.center.y, activePageSpread);
    isDoubleTap = this.tap.count === 1;
    clearTimeout(this.tap.timeout);
    if (isDoubleTap) {
      this.tap.count = 0;
      this.trigger('doubleClicked', coordinateInfo);
      if (activePageSpread.isZoomable()) {
        maxZoomScale = activePageSpread.getMaxZoomScale();
        zoomedIn = this.transform.scale > 1;
        scale = zoomedIn ? 1 : maxZoomScale;
        zoomEvent = zoomedIn ? 'zoomedOut' : 'zoomedIn';
        position = this.getPosition();
        this.zoomTo({
          x: e.center.x,
          y: e.center.y,
          scale: scale,
          duration: this.zoomDuration
        }, (function(_this) {
          return function() {
            _this.trigger(zoomEvent, {
              position: position
            });
          };
        })(this));
      }
    } else {
      this.tap.count++;
      this.tap.timeout = setTimeout((function(_this) {
        return function() {
          _this.tap.count = 0;
          _this.trigger('clicked', coordinateInfo);
        };
      })(this), this.tap.delay);
    }
  };

  Verso.prototype.resize = function() {
    var activePageSpread, position;
    if (this.transform.scale > 1) {
      position = this.getPosition();
      activePageSpread = this.getActivePageSpread();
      this.transform.left = this.getLeftTransformFromPageSpread(position, activePageSpread);
      this.transform.top = 0;
      this.transform.scale = 1;
      this.zoomTo({
        x: this.transform.left,
        y: this.transform.top,
        scale: this.transform.scale,
        duration: 0
      });
      this.trigger('zoomedOut', {
        position: position
      });
    }
  };

  return Verso;

})();

MicroEvent.mixin(Verso);

module.exports = Verso;


},{"./animation":1,"./page_spread":2,"hammerjs":4,"microevent":5}],4:[function(_dereq_,module,exports){
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (typeof define === 'function' && define.amd) {
    define(function() {
        return Hammer;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');

},{}],5:[function(_dereq_,module,exports){
/**
 * MicroEvent - to make any js object an event emitter (server or browser)
 * 
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/

var MicroEvent	= function(){}
MicroEvent.prototype	= {
	bind	: function(event, fct){
		this._events = this._events || {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
	},
	unbind	: function(event, fct){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	},
	trigger	: function(event /* , args... */){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		for(var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
		}
	}
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/
MicroEvent.mixin	= function(destObject){
	var props	= ['bind', 'unbind', 'trigger'];
	for(var i = 0; i < props.length; i ++){
		destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
	}
}

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= MicroEvent
}

},{}]},{},[3])(3)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvY29mZmVlc2NyaXB0L2Jyb3dzZXIuY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC9jb25maWcuY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC9jb3JlLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQva2V5X2NvZGVzLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQva2l0cy9hc3NldHMvZmlsZV91cGxvYWQuY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC9raXRzL2Fzc2V0cy9pbmRleC5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L2tpdHMvYXV0aC9pbmRleC5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L2tpdHMvY29yZS9pbmRleC5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L2tpdHMvY29yZS9yZXF1ZXN0LmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQva2l0cy9jb3JlL3Nlc3Npb24uY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC9raXRzL2V2ZW50cy9pbmRleC5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L2tpdHMvZXZlbnRzL3RyYWNrZXIuY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC9raXRzL2dyYXBoL2luZGV4LmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQva2l0cy9ncmFwaC9yZXF1ZXN0LmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQva2l0cy9wYWdlZF9wdWJsaWNhdGlvbi9jb250cm9scy5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L2tpdHMvcGFnZWRfcHVibGljYXRpb24vY29yZS5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L2tpdHMvcGFnZWRfcHVibGljYXRpb24vZXZlbnRfdHJhY2tpbmcuY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC9raXRzL3BhZ2VkX3B1YmxpY2F0aW9uL2hvdHNwb3RfcGlja2VyLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQva2l0cy9wYWdlZF9wdWJsaWNhdGlvbi9ob3RzcG90cy5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L2tpdHMvcGFnZWRfcHVibGljYXRpb24vaW5kZXguY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC9raXRzL3BhZ2VkX3B1YmxpY2F0aW9uL2xlZ2FjeV9ldmVudF90cmFja2luZy5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L2tpdHMvcGFnZWRfcHVibGljYXRpb24vcGFnZV9zcHJlYWQuY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC9raXRzL3BhZ2VkX3B1YmxpY2F0aW9uL3BhZ2Vfc3ByZWFkcy5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L2tpdHMvcGFnZWRfcHVibGljYXRpb24vdmlld2VyLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQvcmVxdWVzdC9icm93c2VyLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQvc2duLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQvc3RvcmFnZS9jbGllbnRfY29va2llLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQvc3RvcmFnZS9jbGllbnRfbG9jYWwuY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC91dGlsLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9iYXNlNjQtanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvbnZlcnQtaGV4L2NvbnZlcnQtaGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvbnZlcnQtc3RyaW5nL2NvbnZlcnQtc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWljcm9ldmVudC9taWNyb2V2ZW50LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9zaGEyNTYvbGliL3NoYTI1Ni5qcyIsIm5vZGVfbW9kdWxlcy92ZXJzby9ub2RlX21vZHVsZXMvdmVyc28vbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy92ZXJzby9ub2RlX21vZHVsZXMvdmVyc28vbGliL2NvZmZlZXNjcmlwdC9hbmltYXRpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL3ZlcnNvL25vZGVfbW9kdWxlcy92ZXJzby9saWIvY29mZmVlc2NyaXB0L3BhZ2Vfc3ByZWFkLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy92ZXJzby9ub2RlX21vZHVsZXMvdmVyc28vbGliL2NvZmZlZXNjcmlwdC92ZXJzby5jb2ZmZWUiLCJub2RlX21vZHVsZXMvdmVyc28vbm9kZV9tb2R1bGVzL3ZlcnNvL25vZGVfbW9kdWxlcy9oYW1tZXJqcy9oYW1tZXIuanMiLCJub2RlX21vZHVsZXMvdmVyc28vbm9kZV9tb2R1bGVzL3ZlcnNvL25vZGVfbW9kdWxlcy9taWNyb2V2ZW50L21pY3JvZXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNDQSxJQUFBOztBQUFBLElBQTJCLE9BQU8sT0FBUCxLQUFrQixXQUE3QztFQUFBLE9BQUEsR0FBVTtJQUFBLE9BQUEsRUFBUyxJQUFUO0lBQVY7OztBQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7QUFFTixHQUFHLENBQUMsT0FBSixHQUFjLE9BQUEsQ0FBUSxtQkFBUjs7QUFHZCxHQUFHLENBQUMsT0FBSixHQUFjLE9BQUEsQ0FBUSxhQUFSOztBQUNkLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLE9BQUEsQ0FBUSxlQUFSOztBQUNoQixHQUFHLENBQUMsU0FBSixHQUFnQixPQUFBLENBQVEsZUFBUjs7QUFDaEIsR0FBRyxDQUFDLFFBQUosR0FBZSxPQUFBLENBQVEsY0FBUjs7QUFDZixHQUFHLENBQUMsT0FBSixHQUFjLE9BQUEsQ0FBUSxhQUFSOztBQUVkLEdBQUcsQ0FBQyxtQkFBSixHQUEwQixPQUFBLENBQVEsMEJBQVI7O0FBRzFCLEdBQUcsQ0FBQyxPQUFKLEdBQ0k7RUFBQSxLQUFBLEVBQU8sT0FBQSxDQUFRLHdCQUFSLENBQVA7RUFDQSxNQUFB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Q0FBQyxPQUFQLEdBQWlCOzs7Ozs7QUMzTWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMXFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmxGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyBNYWtlIHN1cmUgd2UgZGVmaW5lIHdlJ3JlIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudC5cbnByb2Nlc3MgPSBicm93c2VyOiB0cnVlIGlmIHR5cGVvZiBwcm9jZXNzIGlzICd1bmRlZmluZWQnXG5cblNHTiA9IHJlcXVpcmUgJy4vc2duJ1xuXG5TR04ucmVxdWVzdCA9IHJlcXVpcmUgJy4vcmVxdWVzdC9icm93c2VyJ1xuXG4jIEV4cG9zZSB0aGUgZGlmZmVyZW50IGtpdHMuXG5TR04uQXV0aEtpdCA9IHJlcXVpcmUgJy4va2l0cy9hdXRoJ1xuU0dOLkFzc2V0c0tpdCA9IHJlcXVpcmUgJy4va2l0cy9hc3NldHMnXG5TR04uRXZlbnRzS2l0ID0gcmVxdWlyZSAnLi9raXRzL2V2ZW50cydcblNHTi5HcmFwaEtpdCA9IHJlcXVpcmUgJy4va2l0cy9ncmFwaCdcblNHTi5Db3JlS2l0ID0gcmVxdWlyZSAnLi9raXRzL2NvcmUnXG4jU0dOLkluY2l0b1B1YmxpY2F0aW9uS2l0ID0gcmVxdWlyZSAnLi9raXRzL2luY2l0b19wdWJsaWNhdGlvbidcblNHTi5QYWdlZFB1YmxpY2F0aW9uS2l0ID0gcmVxdWlyZSAnLi9raXRzL3BhZ2VkX3B1YmxpY2F0aW9uJ1xuXG4jIEV4cG9zZSBzdG9yYWdlIGJhY2tlbmRzLlxuU0dOLnN0b3JhZ2UgPVxuICAgIGxvY2FsOiByZXF1aXJlICcuL3N0b3JhZ2UvY2xpZW50X2xvY2FsJ1xuICAgIGNvb2tpZTogcmVxdWlyZSAnLi9zdG9yYWdlL2NsaWVudF9jb29raWUnXG5cblNHTi5jbGllbnQgPSBkbyAtPlxuICAgIGlkID0gU0dOLnN0b3JhZ2UubG9jYWwuZ2V0ICdjbGllbnQtaWQnXG4gICAgZmlyc3RPcGVuID0gbm90IGlkP1xuXG4gICAgaWYgZmlyc3RPcGVuXG4gICAgICAgIGlkID0gU0dOLnV0aWwudXVpZCgpXG4gICAgICAgIFxuICAgICAgICBTR04uc3RvcmFnZS5sb2NhbC5zZXQgJ2NsaWVudC1pZCcsIGlkXG5cbiAgICBmaXJzdE9wZW46IGZpcnN0T3BlblxuICAgIGlkOiBpZFxuXG4jIE9wdGlvbmFsIHN0YXJ0IGZ1bmN0aW9uIHRvIGludm9rZSBzZXNzaW9uIHRyYWNraW5nLlxuU0dOLnN0YXJ0U2Vzc2lvbiA9IC0+XG4gICAgIyBFbWl0IHNlc3Npb24gZXZlbnRzIGlmIGEgdHJhY2tlciBpcyBhdmFpbGFibGUuXG4gICAgZXZlbnRUcmFja2VyID0gU0dOLmNvbmZpZy5nZXQgJ2V2ZW50VHJhY2tlcidcblxuICAgIGlmIGV2ZW50VHJhY2tlcj9cbiAgICAgICAgZXZlbnRUcmFja2VyLnRyYWNrRXZlbnQgJ2ZpcnN0LWNsaWVudC1zZXNzaW9uLW9wZW5lZCcsIHt9LCAnMS4wLjAnIGlmIFNHTi5jbGllbnQuZmlyc3RPcGVuIGlzIHRydWVcbiAgICAgICAgZXZlbnRUcmFja2VyLnRyYWNrRXZlbnQgJ2NsaWVudC1zZXNzaW9uLW9wZW5lZCcsIHt9LCAnMS4wLjAnXG5cbiAgICByZXR1cm5cblxubW9kdWxlLmV4cG9ydHMgPSBTR05cbiIsImF0dHJzID0ge31cbmtleXMgPSBbXG4gICAgJ2FwcFZlcnNpb24nLFxuICAgICdhcHBLZXknLFxuICAgICdhcHBTZWNyZXQnLFxuICAgICdhdXRoVG9rZW4nLFxuICAgICdzZXNzaW9uVG9rZW4nLFxuICAgICdldmVudFRyYWNrZXInLFxuICAgICdsb2NhbGUnXG5dXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBzZXQ6IChjb25maWcgPSB7fSkgLT5cbiAgICAgICAgZm9yIGtleSwgdmFsdWUgb2YgY29uZmlnXG4gICAgICAgICAgICBhdHRyc1trZXldID0gdmFsdWUgaWYga2V5IGluIGtleXNcblxuICAgICAgICByZXR1cm5cblxuICAgIGdldDogKG9wdGlvbikgLT5cbiAgICAgICAgYXR0cnNbb3B0aW9uXVxuIiwiY29uZmlnID0gcmVxdWlyZSAnLi9jb25maWcnXG51dGlsID0gcmVxdWlyZSAnLi91dGlsJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgY29uZmlnOiBjb25maWdcblxuICAgIHV0aWw6IHV0aWxcbiIsIm1vZHVsZS5leHBvcnRzID1cbiAgICBBUlJPV19SSUdIVDogMzlcbiAgICBBUlJPV19MRUZUOiAzN1xuICAgIFNQQUNFOiAzMlxuICAgIE5VTUJFUl9PTkU6IDQ5IiwiU0dOID0gcmVxdWlyZSAnLi4vLi4vc2duJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IChvcHRpb25zID0ge30sIGNhbGxiYWNrLCBwcm9ncmVzc0NhbGxiYWNrKSAtPlxuICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBpcyBub3QgZGVmaW5lZCcpIGlmIG5vdCBvcHRpb25zLmZpbGU/XG5cbiAgICB1cmwgPSAnaHR0cHM6Ly9hc3NldHMuc2VydmljZS5zaG9wZ3VuLmNvbS91cGxvYWQnXG4gICAgYm9keSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgdGltZW91dCA9IDEwMDAgKiA2MCAqIDYwXG5cbiAgICBib2R5LmFwcGVuZCAnZmlsZScsIG9wdGlvbnMuZmlsZVxuXG4gICAgU0dOLnJlcXVlc3RcbiAgICAgICAgbWV0aG9kOiAncG9zdCdcbiAgICAgICAgdXJsOiB1cmxcbiAgICAgICAgYm9keTogYm9keVxuICAgICAgICB0aW1lb3V0OiB0aW1lb3V0XG4gICAgICAgIGhlYWRlcnM6XG4gICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgLCAoZXJyLCBkYXRhKSAtPlxuICAgICAgICBpZiBlcnI/XG4gICAgICAgICAgICBjYWxsYmFjayBTR04udXRpbC5lcnJvcihuZXcgRXJyb3IoJ1JlcXVlc3QgZXJyb3InKSxcbiAgICAgICAgICAgICAgICBjb2RlOiAnUmVxdWVzdEVycm9yJ1xuICAgICAgICAgICAgKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiBkYXRhLnN0YXR1c0NvZGUgaXMgMjAwXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgbnVsbCwgSlNPTi5wYXJzZShkYXRhLmJvZHkpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgU0dOLnV0aWwuZXJyb3IobmV3IEVycm9yKCdSZXF1ZXN0IGVycm9yJyksXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6ICdSZXF1ZXN0RXJyb3InXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IGRhdGEuc3RhdHVzQ29kZVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICByZXR1cm5cbiAgICAsIChsb2FkZWQsIHRvdGFsKSAtPlxuICAgICAgICBpZiB0eXBlb2YgcHJvZ3Jlc3NDYWxsYmFjayBpcyAnZnVuY3Rpb24nXG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IGxvYWRlZCAvIHRvdGFsXG4gICAgICAgICAgICAgICAgbG9hZGVkOiBsb2FkZWRcbiAgICAgICAgICAgICAgICB0b3RhbDogdG90YWxcblxuICAgICAgICByZXR1cm5cblxuICAgIHJldHVyblxuIiwibW9kdWxlLmV4cG9ydHMgPVxuICAgIGZpbGVVcGxvYWQ6IHJlcXVpcmUgJy4vZmlsZV91cGxvYWQnXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9XG4iLCJTR04gPSByZXF1aXJlICcuLi8uLi9zZ24nXG5yZXF1ZXN0ID0gcmVxdWlyZSAnLi9yZXF1ZXN0J1xuc2Vzc2lvbiA9IHJlcXVpcmUgJy4vc2Vzc2lvbidcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICBzZXNzaW9uOiBzZXNzaW9uXG4iLCJTR04gPSByZXF1aXJlICcuLi8uLi9zZ24nXG5cbm1vZHVsZS5leHBvcnRzID0gKG9wdGlvbnMgPSB7fSwgY2FsbGJhY2spIC0+XG4gICAgU0dOLkNvcmVLaXQuc2Vzc2lvbi5lbnN1cmUgKGVycikgLT5cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrIGVyciBpZiBlcnI/XG5cbiAgICAgICAgYmFzZVVybCA9ICdodHRwczovL2FwaS5ldGlsYnVkc2F2aXMuZGsnXG4gICAgICAgIGhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgPyB7fVxuICAgICAgICB0b2tlbiA9IFNHTi5Db3JlS2l0LnNlc3Npb24uZ2V0ICd0b2tlbidcbiAgICAgICAgY2xpZW50SWQgPSBTR04uQ29yZUtpdC5zZXNzaW9uLmdldCAnY2xpZW50X2lkJ1xuICAgICAgICBhcHBWZXJzaW9uID0gU0dOLmNvbmZpZy5nZXQgJ2FwcFZlcnNpb24nXG4gICAgICAgIGFwcFNlY3JldCA9IFNHTi5jb25maWcuZ2V0ICdhcHBTZWNyZXQnXG4gICAgICAgIGxvY2FsZSA9IFNHTi5jb25maWcuZ2V0ICdsb2NhbGUnXG4gICAgICAgIHFzID0gb3B0aW9ucy5xcyA/IHt9XG4gICAgICAgIGdlbyA9IG9wdGlvbnMuZ2VvbG9jYXRpb25cblxuICAgICAgICBoZWFkZXJzWydYLVRva2VuJ10gPSB0b2tlblxuICAgICAgICBoZWFkZXJzWydYLVNpZ25hdHVyZSddID0gU0dOLkNvcmVLaXQuc2Vzc2lvbi5zaWduIGFwcFNlY3JldCwgdG9rZW4gaWYgYXBwU2VjcmV0P1xuXG4gICAgICAgIHFzLnJfbG9jYWxlID0gbG9jYWxlIGlmIGxvY2FsZT9cbiAgICAgICAgcXMuYXBpX2F2ID0gYXBwVmVyc2lvbiBpZiBhcHBWZXJzaW9uP1xuICAgICAgICBxcy5jbGllbnRfaWQgPSBjbGllbnRJZCBpZiBjbGllbnRJZD9cblxuICAgICAgICBpZiBnZW8/XG4gICAgICAgICAgICBxcy5yX2xhdCA9IGdlby5sYXRpdHVkZSBpZiBnZW8ubGF0aXR1ZGU/IGFuZCBub3QgcXMucl9sYXQ/XG4gICAgICAgICAgICBxcy5yX2xuZyA9IGdlby5sb25naXR1ZGUgaWYgZ2VvLmxvbmdpdHVkZT8gYW5kIG5vdCBxcy5yX2xuZz9cbiAgICAgICAgICAgIHFzLnJfcmFkaXVzID0gZ2VvLnJhZGl1cyBpZiBnZW8ucmFkaXVzPyBhbmQgbm90IHFzLnJfcmFkaXVzP1xuICAgICAgICAgICAgcXMucl9zZW5zb3IgPSBnZW8uc2Vuc29yIGlmIGdlby5zZW5zb3I/IGFuZCBub3QgcXMucl9zZW5zb3I/XG5cbiAgICAgICAgU0dOLnJlcXVlc3RcbiAgICAgICAgICAgIG1ldGhvZDogb3B0aW9ucy5tZXRob2RcbiAgICAgICAgICAgIHVybDogYmFzZVVybCArIG9wdGlvbnMudXJsXG4gICAgICAgICAgICBxczogcXNcbiAgICAgICAgICAgIGJvZHk6IG9wdGlvbnMuYm9keVxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xuICAgICAgICAgICAgdXNlQ29va2llczogZmFsc2VcbiAgICAgICAgLCAoZXJyLCBkYXRhKSAtPlxuICAgICAgICAgICAgaWYgZXJyP1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrIGVyclxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRva2VuID0gU0dOLkNvcmVLaXQuc2Vzc2lvbi5nZXQgJ3Rva2VuJ1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlVG9rZW4gPSBkYXRhLmhlYWRlcnNbJ3gtdG9rZW4nXVxuXG4gICAgICAgICAgICAgICAgU0dOLkNvcmVLaXQuc2Vzc2lvbi5zZXQgJ3Rva2VuJywgcmVzcG9uc2VUb2tlbiBpZiB0b2tlbiBpc250IHJlc3BvbnNlVG9rZW5cblxuICAgICAgICAgICAgICAgIGNhbGxiYWNrIG51bGwsIEpTT04ucGFyc2UoZGF0YS5ib2R5KSBpZiB0eXBlb2YgY2FsbGJhY2sgaXMgJ2Z1bmN0aW9uJ1xuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgIHJldHVyblxuIiwiU0dOID0gcmVxdWlyZSAnLi4vLi4vc2duJ1xuc2hhMjU2ID0gcmVxdWlyZSAnc2hhMjU2J1xuY2xpZW50Q29va2llU3RvcmFnZSA9IHJlcXVpcmUgJy4uLy4uL3N0b3JhZ2UvY2xpZW50X2Nvb2tpZSdcblxuc2Vzc2lvbiA9XG4gICAgdXJsOiAnaHR0cHM6Ly9hcGkuZXRpbGJ1ZHNhdmlzLmRrL3YyL3Nlc3Npb25zJ1xuXG4gICAgdG9rZW5UVEw6IDEgKiA2MCAqIDYwICogMjQgKiA2MFxuXG4gICAgYXR0cnM6IGRvIC0+XG4gICAgICAgIGNsaWVudENvb2tpZVN0b3JhZ2UuZ2V0KCdzZXNzaW9ucycpID8ge31cblxuICAgIGNhbGxiYWNrUXVldWU6IFtdXG5cbiAgICBnZXQ6IChrZXkpIC0+XG4gICAgICAgIGFwcEtleSA9IFNHTi5jb25maWcuZ2V0ICdhcHBLZXknXG5cbiAgICAgICAgaWYga2V5P1xuICAgICAgICAgICAgc2Vzc2lvbi5hdHRyc1thcHBLZXldP1trZXldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNlc3Npb24uYXR0cnNbYXBwS2V5XSA/IHt9XG5cbiAgICBzZXQ6IChrZXksIHZhbHVlKSAtPlxuICAgICAgICBhdHRycyA9IG51bGxcblxuICAgICAgICBpZiB0eXBlb2Yga2V5IGlzICdvYmplY3QnXG4gICAgICAgICAgICBhdHRycyA9IGtleVxuICAgICAgICBlbHNlIGlmIHR5cGVvZiBrZXkgaXMgJ3N0cmluZycgYW5kIHZhbHVlP1xuICAgICAgICAgICAgYXR0cnMgPSBzZXNzaW9uLmF0dHJzXG4gICAgICAgICAgICBhdHRyc1trZXldID0gdmFsdWVcbiAgICAgICAgICAgIFxuICAgICAgICBhcHBLZXkgPSBTR04uY29uZmlnLmdldCAnYXBwS2V5J1xuICAgICAgICBzZXNzaW9ucyA9IGNsaWVudENvb2tpZVN0b3JhZ2UuZ2V0ICdzZXNzaW9ucydcblxuICAgICAgICBzZXNzaW9ucyA9IHt9IGlmIG5vdCBzZXNzaW9ucz9cbiAgICAgICAgc2Vzc2lvbnNbYXBwS2V5XSA9IGF0dHJzXG5cbiAgICAgICAgY2xpZW50Q29va2llU3RvcmFnZS5zZXQgJ3Nlc3Npb25zJywgc2Vzc2lvbnNcblxuICAgICAgICBzZXNzaW9uLmF0dHJzID0gc2Vzc2lvbnNcblxuICAgICAgICByZXR1cm5cblxuICAgIGNyZWF0ZTogKGNhbGxiYWNrKSAtPlxuICAgICAgICBTR04ucmVxdWVzdFxuICAgICAgICAgICAgbWV0aG9kOiAncG9zdCdcbiAgICAgICAgICAgIHVybDogc2Vzc2lvbi51cmxcbiAgICAgICAgICAgIGhlYWRlcnM6XG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgcXM6XG4gICAgICAgICAgICAgICAgYXBpX2tleTogU0dOLmNvbmZpZy5nZXQgJ2FwcEtleSdcbiAgICAgICAgICAgICAgICB0b2tlbl90dGw6IHNlc3Npb24udG9rZW5UVExcbiAgICAgICAgLCAoZXJyLCBkYXRhKSAtPlxuICAgICAgICAgICAgaWYgZXJyP1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrIGVyclxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNlc3Npb24uc2V0IEpTT04ucGFyc2UoZGF0YS5ib2R5KVxuXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgZXJyLCBzZXNzaW9uLmdldCgpXG5cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVyblxuICAgIFxuICAgIHVwZGF0ZTogKGNhbGxiYWNrKSAtPlxuICAgICAgICBoZWFkZXJzID0ge31cbiAgICAgICAgdG9rZW4gPSBzZXNzaW9uLmdldCAndG9rZW4nXG4gICAgICAgIGFwcFNlY3JldCA9IFNHTi5jb25maWcuZ2V0ICdhcHBTZWNyZXQnXG5cbiAgICAgICAgaGVhZGVyc1snWC1Ub2tlbiddID0gdG9rZW5cbiAgICAgICAgaGVhZGVyc1snWC1TaWduYXR1cmUnXSA9IHNlc3Npb24uc2lnbiBhcHBTZWNyZXQsIHRva2VuIGlmIGFwcFNlY3JldD9cbiAgICAgICAgaGVhZGVyc1snQWNjZXB0J10gPSAnYXBwbGljYXRpb24vanNvbidcblxuICAgICAgICBTR04ucmVxdWVzdFxuICAgICAgICAgICAgdXJsOiBzZXNzaW9uLnVybFxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xuICAgICAgICAsIChlcnIsIGRhdGEpIC0+XG4gICAgICAgICAgICBpZiBlcnI/XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgZXJyXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2Vzc2lvbi5zZXQgSlNPTi5wYXJzZShkYXRhLmJvZHkpXG5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayBlcnIsIHNlc3Npb24uZ2V0KClcblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICByZW5ldzogKGNhbGxiYWNrKSAtPlxuICAgICAgICBoZWFkZXJzID0ge31cbiAgICAgICAgdG9rZW4gPSBzZXNzaW9uLmdldCAndG9rZW4nXG4gICAgICAgIGFwcFNlY3JldCA9IFNHTi5jb25maWcuZ2V0ICdhcHBTZWNyZXQnXG5cbiAgICAgICAgaGVhZGVyc1snWC1Ub2tlbiddID0gdG9rZW5cbiAgICAgICAgaGVhZGVyc1snWC1TaWduYXR1cmUnXSA9IHNlc3Npb24uc2lnbiBhcHBTZWNyZXQsIHRva2VuIGlmIGFwcFNlY3JldD9cbiAgICAgICAgaGVhZGVyc1snQWNjZXB0J10gPSAnYXBwbGljYXRpb24vanNvbidcblxuICAgICAgICBTR04ucmVxdWVzdFxuICAgICAgICAgICAgbWV0aG9kOiAncHV0J1xuICAgICAgICAgICAgdXJsOiBzZXNzaW9uLnVybFxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xuICAgICAgICAsIChlcnIsIGRhdGEpIC0+XG4gICAgICAgICAgICBpZiBlcnI/XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgZXJyXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2Vzc2lvbi5zZXQgSlNPTi5wYXJzZShkYXRhLmJvZHkpXG5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayBlcnIsIHNlc3Npb24uZ2V0KClcblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBlbnN1cmU6IChjYWxsYmFjaykgLT5cbiAgICAgICAgcXVldWVDb3VudCA9IHNlc3Npb24uY2FsbGJhY2tRdWV1ZS5sZW5ndGhcbiAgICAgICAgY29tcGxldGUgPSAoZXJyKSAtPlxuICAgICAgICAgICAgc2Vzc2lvbi5jYWxsYmFja1F1ZXVlID0gc2Vzc2lvbi5jYWxsYmFja1F1ZXVlLmZpbHRlciAoZm4pIC0+XG4gICAgICAgICAgICAgICAgZm4gZXJyXG5cbiAgICAgICAgICAgICAgICBmYWxzZVxuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBzZXNzaW9uLmNhbGxiYWNrUXVldWUucHVzaCBjYWxsYmFja1xuXG4gICAgICAgIGlmIHF1ZXVlQ291bnQgaXMgMFxuICAgICAgICAgICAgaWYgbm90IHNlc3Npb24uZ2V0KCd0b2tlbicpP1xuICAgICAgICAgICAgICAgIHNlc3Npb24uY3JlYXRlIGNvbXBsZXRlXG4gICAgICAgICAgICBlbHNlIGlmIHNlc3Npb24ud2lsbEV4cGlyZVNvb24oc2Vzc2lvbi5nZXQoJ2V4cGlyZXMnKSlcbiAgICAgICAgICAgICAgICBzZXNzaW9uLnJlbmV3IGNvbXBsZXRlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY29tcGxldGUoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgd2lsbEV4cGlyZVNvb246IChleHBpcmVzKSAtPlxuICAgICAgICBEYXRlLm5vdygpID49IERhdGUucGFyc2UoZXhwaXJlcykgLSAxMDAwICogNjAgKiA2MCAqIDI0XG5cbiAgICBzaWduOiAoYXBwU2VjcmV0LCB0b2tlbikgLT5cbiAgICAgICAgc2hhMjU2IFthcHBTZWNyZXQsIHRva2VuXS5qb2luKCcnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNlc3Npb25cbiIsIm1vZHVsZS5leHBvcnRzID1cbiAgICBUcmFja2VyOiByZXF1aXJlICcuL3RyYWNrZXInXG4iLCJTR04gPSByZXF1aXJlICcuLi8uLi9zZ24nXG5jbGllbnRMb2NhbFN0b3JhZ2UgPSByZXF1aXJlICcuLi8uLi9zdG9yYWdlL2NsaWVudF9sb2NhbCdcbmdldFBvb2wgPSAtPlxuICAgIGRhdGEgPSBjbGllbnRMb2NhbFN0b3JhZ2UuZ2V0ICdldmVudC10cmFja2VyLXBvb2wnXG4gICAgZGF0YSA9IFtdIGlmIEFycmF5LmlzQXJyYXkoZGF0YSkgaXMgZmFsc2VcblxuICAgIGRhdGFcbnBvb2wgPSBnZXRQb29sKClcblxuY2xpZW50TG9jYWxTdG9yYWdlLnNldCAnZXZlbnQtdHJhY2tlci1wb29sJywgW11cblxudHJ5XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3VubG9hZCcsIC0+XG4gICAgICAgIHBvb2wgPSBwb29sLmNvbmNhdCBnZXRQb29sKClcblxuICAgICAgICBjbGllbnRMb2NhbFN0b3JhZ2Uuc2V0ICdldmVudC10cmFja2VyLXBvb2wnLCBwb29sXG5cbiAgICAgICAgcmV0dXJuXG4gICAgLCBmYWxzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRyYWNrZXJcbiAgICBkZWZhdWx0T3B0aW9uczpcbiAgICAgICAgYmFzZVVybDogJ2h0dHBzOi8vZXZlbnRzLnNlcnZpY2Uuc2hvcGd1bi5jb20nXG4gICAgICAgIHRyYWNrSWQ6IG51bGxcbiAgICAgICAgZGlzcGF0Y2hJbnRlcnZhbDogMzAwMFxuICAgICAgICBkaXNwYXRjaExpbWl0OiAxMDBcbiAgICAgICAgcG9vbExpbWl0OiAxMDAwXG4gICAgICAgIGRyeVJ1bjogZmFsc2VcblxuICAgIGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuICAgICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBAZGVmYXVsdE9wdGlvbnNcbiAgICAgICAgICAgIEBba2V5XSA9IG9wdGlvbnNba2V5XSBvciB2YWx1ZVxuXG4gICAgICAgIEBkaXNwYXRjaGluZyA9IGZhbHNlXG4gICAgICAgIEBzZXNzaW9uID1cbiAgICAgICAgICAgIGlkOiBTR04udXRpbC51dWlkKClcbiAgICAgICAgQGNsaWVudCA9XG4gICAgICAgICAgICB0cmFja0lkOiBAdHJhY2tJZFxuICAgICAgICAgICAgaWQ6IFNHTi5jbGllbnQuaWRcbiAgICAgICAgQHZpZXcgPVxuICAgICAgICAgICAgcGF0aDogW11cbiAgICAgICAgICAgIHByZXZpb3VzUGF0aDogW11cbiAgICAgICAgICAgIHVyaTogbnVsbFxuICAgICAgICBAbG9jYXRpb24gPSB7fVxuICAgICAgICBAYXBwbGljYXRpb24gPSB7fVxuICAgICAgICBAaWRlbnRpdHkgPSB7fVxuXG4gICAgICAgICMgRGlzcGF0Y2ggZXZlbnRzIHBlcmlvZGljYWxseS5cbiAgICAgICAgQGludGVydmFsID0gc2V0SW50ZXJ2YWwgQGRpc3BhdGNoLmJpbmQoQCksIEBkaXNwYXRjaEludGVydmFsXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICB0cmFja0V2ZW50OiAodHlwZSwgcHJvcGVydGllcyA9IHt9LCB2ZXJzaW9uID0gJzEuMC4wJykgLT5cbiAgICAgICAgdGhyb3cgU0dOLnV0aWwuZXJyb3IobmV3IEVycm9yKCdFdmVudCB0eXBlIGlzIHJlcXVpcmVkJykpIGlmIHR5cGVvZiB0eXBlIGlzbnQgJ3N0cmluZydcbiAgICAgICAgcmV0dXJuIGlmIG5vdCBAdHJhY2tJZD9cblxuICAgICAgICBwb29sLnB1c2hcbiAgICAgICAgICAgIGlkOiBTR04udXRpbC51dWlkKClcbiAgICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgICAgIHZlcnNpb246IHZlcnNpb25cbiAgICAgICAgICAgIHJlY29yZGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgICAgICAgc2VudEF0OiBudWxsXG4gICAgICAgICAgICBjbGllbnQ6XG4gICAgICAgICAgICAgICAgaWQ6IEBjbGllbnQuaWRcbiAgICAgICAgICAgICAgICB0cmFja0lkOiBAY2xpZW50LnRyYWNrSWRcbiAgICAgICAgICAgIGNvbnRleHQ6IEBnZXRDb250ZXh0KClcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNcblxuICAgICAgICBwb29sLnNoaWZ0KCkgd2hpbGUgQGdldFBvb2xTaXplKCkgPiBAcG9vbExpbWl0XG5cbiAgICAgICAgQFxuXG4gICAgaWRlbnRpZnk6IChpZCkgLT5cbiAgICAgICAgQGlkZW50aXR5LmlkID0gaWRcblxuICAgICAgICBAXG5cbiAgICBzZXRMb2NhdGlvbjogKGxvY2F0aW9uID0ge30pIC0+XG4gICAgICAgIEBsb2NhdGlvbi5kZXRlcm1pbmVkQXQgPSBuZXcgRGF0ZShsb2NhdGlvbi50aW1lc3RhbXApLnRvSVNPU3RyaW5nKClcbiAgICAgICAgQGxvY2F0aW9uLmxhdGl0dWRlID0gbG9jYXRpb24ubGF0aXR1ZGVcbiAgICAgICAgQGxvY2F0aW9uLmxvbmdpdHVkZSA9IGxvY2F0aW9uLmxvbmdpdHVkZVxuICAgICAgICBAbG9jYXRpb24uYWx0aXR1ZGUgPSBsb2NhdGlvbi5hbHRpdHVkZVxuICAgICAgICBAbG9jYXRpb24uYWNjdXJhY3kgPVxuICAgICAgICAgICAgaG9yaXpvbnRhbDogbG9jYXRpb24uYWNjdXJhY3k/Lmhvcml6b250YWxcbiAgICAgICAgICAgIHZlcnRpY2FsOiBsb2NhdGlvbi5hY2N1cmFjeT8udmVydGljYWxcbiAgICAgICAgQGxvY2F0aW9uLnNwZWVkID0gbG9jYXRpb24uc3BlZWRcbiAgICAgICAgQGxvY2F0aW9uLmZsb29yID0gbG9jYXRpb24uZmxvb3JcblxuICAgICAgICBAXG5cbiAgICBzZXRBcHBsaWNhdGlvbjogKGFwcGxpY2F0aW9uID0ge30pIC0+XG4gICAgICAgIEBhcHBsaWNhdGlvbi5uYW1lID0gYXBwbGljYXRpb24ubmFtZVxuICAgICAgICBAYXBwbGljYXRpb24udmVyc2lvbiA9IGFwcGxpY2F0aW9uLnZlcnNpb25cbiAgICAgICAgQGFwcGxpY2F0aW9uLmJ1aWxkID0gYXBwbGljYXRpb24uYnVpbGRcblxuICAgICAgICBAXG5cbiAgICBzZXRWaWV3OiAocGF0aCkgLT5cbiAgICAgICAgQHZpZXcucHJldmlvdXNQYXRoID0gQHZpZXcucGF0aFxuICAgICAgICBAdmlldy5wYXRoID0gcGF0aCBpZiBBcnJheS5pc0FycmF5KHBhdGgpIGlzIHRydWVcbiAgICAgICAgQHZpZXcudXJpID0gd2luZG93LmxvY2F0aW9uLmhyZWZcblxuICAgICAgICBAXG5cbiAgICBnZXRWaWV3OiAtPlxuICAgICAgICB2aWV3ID0ge31cblxuICAgICAgICB2aWV3LnBhdGggPSBAdmlldy5wYXRoIGlmIEB2aWV3LnBhdGgubGVuZ3RoID4gMFxuICAgICAgICB2aWV3LnByZXZpb3VzUGF0aCA9IEB2aWV3LnByZXZpb3VzUGF0aCBpZiBAdmlldy5wcmV2aW91c1BhdGgubGVuZ3RoID4gMFxuICAgICAgICB2aWV3LnVyaSA9IEB2aWV3LnVyaSBpZiBAdmlldy51cmk/XG5cbiAgICAgICAgdmlld1xuXG4gICAgZ2V0Q29udGV4dDogLT5cbiAgICAgICAgc2NyZWVuRGltZW5zaW9ucyA9IFNHTi51dGlsLmdldFNjcmVlbkRpbWVuc2lvbnMoKVxuICAgICAgICBvcyA9IFNHTi51dGlsLmdldE9TKClcbiAgICAgICAgY29udGV4dCA9XG4gICAgICAgICAgICB1c2VyQWdlbnQ6IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgICAgICAgICBsb2NhbGU6IG5hdmlnYXRvci5sYW5ndWFnZVxuICAgICAgICAgICAgdGltZVpvbmU6XG4gICAgICAgICAgICAgICAgdXRjT2Zmc2V0U2Vjb25kczogU0dOLnV0aWwuZ2V0VXRjT2Zmc2V0U2Vjb25kcygpXG4gICAgICAgICAgICAgICAgdXRjRHN0T2Zmc2V0U2Vjb25kczogU0dOLnV0aWwuZ2V0VXRjRHN0T2Zmc2V0U2Vjb25kcygpXG4gICAgICAgICAgICBkZXZpY2U6XG4gICAgICAgICAgICAgICAgc2NyZWVuOlxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogc2NyZWVuRGltZW5zaW9ucy5waHlzaWNhbC53aWR0aFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHNjcmVlbkRpbWVuc2lvbnMucGh5c2ljYWwuaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIGRlbnNpdHk6IHNjcmVlbkRpbWVuc2lvbnMuZGVuc2l0eVxuICAgICAgICAgICAgc2Vzc2lvbjpcbiAgICAgICAgICAgICAgICBpZDogQHNlc3Npb24uaWRcbiAgICAgICAgICAgIHZpZXc6IEBnZXRWaWV3KClcbiAgICAgICAgYXBwbGljYXRpb24gPVxuICAgICAgICAgICAgbmFtZTogQGFwcGxpY2F0aW9uLm5hbWVcbiAgICAgICAgICAgIHZlcnNpb246IEBhcHBsaWNhdGlvbi52ZXJzaW9uXG4gICAgICAgICAgICBidWlsZDogQGFwcGxpY2F0aW9uLmJ1aWxkXG4gICAgICAgIGNhbXBhaWduID1cbiAgICAgICAgICAgIHNvdXJjZTogU0dOLnV0aWwuZ2V0UXVlcnlQYXJhbSAndXRtX3NvdXJjZSdcbiAgICAgICAgICAgIG1lZGl1bTogU0dOLnV0aWwuZ2V0UXVlcnlQYXJhbSAndXRtX21lZGl1bSdcbiAgICAgICAgICAgIG5hbWU6IFNHTi51dGlsLmdldFF1ZXJ5UGFyYW0gJ3V0bV9jYW1wYWlnbidcbiAgICAgICAgICAgIHRlcm06IFNHTi51dGlsLmdldFF1ZXJ5UGFyYW0gJ3V0bV90ZXJtJ1xuICAgICAgICAgICAgY29udGVudDogU0dOLnV0aWwuZ2V0UXVlcnlQYXJhbSAndXRtX2NvbnRlbnQnXG4gICAgICAgIGxvYyA9XG4gICAgICAgICAgICBkZXRlcm1pbmVkQXQ6IEBsb2NhdGlvbi5kZXRlcm1pbmVkQXRcbiAgICAgICAgICAgIGxhdGl0dWRlOiBAbG9jYXRpb24ubGF0aXR1ZGVcbiAgICAgICAgICAgIGxvbmdpdHVkZTogQGxvY2F0aW9uLmxvbmdpdHVkZVxuICAgICAgICAgICAgYWx0aXR1ZGU6IEBsb2NhdGlvbi5hbHRpdHVkZVxuICAgICAgICAgICAgc3BlZWQ6IEBsb2NhdGlvbi5zcGVlZFxuICAgICAgICAgICAgZmxvb3I6IEBsb2NhdGlvbi5mbG9vclxuICAgICAgICAgICAgYWNjdXJhY3k6XG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbDogQGxvY2F0aW9uLmFjY3VyYWN5Py5ob3Jpem9udGFsXG4gICAgICAgICAgICAgICAgdmVydGljYWw6IEBsb2NhdGlvbi5hY2N1cmFjeT8udmVydGljYWxcblxuICAgICAgICAjIE9wZXJhdGluZyBzeXN0ZW0uXG4gICAgICAgIGNvbnRleHQub3MgPSBuYW1lOiBvcyBpZiBvcz9cblxuICAgICAgICAjIFNlc3Npb24gcmVmZXJyZXIuXG4gICAgICAgIGNvbnRleHQuc2Vzc2lvbi5yZWZlcnJlciA9IGRvY3VtZW50LnJlZmVycmVyIGlmIGRvY3VtZW50LnJlZmVycmVyLmxlbmd0aCA+IDBcblxuICAgICAgICAjIEFwcGxpY2F0aW9uLlxuICAgICAgICBbJ25hbWUnLCAndmVyc2lvbicsICdidWlsZCddLmZvckVhY2ggKGtleSkgLT5cbiAgICAgICAgICAgIGRlbGV0ZSBhcHBsaWNhdGlvbltrZXldIGlmIHR5cGVvZiBhcHBsaWNhdGlvbltrZXldIGlzbnQgJ3N0cmluZycgb3IgYXBwbGljYXRpb25ba2V5XS5sZW5ndGggaXMgMFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIGNvbnRleHQuYXBwbGljYXRpb24gPSBhcHBsaWNhdGlvbiBpZiBPYmplY3Qua2V5cyhhcHBsaWNhdGlvbikubGVuZ3RoID4gMFxuXG4gICAgICAgICMgQ2FtcGFpZ24uXG4gICAgICAgIFsnc291cmNlJywgJ21lZGl1bScsICduYW1lJywgJ3Rlcm0nLCAnY29udGVudCddLmZvckVhY2ggKGtleSkgLT5cbiAgICAgICAgICAgIGRlbGV0ZSBjYW1wYWlnbltrZXldIGlmIHR5cGVvZiBjYW1wYWlnbltrZXldIGlzbnQgJ3N0cmluZycgb3IgY2FtcGFpZ25ba2V5XS5sZW5ndGggaXMgMFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIGNvbnRleHQuY2FtcGFpZ24gPSBjYW1wYWlnbiBpZiBPYmplY3Qua2V5cyhjYW1wYWlnbikubGVuZ3RoID4gMFxuXG4gICAgICAgICMgTG9jYXRpb24uXG4gICAgICAgIFsnbGF0aXR1ZGUnLCAnbG9uZ2l0dWRlJywgJ2FsdGl0dWRlJywgJ3NwZWVkJywgJ2Zsb29yJ10uZm9yRWFjaCAoa2V5KSAtPlxuICAgICAgICAgICAgZGVsZXRlIGxvY1trZXldIGlmIHR5cGVvZiBsb2Nba2V5XSBpc250ICdudW1iZXInXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgZGVsZXRlIGxvYy5hY2N1cmFjeS5ob3Jpem9udGFsIGlmIHR5cGVvZiBsb2MuYWNjdXJhY3kuaG9yaXpvbnRhbCBpc250ICdudW1iZXInXG4gICAgICAgIGRlbGV0ZSBsb2MuYWNjdXJhY3kudmVydGljYWwgaWYgdHlwZW9mIGxvYy5hY2N1cmFjeS52ZXJ0aWNhbCBpc250ICdudW1iZXInXG4gICAgICAgIGRlbGV0ZSBsb2MuYWNjdXJhY3kgaWYgT2JqZWN0LmtleXMobG9jLmFjY3VyYWN5KS5sZW5ndGggaXMgMFxuICAgICAgICBkZWxldGUgbG9jLmRldGVybWluZWRBdCBpZiB0eXBlb2YgbG9jLmRldGVybWluZWRBdCBpc250ICdzdHJpbmcnIG9yIGxvYy5kZXRlcm1pbmVkQXQubGVuZ3RoIGlzIDBcbiAgICAgICAgY29udGV4dC5sb2NhdGlvbiA9IGxvYyBpZiBPYmplY3Qua2V5cyhsb2MpLmxlbmd0aCA+IDBcblxuICAgICAgICAjIFBlcnNvbiBpZGVudGlmaWVyLlxuICAgICAgICBjb250ZXh0LnBlcnNvbklkID0gQGlkZW50aXR5LmlkIGlmIEBpZGVudGl0eS5pZD9cblxuICAgICAgICBjb250ZXh0XG5cbiAgICBnZXRQb29sU2l6ZTogLT5cbiAgICAgICAgcG9vbC5sZW5ndGhcblxuICAgIGRpc3BhdGNoOiAtPlxuICAgICAgICByZXR1cm4gaWYgQGRpc3BhdGNoaW5nIGlzIHRydWUgb3IgQGdldFBvb2xTaXplKCkgaXMgMFxuICAgICAgICByZXR1cm4gcG9vbC5zcGxpY2UoMCwgQGRpc3BhdGNoTGltaXQpIGlmIEBkcnlSdW4gaXMgdHJ1ZVxuXG4gICAgICAgIGV2ZW50cyA9IHBvb2wuc2xpY2UgMCwgQGRpc3BhdGNoTGltaXRcbiAgICAgICAgbmFja3MgPSAwXG5cbiAgICAgICAgQGRpc3BhdGNoaW5nID0gdHJ1ZVxuXG4gICAgICAgIEBzaGlwIGV2ZW50cywgKGVyciwgcmVzcG9uc2UpID0+XG4gICAgICAgICAgICBAZGlzcGF0Y2hpbmcgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiBub3QgZXJyP1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmV2ZW50cy5mb3JFYWNoIChyZXNFdmVudCkgLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgcmVzRXZlbnQuc3RhdHVzIGlzICd2YWxpZGF0aW9uX2Vycm9yJyBvciByZXNFdmVudC5zdGF0dXMgaXMgJ2FjaydcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvb2wgPSBwb29sLmZpbHRlciAocG9vbEV2ZW50KSAtPiBwb29sRXZlbnQuaWQgaXNudCByZXNFdmVudC5pZFxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICduYWNrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFja3MrK1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgIyBLZWVwIGRpc3BhdGNoaW5nIHVudGlsIHRoZSBwb29sIHNpemUgcmVhY2hlcyBhIHNhbmUgbGV2ZWwuXG4gICAgICAgICAgICAgICAgQGRpc3BhdGNoKCkgaWYgQGdldFBvb2xTaXplKCkgPj0gQGRpc3BhdGNoTGltaXQgYW5kIG5hY2tzIGlzIDBcblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQFxuXG4gICAgc2hpcDogKGV2ZW50cyA9IFtdLCBjYWxsYmFjaykgLT5cbiAgICAgICAgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIHVybCA9IEBiYXNlVXJsICsgJy90cmFjaydcbiAgICAgICAgcGF5bG9hZCA9IGV2ZW50czogZXZlbnRzLm1hcCAoZXZlbnQpIC0+XG4gICAgICAgICAgICBldmVudC5zZW50QXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcblxuICAgICAgICAgICAgZXZlbnRcblxuICAgICAgICBodHRwLm9wZW4gJ1BPU1QnLCB1cmxcbiAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyICdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyICdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgaHR0cC50aW1lb3V0ID0gMTAwMCAqIDIwXG4gICAgICAgIGh0dHAub25sb2FkID0gLT5cbiAgICAgICAgICAgIGlmIGh0dHAuc3RhdHVzIGlzIDIwMFxuICAgICAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayBudWxsLCBKU09OLnBhcnNlKGh0dHAucmVzcG9uc2VUZXh0KVxuICAgICAgICAgICAgICAgIGNhdGNoIGVyclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayBTR04udXRpbC5lcnJvcihuZXcgRXJyb3IoJ0NvdWxkIG5vdCBwYXJzZSBKU09OJykpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgU0dOLnV0aWwuZXJyb3IobmV3IEVycm9yKCdTZXJ2ZXIgZGlkIG5vdCBhY2NlcHQgcmVxdWVzdCcpKVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgaHR0cC5vbmVycm9yID0gLT5cbiAgICAgICAgICAgIGNhbGxiYWNrIFNHTi51dGlsLmVycm9yKG5ldyBFcnJvcignQ291bGQgbm90IHBlcmZvcm0gbmV0d29yayByZXF1ZXN0JykpXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBodHRwLnNlbmQgSlNPTi5zdHJpbmdpZnkocGF5bG9hZClcblxuICAgICAgICBAXG4iLCJtb2R1bGUuZXhwb3J0cyA9XG4gICAgcmVxdWVzdDogcmVxdWlyZSAnLi9yZXF1ZXN0J1xuIiwiU0dOID0gcmVxdWlyZSAnLi4vLi4vc2duJ1xuXG5wYXJzZUNvb2tpZXMgPSAoY29va2llcyA9IFtdKSAtPlxuICAgIHBhcnNlZENvb2tpZXMgPSB7fVxuXG4gICAgY29va2llcy5tYXAgKGNvb2tpZSkgLT5cbiAgICAgICAgcGFydHMgPSBjb29raWUuc3BsaXQgJzsgJ1xuICAgICAgICBrZXlWYWx1ZVBhaXIgPSBwYXJ0c1swXS5zcGxpdCAnPSdcbiAgICAgICAga2V5ID0ga2V5VmFsdWVQYWlyWzBdXG4gICAgICAgIHZhbHVlID0ga2V5VmFsdWVQYWlyWzFdXG5cbiAgICAgICAgcGFyc2VkQ29va2llc1trZXldID0gdmFsdWVcblxuICAgICAgICByZXR1cm5cbiAgICBcbiAgICBwYXJzZWRDb29raWVzXG5cbm1vZHVsZS5leHBvcnRzID0gKG9wdGlvbnMgPSB7fSwgY2FsbGJhY2spIC0+XG4gICAgdXJsID0gJ2h0dHBzOi8vZ3JhcGguc2VydmljZS5zaG9wZ3VuLmNvbSdcbiAgICB0aW1lb3V0ID0gMTAwMCAqIDEyXG4gICAgYXBwS2V5ID0gU0dOLmNvbmZpZy5nZXQgJ2FwcEtleSdcbiAgICBhdXRoVG9rZW4gPSBTR04uY29uZmlnLmdldCAnYXV0aFRva2VuJ1xuICAgIGF1dGhUb2tlbkNvb2tpZU5hbWUgPSAnc2hvcGd1bi1hdXRoLXRva2VuJ1xuICAgIG9wdGlvbnMgPVxuICAgICAgICBtZXRob2Q6ICdwb3N0J1xuICAgICAgICB1cmw6IHVybFxuICAgICAgICBoZWFkZXJzOlxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB0aW1lb3V0OiB0aW1lb3V0XG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5XG4gICAgICAgICAgICBxdWVyeTogb3B0aW9ucy5xdWVyeVxuICAgICAgICAgICAgb3BlcmF0aW9uTmFtZTogb3B0aW9ucy5vcGVyYXRpb25OYW1lXG4gICAgICAgICAgICB2YXJpYWJsZXM6IG9wdGlvbnMudmFyaWFibGVzXG5cbiAgICAjIEFwcGx5IGF1dGhvcml6YXRpb24gaGVhZGVyIHdoZW4gYXBwIGtleSBpcyBwcm92aWRlZCB0byBhdm9pZCByYXRlIGxpbWl0aW5nLlxuICAgIG9wdGlvbnMuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBTR04udXRpbC5idG9hKFwiYXBwLWtleToje2FwcEtleX1cIikgaWYgYXBwS2V5P1xuXG4gICAgIyBTZXQgY29va2llcyBtYW51YWxseSBpbiBub2RlLmpzLlxuICAgIGlmIFNHTi51dGlsLmlzTm9kZSgpIGFuZCBhdXRoVG9rZW4/XG4gICAgICAgIG9wdGlvbnMuY29va2llcyA9IFtcbiAgICAgICAgICAgIGtleTogYXV0aFRva2VuQ29va2llTmFtZVxuICAgICAgICAgICAgdmFsdWU6IGF1dGhUb2tlblxuICAgICAgICAgICAgdXJsOiB1cmxcbiAgICAgICAgXVxuXG4gICAgU0dOLnJlcXVlc3Qgb3B0aW9ucywgKGVyciwgZGF0YSkgLT5cbiAgICAgICAgaWYgZXJyP1xuICAgICAgICAgICAgY2FsbGJhY2sgU0dOLnV0aWwuZXJyb3IobmV3IEVycm9yKCdHcmFwaCByZXF1ZXN0IGVycm9yJyksXG4gICAgICAgICAgICAgICAgY29kZTogJ0dyYXBoUmVxdWVzdEVycm9yJ1xuICAgICAgICAgICAgKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiBkYXRhLnN0YXR1c0NvZGUgaXMgMjAwXG4gICAgICAgICAgICAgICAgIyBVcGRhdGUgYXV0aCB0b2tlbiBhcyBpdCBtaWdodCBoYXZlIGNoYW5nZWQuXG4gICAgICAgICAgICAgICAgaWYgU0dOLnV0aWwuaXNOb2RlKClcbiAgICAgICAgICAgICAgICAgICAgY29va2llcyA9IHBhcnNlQ29va2llcyBkYXRhLmhlYWRlcnM/WydzZXQtY29va2llJ11cblxuICAgICAgICAgICAgICAgICAgICBpZiBTR04uY29uZmlnLmdldCgnYXV0aFRva2VuJykgaXNudCBjb29raWVzW2F1dGhUb2tlbkNvb2tpZU5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgICBTR04uY29uZmlnLnNldCAnYXV0aFRva2VuJywgY29va2llc1thdXRoVG9rZW5Db29raWVOYW1lXVxuXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgbnVsbCwgSlNPTi5wYXJzZShkYXRhLmJvZHkpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgU0dOLnV0aWwuZXJyb3IobmV3IEVycm9yKCdSZXF1ZXN0IGVycm9yJyksXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6ICdSZXF1ZXN0RXJyb3InXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IGRhdGEuc3RhdHVzQ29kZVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICByZXR1cm5cblxuICAgIHJldHVyblxuXG5cbiIsIk1pY3JvRXZlbnQgPSByZXF1aXJlICdtaWNyb2V2ZW50J1xuU0dOID0gcmVxdWlyZSAnLi4vLi4vc2duJ1xua2V5Q29kZXMgPSByZXF1aXJlICcuLi8uLi9rZXlfY29kZXMnXG5cbmNsYXNzIFBhZ2VkUHVibGljYXRpb25Db250cm9sc1xuICAgIGNvbnN0cnVjdG9yOiAoZWwsIEBvcHRpb25zID0ge30pIC0+XG4gICAgICAgIEBlbHMgPVxuICAgICAgICAgICAgcm9vdDogZWxcbiAgICAgICAgICAgIHByb2dyZXNzOiBlbC5xdWVyeVNlbGVjdG9yICcuc2duLXBwX19wcm9ncmVzcydcbiAgICAgICAgICAgIHByb2dyZXNzQmFyOiBlbC5xdWVyeVNlbGVjdG9yICcuc2duLXBwLXByb2dyZXNzX19iYXInXG4gICAgICAgICAgICBwcm9ncmVzc0xhYmVsOiBlbC5xdWVyeVNlbGVjdG9yICcuc2duLXBwX19wcm9ncmVzcy1sYWJlbCdcbiAgICAgICAgICAgIHByZXZDb250cm9sOiBlbC5xdWVyeVNlbGVjdG9yICcuc2duLXBwX19jb250cm9sW2RhdGEtZGlyZWN0aW9uPXByZXZdJ1xuICAgICAgICAgICAgbmV4dENvbnRyb2w6IGVsLnF1ZXJ5U2VsZWN0b3IgJy5zZ24tcHBfX2NvbnRyb2xbZGF0YS1kaXJlY3Rpb249bmV4dF0nXG5cbiAgICAgICAgQGtleURvd25MaXN0ZW5lciA9IFNHTi51dGlsLnRocm90dGxlIEBrZXlEb3duLCAxNTAsIEBcbiAgICAgICAgQG1vdXNlTW92ZUxpc3RlbmVyID0gU0dOLnV0aWwudGhyb3R0bGUgQG1vdXNlTW92ZSwgNTAsIEBcblxuICAgICAgICBAZWxzLnJvb3QuYWRkRXZlbnRMaXN0ZW5lciAna2V5ZG93bicsIEBrZXlEb3duTGlzdGVuZXIsIGZhbHNlIGlmIEBvcHRpb25zLmtleWJvYXJkIGlzIHRydWVcbiAgICAgICAgQGVscy5yb290LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsIEBtb3VzZU1vdmVMaXN0ZW5lciwgZmFsc2VcbiAgICAgICAgQGVscy5wcmV2Q29udHJvbC5hZGRFdmVudExpc3RlbmVyICdjbGljaycsIEBwcmV2Q2xpY2tlZC5iaW5kKEApLCBmYWxzZSBpZiBAZWxzLnByZXZDb250cm9sP1xuICAgICAgICBAZWxzLm5leHRDb250cm9sLmFkZEV2ZW50TGlzdGVuZXIgJ2NsaWNrJywgQG5leHRDbGlja2VkLmJpbmQoQCksIGZhbHNlIGlmIEBlbHMubmV4dENvbnRyb2w/XG5cbiAgICAgICAgQGJpbmQgJ2JlZm9yZU5hdmlnYXRpb24nLCBAYmVmb3JlTmF2aWdhdGlvbi5iaW5kKEApXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBkZXN0cm95OiAtPlxuICAgICAgICBAZWxzLnJvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lciAna2V5ZG93bicsIEBrZXlEb3duTGlzdGVuZXJcbiAgICAgICAgQGVscy5yb290LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsIEBtb3VzZU1vdmVMaXN0ZW5lclxuXG4gICAgICAgIHJldHVyblxuXG4gICAgYmVmb3JlTmF2aWdhdGlvbjogKGUpIC0+XG4gICAgICAgIHNob3dQcm9ncmVzcyA9IHR5cGVvZiBlLnByb2dyZXNzTGFiZWwgaXMgJ3N0cmluZycgYW5kIGUucHJvZ3Jlc3NMYWJlbC5sZW5ndGggPiAwXG4gICAgICAgIHZpc2liaWxpdHlDbGFzc05hbWUgPSAnc2duLXBwLS1oaWRkZW4nXG5cbiAgICAgICAgaWYgQGVscy5wcm9ncmVzcz8gYW5kIEBlbHMucHJvZ3Jlc3NCYXI/XG4gICAgICAgICAgICBAZWxzLnByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCIje2UucHJvZ3Jlc3N9JVwiXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIHNob3dQcm9ncmVzcyBpcyB0cnVlXG4gICAgICAgICAgICAgICAgQGVscy5wcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlIHZpc2liaWxpdHlDbGFzc05hbWVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAZWxzLnByb2dyZXNzLmNsYXNzTGlzdC5hZGQgdmlzaWJpbGl0eUNsYXNzTmFtZVxuXG4gICAgICAgIGlmIEBlbHMucHJvZ3Jlc3NMYWJlbD9cbiAgICAgICAgICAgIGlmIHNob3dQcm9ncmVzcyBpcyB0cnVlXG4gICAgICAgICAgICAgICAgQGVscy5wcm9ncmVzc0xhYmVsLnRleHRDb250ZW50ID0gZS5wcm9ncmVzc0xhYmVsXG4gICAgICAgICAgICAgICAgQGVscy5wcm9ncmVzc0xhYmVsLmNsYXNzTGlzdC5yZW1vdmUgdmlzaWJpbGl0eUNsYXNzTmFtZVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBlbHMucHJvZ3Jlc3NMYWJlbC5jbGFzc0xpc3QuYWRkIHZpc2liaWxpdHlDbGFzc05hbWVcblxuICAgICAgICBpZiBAZWxzLnByZXZDb250cm9sP1xuICAgICAgICAgICAgaWYgZS52ZXJzby5uZXdQb3NpdGlvbiBpcyAwXG4gICAgICAgICAgICAgICAgQGVscy5wcmV2Q29udHJvbC5jbGFzc0xpc3QuYWRkIHZpc2liaWxpdHlDbGFzc05hbWVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAZWxzLnByZXZDb250cm9sLmNsYXNzTGlzdC5yZW1vdmUgdmlzaWJpbGl0eUNsYXNzTmFtZVxuXG4gICAgICAgIGlmIEBlbHMubmV4dENvbnRyb2w/XG4gICAgICAgICAgICBpZiBlLnZlcnNvLm5ld1Bvc2l0aW9uIGlzIGUucGFnZVNwcmVhZENvdW50IC0gMVxuICAgICAgICAgICAgICAgIEBlbHMubmV4dENvbnRyb2wuY2xhc3NMaXN0LmFkZCB2aXNpYmlsaXR5Q2xhc3NOYW1lXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGVscy5uZXh0Q29udHJvbC5jbGFzc0xpc3QucmVtb3ZlIHZpc2liaWxpdHlDbGFzc05hbWVcblxuICAgICAgICByZXR1cm5cblxuICAgIHByZXZDbGlja2VkOiAoZSkgLT5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgQHRyaWdnZXIgJ3ByZXYnXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBuZXh0Q2xpY2tlZDogKGUpIC0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIEB0cmlnZ2VyICduZXh0J1xuXG4gICAgICAgIHJldHVyblxuXG4gICAga2V5RG93bjogKGUpIC0+XG4gICAgICAgIGtleUNvZGUgPSBlLmtleUNvZGVcblxuICAgICAgICBpZiBrZXlDb2Rlcy5BUlJPV19MRUZUIGlzIGtleUNvZGVcbiAgICAgICAgICAgIEB0cmlnZ2VyICdwcmV2JywgZHVyYXRpb246IDBcbiAgICAgICAgZWxzZSBpZiBrZXlDb2Rlcy5BUlJPV19SSUdIVCBpcyBrZXlDb2RlIG9yIGtleUNvZGVzLlNQQUNFIGlzIGtleUNvZGVcbiAgICAgICAgICAgIEB0cmlnZ2VyICduZXh0JywgZHVyYXRpb246IDBcbiAgICAgICAgZWxzZSBpZiBrZXlDb2Rlcy5OVU1CRVJfT05FIGlzIGtleUNvZGVcbiAgICAgICAgICAgIEB0cmlnZ2VyICdmaXJzdCcsIGR1cmF0aW9uOiAwXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBtb3VzZU1vdmU6IC0+XG4gICAgICAgIEBlbHMucm9vdC5kYXRhc2V0Lm1vdXNlTW92aW5nID0gdHJ1ZVxuXG4gICAgICAgIGNsZWFyVGltZW91dCBAbW91c2VNb3ZlVGltZW91dFxuXG4gICAgICAgIEBtb3VzZU1vdmVUaW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgICAgICAgQGVscy5yb290LmRhdGFzZXQubW91c2VNb3ZpbmcgPSBmYWxzZVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgLCA0MDAwXG5cbiAgICAgICAgcmV0dXJuXG5cbk1pY3JvRXZlbnQubWl4aW4gUGFnZWRQdWJsaWNhdGlvbkNvbnRyb2xzXG5cbm1vZHVsZS5leHBvcnRzID0gUGFnZWRQdWJsaWNhdGlvbkNvbnRyb2xzXG4iLCJNaWNyb0V2ZW50ID0gcmVxdWlyZSAnbWljcm9ldmVudCdcblZlcnNvID0gcmVxdWlyZSAndmVyc28nXG5QYWdlU3ByZWFkcyA9IHJlcXVpcmUgJy4vcGFnZV9zcHJlYWRzJ1xuY2xpZW50TG9jYWxTdG9yYWdlID0gcmVxdWlyZSAnLi4vLi4vc3RvcmFnZS9jbGllbnRfbG9jYWwnXG5TR04gPSByZXF1aXJlICcuLi8uLi9zZ24nXG5cbmNsYXNzIFBhZ2VkUHVibGljYXRpb25Db3JlXG4gICAgZGVmYXVsdHM6XG4gICAgICAgIHBhZ2VzOiBbXVxuICAgICAgICBwYWdlU3ByZWFkV2lkdGg6IDEwMFxuICAgICAgICBwYWdlU3ByZWFkTWF4Wm9vbVNjYWxlOiA0XG4gICAgICAgIGlkbGVEZWxheTogMTAwMFxuICAgICAgICByZXNpemVEZWxheTogNDAwXG4gICAgICAgIGNvbG9yOiAnI2ZmZmZmZidcblxuICAgIGNvbnN0cnVjdG9yOiAoZWwsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICAgICAgQG9wdGlvbnMgPSBAbWFrZU9wdGlvbnMgb3B0aW9ucywgQGRlZmF1bHRzXG4gICAgICAgIEBwYWdlSWQgPSBAZ2V0T3B0aW9uKCdwYWdlSWQnKSA/IEBnZXRTYXZlZFBhZ2VJZCgpXG4gICAgICAgIEBlbHMgPVxuICAgICAgICAgICAgcm9vdDogZWxcbiAgICAgICAgICAgIHBhZ2VzOiBlbC5xdWVyeVNlbGVjdG9yICcuc2duLXBwX19wYWdlcydcbiAgICAgICAgICAgIHZlcnNvOiBlbC5xdWVyeVNlbGVjdG9yICcudmVyc28nXG4gICAgICAgIEBwYWdlTW9kZSA9IEBnZXRQYWdlTW9kZSgpXG4gICAgICAgIEBwYWdlU3ByZWFkcyA9IG5ldyBQYWdlU3ByZWFkc1xuICAgICAgICAgICAgcGFnZXM6IEBnZXRPcHRpb24gJ3BhZ2VzJ1xuICAgICAgICAgICAgbWF4Wm9vbVNjYWxlOiBAZ2V0T3B0aW9uICdwYWdlU3ByZWFkTWF4Wm9vbVNjYWxlJ1xuICAgICAgICAgICAgd2lkdGg6IEBnZXRPcHRpb24gJ3BhZ2VTcHJlYWRXaWR0aCdcblxuICAgICAgICBAcGFnZVNwcmVhZHMuYmluZCAncGFnZUxvYWRlZCcsIEBwYWdlTG9hZGVkLmJpbmQoQClcbiAgICAgICAgQHBhZ2VTcHJlYWRzLmJpbmQgJ3BhZ2VzTG9hZGVkJywgQHBhZ2VzTG9hZGVkLmJpbmQoQClcblxuICAgICAgICBAc2V0Q29sb3IgQGdldE9wdGlvbignY29sb3InKVxuXG4gICAgICAgICMgSXQncyBpbXBvcnRhbnQgdG8gaW5zZXJ0IHRoZSBwYWdlIHNwcmVhZHMgYmVmb3JlIGluc3RhbnRpYXRpbmcgVmVyc28uXG4gICAgICAgIEBlbHMucGFnZXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUgQHBhZ2VTcHJlYWRzLnVwZGF0ZShAcGFnZU1vZGUpLmdldEZyYWcoKSwgQGVscy5wYWdlc1xuXG4gICAgICAgIEB2ZXJzbyA9IEBjcmVhdGVWZXJzbygpXG5cbiAgICAgICAgQGJpbmQgJ3N0YXJ0ZWQnLCBAc3RhcnQuYmluZChAKVxuICAgICAgICBAYmluZCAnZGVzdHJveWVkJywgQGRlc3Ryb3kuYmluZChAKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgc3RhcnQ6IC0+XG4gICAgICAgIEBnZXRWZXJzbygpLnN0YXJ0KClcblxuICAgICAgICBAdmlzaWJpbGl0eUNoYW5nZUxpc3RlbmVyID0gQHZpc2liaWxpdHlDaGFuZ2UuYmluZCBAXG4gICAgICAgIEByZXNpemVMaXN0ZW5lciA9IFNHTi51dGlsLnRocm90dGxlIEByZXNpemUsIEBnZXRPcHRpb24oJ3Jlc2l6ZURlbGF5JyksIEBcbiAgICAgICAgQHVubG9hZExpc3RlbmVyID0gQHVubG9hZC5iaW5kIEBcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICd2aXNpYmlsaXR5Y2hhbmdlJywgQHZpc2liaWxpdHlDaGFuZ2VMaXN0ZW5lciwgZmFsc2VcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIEByZXNpemVMaXN0ZW5lciwgZmFsc2VcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ2JlZm9yZXVubG9hZCcsIEB1bmxvYWRMaXN0ZW5lciwgZmFsc2VcblxuICAgICAgICBAZWxzLnJvb3QuZGF0YXNldC5zdGFydGVkID0gJydcbiAgICAgICAgQGVscy5yb290LnNldEF0dHJpYnV0ZSAndGFiaW5kZXgnLCAnLTEnXG4gICAgICAgIEBlbHMucm9vdC5mb2N1cygpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBkZXN0cm95OiAtPlxuICAgICAgICBAZ2V0VmVyc28oKS5kZXN0cm95KClcblxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyICd2aXNpYmlsaXR5Y2hhbmdlJywgQHZpc2liaWxpdHlDaGFuZ2VMaXN0ZW5lciwgZmFsc2VcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIEByZXNpemVMaXN0ZW5lciwgZmFsc2VcblxuICAgICAgICByZXR1cm5cblxuICAgIG1ha2VPcHRpb25zOiAob3B0aW9ucywgZGVmYXVsdHMpIC0+XG4gICAgICAgIG9wdHMgPSB7fVxuXG4gICAgICAgIG9wdHNba2V5XSA9IG9wdGlvbnNba2V5XSA/IGRlZmF1bHRzW2tleV0gZm9yIGtleSwgdmFsdWUgb2Ygb3B0aW9uc1xuXG4gICAgICAgIG9wdHNcblxuICAgIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICAgICAgQG9wdGlvbnNba2V5XVxuXG4gICAgc2V0Q29sb3I6IChjb2xvcikgLT5cbiAgICAgICAgQGVscy5yb290LmRhdGFzZXQuY29sb3JCcmlnaHRuZXNzID0gU0dOLnV0aWwuZ2V0Q29sb3JCcmlnaHRuZXNzIGNvbG9yXG4gICAgICAgIEBlbHMucm9vdC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvclxuXG4gICAgICAgIHJldHVyblxuXG4gICAgY3JlYXRlVmVyc286IC0+XG4gICAgICAgIHZlcnNvID0gbmV3IFZlcnNvIEBlbHMudmVyc28sIHBhZ2VJZDogQHBhZ2VJZFxuXG4gICAgICAgIHZlcnNvLnBhZ2VTcHJlYWRzLmZvckVhY2ggKHBhZ2VTcHJlYWQpID0+XG4gICAgICAgICAgICBpZiBwYWdlU3ByZWFkLmdldFR5cGUoKSBpcyAncGFnZSdcbiAgICAgICAgICAgICAgICBwYWdlU3ByZWFkLmdldENvbnRlbnRSZWN0ID0gPT4gQGdldENvbnRlbnRSZWN0IHBhZ2VTcHJlYWRcblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgdmVyc28uYmluZCAnYmVmb3JlTmF2aWdhdGlvbicsIEBiZWZvcmVOYXZpZ2F0aW9uLmJpbmQoQClcbiAgICAgICAgdmVyc28uYmluZCAnYWZ0ZXJOYXZpZ2F0aW9uJywgQGFmdGVyTmF2aWdhdGlvbi5iaW5kKEApXG4gICAgICAgIHZlcnNvLmJpbmQgJ2F0dGVtcHRlZE5hdmlnYXRpb24nLCBAYXR0ZW1wdGVkTmF2aWdhdGlvbi5iaW5kKEApXG4gICAgICAgIHZlcnNvLmJpbmQgJ2NsaWNrZWQnLCBAY2xpY2tlZC5iaW5kKEApXG4gICAgICAgIHZlcnNvLmJpbmQgJ2RvdWJsZUNsaWNrZWQnLCBAZG91YmxlQ2xpY2tlZC5iaW5kKEApXG4gICAgICAgIHZlcnNvLmJpbmQgJ3ByZXNzZWQnLCBAcHJlc3NlZC5iaW5kKEApXG4gICAgICAgIHZlcnNvLmJpbmQgJ3BhblN0YXJ0JywgQHBhblN0YXJ0LmJpbmQoQClcbiAgICAgICAgdmVyc28uYmluZCAncGFuRW5kJywgQHBhbkVuZC5iaW5kKEApXG4gICAgICAgIHZlcnNvLmJpbmQgJ3pvb21lZEluJywgQHpvb21lZEluLmJpbmQoQClcbiAgICAgICAgdmVyc28uYmluZCAnem9vbWVkT3V0JywgQHpvb21lZE91dC5iaW5kKEApXG5cbiAgICAgICAgdmVyc29cblxuICAgIGdldFZlcnNvOiAtPlxuICAgICAgICBAdmVyc29cblxuICAgIGdldENvbnRlbnRSZWN0OiAocGFnZVNwcmVhZCkgLT5cbiAgICAgICAgcmVjdCA9XG4gICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgIHJpZ2h0OiAwXG4gICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICAgIHdpZHRoOiAwXG4gICAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgcGFnZUVscyA9IHBhZ2VTcHJlYWQuZ2V0UGFnZUVscygpXG4gICAgICAgIHBhZ2VFbCA9IHBhZ2VFbHNbMF1cbiAgICAgICAgcGFnZUNvdW50ID0gcGFnZUVscy5sZW5ndGhcbiAgICAgICAgc2NhbGUgPSBAZ2V0VmVyc28oKS50cmFuc2Zvcm0uc2NhbGVcbiAgICAgICAgcGFnZVdpZHRoID0gcGFnZUVsLm9mZnNldFdpZHRoICogcGFnZUNvdW50ICogc2NhbGVcbiAgICAgICAgcGFnZUhlaWdodCA9IHBhZ2VFbC5vZmZzZXRIZWlnaHQgKiBzY2FsZVxuICAgICAgICBpbWFnZVJhdGlvID0gK3BhZ2VFbC5kYXRhc2V0LmhlaWdodCAvICgrcGFnZUVsLmRhdGFzZXQud2lkdGggKiBwYWdlQ291bnQpXG4gICAgICAgIGFjdHVhbEhlaWdodCA9IHBhZ2VIZWlnaHRcbiAgICAgICAgYWN0dWFsV2lkdGggPSBhY3R1YWxIZWlnaHQgLyBpbWFnZVJhdGlvXG4gICAgICAgIGFjdHVhbFdpZHRoID0gTWF0aC5taW4gcGFnZVdpZHRoLCBhY3R1YWxXaWR0aFxuICAgICAgICBhY3R1YWxIZWlnaHQgPSBhY3R1YWxXaWR0aCAqIGltYWdlUmF0aW9cbiAgICAgICAgY2xpZW50UmVjdCA9IHBhZ2VFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICAgIHJlY3Qud2lkdGggPSBhY3R1YWxXaWR0aFxuICAgICAgICByZWN0LmhlaWdodCA9IGFjdHVhbEhlaWdodFxuICAgICAgICByZWN0LnRvcCA9IGNsaWVudFJlY3QudG9wICsgKHBhZ2VIZWlnaHQgLSBhY3R1YWxIZWlnaHQpIC8gMlxuICAgICAgICByZWN0LmxlZnQgPSBjbGllbnRSZWN0LmxlZnQgKyAocGFnZVdpZHRoIC0gYWN0dWFsV2lkdGgpIC8gMlxuICAgICAgICByZWN0LnJpZ2h0ID0gcmVjdC53aWR0aCArIHJlY3QubGVmdFxuICAgICAgICByZWN0LmJvdHRvbSA9IHJlY3QuaGVpZ2h0ICsgcmVjdC50b3BcblxuICAgICAgICByZWN0XG5cbiAgICBmb3JtYXRQcm9ncmVzc0xhYmVsOiAocGFnZVNwcmVhZCkgLT5cbiAgICAgICAgcGFnZXMgPSBwYWdlU3ByZWFkPy5vcHRpb25zLnBhZ2VzID8gW11cbiAgICAgICAgcGFnZUlkcyA9IHBhZ2VzLm1hcCAocGFnZSkgLT4gcGFnZS5pZFxuICAgICAgICBwYWdlTGFiZWxzID0gcGFnZXMubWFwIChwYWdlKSAtPiBwYWdlLmxhYmVsXG4gICAgICAgIHBhZ2VDb3VudCA9IEBnZXRPcHRpb24oJ3BhZ2VzJykubGVuZ3RoXG4gICAgICAgIGxhYmVsID0gaWYgcGFnZUlkcy5sZW5ndGggPiAwIHRoZW4gcGFnZUxhYmVscy5qb2luKCctJykgKyAnIC8gJyArIHBhZ2VDb3VudCBlbHNlIG51bGxcblxuICAgICAgICBsYWJlbFxuXG4gICAgcmVuZGVyUGFnZVNwcmVhZHM6IC0+XG4gICAgICAgIEBnZXRWZXJzbygpLnBhZ2VTcHJlYWRzLmZvckVhY2ggKHBhZ2VTcHJlYWQpID0+XG4gICAgICAgICAgICB2aXNpYmlsaXR5ID0gcGFnZVNwcmVhZC5nZXRWaXNpYmlsaXR5KClcbiAgICAgICAgICAgIG1hdGNoID0gQHBhZ2VTcHJlYWRzLmdldCBwYWdlU3ByZWFkLmdldElkKClcblxuICAgICAgICAgICAgaWYgbWF0Y2g/XG4gICAgICAgICAgICAgICAgaWYgdmlzaWJpbGl0eSBpcyAndmlzaWJsZScgYW5kIG1hdGNoLmNvbnRlbnRzUmVuZGVyZWQgaXMgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCBtYXRjaC5yZW5kZXJDb250ZW50cy5iaW5kKG1hdGNoKSwgMFxuICAgICAgICAgICAgICAgIGlmIHZpc2liaWxpdHkgaXMgJ2dvbmUnIGFuZCBtYXRjaC5jb250ZW50c1JlbmRlcmVkIGlzIHRydWVcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCBtYXRjaC5jbGVhckNvbnRlbnRzLmJpbmQobWF0Y2gpLCAwXG5cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIEBcblxuICAgIGZpbmRQYWdlOiAocGFnZUlkKSAtPlxuICAgICAgICBAZ2V0T3B0aW9uKCdwYWdlcycpLmZpbmQgKHBhZ2UpIC0+IHBhZ2UuaWQgaXMgcGFnZUlkXG5cbiAgICBnZXRTYXZlZFBhZ2VJZDogLT5cbiAgICAgICAgaWQgPSBAZ2V0T3B0aW9uICdpZCdcbiAgICAgICAgXG4gICAgICAgIGNsaWVudExvY2FsU3RvcmFnZS5nZXQgXCJwYWdlZC1wdWJsaWNhdGlvbi1wcm9ncmVzcy0je2lkfVwiXG5cbiAgICBzYXZlQ3VycmVudFBhZ2VJZDogKHBhZ2VJZCkgLT5cbiAgICAgICAgaWQgPSBAZ2V0T3B0aW9uICdpZCdcblxuICAgICAgICBjbGllbnRMb2NhbFN0b3JhZ2Uuc2V0IFwicGFnZWQtcHVibGljYXRpb24tcHJvZ3Jlc3MtI3tpZH1cIiwgcGFnZUlkXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBwYWdlTG9hZGVkOiAoZSkgLT5cbiAgICAgICAgQHRyaWdnZXIgJ3BhZ2VMb2FkZWQnLCBlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBwYWdlc0xvYWRlZDogKGUpIC0+XG4gICAgICAgIEB0cmlnZ2VyICdwYWdlc0xvYWRlZCcsIGVcblxuICAgICAgICByZXR1cm5cblxuICAgIGJlZm9yZU5hdmlnYXRpb246IChlKSAtPlxuICAgICAgICBwb3NpdGlvbiA9IGUubmV3UG9zaXRpb25cbiAgICAgICAgdmVyc29QYWdlU3ByZWFkID0gQGdldFZlcnNvKCkuZ2V0UGFnZVNwcmVhZEZyb21Qb3NpdGlvbiBwb3NpdGlvblxuICAgICAgICBwYWdlU3ByZWFkID0gQHBhZ2VTcHJlYWRzLmdldCB2ZXJzb1BhZ2VTcHJlYWQuZ2V0SWQoKVxuICAgICAgICBwYWdlU3ByZWFkQ291bnQgPSBAZ2V0VmVyc28oKS5nZXRQYWdlU3ByZWFkQ291bnQoKVxuICAgICAgICBwcm9ncmVzcyA9IChwb3NpdGlvbiArIDEpIC8gcGFnZVNwcmVhZENvdW50ICogMTAwXG4gICAgICAgIHByb2dyZXNzTGFiZWwgPSBAZm9ybWF0UHJvZ3Jlc3NMYWJlbCBwYWdlU3ByZWFkXG5cbiAgICAgICAgQHJlbmRlclBhZ2VTcHJlYWRzKClcbiAgICAgICAgQHNhdmVDdXJyZW50UGFnZUlkIHZlcnNvUGFnZVNwcmVhZC5nZXRQYWdlSWRzKClbMF1cbiAgICAgICAgQHJlc2V0SWRsZVRpbWVyKClcbiAgICAgICAgQHN0YXJ0SWRsZVRpbWVyKClcbiAgICAgICAgQHRyaWdnZXIgJ2JlZm9yZU5hdmlnYXRpb24nLFxuICAgICAgICAgICAgdmVyc286IGVcbiAgICAgICAgICAgIHBhZ2VTcHJlYWQ6IHBhZ2VTcHJlYWRcbiAgICAgICAgICAgIHByb2dyZXNzOiBwcm9ncmVzc1xuICAgICAgICAgICAgcHJvZ3Jlc3NMYWJlbDogcHJvZ3Jlc3NMYWJlbFxuICAgICAgICAgICAgcGFnZVNwcmVhZENvdW50OiBwYWdlU3ByZWFkQ291bnRcblxuICAgICAgICByZXR1cm5cblxuICAgIGFmdGVyTmF2aWdhdGlvbjogKGUpIC0+XG4gICAgICAgIHBvc2l0aW9uID0gZS5uZXdQb3NpdGlvblxuICAgICAgICB2ZXJzb1BhZ2VTcHJlYWQgPSBAZ2V0VmVyc28oKS5nZXRQYWdlU3ByZWFkRnJvbVBvc2l0aW9uIHBvc2l0aW9uXG4gICAgICAgIHBhZ2VTcHJlYWQgPSBAcGFnZVNwcmVhZHMuZ2V0IHZlcnNvUGFnZVNwcmVhZC5nZXRJZCgpXG5cbiAgICAgICAgQHRyaWdnZXIgJ2FmdGVyTmF2aWdhdGlvbicsXG4gICAgICAgICAgICB2ZXJzbzogZVxuICAgICAgICAgICAgcGFnZVNwcmVhZDogcGFnZVNwcmVhZFxuXG4gICAgICAgIHJldHVyblxuXG4gICAgYXR0ZW1wdGVkTmF2aWdhdGlvbjogKGUpIC0+XG4gICAgICAgIEB0cmlnZ2VyICdhdHRlbXB0ZWROYXZpZ2F0aW9uJywgdmVyc286IGVcblxuICAgICAgICByZXR1cm5cblxuICAgIGNsaWNrZWQ6IChlKSAtPlxuICAgICAgICBpZiBlLmlzSW5zaWRlQ29udGVudFxuICAgICAgICAgICAgcGFnZUlkID0gZS5wYWdlRWwuZGF0YXNldC5pZFxuICAgICAgICAgICAgcGFnZSA9IEBmaW5kUGFnZSBwYWdlSWRcblxuICAgICAgICAgICAgQHRyaWdnZXIgJ2NsaWNrZWQnLCB2ZXJzbzogZSwgcGFnZTogcGFnZVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZG91YmxlQ2xpY2tlZDogKGUpIC0+XG4gICAgICAgIGlmIGUuaXNJbnNpZGVDb250ZW50XG4gICAgICAgICAgICBwYWdlSWQgPSBlLnBhZ2VFbC5kYXRhc2V0LmlkXG4gICAgICAgICAgICBwYWdlID0gQGZpbmRQYWdlIHBhZ2VJZFxuXG4gICAgICAgICAgICBAdHJpZ2dlciAnZG91YmxlQ2xpY2tlZCcsIHZlcnNvOiBlLCBwYWdlOiBwYWdlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBwcmVzc2VkOiAoZSkgLT5cbiAgICAgICAgaWYgZS5pc0luc2lkZUNvbnRlbnRcbiAgICAgICAgICAgIHBhZ2VJZCA9IGUucGFnZUVsLmRhdGFzZXQuaWRcbiAgICAgICAgICAgIHBhZ2UgPSBAZmluZFBhZ2UgcGFnZUlkXG5cbiAgICAgICAgICAgIEB0cmlnZ2VyICdwcmVzc2VkJywgdmVyc286IGUsIHBhZ2U6IHBhZ2VcblxuICAgICAgICByZXR1cm5cblxuICAgIHBhblN0YXJ0OiAtPlxuICAgICAgICBAcmVzZXRJZGxlVGltZXIoKVxuICAgICAgICBAdHJpZ2dlciAncGFuU3RhcnQnLCBzY2FsZTogQGdldFZlcnNvKCkudHJhbnNmb3JtLnNjYWxlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBwYW5FbmQ6IC0+XG4gICAgICAgIEBzdGFydElkbGVUaW1lcigpXG4gICAgICAgIEB0cmlnZ2VyICdwYW5FbmQnXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICB6b29tZWRJbjogKGUpIC0+XG4gICAgICAgIHBvc2l0aW9uID0gZS5wb3NpdGlvblxuICAgICAgICB2ZXJzb1BhZ2VTcHJlYWQgPSBAZ2V0VmVyc28oKS5nZXRQYWdlU3ByZWFkRnJvbVBvc2l0aW9uIHBvc2l0aW9uXG4gICAgICAgIHBhZ2VTcHJlYWQgPSBAcGFnZVNwcmVhZHMuZ2V0IHZlcnNvUGFnZVNwcmVhZC5nZXRJZCgpXG5cbiAgICAgICAgcGFnZVNwcmVhZC56b29tSW4oKSBpZiBwYWdlU3ByZWFkP1xuXG4gICAgICAgIEBlbHMucm9vdC5kYXRhc2V0Lnpvb21lZEluID0gdHJ1ZVxuICAgICAgICBAdHJpZ2dlciAnem9vbWVkSW4nLCB2ZXJzbzogZSwgcGFnZVNwcmVhZDogcGFnZVNwcmVhZFxuXG4gICAgICAgIHJldHVyblxuXG4gICAgem9vbWVkT3V0OiAoZSkgLT5cbiAgICAgICAgcG9zaXRpb24gPSBlLnBvc2l0aW9uXG4gICAgICAgIHZlcnNvUGFnZVNwcmVhZCA9IEBnZXRWZXJzbygpLmdldFBhZ2VTcHJlYWRGcm9tUG9zaXRpb24gcG9zaXRpb25cbiAgICAgICAgcGFnZVNwcmVhZCA9IEBwYWdlU3ByZWFkcy5nZXQgdmVyc29QYWdlU3ByZWFkLmdldElkKClcblxuICAgICAgICBwYWdlU3ByZWFkLnpvb21PdXQoKSBpZiBwYWdlU3ByZWFkP1xuXG4gICAgICAgIEBlbHMucm9vdC5kYXRhc2V0Lnpvb21lZEluID0gZmFsc2VcbiAgICAgICAgQHRyaWdnZXIgJ3pvb21lZE91dCcsIHZlcnNvOiBlLCBwYWdlU3ByZWFkOiBwYWdlU3ByZWFkXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBnZXRQYWdlTW9kZTogLT5cbiAgICAgICAgcGFnZU1vZGUgPSBAZ2V0T3B0aW9uICdwYWdlTW9kZSdcblxuICAgICAgICBpZiBub3QgcGFnZU1vZGU/XG4gICAgICAgICAgICB3aWR0aCA9IEBlbHMucm9vdC5vZmZzZXRXaWR0aFxuICAgICAgICAgICAgaGVpZ2h0ID0gQGVscy5yb290Lm9mZnNldEhlaWdodFxuICAgICAgICAgICAgcmF0aW8gPSBoZWlnaHQgLyB3aWR0aFxuXG4gICAgICAgICAgICBwYWdlTW9kZSA9IGlmIHJhdGlvID49IDAuNzUgdGhlbiAnc2luZ2xlJyBlbHNlICdkb3VibGUnXG5cbiAgICAgICAgcGFnZU1vZGVcblxuICAgIHJlc2V0SWRsZVRpbWVyOiAtPlxuICAgICAgICBjbGVhclRpbWVvdXQgQGlkbGVUaW1lb3V0XG5cbiAgICAgICAgQGVscy5yb290LmRhdGFzZXQuaWRsZSA9IGZhbHNlXG5cbiAgICAgICAgQFxuXG4gICAgc3RhcnRJZGxlVGltZXI6IC0+XG4gICAgICAgIEBpZGxlVGltZW91dCA9IHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgIEBlbHMucm9vdC5kYXRhc2V0LmlkbGUgPSB0cnVlXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAsIEBnZXRPcHRpb24oJ2lkbGVEZWxheScpXG5cbiAgICAgICAgQFxuXG4gICAgc3dpdGNoUGFnZU1vZGU6IChwYWdlTW9kZSkgLT5cbiAgICAgICAgcmV0dXJuIEAgaWYgQHBhZ2VNb2RlIGlzIHBhZ2VNb2RlXG5cbiAgICAgICAgdmVyc28gPSBAZ2V0VmVyc28oKVxuICAgICAgICBwYWdlSWRzID0gdmVyc28uZ2V0UGFnZVNwcmVhZEZyb21Qb3NpdGlvbih2ZXJzby5nZXRQb3NpdGlvbigpKS5nZXRQYWdlSWRzKClcbiAgICAgICAgcGFnZVNwcmVhZEVscyA9IEBnZXRWZXJzbygpLmVsLnF1ZXJ5U2VsZWN0b3JBbGwgJy5zZ24tcHBfX3BhZ2Utc3ByZWFkJ1xuXG4gICAgICAgIEBwYWdlTW9kZSA9IHBhZ2VNb2RlXG5cbiAgICAgICAgQHBhZ2VTcHJlYWRzLnVwZGF0ZSBAcGFnZU1vZGVcblxuICAgICAgICBwYWdlU3ByZWFkRWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCBwYWdlU3ByZWFkRWwgZm9yIHBhZ2VTcHJlYWRFbCBpbiBwYWdlU3ByZWFkRWxzXG4gICAgICAgIEBlbHMucGFnZXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUgQHBhZ2VTcHJlYWRzLmdldEZyYWcoKSwgQGVscy5wYWdlc1xuICAgICAgICBcbiAgICAgICAgdmVyc28ucmVmcmVzaCgpXG4gICAgICAgIHZlcnNvLm5hdmlnYXRlVG8gdmVyc28uZ2V0UGFnZVNwcmVhZFBvc2l0aW9uRnJvbVBhZ2VJZChwYWdlSWRzWzBdKSwgZHVyYXRpb246IDBcblxuICAgICAgICBAXG5cbiAgICB2aXNpYmlsaXR5Q2hhbmdlOiAtPlxuICAgICAgICBwYWdlU3ByZWFkID0gQGdldFZlcnNvKCkuZ2V0UGFnZVNwcmVhZEZyb21Qb3NpdGlvbiBAZ2V0VmVyc28oKS5nZXRQb3NpdGlvbigpXG4gICAgICAgIGV2ZW50TmFtZSA9IGlmIGRvY3VtZW50LmhpZGRlbiBpcyB0cnVlIHRoZW4gJ2Rpc2FwcGVhcmVkJyBlbHNlICdhcHBlYXJlZCdcblxuICAgICAgICBAdHJpZ2dlciBldmVudE5hbWUsIHBhZ2VTcHJlYWQ6IEBwYWdlU3ByZWFkcy5nZXQocGFnZVNwcmVhZC5pZClcblxuICAgICAgICByZXR1cm5cblxuICAgIHJlc2l6ZTogLT5cbiAgICAgICAgQHN3aXRjaFBhZ2VNb2RlIEBnZXRQYWdlTW9kZSgpIGlmIG5vdCBAZ2V0T3B0aW9uKCdwYWdlTW9kZScpP1xuXG4gICAgICAgIEB0cmlnZ2VyICdyZXNpemVkJ1xuXG4gICAgICAgIHJldHVyblxuXG4gICAgdW5sb2FkOiAtPlxuICAgICAgICBAdHJpZ2dlciAnZGlzYXBwZWFyZWQnXG5cbiAgICAgICAgcmV0dXJuXG5cbk1pY3JvRXZlbnQubWl4aW4gUGFnZWRQdWJsaWNhdGlvbkNvcmVcblxubW9kdWxlLmV4cG9ydHMgPSBQYWdlZFB1YmxpY2F0aW9uQ29yZVxuIiwiTWljcm9FdmVudCA9IHJlcXVpcmUgJ21pY3JvZXZlbnQnXG5cbmNsYXNzIFBhZ2VkUHVibGljYXRpb25FdmVudFRyYWNraW5nXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgIEBoaWRkZW4gPSB0cnVlXG4gICAgICAgIEBwYWdlU3ByZWFkID0gbnVsbFxuXG4gICAgICAgIEBiaW5kICdhcHBlYXJlZCcsIEBhcHBlYXJlZC5iaW5kKEApXG4gICAgICAgIEBiaW5kICdkaXNhcHBlYXJlZCcsIEBkaXNhcHBlYXJlZC5iaW5kKEApXG4gICAgICAgIEBiaW5kICdiZWZvcmVOYXZpZ2F0aW9uJywgQGJlZm9yZU5hdmlnYXRpb24uYmluZChAKVxuICAgICAgICBAYmluZCAnYWZ0ZXJOYXZpZ2F0aW9uJywgQGFmdGVyTmF2aWdhdGlvbi5iaW5kKEApXG4gICAgICAgIEBiaW5kICdhdHRlbXB0ZWROYXZpZ2F0aW9uJywgQGF0dGVtcHRlZE5hdmlnYXRpb24uYmluZChAKVxuICAgICAgICBAYmluZCAnY2xpY2tlZCcsIEBjbGlja2VkLmJpbmQoQClcbiAgICAgICAgQGJpbmQgJ2RvdWJsZUNsaWNrZWQnLCBAZG91YmxlQ2xpY2tlZC5iaW5kKEApXG4gICAgICAgIEBiaW5kICdwcmVzc2VkJywgQHByZXNzZWQuYmluZChAKVxuICAgICAgICBAYmluZCAncGFuU3RhcnQnLCBAcGFuU3RhcnQuYmluZChAKVxuICAgICAgICBAYmluZCAnem9vbWVkSW4nLCBAem9vbWVkSW4uYmluZChAKVxuICAgICAgICBAYmluZCAnem9vbWVkT3V0JywgQHpvb21lZE91dC5iaW5kKEApXG4gICAgICAgIEBiaW5kICdkZXN0cm95ZWQnLCBAZGVzdHJveS5iaW5kKEApXG5cbiAgICAgICAgQHRyYWNrT3BlbmVkKClcbiAgICAgICAgQHRyYWNrQXBwZWFyZWQoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZGVzdHJveTogLT5cbiAgICAgICAgQHBhZ2VTcHJlYWREaXNhcHBlYXJlZCgpXG4gICAgICAgIEB0cmFja0Rpc2FwcGVhcmVkKClcblxuICAgICAgICByZXR1cm5cblxuICAgIHRyYWNrRXZlbnQ6ICh0eXBlLCBwcm9wZXJ0aWVzID0ge30pIC0+XG4gICAgICAgIEB0cmlnZ2VyICd0cmFja0V2ZW50JywgdHlwZTogdHlwZSwgcHJvcGVydGllczogcHJvcGVydGllc1xuXG4gICAgICAgIHJldHVyblxuXG4gICAgdHJhY2tPcGVuZWQ6IChwcm9wZXJ0aWVzKSAtPlxuICAgICAgICBAdHJhY2tFdmVudCAncGFnZWQtcHVibGljYXRpb24tb3BlbmVkJywgcHJvcGVydGllc1xuXG4gICAgICAgIEBcblxuICAgIHRyYWNrQXBwZWFyZWQ6IChwcm9wZXJ0aWVzKSAtPlxuICAgICAgICBAdHJhY2tFdmVudCAncGFnZWQtcHVibGljYXRpb24tYXBwZWFyZWQnLCBwcm9wZXJ0aWVzXG5cbiAgICAgICAgQFxuXG4gICAgdHJhY2tEaXNhcHBlYXJlZDogKHByb3BlcnRpZXMpIC0+XG4gICAgICAgIEB0cmFja0V2ZW50ICdwYWdlZC1wdWJsaWNhdGlvbi1kaXNhcHBlYXJlZCcsIHByb3BlcnRpZXNcblxuICAgICAgICBAXG5cbiAgICB0cmFja1BhZ2VDbGlja2VkOiAocHJvcGVydGllcykgLT5cbiAgICAgICAgQHRyYWNrRXZlbnQgJ3BhZ2VkLXB1YmxpY2F0aW9uLXBhZ2UtY2xpY2tlZCcsIHByb3BlcnRpZXNcblxuICAgICAgICBAXG5cbiAgICB0cmFja1BhZ2VEb3VibGVDbGlja2VkOiAocHJvcGVydGllcykgLT5cbiAgICAgICAgQHRyYWNrRXZlbnQgJ3BhZ2VkLXB1YmxpY2F0aW9uLXBhZ2UtZG91YmxlLWNsaWNrZWQnLCBwcm9wZXJ0aWVzXG5cbiAgICAgICAgQFxuXG4gICAgdHJhY2tQYWdlTG9uZ1ByZXNzZWQ6IChwcm9wZXJ0aWVzKSAtPlxuICAgICAgICBAdHJhY2tFdmVudCAncGFnZWQtcHVibGljYXRpb24tcGFnZS1sb25nLXByZXNzZWQnLCBwcm9wZXJ0aWVzXG5cbiAgICAgICAgQFxuXG4gICAgdHJhY2tQYWdlSG90c3BvdHNDbGlja2VkOiAocHJvcGVydGllcykgLT5cbiAgICAgICAgQHRyYWNrRXZlbnQgJ3BhZ2VkLXB1YmxpY2F0aW9uLXBhZ2UtaG90c3BvdHMtY2xpY2tlZCcsIHByb3BlcnRpZXNcblxuICAgICAgICBAXG5cbiAgICB0cmFja1BhZ2VTcHJlYWRBcHBlYXJlZDogKHByb3BlcnRpZXMpIC0+XG4gICAgICAgIEB0cmFja0V2ZW50ICdwYWdlZC1wdWJsaWNhdGlvbi1wYWdlLXNwcmVhZC1hcHBlYXJlZCcsIHByb3BlcnRpZXNcblxuICAgICAgICBAXG5cbiAgICB0cmFja1BhZ2VTcHJlYWREaXNhcHBlYXJlZDogKHByb3BlcnRpZXMpIC0+XG4gICAgICAgIEB0cmFja0V2ZW50ICdwYWdlZC1wdWJsaWNhdGlvbi1wYWdlLXNwcmVhZC1kaXNhcHBlYXJlZCcsIHByb3BlcnRpZXNcblxuICAgICAgICBAXG5cbiAgICB0cmFja1BhZ2VTcHJlYWRab29tZWRJbjogKHByb3BlcnRpZXMpIC0+XG4gICAgICAgIEB0cmFja0V2ZW50ICdwYWdlZC1wdWJsaWNhdGlvbi1wYWdlLXNwcmVhZC16b29tZWQtaW4nLCBwcm9wZXJ0aWVzXG5cbiAgICAgICAgQFxuXG4gICAgdHJhY2tQYWdlU3ByZWFkWm9vbWVkT3V0OiAocHJvcGVydGllcykgLT5cbiAgICAgICAgQHRyYWNrRXZlbnQgJ3BhZ2VkLXB1YmxpY2F0aW9uLXBhZ2Utc3ByZWFkLXpvb21lZC1vdXQnLCBwcm9wZXJ0aWVzXG5cbiAgICAgICAgQFxuXG4gICAgYXBwZWFyZWQ6IChlKSAtPlxuICAgICAgICBAdHJhY2tBcHBlYXJlZCgpXG4gICAgICAgIEBwYWdlU3ByZWFkQXBwZWFyZWQgZS5wYWdlU3ByZWFkXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBkaXNhcHBlYXJlZDogLT5cbiAgICAgICAgQHBhZ2VTcHJlYWREaXNhcHBlYXJlZCgpXG4gICAgICAgIEB0cmFja0Rpc2FwcGVhcmVkKClcblxuICAgICAgICByZXR1cm5cblxuICAgIGJlZm9yZU5hdmlnYXRpb246IC0+XG4gICAgICAgIEBwYWdlU3ByZWFkRGlzYXBwZWFyZWQoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgYWZ0ZXJOYXZpZ2F0aW9uOiAoZSkgLT5cbiAgICAgICAgQHBhZ2VTcHJlYWRBcHBlYXJlZCBlLnBhZ2VTcHJlYWRcblxuICAgICAgICByZXR1cm5cblxuICAgIGF0dGVtcHRlZE5hdmlnYXRpb246IChlKSAtPlxuICAgICAgICBAcGFnZVNwcmVhZEFwcGVhcmVkIGUucGFnZVNwcmVhZFxuXG4gICAgICAgIHJldHVyblxuXG4gICAgY2xpY2tlZDogKGUpIC0+XG4gICAgICAgIGlmIGUucGFnZT9cbiAgICAgICAgICAgIHByb3BlcnRpZXMgPVxuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXI6IGUucGFnZS5wYWdlTnVtYmVyXG4gICAgICAgICAgICAgICAgeDogZS52ZXJzby5wYWdlWFxuICAgICAgICAgICAgICAgIHk6IGUudmVyc28ucGFnZVlcblxuICAgICAgICAgICAgQHRyYWNrUGFnZUNsaWNrZWQgcGFnZWRQdWJsaWNhdGlvblBhZ2U6IHByb3BlcnRpZXNcbiAgICAgICAgICAgIEB0cmFja1BhZ2VIb3RzcG90c0NsaWNrZWQgcGFnZWRQdWJsaWNhdGlvblBhZ2U6IHByb3BlcnRpZXMgaWYgZS52ZXJzby5vdmVybGF5RWxzLmxlbmd0aCA+IDBcblxuICAgICAgICByZXR1cm5cblxuICAgIGRvdWJsZUNsaWNrZWQ6IChlKSA9PlxuICAgICAgICBpZiBlLnBhZ2U/XG4gICAgICAgICAgICBAdHJhY2tQYWdlRG91YmxlQ2xpY2tlZCBwYWdlZFB1YmxpY2F0aW9uUGFnZTpcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyOiBlLnBhZ2UucGFnZU51bWJlclxuICAgICAgICAgICAgICAgIHg6IGUudmVyc28ucGFnZVhcbiAgICAgICAgICAgICAgICB5OiBlLnZlcnNvLnBhZ2VZXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBwcmVzc2VkOiAoZSkgLT5cbiAgICAgICAgaWYgZS5wYWdlP1xuICAgICAgICAgICAgQHRyYWNrUGFnZUxvbmdQcmVzc2VkIHBhZ2VkUHVibGljYXRpb25QYWdlOlxuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXI6IGUucGFnZS5wYWdlTnVtYmVyXG4gICAgICAgICAgICAgICAgeDogZS52ZXJzby5wYWdlWFxuICAgICAgICAgICAgICAgIHk6IGUudmVyc28ucGFnZVlcblxuICAgICAgICByZXR1cm5cblxuICAgIHBhblN0YXJ0OiAoZSkgLT5cbiAgICAgICAgQHBhZ2VTcHJlYWREaXNhcHBlYXJlZCgpIGlmIGUuc2NhbGUgaXMgMVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgem9vbWVkSW46IChlKSAtPlxuICAgICAgICBpZiBlLnBhZ2VTcHJlYWQ/XG4gICAgICAgICAgICBAdHJhY2tQYWdlU3ByZWFkWm9vbWVkSW4gcGFnZWRQdWJsaWNhdGlvblBhZ2VTcHJlYWQ6XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlcnM6IGUucGFnZVNwcmVhZC5nZXRQYWdlcygpLm1hcCAocGFnZSkgLT4gcGFnZS5wYWdlTnVtYmVyXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICB6b29tZWRPdXQ6IChlKSAtPlxuICAgICAgICBpZiBlLnBhZ2VTcHJlYWQ/XG4gICAgICAgICAgICBAdHJhY2tQYWdlU3ByZWFkWm9vbWVkT3V0IHBhZ2VkUHVibGljYXRpb25QYWdlU3ByZWFkOlxuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXJzOiBlLnBhZ2VTcHJlYWQuZ2V0UGFnZXMoKS5tYXAgKHBhZ2UpIC0+IHBhZ2UucGFnZU51bWJlclxuXG4gICAgICAgIHJldHVyblxuXG4gICAgcGFnZVNwcmVhZEFwcGVhcmVkOiAocGFnZVNwcmVhZCkgLT5cbiAgICAgICAgaWYgcGFnZVNwcmVhZD8gYW5kIEBoaWRkZW4gaXMgdHJ1ZVxuICAgICAgICAgICAgQHBhZ2VTcHJlYWQgPSBwYWdlU3ByZWFkXG5cbiAgICAgICAgICAgIEB0cmFja1BhZ2VTcHJlYWRBcHBlYXJlZCBwYWdlZFB1YmxpY2F0aW9uUGFnZVNwcmVhZDpcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyczogcGFnZVNwcmVhZC5nZXRQYWdlcygpLm1hcCAocGFnZSkgLT4gcGFnZS5wYWdlTnVtYmVyXG5cbiAgICAgICAgICAgIEBoaWRkZW4gPSBmYWxzZVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgcGFnZVNwcmVhZERpc2FwcGVhcmVkOiAtPlxuICAgICAgICBpZiBAcGFnZVNwcmVhZD8gYW5kIEBoaWRkZW4gaXMgZmFsc2VcbiAgICAgICAgICAgIEB0cmFja1BhZ2VTcHJlYWREaXNhcHBlYXJlZCBwYWdlZFB1YmxpY2F0aW9uUGFnZVNwcmVhZDpcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyczogQHBhZ2VTcHJlYWQuZ2V0UGFnZXMoKS5tYXAgKHBhZ2UpIC0+IHBhZ2UucGFnZU51bWJlclxuXG4gICAgICAgICAgICBAaGlkZGVuID0gdHJ1ZVxuICAgICAgICAgICAgQHBhZ2VTcHJlYWQgPSBudWxsXG5cbiAgICAgICAgcmV0dXJuXG5cbk1pY3JvRXZlbnQubWl4aW4gUGFnZWRQdWJsaWNhdGlvbkV2ZW50VHJhY2tpbmdcblxubW9kdWxlLmV4cG9ydHMgPSBQYWdlZFB1YmxpY2F0aW9uRXZlbnRUcmFja2luZ1xuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYWdlZFB1YmxpY2F0aW9uSG90c3BvdFBpY2tlclxuICAgIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMgPSB7fSkgLT5cbiAgICAgICAgQGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuXG4gICAgICAgIEByZW5kZXIoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgcmVuZGVyOiAtPlxuICAgICAgICBAZWwuY2xhc3NOYW1lID0gJ3Nnbi1wcF9faG90c3BvdC1waWNrZXInXG4gICAgICAgIEBlbC5zdHlsZS50b3AgPSBcIiN7QG9wdGlvbnMueX1weFwiXG4gICAgICAgIEBlbC5zdHlsZS5sZWZ0ID0gXCIje0BvcHRpb25zLnh9cHhcIlxuXG4gICAgICAgIEBvcHRpb25zLmhvdHNwb3RzLmZvckVhY2ggKGhvdHNwb3QpID0+XG4gICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcblxuICAgICAgICAgICAgZWwudGV4dENvbnRlbnQgPSBob3RzcG90LnRpdGxlXG5cbiAgICAgICAgICAgIEBlbC5hcHBlbmRDaGlsZCBlbFxuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBAXG4iLCJNaWNyb0V2ZW50ID0gcmVxdWlyZSAnbWljcm9ldmVudCdcblxuY2xhc3MgUGFnZWRQdWJsaWNhdGlvbkhvdHNwb3RzXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgIEBjdXJyZW50UGFnZVNwcmVhZElkID0gbnVsbFxuICAgICAgICBAcGFnZVNwcmVhZHNMb2FkZWQgPSB7fVxuICAgICAgICBAY2FjaGUgPSB7fVxuXG4gICAgICAgIEBiaW5kICdob3RzcG90c1JlY2VpdmVkJywgQGhvdHNwb3RzUmVjZWl2ZWQuYmluZChAKVxuICAgICAgICBAYmluZCAnYWZ0ZXJOYXZpZ2F0aW9uJywgQGFmdGVyTmF2aWdhdGlvbi5iaW5kKEApXG4gICAgICAgIEBiaW5kICdwYWdlc0xvYWRlZCcsIEBwYWdlc0xvYWRlZC5iaW5kKEApXG4gICAgICAgIEBiaW5kICdyZXNpemVkJywgQHJlc2l6ZWQuYmluZChAKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgcmVuZGVySG90c3BvdHM6IChkYXRhKSAtPlxuICAgICAgICBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgICAgIGNvbnRlbnRSZWN0ID0gZGF0YS52ZXJzb1BhZ2VTcHJlYWQuZ2V0Q29udGVudFJlY3QoKVxuICAgICAgICBwYWdlU3ByZWFkRWwgPSBkYXRhLnBhZ2VTcHJlYWQuZ2V0RWwoKVxuICAgICAgICBob3RzcG90RWxzID0gcGFnZVNwcmVhZEVsLnF1ZXJ5U2VsZWN0b3JBbGwgJy5zZ24tcHBfX2hvdHNwb3QnXG5cbiAgICAgICAgZm9yIGlkLCBob3RzcG90IG9mIGRhdGEuaG90c3BvdHNcbiAgICAgICAgICAgIHBvc2l0aW9uID0gQGdldFBvc2l0aW9uIGRhdGEucGFnZXMsIGRhdGEucmF0aW8sIGhvdHNwb3RcblxuICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZCBAcmVuZGVySG90c3BvdChob3RzcG90LCBwb3NpdGlvbiwgY29udGVudFJlY3QpXG5cbiAgICAgICAgaG90c3BvdEVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQgaG90c3BvdEVsIGZvciBob3RzcG90RWwgaW4gaG90c3BvdEVsc1xuICAgICAgICBwYWdlU3ByZWFkRWwuYXBwZW5kQ2hpbGQgZnJhZ1xuXG4gICAgICAgIEBcblxuICAgIHJlbmRlckhvdHNwb3Q6IChob3RzcG90LCBwb3NpdGlvbiwgY29udGVudFJlY3QpIC0+XG4gICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgICAgICB0b3AgPSBNYXRoLnJvdW5kIGNvbnRlbnRSZWN0LmhlaWdodCAvIDEwMCAqIHBvc2l0aW9uLnRvcFxuICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZCBjb250ZW50UmVjdC53aWR0aCAvIDEwMCAqIHBvc2l0aW9uLmxlZnRcbiAgICAgICAgd2lkdGggPSBNYXRoLnJvdW5kIGNvbnRlbnRSZWN0LndpZHRoIC8gMTAwICogcG9zaXRpb24ud2lkdGhcbiAgICAgICAgaGVpZ2h0ID0gTWF0aC5yb3VuZCBjb250ZW50UmVjdC5oZWlnaHQgLyAxMDAgKiBwb3NpdGlvbi5oZWlnaHRcblxuICAgICAgICB0b3AgKz0gTWF0aC5yb3VuZCBjb250ZW50UmVjdC50b3BcbiAgICAgICAgbGVmdCArPSBNYXRoLnJvdW5kIGNvbnRlbnRSZWN0LmxlZnRcblxuICAgICAgICBlbC5jbGFzc05hbWUgPSAnc2duLXBwX19ob3RzcG90IHZlcnNvX19vdmVybGF5J1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUgJ2RhdGEtaWQnLCBob3RzcG90LmlkIGlmIGhvdHNwb3QuaWQ/XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSAnZGF0YS10eXBlJywgaG90c3BvdC50eXBlIGlmIGhvdHNwb3QudHlwZT9cblxuICAgICAgICBlbC5zdHlsZS50b3AgPSBcIiN7dG9wfXB4XCJcbiAgICAgICAgZWwuc3R5bGUubGVmdCA9IFwiI3tsZWZ0fXB4XCJcbiAgICAgICAgZWwuc3R5bGUud2lkdGggPSBcIiN7d2lkdGh9cHhcIlxuICAgICAgICBlbC5zdHlsZS5oZWlnaHQgPSBcIiN7aGVpZ2h0fXB4XCJcblxuICAgICAgICBlbFxuXG4gICAgZ2V0UG9zaXRpb246IChwYWdlcywgcmF0aW8sIGhvdHNwb3QpIC0+XG4gICAgICAgIG1pblggPSBudWxsXG4gICAgICAgIG1pblkgPSBudWxsXG4gICAgICAgIG1heFggPSBudWxsXG4gICAgICAgIG1heFkgPSBudWxsXG4gICAgICAgIHBhZ2VOdW1iZXJzID0gcGFnZXMubWFwIChwYWdlKSAtPiBwYWdlLnBhZ2VOdW1iZXJcblxuICAgICAgICBmb3IgcGFnZU51bWJlciBvZiBob3RzcG90LmxvY2F0aW9uc1xuICAgICAgICAgICAgY29udGludWUgaWYgcGFnZU51bWJlcnMuaW5kZXhPZigrcGFnZU51bWJlcikgaXMgLTFcblxuICAgICAgICAgICAgcG9seSA9IGhvdHNwb3QubG9jYXRpb25zW3BhZ2VOdW1iZXJdXG5cbiAgICAgICAgICAgIHBvbHkuZm9yRWFjaCAoY29vcmRzKSAtPlxuICAgICAgICAgICAgICAgIHggPSBjb29yZHNbMF1cbiAgICAgICAgICAgICAgICB5ID0gY29vcmRzWzFdXG5cbiAgICAgICAgICAgICAgICB4ICs9MSBpZiBwYWdlc1sxXSBhbmQgcGFnZU51bWJlcnNbMV0gaXMgK3BhZ2VOdW1iZXJcbiAgICAgICAgICAgICAgICB4IC89IHBhZ2VzLmxlbmd0aFxuXG4gICAgICAgICAgICAgICAgaWYgbm90IG1pblg/XG4gICAgICAgICAgICAgICAgICAgIG1pblggPSBtYXhYID0geFxuICAgICAgICAgICAgICAgICAgICBtaW5ZID0gbWF4WSA9IHlcblxuICAgICAgICAgICAgICAgIG1pblggPSB4IGlmIHggPCBtaW5YXG4gICAgICAgICAgICAgICAgbWF4WCA9IHggaWYgeCA+IG1heFhcbiAgICAgICAgICAgICAgICBtaW5ZID0geSBpZiB5IDwgbWluWVxuICAgICAgICAgICAgICAgIG1heFkgPSB5IGlmIHkgPiBtYXhZXG5cblxuICAgICAgICB3aWR0aCA9IG1heFggLSBtaW5YXG4gICAgICAgIGhlaWdodCA9IG1heFkgLSBtaW5ZXG5cbiAgICAgICAgdG9wOiBtaW5ZIC8gcmF0aW8gKiAxMDBcbiAgICAgICAgbGVmdDogbWluWCAqIDEwMFxuICAgICAgICB3aWR0aDogd2lkdGggKiAxMDBcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLyByYXRpbyAqIDEwMFxuXG4gICAgcmVxdWVzdEhvdHNwb3RzOiAocGFnZVNwcmVhZElkLCBwYWdlcykgLT5cbiAgICAgICAgQHRyaWdnZXIgJ2hvdHNwb3RzUmVxdWVzdGVkJyxcbiAgICAgICAgICAgIGlkOiBwYWdlU3ByZWFkSWRcbiAgICAgICAgICAgIHBhZ2VzOiBwYWdlc1xuXG4gICAgICAgIHJldHVyblxuXG4gICAgaG90c3BvdHNSZWNlaXZlZDogKGUpIC0+XG4gICAgICAgIHBhZ2VTcHJlYWRJZCA9IGUucGFnZVNwcmVhZC5nZXRJZCgpXG5cbiAgICAgICAgQHNldENhY2hlIHBhZ2VTcHJlYWRJZCwgZVxuICAgICAgICBAcmVuZGVySG90c3BvdHMgZVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZ2V0Q2FjaGU6IChwYWdlU3ByZWFkSWQpIC0+XG4gICAgICAgIEBjYWNoZVtwYWdlU3ByZWFkSWRdXG5cbiAgICBzZXRDYWNoZTogKHBhZ2VTcHJlYWRJZCwgZGF0YSkgLT5cbiAgICAgICAgQGNhY2hlW3BhZ2VTcHJlYWRJZF0gPSBkYXRhXG5cbiAgICAgICAgQFxuXG4gICAgYWZ0ZXJOYXZpZ2F0aW9uOiAoZSkgLT5cbiAgICAgICAgaWYgZS5wYWdlU3ByZWFkP1xuICAgICAgICAgICAgaWQgPSBlLnBhZ2VTcHJlYWQuZ2V0SWQoKVxuXG4gICAgICAgICAgICBAY3VycmVudFBhZ2VTcHJlYWRJZCA9IGlkXG4gICAgICAgICAgICBAcmVxdWVzdEhvdHNwb3RzIGlkLCBlLnBhZ2VTcHJlYWQuZ2V0UGFnZXMoKSBpZiBAcGFnZVNwcmVhZHNMb2FkZWRbaWRdXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBwYWdlc0xvYWRlZDogKGUpIC0+XG4gICAgICAgIEBwYWdlU3ByZWFkc0xvYWRlZFtlLnBhZ2VTcHJlYWRJZF0gPSB0cnVlXG4gICAgICAgIEByZXF1ZXN0SG90c3BvdHMgZS5wYWdlU3ByZWFkSWQsIGUucGFnZXMgaWYgQGN1cnJlbnRQYWdlU3ByZWFkSWQgaXMgZS5wYWdlU3ByZWFkSWRcblxuICAgICAgICByZXR1cm5cblxuICAgIHJlc2l6ZWQ6IC0+XG4gICAgICAgIGRhdGEgPSBAZ2V0Q2FjaGUgQGN1cnJlbnRQYWdlU3ByZWFkSWRcblxuICAgICAgICBAcmVuZGVySG90c3BvdHMgZGF0YSBpZiBkYXRhP1xuXG4gICAgICAgIHJldHVyblxuXG5NaWNyb0V2ZW50Lm1peGluIFBhZ2VkUHVibGljYXRpb25Ib3RzcG90c1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2VkUHVibGljYXRpb25Ib3RzcG90c1xuXG5cbiIsIm1vZHVsZS5leHBvcnRzID1cbiAgICBWaWV3ZXI6IHJlcXVpcmUgJy4vdmlld2VyJ1xuXG4gICAgSG90c3BvdFBpY2tlcjogcmVxdWlyZSAnLi9ob3RzcG90X3BpY2tlcidcbiIsIk1pY3JvRXZlbnQgPSByZXF1aXJlICdtaWNyb2V2ZW50J1xuXG5jbGFzcyBQYWdlZFB1YmxpY2F0aW9uTGVnYWN5RXZlbnRUcmFja2luZ1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBAYmluZCAnZXZlbnRUcmFja2VkJywgQGV2ZW50VHJhY2tlZC5iaW5kKEApXG4gICAgICAgIEB6b29tZWRJbiA9IGZhbHNlXG4gICAgICAgIEBhcHBlYXJlZEF0ID0gbnVsbFxuXG4gICAgICAgIHJldHVyblxuXG4gICAgdHJhY2tFdmVudDogKGUpIC0+XG4gICAgICAgIEB0cmlnZ2VyICd0cmFja0V2ZW50JywgZVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZXZlbnRUcmFja2VkOiAoZSkgLT5cbiAgICAgICAgaWYgZS50eXBlIGlzICdwYWdlZC1wdWJsaWNhdGlvbi1wYWdlLXNwcmVhZC1hcHBlYXJlZCdcbiAgICAgICAgICAgIEBhcHBlYXJlZEF0ID0gRGF0ZS5ub3coKVxuICAgICAgICBpZiBlLnR5cGUgaXMgJ3BhZ2VkLXB1YmxpY2F0aW9uLXBhZ2Utc3ByZWFkLWRpc2FwcGVhcmVkJ1xuICAgICAgICAgICAgQHRyaWdnZXIgJ3RyYWNrRXZlbnQnLFxuICAgICAgICAgICAgICAgIHR5cGU6IGlmIEB6b29tZWRJbiB0aGVuICd6b29tJyBlbHNlICd2aWV3J1xuICAgICAgICAgICAgICAgIG1zOiBEYXRlLm5vdygpIC0gQGFwcGVhcmVkQXRcbiAgICAgICAgICAgICAgICBvcmllbnRhdGlvbjogQGdldE9yaWVudGF0aW9uKClcbiAgICAgICAgICAgICAgICBwYWdlczogZS5wcm9wZXJ0aWVzLnBhZ2VkUHVibGljYXRpb25QYWdlU3ByZWFkLnBhZ2VOdW1iZXJzXG4gICAgICAgIGVsc2UgaWYgZS50eXBlIGlzICdwYWdlZC1wdWJsaWNhdGlvbi1wYWdlLXNwcmVhZC16b29tZWQtaW4nXG4gICAgICAgICAgICBAdHJpZ2dlciAndHJhY2tFdmVudCcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3ZpZXcnXG4gICAgICAgICAgICAgICAgbXM6IEBnZXREdXJhdGlvbigpXG4gICAgICAgICAgICAgICAgb3JpZW50YXRpb246IEBnZXRPcmllbnRhdGlvbigpXG4gICAgICAgICAgICAgICAgcGFnZXM6IGUucHJvcGVydGllcy5wYWdlZFB1YmxpY2F0aW9uUGFnZVNwcmVhZC5wYWdlTnVtYmVyc1xuXG4gICAgICAgICAgICBAem9vbWVkSW4gPSB0cnVlXG4gICAgICAgICAgICBAYXBwZWFyZWRBdCA9IERhdGUubm93KClcbiAgICAgICAgZWxzZSBpZiBlLnR5cGUgaXMgJ3BhZ2VkLXB1YmxpY2F0aW9uLXBhZ2Utc3ByZWFkLXpvb21lZC1vdXQnXG4gICAgICAgICAgICBAdHJpZ2dlciAndHJhY2tFdmVudCcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3pvb20nXG4gICAgICAgICAgICAgICAgbXM6IEBnZXREdXJhdGlvbigpXG4gICAgICAgICAgICAgICAgb3JpZW50YXRpb246IEBnZXRPcmllbnRhdGlvbigpXG4gICAgICAgICAgICAgICAgcGFnZXM6IGUucHJvcGVydGllcy5wYWdlZFB1YmxpY2F0aW9uUGFnZVNwcmVhZC5wYWdlTnVtYmVyc1xuXG4gICAgICAgICAgICBAem9vbWVkSW4gPSBmYWxzZVxuICAgICAgICAgICAgQGFwcGVhcmVkQXQgPSBEYXRlLm5vdygpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBnZXRPcmllbnRhdGlvbjogLT5cbiAgICAgICAgaWYgd2luZG93LmlubmVyV2lkdGggPj0gd2luZG93LmlubmVySGVpZ2h0IHRoZW4gJ2xhbmRzY2FwZScgZWxzZSAncG9ydHJhaXQnIFxuXG4gICAgZ2V0RHVyYXRpb246IC0+XG4gICAgICAgIERhdGUubm93KCkgLSBAYXBwZWFyZWRBdFxuXG5NaWNyb0V2ZW50Lm1peGluIFBhZ2VkUHVibGljYXRpb25MZWdhY3lFdmVudFRyYWNraW5nXG5cbm1vZHVsZS5leHBvcnRzID0gUGFnZWRQdWJsaWNhdGlvbkxlZ2FjeUV2ZW50VHJhY2tpbmdcbiIsIk1pY3JvRXZlbnQgPSByZXF1aXJlICdtaWNyb2V2ZW50J1xuU0dOID0gcmVxdWlyZSAnLi4vLi4vc2duJ1xuXG5jbGFzcyBQYWdlZFB1YmxpY2F0aW9uUGFnZVNwcmVhZFxuICAgIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMgPSB7fSkgLT5cbiAgICAgICAgQGNvbnRlbnRzUmVuZGVyZWQgPSBmYWxzZVxuICAgICAgICBAaG90c3BvdHNSZW5kZXJlZCA9IGZhbHNlXG4gICAgICAgIEBlbCA9IEByZW5kZXJFbCgpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBnZXRJZDogLT5cbiAgICAgICAgQG9wdGlvbnMuaWRcblxuICAgIGdldEVsOiAtPlxuICAgICAgICBAZWxcblxuICAgIGdldFBhZ2VzOiAtPlxuICAgICAgICBAb3B0aW9ucy5wYWdlc1xuXG4gICAgcmVuZGVyRWw6IC0+XG4gICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgICAgICBwYWdlSWRzID0gQGdldFBhZ2VzKCkubWFwIChwYWdlKSAtPiBwYWdlLmlkXG5cbiAgICAgICAgZWwuY2xhc3NOYW1lID0gJ3ZlcnNvX19wYWdlLXNwcmVhZCBzZ24tcHBfX3BhZ2Utc3ByZWFkJ1xuXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSAnZGF0YS1pZCcsIEBnZXRJZCgpXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSAnZGF0YS10eXBlJywgJ3BhZ2UnXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSAnZGF0YS13aWR0aCcsIEBvcHRpb25zLndpZHRoXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSAnZGF0YS1wYWdlLWlkcycsIHBhZ2VJZHMuam9pbignLCcpXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSAnZGF0YS1tYXgtem9vbS1zY2FsZScsIEBvcHRpb25zLm1heFpvb21TY2FsZVxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUgJ2RhdGEtem9vbWFibGUnLCBmYWxzZVxuXG4gICAgICAgIGVsXG5cbiAgICByZW5kZXJDb250ZW50czogLT5cbiAgICAgICAgaWQgPSBAZ2V0SWQoKVxuICAgICAgICBlbCA9IEBnZXRFbCgpXG4gICAgICAgIHBhZ2VzID0gQGdldFBhZ2VzKClcbiAgICAgICAgcGFnZUNvdW50ID0gcGFnZXMubGVuZ3RoXG4gICAgICAgIGltYWdlTG9hZHMgPSAwXG5cbiAgICAgICAgcGFnZXMuZm9yRWFjaCAocGFnZSwgaSkgPT5cbiAgICAgICAgICAgIGltYWdlID0gcGFnZS5pbWFnZXMubWVkaXVtXG4gICAgICAgICAgICBwYWdlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgICAgICAgICBsb2FkZXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcblxuICAgICAgICAgICAgcGFnZUVsLmNsYXNzTmFtZSA9ICdzZ24tcHBfX3BhZ2UgdmVyc29fX3BhZ2UnXG4gICAgICAgICAgICBwYWdlRWwuZGF0YXNldC5pZCA9IHBhZ2UuaWQgaWYgcGFnZS5pZD9cblxuICAgICAgICAgICAgaWYgcGFnZUNvdW50IGlzIDJcbiAgICAgICAgICAgICAgICBwYWdlRWwuY2xhc3NOYW1lICs9IGlmIGkgaXMgMCB0aGVuICcgdmVyc28tcGFnZS0tdmVyc28nIGVsc2UgJyB2ZXJzby1wYWdlLS1yZWN0bydcblxuICAgICAgICAgICAgcGFnZUVsLmFwcGVuZENoaWxkIGxvYWRlckVsXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCBwYWdlRWxcblxuICAgICAgICAgICAgbG9hZGVyRWwuY2xhc3NOYW1lID0gJ3Nnbi1wcC1wYWdlX19sb2FkZXInXG4gICAgICAgICAgICBsb2FkZXJFbC5pbm5lckhUTUwgPSBcIjxzcGFuPiN7cGFnZS5sYWJlbH08L3NwYW4+XCJcblxuICAgICAgICAgICAgU0dOLnV0aWwubG9hZEltYWdlIGltYWdlLCAoZXJyLCB3aWR0aCwgaGVpZ2h0KSA9PlxuICAgICAgICAgICAgICAgIGlmIG5vdCBlcnI/XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VFbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgje2ltYWdlfSlcIlxuICAgICAgICAgICAgICAgICAgICBwYWdlRWwuZGF0YXNldC53aWR0aCA9IHdpZHRoXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VFbC5kYXRhc2V0LmhlaWdodCA9IGhlaWdodFxuICAgICAgICAgICAgICAgICAgICBwYWdlRWwuaW5uZXJIVE1MID0gJyZuYnNwOydcblxuICAgICAgICAgICAgICAgICAgICBlbC5kYXRhc2V0Lnpvb21hYmxlID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTG9hZHMrK1xuXG4gICAgICAgICAgICAgICAgICAgIEB0cmlnZ2VyICdwYWdlTG9hZGVkJywgcGFnZVNwcmVhZElkOiBpZCwgcGFnZTogcGFnZVxuICAgICAgICAgICAgICAgICAgICBAdHJpZ2dlciAncGFnZXNMb2FkZWQnLCBwYWdlU3ByZWFkSWQ6IGlkLCBwYWdlczogcGFnZXMgaWYgaW1hZ2VMb2FkcyBpcyBwYWdlQ291bnRcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGxvYWRlckVsLmlubmVySFRNTCA9ICc8c3Bhbj4hPC9zcGFuPidcblxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBAY29udGVudHNSZW5kZXJlZCA9IHRydWVcblxuICAgICAgICBAXG5cbiAgICBjbGVhckNvbnRlbnRzOiAocGFnZVNwcmVhZCwgdmVyc29QYWdlU3ByZWFkKSAtPlxuICAgICAgICBAZWwuaW5uZXJIVE1MID0gJydcbiAgICAgICAgQGNvbnRlbnRzUmVuZGVyZWQgPSBmYWxzZVxuXG4gICAgICAgIEBcblxuICAgIHpvb21JbjogLT5cbiAgICAgICAgcGFnZUVscyA9IFtdLnNsaWNlLmNhbGwgQGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZ24tcHBfX3BhZ2UnKVxuICAgICAgICBwYWdlcyA9IEBnZXRQYWdlcygpXG5cbiAgICAgICAgcGFnZUVscy5mb3JFYWNoIChwYWdlRWwpID0+XG4gICAgICAgICAgICBpZCA9IHBhZ2VFbC5kYXRhc2V0LmlkXG4gICAgICAgICAgICBwYWdlID0gcGFnZXMuZmluZCAocGFnZSkgLT4gcGFnZS5pZCBpcyBpZFxuICAgICAgICAgICAgaW1hZ2UgPSBwYWdlLmltYWdlcy5sYXJnZVxuXG4gICAgICAgICAgICBTR04udXRpbC5sb2FkSW1hZ2UgaW1hZ2UsIChlcnIpID0+XG4gICAgICAgICAgICAgICAgaWYgbm90IGVycj8gYW5kIEBlbC5kYXRhc2V0LmFjdGl2ZSBpcyAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgcGFnZUVsLmRhdGFzZXQuaW1hZ2UgPSBwYWdlRWwuc3R5bGUuYmFja2dyb3VuZEltYWdlXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VFbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgje2ltYWdlfSlcIlxuXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVyblxuXG4gICAgem9vbU91dDogLT5cbiAgICAgICAgcGFnZUVscyA9IFtdLnNsaWNlLmNhbGwgQGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZ24tcHBfX3BhZ2VbZGF0YS1pbWFnZV0nKVxuXG4gICAgICAgIHBhZ2VFbHMuZm9yRWFjaCAocGFnZUVsKSAtPlxuICAgICAgICAgICAgcGFnZUVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IHBhZ2VFbC5kYXRhc2V0LmltYWdlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRlbGV0ZSBwYWdlRWwuZGF0YXNldC5pbWFnZVxuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICByZXR1cm5cblxuTWljcm9FdmVudC5taXhpbiBQYWdlZFB1YmxpY2F0aW9uUGFnZVNwcmVhZFxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2VkUHVibGljYXRpb25QYWdlU3ByZWFkXG4iLCJNaWNyb0V2ZW50ID0gcmVxdWlyZSAnbWljcm9ldmVudCdcblBhZ2VTcHJlYWQgPSByZXF1aXJlICcuL3BhZ2Vfc3ByZWFkJ1xuU0dOID0gcmVxdWlyZSAnLi4vLi4vc2duJ1xuXG5jbGFzcyBQYWdlZFB1YmxpY2F0aW9uUGFnZVNwcmVhZHNcbiAgICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKSAtPlxuICAgICAgICBAY29sbGVjdGlvbiA9IFtdXG4gICAgICAgIEBpZHMgPSB7fVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZ2V0OiAoaWQpIC0+XG4gICAgICAgIEBpZHNbaWRdXG5cbiAgICBnZXRGcmFnOiAtPlxuICAgICAgICBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cbiAgICAgICAgQGNvbGxlY3Rpb24uZm9yRWFjaCAocGFnZVNwcmVhZCkgLT4gZnJhZy5hcHBlbmRDaGlsZCBwYWdlU3ByZWFkLmVsXG5cbiAgICAgICAgZnJhZ1xuXG4gICAgdXBkYXRlOiAocGFnZU1vZGUgPSAnc2luZ2xlJykgLT5cbiAgICAgICAgcGFnZVNwcmVhZHMgPSBbXVxuICAgICAgICBpZHMgPSB7fVxuICAgICAgICBwYWdlcyA9IEBvcHRpb25zLnBhZ2VzLnNsaWNlKClcbiAgICAgICAgd2lkdGggPSBAb3B0aW9ucy53aWR0aFxuICAgICAgICBtYXhab29tU2NhbGUgPSBAb3B0aW9ucy5tYXhab29tU2NhbGVcblxuICAgICAgICBpZiBwYWdlTW9kZSBpcyAnc2luZ2xlJ1xuICAgICAgICAgICAgcGFnZXMuZm9yRWFjaCAocGFnZSkgLT4gcGFnZVNwcmVhZHMucHVzaCBbcGFnZV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlyc3RQYWdlID0gcGFnZXMuc2hpZnQoKVxuICAgICAgICAgICAgbGFzdFBhZ2UgPSBpZiBwYWdlcy5sZW5ndGggJSAyIGlzIDEgdGhlbiBwYWdlcy5wb3AoKSBlbHNlIG51bGxcbiAgICAgICAgICAgIG1pZHN0UGFnZVNwcmVhZHMgPSBTR04udXRpbC5jaHVuayBwYWdlcywgMlxuXG4gICAgICAgICAgICBwYWdlU3ByZWFkcy5wdXNoIFtmaXJzdFBhZ2VdIGlmIGZpcnN0UGFnZT9cbiAgICAgICAgICAgIG1pZHN0UGFnZVNwcmVhZHMuZm9yRWFjaCAobWlkc3RQYWdlcykgLT4gcGFnZVNwcmVhZHMucHVzaCBtaWRzdFBhZ2VzLm1hcCAocGFnZSkgLT4gcGFnZVxuICAgICAgICAgICAgcGFnZVNwcmVhZHMucHVzaCBbbGFzdFBhZ2VdIGlmIGxhc3RQYWdlP1xuXG4gICAgICAgIEBjb2xsZWN0aW9uID0gcGFnZVNwcmVhZHMubWFwIChwYWdlcywgaSkgPT5cbiAgICAgICAgICAgIGlkID0gaSArICcnXG4gICAgICAgICAgICBwYWdlU3ByZWFkID0gbmV3IFBhZ2VTcHJlYWRcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGhcbiAgICAgICAgICAgICAgICBtYXhab29tU2NhbGU6IG1heFpvb21TY2FsZVxuICAgICAgICAgICAgICAgIHBhZ2VzOiBwYWdlc1xuICAgICAgICAgICAgICAgIGlkOiBpZFxuXG4gICAgICAgICAgICBwYWdlU3ByZWFkLmJpbmQgJ3BhZ2VMb2FkZWQnLCAoZSkgPT4gQHRyaWdnZXIgJ3BhZ2VMb2FkZWQnLCBlXG4gICAgICAgICAgICBwYWdlU3ByZWFkLmJpbmQgJ3BhZ2VzTG9hZGVkJywgKGUpID0+IEB0cmlnZ2VyICdwYWdlc0xvYWRlZCcsIGVcblxuICAgICAgICAgICAgaWRzW2lkXSA9IHBhZ2VTcHJlYWRcblxuICAgICAgICAgICAgcGFnZVNwcmVhZFxuICAgICAgICBAaWRzID0gaWRzXG5cbiAgICAgICAgQFxuXG5NaWNyb0V2ZW50Lm1peGluIFBhZ2VkUHVibGljYXRpb25QYWdlU3ByZWFkc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2VkUHVibGljYXRpb25QYWdlU3ByZWFkc1xuIiwiTWljcm9FdmVudCA9IHJlcXVpcmUgJ21pY3JvZXZlbnQnXG5TR04gPSByZXF1aXJlICcuLi8uLi9jb3JlJ1xuQ29yZSA9IHJlcXVpcmUgJy4vY29yZSdcbkhvdHNwb3RzID0gcmVxdWlyZSAnLi9ob3RzcG90cydcbkNvbnRyb2xzID0gcmVxdWlyZSAnLi9jb250cm9scydcbkV2ZW50VHJhY2tpbmcgPSByZXF1aXJlICcuL2V2ZW50X3RyYWNraW5nJ1xuTGVnYWN5RXZlbnRUcmFja2luZyA9IHJlcXVpcmUgJy4vbGVnYWN5X2V2ZW50X3RyYWNraW5nJ1xuXG5jbGFzcyBWaWV3ZXJcbiAgICBjb25zdHJ1Y3RvcjogKEBlbCwgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICAgICAgQF9jb3JlID0gbmV3IENvcmUgQGVsLFxuICAgICAgICAgICAgaWQ6IEBvcHRpb25zLmlkXG4gICAgICAgICAgICBwYWdlczogQG9wdGlvbnMucGFnZXNcbiAgICAgICAgICAgIHBhZ2VTcHJlYWRXaWR0aDogQG9wdGlvbnMucGFnZVNwcmVhZFdpZHRoXG4gICAgICAgICAgICBwYWdlU3ByZWFkTWF4Wm9vbVNjYWxlOiBAb3B0aW9ucy5wYWdlU3ByZWFkTWF4Wm9vbVNjYWxlXG4gICAgICAgICAgICBpZGxlRGVsYXk6IEBvcHRpb25zLmlkbGVEZWxheVxuICAgICAgICAgICAgcmVzaXplRGVsYXk6IEBvcHRpb25zLnJlc2l6ZURlbGF5XG4gICAgICAgICAgICBjb2xvcjogQG9wdGlvbnMuY29sb3JcbiAgICAgICAgQF9ob3RzcG90cyA9IG5ldyBIb3RzcG90cygpXG4gICAgICAgIEBfY29udHJvbHMgPSBuZXcgQ29udHJvbHMgQGVsLCBrZXlib2FyZDogQG9wdGlvbnMua2V5Ym9hcmRcbiAgICAgICAgQF9ldmVudFRyYWNraW5nID0gbmV3IEV2ZW50VHJhY2tpbmcoKVxuICAgICAgICBAX2xlZ2FjeUV2ZW50VHJhY2tpbmcgPSBuZXcgTGVnYWN5RXZlbnRUcmFja2luZygpXG4gICAgICAgIEB2aWV3U2Vzc2lvbiA9IFNHTi51dGlsLnV1aWQoKVxuXG4gICAgICAgIEBfc2V0dXBFdmVudExpc3RlbmVycygpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBzdGFydDogLT5cbiAgICAgICAgQF9jb3JlLnRyaWdnZXIgJ3N0YXJ0ZWQnXG5cbiAgICAgICAgQFxuXG4gICAgZGVzdHJveTogLT5cbiAgICAgICAgQF9jb3JlLnRyaWdnZXIgJ2Rlc3Ryb3llZCdcbiAgICAgICAgQF9ob3RzcG90cy50cmlnZ2VyICdkZXN0cm95ZWQnXG4gICAgICAgIEBfY29udHJvbHMudHJpZ2dlciAnZGVzdHJveWVkJ1xuICAgICAgICBAX2V2ZW50VHJhY2tpbmcudHJpZ2dlciAnZGVzdHJveWVkJ1xuXG4gICAgICAgIEBcblxuICAgIG5hdmlnYXRlVG86IChwb3NpdGlvbiwgb3B0aW9ucykgLT5cbiAgICAgICAgQF9jb3JlLmdldFZlcnNvKCkubmF2aWdhdGVUbyBwb3NpdGlvbiwgb3B0aW9uc1xuXG4gICAgICAgIEBcblxuICAgIGZpcnN0OiAob3B0aW9ucykgLT5cbiAgICAgICAgQF9jb3JlLmdldFZlcnNvKCkuZmlyc3Qgb3B0aW9uc1xuXG4gICAgICAgIEBcblxuICAgIHByZXY6IChvcHRpb25zKSAtPlxuICAgICAgICBAX2NvcmUuZ2V0VmVyc28oKS5wcmV2IG9wdGlvbnNcblxuICAgICAgICBAXG5cbiAgICBuZXh0OiAob3B0aW9ucykgLT5cbiAgICAgICAgQF9jb3JlLmdldFZlcnNvKCkubmV4dCBvcHRpb25zXG5cbiAgICAgICAgQFxuXG4gICAgbGFzdDogKG9wdGlvbnMpIC0+XG4gICAgICAgIEBfY29yZS5nZXRWZXJzbygpLmxhc3Qgb3B0aW9uc1xuXG4gICAgICAgIEBcblxuICAgIF90cmFja0V2ZW50OiAoZSkgLT5cbiAgICAgICAgdHlwZSA9IGUudHlwZVxuICAgICAgICBpZFR5cGUgPSAnbGVnYWN5J1xuICAgICAgICBwcm9wZXJ0aWVzID0gcGFnZWRQdWJsaWNhdGlvbjpcbiAgICAgICAgICAgIGlkOiBbaWRUeXBlLCBAb3B0aW9ucy5pZF1cbiAgICAgICAgICAgIG93bmVkQnk6IFtpZFR5cGUsIEBvcHRpb25zLm93bmVkQnldXG4gICAgICAgIGV2ZW50VHJhY2tlciA9IEBvcHRpb25zLmV2ZW50VHJhY2tlclxuXG4gICAgICAgIHByb3BlcnRpZXNba2V5XSA9IHZhbHVlIGZvciBrZXksIHZhbHVlIG9mIGUucHJvcGVydGllc1xuXG4gICAgICAgIGV2ZW50VHJhY2tlci50cmFja0V2ZW50IHR5cGUsIHByb3BlcnRpZXMgaWYgZXZlbnRUcmFja2VyP1xuXG4gICAgICAgIHJldHVyblxuXG4gICAgX3RyYWNrTGVnYWN5RXZlbnQ6IChlKSAtPlxuICAgICAgICBldmVudFRyYWNrZXIgPSBAb3B0aW9ucy5ldmVudFRyYWNrZXJcbiAgICAgICAgZ2VvbG9jYXRpb24gPSB7fVxuXG4gICAgICAgIGlmIGV2ZW50VHJhY2tlcj9cbiAgICAgICAgICAgIGdlb2xvY2F0aW9uLmxhdGl0dWRlID0gZXZlbnRUcmFja2VyLmxvY2F0aW9uLmxhdGl0dWRlXG4gICAgICAgICAgICBnZW9sb2NhdGlvbi5sb25naXR1ZGUgPSBldmVudFRyYWNrZXIubG9jYXRpb24ubG9uZ2l0dWRlXG4gICAgICAgICAgICBnZW9sb2NhdGlvbi5zZW5zb3IgPSB0cnVlIGlmIGdlb2xvY2F0aW9uLmxhdGl0dWRlP1xuXG4gICAgICAgICAgICBTR04uQ29yZUtpdC5yZXF1ZXN0XG4gICAgICAgICAgICAgICAgZ2VvbG9jYXRpb246IGdlb2xvY2F0aW9uXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCdcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3YyL2NhdGFsb2dzLyN7QG9wdGlvbnMuaWR9L2NvbGxlY3RcIlxuICAgICAgICAgICAgICAgIGhlYWRlcnM6XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeVxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBlLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgbXM6IGUubXNcbiAgICAgICAgICAgICAgICAgICAgb3JpZW50YXRpb246IGUub3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgcGFnZXM6IGUucGFnZXMuam9pbiAnLCdcbiAgICAgICAgICAgICAgICAgICAgdmlld19zZXNzaW9uOiBAdmlld1Nlc3Npb25cbiAgICAgICAgXG4gICAgICAgIHJldHVyblxuXG4gICAgX3NldHVwRXZlbnRMaXN0ZW5lcnM6IC0+XG4gICAgICAgIEBfZXZlbnRUcmFja2luZy5iaW5kICd0cmFja0V2ZW50JywgKGUpID0+XG4gICAgICAgICAgICBAX3RyYWNrRXZlbnQgZVxuICAgICAgICAgICAgQF9sZWdhY3lFdmVudFRyYWNraW5nLnRyaWdnZXIgJ2V2ZW50VHJhY2tlZCcsIGVcblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQF9sZWdhY3lFdmVudFRyYWNraW5nLmJpbmQgJ3RyYWNrRXZlbnQnLCAoZSkgPT5cbiAgICAgICAgICAgIEBfdHJhY2tMZWdhY3lFdmVudCBlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBAX2NvbnRyb2xzLmJpbmQgJ3ByZXYnLCAoZSkgPT5cbiAgICAgICAgICAgIEBwcmV2IGVcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIEBfY29udHJvbHMuYmluZCAnbmV4dCcsIChlKSA9PlxuICAgICAgICAgICAgQG5leHQgZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgQF9jb250cm9scy5iaW5kICdmaXJzdCcsIChlKSA9PlxuICAgICAgICAgICAgQGZpcnN0IGVcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIEBfY29udHJvbHMuYmluZCAnbGFzdCcsIChlKSA9PlxuICAgICAgICAgICAgQGxhc3QoKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgQF9ob3RzcG90cy5iaW5kICdob3RzcG90c1JlcXVlc3RlZCcsIChlKSA9PlxuICAgICAgICAgICAgQHRyaWdnZXIgJ2hvdHNwb3RzUmVxdWVzdGVkJywgZVxuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBAX2NvcmUuYmluZCAnYXBwZWFyZWQnLCAoZSkgPT5cbiAgICAgICAgICAgIEBfZXZlbnRUcmFja2luZy50cmlnZ2VyICdhcHBlYXJlZCcsIGVcbiAgICAgICAgICAgIEB0cmlnZ2VyICdhcHBlYXJlZCcsIGVcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIEBfY29yZS5iaW5kICdkaXNhcHBlYXJlZCcsIChlKSA9PlxuICAgICAgICAgICAgQF9ldmVudFRyYWNraW5nLnRyaWdnZXIgJ2Rpc2FwcGVhcmVkJywgZVxuICAgICAgICAgICAgQHRyaWdnZXIgJ2Rpc2FwcGVhcmVkJywgZVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgQF9jb3JlLmJpbmQgJ2JlZm9yZU5hdmlnYXRpb24nLCAoZSkgPT5cbiAgICAgICAgICAgIEBfZXZlbnRUcmFja2luZy50cmlnZ2VyICdiZWZvcmVOYXZpZ2F0aW9uJywgZVxuICAgICAgICAgICAgQF9jb250cm9scy50cmlnZ2VyICdiZWZvcmVOYXZpZ2F0aW9uJywgZVxuICAgICAgICAgICAgQHRyaWdnZXIgJ2JlZm9yZU5hdmlnYXRpb24nLCBlXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBAX2NvcmUuYmluZCAnYWZ0ZXJOYXZpZ2F0aW9uJywgKGUpID0+XG4gICAgICAgICAgICBAX2V2ZW50VHJhY2tpbmcudHJpZ2dlciAnYWZ0ZXJOYXZpZ2F0aW9uJywgZVxuICAgICAgICAgICAgQHRyaWdnZXIgJ2FmdGVyTmF2aWdhdGlvbicsIGVcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIEBfY29yZS5iaW5kICdhdHRlbXB0ZWROYXZpZ2F0aW9uJywgKGUpID0+XG4gICAgICAgICAgICBAX2V2ZW50VHJhY2tpbmcudHJpZ2dlciAnYXR0ZW1wdGVkTmF2aWdhdGlvbicsIGVcbiAgICAgICAgICAgIEB0cmlnZ2VyICdhdHRlbXB0ZWROYXZpZ2F0aW9uJywgZVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgQF9jb3JlLmJpbmQgJ2NsaWNrZWQnLCAoZSkgPT5cbiAgICAgICAgICAgIEBfZXZlbnRUcmFja2luZy50cmlnZ2VyICdjbGlja2VkJywgZVxuICAgICAgICAgICAgQHRyaWdnZXIgJ2NsaWNrZWQnLCBlXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBAX2NvcmUuYmluZCAnZG91YmxlQ2xpY2tlZCcsIChlKSA9PlxuICAgICAgICAgICAgQF9ldmVudFRyYWNraW5nLnRyaWdnZXIgJ2RvdWJsZUNsaWNrZWQnLCBlXG4gICAgICAgICAgICBAdHJpZ2dlciAnZG91YmxlQ2xpY2tlZCcsIGVcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIEBfY29yZS5iaW5kICdwcmVzc2VkJywgKGUpID0+XG4gICAgICAgICAgICBAX2V2ZW50VHJhY2tpbmcudHJpZ2dlciAncHJlc3NlZCcsIGVcbiAgICAgICAgICAgIEB0cmlnZ2VyICdwcmVzc2VkJywgZVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgQF9jb3JlLmJpbmQgJ3BhblN0YXJ0JywgKGUpID0+XG4gICAgICAgICAgICBAX2V2ZW50VHJhY2tpbmcudHJpZ2dlciAncGFuU3RhcnQnLCBlXG4gICAgICAgICAgICBAdHJpZ2dlciAncGFuU3RhcnQnLCBlXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBAX2NvcmUuYmluZCAnem9vbWVkSW4nLCAoZSkgPT5cbiAgICAgICAgICAgIEBfZXZlbnRUcmFja2luZy50cmlnZ2VyICd6b29tZWRJbicsIGVcbiAgICAgICAgICAgIEB0cmlnZ2VyICd6b29tZWRJbicsIGVcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIEBfY29yZS5iaW5kICd6b29tZWRPdXQnLCAoZSkgPT5cbiAgICAgICAgICAgIEBfZXZlbnRUcmFja2luZy50cmlnZ2VyICd6b29tZWRPdXQnLCBlXG4gICAgICAgICAgICBAdHJpZ2dlciAnem9vbWVkT3V0JywgZVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgQF9jb3JlLmJpbmQgJ3BhZ2VMb2FkZWQnLCAoZSkgPT5cbiAgICAgICAgICAgIEBfZXZlbnRUcmFja2luZy50cmlnZ2VyICdwYWdlTG9hZGVkJywgZVxuICAgICAgICAgICAgQHRyaWdnZXIgJ3BhZ2VMb2FkZWQnLCBlXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBAX2NvcmUuYmluZCAnYWZ0ZXJOYXZpZ2F0aW9uJywgKGUpID0+XG4gICAgICAgICAgICBAX2hvdHNwb3RzLnRyaWdnZXIgJ2FmdGVyTmF2aWdhdGlvbicsIGVcbiAgICAgICAgICAgIEB0cmlnZ2VyICdhZnRlck5hdmlnYXRpb24nLCBlXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBAX2NvcmUuYmluZCAncGFnZXNMb2FkZWQnLCAoZSkgPT5cbiAgICAgICAgICAgIEBfaG90c3BvdHMudHJpZ2dlciAncGFnZXNMb2FkZWQnLCBlXG4gICAgICAgICAgICBAdHJpZ2dlciAncGFnZXNMb2FkZWQnLCBlXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBAX2NvcmUuYmluZCAncmVzaXplZCcsIChlKSA9PlxuICAgICAgICAgICAgQF9ob3RzcG90cy50cmlnZ2VyICdyZXNpemVkJywgZVxuICAgICAgICAgICAgQHRyaWdnZXIgJ3Jlc2l6ZWQnLCBlXG5cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIEBiaW5kICdob3RzcG90c1JlY2VpdmVkJywgKGUpID0+XG4gICAgICAgICAgICBAX2hvdHNwb3RzLnRyaWdnZXIgJ2hvdHNwb3RzUmVjZWl2ZWQnLFxuICAgICAgICAgICAgICAgIHBhZ2VTcHJlYWQ6IEBfY29yZS5wYWdlU3ByZWFkcy5nZXQgZS5pZFxuICAgICAgICAgICAgICAgIHZlcnNvUGFnZVNwcmVhZDogQF9jb3JlLmdldFZlcnNvKCkucGFnZVNwcmVhZHMuZmluZCAocGFnZVNwcmVhZCkgLT5cbiAgICAgICAgICAgICAgICAgICAgcGFnZVNwcmVhZC5nZXRJZCgpIGlzIGUuaWRcbiAgICAgICAgICAgICAgICByYXRpbzogZS5yYXRpb1xuICAgICAgICAgICAgICAgIHBhZ2VzOiBlLnBhZ2VzXG4gICAgICAgICAgICAgICAgaG90c3BvdHM6IGUuaG90c3BvdHNcblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG5cbk1pY3JvRXZlbnQubWl4aW4gVmlld2VyXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld2VyXG4iLCJTR04gPSByZXF1aXJlICcuLi9zZ24nXG5cbm1vZHVsZS5leHBvcnRzID0gKG9wdGlvbnMgPSB7fSwgY2FsbGJhY2ssIHByb2dyZXNzQ2FsbGJhY2spIC0+XG4gICAgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgbWV0aG9kID0gb3B0aW9ucy5tZXRob2QgPyAnZ2V0J1xuICAgIHVybCA9IG9wdGlvbnMudXJsXG5cbiAgICB1cmwgKz0gU0dOLnV0aWwuZm9ybWF0UXVlcnlQYXJhbXMgb3B0aW9ucy5xcyBpZiBvcHRpb25zLnFzP1xuXG4gICAgaHR0cC5vcGVuIG1ldGhvZC50b1VwcGVyQ2FzZSgpLCB1cmxcbiAgICBodHRwLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgaWYgb3B0aW9ucy50aW1lb3V0P1xuICAgIGh0dHAud2l0aENyZWRlbnRpYWxzID0gdHJ1ZSBpZiBvcHRpb25zLnVzZUNvb2tpZXMgaXNudCBmYWxzZVxuXG4gICAgaWYgb3B0aW9ucy5oZWFkZXJzP1xuICAgICAgICBmb3IgaGVhZGVyLCB2YWx1ZSBvZiBvcHRpb25zLmhlYWRlcnNcbiAgICAgICAgICAgIGh0dHAuc2V0UmVxdWVzdEhlYWRlciBoZWFkZXIsIHZhbHVlXG5cbiAgICBodHRwLmFkZEV2ZW50TGlzdGVuZXIgJ2xvYWQnLCAtPlxuICAgICAgICBoZWFkZXJzID0gaHR0cC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKS5zcGxpdCAnXFxyXFxuJ1xuICAgICAgICBoZWFkZXJzID0gaGVhZGVycy5yZWR1Y2UgKGFjYywgY3VycmVudCwgaSkgLT5cbiAgICAgICAgICAgIHBhcnRzID0gY3VycmVudC5zcGxpdCAnOiAnXG5cbiAgICAgICAgICAgIGFjY1twYXJ0c1swXS50b0xvd2VyQ2FzZSgpXSA9IHBhcnRzWzFdXG5cbiAgICAgICAgICAgIGFjY1xuICAgICAgICAsIHt9XG5cbiAgICAgICAgY2FsbGJhY2sgbnVsbCxcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGh0dHAuc3RhdHVzXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXG4gICAgICAgICAgICBib2R5OiBodHRwLnJlc3BvbnNlVGV4dFxuXG4gICAgICAgIHJldHVyblxuICAgIGh0dHAuYWRkRXZlbnRMaXN0ZW5lciAnZXJyb3InLCAtPlxuICAgICAgICBjYWxsYmFjayBuZXcgRXJyb3IoKVxuXG4gICAgICAgIHJldHVyblxuICAgIGh0dHAuYWRkRXZlbnRMaXN0ZW5lciAndGltZW91dCcsIC0+XG4gICAgICAgIGNhbGxiYWNrIG5ldyBFcnJvcigpXG5cbiAgICAgICAgcmV0dXJuXG4gICAgaHR0cC5hZGRFdmVudExpc3RlbmVyICdwcm9ncmVzcycsIChlKSAtPlxuICAgICAgICBpZiBlLmxlbmd0aENvbXB1dGFibGUgYW5kIHR5cGVvZiBwcm9ncmVzc0NhbGxiYWNrIGlzICdmdW5jdGlvbidcbiAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2sgZS5sb2FkZWQsIGUudG90YWxcblxuICAgICAgICByZXR1cm5cblxuICAgIGh0dHAuc2VuZCBvcHRpb25zLmJvZHlcblxuICAgIHJldHVyblxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlICcuL2NvcmUnXG4iLCJTR04gPSByZXF1aXJlICcuLi9zZ24nXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBrZXk6ICdzZ24tJ1xuXG4gICAgZ2V0OiAoa2V5KSAtPlxuICAgICAgICByZXR1cm4gaWYgU0dOLnV0aWwuaXNOb2RlKClcblxuICAgICAgICB0cnlcbiAgICAgICAgICAgIG5hbWUgPSBcIiN7QGtleX0je2tleX09XCJcbiAgICAgICAgICAgIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0ICc7J1xuXG4gICAgICAgICAgICBmb3IgYyBpbiBjYVxuICAgICAgICAgICAgICAgIGN0ID0gYy50cmltKClcblxuICAgICAgICAgICAgICAgIHZhbHVlID0gY3Quc3Vic3RyaW5nKG5hbWUubGVuZ3RoLCBjdC5sZW5ndGgpIGlmIGN0LmluZGV4T2YobmFtZSkgaXMgMFxuXG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UgdmFsdWVcbiAgICAgICAgY2F0Y2ggZXJyXG4gICAgICAgICAgICB2YWx1ZSA9IHt9XG5cbiAgICAgICAgdmFsdWVcblxuICAgIHNldDogKGtleSwgdmFsdWUpIC0+XG4gICAgICAgIHJldHVybiBpZiBTR04udXRpbC5pc05vZGUoKVxuXG4gICAgICAgIHRyeVxuICAgICAgICAgICAgZGF5cyA9IDM2NVxuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKClcbiAgICAgICAgICAgIHN0ciA9IEpTT04uc3RyaW5naWZ5IHZhbHVlXG5cbiAgICAgICAgICAgIGRhdGUuc2V0VGltZSBkYXRlLmdldFRpbWUoKSArIGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwXG5cbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IFwiI3tAa2V5fSN7a2V5fT0je3N0cn07ZXhwaXJlcz0je2RhdGUudG9VVENTdHJpbmcoKX07cGF0aD0vXCJcbiAgICAgICAgY2F0Y2ggZXJyXG5cbiAgICAgICAgcmV0dXJuXG5cblxuIiwiU0dOID0gcmVxdWlyZSAnLi4vc2duJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAga2V5OiAnc2duLSdcblxuICAgIHN0b3JhZ2U6IGRvIC0+XG4gICAgICAgIHRyeVxuICAgICAgICAgICAgc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcblxuICAgICAgICAgICAgc3RvcmFnZVtcIiN7QGtleX10ZXN0LXN0b3JhZ2VcIl0gPSAnZm9vYmFyJ1xuICAgICAgICAgICAgZGVsZXRlIHN0b3JhZ2VbXCIje0BrZXl9dGVzdC1zdG9yYWdlXCJdXG5cbiAgICAgICAgICAgIHN0b3JhZ2VcbiAgICAgICAgY2F0Y2hcbiAgICAgICAgICAgIHt9XG5cbiAgICBnZXQ6IChrZXkpIC0+XG4gICAgICAgIHRyeVxuICAgICAgICAgICAgSlNPTi5wYXJzZSBAc3RvcmFnZVtcIiN7QGtleX0je2tleX1cIl1cblxuICAgIHNldDogKGtleSwgdmFsdWUpIC0+XG4gICAgICAgIHRyeVxuICAgICAgICAgICAgQHN0b3JhZ2VbXCIje0BrZXl9I3trZXl9XCJdID0gSlNPTi5zdHJpbmdpZnkgdmFsdWVcblxuICAgICAgICBAXG4iLCJ1dGlsID1cbiAgICBpc0Jyb3dzZXI6IC0+XG4gICAgICAgIHR5cGVvZiBwcm9jZXNzIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIHByb2Nlc3MuYnJvd3NlclxuXG4gICAgaXNOb2RlOiAtPlxuICAgICAgICBub3QgdXRpbC5pc0Jyb3dzZXIoKVxuXG4gICAgZXJyb3I6IChlcnIsIG9wdGlvbnMpIC0+XG4gICAgICAgIGVyci5tZXNzYWdlID0gZXJyLm1lc3NhZ2Ugb3IgbnVsbFxuXG4gICAgICAgIGlmIHR5cGVvZiBvcHRpb25zIGlzICdzdHJpbmcnXG4gICAgICAgICAgICBlcnIubWVzc2FnZSA9IG9wdGlvbnNcbiAgICAgICAgZWxzZSBpZiB0eXBlb2Ygb3B0aW9ucyBpcyAnb2JqZWN0JyBhbmQgb3B0aW9ucz9cbiAgICAgICAgICAgIGZvciBrZXksIHZhbHVlIG9mIG9wdGlvbnNcbiAgICAgICAgICAgICAgICBlcnJba2V5XSA9IHZhbHVlXG5cbiAgICAgICAgICAgIGVyci5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIGlmIG9wdGlvbnMubWVzc2FnZT9cbiAgICAgICAgICAgIGVyci5jb2RlID0gb3B0aW9ucy5jb2RlIG9yIG9wdGlvbnMubmFtZSBpZiBvcHRpb25zLmNvZGU/IG9yIG9wdGlvbnMubWVzc2FnZT9cbiAgICAgICAgICAgIGVyci5zdGFjayA9IG9wdGlvbnMuc3RhY2sgaWYgb3B0aW9ucy5zdGFjaz9cblxuICAgICAgICBlcnIubmFtZSA9IG9wdGlvbnMgYW5kIG9wdGlvbnMubmFtZSBvciBlcnIubmFtZSBvciBlcnIuY29kZSBvciAnRXJyb3InXG4gICAgICAgIGVyci50aW1lID0gbmV3IERhdGUoKVxuXG4gICAgICAgIGVyclxuXG4gICAgdXVpZDogLT5cbiAgICAgICAgJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSAvW3h5XS9nLCAoYykgLT5cbiAgICAgICAgICAgIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXG4gICAgICAgICAgICB2ID0gaWYgYyBpcyAneCcgdGhlbiByIGVsc2UgKHIgJiAweDN8MHg4KVxuXG4gICAgICAgICAgICB2LnRvU3RyaW5nIDE2XG5cbiAgICBnZXRRdWVyeVBhcmFtOiAoZmllbGQsIHVybCkgLT5cbiAgICAgICAgaHJlZiA9IGlmIHVybCB0aGVuIHVybCBlbHNlIHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICAgIHJlZyA9IG5ldyBSZWdFeHAgJ1s/Jl0nICsgZmllbGQgKyAnPShbXiYjXSopJywgJ2knXG4gICAgICAgIHN0cmluZyA9IHJlZy5leGVjIGhyZWZcblxuICAgICAgICBpZiBzdHJpbmcgdGhlbiBzdHJpbmdbMV0gZWxzZSB1bmRlZmluZWRcblxuICAgIGZvcm1hdFF1ZXJ5UGFyYW1zOiAocXVlcnlQYXJhbXMpIC0+XG4gICAgICAgICc/JyArIE9iamVjdFxuICAgICAgICAgICAgLmtleXMgcXVlcnlQYXJhbXNcbiAgICAgICAgICAgIC5tYXAgKGtleSkgLT4ga2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5UGFyYW1zW2tleV0pXG4gICAgICAgICAgICAuam9pbiAnJidcblxuICAgIGdldE9TOiAtPlxuICAgICAgICBuYW1lID0gbnVsbFxuICAgICAgICB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG5cbiAgICAgICAgaWYgdWEuaW5kZXhPZignV2luZG93cycpID4gLTFcbiAgICAgICAgICAgIG5hbWUgPSAnV2luZG93cydcbiAgICAgICAgZWxzZSBpZiB1YS5pbmRleE9mKCdNYWMnKSA+IC0xXG4gICAgICAgICAgICBuYW1lID0gJ21hY09TJ1xuICAgICAgICBlbHNlIGlmIHVhLmluZGV4T2YoJ1gxMScpID4gLTFcbiAgICAgICAgICAgIG5hbWUgPSAndW5peCdcbiAgICAgICAgZWxzZSBpZiB1YS5pbmRleE9mKCdMaW51eCcpID4gLTFcbiAgICAgICAgICAgIG5hbWUgPSAnTGludXgnXG4gICAgICAgIGVsc2UgaWYgdWEuaW5kZXhPZignaU9TJykgPiAtMVxuICAgICAgICAgICAgbmFtZSA9ICdpT1MnXG4gICAgICAgIGVsc2UgaWYgdWEuaW5kZXhPZignQW5kcm9pZCcpID4gLTFcbiAgICAgICAgICAgIG5hbWUgPSAnQW5kcm9pZCdcblxuICAgICAgICBuYW1lXG5cbiAgICBidG9hOiAoc3RyKSAtPlxuICAgICAgICBpZiB1dGlsLmlzQnJvd3NlcigpXG4gICAgICAgICAgICBidG9hIHN0clxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBidWZmZXIgPSBudWxsXG5cbiAgICAgICAgICAgIGlmIHN0ciBpbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgICAgIGJ1ZmZlciA9IHN0clxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGJ1ZmZlciA9IG5ldyBCdWZmZXIgc3RyLnRvU3RyaW5nKCksICdiaW5hcnknXG5cbiAgICAgICAgICAgIGJ1ZmZlci50b1N0cmluZyAnYmFzZTY0J1xuXG4gICAgZ2V0U2NyZWVuRGltZW5zaW9uczogLT5cbiAgICAgICAgZGVuc2l0eSA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID8gMVxuICAgICAgICBsb2dpY2FsID1cbiAgICAgICAgICAgIHdpZHRoOiB3aW5kb3cuc2NyZWVuLndpZHRoXG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5zY3JlZW4uaGVpZ2h0XG4gICAgICAgIHBoeXNpY2FsID1cbiAgICAgICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kIGxvZ2ljYWwud2lkdGggKiBkZW5zaXR5XG4gICAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQgbG9naWNhbC5oZWlnaHQgKiBkZW5zaXR5XG5cbiAgICAgICAgZGVuc2l0eTogZGVuc2l0eVxuICAgICAgICBsb2dpY2FsOiBsb2dpY2FsXG4gICAgICAgIHBoeXNpY2FsOiBwaHlzaWNhbFxuXG4gICAgZ2V0VXRjT2Zmc2V0U2Vjb25kczogLT5cbiAgICAgICAgbm93ID0gbmV3IERhdGUoKVxuICAgICAgICBqYW4xID0gbmV3IERhdGUgbm93LmdldEZ1bGxZZWFyKCksIDAsIDEsIDAsIDAsIDAsIDBcbiAgICAgICAgdG1wID0gamFuMS50b0dNVFN0cmluZygpXG4gICAgICAgIGphbjIgPSBuZXcgRGF0ZSB0bXAuc3Vic3RyaW5nKDAsIHRtcC5sYXN0SW5kZXhPZignICcpIC0gMSlcbiAgICAgICAgc3RkVGltZU9mZnNldCA9IChqYW4xIC0gamFuMikgLyAxMDAwXG5cbiAgICAgICAgc3RkVGltZU9mZnNldFxuXG4gICAgZ2V0VXRjRHN0T2Zmc2V0U2Vjb25kczogLT5cbiAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAgKiAtMVxuXG4gICAgZ2V0Q29sb3JCcmlnaHRuZXNzOiAoY29sb3IpIC0+XG4gICAgICAgIGNvbG9yID0gY29sb3IucmVwbGFjZSAnIycsICcnXG4gICAgICAgIGhleCA9IHBhcnNlSW50IChoZXggKyAnJykucmVwbGFjZSgvW15hLWYwLTldL2dpLCAnJyksIDE2XG4gICAgICAgIHJnYiA9IFtdXG4gICAgICAgIHN1bSA9IDBcbiAgICAgICAgeCA9IDBcblxuICAgICAgICB3aGlsZSB4IDwgM1xuICAgICAgICAgICAgcyA9IHBhcnNlSW50KGNvbG9yLnN1YnN0cmluZygyICogeCwgMiksIDE2KVxuICAgICAgICAgICAgcmdiW3hdID0gc1xuXG4gICAgICAgICAgICBzdW0gKz0gcyBpZiBzID4gMFxuXG4gICAgICAgICAgICArK3hcblxuICAgICAgICBpZiBzdW0gPD0gMzgxIHRoZW4gJ2RhcmsnIGVsc2UgJ2xpZ2h0J1xuXG4gICAgY2h1bms6IChhcnIsIHNpemUpIC0+XG4gICAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICAgIHdoaWxlIGFyci5sZW5ndGhcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCBhcnIuc3BsaWNlKDAsIHNpemUpXG5cbiAgICAgICAgcmVzdWx0c1xuXG4gICAgdGhyb3R0bGU6IChmbiwgdGhyZXNob2xkID0gMjUwLCBzY29wZSkgLT5cbiAgICAgICAgbGFzdCA9IHVuZGVmaW5lZFxuICAgICAgICBkZWZlclRpbWVyID0gdW5kZWZpbmVkXG5cbiAgICAgICAgLT5cbiAgICAgICAgICAgIGNvbnRleHQgPSBzY29wZSBvciBAXG4gICAgICAgICAgICBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50c1xuXG4gICAgICAgICAgICBpZiBsYXN0IGFuZCBub3cgPCBsYXN0ICsgdGhyZXNob2xkXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0IGRlZmVyVGltZXJcblxuICAgICAgICAgICAgICAgIGRlZmVyVGltZXIgPSBzZXRUaW1lb3V0IC0+XG4gICAgICAgICAgICAgICAgICAgIGxhc3QgPSBub3dcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGZuLmFwcGx5IGNvbnRleHQsIGFyZ3NcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgLCB0aHJlc2hvbGRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBsYXN0ID0gbm93XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkgY29udGV4dCwgYXJnc1xuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgIGxvYWRJbWFnZTogKHNyYywgY2FsbGJhY2spIC0+XG4gICAgICAgIGltZyA9IG5ldyBJbWFnZSgpXG5cbiAgICAgICAgaW1nLm9ubG9hZCA9IC0+IGNhbGxiYWNrIG51bGwsIGltZy53aWR0aCwgaW1nLmhlaWdodFxuICAgICAgICBpbWcub25lcnJvciA9IC0+IGNhbGxiYWNrIG5ldyBFcnJvcigpXG4gICAgICAgIGltZy5zcmMgPSBzcmNcblxuICAgICAgICBpbWdcblxuICAgIGRpc3RhbmNlOiAobGF0MSwgbG5nMSwgbGF0MiwgbG5nMikgLT5cbiAgICAgICAgcmFkbGF0MSA9IE1hdGguUEkgKiBsYXQxIC8gMTgwXG4gICAgICAgIHJhZGxhdDIgPSBNYXRoLlBJICogbGF0MiAvIDE4MFxuICAgICAgICB0aGV0YSA9IGxuZzEgLSBsbmcyXG4gICAgICAgIHJhZHRoZXRhID0gTWF0aC5QSSAqIHRoZXRhIC8gMTgwXG4gICAgICAgIGRpc3QgPSBNYXRoLnNpbihyYWRsYXQxKSAqIE1hdGguc2luKHJhZGxhdDIpICsgTWF0aC5jb3MocmFkbGF0MSkgKiBNYXRoLmNvcyhyYWRsYXQyKSAqIE1hdGguY29zKHJhZHRoZXRhKVxuICAgICAgICBkaXN0ID0gTWF0aC5hY29zKGRpc3QpXG4gICAgICAgIGRpc3QgPSBkaXN0ICogMTgwIC8gTWF0aC5QSVxuICAgICAgICBkaXN0ID0gZGlzdCAqIDYwICogMS4xNTE1XG4gICAgICAgIGRpc3QgPSBkaXN0ICogMS42MDkzNDQgKiAxMDAwXG5cbiAgICAgICAgZGlzdFxuXG4gICAgYXN5bmM6XG4gICAgICAgIHBhcmFsbGVsOiAoYXN5bmNDYWxscywgc2hhcmVkQ2FsbGJhY2spIC0+XG4gICAgICAgICAgICBjb3VudGVyID0gYXN5bmNDYWxscy5sZW5ndGhcbiAgICAgICAgICAgIGFsbFJlc3VsdHMgPSBbXVxuICAgICAgICAgICAgayA9IDBcblxuICAgICAgICAgICAgbWFrZUNhbGxiYWNrID0gKGluZGV4KSAtPlxuICAgICAgICAgICAgICAgIC0+XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBbXVxuICAgICAgICAgICAgICAgICAgICBpID0gMFxuXG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXItLVxuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIGkgPCBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2ggYXJndW1lbnRzW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICBpKytcblxuICAgICAgICAgICAgICAgICAgICBhbGxSZXN1bHRzW2luZGV4XSA9IHJlc3VsdHNcblxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRDYWxsYmFjayBhbGxSZXN1bHRzIGlmIGNvdW50ZXIgaXMgMFxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICB3aGlsZSBrIDwgYXN5bmNDYWxscy5sZW5ndGhcbiAgICAgICAgICAgICAgICBhc3luY0NhbGxzW2tdIG1ha2VDYWxsYmFjayhrKVxuICAgICAgICAgICAgICAgIGsrK1xuXG4gICAgICAgICAgICByZXR1cm5cblxubW9kdWxlLmV4cG9ydHMgPSB1dGlsXG4iLCIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbnZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG5mb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxufVxuXG5yZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbnJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xuXG5mdW5jdGlvbiBwbGFjZUhvbGRlcnNDb3VudCAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICByZXR1cm4gYjY0W2xlbiAtIDJdID09PSAnPScgPyAyIDogYjY0W2xlbiAtIDFdID09PSAnPScgPyAxIDogMFxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChiNjQpIHtcbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIHJldHVybiAoYjY0Lmxlbmd0aCAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0NvdW50KGI2NClcbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgaSwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuICBwbGFjZUhvbGRlcnMgPSBwbGFjZUhvbGRlcnNDb3VudChiNjQpXG5cbiAgYXJyID0gbmV3IEFycigobGVuICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzKVxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgbCA9IHBsYWNlSG9sZGVycyA+IDAgPyBsZW4gLSA0IDogbGVuXG5cbiAgdmFyIEwgPSAwXG5cbiAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gNCkge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltMKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG52YXIgS19NQVhfTEVOR1RIID0gMHg3ZmZmZmZmZlxuZXhwb3J0cy5rTWF4TGVuZ3RoID0gS19NQVhfTEVOR1RIXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFByaW50IHdhcm5pbmcgYW5kIHJlY29tbWVuZCB1c2luZyBgYnVmZmVyYCB2NC54IHdoaWNoIGhhcyBhbiBPYmplY3RcbiAqICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIFdlIHJlcG9ydCB0aGF0IHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGlmIHRoZSBhcmUgbm90IHN1YmNsYXNzYWJsZVxuICogdXNpbmcgX19wcm90b19fLiBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YFxuICogKFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4KS4gSUUgMTAgbGFja3Mgc3VwcG9ydFxuICogZm9yIF9fcHJvdG9fXyBhbmQgaGFzIGEgYnVnZ3kgdHlwZWQgYXJyYXkgaW1wbGVtZW50YXRpb24uXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gdHlwZWRBcnJheVN1cHBvcnQoKVxuXG5pZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gIGNvbnNvbGUuZXJyb3IoXG4gICAgJ1RoaXMgYnJvd3NlciBsYWNrcyB0eXBlZCBhcnJheSAoVWludDhBcnJheSkgc3VwcG9ydCB3aGljaCBpcyByZXF1aXJlZCBieSAnICtcbiAgICAnYGJ1ZmZlcmAgdjUueC4gVXNlIGBidWZmZXJgIHY0LnggaWYgeW91IHJlcXVpcmUgb2xkIGJyb3dzZXIgc3VwcG9ydC4nXG4gIClcbn1cblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICAvLyBDYW4gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWQ/XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLl9fcHJvdG9fXyA9IHtfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLCBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH19XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDJcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIHZhciBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKGFyZylcbiAgfVxuICByZXR1cm4gZnJvbShhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbmlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSlcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbmZ1bmN0aW9uIGZyb20gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgcmV0dXJuIGZyb21PYmplY3QodmFsdWUpXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20odmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gTm90ZTogQ2hhbmdlIHByb3RvdHlwZSAqYWZ0ZXIqIEJ1ZmZlci5mcm9tIGlzIGRlZmluZWQgdG8gd29ya2Fyb3VuZCBDaHJvbWUgYnVnOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC8xNDhcbkJ1ZmZlci5wcm90b3R5cGUuX19wcm90b19fID0gVWludDhBcnJheS5wcm90b3R5cGVcbkJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2Moc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlIChzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gYnVmLndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICBidWYgPSBidWYuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlIChhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgYnVmW2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnb2Zmc2V0XFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdsZW5ndGhcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICB2YXIgYnVmXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBidWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbilcblxuICAgIGlmIChidWYubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gYnVmXG4gICAgfVxuXG4gICAgb2JqLmNvcHkoYnVmLCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIGJ1ZlxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmIChpc0FycmF5QnVmZmVyVmlldyhvYmopIHx8ICdsZW5ndGgnIGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBudW1iZXJJc05hTihvYmoubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKDApXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmopXG4gICAgfVxuXG4gICAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBBcnJheS5pc0FycmF5KG9iai5kYXRhKSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqLmRhdGEpXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIGFycmF5LWxpa2Ugb2JqZWN0LicpXG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBLX01BWF9MRU5HVEhgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0gS19NQVhfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIEtfTUFYX0xFTkdUSC50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5mdW5jdGlvbiBTbG93QnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKCtsZW5ndGggIT0gbGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG4gICAgbGVuZ3RoID0gMFxuICB9XG4gIHJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aClcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuIGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlciA9PT0gdHJ1ZVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAoaXNBcnJheUJ1ZmZlclZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHN0cmluZyA9ICcnICsgc3RyaW5nXG4gIH1cblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoaXMgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCAoYW5kIHRoZSBgaXMtYnVmZmVyYCBucG0gcGFja2FnZSlcbi8vIHRvIGRldGVjdCBhIEJ1ZmZlciBpbnN0YW5jZS4gSXQncyBub3QgcG9zc2libGUgdG8gdXNlIGBpbnN0YW5jZW9mIEJ1ZmZlcmBcbi8vIHJlbGlhYmx5IGluIGEgYnJvd3NlcmlmeSBjb250ZXh0IGJlY2F1c2UgdGhlcmUgY291bGQgYmUgbXVsdGlwbGUgZGlmZmVyZW50XG4vLyBjb3BpZXMgb2YgdGhlICdidWZmZXInIHBhY2thZ2UgaW4gdXNlLiBUaGlzIG1ldGhvZCB3b3JrcyBldmVuIGZvciBCdWZmZXJcbi8vIGluc3RhbmNlcyB0aGF0IHdlcmUgY3JlYXRlZCBmcm9tIGFub3RoZXIgY29weSBvZiB0aGUgYGJ1ZmZlcmAgcGFja2FnZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE1NFxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChudW1iZXJJc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFsgdmFsIF0sIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIHZhciBpbmRleFNpemUgPSAxXG4gIHZhciBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIHZhciB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpXG4gIGlmIChkaXIpIHtcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA8IGFyckxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVhZChhcnIsIGkpID09PSByZWFkKHZhbCwgZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXgpKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gZm91bmRJbmRleCAqIGluZGV4U2l6ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSBpIC09IGkgLSBmb3VuZEluZGV4XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYnl0ZU9mZnNldCArIHZhbExlbmd0aCA+IGFyckxlbmd0aCkgYnl0ZU9mZnNldCA9IGFyckxlbmd0aCAtIHZhbExlbmd0aFxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgZm91bmQgPSB0cnVlXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbExlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChyZWFkKGFyciwgaSArIGopICE9PSByZWFkKHZhbCwgaikpIHtcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kKSByZXR1cm4gaVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSAhPT0gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgdHJ1ZSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBmYWxzZSlcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggPj4+IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyAoYnl0ZXNbaSArIDFdICogMjU2KSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcbiAgdmFyIGlcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSBpZiAobGVuIDwgMTAwMCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKGNvZGUgPCAyNTYpIHtcbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZylcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG4vLyBOb2RlIDAuMTAgc3VwcG9ydHMgYEFycmF5QnVmZmVyYCBidXQgbGFja3MgYEFycmF5QnVmZmVyLmlzVmlld2BcbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3IChvYmopIHtcbiAgcmV0dXJuICh0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nKSAmJiBBcnJheUJ1ZmZlci5pc1ZpZXcob2JqKVxufVxuXG5mdW5jdGlvbiBudW1iZXJJc05hTiAob2JqKSB7XG4gIHJldHVybiBvYmogIT09IG9iaiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuIiwiIWZ1bmN0aW9uKGdsb2JhbHMpIHtcbid1c2Ugc3RyaWN0J1xuXG52YXIgY29udmVydEhleCA9IHtcbiAgYnl0ZXNUb0hleDogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAvKmlmICh0eXBlb2YgYnl0ZXMuYnl0ZUxlbmd0aCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgdmFyIG5ld0J5dGVzID0gW11cblxuICAgICAgaWYgKHR5cGVvZiBieXRlcy5idWZmZXIgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIGJ5dGVzID0gbmV3IERhdGFWaWV3KGJ5dGVzLmJ1ZmZlcilcbiAgICAgIGVsc2VcbiAgICAgICAgYnl0ZXMgPSBuZXcgRGF0YVZpZXcoYnl0ZXMpXG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMuYnl0ZUxlbmd0aDsgKytpKSB7XG4gICAgICAgIG5ld0J5dGVzLnB1c2goYnl0ZXMuZ2V0VWludDgoaSkpXG4gICAgICB9XG4gICAgICBieXRlcyA9IG5ld0J5dGVzXG4gICAgfSovXG4gICAgcmV0dXJuIGFyckJ5dGVzVG9IZXgoYnl0ZXMpXG4gIH0sXG4gIGhleFRvQnl0ZXM6IGZ1bmN0aW9uKGhleCkge1xuICAgIGlmIChoZXgubGVuZ3RoICUgMiA9PT0gMSkgdGhyb3cgbmV3IEVycm9yKFwiaGV4VG9CeXRlcyBjYW4ndCBoYXZlIGEgc3RyaW5nIHdpdGggYW4gb2RkIG51bWJlciBvZiBjaGFyYWN0ZXJzLlwiKVxuICAgIGlmIChoZXguaW5kZXhPZignMHgnKSA9PT0gMCkgaGV4ID0gaGV4LnNsaWNlKDIpXG4gICAgcmV0dXJuIGhleC5tYXRjaCgvLi4vZykubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHBhcnNlSW50KHgsMTYpIH0pXG4gIH1cbn1cblxuXG4vLyBQUklWQVRFXG5cbmZ1bmN0aW9uIGFyckJ5dGVzVG9IZXgoYnl0ZXMpIHtcbiAgcmV0dXJuIGJ5dGVzLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBwYWRMZWZ0KHgudG9TdHJpbmcoMTYpLDIpIH0pLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIHBhZExlZnQob3JpZywgbGVuKSB7XG4gIGlmIChvcmlnLmxlbmd0aCA+IGxlbikgcmV0dXJuIG9yaWdcbiAgcmV0dXJuIEFycmF5KGxlbiAtIG9yaWcubGVuZ3RoICsgMSkuam9pbignMCcpICsgb3JpZ1xufVxuXG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgeyAvL0NvbW1vbkpTXG4gIG1vZHVsZS5leHBvcnRzID0gY29udmVydEhleFxufSBlbHNlIHtcbiAgZ2xvYmFscy5jb252ZXJ0SGV4ID0gY29udmVydEhleFxufVxuXG59KHRoaXMpOyIsIiFmdW5jdGlvbihnbG9iYWxzKSB7XG4ndXNlIHN0cmljdCdcblxudmFyIGNvbnZlcnRTdHJpbmcgPSB7XG4gIGJ5dGVzVG9TdHJpbmc6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgcmV0dXJuIGJ5dGVzLm1hcChmdW5jdGlvbih4KXsgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoeCkgfSkuam9pbignJylcbiAgfSxcbiAgc3RyaW5nVG9CeXRlczogZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgnJykubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHguY2hhckNvZGVBdCgwKSB9KVxuICB9XG59XG5cbi8vaHR0cDovL2hvc3NhLmluLzIwMTIvMDcvMjAvdXRmLTgtaW4tamF2YXNjcmlwdC5odG1sXG5jb252ZXJ0U3RyaW5nLlVURjggPSB7XG4gICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKGNvbnZlcnRTdHJpbmcuYnl0ZXNUb1N0cmluZyhieXRlcykpKVxuICB9LFxuICBzdHJpbmdUb0J5dGVzOiBmdW5jdGlvbihzdHIpIHtcbiAgIHJldHVybiBjb252ZXJ0U3RyaW5nLnN0cmluZ1RvQnl0ZXModW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpKVxuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgeyAvL0NvbW1vbkpTXG4gIG1vZHVsZS5leHBvcnRzID0gY29udmVydFN0cmluZ1xufSBlbHNlIHtcbiAgZ2xvYmFscy5jb252ZXJ0U3RyaW5nID0gY29udmVydFN0cmluZ1xufVxuXG59KHRoaXMpOyIsImV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiLyoqXG4gKiBNaWNyb0V2ZW50IC0gdG8gbWFrZSBhbnkganMgb2JqZWN0IGFuIGV2ZW50IGVtaXR0ZXIgKHNlcnZlciBvciBicm93c2VyKVxuICogXG4gKiAtIHB1cmUgamF2YXNjcmlwdCAtIHNlcnZlciBjb21wYXRpYmxlLCBicm93c2VyIGNvbXBhdGlibGVcbiAqIC0gZG9udCByZWx5IG9uIHRoZSBicm93c2VyIGRvbXNcbiAqIC0gc3VwZXIgc2ltcGxlIC0geW91IGdldCBpdCBpbW1lZGlhdGx5LCBubyBtaXN0ZXJ5LCBubyBtYWdpYyBpbnZvbHZlZFxuICpcbiAqIC0gY3JlYXRlIGEgTWljcm9FdmVudERlYnVnIHdpdGggZ29vZGllcyB0byBkZWJ1Z1xuICogICAtIG1ha2UgaXQgc2FmZXIgdG8gdXNlXG4qL1xuXG52YXIgTWljcm9FdmVudFx0PSBmdW5jdGlvbigpe31cbk1pY3JvRXZlbnQucHJvdG90eXBlXHQ9IHtcblx0YmluZFx0OiBmdW5jdGlvbihldmVudCwgZmN0KXtcblx0XHR0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG5cdFx0dGhpcy5fZXZlbnRzW2V2ZW50XSA9IHRoaXMuX2V2ZW50c1tldmVudF1cdHx8IFtdO1xuXHRcdHRoaXMuX2V2ZW50c1tldmVudF0ucHVzaChmY3QpO1xuXHR9LFxuXHR1bmJpbmRcdDogZnVuY3Rpb24oZXZlbnQsIGZjdCl7XG5cdFx0dGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuXHRcdGlmKCBldmVudCBpbiB0aGlzLl9ldmVudHMgPT09IGZhbHNlICApXHRyZXR1cm47XG5cdFx0dGhpcy5fZXZlbnRzW2V2ZW50XS5zcGxpY2UodGhpcy5fZXZlbnRzW2V2ZW50XS5pbmRleE9mKGZjdCksIDEpO1xuXHR9LFxuXHR0cmlnZ2VyXHQ6IGZ1bmN0aW9uKGV2ZW50IC8qICwgYXJncy4uLiAqLyl7XG5cdFx0dGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuXHRcdGlmKCBldmVudCBpbiB0aGlzLl9ldmVudHMgPT09IGZhbHNlICApXHRyZXR1cm47XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMuX2V2ZW50c1tldmVudF0ubGVuZ3RoOyBpKyspe1xuXHRcdFx0dGhpcy5fZXZlbnRzW2V2ZW50XVtpXS5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKVxuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBtaXhpbiB3aWxsIGRlbGVnYXRlIGFsbCBNaWNyb0V2ZW50LmpzIGZ1bmN0aW9uIGluIHRoZSBkZXN0aW5hdGlvbiBvYmplY3RcbiAqXG4gKiAtIHJlcXVpcmUoJ01pY3JvRXZlbnQnKS5taXhpbihGb29iYXIpIHdpbGwgbWFrZSBGb29iYXIgYWJsZSB0byB1c2UgTWljcm9FdmVudFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGUgb2JqZWN0IHdoaWNoIHdpbGwgc3VwcG9ydCBNaWNyb0V2ZW50XG4qL1xuTWljcm9FdmVudC5taXhpblx0PSBmdW5jdGlvbihkZXN0T2JqZWN0KXtcblx0dmFyIHByb3BzXHQ9IFsnYmluZCcsICd1bmJpbmQnLCAndHJpZ2dlciddO1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpICsrKXtcblx0XHRkZXN0T2JqZWN0LnByb3RvdHlwZVtwcm9wc1tpXV1cdD0gTWljcm9FdmVudC5wcm90b3R5cGVbcHJvcHNbaV1dO1xuXHR9XG59XG5cbi8vIGV4cG9ydCBpbiBjb21tb24ganNcbmlmKCB0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmICgnZXhwb3J0cycgaW4gbW9kdWxlKSl7XG5cdG1vZHVsZS5leHBvcnRzXHQ9IE1pY3JvRXZlbnRcbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIhZnVuY3Rpb24oZ2xvYmFscykge1xuJ3VzZSBzdHJpY3QnXG5cbnZhciBfaW1wb3J0cyA9IHt9XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgeyAvL0NvbW1vbkpTXG4gIF9pbXBvcnRzLmJ5dGVzVG9IZXggPSByZXF1aXJlKCdjb252ZXJ0LWhleCcpLmJ5dGVzVG9IZXhcbiAgX2ltcG9ydHMuY29udmVydFN0cmluZyA9IHJlcXVpcmUoJ2NvbnZlcnQtc3RyaW5nJylcbiAgbW9kdWxlLmV4cG9ydHMgPSBzaGEyNTZcbn0gZWxzZSB7XG4gIF9pbXBvcnRzLmJ5dGVzVG9IZXggPSBnbG9iYWxzLmNvbnZlcnRIZXguYnl0ZXNUb0hleFxuICBfaW1wb3J0cy5jb252ZXJ0U3RyaW5nID0gZ2xvYmFscy5jb252ZXJ0U3RyaW5nXG4gIGdsb2JhbHMuc2hhMjU2ID0gc2hhMjU2XG59XG5cbi8qXG5DcnlwdG9KUyB2My4xLjJcbmNvZGUuZ29vZ2xlLmNvbS9wL2NyeXB0by1qc1xuKGMpIDIwMDktMjAxMyBieSBKZWZmIE1vdHQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5jb2RlLmdvb2dsZS5jb20vcC9jcnlwdG8tanMvd2lraS9MaWNlbnNlXG4qL1xuXG4vLyBJbml0aWFsaXphdGlvbiByb3VuZCBjb25zdGFudHMgdGFibGVzXG52YXIgSyA9IFtdXG5cbi8vIENvbXB1dGUgY29uc3RhbnRzXG4hZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBpc1ByaW1lKG4pIHtcbiAgICB2YXIgc3FydE4gPSBNYXRoLnNxcnQobik7XG4gICAgZm9yICh2YXIgZmFjdG9yID0gMjsgZmFjdG9yIDw9IHNxcnROOyBmYWN0b3IrKykge1xuICAgICAgaWYgKCEobiAlIGZhY3RvcikpIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBnZXRGcmFjdGlvbmFsQml0cyhuKSB7XG4gICAgcmV0dXJuICgobiAtIChuIHwgMCkpICogMHgxMDAwMDAwMDApIHwgMFxuICB9XG5cbiAgdmFyIG4gPSAyXG4gIHZhciBuUHJpbWUgPSAwXG4gIHdoaWxlIChuUHJpbWUgPCA2NCkge1xuICAgIGlmIChpc1ByaW1lKG4pKSB7XG4gICAgICBLW25QcmltZV0gPSBnZXRGcmFjdGlvbmFsQml0cyhNYXRoLnBvdyhuLCAxIC8gMykpXG4gICAgICBuUHJpbWUrK1xuICAgIH1cblxuICAgIG4rK1xuICB9XG59KClcblxudmFyIGJ5dGVzVG9Xb3JkcyA9IGZ1bmN0aW9uIChieXRlcykge1xuICB2YXIgd29yZHMgPSBbXVxuICBmb3IgKHZhciBpID0gMCwgYiA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKywgYiArPSA4KSB7XG4gICAgd29yZHNbYiA+Pj4gNV0gfD0gYnl0ZXNbaV0gPDwgKDI0IC0gYiAlIDMyKVxuICB9XG4gIHJldHVybiB3b3Jkc1xufVxuXG52YXIgd29yZHNUb0J5dGVzID0gZnVuY3Rpb24gKHdvcmRzKSB7XG4gIHZhciBieXRlcyA9IFtdXG4gIGZvciAodmFyIGIgPSAwOyBiIDwgd29yZHMubGVuZ3RoICogMzI7IGIgKz0gOCkge1xuICAgIGJ5dGVzLnB1c2goKHdvcmRzW2IgPj4+IDVdID4+PiAoMjQgLSBiICUgMzIpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbi8vIFJldXNhYmxlIG9iamVjdFxudmFyIFcgPSBbXVxuXG52YXIgcHJvY2Vzc0Jsb2NrID0gZnVuY3Rpb24gKEgsIE0sIG9mZnNldCkge1xuICAvLyBXb3JraW5nIHZhcmlhYmxlc1xuICB2YXIgYSA9IEhbMF0sIGIgPSBIWzFdLCBjID0gSFsyXSwgZCA9IEhbM11cbiAgdmFyIGUgPSBIWzRdLCBmID0gSFs1XSwgZyA9IEhbNl0sIGggPSBIWzddXG5cbiAgICAvLyBDb21wdXRhdGlvblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDY0OyBpKyspIHtcbiAgICBpZiAoaSA8IDE2KSB7XG4gICAgICBXW2ldID0gTVtvZmZzZXQgKyBpXSB8IDBcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGdhbW1hMHggPSBXW2kgLSAxNV1cbiAgICAgIHZhciBnYW1tYTAgID0gKChnYW1tYTB4IDw8IDI1KSB8IChnYW1tYTB4ID4+PiA3KSkgIF5cbiAgICAgICAgICAgICAgICAgICAgKChnYW1tYTB4IDw8IDE0KSB8IChnYW1tYTB4ID4+PiAxOCkpIF5cbiAgICAgICAgICAgICAgICAgICAgKGdhbW1hMHggPj4+IDMpXG5cbiAgICAgIHZhciBnYW1tYTF4ID0gV1tpIC0gMl07XG4gICAgICB2YXIgZ2FtbWExICA9ICgoZ2FtbWExeCA8PCAxNSkgfCAoZ2FtbWExeCA+Pj4gMTcpKSBeXG4gICAgICAgICAgICAgICAgICAgICgoZ2FtbWExeCA8PCAxMykgfCAoZ2FtbWExeCA+Pj4gMTkpKSBeXG4gICAgICAgICAgICAgICAgICAgIChnYW1tYTF4ID4+PiAxMClcblxuICAgICAgV1tpXSA9IGdhbW1hMCArIFdbaSAtIDddICsgZ2FtbWExICsgV1tpIC0gMTZdO1xuICAgIH1cblxuICAgIHZhciBjaCAgPSAoZSAmIGYpIF4gKH5lICYgZyk7XG4gICAgdmFyIG1haiA9IChhICYgYikgXiAoYSAmIGMpIF4gKGIgJiBjKTtcblxuICAgIHZhciBzaWdtYTAgPSAoKGEgPDwgMzApIHwgKGEgPj4+IDIpKSBeICgoYSA8PCAxOSkgfCAoYSA+Pj4gMTMpKSBeICgoYSA8PCAxMCkgfCAoYSA+Pj4gMjIpKTtcbiAgICB2YXIgc2lnbWExID0gKChlIDw8IDI2KSB8IChlID4+PiA2KSkgXiAoKGUgPDwgMjEpIHwgKGUgPj4+IDExKSkgXiAoKGUgPDwgNykgIHwgKGUgPj4+IDI1KSk7XG5cbiAgICB2YXIgdDEgPSBoICsgc2lnbWExICsgY2ggKyBLW2ldICsgV1tpXTtcbiAgICB2YXIgdDIgPSBzaWdtYTAgKyBtYWo7XG5cbiAgICBoID0gZztcbiAgICBnID0gZjtcbiAgICBmID0gZTtcbiAgICBlID0gKGQgKyB0MSkgfCAwO1xuICAgIGQgPSBjO1xuICAgIGMgPSBiO1xuICAgIGIgPSBhO1xuICAgIGEgPSAodDEgKyB0MikgfCAwO1xuICB9XG5cbiAgLy8gSW50ZXJtZWRpYXRlIGhhc2ggdmFsdWVcbiAgSFswXSA9IChIWzBdICsgYSkgfCAwO1xuICBIWzFdID0gKEhbMV0gKyBiKSB8IDA7XG4gIEhbMl0gPSAoSFsyXSArIGMpIHwgMDtcbiAgSFszXSA9IChIWzNdICsgZCkgfCAwO1xuICBIWzRdID0gKEhbNF0gKyBlKSB8IDA7XG4gIEhbNV0gPSAoSFs1XSArIGYpIHwgMDtcbiAgSFs2XSA9IChIWzZdICsgZykgfCAwO1xuICBIWzddID0gKEhbN10gKyBoKSB8IDA7XG59XG5cbmZ1bmN0aW9uIHNoYTI1NihtZXNzYWdlLCBvcHRpb25zKSB7O1xuICBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gU3RyaW5nKSB7XG4gICAgbWVzc2FnZSA9IF9pbXBvcnRzLmNvbnZlcnRTdHJpbmcuVVRGOC5zdHJpbmdUb0J5dGVzKG1lc3NhZ2UpO1xuICB9XG5cbiAgdmFyIEggPVsgMHg2QTA5RTY2NywgMHhCQjY3QUU4NSwgMHgzQzZFRjM3MiwgMHhBNTRGRjUzQSxcbiAgICAgICAgICAgMHg1MTBFNTI3RiwgMHg5QjA1Njg4QywgMHgxRjgzRDlBQiwgMHg1QkUwQ0QxOSBdO1xuXG4gIHZhciBtID0gYnl0ZXNUb1dvcmRzKG1lc3NhZ2UpO1xuICB2YXIgbCA9IG1lc3NhZ2UubGVuZ3RoICogODtcblxuICBtW2wgPj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBsICUgMzIpO1xuICBtWygobCArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbDtcblxuICBmb3IgKHZhciBpPTAgOyBpPG0ubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgcHJvY2Vzc0Jsb2NrKEgsIG0sIGkpO1xuICB9XG5cbiAgdmFyIGRpZ2VzdGJ5dGVzID0gd29yZHNUb0J5dGVzKEgpO1xuICByZXR1cm4gb3B0aW9ucyAmJiBvcHRpb25zLmFzQnl0ZXMgPyBkaWdlc3RieXRlcyA6XG4gICAgICAgICBvcHRpb25zICYmIG9wdGlvbnMuYXNTdHJpbmcgPyBfaW1wb3J0cy5jb252ZXJ0U3RyaW5nLmJ5dGVzVG9TdHJpbmcoZGlnZXN0Ynl0ZXMpIDpcbiAgICAgICAgIF9pbXBvcnRzLmJ5dGVzVG9IZXgoZGlnZXN0Ynl0ZXMpXG59XG5cbnNoYTI1Ni54MiA9IGZ1bmN0aW9uKG1lc3NhZ2UsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNoYTI1NihzaGEyNTYobWVzc2FnZSwgeyBhc0J5dGVzOnRydWUgfSksIG9wdGlvbnMpXG59XG5cbn0odGhpcyk7XG4iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQW5pbWF0aW9uXG4gICAgY29uc3RydWN0b3I6IChAZWwpIC0+XG4gICAgICAgIEBydW4gPSAwXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBhbmltYXRlOiAob3B0aW9ucyA9IHt9LCBjYWxsYmFjayA9IC0+KSAtPlxuICAgICAgICB4ID0gb3B0aW9ucy54ID8gMFxuICAgICAgICB5ID0gb3B0aW9ucy55ID8gMFxuICAgICAgICBzY2FsZSA9IG9wdGlvbnMuc2NhbGUgPyAxXG4gICAgICAgIGVhc2luZyA9IG9wdGlvbnMuZWFzaW5nID8gJ2Vhc2Utb3V0J1xuICAgICAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gPyAwXG4gICAgICAgIHJ1biA9ICsrQHJ1blxuICAgICAgICB0cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZTNkKCN7eH0sICN7eX0sIDBweCkgc2NhbGUzZCgje3NjYWxlfSwgI3tzY2FsZX0sIDEpXCJcblxuICAgICAgICBpZiBAZWwuc3R5bGUudHJhbnNmb3JtIGlzIHRyYW5zZm9ybVxuICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICBlbHNlIGlmIGR1cmF0aW9uID4gMFxuICAgICAgICAgICAgdHJhbnNpdGlvbkVuZCA9ID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIHJ1biBpc250IEBydW5cblxuICAgICAgICAgICAgICAgIEBlbC5yZW1vdmVFdmVudExpc3RlbmVyICd0cmFuc2l0aW9uZW5kJywgdHJhbnNpdGlvbkVuZFxuICAgICAgICAgICAgICAgIEBlbC5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnXG5cbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpXG5cbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgQGVsLmFkZEV2ZW50TGlzdGVuZXIgJ3RyYW5zaXRpb25lbmQnLCB0cmFuc2l0aW9uRW5kLCBmYWxzZVxuXG4gICAgICAgICAgICBAZWwuc3R5bGUudHJhbnNpdGlvbiA9IFwidHJhbnNmb3JtICN7ZWFzaW5nfSAje2R1cmF0aW9ufW1zXCJcbiAgICAgICAgICAgIEBlbC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGVsLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSdcbiAgICAgICAgICAgIEBlbC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cblxuICAgICAgICAgICAgY2FsbGJhY2soKVxuXG4gICAgICAgIEBcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFnZVNwcmVhZFxuICAgIGNvbnN0cnVjdG9yOiAoQGVsLCBAb3B0aW9ucyA9IHt9KSAtPlxuICAgICAgICBAdmlzaWJpbGl0eSA9ICdnb25lJ1xuICAgICAgICBAcG9zaXRpb25lZCA9IGZhbHNlXG4gICAgICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgICAgICBAaWQgPSBAb3B0aW9ucy5pZFxuICAgICAgICBAdHlwZSA9IEBvcHRpb25zLnR5cGVcbiAgICAgICAgQHBhZ2VJZHMgPSBAb3B0aW9ucy5wYWdlSWRzXG4gICAgICAgIEB3aWR0aCA9IEBvcHRpb25zLndpZHRoXG4gICAgICAgIEBsZWZ0ID0gQG9wdGlvbnMubGVmdFxuICAgICAgICBAbWF4Wm9vbVNjYWxlID0gQG9wdGlvbnMubWF4Wm9vbVNjYWxlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBpc1pvb21hYmxlOiAtPlxuICAgICAgICBAZ2V0TWF4Wm9vbVNjYWxlKCkgPiAxIGFuZCBAZ2V0RWwoKS5kYXRhc2V0Lnpvb21hYmxlIGlzbnQgJ2ZhbHNlJ1xuXG4gICAgZ2V0RWw6IC0+XG4gICAgICAgIEBlbFxuXG4gICAgZ2V0T3ZlcmxheUVsczogLT5cbiAgICAgICAgQGdldEVsKCkucXVlcnlTZWxlY3RvckFsbCAnLnZlcnNvX19vdmVybGF5J1xuXG4gICAgZ2V0UGFnZUVsczogLT5cbiAgICAgICAgQGdldEVsKCkucXVlcnlTZWxlY3RvckFsbCAnLnZlcnNvX19wYWdlJ1xuXG4gICAgZ2V0UmVjdDogLT5cbiAgICAgICAgQGdldEVsKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGdldENvbnRlbnRSZWN0OiAtPlxuICAgICAgICByZWN0ID1cbiAgICAgICAgICAgIHRvcDogbnVsbFxuICAgICAgICAgICAgbGVmdDogbnVsbFxuICAgICAgICAgICAgcmlnaHQ6IG51bGxcbiAgICAgICAgICAgIGJvdHRvbTogbnVsbFxuICAgICAgICAgICAgd2lkdGg6IG51bGxcbiAgICAgICAgICAgIGhlaWdodDogbnVsbFxuICAgICAgICAgICAgXG4gICAgICAgIGZvciBwYWdlRWwgaW4gQGdldFBhZ2VFbHMoKVxuICAgICAgICAgICAgcGFnZVJlY3QgPSBwYWdlRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgICAgICAgcmVjdC50b3AgPSBwYWdlUmVjdC50b3AgaWYgcGFnZVJlY3QudG9wIDwgcmVjdC50b3Agb3Igbm90IHJlY3QudG9wP1xuICAgICAgICAgICAgcmVjdC5sZWZ0ID0gcGFnZVJlY3QubGVmdCBpZiBwYWdlUmVjdC5sZWZ0IDwgcmVjdC5sZWZ0IG9yIG5vdCByZWN0LmxlZnQ/XG4gICAgICAgICAgICByZWN0LnJpZ2h0ID0gcGFnZVJlY3QucmlnaHQgaWYgcGFnZVJlY3QucmlnaHQgPiByZWN0LnJpZ2h0IG9yIG5vdCByZWN0LnJpZ2h0P1xuICAgICAgICAgICAgcmVjdC5ib3R0b20gPSBwYWdlUmVjdC5ib3R0b20gaWYgcGFnZVJlY3QuYm90dG9tID4gcmVjdC5ib3R0b20gb3Igbm90IHJlY3QuYm90dG9tP1xuXG4gICAgICAgIHJlY3QudG9wID0gcmVjdC50b3AgPyAwXG4gICAgICAgIHJlY3QubGVmdCA9IHJlY3QubGVmdCA/IDBcbiAgICAgICAgcmVjdC5yaWdodCA9IHJlY3QucmlnaHQgPyAwXG4gICAgICAgIHJlY3QuYm90dG9tID0gcmVjdC5ib3R0b20gPyAwXG4gICAgICAgIHJlY3Qud2lkdGggPSByZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0XG4gICAgICAgIHJlY3QuaGVpZ2h0ID0gcmVjdC5ib3R0b20gLSByZWN0LnRvcFxuXG4gICAgICAgIHJlY3RcblxuICAgIGdldElkOiAtPlxuICAgICAgICBAaWRcblxuICAgIGdldFR5cGU6IC0+XG4gICAgICAgIEB0eXBlXG5cbiAgICBnZXRQYWdlSWRzOiAtPlxuICAgICAgICBAcGFnZUlkc1xuXG4gICAgZ2V0V2lkdGg6IC0+XG4gICAgICAgIEB3aWR0aFxuXG4gICAgZ2V0TGVmdDogLT5cbiAgICAgICAgQGxlZnRcblxuICAgIGdldE1heFpvb21TY2FsZTogLT5cbiAgICAgICAgQG1heFpvb21TY2FsZVxuXG4gICAgZ2V0VmlzaWJpbGl0eTogLT5cbiAgICAgICAgQHZpc2liaWxpdHlcblxuICAgIHNldFZpc2liaWxpdHk6ICh2aXNpYmlsaXR5KSAtPlxuICAgICAgICBpZiBAdmlzaWJpbGl0eSBpc250IHZpc2liaWxpdHlcbiAgICAgICAgICAgIEBnZXRFbCgpLnN0eWxlLmRpc3BsYXkgPSBpZiB2aXNpYmlsaXR5IGlzICd2aXNpYmxlJyB0aGVuICdibG9jaycgZWxzZSAnbm9uZSdcblxuICAgICAgICAgICAgQHZpc2liaWxpdHkgPSB2aXNpYmlsaXR5XG5cbiAgICAgICAgQFxuXG4gICAgcG9zaXRpb246IC0+XG4gICAgICAgIGlmIEBwb3NpdGlvbmVkIGlzIGZhbHNlXG4gICAgICAgICAgICBAZ2V0RWwoKS5zdHlsZS5sZWZ0ID0gXCIje0BnZXRMZWZ0KCl9JVwiXG5cbiAgICAgICAgICAgIEBwb3NpdGlvbmVkID0gdHJ1ZVxuXG4gICAgICAgIEBcblxuICAgIGFjdGl2YXRlOiAtPlxuICAgICAgICBAYWN0aXZlID0gdHJ1ZVxuICAgICAgICBAZ2V0RWwoKS5kYXRhc2V0LmFjdGl2ZSA9IHRydWVcblxuICAgICAgICByZXR1cm5cblxuICAgIGRlYWN0aXZhdGU6IC0+XG4gICAgICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgICAgICBAZ2V0RWwoKS5kYXRhc2V0LmFjdGl2ZSA9IGZhbHNlXG5cbiAgICAgICAgcmV0dXJuXG4iLCJIYW1tZXIgPSByZXF1aXJlICdoYW1tZXJqcydcbk1pY3JvRXZlbnQgPSByZXF1aXJlICdtaWNyb2V2ZW50J1xuUGFnZVNwcmVhZCA9IHJlcXVpcmUgJy4vcGFnZV9zcHJlYWQnXG5BbmltYXRpb24gPSByZXF1aXJlICcuL2FuaW1hdGlvbidcblxuY2xhc3MgVmVyc29cbiAgICBjb25zdHJ1Y3RvcjogKEBlbCwgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICAgICAgQHN3aXBlVmVsb2NpdHkgPSBAb3B0aW9ucy5zd2lwZVZlbG9jaXR5ID8gMC4zXG4gICAgICAgIEBzd2lwZVRocmVzaG9sZCA9IEBvcHRpb25zLnN3aXBlVGhyZXNob2xkID8gMTBcbiAgICAgICAgQG5hdmlnYXRpb25EdXJhdGlvbiA9IEBvcHRpb25zLm5hdmlnYXRpb25EdXJhdGlvbiA/IDI0MFxuICAgICAgICBAbmF2aWdhdGlvblBhbkR1cmF0aW9uID0gQG9wdGlvbnMubmF2aWdhdGlvblBhbkR1cmF0aW9uID8gMjAwXG4gICAgICAgIEB6b29tRHVyYXRpb24gPSBAb3B0aW9ucy56b29tRHVyYXRpb24gPyAyMDBcblxuICAgICAgICBAcG9zaXRpb24gPSAtMVxuICAgICAgICBAcGluY2hpbmcgPSBmYWxzZVxuICAgICAgICBAcGFubmluZyA9IGZhbHNlXG4gICAgICAgIEB0cmFuc2Zvcm0gPSBsZWZ0OiAwLCB0b3A6IDAsIHNjYWxlOiAxXG4gICAgICAgIEBzdGFydFRyYW5zZm9ybSA9IGxlZnQ6IDAsIHRvcDogMCwgc2NhbGU6IDFcbiAgICAgICAgQHRhcCA9XG4gICAgICAgICAgICBjb3VudDogMFxuICAgICAgICAgICAgZGVsYXk6IDI1MFxuICAgICAgICAgICAgdGltZW91dDogbnVsbFxuXG4gICAgICAgIEBzY3JvbGxlckVsID0gQGVsLnF1ZXJ5U2VsZWN0b3IgJy52ZXJzb19fc2Nyb2xsZXInXG4gICAgICAgIEBwYWdlU3ByZWFkRWxzID0gQGVsLnF1ZXJ5U2VsZWN0b3JBbGwgJy52ZXJzb19fcGFnZS1zcHJlYWQnXG4gICAgICAgIEBwYWdlU3ByZWFkcyA9IEB0cmF2ZXJzZVBhZ2VTcHJlYWRzIEBwYWdlU3ByZWFkRWxzXG4gICAgICAgIEBwYWdlSWRzID0gQGJ1aWxkUGFnZUlkcyBAcGFnZVNwcmVhZHNcbiAgICAgICAgQGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24gQHNjcm9sbGVyRWxcbiAgICAgICAgQGhhbW1lciA9IG5ldyBIYW1tZXIuTWFuYWdlciBAc2Nyb2xsZXJFbCxcbiAgICAgICAgICAgIHRvdWNoQWN0aW9uOiAnYXV0bydcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2VcbiAgICAgICAgICAgICMgUHJlZmVyIHRvdWNoIGlucHV0IGlmIHBvc3NpYmxlIHNpbmNlIEFuZHJvaWQgYWN0cyB3ZWlyZCB3aGVuIHVzaW5nIHBvaW50ZXIgZXZlbnRzLlxuICAgICAgICAgICAgaW5wdXRDbGFzczogaWYgJ29udG91Y2hzdGFydCcgb2Ygd2luZG93IHRoZW4gSGFtbWVyLlRvdWNoSW5wdXQgZWxzZSBudWxsXG5cbiAgICAgICAgQGhhbW1lci5hZGQgbmV3IEhhbW1lci5QYW4gZGlyZWN0aW9uOiBIYW1tZXIuRElSRUNUSU9OX0FMTFxuICAgICAgICBAaGFtbWVyLmFkZCBuZXcgSGFtbWVyLlRhcCBldmVudDogJ3NpbmdsZXRhcCcsIGludGVydmFsOiAwXG4gICAgICAgIEBoYW1tZXIuYWRkIG5ldyBIYW1tZXIuUGluY2goKVxuICAgICAgICBAaGFtbWVyLmFkZCBuZXcgSGFtbWVyLlByZXNzIHRpbWU6IDUwMFxuICAgICAgICBAaGFtbWVyLm9uICdwYW5zdGFydCcsIEBwYW5TdGFydC5iaW5kIEBcbiAgICAgICAgQGhhbW1lci5vbiAncGFubW92ZScsIEBwYW5Nb3ZlLmJpbmQgQFxuICAgICAgICBAaGFtbWVyLm9uICdwYW5lbmQnLCBAcGFuRW5kLmJpbmQgQFxuICAgICAgICBAaGFtbWVyLm9uICdwYW5jYW5jZWwnLCBAcGFuRW5kLmJpbmQgQFxuICAgICAgICBAaGFtbWVyLm9uICdzaW5nbGV0YXAnLCBAc2luZ2xldGFwLmJpbmQgQFxuICAgICAgICBAaGFtbWVyLm9uICdwaW5jaHN0YXJ0JywgQHBpbmNoU3RhcnQuYmluZCBAXG4gICAgICAgIEBoYW1tZXIub24gJ3BpbmNobW92ZScsIEBwaW5jaE1vdmUuYmluZCBAXG4gICAgICAgIEBoYW1tZXIub24gJ3BpbmNoZW5kJywgQHBpbmNoRW5kLmJpbmQgQFxuICAgICAgICBAaGFtbWVyLm9uICdwaW5jaGNhbmNlbCcsIEBwaW5jaEVuZC5iaW5kIEBcbiAgICAgICAgQGhhbW1lci5vbiAncHJlc3MnLCBAcHJlc3MuYmluZCBAXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBzdGFydDogLT5cbiAgICAgICAgcGFnZUlkID0gQGdldFBhZ2VTcHJlYWRQb3NpdGlvbkZyb21QYWdlSWQoQG9wdGlvbnMucGFnZUlkKSA/IDBcblxuICAgICAgICBAaGFtbWVyLnNldCBlbmFibGU6IHRydWVcbiAgICAgICAgQG5hdmlnYXRlVG8gcGFnZUlkLCBkdXJhdGlvbjogMFxuXG4gICAgICAgIEByZXNpemVMaXN0ZW5lciA9IEByZXNpemUuYmluZCBAXG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIEByZXNpemVMaXN0ZW5lciwgZmFsc2VcblxuICAgICAgICByZXR1cm5cblxuICAgIGRlc3Ryb3k6IC0+XG4gICAgICAgIEBoYW1tZXIuZGVzdHJveSgpXG5cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIEByZXNpemVMaXN0ZW5lclxuXG4gICAgICAgIEBcblxuICAgIGZpcnN0OiAob3B0aW9ucykgLT5cbiAgICAgICAgQG5hdmlnYXRlVG8gMCwgb3B0aW9uc1xuXG4gICAgcHJldjogKG9wdGlvbnMpIC0+XG4gICAgICAgIEBuYXZpZ2F0ZVRvIEBnZXRQb3NpdGlvbigpIC0gMSwgb3B0aW9uc1xuXG4gICAgbmV4dDogKG9wdGlvbnMpIC0+XG4gICAgICAgIEBuYXZpZ2F0ZVRvIEBnZXRQb3NpdGlvbigpICsgMSwgb3B0aW9uc1xuXG4gICAgbGFzdDogKG9wdGlvbnMpIC0+XG4gICAgICAgIEBuYXZpZ2F0ZVRvIEBnZXRQYWdlU3ByZWFkQ291bnQoKSAtIDEsIG9wdGlvbnNcblxuICAgIG5hdmlnYXRlVG86IChwb3NpdGlvbiwgb3B0aW9ucyA9IHt9KSAtPlxuICAgICAgICByZXR1cm4gaWYgcG9zaXRpb24gPCAwIG9yIHBvc2l0aW9uID4gQGdldFBhZ2VTcHJlYWRDb3VudCgpIC0gMVxuXG4gICAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IEBnZXRQb3NpdGlvbigpXG4gICAgICAgIGN1cnJlbnRQYWdlU3ByZWFkID0gQGdldFBhZ2VTcHJlYWRGcm9tUG9zaXRpb24gY3VycmVudFBvc2l0aW9uXG4gICAgICAgIGFjdGl2ZVBhZ2VTcHJlYWQgPSBAZ2V0UGFnZVNwcmVhZEZyb21Qb3NpdGlvbiBwb3NpdGlvblxuICAgICAgICBjYXJvdXNlbCA9IEBnZXRDYXJvdXNlbEZyb21QYWdlU3ByZWFkIGFjdGl2ZVBhZ2VTcHJlYWRcbiAgICAgICAgdmVsb2NpdHkgPSBvcHRpb25zLnZlbG9jaXR5ID8gMVxuICAgICAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gPyBAbmF2aWdhdGlvbkR1cmF0aW9uXG4gICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24gLyBNYXRoLmFicyh2ZWxvY2l0eSlcblxuICAgICAgICBjdXJyZW50UGFnZVNwcmVhZC5kZWFjdGl2YXRlKCkgaWYgY3VycmVudFBhZ2VTcHJlYWQ/XG4gICAgICAgIGFjdGl2ZVBhZ2VTcHJlYWQuYWN0aXZhdGUoKVxuXG4gICAgICAgIGNhcm91c2VsLnZpc2libGUuZm9yRWFjaCAocGFnZVNwcmVhZCkgLT4gcGFnZVNwcmVhZC5wb3NpdGlvbigpLnNldFZpc2liaWxpdHkgJ3Zpc2libGUnXG5cbiAgICAgICAgQHRyYW5zZm9ybS5sZWZ0ID0gQGdldExlZnRUcmFuc2Zvcm1Gcm9tUGFnZVNwcmVhZCBwb3NpdGlvbiwgYWN0aXZlUGFnZVNwcmVhZFxuICAgICAgICBAc2V0UG9zaXRpb24gcG9zaXRpb25cblxuICAgICAgICBpZiBAdHJhbnNmb3JtLnNjYWxlID4gMVxuICAgICAgICAgICAgQHRyYW5zZm9ybS50b3AgPSAwXG4gICAgICAgICAgICBAdHJhbnNmb3JtLnNjYWxlID0gMVxuXG4gICAgICAgICAgICBAdHJpZ2dlciAnem9vbWVkT3V0JywgcG9zaXRpb246IGN1cnJlbnRQb3NpdGlvblxuXG4gICAgICAgIEB0cmlnZ2VyICdiZWZvcmVOYXZpZ2F0aW9uJyxcbiAgICAgICAgICAgIGN1cnJlbnRQb3NpdGlvbjogY3VycmVudFBvc2l0aW9uXG4gICAgICAgICAgICBuZXdQb3NpdGlvbjogcG9zaXRpb25cblxuICAgICAgICBAYW5pbWF0aW9uLmFuaW1hdGVcbiAgICAgICAgICAgIHg6IFwiI3tAdHJhbnNmb3JtLmxlZnR9JVwiXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb25cbiAgICAgICAgLCA9PlxuICAgICAgICAgICAgY2Fyb3VzZWwgPSBAZ2V0Q2Fyb3VzZWxGcm9tUGFnZVNwcmVhZCBAZ2V0QWN0aXZlUGFnZVNwcmVhZCgpXG5cbiAgICAgICAgICAgIGNhcm91c2VsLmdvbmUuZm9yRWFjaCAocGFnZVNwcmVhZCkgLT4gcGFnZVNwcmVhZC5zZXRWaXNpYmlsaXR5ICdnb25lJ1xuXG4gICAgICAgICAgICBAdHJpZ2dlciAnYWZ0ZXJOYXZpZ2F0aW9uJyxcbiAgICAgICAgICAgICAgICBuZXdQb3NpdGlvbjogQGdldFBvc2l0aW9uKClcbiAgICAgICAgICAgICAgICBwcmV2aW91c1Bvc2l0aW9uOiBjdXJyZW50UG9zaXRpb25cblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBnZXRQb3NpdGlvbjogLT5cbiAgICAgICAgQHBvc2l0aW9uXG5cbiAgICBzZXRQb3NpdGlvbjogKHBvc2l0aW9uKSAtPlxuICAgICAgICBAcG9zaXRpb24gPSBwb3NpdGlvblxuXG4gICAgICAgIEBcblxuICAgIGdldExlZnRUcmFuc2Zvcm1Gcm9tUGFnZVNwcmVhZDogKHBvc2l0aW9uLCBwYWdlU3ByZWFkKSAtPlxuICAgICAgICBsZWZ0ID0gMFxuXG4gICAgICAgIGlmIHBvc2l0aW9uIGlzIEBnZXRQYWdlU3ByZWFkQ291bnQoKSAtIDFcbiAgICAgICAgICAgIGxlZnQgPSAoMTAwIC0gcGFnZVNwcmVhZC5nZXRXaWR0aCgpKSAtIHBhZ2VTcHJlYWQuZ2V0TGVmdCgpXG4gICAgICAgIGVsc2UgaWYgcG9zaXRpb24gPiAwXG4gICAgICAgICAgICBsZWZ0ID0gKDEwMCAtIHBhZ2VTcHJlYWQuZ2V0V2lkdGgoKSkgLyAyIC0gcGFnZVNwcmVhZC5nZXRMZWZ0KClcblxuICAgICAgICBsZWZ0XG5cbiAgICBnZXRDYXJvdXNlbEZyb21QYWdlU3ByZWFkOiAocGFnZVNwcmVhZFN1YmplY3QpIC0+XG4gICAgICAgIGNhcm91c2VsID1cbiAgICAgICAgICAgIHZpc2libGU6IFtdXG4gICAgICAgICAgICBnb25lOiBbXVxuXG4gICAgICAgICMgSWRlbnRpZnkgdGhlIHBhZ2Ugc3ByZWFkcyB0aGF0IHNob3VsZCBiZSBhIHBhcnQgb2YgdGhlIGNhcm91c2VsLlxuICAgICAgICBAcGFnZVNwcmVhZHMuZm9yRWFjaCAocGFnZVNwcmVhZCkgLT5cbiAgICAgICAgICAgIHZpc2libGUgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiBwYWdlU3ByZWFkLmdldExlZnQoKSA8PSBwYWdlU3ByZWFkU3ViamVjdC5nZXRMZWZ0KClcbiAgICAgICAgICAgICAgICB2aXNpYmxlID0gdHJ1ZSBpZiBwYWdlU3ByZWFkLmdldExlZnQoKSArIHBhZ2VTcHJlYWQuZ2V0V2lkdGgoKSA+IHBhZ2VTcHJlYWRTdWJqZWN0LmdldExlZnQoKSAtIDEwMFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHZpc2libGUgPSB0cnVlIGlmIHBhZ2VTcHJlYWQuZ2V0TGVmdCgpIC0gcGFnZVNwcmVhZC5nZXRXaWR0aCgpIDwgcGFnZVNwcmVhZFN1YmplY3QuZ2V0TGVmdCgpICsgMTAwXG5cbiAgICAgICAgICAgIGlmIHZpc2libGUgaXMgdHJ1ZVxuICAgICAgICAgICAgICAgIGNhcm91c2VsLnZpc2libGUucHVzaCBwYWdlU3ByZWFkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2Fyb3VzZWwuZ29uZS5wdXNoIHBhZ2VTcHJlYWRcblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgY2Fyb3VzZWxcblxuICAgIHRyYXZlcnNlUGFnZVNwcmVhZHM6IChlbHMpIC0+XG4gICAgICAgIHBhZ2VTcHJlYWRzID0gW11cbiAgICAgICAgbGVmdCA9IDBcblxuICAgICAgICBmb3IgZWwgaW4gZWxzXG4gICAgICAgICAgICBpZCA9IGVsLmdldEF0dHJpYnV0ZSAnZGF0YS1pZCdcbiAgICAgICAgICAgIHR5cGUgPSBlbC5nZXRBdHRyaWJ1dGUgJ2RhdGEtdHlwZSdcbiAgICAgICAgICAgIHBhZ2VJZHMgPSBlbC5nZXRBdHRyaWJ1dGUgJ2RhdGEtcGFnZS1pZHMnXG4gICAgICAgICAgICBwYWdlSWRzID0gaWYgcGFnZUlkcz8gdGhlbiBwYWdlSWRzLnNwbGl0KCcsJykubWFwIChpKSAtPiBpIGVsc2UgW11cbiAgICAgICAgICAgIG1heFpvb21TY2FsZSA9IGVsLmdldEF0dHJpYnV0ZSAnZGF0YS1tYXgtem9vbS1zY2FsZSdcbiAgICAgICAgICAgIG1heFpvb21TY2FsZSA9IGlmIG1heFpvb21TY2FsZT8gdGhlbiArbWF4Wm9vbVNjYWxlIGVsc2UgMVxuICAgICAgICAgICAgd2lkdGggPSBlbC5nZXRBdHRyaWJ1dGUgJ2RhdGEtd2lkdGgnXG4gICAgICAgICAgICB3aWR0aCA9IGlmIHdpZHRoPyB0aGVuICt3aWR0aCBlbHNlIDEwMFxuICAgICAgICAgICAgcGFnZVNwcmVhZCA9IG5ldyBQYWdlU3ByZWFkIGVsLFxuICAgICAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgICAgICAgICBwYWdlSWRzOiBwYWdlSWRzXG4gICAgICAgICAgICAgICAgbWF4Wm9vbVNjYWxlOiBtYXhab29tU2NhbGVcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGhcbiAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0XG5cbiAgICAgICAgICAgIGxlZnQgKz0gd2lkdGhcblxuICAgICAgICAgICAgcGFnZVNwcmVhZHMucHVzaCBwYWdlU3ByZWFkXG5cbiAgICAgICAgcGFnZVNwcmVhZHNcblxuICAgIGJ1aWxkUGFnZUlkczogKHBhZ2VTcHJlYWRzKSAtPlxuICAgICAgICBwYWdlSWRzID0ge31cblxuICAgICAgICBwYWdlU3ByZWFkcy5mb3JFYWNoIChwYWdlU3ByZWFkLCBpKSAtPlxuICAgICAgICAgICAgcGFnZVNwcmVhZC5vcHRpb25zLnBhZ2VJZHMuZm9yRWFjaCAocGFnZUlkKSAtPlxuICAgICAgICAgICAgICAgIHBhZ2VJZHNbcGFnZUlkXSA9IHBhZ2VTcHJlYWRcblxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBwYWdlSWRzXG5cbiAgICBpc0Nvb3JkaW5hdGVJbnNpZGVFbGVtZW50OiAoeCwgeSwgZWwpIC0+XG4gICAgICAgIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICAgIHggPj0gcmVjdC5sZWZ0IGFuZCB4IDw9IHJlY3QucmlnaHQgYW5kIHkgPj0gcmVjdC50b3AgYW5kIHkgPD0gcmVjdC5ib3R0b21cblxuICAgIGdldENvb3JkaW5hdGVJbmZvOiAoeCwgeSwgcGFnZVNwcmVhZCkgLT5cbiAgICAgICAgaW5mbyA9XG4gICAgICAgICAgICB4OiB4XG4gICAgICAgICAgICB5OiB5XG4gICAgICAgICAgICBjb250ZW50WDogMFxuICAgICAgICAgICAgY29udGVudFk6IDBcbiAgICAgICAgICAgIHBhZ2VYOiAwXG4gICAgICAgICAgICBwYWdlWTogMFxuICAgICAgICAgICAgb3ZlcmxheUVsczogW11cbiAgICAgICAgICAgIHBhZ2VFbDogbnVsbFxuICAgICAgICAgICAgaXNJbnNpZGVDb250ZW50WDogZmFsc2VcbiAgICAgICAgICAgIGlzSW5zaWRlQ29udGVudFk6IGZhbHNlXG4gICAgICAgICAgICBpc0luc2lkZUNvbnRlbnQ6IGZhbHNlXG4gICAgICAgIGNvbnRlbnRSZWN0ID0gcGFnZVNwcmVhZC5nZXRDb250ZW50UmVjdCgpXG4gICAgICAgIG92ZXJsYXlFbHMgPSBwYWdlU3ByZWFkLmdldE92ZXJsYXlFbHMoKVxuICAgICAgICBwYWdlRWxzID0gcGFnZVNwcmVhZC5nZXRQYWdlRWxzKClcblxuICAgICAgICBmb3Igb3ZlcmxheUVsIGluIG92ZXJsYXlFbHNcbiAgICAgICAgICAgIGluZm8ub3ZlcmxheUVscy5wdXNoIG92ZXJsYXlFbCBpZiBAaXNDb29yZGluYXRlSW5zaWRlRWxlbWVudCh4LCB5LCBvdmVybGF5RWwpXG5cbiAgICAgICAgZm9yIHBhZ2VFbCBpbiBwYWdlRWxzXG4gICAgICAgICAgICBpZiBAaXNDb29yZGluYXRlSW5zaWRlRWxlbWVudCh4LCB5LCBwYWdlRWwpXG4gICAgICAgICAgICAgICAgaW5mby5wYWdlRWwgPSBwYWdlRWxcbiAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgIGluZm8uY29udGVudFggPSAoeCAtIGNvbnRlbnRSZWN0LmxlZnQpIC8gY29udGVudFJlY3Qud2lkdGhcbiAgICAgICAgaW5mby5jb250ZW50WSA9ICh5IC0gY29udGVudFJlY3QudG9wKSAvIGNvbnRlbnRSZWN0LmhlaWdodFxuXG4gICAgICAgIGlmIGluZm8ucGFnZUVsP1xuICAgICAgICAgICAgaW5mby5pc0luc2lkZUNvbnRlbnRYID0gaW5mby5jb250ZW50WCA+PSAwIGFuZCBpbmZvLmNvbnRlbnRYIDw9IDFcbiAgICAgICAgICAgIGluZm8uaXNJbnNpZGVDb250ZW50WSA9IGluZm8uY29udGVudFkgPj0gMCBhbmQgaW5mby5jb250ZW50WSA8PSAxXG4gICAgICAgICAgICBpbmZvLmlzSW5zaWRlQ29udGVudCA9IGluZm8uaXNJbnNpZGVDb250ZW50WCBhbmQgaW5mby5pc0luc2lkZUNvbnRlbnRZXG5cbiAgICAgICAgaW5mb1xuXG4gICAgZ2V0UGFnZVNwcmVhZENvdW50OiAtPlxuICAgICAgICBAcGFnZVNwcmVhZHMubGVuZ3RoXG5cbiAgICBnZXRBY3RpdmVQYWdlU3ByZWFkOiAtPlxuICAgICAgICBAZ2V0UGFnZVNwcmVhZEZyb21Qb3NpdGlvbiBAZ2V0UG9zaXRpb24oKVxuXG4gICAgZ2V0UGFnZVNwcmVhZEZyb21Qb3NpdGlvbjogKHBvc2l0aW9uKSAtPlxuICAgICAgICBAcGFnZVNwcmVhZHNbcG9zaXRpb25dXG5cbiAgICBnZXRQYWdlU3ByZWFkUG9zaXRpb25Gcm9tUGFnZUlkOiAocGFnZUlkKSAtPlxuICAgICAgICBmb3IgcGFnZVNwcmVhZCwgaWR4IGluIEBwYWdlU3ByZWFkc1xuICAgICAgICAgICAgcmV0dXJuIGlkeCBpZiBwYWdlU3ByZWFkLm9wdGlvbnMucGFnZUlkcy5pbmRleE9mKHBhZ2VJZCkgPiAtMVxuXG4gICAgZ2V0UGFnZVNwcmVhZEJvdW5kczogKHBhZ2VTcHJlYWQpIC0+XG4gICAgICAgIHBhZ2VTcHJlYWRSZWN0ID0gcGFnZVNwcmVhZC5nZXRSZWN0KClcbiAgICAgICAgcGFnZVNwcmVhZENvbnRlbnRSZWN0ID0gcGFnZVNwcmVhZC5nZXRDb250ZW50UmVjdCgpXG5cbiAgICAgICAgbGVmdDogKHBhZ2VTcHJlYWRDb250ZW50UmVjdC5sZWZ0IC0gcGFnZVNwcmVhZFJlY3QubGVmdCkgLyBwYWdlU3ByZWFkUmVjdC53aWR0aCAqIDEwMFxuICAgICAgICB0b3A6IChwYWdlU3ByZWFkQ29udGVudFJlY3QudG9wIC0gcGFnZVNwcmVhZFJlY3QudG9wKSAvIHBhZ2VTcHJlYWRSZWN0LmhlaWdodCAqIDEwMFxuICAgICAgICB3aWR0aDogcGFnZVNwcmVhZENvbnRlbnRSZWN0LndpZHRoIC8gcGFnZVNwcmVhZFJlY3Qud2lkdGggKiAxMDBcbiAgICAgICAgaGVpZ2h0OiBwYWdlU3ByZWFkQ29udGVudFJlY3QuaGVpZ2h0IC8gcGFnZVNwcmVhZFJlY3QuaGVpZ2h0ICogMTAwXG4gICAgICAgIHBhZ2VTcHJlYWRSZWN0OiBwYWdlU3ByZWFkUmVjdFxuICAgICAgICBwYWdlU3ByZWFkQ29udGVudFJlY3Q6IHBhZ2VTcHJlYWRDb250ZW50UmVjdFxuXG4gICAgY2xpcENvb3JkaW5hdGU6IChjb29yZGluYXRlLCBzY2FsZSwgc2l6ZSwgb2Zmc2V0KSAtPlxuICAgICAgICBpZiBzaXplICogc2NhbGUgPCAxMDBcbiAgICAgICAgICAgIGNvb3JkaW5hdGUgPSBvZmZzZXQgKiAtc2NhbGUgKyA1MCAtIChzaXplICogc2NhbGUgLyAyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb29yZGluYXRlID0gTWF0aC5taW4gY29vcmRpbmF0ZSwgb2Zmc2V0ICogLXNjYWxlXG4gICAgICAgICAgICBjb29yZGluYXRlID0gTWF0aC5tYXggY29vcmRpbmF0ZSwgb2Zmc2V0ICogLXNjYWxlIC0gc2l6ZSAqIHNjYWxlICsgMTAwXG5cbiAgICAgICAgY29vcmRpbmF0ZVxuXG4gICAgem9vbVRvOiAob3B0aW9ucyA9IHt9LCBjYWxsYmFjaykgLT5cbiAgICAgICAgc2NhbGUgPSBvcHRpb25zLnNjYWxlXG4gICAgICAgIGFjdGl2ZVBhZ2VTcHJlYWQgPSBAZ2V0QWN0aXZlUGFnZVNwcmVhZCgpXG4gICAgICAgIHBhZ2VTcHJlYWRCb3VuZHMgPSBAZ2V0UGFnZVNwcmVhZEJvdW5kcyBhY3RpdmVQYWdlU3ByZWFkXG4gICAgICAgIGNhcm91c2VsT2Zmc2V0ID0gYWN0aXZlUGFnZVNwcmVhZC5nZXRMZWZ0KClcbiAgICAgICAgY2Fyb3VzZWxTY2FsZWRPZmZzZXQgPSBjYXJvdXNlbE9mZnNldCAqIEB0cmFuc2Zvcm0uc2NhbGVcbiAgICAgICAgeCA9IG9wdGlvbnMueCA/IDBcbiAgICAgICAgeSA9IG9wdGlvbnMueSA/IDBcblxuICAgICAgICBpZiBzY2FsZSBpc250IDFcbiAgICAgICAgICAgIHggLT0gcGFnZVNwcmVhZEJvdW5kcy5wYWdlU3ByZWFkUmVjdC5sZWZ0XG4gICAgICAgICAgICB5IC09IHBhZ2VTcHJlYWRCb3VuZHMucGFnZVNwcmVhZFJlY3QudG9wXG4gICAgICAgICAgICB4ID0geCAvIChwYWdlU3ByZWFkQm91bmRzLnBhZ2VTcHJlYWRSZWN0LndpZHRoIC8gQHRyYW5zZm9ybS5zY2FsZSkgKiAxMDBcbiAgICAgICAgICAgIHkgPSB5IC8gKHBhZ2VTcHJlYWRCb3VuZHMucGFnZVNwcmVhZFJlY3QuaGVpZ2h0IC8gQHRyYW5zZm9ybS5zY2FsZSkgKiAxMDBcbiAgICAgICAgICAgIHggPSBAdHJhbnNmb3JtLmxlZnQgKyBjYXJvdXNlbFNjYWxlZE9mZnNldCArIHggLSAoeCAqIHNjYWxlIC8gQHRyYW5zZm9ybS5zY2FsZSlcbiAgICAgICAgICAgIHkgPSBAdHJhbnNmb3JtLnRvcCArIHkgLSAoeSAqIHNjYWxlIC8gQHRyYW5zZm9ybS5zY2FsZSlcblxuICAgICAgICAgICAgIyBNYWtlIHN1cmUgdGhlIGFuaW1hdGlvbiBkb2Vzbid0IGV4Y2VlZCB0aGUgY29udGVudCBib3VuZHMuXG4gICAgICAgICAgICBpZiBvcHRpb25zLmJvdW5kcyBpc250IGZhbHNlIGFuZCBzY2FsZSA+IDFcbiAgICAgICAgICAgICAgICB4ID0gQGNsaXBDb29yZGluYXRlIHgsIHNjYWxlLCBwYWdlU3ByZWFkQm91bmRzLndpZHRoLCBwYWdlU3ByZWFkQm91bmRzLmxlZnRcbiAgICAgICAgICAgICAgICB5ID0gQGNsaXBDb29yZGluYXRlIHksIHNjYWxlLCBwYWdlU3ByZWFkQm91bmRzLmhlaWdodCwgcGFnZVNwcmVhZEJvdW5kcy50b3BcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgeCA9IDBcbiAgICAgICAgICAgIHkgPSAwXG5cbiAgICAgICAgIyBBY2NvdW50IGZvciB0aGUgcGFnZSBzcHJlYWRzIGxlZnQgb2YgdGhlIGFjdGl2ZSBvbmUuXG4gICAgICAgIHggLT0gY2Fyb3VzZWxPZmZzZXQgKiBzY2FsZVxuXG4gICAgICAgIEB0cmFuc2Zvcm0ubGVmdCA9IHhcbiAgICAgICAgQHRyYW5zZm9ybS50b3AgPSB5XG4gICAgICAgIEB0cmFuc2Zvcm0uc2NhbGUgPSBzY2FsZVxuXG4gICAgICAgIEBhbmltYXRpb24uYW5pbWF0ZVxuICAgICAgICAgICAgeDogXCIje3h9JVwiXG4gICAgICAgICAgICB5OiBcIiN7eX0lXCJcbiAgICAgICAgICAgIHNjYWxlOiBzY2FsZVxuICAgICAgICAgICAgZWFzaW5nOiBvcHRpb25zLmVhc2luZ1xuICAgICAgICAgICAgZHVyYXRpb246IG9wdGlvbnMuZHVyYXRpb25cbiAgICAgICAgLCBjYWxsYmFja1xuXG4gICAgICAgIHJldHVyblxuXG4gICAgcmVmcmVzaDogLT5cbiAgICAgICAgQHBhZ2VTcHJlYWRFbHMgPSBAZWwucXVlcnlTZWxlY3RvckFsbCAnLnZlcnNvX19wYWdlLXNwcmVhZCdcbiAgICAgICAgQHBhZ2VTcHJlYWRzID0gQHRyYXZlcnNlUGFnZVNwcmVhZHMgQHBhZ2VTcHJlYWRFbHNcbiAgICAgICAgQHBhZ2VJZHMgPSBAYnVpbGRQYWdlSWRzIEBwYWdlU3ByZWFkc1xuXG4gICAgICAgIEBcblxuICAgIHBhblN0YXJ0OiAoZSkgLT5cbiAgICAgICAgeCA9IGUuY2VudGVyLnhcbiAgICAgICAgZWRnZVRocmVzaG9sZCA9IDMwXG4gICAgICAgIHdpZHRoID0gQHNjcm9sbGVyRWwub2Zmc2V0V2lkdGhcblxuICAgICAgICAjIFByZXZlbnQgcGFubmluZyB3aGVuIGVkZ2Utc3dpcGluZyBvbiBpT1MuXG4gICAgICAgIGlmIHggPiBlZGdlVGhyZXNob2xkIGFuZCB4IDwgd2lkdGggLSBlZGdlVGhyZXNob2xkXG4gICAgICAgICAgICBAc3RhcnRUcmFuc2Zvcm0ubGVmdCA9IEB0cmFuc2Zvcm0ubGVmdFxuICAgICAgICAgICAgQHN0YXJ0VHJhbnNmb3JtLnRvcCA9IEB0cmFuc2Zvcm0udG9wXG5cbiAgICAgICAgICAgIEBwYW5uaW5nID0gdHJ1ZVxuXG4gICAgICAgICAgICBAdHJpZ2dlciAncGFuU3RhcnQnXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBwYW5Nb3ZlOiAoZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIEBwaW5jaGluZyBpcyB0cnVlIG9yIEBwYW5uaW5nIGlzIGZhbHNlXG5cbiAgICAgICAgaWYgQHRyYW5zZm9ybS5zY2FsZSA+IDFcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2VTcHJlYWQgPSBAZ2V0QWN0aXZlUGFnZVNwcmVhZCgpXG4gICAgICAgICAgICBjYXJvdXNlbE9mZnNldCA9IGFjdGl2ZVBhZ2VTcHJlYWQuZ2V0TGVmdCgpXG4gICAgICAgICAgICBjYXJvdXNlbFNjYWxlZE9mZnNldCA9IGNhcm91c2VsT2Zmc2V0ICogQHRyYW5zZm9ybS5zY2FsZVxuICAgICAgICAgICAgcGFnZVNwcmVhZEJvdW5kcyA9IEBnZXRQYWdlU3ByZWFkQm91bmRzIGFjdGl2ZVBhZ2VTcHJlYWRcbiAgICAgICAgICAgIHNjYWxlID0gQHRyYW5zZm9ybS5zY2FsZVxuICAgICAgICAgICAgeCA9IEBzdGFydFRyYW5zZm9ybS5sZWZ0ICsgY2Fyb3VzZWxTY2FsZWRPZmZzZXQgKyBlLmRlbHRhWCAvIEBzY3JvbGxlckVsLm9mZnNldFdpZHRoICogMTAwXG4gICAgICAgICAgICB5ID0gQHN0YXJ0VHJhbnNmb3JtLnRvcCArIGUuZGVsdGFZIC8gQHNjcm9sbGVyRWwub2Zmc2V0SGVpZ2h0ICogMTAwXG4gICAgICAgICAgICB4ID0gQGNsaXBDb29yZGluYXRlIHgsIHNjYWxlLCBwYWdlU3ByZWFkQm91bmRzLndpZHRoLCBwYWdlU3ByZWFkQm91bmRzLmxlZnRcbiAgICAgICAgICAgIHkgPSBAY2xpcENvb3JkaW5hdGUgeSwgc2NhbGUsIHBhZ2VTcHJlYWRCb3VuZHMuaGVpZ2h0LCBwYWdlU3ByZWFkQm91bmRzLnRvcFxuICAgICAgICAgICAgeCAtPSBjYXJvdXNlbFNjYWxlZE9mZnNldFxuXG4gICAgICAgICAgICBAdHJhbnNmb3JtLmxlZnQgPSB4XG4gICAgICAgICAgICBAdHJhbnNmb3JtLnRvcCA9IHlcblxuICAgICAgICAgICAgQGFuaW1hdGlvbi5hbmltYXRlXG4gICAgICAgICAgICAgICAgeDogXCIje3h9JVwiXG4gICAgICAgICAgICAgICAgeTogXCIje3l9JVwiXG4gICAgICAgICAgICAgICAgc2NhbGU6IHNjYWxlXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnbGluZWFyJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB4ID0gQHRyYW5zZm9ybS5sZWZ0ICsgZS5kZWx0YVggLyBAc2Nyb2xsZXJFbC5vZmZzZXRXaWR0aCAqIDEwMFxuXG4gICAgICAgICAgICBAYW5pbWF0aW9uLmFuaW1hdGVcbiAgICAgICAgICAgICAgICB4OiBcIiN7eH0lXCJcbiAgICAgICAgICAgICAgICBlYXNpbmc6ICdsaW5lYXInXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBwYW5FbmQ6IChlKSAtPlxuICAgICAgICByZXR1cm4gaWYgQHBhbm5pbmcgaXMgZmFsc2VcblxuICAgICAgICBAcGFubmluZyA9IGZhbHNlXG4gICAgICAgIEB0cmlnZ2VyICdwYW5FbmQnXG5cbiAgICAgICAgaWYgQHRyYW5zZm9ybS5zY2FsZSBpcyAxIGFuZCBAcGluY2hpbmcgaXMgZmFsc2VcbiAgICAgICAgICAgIHBvc2l0aW9uID0gQGdldFBvc2l0aW9uKClcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gZS5vdmVyYWxsVmVsb2NpdHlYXG5cbiAgICAgICAgICAgIGlmIE1hdGguYWJzKHZlbG9jaXR5KSA+PSBAc3dpcGVWZWxvY2l0eVxuICAgICAgICAgICAgICAgIGlmIE1hdGguYWJzKGUuZGVsdGFYKSA+PSBAc3dpcGVUaHJlc2hvbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgZS5vZmZzZXREaXJlY3Rpb24gaXMgSGFtbWVyLkRJUkVDVElPTl9MRUZUXG4gICAgICAgICAgICAgICAgICAgICAgICBAbmV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5OiB2ZWxvY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBAbmF2aWdhdGlvblBhbkR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgZS5vZmZzZXREaXJlY3Rpb24gaXMgSGFtbWVyLkRJUkVDVElPTl9SSUdIVFxuICAgICAgICAgICAgICAgICAgICAgICAgQHByZXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eTogdmVsb2NpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogQG5hdmlnYXRpb25QYW5EdXJhdGlvblxuXG4gICAgICAgICAgICBpZiBwb3NpdGlvbiBpcyBAZ2V0UG9zaXRpb24oKVxuICAgICAgICAgICAgICAgIEBhbmltYXRpb24uYW5pbWF0ZVxuICAgICAgICAgICAgICAgICAgICB4OiBcIiN7QHRyYW5zZm9ybS5sZWZ0fSVcIlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogQG5hdmlnYXRpb25QYW5EdXJhdGlvblxuXG4gICAgICAgICAgICAgICAgQHRyaWdnZXIgJ2F0dGVtcHRlZE5hdmlnYXRpb24nLCBwb3NpdGlvbjogQGdldFBvc2l0aW9uKClcblxuICAgICAgICByZXR1cm5cblxuICAgIHBpbmNoU3RhcnQ6IChlKSAtPlxuICAgICAgICByZXR1cm4gaWYgbm90IEBnZXRBY3RpdmVQYWdlU3ByZWFkKCkuaXNab29tYWJsZSgpXG5cbiAgICAgICAgQHBpbmNoaW5nID0gdHJ1ZVxuICAgICAgICBAZWwuZGF0YXNldC5waW5jaGluZyA9IHRydWVcbiAgICAgICAgQHN0YXJ0VHJhbnNmb3JtLnNjYWxlID0gQHRyYW5zZm9ybS5zY2FsZVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgcGluY2hNb3ZlOiAoZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIEBwaW5jaGluZyBpcyBmYWxzZVxuXG4gICAgICAgIEB6b29tVG9cbiAgICAgICAgICAgIHg6IGUuY2VudGVyLnhcbiAgICAgICAgICAgIHk6IGUuY2VudGVyLnlcbiAgICAgICAgICAgIHNjYWxlOiBAc3RhcnRUcmFuc2Zvcm0uc2NhbGUgKiBlLnNjYWxlXG4gICAgICAgICAgICBib3VuZHM6IGZhbHNlXG4gICAgICAgICAgICBlYXNpbmc6ICdsaW5lYXInXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBwaW5jaEVuZDogKGUpIC0+XG4gICAgICAgIHJldHVybiBpZiBAcGluY2hpbmcgaXMgZmFsc2VcblxuICAgICAgICBhY3RpdmVQYWdlU3ByZWFkID0gQGdldEFjdGl2ZVBhZ2VTcHJlYWQoKVxuICAgICAgICBtYXhab29tU2NhbGUgPSBhY3RpdmVQYWdlU3ByZWFkLmdldE1heFpvb21TY2FsZSgpXG4gICAgICAgIHNjYWxlID0gTWF0aC5tYXggMSwgTWF0aC5taW4oQHRyYW5zZm9ybS5zY2FsZSwgbWF4Wm9vbVNjYWxlKVxuICAgICAgICBwb3NpdGlvbiA9IEBnZXRQb3NpdGlvbigpXG5cbiAgICAgICAgaWYgQHN0YXJ0VHJhbnNmb3JtLnNjYWxlIGlzIDEgYW5kIHNjYWxlID4gMVxuICAgICAgICAgICAgQHRyaWdnZXIgJ3pvb21lZEluJywgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgIGVsc2UgaWYgQHN0YXJ0VHJhbnNmb3JtLnNjYWxlID4gMSBhbmQgc2NhbGUgaXMgMVxuICAgICAgICAgICAgQHRyaWdnZXIgJ3pvb21lZE91dCcsIHBvc2l0aW9uOiBwb3NpdGlvblxuXG4gICAgICAgIEB6b29tVG9cbiAgICAgICAgICAgIHg6IGUuY2VudGVyLnhcbiAgICAgICAgICAgIHk6IGUuY2VudGVyLnlcbiAgICAgICAgICAgIHNjYWxlOiBzY2FsZVxuICAgICAgICAgICAgZHVyYXRpb246IEB6b29tRHVyYXRpb25cbiAgICAgICAgLCA9PlxuICAgICAgICAgICAgQHBpbmNoaW5nID0gZmFsc2VcbiAgICAgICAgICAgIEBlbC5kYXRhc2V0LnBpbmNoaW5nID0gZmFsc2VcblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBwcmVzczogKGUpIC0+XG4gICAgICAgIEB0cmlnZ2VyICdwcmVzc2VkJywgQGdldENvb3JkaW5hdGVJbmZvKGUuY2VudGVyLngsIGUuY2VudGVyLnksIEBnZXRBY3RpdmVQYWdlU3ByZWFkKCkpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBzaW5nbGV0YXA6IChlKSAtPlxuICAgICAgICBhY3RpdmVQYWdlU3ByZWFkID0gQGdldEFjdGl2ZVBhZ2VTcHJlYWQoKVxuICAgICAgICBjb29yZGluYXRlSW5mbyA9IEBnZXRDb29yZGluYXRlSW5mbyBlLmNlbnRlci54LCBlLmNlbnRlci55LCBhY3RpdmVQYWdlU3ByZWFkXG4gICAgICAgIGlzRG91YmxlVGFwID0gQHRhcC5jb3VudCBpcyAxXG5cbiAgICAgICAgY2xlYXJUaW1lb3V0IEB0YXAudGltZW91dFxuXG4gICAgICAgIGlmIGlzRG91YmxlVGFwXG4gICAgICAgICAgICBAdGFwLmNvdW50ID0gMFxuXG4gICAgICAgICAgICBAdHJpZ2dlciAnZG91YmxlQ2xpY2tlZCcsIGNvb3JkaW5hdGVJbmZvXG5cbiAgICAgICAgICAgIGlmIGFjdGl2ZVBhZ2VTcHJlYWQuaXNab29tYWJsZSgpXG4gICAgICAgICAgICAgICAgbWF4Wm9vbVNjYWxlID0gYWN0aXZlUGFnZVNwcmVhZC5nZXRNYXhab29tU2NhbGUoKVxuICAgICAgICAgICAgICAgIHpvb21lZEluID0gQHRyYW5zZm9ybS5zY2FsZSA+IDFcbiAgICAgICAgICAgICAgICBzY2FsZSA9IGlmIHpvb21lZEluIHRoZW4gMSBlbHNlIG1heFpvb21TY2FsZVxuICAgICAgICAgICAgICAgIHpvb21FdmVudCA9IGlmIHpvb21lZEluIHRoZW4gJ3pvb21lZE91dCcgZWxzZSAnem9vbWVkSW4nXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSBAZ2V0UG9zaXRpb24oKVxuXG4gICAgICAgICAgICAgICAgQHpvb21Ub1xuICAgICAgICAgICAgICAgICAgICB4OiBlLmNlbnRlci54XG4gICAgICAgICAgICAgICAgICAgIHk6IGUuY2VudGVyLnlcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IHNjYWxlXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBAem9vbUR1cmF0aW9uXG4gICAgICAgICAgICAgICAgLCA9PlxuICAgICAgICAgICAgICAgICAgICBAdHJpZ2dlciB6b29tRXZlbnQsIHBvc2l0aW9uOiBwb3NpdGlvblxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAdGFwLmNvdW50KytcbiAgICAgICAgICAgIEB0YXAudGltZW91dCA9IHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgICAgICBAdGFwLmNvdW50ID0gMFxuXG4gICAgICAgICAgICAgICAgQHRyaWdnZXIgJ2NsaWNrZWQnLCBjb29yZGluYXRlSW5mb1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAsIEB0YXAuZGVsYXlcblxuICAgICAgICByZXR1cm5cblxuICAgIHJlc2l6ZTogLT5cbiAgICAgICAgaWYgQHRyYW5zZm9ybS5zY2FsZSA+IDFcbiAgICAgICAgICAgIHBvc2l0aW9uID0gQGdldFBvc2l0aW9uKClcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2VTcHJlYWQgPSBAZ2V0QWN0aXZlUGFnZVNwcmVhZCgpXG5cbiAgICAgICAgICAgIEB0cmFuc2Zvcm0ubGVmdCA9IEBnZXRMZWZ0VHJhbnNmb3JtRnJvbVBhZ2VTcHJlYWQgcG9zaXRpb24sIGFjdGl2ZVBhZ2VTcHJlYWRcbiAgICAgICAgICAgIEB0cmFuc2Zvcm0udG9wID0gMFxuICAgICAgICAgICAgQHRyYW5zZm9ybS5zY2FsZSA9IDFcblxuICAgICAgICAgICAgQHpvb21Ub1xuICAgICAgICAgICAgICAgIHg6IEB0cmFuc2Zvcm0ubGVmdFxuICAgICAgICAgICAgICAgIHk6IEB0cmFuc2Zvcm0udG9wXG4gICAgICAgICAgICAgICAgc2NhbGU6IEB0cmFuc2Zvcm0uc2NhbGVcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMFxuXG4gICAgICAgICAgICBAdHJpZ2dlciAnem9vbWVkT3V0JywgcG9zaXRpb246IHBvc2l0aW9uXG5cbiAgICAgICAgcmV0dXJuXG5cbk1pY3JvRXZlbnQubWl4aW4gVmVyc29cblxubW9kdWxlLmV4cG9ydHMgPSBWZXJzb1xuIiwiLyohIEhhbW1lci5KUyAtIHYyLjAuNyAtIDIwMTYtMDQtMjJcbiAqIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE2IEpvcmlrIFRhbmdlbGRlcjtcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsIGV4cG9ydE5hbWUsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbnZhciBWRU5ET1JfUFJFRklYRVMgPSBbJycsICd3ZWJraXQnLCAnTW96JywgJ01TJywgJ21zJywgJ28nXTtcbnZhciBURVNUX0VMRU1FTlQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxudmFyIFRZUEVfRlVOQ1RJT04gPSAnZnVuY3Rpb24nO1xuXG52YXIgcm91bmQgPSBNYXRoLnJvdW5kO1xudmFyIGFicyA9IE1hdGguYWJzO1xudmFyIG5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIHNldCBhIHRpbWVvdXQgd2l0aCBhIGdpdmVuIHNjb3BlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBzZXRUaW1lb3V0Q29udGV4dChmbiwgdGltZW91dCwgY29udGV4dCkge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGJpbmRGbihmbiwgY29udGV4dCksIHRpbWVvdXQpO1xufVxuXG4vKipcbiAqIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBhcnJheSwgd2Ugd2FudCB0byBleGVjdXRlIHRoZSBmbiBvbiBlYWNoIGVudHJ5XG4gKiBpZiBpdCBhaW50IGFuIGFycmF5IHdlIGRvbid0IHdhbnQgdG8gZG8gYSB0aGluZy5cbiAqIHRoaXMgaXMgdXNlZCBieSBhbGwgdGhlIG1ldGhvZHMgdGhhdCBhY2NlcHQgYSBzaW5nbGUgYW5kIGFycmF5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfEFycmF5fSBhcmdcbiAqIEBwYXJhbSB7U3RyaW5nfSBmblxuICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGludm9rZUFycmF5QXJnKGFyZywgZm4sIGNvbnRleHQpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgIGVhY2goYXJnLCBjb250ZXh0W2ZuXSwgY29udGV4dCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogd2FsayBvYmplY3RzIGFuZCBhcnJheXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICovXG5mdW5jdGlvbiBlYWNoKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgaTtcblxuICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob2JqLmZvckVhY2gpIHtcbiAgICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IG9iai5sZW5ndGgpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgICAgb2JqLmhhc093blByb3BlcnR5KGkpICYmIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIHdyYXAgYSBtZXRob2Qgd2l0aCBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgYW5kIHN0YWNrIHRyYWNlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB3cmFwcGluZyB0aGUgc3VwcGxpZWQgbWV0aG9kLlxuICovXG5mdW5jdGlvbiBkZXByZWNhdGUobWV0aG9kLCBuYW1lLCBtZXNzYWdlKSB7XG4gICAgdmFyIGRlcHJlY2F0aW9uTWVzc2FnZSA9ICdERVBSRUNBVEVEIE1FVEhPRDogJyArIG5hbWUgKyAnXFxuJyArIG1lc3NhZ2UgKyAnIEFUIFxcbic7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcignZ2V0LXN0YWNrLXRyYWNlJyk7XG4gICAgICAgIHZhciBzdGFjayA9IGUgJiYgZS5zdGFjayA/IGUuc3RhY2sucmVwbGFjZSgvXlteXFwoXSs/W1xcbiRdL2dtLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9eXFxzK2F0XFxzKy9nbSwgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXk9iamVjdC48YW5vbnltb3VzPlxccypcXCgvZ20sICd7YW5vbnltb3VzfSgpQCcpIDogJ1Vua25vd24gU3RhY2sgVHJhY2UnO1xuXG4gICAgICAgIHZhciBsb2cgPSB3aW5kb3cuY29uc29sZSAmJiAod2luZG93LmNvbnNvbGUud2FybiB8fCB3aW5kb3cuY29uc29sZS5sb2cpO1xuICAgICAgICBpZiAobG9nKSB7XG4gICAgICAgICAgICBsb2cuY2FsbCh3aW5kb3cuY29uc29sZSwgZGVwcmVjYXRpb25NZXNzYWdlLCBzdGFjayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8qKlxuICogZXh0ZW5kIG9iamVjdC5cbiAqIG1lYW5zIHRoYXQgcHJvcGVydGllcyBpbiBkZXN0IHdpbGwgYmUgb3ZlcndyaXR0ZW4gYnkgdGhlIG9uZXMgaW4gc3JjLlxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFxuICogQHBhcmFtIHsuLi5PYmplY3R9IG9iamVjdHNfdG9fYXNzaWduXG4gKiBAcmV0dXJucyB7T2JqZWN0fSB0YXJnZXRcbiAqL1xudmFyIGFzc2lnbjtcbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGFzc2lnbiA9IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQpIHtcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3V0cHV0ID0gT2JqZWN0KHRhcmdldCk7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChzb3VyY2UgIT09IHVuZGVmaW5lZCAmJiBzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBuZXh0S2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KG5leHRLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRbbmV4dEtleV0gPSBzb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xufSBlbHNlIHtcbiAgICBhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xufVxuXG4vKipcbiAqIGV4dGVuZCBvYmplY3QuXG4gKiBtZWFucyB0aGF0IHByb3BlcnRpZXMgaW4gZGVzdCB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBvbmVzIGluIHNyYy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0XG4gKiBAcGFyYW0ge09iamVjdH0gc3JjXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFttZXJnZT1mYWxzZV1cbiAqIEByZXR1cm5zIHtPYmplY3R9IGRlc3RcbiAqL1xudmFyIGV4dGVuZCA9IGRlcHJlY2F0ZShmdW5jdGlvbiBleHRlbmQoZGVzdCwgc3JjLCBtZXJnZSkge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoc3JjKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBrZXlzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIW1lcmdlIHx8IChtZXJnZSAmJiBkZXN0W2tleXNbaV1dID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICBkZXN0W2tleXNbaV1dID0gc3JjW2tleXNbaV1dO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGRlc3Q7XG59LCAnZXh0ZW5kJywgJ1VzZSBgYXNzaWduYC4nKTtcblxuLyoqXG4gKiBtZXJnZSB0aGUgdmFsdWVzIGZyb20gc3JjIGluIHRoZSBkZXN0LlxuICogbWVhbnMgdGhhdCBwcm9wZXJ0aWVzIHRoYXQgZXhpc3QgaW4gZGVzdCB3aWxsIG5vdCBiZSBvdmVyd3JpdHRlbiBieSBzcmNcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0XG4gKiBAcGFyYW0ge09iamVjdH0gc3JjXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBkZXN0XG4gKi9cbnZhciBtZXJnZSA9IGRlcHJlY2F0ZShmdW5jdGlvbiBtZXJnZShkZXN0LCBzcmMpIHtcbiAgICByZXR1cm4gZXh0ZW5kKGRlc3QsIHNyYywgdHJ1ZSk7XG59LCAnbWVyZ2UnLCAnVXNlIGBhc3NpZ25gLicpO1xuXG4vKipcbiAqIHNpbXBsZSBjbGFzcyBpbmhlcml0YW5jZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2hpbGRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGJhc2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllc11cbiAqL1xuZnVuY3Rpb24gaW5oZXJpdChjaGlsZCwgYmFzZSwgcHJvcGVydGllcykge1xuICAgIHZhciBiYXNlUCA9IGJhc2UucHJvdG90eXBlLFxuICAgICAgICBjaGlsZFA7XG5cbiAgICBjaGlsZFAgPSBjaGlsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGJhc2VQKTtcbiAgICBjaGlsZFAuY29uc3RydWN0b3IgPSBjaGlsZDtcbiAgICBjaGlsZFAuX3N1cGVyID0gYmFzZVA7XG5cbiAgICBpZiAocHJvcGVydGllcykge1xuICAgICAgICBhc3NpZ24oY2hpbGRQLCBwcm9wZXJ0aWVzKTtcbiAgICB9XG59XG5cbi8qKlxuICogc2ltcGxlIGZ1bmN0aW9uIGJpbmRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBiaW5kRm4oZm4sIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gYm91bmRGbigpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuLyoqXG4gKiBsZXQgYSBib29sZWFuIHZhbHVlIGFsc28gYmUgYSBmdW5jdGlvbiB0aGF0IG11c3QgcmV0dXJuIGEgYm9vbGVhblxuICogdGhpcyBmaXJzdCBpdGVtIGluIGFyZ3Mgd2lsbCBiZSB1c2VkIGFzIHRoZSBjb250ZXh0XG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IHZhbFxuICogQHBhcmFtIHtBcnJheX0gW2FyZ3NdXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gYm9vbE9yRm4odmFsLCBhcmdzKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgPT0gVFlQRV9GVU5DVElPTikge1xuICAgICAgICByZXR1cm4gdmFsLmFwcGx5KGFyZ3MgPyBhcmdzWzBdIHx8IHVuZGVmaW5lZCA6IHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG59XG5cbi8qKlxuICogdXNlIHRoZSB2YWwyIHdoZW4gdmFsMSBpcyB1bmRlZmluZWRcbiAqIEBwYXJhbSB7Kn0gdmFsMVxuICogQHBhcmFtIHsqfSB2YWwyXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gaWZVbmRlZmluZWQodmFsMSwgdmFsMikge1xuICAgIHJldHVybiAodmFsMSA9PT0gdW5kZWZpbmVkKSA/IHZhbDIgOiB2YWwxO1xufVxuXG4vKipcbiAqIGFkZEV2ZW50TGlzdGVuZXIgd2l0aCBtdWx0aXBsZSBldmVudHMgYXQgb25jZVxuICogQHBhcmFtIHtFdmVudFRhcmdldH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcbiAqL1xuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnModGFyZ2V0LCB0eXBlcywgaGFuZGxlcikge1xuICAgIGVhY2goc3BsaXRTdHIodHlwZXMpLCBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiByZW1vdmVFdmVudExpc3RlbmVyIHdpdGggbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2VcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRhcmdldCwgdHlwZXMsIGhhbmRsZXIpIHtcbiAgICBlYWNoKHNwbGl0U3RyKHR5cGVzKSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogZmluZCBpZiBhIG5vZGUgaXMgaW4gdGhlIGdpdmVuIHBhcmVudFxuICogQG1ldGhvZCBoYXNQYXJlbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudFxuICogQHJldHVybiB7Qm9vbGVhbn0gZm91bmRcbiAqL1xuZnVuY3Rpb24gaGFzUGFyZW50KG5vZGUsIHBhcmVudCkge1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgIGlmIChub2RlID09IHBhcmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIHNtYWxsIGluZGV4T2Ygd3JhcHBlclxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IGZpbmRcbiAqIEByZXR1cm5zIHtCb29sZWFufSBmb3VuZFxuICovXG5mdW5jdGlvbiBpblN0cihzdHIsIGZpbmQpIHtcbiAgICByZXR1cm4gc3RyLmluZGV4T2YoZmluZCkgPiAtMTtcbn1cblxuLyoqXG4gKiBzcGxpdCBzdHJpbmcgb24gd2hpdGVzcGFjZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge0FycmF5fSB3b3Jkc1xuICovXG5mdW5jdGlvbiBzcGxpdFN0cihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRyaW0oKS5zcGxpdCgvXFxzKy9nKTtcbn1cblxuLyoqXG4gKiBmaW5kIGlmIGEgYXJyYXkgY29udGFpbnMgdGhlIG9iamVjdCB1c2luZyBpbmRleE9mIG9yIGEgc2ltcGxlIHBvbHlGaWxsXG4gKiBAcGFyYW0ge0FycmF5fSBzcmNcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaW5kXG4gKiBAcGFyYW0ge1N0cmluZ30gW2ZpbmRCeUtleV1cbiAqIEByZXR1cm4ge0Jvb2xlYW58TnVtYmVyfSBmYWxzZSB3aGVuIG5vdCBmb3VuZCwgb3IgdGhlIGluZGV4XG4gKi9cbmZ1bmN0aW9uIGluQXJyYXkoc3JjLCBmaW5kLCBmaW5kQnlLZXkpIHtcbiAgICBpZiAoc3JjLmluZGV4T2YgJiYgIWZpbmRCeUtleSkge1xuICAgICAgICByZXR1cm4gc3JjLmluZGV4T2YoZmluZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHNyYy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICgoZmluZEJ5S2V5ICYmIHNyY1tpXVtmaW5kQnlLZXldID09IGZpbmQpIHx8ICghZmluZEJ5S2V5ICYmIHNyY1tpXSA9PT0gZmluZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYXJyYXktbGlrZSBvYmplY3RzIHRvIHJlYWwgYXJyYXlzXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG9iaiwgMCk7XG59XG5cbi8qKlxuICogdW5pcXVlIGFycmF5IHdpdGggb2JqZWN0cyBiYXNlZCBvbiBhIGtleSAobGlrZSAnaWQnKSBvciBqdXN0IGJ5IHRoZSBhcnJheSdzIHZhbHVlXG4gKiBAcGFyYW0ge0FycmF5fSBzcmMgW3tpZDoxfSx7aWQ6Mn0se2lkOjF9XVxuICogQHBhcmFtIHtTdHJpbmd9IFtrZXldXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtzb3J0PUZhbHNlXVxuICogQHJldHVybnMge0FycmF5fSBbe2lkOjF9LHtpZDoyfV1cbiAqL1xuZnVuY3Rpb24gdW5pcXVlQXJyYXkoc3JjLCBrZXksIHNvcnQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICB3aGlsZSAoaSA8IHNyYy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbCA9IGtleSA/IHNyY1tpXVtrZXldIDogc3JjW2ldO1xuICAgICAgICBpZiAoaW5BcnJheSh2YWx1ZXMsIHZhbCkgPCAwKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goc3JjW2ldKTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZXNbaV0gPSB2YWw7XG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICBpZiAoc29ydCkge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuc29ydCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuc29ydChmdW5jdGlvbiBzb3J0VW5pcXVlQXJyYXkoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhW2tleV0gPiBiW2tleV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xufVxuXG4vKipcbiAqIGdldCB0aGUgcHJlZml4ZWQgcHJvcGVydHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eVxuICogQHJldHVybnMge1N0cmluZ3xVbmRlZmluZWR9IHByZWZpeGVkXG4gKi9cbmZ1bmN0aW9uIHByZWZpeGVkKG9iaiwgcHJvcGVydHkpIHtcbiAgICB2YXIgcHJlZml4LCBwcm9wO1xuICAgIHZhciBjYW1lbFByb3AgPSBwcm9wZXJ0eVswXS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSk7XG5cbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBWRU5ET1JfUFJFRklYRVMubGVuZ3RoKSB7XG4gICAgICAgIHByZWZpeCA9IFZFTkRPUl9QUkVGSVhFU1tpXTtcbiAgICAgICAgcHJvcCA9IChwcmVmaXgpID8gcHJlZml4ICsgY2FtZWxQcm9wIDogcHJvcGVydHk7XG5cbiAgICAgICAgaWYgKHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcDtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogZ2V0IGEgdW5pcXVlIGlkXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB1bmlxdWVJZFxuICovXG52YXIgX3VuaXF1ZUlkID0gMTtcbmZ1bmN0aW9uIHVuaXF1ZUlkKCkge1xuICAgIHJldHVybiBfdW5pcXVlSWQrKztcbn1cblxuLyoqXG4gKiBnZXQgdGhlIHdpbmRvdyBvYmplY3Qgb2YgYW4gZWxlbWVudFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybnMge0RvY3VtZW50Vmlld3xXaW5kb3d9XG4gKi9cbmZ1bmN0aW9uIGdldFdpbmRvd0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICAgIHZhciBkb2MgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQgfHwgZWxlbWVudDtcbiAgICByZXR1cm4gKGRvYy5kZWZhdWx0VmlldyB8fCBkb2MucGFyZW50V2luZG93IHx8IHdpbmRvdyk7XG59XG5cbnZhciBNT0JJTEVfUkVHRVggPSAvbW9iaWxlfHRhYmxldHxpcChhZHxob25lfG9kKXxhbmRyb2lkL2k7XG5cbnZhciBTVVBQT1JUX1RPVUNIID0gKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyk7XG52YXIgU1VQUE9SVF9QT0lOVEVSX0VWRU5UUyA9IHByZWZpeGVkKHdpbmRvdywgJ1BvaW50ZXJFdmVudCcpICE9PSB1bmRlZmluZWQ7XG52YXIgU1VQUE9SVF9PTkxZX1RPVUNIID0gU1VQUE9SVF9UT1VDSCAmJiBNT0JJTEVfUkVHRVgudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxudmFyIElOUFVUX1RZUEVfVE9VQ0ggPSAndG91Y2gnO1xudmFyIElOUFVUX1RZUEVfUEVOID0gJ3Blbic7XG52YXIgSU5QVVRfVFlQRV9NT1VTRSA9ICdtb3VzZSc7XG52YXIgSU5QVVRfVFlQRV9LSU5FQ1QgPSAna2luZWN0JztcblxudmFyIENPTVBVVEVfSU5URVJWQUwgPSAyNTtcblxudmFyIElOUFVUX1NUQVJUID0gMTtcbnZhciBJTlBVVF9NT1ZFID0gMjtcbnZhciBJTlBVVF9FTkQgPSA0O1xudmFyIElOUFVUX0NBTkNFTCA9IDg7XG5cbnZhciBESVJFQ1RJT05fTk9ORSA9IDE7XG52YXIgRElSRUNUSU9OX0xFRlQgPSAyO1xudmFyIERJUkVDVElPTl9SSUdIVCA9IDQ7XG52YXIgRElSRUNUSU9OX1VQID0gODtcbnZhciBESVJFQ1RJT05fRE9XTiA9IDE2O1xuXG52YXIgRElSRUNUSU9OX0hPUklaT05UQUwgPSBESVJFQ1RJT05fTEVGVCB8IERJUkVDVElPTl9SSUdIVDtcbnZhciBESVJFQ1RJT05fVkVSVElDQUwgPSBESVJFQ1RJT05fVVAgfCBESVJFQ1RJT05fRE9XTjtcbnZhciBESVJFQ1RJT05fQUxMID0gRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUw7XG5cbnZhciBQUk9QU19YWSA9IFsneCcsICd5J107XG52YXIgUFJPUFNfQ0xJRU5UX1hZID0gWydjbGllbnRYJywgJ2NsaWVudFknXTtcblxuLyoqXG4gKiBjcmVhdGUgbmV3IGlucHV0IHR5cGUgbWFuYWdlclxuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0lucHV0fVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIElucHV0KG1hbmFnZXIsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMuZWxlbWVudCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICB0aGlzLnRhcmdldCA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dFRhcmdldDtcblxuICAgIC8vIHNtYWxsZXIgd3JhcHBlciBhcm91bmQgdGhlIGhhbmRsZXIsIGZvciB0aGUgc2NvcGUgYW5kIHRoZSBlbmFibGVkIHN0YXRlIG9mIHRoZSBtYW5hZ2VyLFxuICAgIC8vIHNvIHdoZW4gZGlzYWJsZWQgdGhlIGlucHV0IGV2ZW50cyBhcmUgY29tcGxldGVseSBieXBhc3NlZC5cbiAgICB0aGlzLmRvbUhhbmRsZXIgPSBmdW5jdGlvbihldikge1xuICAgICAgICBpZiAoYm9vbE9yRm4obWFuYWdlci5vcHRpb25zLmVuYWJsZSwgW21hbmFnZXJdKSkge1xuICAgICAgICAgICAgc2VsZi5oYW5kbGVyKGV2KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmluaXQoKTtcblxufVxuXG5JbnB1dC5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogc2hvdWxkIGhhbmRsZSB0aGUgaW5wdXRFdmVudCBkYXRhIGFuZCB0cmlnZ2VyIHRoZSBjYWxsYmFja1xuICAgICAqIEB2aXJ0dWFsXG4gICAgICovXG4gICAgaGFuZGxlcjogZnVuY3Rpb24oKSB7IH0sXG5cbiAgICAvKipcbiAgICAgKiBiaW5kIHRoZSBldmVudHNcbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ldkVsICYmIGFkZEV2ZW50TGlzdGVuZXJzKHRoaXMuZWxlbWVudCwgdGhpcy5ldkVsLCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2VGFyZ2V0ICYmIGFkZEV2ZW50TGlzdGVuZXJzKHRoaXMudGFyZ2V0LCB0aGlzLmV2VGFyZ2V0LCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2V2luICYmIGFkZEV2ZW50TGlzdGVuZXJzKGdldFdpbmRvd0ZvckVsZW1lbnQodGhpcy5lbGVtZW50KSwgdGhpcy5ldldpbiwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdW5iaW5kIHRoZSBldmVudHNcbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ldkVsICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMuZWxlbWVudCwgdGhpcy5ldkVsLCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2VGFyZ2V0ICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMudGFyZ2V0LCB0aGlzLmV2VGFyZ2V0LCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2V2luICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKGdldFdpbmRvd0ZvckVsZW1lbnQodGhpcy5lbGVtZW50KSwgdGhpcy5ldldpbiwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIGNyZWF0ZSBuZXcgaW5wdXQgdHlwZSBtYW5hZ2VyXG4gKiBjYWxsZWQgYnkgdGhlIE1hbmFnZXIgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SGFtbWVyfSBtYW5hZ2VyXG4gKiBAcmV0dXJucyB7SW5wdXR9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0SW5zdGFuY2UobWFuYWdlcikge1xuICAgIHZhciBUeXBlO1xuICAgIHZhciBpbnB1dENsYXNzID0gbWFuYWdlci5vcHRpb25zLmlucHV0Q2xhc3M7XG5cbiAgICBpZiAoaW5wdXRDbGFzcykge1xuICAgICAgICBUeXBlID0gaW5wdXRDbGFzcztcbiAgICB9IGVsc2UgaWYgKFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMpIHtcbiAgICAgICAgVHlwZSA9IFBvaW50ZXJFdmVudElucHV0O1xuICAgIH0gZWxzZSBpZiAoU1VQUE9SVF9PTkxZX1RPVUNIKSB7XG4gICAgICAgIFR5cGUgPSBUb3VjaElucHV0O1xuICAgIH0gZWxzZSBpZiAoIVNVUFBPUlRfVE9VQ0gpIHtcbiAgICAgICAgVHlwZSA9IE1vdXNlSW5wdXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgVHlwZSA9IFRvdWNoTW91c2VJbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyAoVHlwZSkobWFuYWdlciwgaW5wdXRIYW5kbGVyKTtcbn1cblxuLyoqXG4gKiBoYW5kbGUgaW5wdXQgZXZlbnRzXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBpbnB1dEhhbmRsZXIobWFuYWdlciwgZXZlbnRUeXBlLCBpbnB1dCkge1xuICAgIHZhciBwb2ludGVyc0xlbiA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aDtcbiAgICB2YXIgY2hhbmdlZFBvaW50ZXJzTGVuID0gaW5wdXQuY2hhbmdlZFBvaW50ZXJzLmxlbmd0aDtcbiAgICB2YXIgaXNGaXJzdCA9IChldmVudFR5cGUgJiBJTlBVVF9TVEFSVCAmJiAocG9pbnRlcnNMZW4gLSBjaGFuZ2VkUG9pbnRlcnNMZW4gPT09IDApKTtcbiAgICB2YXIgaXNGaW5hbCA9IChldmVudFR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSAmJiAocG9pbnRlcnNMZW4gLSBjaGFuZ2VkUG9pbnRlcnNMZW4gPT09IDApKTtcblxuICAgIGlucHV0LmlzRmlyc3QgPSAhIWlzRmlyc3Q7XG4gICAgaW5wdXQuaXNGaW5hbCA9ICEhaXNGaW5hbDtcblxuICAgIGlmIChpc0ZpcnN0KSB7XG4gICAgICAgIG1hbmFnZXIuc2Vzc2lvbiA9IHt9O1xuICAgIH1cblxuICAgIC8vIHNvdXJjZSBldmVudCBpcyB0aGUgbm9ybWFsaXplZCB2YWx1ZSBvZiB0aGUgZG9tRXZlbnRzXG4gICAgLy8gbGlrZSAndG91Y2hzdGFydCwgbW91c2V1cCwgcG9pbnRlcmRvd24nXG4gICAgaW5wdXQuZXZlbnRUeXBlID0gZXZlbnRUeXBlO1xuXG4gICAgLy8gY29tcHV0ZSBzY2FsZSwgcm90YXRpb24gZXRjXG4gICAgY29tcHV0ZUlucHV0RGF0YShtYW5hZ2VyLCBpbnB1dCk7XG5cbiAgICAvLyBlbWl0IHNlY3JldCBldmVudFxuICAgIG1hbmFnZXIuZW1pdCgnaGFtbWVyLmlucHV0JywgaW5wdXQpO1xuXG4gICAgbWFuYWdlci5yZWNvZ25pemUoaW5wdXQpO1xuICAgIG1hbmFnZXIuc2Vzc2lvbi5wcmV2SW5wdXQgPSBpbnB1dDtcbn1cblxuLyoqXG4gKiBleHRlbmQgdGhlIGRhdGEgd2l0aCBzb21lIHVzYWJsZSBwcm9wZXJ0aWVzIGxpa2Ugc2NhbGUsIHJvdGF0ZSwgdmVsb2NpdHkgZXRjXG4gKiBAcGFyYW0ge09iamVjdH0gbWFuYWdlclxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVJbnB1dERhdGEobWFuYWdlciwgaW5wdXQpIHtcbiAgICB2YXIgc2Vzc2lvbiA9IG1hbmFnZXIuc2Vzc2lvbjtcbiAgICB2YXIgcG9pbnRlcnMgPSBpbnB1dC5wb2ludGVycztcbiAgICB2YXIgcG9pbnRlcnNMZW5ndGggPSBwb2ludGVycy5sZW5ndGg7XG5cbiAgICAvLyBzdG9yZSB0aGUgZmlyc3QgaW5wdXQgdG8gY2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBhbmQgZGlyZWN0aW9uXG4gICAgaWYgKCFzZXNzaW9uLmZpcnN0SW5wdXQpIHtcbiAgICAgICAgc2Vzc2lvbi5maXJzdElucHV0ID0gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpO1xuICAgIH1cblxuICAgIC8vIHRvIGNvbXB1dGUgc2NhbGUgYW5kIHJvdGF0aW9uIHdlIG5lZWQgdG8gc3RvcmUgdGhlIG11bHRpcGxlIHRvdWNoZXNcbiAgICBpZiAocG9pbnRlcnNMZW5ndGggPiAxICYmICFzZXNzaW9uLmZpcnN0TXVsdGlwbGUpIHtcbiAgICAgICAgc2Vzc2lvbi5maXJzdE11bHRpcGxlID0gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpO1xuICAgIH0gZWxzZSBpZiAocG9pbnRlcnNMZW5ndGggPT09IDEpIHtcbiAgICAgICAgc2Vzc2lvbi5maXJzdE11bHRpcGxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGZpcnN0SW5wdXQgPSBzZXNzaW9uLmZpcnN0SW5wdXQ7XG4gICAgdmFyIGZpcnN0TXVsdGlwbGUgPSBzZXNzaW9uLmZpcnN0TXVsdGlwbGU7XG4gICAgdmFyIG9mZnNldENlbnRlciA9IGZpcnN0TXVsdGlwbGUgPyBmaXJzdE11bHRpcGxlLmNlbnRlciA6IGZpcnN0SW5wdXQuY2VudGVyO1xuXG4gICAgdmFyIGNlbnRlciA9IGlucHV0LmNlbnRlciA9IGdldENlbnRlcihwb2ludGVycyk7XG4gICAgaW5wdXQudGltZVN0YW1wID0gbm93KCk7XG4gICAgaW5wdXQuZGVsdGFUaW1lID0gaW5wdXQudGltZVN0YW1wIC0gZmlyc3RJbnB1dC50aW1lU3RhbXA7XG5cbiAgICBpbnB1dC5hbmdsZSA9IGdldEFuZ2xlKG9mZnNldENlbnRlciwgY2VudGVyKTtcbiAgICBpbnB1dC5kaXN0YW5jZSA9IGdldERpc3RhbmNlKG9mZnNldENlbnRlciwgY2VudGVyKTtcblxuICAgIGNvbXB1dGVEZWx0YVhZKHNlc3Npb24sIGlucHV0KTtcbiAgICBpbnB1dC5vZmZzZXREaXJlY3Rpb24gPSBnZXREaXJlY3Rpb24oaW5wdXQuZGVsdGFYLCBpbnB1dC5kZWx0YVkpO1xuXG4gICAgdmFyIG92ZXJhbGxWZWxvY2l0eSA9IGdldFZlbG9jaXR5KGlucHV0LmRlbHRhVGltZSwgaW5wdXQuZGVsdGFYLCBpbnB1dC5kZWx0YVkpO1xuICAgIGlucHV0Lm92ZXJhbGxWZWxvY2l0eVggPSBvdmVyYWxsVmVsb2NpdHkueDtcbiAgICBpbnB1dC5vdmVyYWxsVmVsb2NpdHlZID0gb3ZlcmFsbFZlbG9jaXR5Lnk7XG4gICAgaW5wdXQub3ZlcmFsbFZlbG9jaXR5ID0gKGFicyhvdmVyYWxsVmVsb2NpdHkueCkgPiBhYnMob3ZlcmFsbFZlbG9jaXR5LnkpKSA/IG92ZXJhbGxWZWxvY2l0eS54IDogb3ZlcmFsbFZlbG9jaXR5Lnk7XG5cbiAgICBpbnB1dC5zY2FsZSA9IGZpcnN0TXVsdGlwbGUgPyBnZXRTY2FsZShmaXJzdE11bHRpcGxlLnBvaW50ZXJzLCBwb2ludGVycykgOiAxO1xuICAgIGlucHV0LnJvdGF0aW9uID0gZmlyc3RNdWx0aXBsZSA/IGdldFJvdGF0aW9uKGZpcnN0TXVsdGlwbGUucG9pbnRlcnMsIHBvaW50ZXJzKSA6IDA7XG5cbiAgICBpbnB1dC5tYXhQb2ludGVycyA9ICFzZXNzaW9uLnByZXZJbnB1dCA/IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA6ICgoaW5wdXQucG9pbnRlcnMubGVuZ3RoID5cbiAgICAgICAgc2Vzc2lvbi5wcmV2SW5wdXQubWF4UG9pbnRlcnMpID8gaW5wdXQucG9pbnRlcnMubGVuZ3RoIDogc2Vzc2lvbi5wcmV2SW5wdXQubWF4UG9pbnRlcnMpO1xuXG4gICAgY29tcHV0ZUludGVydmFsSW5wdXREYXRhKHNlc3Npb24sIGlucHV0KTtcblxuICAgIC8vIGZpbmQgdGhlIGNvcnJlY3QgdGFyZ2V0XG4gICAgdmFyIHRhcmdldCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICBpZiAoaGFzUGFyZW50KGlucHV0LnNyY0V2ZW50LnRhcmdldCwgdGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXQgPSBpbnB1dC5zcmNFdmVudC50YXJnZXQ7XG4gICAgfVxuICAgIGlucHV0LnRhcmdldCA9IHRhcmdldDtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZURlbHRhWFkoc2Vzc2lvbiwgaW5wdXQpIHtcbiAgICB2YXIgY2VudGVyID0gaW5wdXQuY2VudGVyO1xuICAgIHZhciBvZmZzZXQgPSBzZXNzaW9uLm9mZnNldERlbHRhIHx8IHt9O1xuICAgIHZhciBwcmV2RGVsdGEgPSBzZXNzaW9uLnByZXZEZWx0YSB8fCB7fTtcbiAgICB2YXIgcHJldklucHV0ID0gc2Vzc2lvbi5wcmV2SW5wdXQgfHwge307XG5cbiAgICBpZiAoaW5wdXQuZXZlbnRUeXBlID09PSBJTlBVVF9TVEFSVCB8fCBwcmV2SW5wdXQuZXZlbnRUeXBlID09PSBJTlBVVF9FTkQpIHtcbiAgICAgICAgcHJldkRlbHRhID0gc2Vzc2lvbi5wcmV2RGVsdGEgPSB7XG4gICAgICAgICAgICB4OiBwcmV2SW5wdXQuZGVsdGFYIHx8IDAsXG4gICAgICAgICAgICB5OiBwcmV2SW5wdXQuZGVsdGFZIHx8IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvZmZzZXQgPSBzZXNzaW9uLm9mZnNldERlbHRhID0ge1xuICAgICAgICAgICAgeDogY2VudGVyLngsXG4gICAgICAgICAgICB5OiBjZW50ZXIueVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlucHV0LmRlbHRhWCA9IHByZXZEZWx0YS54ICsgKGNlbnRlci54IC0gb2Zmc2V0LngpO1xuICAgIGlucHV0LmRlbHRhWSA9IHByZXZEZWx0YS55ICsgKGNlbnRlci55IC0gb2Zmc2V0LnkpO1xufVxuXG4vKipcbiAqIHZlbG9jaXR5IGlzIGNhbGN1bGF0ZWQgZXZlcnkgeCBtc1xuICogQHBhcmFtIHtPYmplY3R9IHNlc3Npb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBjb21wdXRlSW50ZXJ2YWxJbnB1dERhdGEoc2Vzc2lvbiwgaW5wdXQpIHtcbiAgICB2YXIgbGFzdCA9IHNlc3Npb24ubGFzdEludGVydmFsIHx8IGlucHV0LFxuICAgICAgICBkZWx0YVRpbWUgPSBpbnB1dC50aW1lU3RhbXAgLSBsYXN0LnRpbWVTdGFtcCxcbiAgICAgICAgdmVsb2NpdHksIHZlbG9jaXR5WCwgdmVsb2NpdHlZLCBkaXJlY3Rpb247XG5cbiAgICBpZiAoaW5wdXQuZXZlbnRUeXBlICE9IElOUFVUX0NBTkNFTCAmJiAoZGVsdGFUaW1lID4gQ09NUFVURV9JTlRFUlZBTCB8fCBsYXN0LnZlbG9jaXR5ID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgIHZhciBkZWx0YVggPSBpbnB1dC5kZWx0YVggLSBsYXN0LmRlbHRhWDtcbiAgICAgICAgdmFyIGRlbHRhWSA9IGlucHV0LmRlbHRhWSAtIGxhc3QuZGVsdGFZO1xuXG4gICAgICAgIHZhciB2ID0gZ2V0VmVsb2NpdHkoZGVsdGFUaW1lLCBkZWx0YVgsIGRlbHRhWSk7XG4gICAgICAgIHZlbG9jaXR5WCA9IHYueDtcbiAgICAgICAgdmVsb2NpdHlZID0gdi55O1xuICAgICAgICB2ZWxvY2l0eSA9IChhYnModi54KSA+IGFicyh2LnkpKSA/IHYueCA6IHYueTtcbiAgICAgICAgZGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uKGRlbHRhWCwgZGVsdGFZKTtcblxuICAgICAgICBzZXNzaW9uLmxhc3RJbnRlcnZhbCA9IGlucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHVzZSBsYXRlc3QgdmVsb2NpdHkgaW5mbyBpZiBpdCBkb2Vzbid0IG92ZXJ0YWtlIGEgbWluaW11bSBwZXJpb2RcbiAgICAgICAgdmVsb2NpdHkgPSBsYXN0LnZlbG9jaXR5O1xuICAgICAgICB2ZWxvY2l0eVggPSBsYXN0LnZlbG9jaXR5WDtcbiAgICAgICAgdmVsb2NpdHlZID0gbGFzdC52ZWxvY2l0eVk7XG4gICAgICAgIGRpcmVjdGlvbiA9IGxhc3QuZGlyZWN0aW9uO1xuICAgIH1cblxuICAgIGlucHV0LnZlbG9jaXR5ID0gdmVsb2NpdHk7XG4gICAgaW5wdXQudmVsb2NpdHlYID0gdmVsb2NpdHlYO1xuICAgIGlucHV0LnZlbG9jaXR5WSA9IHZlbG9jaXR5WTtcbiAgICBpbnB1dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG59XG5cbi8qKlxuICogY3JlYXRlIGEgc2ltcGxlIGNsb25lIGZyb20gdGhlIGlucHV0IHVzZWQgZm9yIHN0b3JhZ2Ugb2YgZmlyc3RJbnB1dCBhbmQgZmlyc3RNdWx0aXBsZVxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBjbG9uZWRJbnB1dERhdGFcbiAqL1xuZnVuY3Rpb24gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpIHtcbiAgICAvLyBtYWtlIGEgc2ltcGxlIGNvcHkgb2YgdGhlIHBvaW50ZXJzIGJlY2F1c2Ugd2Ugd2lsbCBnZXQgYSByZWZlcmVuY2UgaWYgd2UgZG9uJ3RcbiAgICAvLyB3ZSBvbmx5IG5lZWQgY2xpZW50WFkgZm9yIHRoZSBjYWxjdWxhdGlvbnNcbiAgICB2YXIgcG9pbnRlcnMgPSBbXTtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBpbnB1dC5wb2ludGVycy5sZW5ndGgpIHtcbiAgICAgICAgcG9pbnRlcnNbaV0gPSB7XG4gICAgICAgICAgICBjbGllbnRYOiByb3VuZChpbnB1dC5wb2ludGVyc1tpXS5jbGllbnRYKSxcbiAgICAgICAgICAgIGNsaWVudFk6IHJvdW5kKGlucHV0LnBvaW50ZXJzW2ldLmNsaWVudFkpXG4gICAgICAgIH07XG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aW1lU3RhbXA6IG5vdygpLFxuICAgICAgICBwb2ludGVyczogcG9pbnRlcnMsXG4gICAgICAgIGNlbnRlcjogZ2V0Q2VudGVyKHBvaW50ZXJzKSxcbiAgICAgICAgZGVsdGFYOiBpbnB1dC5kZWx0YVgsXG4gICAgICAgIGRlbHRhWTogaW5wdXQuZGVsdGFZXG4gICAgfTtcbn1cblxuLyoqXG4gKiBnZXQgdGhlIGNlbnRlciBvZiBhbGwgdGhlIHBvaW50ZXJzXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludGVyc1xuICogQHJldHVybiB7T2JqZWN0fSBjZW50ZXIgY29udGFpbnMgYHhgIGFuZCBgeWAgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBnZXRDZW50ZXIocG9pbnRlcnMpIHtcbiAgICB2YXIgcG9pbnRlcnNMZW5ndGggPSBwb2ludGVycy5sZW5ndGg7XG5cbiAgICAvLyBubyBuZWVkIHRvIGxvb3Agd2hlbiBvbmx5IG9uZSB0b3VjaFxuICAgIGlmIChwb2ludGVyc0xlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogcm91bmQocG9pbnRlcnNbMF0uY2xpZW50WCksXG4gICAgICAgICAgICB5OiByb3VuZChwb2ludGVyc1swXS5jbGllbnRZKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciB4ID0gMCwgeSA9IDAsIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgcG9pbnRlcnNMZW5ndGgpIHtcbiAgICAgICAgeCArPSBwb2ludGVyc1tpXS5jbGllbnRYO1xuICAgICAgICB5ICs9IHBvaW50ZXJzW2ldLmNsaWVudFk7XG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB4OiByb3VuZCh4IC8gcG9pbnRlcnNMZW5ndGgpLFxuICAgICAgICB5OiByb3VuZCh5IC8gcG9pbnRlcnNMZW5ndGgpXG4gICAgfTtcbn1cblxuLyoqXG4gKiBjYWxjdWxhdGUgdGhlIHZlbG9jaXR5IGJldHdlZW4gdHdvIHBvaW50cy4gdW5pdCBpcyBpbiBweCBwZXIgbXMuXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsdGFUaW1lXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqIEByZXR1cm4ge09iamVjdH0gdmVsb2NpdHkgYHhgIGFuZCBgeWBcbiAqL1xuZnVuY3Rpb24gZ2V0VmVsb2NpdHkoZGVsdGFUaW1lLCB4LCB5KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogeCAvIGRlbHRhVGltZSB8fCAwLFxuICAgICAgICB5OiB5IC8gZGVsdGFUaW1lIHx8IDBcbiAgICB9O1xufVxuXG4vKipcbiAqIGdldCB0aGUgZGlyZWN0aW9uIGJldHdlZW4gdHdvIHBvaW50c1xuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGRpcmVjdGlvblxuICovXG5mdW5jdGlvbiBnZXREaXJlY3Rpb24oeCwgeSkge1xuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAgIHJldHVybiBESVJFQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICBpZiAoYWJzKHgpID49IGFicyh5KSkge1xuICAgICAgICByZXR1cm4geCA8IDAgPyBESVJFQ1RJT05fTEVGVCA6IERJUkVDVElPTl9SSUdIVDtcbiAgICB9XG4gICAgcmV0dXJuIHkgPCAwID8gRElSRUNUSU9OX1VQIDogRElSRUNUSU9OX0RPV047XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSBhYnNvbHV0ZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBwMSB7eCwgeX1cbiAqIEBwYXJhbSB7T2JqZWN0fSBwMiB7eCwgeX1cbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcbiAqIEByZXR1cm4ge051bWJlcn0gZGlzdGFuY2VcbiAqL1xuZnVuY3Rpb24gZ2V0RGlzdGFuY2UocDEsIHAyLCBwcm9wcykge1xuICAgIGlmICghcHJvcHMpIHtcbiAgICAgICAgcHJvcHMgPSBQUk9QU19YWTtcbiAgICB9XG4gICAgdmFyIHggPSBwMltwcm9wc1swXV0gLSBwMVtwcm9wc1swXV0sXG4gICAgICAgIHkgPSBwMltwcm9wc1sxXV0gLSBwMVtwcm9wc1sxXV07XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ICogeCkgKyAoeSAqIHkpKTtcbn1cblxuLyoqXG4gKiBjYWxjdWxhdGUgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIGNvb3JkaW5hdGVzXG4gKiBAcGFyYW0ge09iamVjdH0gcDFcbiAqIEBwYXJhbSB7T2JqZWN0fSBwMlxuICogQHBhcmFtIHtBcnJheX0gW3Byb3BzXSBjb250YWluaW5nIHggYW5kIHkga2V5c1xuICogQHJldHVybiB7TnVtYmVyfSBhbmdsZVxuICovXG5mdW5jdGlvbiBnZXRBbmdsZShwMSwgcDIsIHByb3BzKSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgICBwcm9wcyA9IFBST1BTX1hZO1xuICAgIH1cbiAgICB2YXIgeCA9IHAyW3Byb3BzWzBdXSAtIHAxW3Byb3BzWzBdXSxcbiAgICAgICAgeSA9IHAyW3Byb3BzWzFdXSAtIHAxW3Byb3BzWzFdXTtcbiAgICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KSAqIDE4MCAvIE1hdGguUEk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSByb3RhdGlvbiBkZWdyZWVzIGJldHdlZW4gdHdvIHBvaW50ZXJzZXRzXG4gKiBAcGFyYW0ge0FycmF5fSBzdGFydCBhcnJheSBvZiBwb2ludGVyc1xuICogQHBhcmFtIHtBcnJheX0gZW5kIGFycmF5IG9mIHBvaW50ZXJzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHJvdGF0aW9uXG4gKi9cbmZ1bmN0aW9uIGdldFJvdGF0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZ2V0QW5nbGUoZW5kWzFdLCBlbmRbMF0sIFBST1BTX0NMSUVOVF9YWSkgKyBnZXRBbmdsZShzdGFydFsxXSwgc3RhcnRbMF0sIFBST1BTX0NMSUVOVF9YWSk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSBzY2FsZSBmYWN0b3IgYmV0d2VlbiB0d28gcG9pbnRlcnNldHNcbiAqIG5vIHNjYWxlIGlzIDEsIGFuZCBnb2VzIGRvd24gdG8gMCB3aGVuIHBpbmNoZWQgdG9nZXRoZXIsIGFuZCBiaWdnZXIgd2hlbiBwaW5jaGVkIG91dFxuICogQHBhcmFtIHtBcnJheX0gc3RhcnQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZCBhcnJheSBvZiBwb2ludGVyc1xuICogQHJldHVybiB7TnVtYmVyfSBzY2FsZVxuICovXG5mdW5jdGlvbiBnZXRTY2FsZShzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGdldERpc3RhbmNlKGVuZFswXSwgZW5kWzFdLCBQUk9QU19DTElFTlRfWFkpIC8gZ2V0RGlzdGFuY2Uoc3RhcnRbMF0sIHN0YXJ0WzFdLCBQUk9QU19DTElFTlRfWFkpO1xufVxuXG52YXIgTU9VU0VfSU5QVVRfTUFQID0ge1xuICAgIG1vdXNlZG93bjogSU5QVVRfU1RBUlQsXG4gICAgbW91c2Vtb3ZlOiBJTlBVVF9NT1ZFLFxuICAgIG1vdXNldXA6IElOUFVUX0VORFxufTtcblxudmFyIE1PVVNFX0VMRU1FTlRfRVZFTlRTID0gJ21vdXNlZG93bic7XG52YXIgTU9VU0VfV0lORE9XX0VWRU5UUyA9ICdtb3VzZW1vdmUgbW91c2V1cCc7XG5cbi8qKlxuICogTW91c2UgZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cbmZ1bmN0aW9uIE1vdXNlSW5wdXQoKSB7XG4gICAgdGhpcy5ldkVsID0gTU9VU0VfRUxFTUVOVF9FVkVOVFM7XG4gICAgdGhpcy5ldldpbiA9IE1PVVNFX1dJTkRPV19FVkVOVFM7XG5cbiAgICB0aGlzLnByZXNzZWQgPSBmYWxzZTsgLy8gbW91c2Vkb3duIHN0YXRlXG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KE1vdXNlSW5wdXQsIElucHV0LCB7XG4gICAgLyoqXG4gICAgICogaGFuZGxlIG1vdXNlIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICAgICAqL1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIE1FaGFuZGxlcihldikge1xuICAgICAgICB2YXIgZXZlbnRUeXBlID0gTU9VU0VfSU5QVVRfTUFQW2V2LnR5cGVdO1xuXG4gICAgICAgIC8vIG9uIHN0YXJ0IHdlIHdhbnQgdG8gaGF2ZSB0aGUgbGVmdCBtb3VzZSBidXR0b24gZG93blxuICAgICAgICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgZXYuYnV0dG9uID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnByZXNzZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX01PVkUgJiYgZXYud2hpY2ggIT09IDEpIHtcbiAgICAgICAgICAgIGV2ZW50VHlwZSA9IElOUFVUX0VORDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1vdXNlIG11c3QgYmUgZG93blxuICAgICAgICBpZiAoIXRoaXMucHJlc3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX0VORCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgZXZlbnRUeXBlLCB7XG4gICAgICAgICAgICBwb2ludGVyczogW2V2XSxcbiAgICAgICAgICAgIGNoYW5nZWRQb2ludGVyczogW2V2XSxcbiAgICAgICAgICAgIHBvaW50ZXJUeXBlOiBJTlBVVF9UWVBFX01PVVNFLFxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG52YXIgUE9JTlRFUl9JTlBVVF9NQVAgPSB7XG4gICAgcG9pbnRlcmRvd246IElOUFVUX1NUQVJULFxuICAgIHBvaW50ZXJtb3ZlOiBJTlBVVF9NT1ZFLFxuICAgIHBvaW50ZXJ1cDogSU5QVVRfRU5ELFxuICAgIHBvaW50ZXJjYW5jZWw6IElOUFVUX0NBTkNFTCxcbiAgICBwb2ludGVyb3V0OiBJTlBVVF9DQU5DRUxcbn07XG5cbi8vIGluIElFMTAgdGhlIHBvaW50ZXIgdHlwZXMgaXMgZGVmaW5lZCBhcyBhbiBlbnVtXG52YXIgSUUxMF9QT0lOVEVSX1RZUEVfRU5VTSA9IHtcbiAgICAyOiBJTlBVVF9UWVBFX1RPVUNILFxuICAgIDM6IElOUFVUX1RZUEVfUEVOLFxuICAgIDQ6IElOUFVUX1RZUEVfTU9VU0UsXG4gICAgNTogSU5QVVRfVFlQRV9LSU5FQ1QgLy8gc2VlIGh0dHBzOi8vdHdpdHRlci5jb20vamFjb2Jyb3NzaS9zdGF0dXMvNDgwNTk2NDM4NDg5ODkwODE2XG59O1xuXG52YXIgUE9JTlRFUl9FTEVNRU5UX0VWRU5UUyA9ICdwb2ludGVyZG93bic7XG52YXIgUE9JTlRFUl9XSU5ET1dfRVZFTlRTID0gJ3BvaW50ZXJtb3ZlIHBvaW50ZXJ1cCBwb2ludGVyY2FuY2VsJztcblxuLy8gSUUxMCBoYXMgcHJlZml4ZWQgc3VwcG9ydCwgYW5kIGNhc2Utc2Vuc2l0aXZlXG5pZiAod2luZG93Lk1TUG9pbnRlckV2ZW50ICYmICF3aW5kb3cuUG9pbnRlckV2ZW50KSB7XG4gICAgUE9JTlRFUl9FTEVNRU5UX0VWRU5UUyA9ICdNU1BvaW50ZXJEb3duJztcbiAgICBQT0lOVEVSX1dJTkRPV19FVkVOVFMgPSAnTVNQb2ludGVyTW92ZSBNU1BvaW50ZXJVcCBNU1BvaW50ZXJDYW5jZWwnO1xufVxuXG4vKipcbiAqIFBvaW50ZXIgZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cbmZ1bmN0aW9uIFBvaW50ZXJFdmVudElucHV0KCkge1xuICAgIHRoaXMuZXZFbCA9IFBPSU5URVJfRUxFTUVOVF9FVkVOVFM7XG4gICAgdGhpcy5ldldpbiA9IFBPSU5URVJfV0lORE9XX0VWRU5UUztcblxuICAgIElucHV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLnN0b3JlID0gKHRoaXMubWFuYWdlci5zZXNzaW9uLnBvaW50ZXJFdmVudHMgPSBbXSk7XG59XG5cbmluaGVyaXQoUG9pbnRlckV2ZW50SW5wdXQsIElucHV0LCB7XG4gICAgLyoqXG4gICAgICogaGFuZGxlIG1vdXNlIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICAgICAqL1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIFBFaGFuZGxlcihldikge1xuICAgICAgICB2YXIgc3RvcmUgPSB0aGlzLnN0b3JlO1xuICAgICAgICB2YXIgcmVtb3ZlUG9pbnRlciA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBldmVudFR5cGVOb3JtYWxpemVkID0gZXYudHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ21zJywgJycpO1xuICAgICAgICB2YXIgZXZlbnRUeXBlID0gUE9JTlRFUl9JTlBVVF9NQVBbZXZlbnRUeXBlTm9ybWFsaXplZF07XG4gICAgICAgIHZhciBwb2ludGVyVHlwZSA9IElFMTBfUE9JTlRFUl9UWVBFX0VOVU1bZXYucG9pbnRlclR5cGVdIHx8IGV2LnBvaW50ZXJUeXBlO1xuXG4gICAgICAgIHZhciBpc1RvdWNoID0gKHBvaW50ZXJUeXBlID09IElOUFVUX1RZUEVfVE9VQ0gpO1xuXG4gICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgZXZlbnQgaW4gdGhlIHN0b3JlXG4gICAgICAgIHZhciBzdG9yZUluZGV4ID0gaW5BcnJheShzdG9yZSwgZXYucG9pbnRlcklkLCAncG9pbnRlcklkJyk7XG5cbiAgICAgICAgLy8gc3RhcnQgYW5kIG1vdXNlIG11c3QgYmUgZG93blxuICAgICAgICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgKGV2LmJ1dHRvbiA9PT0gMCB8fCBpc1RvdWNoKSkge1xuICAgICAgICAgICAgaWYgKHN0b3JlSW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgc3RvcmUucHVzaChldik7XG4gICAgICAgICAgICAgICAgc3RvcmVJbmRleCA9IHN0b3JlLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgICAgIHJlbW92ZVBvaW50ZXIgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaXQgbm90IGZvdW5kLCBzbyB0aGUgcG9pbnRlciBoYXNuJ3QgYmVlbiBkb3duIChzbyBpdCdzIHByb2JhYmx5IGEgaG92ZXIpXG4gICAgICAgIGlmIChzdG9yZUluZGV4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBldmVudCBpbiB0aGUgc3RvcmVcbiAgICAgICAgc3RvcmVbc3RvcmVJbmRleF0gPSBldjtcblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgZXZlbnRUeXBlLCB7XG4gICAgICAgICAgICBwb2ludGVyczogc3RvcmUsXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogcG9pbnRlclR5cGUsXG4gICAgICAgICAgICBzcmNFdmVudDogZXZcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlbW92ZVBvaW50ZXIpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBzdG9yZVxuICAgICAgICAgICAgc3RvcmUuc3BsaWNlKHN0b3JlSW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbnZhciBTSU5HTEVfVE9VQ0hfSU5QVVRfTUFQID0ge1xuICAgIHRvdWNoc3RhcnQ6IElOUFVUX1NUQVJULFxuICAgIHRvdWNobW92ZTogSU5QVVRfTU9WRSxcbiAgICB0b3VjaGVuZDogSU5QVVRfRU5ELFxuICAgIHRvdWNoY2FuY2VsOiBJTlBVVF9DQU5DRUxcbn07XG5cbnZhciBTSU5HTEVfVE9VQ0hfVEFSR0VUX0VWRU5UUyA9ICd0b3VjaHN0YXJ0JztcbnZhciBTSU5HTEVfVE9VQ0hfV0lORE9XX0VWRU5UUyA9ICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCc7XG5cbi8qKlxuICogVG91Y2ggZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cbmZ1bmN0aW9uIFNpbmdsZVRvdWNoSW5wdXQoKSB7XG4gICAgdGhpcy5ldlRhcmdldCA9IFNJTkdMRV9UT1VDSF9UQVJHRVRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBTSU5HTEVfVE9VQ0hfV0lORE9XX0VWRU5UUztcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIElucHV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoU2luZ2xlVG91Y2hJbnB1dCwgSW5wdXQsIHtcbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBURWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBTSU5HTEVfVE9VQ0hfSU5QVVRfTUFQW2V2LnR5cGVdO1xuXG4gICAgICAgIC8vIHNob3VsZCB3ZSBoYW5kbGUgdGhlIHRvdWNoIGV2ZW50cz9cbiAgICAgICAgaWYgKHR5cGUgPT09IElOUFVUX1NUQVJUKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b3VjaGVzID0gbm9ybWFsaXplU2luZ2xlVG91Y2hlcy5jYWxsKHRoaXMsIGV2LCB0eXBlKTtcblxuICAgICAgICAvLyB3aGVuIGRvbmUsIHJlc2V0IHRoZSBzdGFydGVkIHN0YXRlXG4gICAgICAgIGlmICh0eXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkgJiYgdG91Y2hlc1swXS5sZW5ndGggLSB0b3VjaGVzWzFdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHRvdWNoZXNbMF0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IHRvdWNoZXNbMV0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBAdGhpcyB7VG91Y2hJbnB1dH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICogQHBhcmFtIHtOdW1iZXJ9IHR5cGUgZmxhZ1xuICogQHJldHVybnMge3VuZGVmaW5lZHxBcnJheX0gW2FsbCwgY2hhbmdlZF1cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplU2luZ2xlVG91Y2hlcyhldiwgdHlwZSkge1xuICAgIHZhciBhbGwgPSB0b0FycmF5KGV2LnRvdWNoZXMpO1xuICAgIHZhciBjaGFuZ2VkID0gdG9BcnJheShldi5jaGFuZ2VkVG91Y2hlcyk7XG5cbiAgICBpZiAodHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpKSB7XG4gICAgICAgIGFsbCA9IHVuaXF1ZUFycmF5KGFsbC5jb25jYXQoY2hhbmdlZCksICdpZGVudGlmaWVyJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFthbGwsIGNoYW5nZWRdO1xufVxuXG52YXIgVE9VQ0hfSU5QVVRfTUFQID0ge1xuICAgIHRvdWNoc3RhcnQ6IElOUFVUX1NUQVJULFxuICAgIHRvdWNobW92ZTogSU5QVVRfTU9WRSxcbiAgICB0b3VjaGVuZDogSU5QVVRfRU5ELFxuICAgIHRvdWNoY2FuY2VsOiBJTlBVVF9DQU5DRUxcbn07XG5cbnZhciBUT1VDSF9UQVJHRVRfRVZFTlRTID0gJ3RvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsJztcblxuLyoqXG4gKiBNdWx0aS11c2VyIHRvdWNoIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBUb3VjaElucHV0KCkge1xuICAgIHRoaXMuZXZUYXJnZXQgPSBUT1VDSF9UQVJHRVRfRVZFTlRTO1xuICAgIHRoaXMudGFyZ2V0SWRzID0ge307XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFRvdWNoSW5wdXQsIElucHV0LCB7XG4gICAgaGFuZGxlcjogZnVuY3Rpb24gTVRFaGFuZGxlcihldikge1xuICAgICAgICB2YXIgdHlwZSA9IFRPVUNIX0lOUFVUX01BUFtldi50eXBlXTtcbiAgICAgICAgdmFyIHRvdWNoZXMgPSBnZXRUb3VjaGVzLmNhbGwodGhpcywgZXYsIHR5cGUpO1xuICAgICAgICBpZiAoIXRvdWNoZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLCB0eXBlLCB7XG4gICAgICAgICAgICBwb2ludGVyczogdG91Y2hlc1swXSxcbiAgICAgICAgICAgIGNoYW5nZWRQb2ludGVyczogdG91Y2hlc1sxXSxcbiAgICAgICAgICAgIHBvaW50ZXJUeXBlOiBJTlBVVF9UWVBFX1RPVUNILFxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEB0aGlzIHtUb3VjaElucHV0fVxuICogQHBhcmFtIHtPYmplY3R9IGV2XG4gKiBAcGFyYW0ge051bWJlcn0gdHlwZSBmbGFnXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfEFycmF5fSBbYWxsLCBjaGFuZ2VkXVxuICovXG5mdW5jdGlvbiBnZXRUb3VjaGVzKGV2LCB0eXBlKSB7XG4gICAgdmFyIGFsbFRvdWNoZXMgPSB0b0FycmF5KGV2LnRvdWNoZXMpO1xuICAgIHZhciB0YXJnZXRJZHMgPSB0aGlzLnRhcmdldElkcztcblxuICAgIC8vIHdoZW4gdGhlcmUgaXMgb25seSBvbmUgdG91Y2gsIHRoZSBwcm9jZXNzIGNhbiBiZSBzaW1wbGlmaWVkXG4gICAgaWYgKHR5cGUgJiAoSU5QVVRfU1RBUlQgfCBJTlBVVF9NT1ZFKSAmJiBhbGxUb3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0YXJnZXRJZHNbYWxsVG91Y2hlc1swXS5pZGVudGlmaWVyXSA9IHRydWU7XG4gICAgICAgIHJldHVybiBbYWxsVG91Y2hlcywgYWxsVG91Y2hlc107XG4gICAgfVxuXG4gICAgdmFyIGksXG4gICAgICAgIHRhcmdldFRvdWNoZXMsXG4gICAgICAgIGNoYW5nZWRUb3VjaGVzID0gdG9BcnJheShldi5jaGFuZ2VkVG91Y2hlcyksXG4gICAgICAgIGNoYW5nZWRUYXJnZXRUb3VjaGVzID0gW10sXG4gICAgICAgIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuXG4gICAgLy8gZ2V0IHRhcmdldCB0b3VjaGVzIGZyb20gdG91Y2hlc1xuICAgIHRhcmdldFRvdWNoZXMgPSBhbGxUb3VjaGVzLmZpbHRlcihmdW5jdGlvbih0b3VjaCkge1xuICAgICAgICByZXR1cm4gaGFzUGFyZW50KHRvdWNoLnRhcmdldCwgdGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIC8vIGNvbGxlY3QgdG91Y2hlc1xuICAgIGlmICh0eXBlID09PSBJTlBVVF9TVEFSVCkge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCB0YXJnZXRUb3VjaGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGFyZ2V0SWRzW3RhcmdldFRvdWNoZXNbaV0uaWRlbnRpZmllcl0gPSB0cnVlO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZmlsdGVyIGNoYW5nZWQgdG91Y2hlcyB0byBvbmx5IGNvbnRhaW4gdG91Y2hlcyB0aGF0IGV4aXN0IGluIHRoZSBjb2xsZWN0ZWQgdGFyZ2V0IGlkc1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgY2hhbmdlZFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh0YXJnZXRJZHNbY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllcl0pIHtcbiAgICAgICAgICAgIGNoYW5nZWRUYXJnZXRUb3VjaGVzLnB1c2goY2hhbmdlZFRvdWNoZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xlYW51cCByZW1vdmVkIHRvdWNoZXNcbiAgICAgICAgaWYgKHR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgICAgICAgICAgZGVsZXRlIHRhcmdldElkc1tjaGFuZ2VkVG91Y2hlc1tpXS5pZGVudGlmaWVyXTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgaWYgKCFjaGFuZ2VkVGFyZ2V0VG91Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICAgIC8vIG1lcmdlIHRhcmdldFRvdWNoZXMgd2l0aCBjaGFuZ2VkVGFyZ2V0VG91Y2hlcyBzbyBpdCBjb250YWlucyBBTEwgdG91Y2hlcywgaW5jbHVkaW5nICdlbmQnIGFuZCAnY2FuY2VsJ1xuICAgICAgICB1bmlxdWVBcnJheSh0YXJnZXRUb3VjaGVzLmNvbmNhdChjaGFuZ2VkVGFyZ2V0VG91Y2hlcyksICdpZGVudGlmaWVyJywgdHJ1ZSksXG4gICAgICAgIGNoYW5nZWRUYXJnZXRUb3VjaGVzXG4gICAgXTtcbn1cblxuLyoqXG4gKiBDb21iaW5lZCB0b3VjaCBhbmQgbW91c2UgaW5wdXRcbiAqXG4gKiBUb3VjaCBoYXMgYSBoaWdoZXIgcHJpb3JpdHkgdGhlbiBtb3VzZSwgYW5kIHdoaWxlIHRvdWNoaW5nIG5vIG1vdXNlIGV2ZW50cyBhcmUgYWxsb3dlZC5cbiAqIFRoaXMgYmVjYXVzZSB0b3VjaCBkZXZpY2VzIGFsc28gZW1pdCBtb3VzZSBldmVudHMgd2hpbGUgZG9pbmcgYSB0b3VjaC5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cblxudmFyIERFRFVQX1RJTUVPVVQgPSAyNTAwO1xudmFyIERFRFVQX0RJU1RBTkNFID0gMjU7XG5cbmZ1bmN0aW9uIFRvdWNoTW91c2VJbnB1dCgpIHtcbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdmFyIGhhbmRsZXIgPSBiaW5kRm4odGhpcy5oYW5kbGVyLCB0aGlzKTtcbiAgICB0aGlzLnRvdWNoID0gbmV3IFRvdWNoSW5wdXQodGhpcy5tYW5hZ2VyLCBoYW5kbGVyKTtcbiAgICB0aGlzLm1vdXNlID0gbmV3IE1vdXNlSW5wdXQodGhpcy5tYW5hZ2VyLCBoYW5kbGVyKTtcblxuICAgIHRoaXMucHJpbWFyeVRvdWNoID0gbnVsbDtcbiAgICB0aGlzLmxhc3RUb3VjaGVzID0gW107XG59XG5cbmluaGVyaXQoVG91Y2hNb3VzZUlucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBhbmQgdG91Y2ggZXZlbnRzXG4gICAgICogQHBhcmFtIHtIYW1tZXJ9IG1hbmFnZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRFdmVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBUTUVoYW5kbGVyKG1hbmFnZXIsIGlucHV0RXZlbnQsIGlucHV0RGF0YSkge1xuICAgICAgICB2YXIgaXNUb3VjaCA9IChpbnB1dERhdGEucG9pbnRlclR5cGUgPT0gSU5QVVRfVFlQRV9UT1VDSCksXG4gICAgICAgICAgICBpc01vdXNlID0gKGlucHV0RGF0YS5wb2ludGVyVHlwZSA9PSBJTlBVVF9UWVBFX01PVVNFKTtcblxuICAgICAgICBpZiAoaXNNb3VzZSAmJiBpbnB1dERhdGEuc291cmNlQ2FwYWJpbGl0aWVzICYmIGlucHV0RGF0YS5zb3VyY2VDYXBhYmlsaXRpZXMuZmlyZXNUb3VjaEV2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2hlbiB3ZSdyZSBpbiBhIHRvdWNoIGV2ZW50LCByZWNvcmQgdG91Y2hlcyB0byAgZGUtZHVwZSBzeW50aGV0aWMgbW91c2UgZXZlbnRcbiAgICAgICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgICAgICAgIHJlY29yZFRvdWNoZXMuY2FsbCh0aGlzLCBpbnB1dEV2ZW50LCBpbnB1dERhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzTW91c2UgJiYgaXNTeW50aGV0aWNFdmVudC5jYWxsKHRoaXMsIGlucHV0RGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsbGJhY2sobWFuYWdlciwgaW5wdXRFdmVudCwgaW5wdXREYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnRvdWNoLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5tb3VzZS5kZXN0cm95KCk7XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIHJlY29yZFRvdWNoZXMoZXZlbnRUeXBlLCBldmVudERhdGEpIHtcbiAgICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpIHtcbiAgICAgICAgdGhpcy5wcmltYXJ5VG91Y2ggPSBldmVudERhdGEuY2hhbmdlZFBvaW50ZXJzWzBdLmlkZW50aWZpZXI7XG4gICAgICAgIHNldExhc3RUb3VjaC5jYWxsKHRoaXMsIGV2ZW50RGF0YSk7XG4gICAgfSBlbHNlIGlmIChldmVudFR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgICAgICBzZXRMYXN0VG91Y2guY2FsbCh0aGlzLCBldmVudERhdGEpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0TGFzdFRvdWNoKGV2ZW50RGF0YSkge1xuICAgIHZhciB0b3VjaCA9IGV2ZW50RGF0YS5jaGFuZ2VkUG9pbnRlcnNbMF07XG5cbiAgICBpZiAodG91Y2guaWRlbnRpZmllciA9PT0gdGhpcy5wcmltYXJ5VG91Y2gpIHtcbiAgICAgICAgdmFyIGxhc3RUb3VjaCA9IHt4OiB0b3VjaC5jbGllbnRYLCB5OiB0b3VjaC5jbGllbnRZfTtcbiAgICAgICAgdGhpcy5sYXN0VG91Y2hlcy5wdXNoKGxhc3RUb3VjaCk7XG4gICAgICAgIHZhciBsdHMgPSB0aGlzLmxhc3RUb3VjaGVzO1xuICAgICAgICB2YXIgcmVtb3ZlTGFzdFRvdWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGx0cy5pbmRleE9mKGxhc3RUb3VjaCk7XG4gICAgICAgICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbHRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc2V0VGltZW91dChyZW1vdmVMYXN0VG91Y2gsIERFRFVQX1RJTUVPVVQpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNTeW50aGV0aWNFdmVudChldmVudERhdGEpIHtcbiAgICB2YXIgeCA9IGV2ZW50RGF0YS5zcmNFdmVudC5jbGllbnRYLCB5ID0gZXZlbnREYXRhLnNyY0V2ZW50LmNsaWVudFk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxhc3RUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcy5sYXN0VG91Y2hlc1tpXTtcbiAgICAgICAgdmFyIGR4ID0gTWF0aC5hYnMoeCAtIHQueCksIGR5ID0gTWF0aC5hYnMoeSAtIHQueSk7XG4gICAgICAgIGlmIChkeCA8PSBERURVUF9ESVNUQU5DRSAmJiBkeSA8PSBERURVUF9ESVNUQU5DRSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgUFJFRklYRURfVE9VQ0hfQUNUSU9OID0gcHJlZml4ZWQoVEVTVF9FTEVNRU5ULnN0eWxlLCAndG91Y2hBY3Rpb24nKTtcbnZhciBOQVRJVkVfVE9VQ0hfQUNUSU9OID0gUFJFRklYRURfVE9VQ0hfQUNUSU9OICE9PSB1bmRlZmluZWQ7XG5cbi8vIG1hZ2ljYWwgdG91Y2hBY3Rpb24gdmFsdWVcbnZhciBUT1VDSF9BQ1RJT05fQ09NUFVURSA9ICdjb21wdXRlJztcbnZhciBUT1VDSF9BQ1RJT05fQVVUTyA9ICdhdXRvJztcbnZhciBUT1VDSF9BQ1RJT05fTUFOSVBVTEFUSU9OID0gJ21hbmlwdWxhdGlvbic7IC8vIG5vdCBpbXBsZW1lbnRlZFxudmFyIFRPVUNIX0FDVElPTl9OT05FID0gJ25vbmUnO1xudmFyIFRPVUNIX0FDVElPTl9QQU5fWCA9ICdwYW4teCc7XG52YXIgVE9VQ0hfQUNUSU9OX1BBTl9ZID0gJ3Bhbi15JztcbnZhciBUT1VDSF9BQ1RJT05fTUFQID0gZ2V0VG91Y2hBY3Rpb25Qcm9wcygpO1xuXG4vKipcbiAqIFRvdWNoIEFjdGlvblxuICogc2V0cyB0aGUgdG91Y2hBY3Rpb24gcHJvcGVydHkgb3IgdXNlcyB0aGUganMgYWx0ZXJuYXRpdmVcbiAqIEBwYXJhbSB7TWFuYWdlcn0gbWFuYWdlclxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVG91Y2hBY3Rpb24obWFuYWdlciwgdmFsdWUpIHtcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuc2V0KHZhbHVlKTtcbn1cblxuVG91Y2hBY3Rpb24ucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNldCB0aGUgdG91Y2hBY3Rpb24gdmFsdWUgb24gdGhlIGVsZW1lbnQgb3IgZW5hYmxlIHRoZSBwb2x5ZmlsbFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgLy8gZmluZCBvdXQgdGhlIHRvdWNoLWFjdGlvbiBieSB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgaWYgKHZhbHVlID09IFRPVUNIX0FDVElPTl9DT01QVVRFKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuY29tcHV0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE5BVElWRV9UT1VDSF9BQ1RJT04gJiYgdGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGUgJiYgVE9VQ0hfQUNUSU9OX01BUFt2YWx1ZV0pIHtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbGVtZW50LnN0eWxlW1BSRUZJWEVEX1RPVUNIX0FDVElPTl0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFjdGlvbnMgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICoganVzdCByZS1zZXQgdGhlIHRvdWNoQWN0aW9uIHZhbHVlXG4gICAgICovXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXQodGhpcy5tYW5hZ2VyLm9wdGlvbnMudG91Y2hBY3Rpb24pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjb21wdXRlIHRoZSB2YWx1ZSBmb3IgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5IGJhc2VkIG9uIHRoZSByZWNvZ25pemVyJ3Mgc2V0dGluZ3NcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIGNvbXB1dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgICBlYWNoKHRoaXMubWFuYWdlci5yZWNvZ25pemVycywgZnVuY3Rpb24ocmVjb2duaXplcikge1xuICAgICAgICAgICAgaWYgKGJvb2xPckZuKHJlY29nbml6ZXIub3B0aW9ucy5lbmFibGUsIFtyZWNvZ25pemVyXSkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zID0gYWN0aW9ucy5jb25jYXQocmVjb2duaXplci5nZXRUb3VjaEFjdGlvbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjbGVhblRvdWNoQWN0aW9ucyhhY3Rpb25zLmpvaW4oJyAnKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCBvbiBlYWNoIGlucHV0IGN5Y2xlIGFuZCBwcm92aWRlcyB0aGUgcHJldmVudGluZyBvZiB0aGUgYnJvd3NlciBiZWhhdmlvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuICAgIHByZXZlbnREZWZhdWx0czogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIHNyY0V2ZW50ID0gaW5wdXQuc3JjRXZlbnQ7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBpbnB1dC5vZmZzZXREaXJlY3Rpb247XG5cbiAgICAgICAgLy8gaWYgdGhlIHRvdWNoIGFjdGlvbiBkaWQgcHJldmVudGVkIG9uY2UgdGhpcyBzZXNzaW9uXG4gICAgICAgIGlmICh0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgIHNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucztcbiAgICAgICAgdmFyIGhhc05vbmUgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fTk9ORSkgJiYgIVRPVUNIX0FDVElPTl9NQVBbVE9VQ0hfQUNUSU9OX05PTkVdO1xuICAgICAgICB2YXIgaGFzUGFuWSA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWSkgJiYgIVRPVUNIX0FDVElPTl9NQVBbVE9VQ0hfQUNUSU9OX1BBTl9ZXTtcbiAgICAgICAgdmFyIGhhc1BhblggPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1gpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9QQU5fWF07XG5cbiAgICAgICAgaWYgKGhhc05vbmUpIHtcbiAgICAgICAgICAgIC8vZG8gbm90IHByZXZlbnQgZGVmYXVsdHMgaWYgdGhpcyBpcyBhIHRhcCBnZXN0dXJlXG5cbiAgICAgICAgICAgIHZhciBpc1RhcFBvaW50ZXIgPSBpbnB1dC5wb2ludGVycy5sZW5ndGggPT09IDE7XG4gICAgICAgICAgICB2YXIgaXNUYXBNb3ZlbWVudCA9IGlucHV0LmRpc3RhbmNlIDwgMjtcbiAgICAgICAgICAgIHZhciBpc1RhcFRvdWNoVGltZSA9IGlucHV0LmRlbHRhVGltZSA8IDI1MDtcblxuICAgICAgICAgICAgaWYgKGlzVGFwUG9pbnRlciAmJiBpc1RhcE1vdmVtZW50ICYmIGlzVGFwVG91Y2hUaW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc1BhblggJiYgaGFzUGFuWSkge1xuICAgICAgICAgICAgLy8gYHBhbi14IHBhbi15YCBtZWFucyBicm93c2VyIGhhbmRsZXMgYWxsIHNjcm9sbGluZy9wYW5uaW5nLCBkbyBub3QgcHJldmVudFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc05vbmUgfHxcbiAgICAgICAgICAgIChoYXNQYW5ZICYmIGRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB8fFxuICAgICAgICAgICAgKGhhc1BhblggJiYgZGlyZWN0aW9uICYgRElSRUNUSU9OX1ZFUlRJQ0FMKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmVudFNyYyhzcmNFdmVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY2FsbCBwcmV2ZW50RGVmYXVsdCB0byBwcmV2ZW50IHRoZSBicm93c2VyJ3MgZGVmYXVsdCBiZWhhdmlvciAoc2Nyb2xsaW5nIGluIG1vc3QgY2FzZXMpXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNyY0V2ZW50XG4gICAgICovXG4gICAgcHJldmVudFNyYzogZnVuY3Rpb24oc3JjRXZlbnQpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnNlc3Npb24ucHJldmVudGVkID0gdHJ1ZTtcbiAgICAgICAgc3JjRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIHdoZW4gdGhlIHRvdWNoQWN0aW9ucyBhcmUgY29sbGVjdGVkIHRoZXkgYXJlIG5vdCBhIHZhbGlkIHZhbHVlLCBzbyB3ZSBuZWVkIHRvIGNsZWFuIHRoaW5ncyB1cC4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvbnNcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBjbGVhblRvdWNoQWN0aW9ucyhhY3Rpb25zKSB7XG4gICAgLy8gbm9uZVxuICAgIGlmIChpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fTk9ORSkpIHtcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9OT05FO1xuICAgIH1cblxuICAgIHZhciBoYXNQYW5YID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9YKTtcbiAgICB2YXIgaGFzUGFuWSA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWSk7XG5cbiAgICAvLyBpZiBib3RoIHBhbi14IGFuZCBwYW4teSBhcmUgc2V0IChkaWZmZXJlbnQgcmVjb2duaXplcnNcbiAgICAvLyBmb3IgZGlmZmVyZW50IGRpcmVjdGlvbnMsIGUuZy4gaG9yaXpvbnRhbCBwYW4gYnV0IHZlcnRpY2FsIHN3aXBlPylcbiAgICAvLyB3ZSBuZWVkIG5vbmUgKGFzIG90aGVyd2lzZSB3aXRoIHBhbi14IHBhbi15IGNvbWJpbmVkIG5vbmUgb2YgdGhlc2VcbiAgICAvLyByZWNvZ25pemVycyB3aWxsIHdvcmssIHNpbmNlIHRoZSBicm93c2VyIHdvdWxkIGhhbmRsZSBhbGwgcGFubmluZ1xuICAgIGlmIChoYXNQYW5YICYmIGhhc1BhblkpIHtcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9OT05FO1xuICAgIH1cblxuICAgIC8vIHBhbi14IE9SIHBhbi15XG4gICAgaWYgKGhhc1BhblggfHwgaGFzUGFuWSkge1xuICAgICAgICByZXR1cm4gaGFzUGFuWCA/IFRPVUNIX0FDVElPTl9QQU5fWCA6IFRPVUNIX0FDVElPTl9QQU5fWTtcbiAgICB9XG5cbiAgICAvLyBtYW5pcHVsYXRpb25cbiAgICBpZiAoaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX01BTklQVUxBVElPTikpIHtcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT047XG4gICAgfVxuXG4gICAgcmV0dXJuIFRPVUNIX0FDVElPTl9BVVRPO1xufVxuXG5mdW5jdGlvbiBnZXRUb3VjaEFjdGlvblByb3BzKCkge1xuICAgIGlmICghTkFUSVZFX1RPVUNIX0FDVElPTikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciB0b3VjaE1hcCA9IHt9O1xuICAgIHZhciBjc3NTdXBwb3J0cyA9IHdpbmRvdy5DU1MgJiYgd2luZG93LkNTUy5zdXBwb3J0cztcbiAgICBbJ2F1dG8nLCAnbWFuaXB1bGF0aW9uJywgJ3Bhbi15JywgJ3Bhbi14JywgJ3Bhbi14IHBhbi15JywgJ25vbmUnXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCkge1xuXG4gICAgICAgIC8vIElmIGNzcy5zdXBwb3J0cyBpcyBub3Qgc3VwcG9ydGVkIGJ1dCB0aGVyZSBpcyBuYXRpdmUgdG91Y2gtYWN0aW9uIGFzc3VtZSBpdCBzdXBwb3J0c1xuICAgICAgICAvLyBhbGwgdmFsdWVzLiBUaGlzIGlzIHRoZSBjYXNlIGZvciBJRSAxMCBhbmQgMTEuXG4gICAgICAgIHRvdWNoTWFwW3ZhbF0gPSBjc3NTdXBwb3J0cyA/IHdpbmRvdy5DU1Muc3VwcG9ydHMoJ3RvdWNoLWFjdGlvbicsIHZhbCkgOiB0cnVlO1xuICAgIH0pO1xuICAgIHJldHVybiB0b3VjaE1hcDtcbn1cblxuLyoqXG4gKiBSZWNvZ25pemVyIGZsb3cgZXhwbGFpbmVkOyAqXG4gKiBBbGwgcmVjb2duaXplcnMgaGF2ZSB0aGUgaW5pdGlhbCBzdGF0ZSBvZiBQT1NTSUJMRSB3aGVuIGEgaW5wdXQgc2Vzc2lvbiBzdGFydHMuXG4gKiBUaGUgZGVmaW5pdGlvbiBvZiBhIGlucHV0IHNlc3Npb24gaXMgZnJvbSB0aGUgZmlyc3QgaW5wdXQgdW50aWwgdGhlIGxhc3QgaW5wdXQsIHdpdGggYWxsIGl0J3MgbW92ZW1lbnQgaW4gaXQuICpcbiAqIEV4YW1wbGUgc2Vzc2lvbiBmb3IgbW91c2UtaW5wdXQ6IG1vdXNlZG93biAtPiBtb3VzZW1vdmUgLT4gbW91c2V1cFxuICpcbiAqIE9uIGVhY2ggcmVjb2duaXppbmcgY3ljbGUgKHNlZSBNYW5hZ2VyLnJlY29nbml6ZSkgdGhlIC5yZWNvZ25pemUoKSBtZXRob2QgaXMgZXhlY3V0ZWRcbiAqIHdoaWNoIGRldGVybWluZXMgd2l0aCBzdGF0ZSBpdCBzaG91bGQgYmUuXG4gKlxuICogSWYgdGhlIHJlY29nbml6ZXIgaGFzIHRoZSBzdGF0ZSBGQUlMRUQsIENBTkNFTExFRCBvciBSRUNPR05JWkVEIChlcXVhbHMgRU5ERUQpLCBpdCBpcyByZXNldCB0b1xuICogUE9TU0lCTEUgdG8gZ2l2ZSBpdCBhbm90aGVyIGNoYW5nZSBvbiB0aGUgbmV4dCBjeWNsZS5cbiAqXG4gKiAgICAgICAgICAgICAgIFBvc3NpYmxlXG4gKiAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgKy0tLS0tKy0tLS0tLS0tLS0tLS0tLStcbiAqICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgKy0tLS0tKy0tLS0tKyAgICAgICAgICAgICAgIHxcbiAqICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgIHxcbiAqICAgRmFpbGVkICAgICAgQ2FuY2VsbGVkICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICArLS0tLS0tLSstLS0tLS0rXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgfFxuICogICAgICAgICAgICAgICAgICAgICAgUmVjb2duaXplZCAgICAgICBCZWdhblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFuZ2VkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRW5kZWQvUmVjb2duaXplZFxuICovXG52YXIgU1RBVEVfUE9TU0lCTEUgPSAxO1xudmFyIFNUQVRFX0JFR0FOID0gMjtcbnZhciBTVEFURV9DSEFOR0VEID0gNDtcbnZhciBTVEFURV9FTkRFRCA9IDg7XG52YXIgU1RBVEVfUkVDT0dOSVpFRCA9IFNUQVRFX0VOREVEO1xudmFyIFNUQVRFX0NBTkNFTExFRCA9IDE2O1xudmFyIFNUQVRFX0ZBSUxFRCA9IDMyO1xuXG4vKipcbiAqIFJlY29nbml6ZXJcbiAqIEV2ZXJ5IHJlY29nbml6ZXIgbmVlZHMgdG8gZXh0ZW5kIGZyb20gdGhpcyBjbGFzcy5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gUmVjb2duaXplcihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMuaWQgPSB1bmlxdWVJZCgpO1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgaXMgZW5hYmxlIHRydWVcbiAgICB0aGlzLm9wdGlvbnMuZW5hYmxlID0gaWZVbmRlZmluZWQodGhpcy5vcHRpb25zLmVuYWJsZSwgdHJ1ZSk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEVfUE9TU0lCTEU7XG5cbiAgICB0aGlzLnNpbXVsdGFuZW91cyA9IHt9O1xuICAgIHRoaXMucmVxdWlyZUZhaWwgPSBbXTtcbn1cblxuUmVjb2duaXplci5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQHZpcnR1YWxcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7fSxcblxuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJuIHtSZWNvZ25pemVyfVxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBhc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBhbHNvIHVwZGF0ZSB0aGUgdG91Y2hBY3Rpb24sIGluIGNhc2Ugc29tZXRoaW5nIGNoYW5nZWQgYWJvdXQgdGhlIGRpcmVjdGlvbnMvZW5hYmxlZCBzdGF0ZVxuICAgICAgICB0aGlzLm1hbmFnZXIgJiYgdGhpcy5tYW5hZ2VyLnRvdWNoQWN0aW9uLnVwZGF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmVjb2duaXplIHNpbXVsdGFuZW91cyB3aXRoIGFuIG90aGVyIHJlY29nbml6ZXIuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuICAgIHJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAncmVjb2duaXplV2l0aCcsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzaW11bHRhbmVvdXMgPSB0aGlzLnNpbXVsdGFuZW91cztcbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICBpZiAoIXNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdKSB7XG4gICAgICAgICAgICBzaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXSA9IG90aGVyUmVjb2duaXplcjtcbiAgICAgICAgICAgIG90aGVyUmVjb2duaXplci5yZWNvZ25pemVXaXRoKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBkcm9wIHRoZSBzaW11bHRhbmVvdXMgbGluay4gaXQgZG9lc250IHJlbW92ZSB0aGUgbGluayBvbiB0aGUgb3RoZXIgcmVjb2duaXplci5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXG4gICAgICovXG4gICAgZHJvcFJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAnZHJvcFJlY29nbml6ZVdpdGgnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvdGhlclJlY29nbml6ZXIgPSBnZXRSZWNvZ25pemVyQnlOYW1lSWZNYW5hZ2VyKG90aGVyUmVjb2duaXplciwgdGhpcyk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmVjb2duaXplciBjYW4gb25seSBydW4gd2hlbiBhbiBvdGhlciBpcyBmYWlsaW5nXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuICAgIHJlcXVpcmVGYWlsdXJlOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ3JlcXVpcmVGYWlsdXJlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlcXVpcmVGYWlsID0gdGhpcy5yZXF1aXJlRmFpbDtcbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICBpZiAoaW5BcnJheShyZXF1aXJlRmFpbCwgb3RoZXJSZWNvZ25pemVyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJlcXVpcmVGYWlsLnB1c2gob3RoZXJSZWNvZ25pemVyKTtcbiAgICAgICAgICAgIG90aGVyUmVjb2duaXplci5yZXF1aXJlRmFpbHVyZSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZHJvcCB0aGUgcmVxdWlyZUZhaWx1cmUgbGluay4gaXQgZG9lcyBub3QgcmVtb3ZlIHRoZSBsaW5rIG9uIHRoZSBvdGhlciByZWNvZ25pemVyLlxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICBkcm9wUmVxdWlyZUZhaWx1cmU6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAnZHJvcFJlcXVpcmVGYWlsdXJlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICB2YXIgaW5kZXggPSBpbkFycmF5KHRoaXMucmVxdWlyZUZhaWwsIG90aGVyUmVjb2duaXplcik7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVGYWlsLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGhhcyByZXF1aXJlIGZhaWx1cmVzIGJvb2xlYW5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXNSZXF1aXJlRmFpbHVyZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1aXJlRmFpbC5sZW5ndGggPiAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBpZiB0aGUgcmVjb2duaXplciBjYW4gcmVjb2duaXplIHNpbXVsdGFuZW91cyB3aXRoIGFuIG90aGVyIHJlY29nbml6ZXJcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGNhblJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICByZXR1cm4gISF0aGlzLnNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBZb3Ugc2hvdWxkIHVzZSBgdHJ5RW1pdGAgaW5zdGVhZCBvZiBgZW1pdGAgZGlyZWN0bHkgdG8gY2hlY2tcbiAgICAgKiB0aGF0IGFsbCB0aGUgbmVlZGVkIHJlY29nbml6ZXJzIGhhcyBmYWlsZWQgYmVmb3JlIGVtaXR0aW5nLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcblxuICAgICAgICBmdW5jdGlvbiBlbWl0KGV2ZW50KSB7XG4gICAgICAgICAgICBzZWxmLm1hbmFnZXIuZW1pdChldmVudCwgaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gJ3BhbnN0YXJ0JyBhbmQgJ3Bhbm1vdmUnXG4gICAgICAgIGlmIChzdGF0ZSA8IFNUQVRFX0VOREVEKSB7XG4gICAgICAgICAgICBlbWl0KHNlbGYub3B0aW9ucy5ldmVudCArIHN0YXRlU3RyKHN0YXRlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbWl0KHNlbGYub3B0aW9ucy5ldmVudCk7IC8vIHNpbXBsZSAnZXZlbnROYW1lJyBldmVudHNcblxuICAgICAgICBpZiAoaW5wdXQuYWRkaXRpb25hbEV2ZW50KSB7IC8vIGFkZGl0aW9uYWwgZXZlbnQocGFubGVmdCwgcGFucmlnaHQsIHBpbmNoaW4sIHBpbmNob3V0Li4uKVxuICAgICAgICAgICAgZW1pdChpbnB1dC5hZGRpdGlvbmFsRXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcGFuZW5kIGFuZCBwYW5jYW5jZWxcbiAgICAgICAgaWYgKHN0YXRlID49IFNUQVRFX0VOREVEKSB7XG4gICAgICAgICAgICBlbWl0KHNlbGYub3B0aW9ucy5ldmVudCArIHN0YXRlU3RyKHN0YXRlKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgdGhhdCBhbGwgdGhlIHJlcXVpcmUgZmFpbHVyZSByZWNvZ25pemVycyBoYXMgZmFpbGVkLFxuICAgICAqIGlmIHRydWUsIGl0IGVtaXRzIGEgZ2VzdHVyZSBldmVudCxcbiAgICAgKiBvdGhlcndpc2UsIHNldHVwIHRoZSBzdGF0ZSB0byBGQUlMRUQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gICAgICovXG4gICAgdHJ5RW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuRW1pdCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbWl0KGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpdCdzIGZhaWxpbmcgYW55d2F5XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNhbiB3ZSBlbWl0P1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGNhbkVtaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5yZXF1aXJlRmFpbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghKHRoaXMucmVxdWlyZUZhaWxbaV0uc3RhdGUgJiAoU1RBVEVfRkFJTEVEIHwgU1RBVEVfUE9TU0lCTEUpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlIHRoZSByZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxuICAgICAqL1xuICAgIHJlY29nbml6ZTogZnVuY3Rpb24oaW5wdXREYXRhKSB7XG4gICAgICAgIC8vIG1ha2UgYSBuZXcgY29weSBvZiB0aGUgaW5wdXREYXRhXG4gICAgICAgIC8vIHNvIHdlIGNhbiBjaGFuZ2UgdGhlIGlucHV0RGF0YSB3aXRob3V0IG1lc3NpbmcgdXAgdGhlIG90aGVyIHJlY29nbml6ZXJzXG4gICAgICAgIHZhciBpbnB1dERhdGFDbG9uZSA9IGFzc2lnbih7fSwgaW5wdXREYXRhKTtcblxuICAgICAgICAvLyBpcyBpcyBlbmFibGVkIGFuZCBhbGxvdyByZWNvZ25pemluZz9cbiAgICAgICAgaWYgKCFib29sT3JGbih0aGlzLm9wdGlvbnMuZW5hYmxlLCBbdGhpcywgaW5wdXREYXRhQ2xvbmVdKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX0ZBSUxFRDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlc2V0IHdoZW4gd2UndmUgcmVhY2hlZCB0aGUgZW5kXG4gICAgICAgIGlmICh0aGlzLnN0YXRlICYgKFNUQVRFX1JFQ09HTklaRUQgfCBTVEFURV9DQU5DRUxMRUQgfCBTVEFURV9GQUlMRUQpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfUE9TU0lCTEU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5wcm9jZXNzKGlucHV0RGF0YUNsb25lKTtcblxuICAgICAgICAvLyB0aGUgcmVjb2duaXplciBoYXMgcmVjb2duaXplZCBhIGdlc3R1cmVcbiAgICAgICAgLy8gc28gdHJpZ2dlciBhbiBldmVudFxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAmIChTVEFURV9CRUdBTiB8IFNUQVRFX0NIQU5HRUQgfCBTVEFURV9FTkRFRCB8IFNUQVRFX0NBTkNFTExFRCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJ5RW1pdChpbnB1dERhdGFDbG9uZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBzdGF0ZSBvZiB0aGUgcmVjb2duaXplclxuICAgICAqIHRoZSBhY3R1YWwgcmVjb2duaXppbmcgaGFwcGVucyBpbiB0aGlzIG1ldGhvZFxuICAgICAqIEB2aXJ0dWFsXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxuICAgICAqIEByZXR1cm5zIHtDb25zdH0gU1RBVEVcbiAgICAgKi9cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dERhdGEpIHsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIHByZWZlcnJlZCB0b3VjaC1hY3Rpb25cbiAgICAgKiBAdmlydHVhbFxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7IH0sXG5cbiAgICAvKipcbiAgICAgKiBjYWxsZWQgd2hlbiB0aGUgZ2VzdHVyZSBpc24ndCBhbGxvd2VkIHRvIHJlY29nbml6ZVxuICAgICAqIGxpa2Ugd2hlbiBhbm90aGVyIGlzIGJlaW5nIHJlY29nbml6ZWQgb3IgaXQgaXMgZGlzYWJsZWRcbiAgICAgKiBAdmlydHVhbFxuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbigpIHsgfVxufTtcblxuLyoqXG4gKiBnZXQgYSB1c2FibGUgc3RyaW5nLCB1c2VkIGFzIGV2ZW50IHBvc3RmaXhcbiAqIEBwYXJhbSB7Q29uc3R9IHN0YXRlXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBzdGF0ZVxuICovXG5mdW5jdGlvbiBzdGF0ZVN0cihzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSAmIFNUQVRFX0NBTkNFTExFRCkge1xuICAgICAgICByZXR1cm4gJ2NhbmNlbCc7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0VOREVEKSB7XG4gICAgICAgIHJldHVybiAnZW5kJztcbiAgICB9IGVsc2UgaWYgKHN0YXRlICYgU1RBVEVfQ0hBTkdFRCkge1xuICAgICAgICByZXR1cm4gJ21vdmUnO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgJiBTVEFURV9CRUdBTikge1xuICAgICAgICByZXR1cm4gJ3N0YXJ0JztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIGRpcmVjdGlvbiBjb25zIHRvIHN0cmluZ1xuICogQHBhcmFtIHtDb25zdH0gZGlyZWN0aW9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBkaXJlY3Rpb25TdHIoZGlyZWN0aW9uKSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fRE9XTikge1xuICAgICAgICByZXR1cm4gJ2Rvd24nO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09IERJUkVDVElPTl9VUCkge1xuICAgICAgICByZXR1cm4gJ3VwJztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fTEVGVCkge1xuICAgICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09IERJUkVDVElPTl9SSUdIVCkge1xuICAgICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIGdldCBhIHJlY29nbml6ZXIgYnkgbmFtZSBpZiBpdCBpcyBib3VuZCB0byBhIG1hbmFnZXJcbiAqIEBwYXJhbSB7UmVjb2duaXplcnxTdHJpbmd9IG90aGVyUmVjb2duaXplclxuICogQHBhcmFtIHtSZWNvZ25pemVyfSByZWNvZ25pemVyXG4gKiBAcmV0dXJucyB7UmVjb2duaXplcn1cbiAqL1xuZnVuY3Rpb24gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHJlY29nbml6ZXIpIHtcbiAgICB2YXIgbWFuYWdlciA9IHJlY29nbml6ZXIubWFuYWdlcjtcbiAgICBpZiAobWFuYWdlcikge1xuICAgICAgICByZXR1cm4gbWFuYWdlci5nZXQob3RoZXJSZWNvZ25pemVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG90aGVyUmVjb2duaXplcjtcbn1cblxuLyoqXG4gKiBUaGlzIHJlY29nbml6ZXIgaXMganVzdCB1c2VkIGFzIGEgYmFzZSBmb3IgdGhlIHNpbXBsZSBhdHRyaWJ1dGUgcmVjb2duaXplcnMuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIFJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gQXR0clJlY29nbml6ZXIoKSB7XG4gICAgUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KEF0dHJSZWNvZ25pemVyLCBSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICBwb2ludGVyczogMVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVc2VkIHRvIGNoZWNrIGlmIGl0IHRoZSByZWNvZ25pemVyIHJlY2VpdmVzIHZhbGlkIGlucHV0LCBsaWtlIGlucHV0LmRpc3RhbmNlID4gMTAuXG4gICAgICogQG1lbWJlcm9mIEF0dHJSZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IHJlY29nbml6ZWRcbiAgICAgKi9cbiAgICBhdHRyVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIG9wdGlvblBvaW50ZXJzID0gdGhpcy5vcHRpb25zLnBvaW50ZXJzO1xuICAgICAgICByZXR1cm4gb3B0aW9uUG9pbnRlcnMgPT09IDAgfHwgaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSBvcHRpb25Qb2ludGVycztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJvY2VzcyB0aGUgaW5wdXQgYW5kIHJldHVybiB0aGUgc3RhdGUgZm9yIHRoZSByZWNvZ25pemVyXG4gICAgICogQG1lbWJlcm9mIEF0dHJSZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gICAgICogQHJldHVybnMgeyp9IFN0YXRlXG4gICAgICovXG4gICAgcHJvY2VzczogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IGlucHV0LmV2ZW50VHlwZTtcblxuICAgICAgICB2YXIgaXNSZWNvZ25pemVkID0gc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEKTtcbiAgICAgICAgdmFyIGlzVmFsaWQgPSB0aGlzLmF0dHJUZXN0KGlucHV0KTtcblxuICAgICAgICAvLyBvbiBjYW5jZWwgaW5wdXQgYW5kIHdlJ3ZlIHJlY29nbml6ZWQgYmVmb3JlLCByZXR1cm4gU1RBVEVfQ0FOQ0VMTEVEXG4gICAgICAgIGlmIChpc1JlY29nbml6ZWQgJiYgKGV2ZW50VHlwZSAmIElOUFVUX0NBTkNFTCB8fCAhaXNWYWxpZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0NBTkNFTExFRDtcbiAgICAgICAgfSBlbHNlIGlmIChpc1JlY29nbml6ZWQgfHwgaXNWYWxpZCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX0VORCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0VOREVEO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghKHN0YXRlICYgU1RBVEVfQkVHQU4pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNUQVRFX0JFR0FOO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlIHwgU1RBVEVfQ0hBTkdFRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIFBhblxuICogUmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvd24gYW5kIG1vdmVkIGluIHRoZSBhbGxvd2VkIGRpcmVjdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUGFuUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5wWCA9IG51bGw7XG4gICAgdGhpcy5wWSA9IG51bGw7XG59XG5cbmluaGVyaXQoUGFuUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBhblJlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBldmVudDogJ3BhbicsXG4gICAgICAgIHRocmVzaG9sZDogMTAsXG4gICAgICAgIHBvaW50ZXJzOiAxLFxuICAgICAgICBkaXJlY3Rpb246IERJUkVDVElPTl9BTExcbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goVE9VQ0hfQUNUSU9OX1BBTl9ZKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlyZWN0aW9uICYgRElSRUNUSU9OX1ZFUlRJQ0FMKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goVE9VQ0hfQUNUSU9OX1BBTl9YKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICB9LFxuXG4gICAgZGlyZWN0aW9uVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIHZhciBoYXNNb3ZlZCA9IHRydWU7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IGlucHV0LmRpc3RhbmNlO1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gaW5wdXQuZGlyZWN0aW9uO1xuICAgICAgICB2YXIgeCA9IGlucHV0LmRlbHRhWDtcbiAgICAgICAgdmFyIHkgPSBpbnB1dC5kZWx0YVk7XG5cbiAgICAgICAgLy8gbG9jayB0byBheGlzP1xuICAgICAgICBpZiAoIShkaXJlY3Rpb24gJiBvcHRpb25zLmRpcmVjdGlvbikpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gKHggPT09IDApID8gRElSRUNUSU9OX05PTkUgOiAoeCA8IDApID8gRElSRUNUSU9OX0xFRlQgOiBESVJFQ1RJT05fUklHSFQ7XG4gICAgICAgICAgICAgICAgaGFzTW92ZWQgPSB4ICE9IHRoaXMucFg7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhpbnB1dC5kZWx0YVgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAoeSA9PT0gMCkgPyBESVJFQ1RJT05fTk9ORSA6ICh5IDwgMCkgPyBESVJFQ1RJT05fVVAgOiBESVJFQ1RJT05fRE9XTjtcbiAgICAgICAgICAgICAgICBoYXNNb3ZlZCA9IHkgIT0gdGhpcy5wWTtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IE1hdGguYWJzKGlucHV0LmRlbHRhWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICByZXR1cm4gaGFzTW92ZWQgJiYgZGlzdGFuY2UgPiBvcHRpb25zLnRocmVzaG9sZCAmJiBkaXJlY3Rpb24gJiBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICB9LFxuXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBBdHRyUmVjb2duaXplci5wcm90b3R5cGUuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgICh0aGlzLnN0YXRlICYgU1RBVEVfQkVHQU4gfHwgKCEodGhpcy5zdGF0ZSAmIFNUQVRFX0JFR0FOKSAmJiB0aGlzLmRpcmVjdGlvblRlc3QoaW5wdXQpKSk7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG5cbiAgICAgICAgdGhpcy5wWCA9IGlucHV0LmRlbHRhWDtcbiAgICAgICAgdGhpcy5wWSA9IGlucHV0LmRlbHRhWTtcblxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gZGlyZWN0aW9uU3RyKGlucHV0LmRpcmVjdGlvbik7XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgaW5wdXQuYWRkaXRpb25hbEV2ZW50ID0gdGhpcy5vcHRpb25zLmV2ZW50ICsgZGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyLmVtaXQuY2FsbCh0aGlzLCBpbnB1dCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogUGluY2hcbiAqIFJlY29nbml6ZWQgd2hlbiB0d28gb3IgbW9yZSBwb2ludGVycyBhcmUgbW92aW5nIHRvd2FyZCAoem9vbS1pbikgb3IgYXdheSBmcm9tIGVhY2ggb3RoZXIgKHpvb20tb3V0KS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUGluY2hSZWNvZ25pemVyKCkge1xuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoUGluY2hSZWNvZ25pemVyLCBBdHRyUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgUGluY2hSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwaW5jaCcsXG4gICAgICAgIHRocmVzaG9sZDogMCxcbiAgICAgICAgcG9pbnRlcnM6IDJcbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9OT05FXTtcbiAgICB9LFxuXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxuICAgICAgICAgICAgKE1hdGguYWJzKGlucHV0LnNjYWxlIC0gMSkgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkIHx8IHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTik7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5zY2FsZSAhPT0gMSkge1xuICAgICAgICAgICAgdmFyIGluT3V0ID0gaW5wdXQuc2NhbGUgPCAxID8gJ2luJyA6ICdvdXQnO1xuICAgICAgICAgICAgaW5wdXQuYWRkaXRpb25hbEV2ZW50ID0gdGhpcy5vcHRpb25zLmV2ZW50ICsgaW5PdXQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsIGlucHV0KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBQcmVzc1xuICogUmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvd24gZm9yIHggbXMgd2l0aG91dCBhbnkgbW92ZW1lbnQuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIFJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUHJlc3NSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMuX3RpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9pbnB1dCA9IG51bGw7XG59XG5cbmluaGVyaXQoUHJlc3NSZWNvZ25pemVyLCBSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBQcmVzc1JlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBldmVudDogJ3ByZXNzJyxcbiAgICAgICAgcG9pbnRlcnM6IDEsXG4gICAgICAgIHRpbWU6IDI1MSwgLy8gbWluaW1hbCB0aW1lIG9mIHRoZSBwb2ludGVyIHRvIGJlIHByZXNzZWRcbiAgICAgICAgdGhyZXNob2xkOiA5IC8vIGEgbWluaW1hbCBtb3ZlbWVudCBpcyBvaywgYnV0IGtlZXAgaXQgbG93XG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fQVVUT107XG4gICAgfSxcblxuICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB2YXIgdmFsaWRQb2ludGVycyA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgdmFyIHZhbGlkTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IG9wdGlvbnMudGhyZXNob2xkO1xuICAgICAgICB2YXIgdmFsaWRUaW1lID0gaW5wdXQuZGVsdGFUaW1lID4gb3B0aW9ucy50aW1lO1xuXG4gICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG5cbiAgICAgICAgLy8gd2Ugb25seSBhbGxvdyBsaXR0bGUgbW92ZW1lbnRcbiAgICAgICAgLy8gYW5kIHdlJ3ZlIHJlYWNoZWQgYW4gZW5kIGV2ZW50LCBzbyBhIHRhcCBpcyBwb3NzaWJsZVxuICAgICAgICBpZiAoIXZhbGlkTW92ZW1lbnQgfHwgIXZhbGlkUG9pbnRlcnMgfHwgKGlucHV0LmV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmICF2YWxpZFRpbWUpKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgICAgICAgICAgdGhpcy50cnlFbWl0KCk7XG4gICAgICAgICAgICB9LCBvcHRpb25zLnRpbWUsIHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX0VORCkge1xuICAgICAgICAgICAgcmV0dXJuIFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNUQVRFX0ZBSUxFRDtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gU1RBVEVfUkVDT0dOSVpFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlucHV0ICYmIChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQpKSB7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQgKyAndXAnLCBpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dC50aW1lU3RhbXAgPSBub3coKTtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgdGhpcy5faW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogUm90YXRlXG4gKiBSZWNvZ25pemVkIHdoZW4gdHdvIG9yIG1vcmUgcG9pbnRlciBhcmUgbW92aW5nIGluIGEgY2lyY3VsYXIgbW90aW9uLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBBdHRyUmVjb2duaXplclxuICovXG5mdW5jdGlvbiBSb3RhdGVSZWNvZ25pemVyKCkge1xuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoUm90YXRlUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFJvdGF0ZVJlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBldmVudDogJ3JvdGF0ZScsXG4gICAgICAgIHRocmVzaG9sZDogMCxcbiAgICAgICAgcG9pbnRlcnM6IDJcbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9OT05FXTtcbiAgICB9LFxuXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxuICAgICAgICAgICAgKE1hdGguYWJzKGlucHV0LnJvdGF0aW9uKSA+IHRoaXMub3B0aW9ucy50aHJlc2hvbGQgfHwgdGhpcy5zdGF0ZSAmIFNUQVRFX0JFR0FOKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBTd2lwZVxuICogUmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIG1vdmluZyBmYXN0ICh2ZWxvY2l0eSksIHdpdGggZW5vdWdoIGRpc3RhbmNlIGluIHRoZSBhbGxvd2VkIGRpcmVjdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gU3dpcGVSZWNvZ25pemVyKCkge1xuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoU3dpcGVSZWNvZ25pemVyLCBBdHRyUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgU3dpcGVSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdzd2lwZScsXG4gICAgICAgIHRocmVzaG9sZDogMTAsXG4gICAgICAgIHZlbG9jaXR5OiAwLjMsXG4gICAgICAgIGRpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUwsXG4gICAgICAgIHBvaW50ZXJzOiAxXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFBhblJlY29nbml6ZXIucHJvdG90eXBlLmdldFRvdWNoQWN0aW9uLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgdmFyIHZlbG9jaXR5O1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24gJiAoRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUwpKSB7XG4gICAgICAgICAgICB2ZWxvY2l0eSA9IGlucHV0Lm92ZXJhbGxWZWxvY2l0eTtcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgdmVsb2NpdHkgPSBpbnB1dC5vdmVyYWxsVmVsb2NpdHlYO1xuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xuICAgICAgICAgICAgdmVsb2NpdHkgPSBpbnB1dC5vdmVyYWxsVmVsb2NpdHlZO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1cGVyLmF0dHJUZXN0LmNhbGwodGhpcywgaW5wdXQpICYmXG4gICAgICAgICAgICBkaXJlY3Rpb24gJiBpbnB1dC5vZmZzZXREaXJlY3Rpb24gJiZcbiAgICAgICAgICAgIGlucHV0LmRpc3RhbmNlID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCAmJlxuICAgICAgICAgICAgaW5wdXQubWF4UG9pbnRlcnMgPT0gdGhpcy5vcHRpb25zLnBvaW50ZXJzICYmXG4gICAgICAgICAgICBhYnModmVsb2NpdHkpID4gdGhpcy5vcHRpb25zLnZlbG9jaXR5ICYmIGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX0VORDtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGRpcmVjdGlvblN0cihpbnB1dC5vZmZzZXREaXJlY3Rpb24pO1xuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQgKyBkaXJlY3Rpb24sIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgaW5wdXQpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEEgdGFwIGlzIGVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvaW5nIGEgc21hbGwgdGFwL2NsaWNrLiBNdWx0aXBsZSB0YXBzIGFyZSByZWNvZ25pemVkIGlmIHRoZXkgb2NjdXJcbiAqIGJldHdlZW4gdGhlIGdpdmVuIGludGVydmFsIGFuZCBwb3NpdGlvbi4gVGhlIGRlbGF5IG9wdGlvbiBjYW4gYmUgdXNlZCB0byByZWNvZ25pemUgbXVsdGktdGFwcyB3aXRob3V0IGZpcmluZ1xuICogYSBzaW5nbGUgdGFwLlxuICpcbiAqIFRoZSBldmVudERhdGEgZnJvbSB0aGUgZW1pdHRlZCBldmVudCBjb250YWlucyB0aGUgcHJvcGVydHkgYHRhcENvdW50YCwgd2hpY2ggY29udGFpbnMgdGhlIGFtb3VudCBvZlxuICogbXVsdGktdGFwcyBiZWluZyByZWNvZ25pemVkLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFRhcFJlY29nbml6ZXIoKSB7XG4gICAgUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgLy8gcHJldmlvdXMgdGltZSBhbmQgY2VudGVyLFxuICAgIC8vIHVzZWQgZm9yIHRhcCBjb3VudGluZ1xuICAgIHRoaXMucFRpbWUgPSBmYWxzZTtcbiAgICB0aGlzLnBDZW50ZXIgPSBmYWxzZTtcblxuICAgIHRoaXMuX3RpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9pbnB1dCA9IG51bGw7XG4gICAgdGhpcy5jb3VudCA9IDA7XG59XG5cbmluaGVyaXQoVGFwUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgUGluY2hSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICd0YXAnLFxuICAgICAgICBwb2ludGVyczogMSxcbiAgICAgICAgdGFwczogMSxcbiAgICAgICAgaW50ZXJ2YWw6IDMwMCwgLy8gbWF4IHRpbWUgYmV0d2VlbiB0aGUgbXVsdGktdGFwIHRhcHNcbiAgICAgICAgdGltZTogMjUwLCAvLyBtYXggdGltZSBvZiB0aGUgcG9pbnRlciB0byBiZSBkb3duIChsaWtlIGZpbmdlciBvbiB0aGUgc2NyZWVuKVxuICAgICAgICB0aHJlc2hvbGQ6IDksIC8vIGEgbWluaW1hbCBtb3ZlbWVudCBpcyBvaywgYnV0IGtlZXAgaXQgbG93XG4gICAgICAgIHBvc1RocmVzaG9sZDogMTAgLy8gYSBtdWx0aS10YXAgY2FuIGJlIGEgYml0IG9mZiB0aGUgaW5pdGlhbCBwb3NpdGlvblxuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBbVE9VQ0hfQUNUSU9OX01BTklQVUxBVElPTl07XG4gICAgfSxcblxuICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAgIHZhciB2YWxpZFBvaW50ZXJzID0gaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSBvcHRpb25zLnBvaW50ZXJzO1xuICAgICAgICB2YXIgdmFsaWRNb3ZlbWVudCA9IGlucHV0LmRpc3RhbmNlIDwgb3B0aW9ucy50aHJlc2hvbGQ7XG4gICAgICAgIHZhciB2YWxpZFRvdWNoVGltZSA9IGlucHV0LmRlbHRhVGltZSA8IG9wdGlvbnMudGltZTtcblxuICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgICAgaWYgKChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9TVEFSVCkgJiYgKHRoaXMuY291bnQgPT09IDApKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsVGltZW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Ugb25seSBhbGxvdyBsaXR0bGUgbW92ZW1lbnRcbiAgICAgICAgLy8gYW5kIHdlJ3ZlIHJlYWNoZWQgYW4gZW5kIGV2ZW50LCBzbyBhIHRhcCBpcyBwb3NzaWJsZVxuICAgICAgICBpZiAodmFsaWRNb3ZlbWVudCAmJiB2YWxpZFRvdWNoVGltZSAmJiB2YWxpZFBvaW50ZXJzKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQuZXZlbnRUeXBlICE9IElOUFVUX0VORCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZhaWxUaW1lb3V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWxpZEludGVydmFsID0gdGhpcy5wVGltZSA/IChpbnB1dC50aW1lU3RhbXAgLSB0aGlzLnBUaW1lIDwgb3B0aW9ucy5pbnRlcnZhbCkgOiB0cnVlO1xuICAgICAgICAgICAgdmFyIHZhbGlkTXVsdGlUYXAgPSAhdGhpcy5wQ2VudGVyIHx8IGdldERpc3RhbmNlKHRoaXMucENlbnRlciwgaW5wdXQuY2VudGVyKSA8IG9wdGlvbnMucG9zVGhyZXNob2xkO1xuXG4gICAgICAgICAgICB0aGlzLnBUaW1lID0gaW5wdXQudGltZVN0YW1wO1xuICAgICAgICAgICAgdGhpcy5wQ2VudGVyID0gaW5wdXQuY2VudGVyO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkTXVsdGlUYXAgfHwgIXZhbGlkSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuXG4gICAgICAgICAgICAvLyBpZiB0YXAgY291bnQgbWF0Y2hlcyB3ZSBoYXZlIHJlY29nbml6ZWQgaXQsXG4gICAgICAgICAgICAvLyBlbHNlIGl0IGhhcyBiZWdhbiByZWNvZ25pemluZy4uLlxuICAgICAgICAgICAgdmFyIHRhcENvdW50ID0gdGhpcy5jb3VudCAlIG9wdGlvbnMudGFwcztcbiAgICAgICAgICAgIGlmICh0YXBDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIG5vIGZhaWxpbmcgcmVxdWlyZW1lbnRzLCBpbW1lZGlhdGVseSB0cmlnZ2VyIHRoZSB0YXAgZXZlbnRcbiAgICAgICAgICAgICAgICAvLyBvciB3YWl0IGFzIGxvbmcgYXMgdGhlIG11bHRpdGFwIGludGVydmFsIHRvIHRyaWdnZXJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaGFzUmVxdWlyZUZhaWx1cmVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0Q29udGV4dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlFbWl0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuaW50ZXJ2YWwsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU1RBVEVfQkVHQU47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIGZhaWxUaW1lb3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0Q29udGV4dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgICAgIH0sIHRoaXMub3B0aW9ucy5pbnRlcnZhbCwgdGhpcyk7XG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09IFNUQVRFX1JFQ09HTklaRUQpIHtcbiAgICAgICAgICAgIHRoaXMuX2lucHV0LnRhcENvdW50ID0gdGhpcy5jb3VudDtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgdGhpcy5faW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogU2ltcGxlIHdheSB0byBjcmVhdGUgYSBtYW5hZ2VyIHdpdGggYSBkZWZhdWx0IHNldCBvZiByZWNvZ25pemVycy5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBIYW1tZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMucmVjb2duaXplcnMgPSBpZlVuZGVmaW5lZChvcHRpb25zLnJlY29nbml6ZXJzLCBIYW1tZXIuZGVmYXVsdHMucHJlc2V0KTtcbiAgICByZXR1cm4gbmV3IE1hbmFnZXIoZWxlbWVudCwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogQGNvbnN0IHtzdHJpbmd9XG4gKi9cbkhhbW1lci5WRVJTSU9OID0gJzIuMC43JztcblxuLyoqXG4gKiBkZWZhdWx0IHNldHRpbmdzXG4gKiBAbmFtZXNwYWNlXG4gKi9cbkhhbW1lci5kZWZhdWx0cyA9IHtcbiAgICAvKipcbiAgICAgKiBzZXQgaWYgRE9NIGV2ZW50cyBhcmUgYmVpbmcgdHJpZ2dlcmVkLlxuICAgICAqIEJ1dCB0aGlzIGlzIHNsb3dlciBhbmQgdW51c2VkIGJ5IHNpbXBsZSBpbXBsZW1lbnRhdGlvbnMsIHNvIGRpc2FibGVkIGJ5IGRlZmF1bHQuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBkb21FdmVudHM6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogVGhlIHZhbHVlIGZvciB0aGUgdG91Y2hBY3Rpb24gcHJvcGVydHkvZmFsbGJhY2suXG4gICAgICogV2hlbiBzZXQgdG8gYGNvbXB1dGVgIGl0IHdpbGwgbWFnaWNhbGx5IHNldCB0aGUgY29ycmVjdCB2YWx1ZSBiYXNlZCBvbiB0aGUgYWRkZWQgcmVjb2duaXplcnMuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBjb21wdXRlXG4gICAgICovXG4gICAgdG91Y2hBY3Rpb246IFRPVUNIX0FDVElPTl9DT01QVVRFLFxuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAqL1xuICAgIGVuYWJsZTogdHJ1ZSxcblxuICAgIC8qKlxuICAgICAqIEVYUEVSSU1FTlRBTCBGRUFUVVJFIC0tIGNhbiBiZSByZW1vdmVkL2NoYW5nZWRcbiAgICAgKiBDaGFuZ2UgdGhlIHBhcmVudCBpbnB1dCB0YXJnZXQgZWxlbWVudC5cbiAgICAgKiBJZiBOdWxsLCB0aGVuIGl0IGlzIGJlaW5nIHNldCB0aGUgdG8gbWFpbiBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdWxsfEV2ZW50VGFyZ2V0fVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICBpbnB1dFRhcmdldDogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIGZvcmNlIGFuIGlucHV0IGNsYXNzXG4gICAgICogQHR5cGUge051bGx8RnVuY3Rpb259XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIGlucHV0Q2xhc3M6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBEZWZhdWx0IHJlY29nbml6ZXIgc2V0dXAgd2hlbiBjYWxsaW5nIGBIYW1tZXIoKWBcbiAgICAgKiBXaGVuIGNyZWF0aW5nIGEgbmV3IE1hbmFnZXIgdGhlc2Ugd2lsbCBiZSBza2lwcGVkLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICBwcmVzZXQ6IFtcbiAgICAgICAgLy8gUmVjb2duaXplckNsYXNzLCBvcHRpb25zLCBbcmVjb2duaXplV2l0aCwgLi4uXSwgW3JlcXVpcmVGYWlsdXJlLCAuLi5dXG4gICAgICAgIFtSb3RhdGVSZWNvZ25pemVyLCB7ZW5hYmxlOiBmYWxzZX1dLFxuICAgICAgICBbUGluY2hSZWNvZ25pemVyLCB7ZW5hYmxlOiBmYWxzZX0sIFsncm90YXRlJ11dLFxuICAgICAgICBbU3dpcGVSZWNvZ25pemVyLCB7ZGlyZWN0aW9uOiBESVJFQ1RJT05fSE9SSVpPTlRBTH1dLFxuICAgICAgICBbUGFuUmVjb2duaXplciwge2RpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUx9LCBbJ3N3aXBlJ11dLFxuICAgICAgICBbVGFwUmVjb2duaXplcl0sXG4gICAgICAgIFtUYXBSZWNvZ25pemVyLCB7ZXZlbnQ6ICdkb3VibGV0YXAnLCB0YXBzOiAyfSwgWyd0YXAnXV0sXG4gICAgICAgIFtQcmVzc1JlY29nbml6ZXJdXG4gICAgXSxcblxuICAgIC8qKlxuICAgICAqIFNvbWUgQ1NTIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgdG8gaW1wcm92ZSB0aGUgd29ya2luZyBvZiBIYW1tZXIuXG4gICAgICogQWRkIHRoZW0gdG8gdGhpcyBtZXRob2QgYW5kIHRoZXkgd2lsbCBiZSBzZXQgd2hlbiBjcmVhdGluZyBhIG5ldyBNYW5hZ2VyLlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKi9cbiAgICBjc3NQcm9wczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZXMgdGV4dCBzZWxlY3Rpb24gdG8gaW1wcm92ZSB0aGUgZHJhZ2dpbmcgZ2VzdHVyZS4gTWFpbmx5IGZvciBkZXNrdG9wIGJyb3dzZXJzLlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHVzZXJTZWxlY3Q6ICdub25lJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZSB0aGUgV2luZG93cyBQaG9uZSBncmlwcGVycyB3aGVuIHByZXNzaW5nIGFuIGVsZW1lbnQuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xuICAgICAgICAgKi9cbiAgICAgICAgdG91Y2hTZWxlY3Q6ICdub25lJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZXMgdGhlIGRlZmF1bHQgY2FsbG91dCBzaG93biB3aGVuIHlvdSB0b3VjaCBhbmQgaG9sZCBhIHRvdWNoIHRhcmdldC5cbiAgICAgICAgICogT24gaU9TLCB3aGVuIHlvdSB0b3VjaCBhbmQgaG9sZCBhIHRvdWNoIHRhcmdldCBzdWNoIGFzIGEgbGluaywgU2FmYXJpIGRpc3BsYXlzXG4gICAgICAgICAqIGEgY2FsbG91dCBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IHRoZSBsaW5rLiBUaGlzIHByb3BlcnR5IGFsbG93cyB5b3UgdG8gZGlzYWJsZSB0aGF0IGNhbGxvdXQuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xuICAgICAgICAgKi9cbiAgICAgICAgdG91Y2hDYWxsb3V0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZmllcyB3aGV0aGVyIHpvb21pbmcgaXMgZW5hYmxlZC4gVXNlZCBieSBJRTEwPlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIGNvbnRlbnRab29taW5nOiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZmllcyB0aGF0IGFuIGVudGlyZSBlbGVtZW50IHNob3VsZCBiZSBkcmFnZ2FibGUgaW5zdGVhZCBvZiBpdHMgY29udGVudHMuIE1haW5seSBmb3IgZGVza3RvcCBicm93c2Vycy5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICB1c2VyRHJhZzogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPdmVycmlkZXMgdGhlIGhpZ2hsaWdodCBjb2xvciBzaG93biB3aGVuIHRoZSB1c2VyIHRhcHMgYSBsaW5rIG9yIGEgSmF2YVNjcmlwdFxuICAgICAgICAgKiBjbGlja2FibGUgZWxlbWVudCBpbiBpT1MuIFRoaXMgcHJvcGVydHkgb2JleXMgdGhlIGFscGhhIHZhbHVlLCBpZiBzcGVjaWZpZWQuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdyZ2JhKDAsMCwwLDApJ1xuICAgICAgICAgKi9cbiAgICAgICAgdGFwSGlnaGxpZ2h0Q29sb3I6ICdyZ2JhKDAsMCwwLDApJ1xuICAgIH1cbn07XG5cbnZhciBTVE9QID0gMTtcbnZhciBGT1JDRURfU1RPUCA9IDI7XG5cbi8qKlxuICogTWFuYWdlclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE1hbmFnZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IGFzc2lnbih7fSwgSGFtbWVyLmRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMub3B0aW9ucy5pbnB1dFRhcmdldCA9IHRoaXMub3B0aW9ucy5pbnB1dFRhcmdldCB8fCBlbGVtZW50O1xuXG4gICAgdGhpcy5oYW5kbGVycyA9IHt9O1xuICAgIHRoaXMuc2Vzc2lvbiA9IHt9O1xuICAgIHRoaXMucmVjb2duaXplcnMgPSBbXTtcbiAgICB0aGlzLm9sZENzc1Byb3BzID0ge307XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMuaW5wdXQgPSBjcmVhdGVJbnB1dEluc3RhbmNlKHRoaXMpO1xuICAgIHRoaXMudG91Y2hBY3Rpb24gPSBuZXcgVG91Y2hBY3Rpb24odGhpcywgdGhpcy5vcHRpb25zLnRvdWNoQWN0aW9uKTtcblxuICAgIHRvZ2dsZUNzc1Byb3BzKHRoaXMsIHRydWUpO1xuXG4gICAgZWFjaCh0aGlzLm9wdGlvbnMucmVjb2duaXplcnMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIHJlY29nbml6ZXIgPSB0aGlzLmFkZChuZXcgKGl0ZW1bMF0pKGl0ZW1bMV0pKTtcbiAgICAgICAgaXRlbVsyXSAmJiByZWNvZ25pemVyLnJlY29nbml6ZVdpdGgoaXRlbVsyXSk7XG4gICAgICAgIGl0ZW1bM10gJiYgcmVjb2duaXplci5yZXF1aXJlRmFpbHVyZShpdGVtWzNdKTtcbiAgICB9LCB0aGlzKTtcbn1cblxuTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogc2V0IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtNYW5hZ2VyfVxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBhc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBPcHRpb25zIHRoYXQgbmVlZCBhIGxpdHRsZSBtb3JlIHNldHVwXG4gICAgICAgIGlmIChvcHRpb25zLnRvdWNoQWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnRvdWNoQWN0aW9uLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmlucHV0VGFyZ2V0KSB7XG4gICAgICAgICAgICAvLyBDbGVhbiB1cCBleGlzdGluZyBldmVudCBsaXN0ZW5lcnMgYW5kIHJlaW5pdGlhbGl6ZVxuICAgICAgICAgICAgdGhpcy5pbnB1dC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmlucHV0LnRhcmdldCA9IG9wdGlvbnMuaW5wdXRUYXJnZXQ7XG4gICAgICAgICAgICB0aGlzLmlucHV0LmluaXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogc3RvcCByZWNvZ25pemluZyBmb3IgdGhpcyBzZXNzaW9uLlxuICAgICAqIFRoaXMgc2Vzc2lvbiB3aWxsIGJlIGRpc2NhcmRlZCwgd2hlbiBhIG5ldyBbaW5wdXRdc3RhcnQgZXZlbnQgaXMgZmlyZWQuXG4gICAgICogV2hlbiBmb3JjZWQsIHRoZSByZWNvZ25pemVyIGN5Y2xlIGlzIHN0b3BwZWQgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZm9yY2VdXG4gICAgICovXG4gICAgc3RvcDogZnVuY3Rpb24oZm9yY2UpIHtcbiAgICAgICAgdGhpcy5zZXNzaW9uLnN0b3BwZWQgPSBmb3JjZSA/IEZPUkNFRF9TVE9QIDogU1RPUDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcnVuIHRoZSByZWNvZ25pemVycyFcbiAgICAgKiBjYWxsZWQgYnkgdGhlIGlucHV0SGFuZGxlciBmdW5jdGlvbiBvbiBldmVyeSBtb3ZlbWVudCBvZiB0aGUgcG9pbnRlcnMgKHRvdWNoZXMpXG4gICAgICogaXQgd2Fsa3MgdGhyb3VnaCBhbGwgdGhlIHJlY29nbml6ZXJzIGFuZCB0cmllcyB0byBkZXRlY3QgdGhlIGdlc3R1cmUgdGhhdCBpcyBiZWluZyBtYWRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxuICAgICAqL1xuICAgIHJlY29nbml6ZTogZnVuY3Rpb24oaW5wdXREYXRhKSB7XG4gICAgICAgIHZhciBzZXNzaW9uID0gdGhpcy5zZXNzaW9uO1xuICAgICAgICBpZiAoc2Vzc2lvbi5zdG9wcGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBydW4gdGhlIHRvdWNoLWFjdGlvbiBwb2x5ZmlsbFxuICAgICAgICB0aGlzLnRvdWNoQWN0aW9uLnByZXZlbnREZWZhdWx0cyhpbnB1dERhdGEpO1xuXG4gICAgICAgIHZhciByZWNvZ25pemVyO1xuICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuXG4gICAgICAgIC8vIHRoaXMgaG9sZHMgdGhlIHJlY29nbml6ZXIgdGhhdCBpcyBiZWluZyByZWNvZ25pemVkLlxuICAgICAgICAvLyBzbyB0aGUgcmVjb2duaXplcidzIHN0YXRlIG5lZWRzIHRvIGJlIEJFR0FOLCBDSEFOR0VELCBFTkRFRCBvciBSRUNPR05JWkVEXG4gICAgICAgIC8vIGlmIG5vIHJlY29nbml6ZXIgaXMgZGV0ZWN0aW5nIGEgdGhpbmcsIGl0IGlzIHNldCB0byBgbnVsbGBcbiAgICAgICAgdmFyIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXI7XG5cbiAgICAgICAgLy8gcmVzZXQgd2hlbiB0aGUgbGFzdCByZWNvZ25pemVyIGlzIHJlY29nbml6ZWRcbiAgICAgICAgLy8gb3Igd2hlbiB3ZSdyZSBpbiBhIG5ldyBzZXNzaW9uXG4gICAgICAgIGlmICghY3VyUmVjb2duaXplciB8fCAoY3VyUmVjb2duaXplciAmJiBjdXJSZWNvZ25pemVyLnN0YXRlICYgU1RBVEVfUkVDT0dOSVpFRCkpIHtcbiAgICAgICAgICAgIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHJlY29nbml6ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVjb2duaXplciA9IHJlY29nbml6ZXJzW2ldO1xuXG4gICAgICAgICAgICAvLyBmaW5kIG91dCBpZiB3ZSBhcmUgYWxsb3dlZCB0cnkgdG8gcmVjb2duaXplIHRoZSBpbnB1dCBmb3IgdGhpcyBvbmUuXG4gICAgICAgICAgICAvLyAxLiAgIGFsbG93IGlmIHRoZSBzZXNzaW9uIGlzIE5PVCBmb3JjZWQgc3RvcHBlZCAoc2VlIHRoZSAuc3RvcCgpIG1ldGhvZClcbiAgICAgICAgICAgIC8vIDIuICAgYWxsb3cgaWYgd2Ugc3RpbGwgaGF2ZW4ndCByZWNvZ25pemVkIGEgZ2VzdHVyZSBpbiB0aGlzIHNlc3Npb24sIG9yIHRoZSB0aGlzIHJlY29nbml6ZXIgaXMgdGhlIG9uZVxuICAgICAgICAgICAgLy8gICAgICB0aGF0IGlzIGJlaW5nIHJlY29nbml6ZWQuXG4gICAgICAgICAgICAvLyAzLiAgIGFsbG93IGlmIHRoZSByZWNvZ25pemVyIGlzIGFsbG93ZWQgdG8gcnVuIHNpbXVsdGFuZW91cyB3aXRoIHRoZSBjdXJyZW50IHJlY29nbml6ZWQgcmVjb2duaXplci5cbiAgICAgICAgICAgIC8vICAgICAgdGhpcyBjYW4gYmUgc2V0dXAgd2l0aCB0aGUgYHJlY29nbml6ZVdpdGgoKWAgbWV0aG9kIG9uIHRoZSByZWNvZ25pemVyLlxuICAgICAgICAgICAgaWYgKHNlc3Npb24uc3RvcHBlZCAhPT0gRk9SQ0VEX1NUT1AgJiYgKCAvLyAxXG4gICAgICAgICAgICAgICAgICAgICFjdXJSZWNvZ25pemVyIHx8IHJlY29nbml6ZXIgPT0gY3VyUmVjb2duaXplciB8fCAvLyAyXG4gICAgICAgICAgICAgICAgICAgIHJlY29nbml6ZXIuY2FuUmVjb2duaXplV2l0aChjdXJSZWNvZ25pemVyKSkpIHsgLy8gM1xuICAgICAgICAgICAgICAgIHJlY29nbml6ZXIucmVjb2duaXplKGlucHV0RGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlY29nbml6ZXIucmVzZXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlY29nbml6ZXIgaGFzIGJlZW4gcmVjb2duaXppbmcgdGhlIGlucHV0IGFzIGEgdmFsaWQgZ2VzdHVyZSwgd2Ugd2FudCB0byBzdG9yZSB0aGlzIG9uZSBhcyB0aGVcbiAgICAgICAgICAgIC8vIGN1cnJlbnQgYWN0aXZlIHJlY29nbml6ZXIuIGJ1dCBvbmx5IGlmIHdlIGRvbid0IGFscmVhZHkgaGF2ZSBhbiBhY3RpdmUgcmVjb2duaXplclxuICAgICAgICAgICAgaWYgKCFjdXJSZWNvZ25pemVyICYmIHJlY29nbml6ZXIuc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEIHwgU1RBVEVfRU5ERUQpKSB7XG4gICAgICAgICAgICAgICAgY3VyUmVjb2duaXplciA9IHNlc3Npb24uY3VyUmVjb2duaXplciA9IHJlY29nbml6ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZ2V0IGEgcmVjb2duaXplciBieSBpdHMgZXZlbnQgbmFtZS5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ8TnVsbH1cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKHJlY29nbml6ZXIgaW5zdGFuY2VvZiBSZWNvZ25pemVyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVjb2duaXplcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZWNvZ25pemVycyA9IHRoaXMucmVjb2duaXplcnM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVjb2duaXplcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZWNvZ25pemVyc1tpXS5vcHRpb25zLmV2ZW50ID09IHJlY29nbml6ZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjb2duaXplcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGFkZCBhIHJlY29nbml6ZXIgdG8gdGhlIG1hbmFnZXJcbiAgICAgKiBleGlzdGluZyByZWNvZ25pemVycyB3aXRoIHRoZSBzYW1lIGV2ZW50IG5hbWUgd2lsbCBiZSByZW1vdmVkXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ8TWFuYWdlcn1cbiAgICAgKi9cbiAgICBhZGQ6IGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKHJlY29nbml6ZXIsICdhZGQnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmdcbiAgICAgICAgdmFyIGV4aXN0aW5nID0gdGhpcy5nZXQocmVjb2duaXplci5vcHRpb25zLmV2ZW50KTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZShleGlzdGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY29nbml6ZXJzLnB1c2gocmVjb2duaXplcik7XG4gICAgICAgIHJlY29nbml6ZXIubWFuYWdlciA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHJlY29nbml6ZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlbW92ZSBhIHJlY29nbml6ZXIgYnkgbmFtZSBvciBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcnxTdHJpbmd9IHJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7TWFuYWdlcn1cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKHJlY29nbml6ZXIsICdyZW1vdmUnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZWNvZ25pemVyID0gdGhpcy5nZXQocmVjb2duaXplcik7XG5cbiAgICAgICAgLy8gbGV0J3MgbWFrZSBzdXJlIHRoaXMgcmVjb2duaXplciBleGlzdHNcbiAgICAgICAgaWYgKHJlY29nbml6ZXIpIHtcbiAgICAgICAgICAgIHZhciByZWNvZ25pemVycyA9IHRoaXMucmVjb2duaXplcnM7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBpbkFycmF5KHJlY29nbml6ZXJzLCByZWNvZ25pemVyKTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJlY29nbml6ZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBiaW5kIGV2ZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50c1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcbiAgICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSB0aGlzXG4gICAgICovXG4gICAgb246IGZ1bmN0aW9uKGV2ZW50cywgaGFuZGxlcikge1xuICAgICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFuZGxlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzO1xuICAgICAgICBlYWNoKHNwbGl0U3RyKGV2ZW50cyksIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBoYW5kbGVyc1tldmVudF0gPSBoYW5kbGVyc1tldmVudF0gfHwgW107XG4gICAgICAgICAgICBoYW5kbGVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB1bmJpbmQgZXZlbnQsIGxlYXZlIGVtaXQgYmxhbmsgdG8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaGFuZGxlcl1cbiAgICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSB0aGlzXG4gICAgICovXG4gICAgb2ZmOiBmdW5jdGlvbihldmVudHMsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzO1xuICAgICAgICBlYWNoKHNwbGl0U3RyKGV2ZW50cyksIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIWhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgaGFuZGxlcnNbZXZlbnRdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyc1tldmVudF0gJiYgaGFuZGxlcnNbZXZlbnRdLnNwbGljZShpbkFycmF5KGhhbmRsZXJzW2V2ZW50XSwgaGFuZGxlciksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGVtaXQgZXZlbnQgdG8gdGhlIGxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICovXG4gICAgZW1pdDogZnVuY3Rpb24oZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgLy8gd2UgYWxzbyB3YW50IHRvIHRyaWdnZXIgZG9tIGV2ZW50c1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRvbUV2ZW50cykge1xuICAgICAgICAgICAgdHJpZ2dlckRvbUV2ZW50KGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIGhhbmRsZXJzLCBzbyBza2lwIGl0IGFsbFxuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzW2V2ZW50XSAmJiB0aGlzLmhhbmRsZXJzW2V2ZW50XS5zbGljZSgpO1xuICAgICAgICBpZiAoIWhhbmRsZXJzIHx8ICFoYW5kbGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEudHlwZSA9IGV2ZW50O1xuICAgICAgICBkYXRhLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkYXRhLnNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGhhbmRsZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgaGFuZGxlcnNbaV0oZGF0YSk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZGVzdHJveSB0aGUgbWFuYWdlciBhbmQgdW5iaW5kcyBhbGwgZXZlbnRzXG4gICAgICogaXQgZG9lc24ndCB1bmJpbmQgZG9tIGV2ZW50cywgdGhhdCBpcyB0aGUgdXNlciBvd24gcmVzcG9uc2liaWxpdHlcbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ICYmIHRvZ2dsZUNzc1Byb3BzKHRoaXMsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLmhhbmRsZXJzID0ge307XG4gICAgICAgIHRoaXMuc2Vzc2lvbiA9IHt9O1xuICAgICAgICB0aGlzLmlucHV0LmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICB9XG59O1xuXG4vKipcbiAqIGFkZC9yZW1vdmUgdGhlIGNzcyBwcm9wZXJ0aWVzIGFzIGRlZmluZWQgaW4gbWFuYWdlci5vcHRpb25zLmNzc1Byb3BzXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYWRkXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUNzc1Byb3BzKG1hbmFnZXIsIGFkZCkge1xuICAgIHZhciBlbGVtZW50ID0gbWFuYWdlci5lbGVtZW50O1xuICAgIGlmICghZWxlbWVudC5zdHlsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBwcm9wO1xuICAgIGVhY2gobWFuYWdlci5vcHRpb25zLmNzc1Byb3BzLCBmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICBwcm9wID0gcHJlZml4ZWQoZWxlbWVudC5zdHlsZSwgbmFtZSk7XG4gICAgICAgIGlmIChhZGQpIHtcbiAgICAgICAgICAgIG1hbmFnZXIub2xkQ3NzUHJvcHNbcHJvcF0gPSBlbGVtZW50LnN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IG1hbmFnZXIub2xkQ3NzUHJvcHNbcHJvcF0gfHwgJyc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWFkZCkge1xuICAgICAgICBtYW5hZ2VyLm9sZENzc1Byb3BzID0ge307XG4gICAgfVxufVxuXG4vKipcbiAqIHRyaWdnZXIgZG9tIGV2ZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKi9cbmZ1bmN0aW9uIHRyaWdnZXJEb21FdmVudChldmVudCwgZGF0YSkge1xuICAgIHZhciBnZXN0dXJlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBnZXN0dXJlRXZlbnQuaW5pdEV2ZW50KGV2ZW50LCB0cnVlLCB0cnVlKTtcbiAgICBnZXN0dXJlRXZlbnQuZ2VzdHVyZSA9IGRhdGE7XG4gICAgZGF0YS50YXJnZXQuZGlzcGF0Y2hFdmVudChnZXN0dXJlRXZlbnQpO1xufVxuXG5hc3NpZ24oSGFtbWVyLCB7XG4gICAgSU5QVVRfU1RBUlQ6IElOUFVUX1NUQVJULFxuICAgIElOUFVUX01PVkU6IElOUFVUX01PVkUsXG4gICAgSU5QVVRfRU5EOiBJTlBVVF9FTkQsXG4gICAgSU5QVVRfQ0FOQ0VMOiBJTlBVVF9DQU5DRUwsXG5cbiAgICBTVEFURV9QT1NTSUJMRTogU1RBVEVfUE9TU0lCTEUsXG4gICAgU1RBVEVfQkVHQU46IFNUQVRFX0JFR0FOLFxuICAgIFNUQVRFX0NIQU5HRUQ6IFNUQVRFX0NIQU5HRUQsXG4gICAgU1RBVEVfRU5ERUQ6IFNUQVRFX0VOREVELFxuICAgIFNUQVRFX1JFQ09HTklaRUQ6IFNUQVRFX1JFQ09HTklaRUQsXG4gICAgU1RBVEVfQ0FOQ0VMTEVEOiBTVEFURV9DQU5DRUxMRUQsXG4gICAgU1RBVEVfRkFJTEVEOiBTVEFURV9GQUlMRUQsXG5cbiAgICBESVJFQ1RJT05fTk9ORTogRElSRUNUSU9OX05PTkUsXG4gICAgRElSRUNUSU9OX0xFRlQ6IERJUkVDVElPTl9MRUZULFxuICAgIERJUkVDVElPTl9SSUdIVDogRElSRUNUSU9OX1JJR0hULFxuICAgIERJUkVDVElPTl9VUDogRElSRUNUSU9OX1VQLFxuICAgIERJUkVDVElPTl9ET1dOOiBESVJFQ1RJT05fRE9XTixcbiAgICBESVJFQ1RJT05fSE9SSVpPTlRBTDogRElSRUNUSU9OX0hPUklaT05UQUwsXG4gICAgRElSRUNUSU9OX1ZFUlRJQ0FMOiBESVJFQ1RJT05fVkVSVElDQUwsXG4gICAgRElSRUNUSU9OX0FMTDogRElSRUNUSU9OX0FMTCxcblxuICAgIE1hbmFnZXI6IE1hbmFnZXIsXG4gICAgSW5wdXQ6IElucHV0LFxuICAgIFRvdWNoQWN0aW9uOiBUb3VjaEFjdGlvbixcblxuICAgIFRvdWNoSW5wdXQ6IFRvdWNoSW5wdXQsXG4gICAgTW91c2VJbnB1dDogTW91c2VJbnB1dCxcbiAgICBQb2ludGVyRXZlbnRJbnB1dDogUG9pbnRlckV2ZW50SW5wdXQsXG4gICAgVG91Y2hNb3VzZUlucHV0OiBUb3VjaE1vdXNlSW5wdXQsXG4gICAgU2luZ2xlVG91Y2hJbnB1dDogU2luZ2xlVG91Y2hJbnB1dCxcblxuICAgIFJlY29nbml6ZXI6IFJlY29nbml6ZXIsXG4gICAgQXR0clJlY29nbml6ZXI6IEF0dHJSZWNvZ25pemVyLFxuICAgIFRhcDogVGFwUmVjb2duaXplcixcbiAgICBQYW46IFBhblJlY29nbml6ZXIsXG4gICAgU3dpcGU6IFN3aXBlUmVjb2duaXplcixcbiAgICBQaW5jaDogUGluY2hSZWNvZ25pemVyLFxuICAgIFJvdGF0ZTogUm90YXRlUmVjb2duaXplcixcbiAgICBQcmVzczogUHJlc3NSZWNvZ25pemVyLFxuXG4gICAgb246IGFkZEV2ZW50TGlzdGVuZXJzLFxuICAgIG9mZjogcmVtb3ZlRXZlbnRMaXN0ZW5lcnMsXG4gICAgZWFjaDogZWFjaCxcbiAgICBtZXJnZTogbWVyZ2UsXG4gICAgZXh0ZW5kOiBleHRlbmQsXG4gICAgYXNzaWduOiBhc3NpZ24sXG4gICAgaW5oZXJpdDogaW5oZXJpdCxcbiAgICBiaW5kRm46IGJpbmRGbixcbiAgICBwcmVmaXhlZDogcHJlZml4ZWRcbn0pO1xuXG4vLyB0aGlzIHByZXZlbnRzIGVycm9ycyB3aGVuIEhhbW1lciBpcyBsb2FkZWQgaW4gdGhlIHByZXNlbmNlIG9mIGFuIEFNRFxuLy8gIHN0eWxlIGxvYWRlciBidXQgYnkgc2NyaXB0IHRhZywgbm90IGJ5IHRoZSBsb2FkZXIuXG52YXIgZnJlZUdsb2JhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6ICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDoge30pKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5mcmVlR2xvYmFsLkhhbW1lciA9IEhhbW1lcjtcblxuaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEhhbW1lcjtcbiAgICB9KTtcbn0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gSGFtbWVyO1xufSBlbHNlIHtcbiAgICB3aW5kb3dbZXhwb3J0TmFtZV0gPSBIYW1tZXI7XG59XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsICdIYW1tZXInKTtcbiIsIi8qKlxuICogTWljcm9FdmVudCAtIHRvIG1ha2UgYW55IGpzIG9iamVjdCBhbiBldmVudCBlbWl0dGVyIChzZXJ2ZXIgb3IgYnJvd3NlcilcbiAqIFxuICogLSBwdXJlIGphdmFzY3JpcHQgLSBzZXJ2ZXIgY29tcGF0aWJsZSwgYnJvd3NlciBjb21wYXRpYmxlXG4gKiAtIGRvbnQgcmVseSBvbiB0aGUgYnJvd3NlciBkb21zXG4gKiAtIHN1cGVyIHNpbXBsZSAtIHlvdSBnZXQgaXQgaW1tZWRpYXRseSwgbm8gbWlzdGVyeSwgbm8gbWFnaWMgaW52b2x2ZWRcbiAqXG4gKiAtIGNyZWF0ZSBhIE1pY3JvRXZlbnREZWJ1ZyB3aXRoIGdvb2RpZXMgdG8gZGVidWdcbiAqICAgLSBtYWtlIGl0IHNhZmVyIHRvIHVzZVxuKi9cblxudmFyIE1pY3JvRXZlbnRcdD0gZnVuY3Rpb24oKXt9XG5NaWNyb0V2ZW50LnByb3RvdHlwZVx0PSB7XG5cdGJpbmRcdDogZnVuY3Rpb24oZXZlbnQsIGZjdCl7XG5cdFx0dGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuXHRcdHRoaXMuX2V2ZW50c1tldmVudF0gPSB0aGlzLl9ldmVudHNbZXZlbnRdXHR8fCBbXTtcblx0XHR0aGlzLl9ldmVudHNbZXZlbnRdLnB1c2goZmN0KTtcblx0fSxcblx0dW5iaW5kXHQ6IGZ1bmN0aW9uKGV2ZW50LCBmY3Qpe1xuXHRcdHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcblx0XHRpZiggZXZlbnQgaW4gdGhpcy5fZXZlbnRzID09PSBmYWxzZSAgKVx0cmV0dXJuO1xuXHRcdHRoaXMuX2V2ZW50c1tldmVudF0uc3BsaWNlKHRoaXMuX2V2ZW50c1tldmVudF0uaW5kZXhPZihmY3QpLCAxKTtcblx0fSxcblx0dHJpZ2dlclx0OiBmdW5jdGlvbihldmVudCAvKiAsIGFyZ3MuLi4gKi8pe1xuXHRcdHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcblx0XHRpZiggZXZlbnQgaW4gdGhpcy5fZXZlbnRzID09PSBmYWxzZSAgKVx0cmV0dXJuO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLl9ldmVudHNbZXZlbnRdLmxlbmd0aDsgaSsrKXtcblx0XHRcdHRoaXMuX2V2ZW50c1tldmVudF1baV0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSlcblx0XHR9XG5cdH1cbn07XG5cbi8qKlxuICogbWl4aW4gd2lsbCBkZWxlZ2F0ZSBhbGwgTWljcm9FdmVudC5qcyBmdW5jdGlvbiBpbiB0aGUgZGVzdGluYXRpb24gb2JqZWN0XG4gKlxuICogLSByZXF1aXJlKCdNaWNyb0V2ZW50JykubWl4aW4oRm9vYmFyKSB3aWxsIG1ha2UgRm9vYmFyIGFibGUgdG8gdXNlIE1pY3JvRXZlbnRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdGhlIG9iamVjdCB3aGljaCB3aWxsIHN1cHBvcnQgTWljcm9FdmVudFxuKi9cbk1pY3JvRXZlbnQubWl4aW5cdD0gZnVuY3Rpb24oZGVzdE9iamVjdCl7XG5cdHZhciBwcm9wc1x0PSBbJ2JpbmQnLCAndW5iaW5kJywgJ3RyaWdnZXInXTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSArKyl7XG5cdFx0ZGVzdE9iamVjdC5wcm90b3R5cGVbcHJvcHNbaV1dXHQ9IE1pY3JvRXZlbnQucHJvdG90eXBlW3Byb3BzW2ldXTtcblx0fVxufVxuXG4vLyBleHBvcnQgaW4gY29tbW9uIGpzXG5pZiggdHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAoJ2V4cG9ydHMnIGluIG1vZHVsZSkpe1xuXHRtb2R1bGUuZXhwb3J0c1x0PSBNaWNyb0V2ZW50XG59XG4iXX0=
