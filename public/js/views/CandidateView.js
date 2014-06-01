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

      this.$el.addClass('col-md-4');
      this.$el.html(CandidateViewTpl({
        prettyPrint: prettyPrint,
        n: numeral,

        candidate: candidate,
        candidatePrettyName: prettyPrint(candidate.candidate_name.search('&') > -1 ? // cludge to non-prettify 'a & b' names
                                           candidate.candidate_name :
                                           candidate.candidate_name.split(",").reverse().join(" ").trim()),

        top_contributors: this.options.candidateModel.top_contributors,
        industries: this.options.candidateModel.industries,
        top50PctContributions: this.options.candidateModel.sectors.top50PctContributions || [],
        from50to75PctContributions: this.options.candidateModel.sectors.from50to75PctContributions || [],

        contributorTypeBreakdownSorted: this.options.candidateModel.contributorTypeBreakdownSorted
      }));
      return this;
    }
  });
});
