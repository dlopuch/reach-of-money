define([
  'backbone',
  'numeral',
  'tpl!templates/CandidateView.html'
], function(
  Backbone,
  numeral,
  CandidateViewTpl) {

  function prettyPrint(str) {
    return str.toLowerCase().replace(/\b[a-z]/g, function(letter) { return letter.toUpperCase(); } ).trim();
  };

  var count = 0;
  return Backbone.View.extend({
    initialize: function(options) {
      this.options = options;

      if (!options.candidateModel)
        throw new Error("Missing candidateModel");

      this.render();
    },
    render: function() {
      var candidate = this.options.candidateModel.candidateMeta;

      this.$el.html(CandidateViewTpl({
        prettyPrint: prettyPrint,
        n: numeral,

        candidate: candidate,
        candidatePrettyName: prettyPrint(candidate.candidate_name.split(",").reverse().join(" ").trim()),

        top_contributors: this.options.candidateModel.top_contributors,
        industries: this.options.candidateModel.industries
      }));
      return this;
    }
  });
});
