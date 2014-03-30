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

      // Use lodash chaining to get the contribution type breakdowns, largest contribution type on top
      var contributorTypeBreakdownSorted = _([
        'candidate_leadership_committee_dollars',
        'candidate_money_dollars',
        'individual_dollars',
        'institution_dollars',
        'non_contribution_income_dollars',
        'party_committee_dollars',
        'public_fund_dollars',
        'unitemized_donation_dollars'
      ])
      .map(function(k) {
        return {key: k, value: candidate[k]};
      })
      .sortBy(function(contrType) {
        return -contrType.value;  // sortBy does ascending.  We want descending, so inverse for the comparison
      })
      .valueOf();

      this.$el.html(CandidateViewTpl({
        prettyPrint: prettyPrint,
        n: numeral,

        candidate: candidate,
        candidatePrettyName: prettyPrint(candidate.candidate_name.split(",").reverse().join(" ").trim()),

        top_contributors: this.options.candidateModel.top_contributors,
        industries: this.options.candidateModel.industries,

        contributorTypeBreakdownSorted: contributorTypeBreakdownSorted
      }));
      return this;
    }
  });
});
