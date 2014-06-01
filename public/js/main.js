
define([
  'jquery', 'underscore',
  'views/statesMap',
  'models/ContributionsService'],
function(
  $, _,
  statesMap,
  ContributionsService) {

  window.statesMap = statesMap;

  window.ContributionsService = ContributionsService;


});
