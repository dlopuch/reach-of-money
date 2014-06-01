define([
  'jquery',
  'models/ContributionsService'
], function($, ContributionsService) {

  $('.incoming').click(function() {
    console.log('incoming handler for body click, changing mode of ContributionsService');

    ContributionsService.switchToIncomingMode();
    console.log(ContributionsService.switchToIncomingMode);
  });

  $('.outgoing').click(function() {
    console.log('outgoing incoming handler for body click, changing mode of ContributionsService');

    ContributionsService.switchToOutgoingMode();
    console.log(ContributionsService.switchToOutgoingMode);
  });

});
