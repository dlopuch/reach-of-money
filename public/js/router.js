define(['backbone', 'views/CandidateLoader'], function(Backbone, CandidateLoader) {
  // CandidateAPI.list filter for governor type races
  var governorFilter = function(c) {
    return c.office !== "LIEUTENANT GOVERNOR" && // API return Lt. Gov positions for 'governor' query
           c.candidate_status.search('Primary') === -1; // limit to just general election candidates to avoid rate limits
  };

  var router = new (Backbone.Router.extend({
    routes: {
      //'': 'loadRace',
      'race(/)': 'loadRace',
      'race/:state/:year/:office': 'loadRace',
      'race/:state/:year/:office/:district': 'loadRace',
      'about': 'about'
    },

    about: function() {
      $('#splash').show();
      $('#candidate_bios').hide();
    },

    loadRace: function(state, year, office, district) {
      $("#splash").hide();

      var filter, query = {
        state: state || 'CA',
        year: year || 2010,
        office: (office && office.toUpperCase()) || 'GOVERNOR'
      };

      if (district) {
        query.district = district;
      }

      if (query.office.toLowerCase() === 'governor') {
        filter = governorFilter;
      }

      CandidateLoader(query, filter)
      .done(function(candidatesList) {
        console.log("Done loading candidates.  Check window.candidatesList");
        window.candidatesList = candidatesList;
      })
      .fail(function(error) {
        console.log("Error loading candidates", error);
      });
    }
  }))();
  Backbone.history.start();
  return router;
});
