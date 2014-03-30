define(['jquery', 'underscore', 'xml2json'], function($, _, xml2json) {
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

      var ret = $.Deferred();

      $.get('http://api.followthemoney.org/candidates.list.php', _.extend({}, opts, {key: FTM_API_KEY}))
      .fail(function(xml) {
        console.log("[CandidatesAPI.list] Error getting candidates!", xml);
        ret.reject(xml2json(xml));
      })
      .done(function(xml) {
        var results = xml2json(xml);

        if (results.error) {
          ret.reject(results.error['@attributes']);
          return;
        }

        var candidatesList = results['candidates.list.php'].candidate.map(function(candidate) {
          var c = candidate['@attributes'];

          // parse number-ey text:
          ['candidate_leadership_committee_dollars',
           'candidate_money_dollars',
           'individual_dollars',
           'institution_dollars',
           'non_contribution_income_dollars',
           'party_committee_dollars',
           'public_fund_dollars',
           'total_contribution_records',
           'total_dollars',
           'total_in_state_dollars',
           'total_out_of_state_dollars',
           'total_unknown_state_dollars',
           'unitemized_donation_dollars',
           'year'
          ].forEach(function(attr) {
            c[attr] = parseInt(c[attr], 10);
          });


          return c;
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

        if (!Array.isArray(results['candidates.industries.php'].candidate_industry)) {
          results['candidates.industries.php'].candidate_industry = [];
        }

        var industryList = results['candidates.industries.php'].candidate_industry.map(function(industry) {
          var i = industry['@attributes'];
          i.total_contribution_records = parseInt(i.total_contribution_records, 10);
          i.total_dollars = parseInt(i.total_dollars, 10);

          return i;
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
    },

    top_contributors: function(opts) {
      if (!opts.imsp_candidate_id)
        throw new Error('imsp_candidate_id required');

      opts = _.extend({}, opts, {key: FTM_API_KEY});

      var ret = $.Deferred();

      $.get('http://api.followthemoney.org/candidates.top_contributors.php', opts)
      .fail(function(xml) {
        alert("[CandidatesAPI.top_contributors] Error getting top_contributors!");
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
          alert('[CandidatesAPI.top_contributors] Error in API parameters');
          ret.reject(results.error['@attributes']);
          return;
        }

        if (!Array.isArray(results['candidates.top_contributors.php'].top_contributor)) {
          results['candidates.top_contributors.php'].top_contributor = [];
        }

        var topContributors = results['candidates.top_contributors.php'].top_contributor.map(function(contributor) {
          var c = contributor['@attributes'];
          c.contribution_ranking = parseInt(c.contribution_ranking, 10);
          c.percent_of_total_contribution_records = parseFloat(c.percent_of_total_contribution_records, 10);
          c.percent_of_total_total_dollars = parseFloat(c.percent_of_total_total_dollars, 10);
          c.total_contribution_records = parseInt(c.total_contribution_records, 10);
          c.total_dollars = parseInt(c.total_dollars, 10);

          return c;
        });

        ret.resolve(topContributors);
      });

      return ret;
    }
  };
});
