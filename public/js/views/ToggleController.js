define([
  'jquery',
  'models/ContributionsService'
], function($, ContributionsService) {

  $('body').click(function() {
    console.log('handler for body click, changing mode of ContributionsService');

    if (ContributionsService.isOutgoingMode()) {
      ContributionsService.switchToIncomingMode();
    } else {
      ContributionsService.switchToOutgoingMode();
    }
  });

});
