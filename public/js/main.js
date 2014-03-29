define(['jquery', 'xml2json', 'ftm/CandidatesAPI', 'speechGenerators/BasicGenerator'],
function($, xml2json, CandidatesAPI, BasicGenerator) {
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
    window.candidates = candidates;

    var industriesDeferreds = [],
        fullCandidates = [];
    candidates.forEach(function(c) {

      industriesDeferreds.push(
        CandidatesAPI.industries({
          imsp_candidate_id: c.imsp_candidate_id,
          sort: 'total_dollars'
        })
        .done(function(industries) {
          fullCandidates.push({
            candidate: c,
            industries: industries
          });
        })
      );
    });

    // wait for all the industries to be retrieved, then fullCandidates is ready.
    $.when.apply(this, industriesDeferreds)
    .done(function() {
      fullCandidates.forEach(function(fc) {
        console.log(fc.candidate.candidate_name, fc.candidate, fc.industries);

        BasicGenerator(fc.candidate, [], fc.industries);
      });
    });
  });
});
