define(['jquery', 'xml2json', 'ftm/CandidatesAPI', 'speechGenerators/BasicGenerator'],
function($, xml2json, CandidatesAPI, BasicGenerator) {
  // set some globals
  window.FTM_API_KEY = '496398adcf0ab6761dc2af1987c58fd2';
  window.xml2json = xml2json;

  window.CandidatesAPI = CandidatesAPI;
  window.BasicGenerator = BasicGenerator;
});
