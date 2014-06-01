
define([
  'jquery', 'underscore',
  'views/statesMap',
  'models/ContributionsService',
  'views/ToggleController'],
function(
  $, _,
  statesMap,
  ContributionsService,
  ToggleController) {

  window.statesMap = statesMap;

  window.ContributionsService = ContributionsService;


});
