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

    // wait for all the industries to be retrieved, then fullCandidates is ready.
    $.when.apply(this, detailsDeferreds)
    .done(function() {

      fullCandidates = _.sortBy(fullCandidates, function(c) {
        return -c.candidateMeta.total_dollars;
      });
      _.values(fullCandidates).forEach(function(fc) {
        console.log(fc.candidateMeta.candidate_name, fc);
      });

      _.values(fullCandidates).forEach(function(fc) {
        $('#candidateBios').append(
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
