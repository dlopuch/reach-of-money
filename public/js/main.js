define([
  'jquery', 'underscore',
  'xml2json',
  'ftm/CandidatesAPI',
  'views/CandidateLoader',
  'states'],
function(
  $, _,
  xml2json,
  CandidatesAPI,
  CandidateLoader,
  states) {
  // set some globals
  window.FTM_API_KEY = '4ed5bac2a60606b2e254a958317e1af3';
  window.xml2json = xml2json;

  window.CandidatesAPI = CandidatesAPI;

  // examples
  CandidateLoader()
  .done(function(candidatesList) {
    console.log("Done loading candidates.  Check window.candidatesList");
    window.candidatesList = candidatesList;
  })
  .fail(function(error) {
    console.log("Error loading candidates", error);
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
