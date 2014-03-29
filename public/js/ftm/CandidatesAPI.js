define(['jquery', 'xml2json'], function($, xml2json) {
  return {
    /**
     * List candidates
     * @param {Object} opts
     *   opts.state: {string} State
     *   opts.year: {number} Year.  defaults to 2010
     *   opts.office: {string} Office. eg 'ASSEMBLY'
     *   opts.district {string} District.  eg 010.
     * @return {jquery.Deferred} Gets resolved with a List of Objects, where each Object is a candidate.
     */
    list: function(opts, callback) {
      if (!opts.state)
        throw new Error('state required');
      if (!opts.year)
        opts.year = 2010;
      if (!opts.office)
        throw new Error('office required');
      if (!opts.district)
        throw new Error('district required');

      var ret = $.Deferred();

      $.get('http://api.followthemoney.org/candidates.list.php?key=' + FTM_API_KEY +
            '&state=' + opts.state + '&year=' + opts.year + '&office=' + opts.office +
            '&district=' + opts.district)
      .done(function(xml) {
        var results = xml2json(xml);

        if (results.error) {
          alert('Error in API parameters');
          ret.reject(results.error['@attributes']);
          return;
        }

        var candidatesList = results['candidates.list.php'].candidate.map(function(c) {
          return c['@attributes'];
        });

        ret.resolve(candidatesList);
      })
      .fail(function(xml) {
        alert("Error getting candidates!");
        console.log(xml);
        ret.reject(xml2json(xml));
      });

      return ret;
    }
  };
});
