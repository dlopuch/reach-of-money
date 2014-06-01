define([
  'jquery',
  'underscore',
  'models/promiseOutOfStateContributions'
], function($, _, promiseOutOfStateContributions) {

  var readyDeferred = $.Deferred(),
      isOutgoingMode = true,

      /** Given a state ID, maps to an array of all contributions going out of that state.
       *  Contributions with no originating state are keyed at 'none'. */
      outgoingContributionsByState,

      /** Given a state ID, maps to an array of all contributions coming into that state. */
      incomingContributionsByState;

  /**
   * ContributionsService singleton
   * (what this require module returns)
   */
  var ContributionsService = {
    switchToIncomingMode: function() {
      isOutgoingMode = false;
    },
    switchToOutgoingMode: function() {
      isOutgoingMode = true;
    },
    isOutgoingMode: function() {
      return isOutgoingMode;
    },

    /**
     * @returns {$.Promise} a promise that gets resolved when this service has loaded all data and is ready
     */
    getReadyPromise: function() {
      return readyDeferred.promise();
    },

    /**
     * Depending on which mode this service is in, returns contributions either incoming into the specified state
     * or contributions going out of the state.
     *
     * @param {string} stateId eg 'NY', 'ca'
     * @returns {Object} Contributions into or out of the state:
     *    type: {string} 'incoming' or 'outgoing'
     *    contributions: {Array(Object)} where each Object is:
     *                                   {id: {String}, num_contributions: {number}, amount_usd: {number}}
     */
    getContributionsByState: function(stateId) {
      if (!outgoingContributionsByState && !incomingContributionsByState) {
        console.warn("Warning! Data not yet loaded, race condition!  Wait for service with getReadyPromise().");
        return []; // data not yet loaded
      }

      if (!stateId)
        stateId = 'none';
      stateId = stateId.toUpperCase();

      if (isOutgoingMode) {
        return {
          type: 'outgoing',
          contributions: _.clone(incomingContributionsByState[stateId]) // not deep clone.  don't modify the objects.
        };

      } else {
        return {
          type: 'incoming',
          contributions: _.clone(outgoingContributionsByState[stateId])
        };
      }

    },
    getScaleStub: function() {
      return d3.scale.linear().domain([0,1]);
    }
  };


  // -----------------------------
  // LOAD DATA AND INDEX

  promiseOutOfStateContributions
  .fail(function(error) {
    readyDeferred.reject(error);
  })
  .done(function(contribs) {

    outgoingContributionsByState = {};
    incomingContributionsByState = {};

    var stateId;
    contribs.forEach(function(c) {
      // Outgoing contributions
      stateId = c.donor_state || 'none';
      if (!outgoingContributionsByState[stateId])
        outgoingContributionsByState[stateId] = [];

      outgoingContributionsByState[stateId].push({
        id: c.candidates_state,
        num_contributions: c.num_donations,
        amount_usd: c.total_amount
      });


      // Incoming contributions
      stateId = c.candidates_state;
      if (!incomingContributionsByState[stateId])
        incomingContributionsByState[stateId] = [];

      incomingContributionsByState[stateId].push({
        id: c.donor_state || 'none',
        num_contributions: c.num_donations,
        amount_usd: c.total_amount
      });

      readyDeferred.resolve(ContributionsService);
    });
  });

  return ContributionsService;

});
