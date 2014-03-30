define([
  'backbone',
  'speechGenerators/BasicGenerator',
  'tpl!templates/CandidateView.html'
], function(
  Backbone,
  BasicGenerator,
  CandidateViewTpl) {

  var count = 0;
  return Backbone.View.extend({
    initialize: function(options) {
      this.options = options;

      if (!options.candidateModel)
        throw new Error("Missing candidateModel");

      this.render();
    },
    render: function() {
      var paragraphs = BasicGenerator(this.options.candidateModel.candidateMeta,
                                      this.options.candidateModel.top_contributors,
                                      this.options.candidateModel.industries);

      this.$el.html(CandidateViewTpl({
        paragraphs: paragraphs
      }));
      return this;
    }
  });
});
