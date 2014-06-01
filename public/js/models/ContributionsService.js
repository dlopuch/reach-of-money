define([
  'models/promiseOutOfStateContributions'
], function(promiseOutOfStateContributions) {

  return {
    /**
     *
     * @param {Object} stateId
     * @returns {Array(Objects)} Contributions into or out of the state, where each Object is: {id: state, amount: <$>}
     */
    getContributionsByState: function(stateId) {
      // TODO
    },
    getScaleStub: function() {
      return d3.scale.linear().domain([0,1]);
    }
  };

});
