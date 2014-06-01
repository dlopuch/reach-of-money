
define([
  'jquery', 'underscore',
  'views/statesMap',
  'models/promiseOutOfStateContributions'],
function(
  $, _,
  statesMap,
  promiseOutOfStateContributions) {

  window.statesMap = statesMap;

  window.promiseOutOfStateContributions = promiseOutOfStateContributions;
  promiseOutOfStateContributions
  .fail(function(e) {
    console.log('Failed grabbing out of state contributions!', e, e.stack);
  })
  .done(function(outOfStateContributions) {
    console.log('Loaded out of state contributions:', outOfStateContributions);
  });


});
