/**
 * Require config
 */
require.config({

  deps: ['main'],

  baseUrl: "/js/",

  paths: {
    "d3": "/lib/d3.v3.3.2.min",
    "tpl": "/lib/tpl",
    "underscore": "/lib/lodash.min",
    "highcharts": "/lib/highcharts-all",
    "numeral": "/lib/numeral.min"
//    "jquery-slider": "/lib/jquery-ui-1.10.4.slider"
//    "jquery": "/lib/jquery-2.1.0.min",
//    "backbone": "/lib/backbone-min",
//    "bootstrap": "/lib/bootstrap_232/js/bootstrap.min",
  },

  shim: {
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
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
    numeral: {
      exports: 'numeral'
    },
    "jquery-slider": {
      deps: ['jquery'],
      exports: "$"
    }
  }

});
