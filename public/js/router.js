define(['backbone'], function(Backbone) {


  var router = new (Backbone.Router.extend({
    routes: {
      'about': 'about'
    },

    about: function() {
      $('#splash').show();
      $('#candidate_bios').hide();
    },


  }))();
  Backbone.history.start();
  return router;
});
