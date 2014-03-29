define(['jquery', 'lodash', 'xml2json'], function($, _, xml2json) {
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
    list: function(opts) {
      if (!opts.state)
        throw new Error('state required');
      if (!opts.year)
        opts.year = 2010;
      if (!opts.office)
        throw new Error('office required');
      if (!opts.district)
        throw new Error('district required');

      var ret = $.Deferred();

      $.get('http://api.followthemoney.org/candidates.list.php', _.extend({}, opts, {key: FTM_API_KEY}))
      .fail(function(xml) {
        alert("Error getting candidates!");
        console.log(xml);
        ret.reject(xml2json(xml));
      })
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
      });

      return ret;
    },

    industries: function(opts) {
      if (!opts.imsp_candidate_id)
        throw new Error('imsp_candidate_id required');
      if (opts.sort && !_.contains(['sector_name', 'industry_name', 'total_dollars'], opts.sort))
        throw new Error('invalid sort option!');
      if (opts.sort === undefined)
        opts.sort = 'total_dollars'; //default

      opts = _.extend({}, opts, {key: FTM_API_KEY});

      var ret = $.Deferred();

      $.get('http://api.followthemoney.org/candidates.industries.php', opts)
      .fail(function(xml) {
        alert("[CandidatesAPI.industries] Error getting industries!");
        console.log(xml);
        ret.reject(xml2json(xml));
      })
      .done(function(xml) {
        var results = xml2json(xml);

        if (results.error &&
            results.error['@attributes'].code === '200' &&
            results.error['@attributes'].text === 'no records found') {
          ret.resolve([]);
          return;

        } else if (results.error) {
          alert('[CandidatesAPI.industries] Error in API parameters');
          ret.reject(results.error['@attributes']);
          return;
        }

        var industryList = results['candidates.industries.php'].candidate_industry.map(function(industry) {
          return industry['@attributes'];
        });

        if (industryList.length !== parseInt(results['candidates.industries.php']['@attributes'].record_count, 10)) {
          // API suggests this is page, but not sure what the page size is.  Log for now.  TODO: Does this trigger?
          console.warn('[CandidatesAPI.industries] Number of returned industries didnt match record count. ',
                       'Expected: ' + parseInt(results['candidates.industries.php']['@attributes'].record_count, 10),
                       'Saw: ' + industryList.length,
                       'Params: ', opts);
        }

        if (results['candidates.industries.php']['@attributes'].next_page === 'yes') {
          // TODO: paging not implemented, see if this ever triggers
          console.warn('[CandidatesAPI.industries] Another page of results available, but not implemented',
                       'Params: ', opts);
        }

        if (opts.sort === 'total_dollars') {
          // API docs lied.  total_dollars appears to be ascending sort, not descending.
          industryList = industryList.reverse();
        }

        ret.resolve(industryList);
      });

      return ret;

    }
  };
});
