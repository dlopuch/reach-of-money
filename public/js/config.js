/**
 * Require config
 */
require.config({

  deps: ['main'],

  baseUrl: "/js/",

  paths: {
    "jquery": "/lib/jquery-2.1.0.min",
    "backbone": "/lib/backbone-min",
    "d3": "/lib/d3.v3.3.2.min",
    "bootstrap": "/lib/bootstrap_232/js/bootstrap.min",
    "tpl": "/lib/tpl",
    "lodash": "/lib/lodash.min",
    "highcharts": "/lib/highcharts-all",
    "jquery-slider": "/lib/jquery-ui-1.10.4.slider",
  },

  shim: {
    bootstrap: {
      deps: ['jquery']
    },
    d3: {
      exports: "d3"
    },
    highcharts: {
      deps: ['jquery'],
      exports: "Highcharts"
    },
    "jquery-slider": {
      deps: ['jquery'],
      exports: "$"
    }
  }

});
