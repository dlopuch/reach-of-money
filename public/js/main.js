define(['jquery', 'lodash', 'xml2json', 'ftm/CandidatesAPI', 'speechGenerators/BasicGenerator'],
function($, _, xml2json, CandidatesAPI, BasicGenerator) {
  // set some globals
  window.FTM_API_KEY = '496398adcf0ab6761dc2af1987c58fd2';
  window.xml2json = xml2json;

  window.CandidatesAPI = CandidatesAPI;
  window.BasicGenerator = BasicGenerator;

  // examples
  CandidatesAPI.list({
    state: 'CA',
    year: 2010,
    office: 'ASSEMBLY',
    district: '010'
  })
  .done(function(candidates) {
    console.log("Got candidates for 2010 CA Assembly 010:");

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

    // wait for all the industries to be retrieved, then fullCandidates is ready.
    $.when.apply(this, detailsDeferreds)
    .done(function() {
      _.values(fullCandidates).forEach(function(fc) {
        console.log(fc.candidateMeta.candidate_name, fc);

        BasicGenerator(fc.candidateMeta, fc.top_contributors, fc.industries);
      });

      console.log('');
      console.log('Helpful variables to check out in your console:');

      window.fullCandidates = fullCandidates;
      console.log('  fullCandidates: list of candidates objects.  .candidateMeta is full metadata, ' +
                  '.industries is top industries, .top_contributors is top contributors');
    });


  });
});
