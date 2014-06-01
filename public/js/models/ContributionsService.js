define([
  'jquery',
  'underscore',
  'models/promiseOutOfStateContributions'
], function($, _, promiseOutOfStateContributions) {

  var readyDeferred = $.Deferred(),
      isOutgoingMode = true,

      /** Given a state ID, maps to an array of all contributions going out of that state.
       *  Contributions with no originating state are keyed at 'none'. */
      outgoingContributionsByStateIdx,

      /** Given a state ID, maps to an array of all contributions coming into that state. */
      incomingContributionsByStateIdx,

      minContributionUSD = Infinity,
      maxContributionUSD = -Infinity;

  /**
   * @module ContributionsService
   *
   * ContributionsService singleton
   * (the object this requirejs module returns)
   */
  var ContributionsService = {
    /**
     * @returns {$.Promise} a promise that gets resolved when this service has loaded all data and is ready
     */
    getReadyPromise: function() {
      return readyDeferred.promise();
    },

    /**
     * Makes getContributionsByState() return incoming contributions to a given state
     * @returns this, for chaining
     */
    switchToIncomingMode: function() {
      isOutgoingMode = false;
      return ContributionsService;
    },

    /**
     * Makes getContributionsByState() return outgoing contributions from a given state
     * @returns this, for chaining
     */
    switchToOutgoingMode: function() {
      isOutgoingMode = true;
      return ContributionsService;
    },

    /**
     * @returns true if service is returning outgoing contributions, false for incoming
     */
    isOutgoingMode: function() {
      return isOutgoingMode;
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
      if (!outgoingContributionsByStateIdx && !incomingContributionsByStateIdx) {
        console.warn("[ContributionsService] Warning! Data not yet loaded, race condition!  Wait for service " +
                     "with getReadyPromise().");
        return []; // data not yet loaded
      }

      if (!stateId)
        stateId = 'none';
      stateId = stateId.toUpperCase();

      if (isOutgoingMode) {
        return {
          type: 'outgoing',
          contributions: _.clone(outgoingContributionsByStateIdx[stateId]) // not deep clone.  don't modify the objects.
        };

      } else {
        return {
          type: 'incoming',
          contributions: _.clone(incomingContributionsByStateIdx[stateId])
        };
      }

    },

    /**
     * @returns {d3.scale.linear} A linear D3 scale with domain set for the limits of individual state-to-state
     *                            contributions.  Consumer should set the range with whatever parameters (eg colors).
     */
    getContributionsScaleStub: function() {
      return d3.scale.linear().domain([0, maxContributionUSD]);
    }
  };


  // -----------------------------
  // LOAD DATA AND INDEX

  promiseOutOfStateContributions
  .fail(function(error) {
    readyDeferred.reject(error);
  })
  .done(function(contribs) {

    outgoingContributionsByStateIdx = {};
    incomingContributionsByStateIdx = {};

    var stateId;
    contribs.forEach(function(c) {
      // Outgoing contributions
      stateId = c.donor_state || 'none';
      if (!outgoingContributionsByStateIdx[stateId])
        outgoingContributionsByStateIdx[stateId] = [];

      outgoingContributionsByStateIdx[stateId].push({
        id: c.candidates_state,
        num_contributions: c.num_donations,
        amount_usd: c.total_amount
      });


      // Incoming contributions
      stateId = c.candidates_state;
      if (!incomingContributionsByStateIdx[stateId])
        incomingContributionsByStateIdx[stateId] = [];

      incomingContributionsByStateIdx[stateId].push({
        id: c.donor_state || 'none',
        num_contributions: c.num_donations,
        amount_usd: c.total_amount
      });


      // min and max for scales
      if (c.total_amount > maxContributionUSD)
        maxContributionUSD = c.total_amount;
      if (c.total_amount < minContributionUSD)
        minContributionUSD = c.total_amount;
    });

    readyDeferred.resolve(ContributionsService);
  });

  return ContributionsService;

});
