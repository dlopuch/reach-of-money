define([], function() {
  return function(myName, topContributors, topIndustries) {

  office = "Governor"

  salutations = ["Dear friends,", "Dear constituent,", "Hello friend,"]
  salutation = salutations[Math.floor(Math.random()*salutations.length)]

  requests = ["If you vote for me,", "If you put your trust in me,"]
  request = requests[Math.floor(Math.random()*requests.length)]

  biggests = ["is my biggest campaign contributor",
	      "gave more money to my campaign than anyone else"]
  biggest = biggests[Math.floor(Math.random()*biggests.length)]

  fightings = ["be fighting hard for", "doing whatever I can to please",
	       "giving 100% of my effort for"]
  fighting = fightings[Math.floor(Math.random()*fightings.length)]

  thanks = ["Thank you for helping me serve special interests to the best of my abilities!",
	    "Thank you, and if you'd like me to support your interests, please make sure to make major donations to my next campaign!",
	    "Thank you, both for you vote, and for taking part in 'sponsored democracy!"]
  thank = thanks[Math.floor(Math.random()*thanks.length)]

  return salutation + " my name is " + myName + ", and I am running for " +
	  office + ". " + request + " you can be sure that my top priority " +
	  "will be the best interests of " + topContributors[0] + 
	  ", which " + biggest + ". Of course, I will also " + fighting +
	  " " + topContributors[1] + ", which is my second biggest source of campaign cash. " +
	  thank;
  };
});
