/**
 * Returns a {$.Promise} that gets resolved when data/out-of-state-donations.csv has been fetched and parsed into
 * a list of row objects.
 * Each row is keyed by CSV column name.
 */
define(['jquery', 'd3'], function($, d3) {
  var deferred = $.Deferred();

  d3.csv('js/data/out-of-state-contributions.csv',
    function(d) {
      // Skip meta columns (attribution and description)
      if (d.donor_state === 'META')
        return false;

      // cooerce some strings into numbers
      return {
        donor_state: d.donor_state === "" ? null : d.donor_state,
        candidates_state: d.candidates_state,
        num_donations: +d.num_donations,
        total_amount: +d.total_amount
      };
    },
    function(error, parsedRows) {
      if (error)
        return deferred.reject(error);

      deferred.resolve(parsedRows);
    }
  );

  return deferred.promise();
});
