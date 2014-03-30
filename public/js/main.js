define([
  'jquery', 'underscore',
  'xml2json',
  'ftm/CandidatesAPI',
  'views/CandidateView',
  'states'],
function(
  $, _,
  xml2json,
  CandidatesAPI,
  CandidateView,
  states) {
  // set some globals
  window.FTM_API_KEY = '4ed5bac2a60606b2e254a958317e1af3';
  window.xml2json = xml2json;

  window.CandidatesAPI = CandidatesAPI;

  // examples
  CandidatesAPI.list({
    state: 'CA',
    year: 2010,
    office: 'GOVERNOR'

    // Try this query if you keep on hitting rate limit:
    //office: 'ASSEMBLY',
    //district: '010'
  })
  .done(function(candidates) {
    candidates = candidates.filter(function(c) {
      return c.office !== "LIEUTENANT GOVERNOR" && // API return Lt. Gov positions for 'governor' query
             c.candidate_status.search('Primary Election') === -1; // limit to just general election candidates
    });

    console.log("Got " + candidates.length + " candidates for 2010 CA Governer:");

    var detailsDeferreds = [], // list of GET requests to grab all the details for each candidate
        fullCandidates = {};
    candidates.forEach(function(c) {

      fullCandidates[c.imsp_candidate_id] = {
        candidateMeta: c,
        industries: null,
        top_contributors: null
      };

      // Grab industries, put them onto the candidate object
      detailsDeferreds.push(
        CandidatesAPI.industries({
          imsp_candidate_id: c.imsp_candidate_id,
          sort: 'total_dollars'
        })
        .done(function(industries) {
          fullCandidates[c.imsp_candidate_id].industries = industries;
        })
      );

      // Grab top contributores, put them onto the candidate object
      detailsDeferreds.push(
        CandidatesAPI.top_contributors({
          imsp_candidate_id: c.imsp_candidate_id
        })
        .done(function(top_contributors) {
          fullCandidates[c.imsp_candidate_id].top_contributors = top_contributors;
        })
      );
    });

    // wait for all the industries and contributors to be retrieved, then fullCandidates models are ready.
    $.when.apply(this, detailsDeferreds)
    .done(function() {

      fullCandidates = _.sortBy(fullCandidates, function(c) {
        return -c.candidateMeta.total_dollars;
      });
      _.values(fullCandidates).forEach(function(fc) {
        console.log(fc.candidateMeta.candidate_name, fc);
      });


      // ADDITIONAL MODEL CALCULATIONS
      // -----------
      fullCandidates.forEach(function(candidateModel) {

        var candidate = candidateModel.candidateMeta;

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

        candidateModel.contributorTypeBreakdownSorted = contributorTypeBreakdownSorted;


        // Aggregate industries by sector
        var sectorContrsByIndustry = {};
        candidateModel.industries.forEach(function(indRecord) {
          // Make some sectors more friendly
          if (indRecord.sector_name === 'Uncoded') {
            indRecord.sector_name = 'Uncoded Contributions';
          }
          if (indRecord.industry_name === 'Uncoded') {
            indRecord.industry_name = 'Uncoded Contributions';
          }

          var sector = sectorContrsByIndustry[indRecord.sector_name];
          if (!sector) {
            sector = sectorContrsByIndustry[indRecord.sector_name] = {
              sector_name: indRecord.sector_name,
              sector_dollars: 0,
              industries_index: {}
            };
          }

          sector.sector_dollars += indRecord.total_dollars;

          if (!sector.industries_index[indRecord.industry_name]) {
            sector.industries_index[indRecord.industry_name] = {
              industry_name: indRecord.industry_name,
              industry_dollars: indRecord.total_dollars
            };
          } else {
            sector.industries_index[indRecord.industry_name].industry_dollars += indRecord.total_dollars;
          }
        });

        var topSectors = _(sectorContrsByIndustry).values().sortBy(function(s) {return -s.sector_dollars;}).valueOf();
        var cumulativeContributionPct = 0;
        topSectors.forEach(function(s) {
          s.sector_contribution_pct = s.sector_dollars / candidate.total_dollars;
          s.cumulative_contribution_pct = cumulativeContributionPct += s.sector_contribution_pct;

          s.top_industries = _(s.industries_index).values().sortBy(function(i) {return -i.industry_dollars; }).valueOf();
        });

        if (!topSectors.length) {
          candidateModel.sectors = {}; // no funds raised.  Leave sectors schema empty.
        } else {
          // Get all the sectors that contribute to the top 50% of contributions
          var top50PctContributions = [topSectors[0]],
              from50to75PctContributions = [];
          for (var i=1; i<topSectors.length; i++) {
            if (topSectors[i].cumulative_contribution_pct < .50)
              top50PctContributions.push(topSectors[i]);
            else if (topSectors[i].cumulative_contribution_pct < .75)
              from50to75PctContributions.push(topSectors[i]);
            else
              break;
          }

          // Add the next top sector to the 50-75% list if there's nothing there but the top50% doesn't go into the 75% range
          if (!from50to75PctContributions.length &&
              top50PctContributions[top50PctContributions.length - 1].cumulative_contribution_pct < .75) {
            from50to75PctContributions.push(topSectors[top50PctContributions.length]);
          }
        }

        candidateModel.sectors = {
          topSectors: topSectors,
          top50PctContributions: top50PctContributions,
          from50to75PctContributions: from50to75PctContributions
        };

      });


      // USE MODELS TO MAKE CANDIDATE STORY VIEWS
      // ------------
      var $curRow;
      _.values(fullCandidates).forEach(function(fc, i) {
        if (i % 3 === 0) {
          $('#candidateBios').append($(
            "<div >" +
            "  <div class='col-md-12 bio-divider'>" +
            "    <i class='fa fa-star'></i> " +
            "    <i class='fa fa-flag'></i> " +
            "    <i class='fa fa-star'></i> " +
            "    <i class='fa fa-flag'></i> " +
            "    <i class='fa fa-star'></i> " +
            "  </div>" +
            "</div>"
          ));
          $curRow = $('<div></div>').addClass('row');
          $('#candidateBios').append($curRow);
        }

        $curRow.append(
          (new CandidateView({
            candidateModel: fc
          })).$el
        );
      });


      console.log('');
      console.log('Helpful variables to check out in your console:');

      window.fullCandidates = _.values(fullCandidates);
      console.log('  fullCandidates: list of candidates objects.  .candidateMeta is full metadata, ' +
                  '.industries is top industries, .top_contributors is top contributors');
    });


  });

  var statesSelect = $('select#stateSelection');
  for (key in states) {
    var option = document.createElement('option');
    option.value = key;

    option.appendChild(document.createTextNode(states[key]));
    statesSelect.append(option);
  }

  var currentYear = new Date().getFullYear();
  var minYear = 1998;

  var yearSelect = $('select#yearSelection');
  for (currentYear; currentYear >= minYear; currentYear--) {
    var option = document.createElement('option');
    option.value = currentYear;

    option.appendChild(document.createTextNode(currentYear));
    yearSelect.append(option);
  }

  var offices = [
    'GOVERNOR',
    'ASSEMBLY',
    'CONTROLLER',
    'SECRETARY_OF STATE',
    'INSURANCE_COMMISSIONER',
    'SENATE',
    'LIEUTENANT_GOVERNOR',
    'TREASURER',
    'ATTORNEY_GENERAL'
  ];

  var officeSelect = $('select#officeSelection');
  for (var i = 0, len = offices.length; i < len; i++) {
      var office = offices[i];
      var option = document.createElement('option');
      option.value = office;

      option.appendChild(document.createTextNode(office.replace("_", " ")));
      officeSelect.append(option);
  }
});
