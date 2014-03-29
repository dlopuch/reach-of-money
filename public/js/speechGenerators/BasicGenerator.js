define([], function() {
  return function(myName, topContributors, topIndustries) {
    return "Hello World, my name is " + myName + "." +
      " My top contributors are: " + topContributors.join(', ') +
      " and my top industries are: " + topIndustries.join(', ');
  };
});
