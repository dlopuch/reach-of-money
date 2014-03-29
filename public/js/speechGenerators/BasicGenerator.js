define([], function() {
  function choose(ary) {
     return ary[ Math.floor( Math.random() * ary.length) ]
  }

  return function(candidate, topContributors, topIndustries) {

// Candidate Object
//   candidate_ICO_code: "I"
//   candidate_leadership_committee_dollars: "269487"
//   candidate_money_dollars: "1000"
//   candidate_name: "HUBER, ALYSON L"
//   candidate_status: "Won"
//   district: "010"
//   imsp_candidate_id: "122136"
//   individual_dollars: "16909"
//   institution_dollars: "511371"
//   non_contribution_income_dollars: "20902"
//   office: "ASSEMBLY"
//   party: "DEMOCRAT"
//   party_committee_dollars: "2576819"
//   public_fund_dollars: "0"
//   state_name: "California"
//   state_postal_code: "CA"
//   total_contribution_records: "782"
//   total_dollars: "3402035"
//   total_in_state_dollars: "1656818"
//   total_out_of_state_dollars: "70314"
//   total_unknown_state_dollars: "1674903"
//   unique_candidate_id: "9611"
//   unitemized_donation_dollars: "5548"
//   year: "2010"

// dollars fields:
//   total_dollars: "3402035"

// by type:
//   candidate_leadership_committee_dollars: "269487"
//   candidate_money_dollars: "1000"
//   individual_dollars: "16909"
//   institution_dollars: "511371"
//   non_contribution_income_dollars: "20902"
//   party_committee_dollars: "2576819"
//   public_fund_dollars: "0"
//   unitemized_donation_dollars: "5548"

// by locales:
//   total_in_state_dollars: "1656818"
//   total_out_of_state_dollars: "70314"
//   total_unknown_state_dollars: "1674903"

// TopIndustry Object
//   imsp_industry_code: "132"
//   imsp_sector_code: "15"
//   industry_name: "Party Committees"
//   sector_name: "Party"
//   total_contribution_records: "273"
//   total_dollars: "2576819"

// Object
//   business_name: "Democratic Party committees"
//   contribution_ranking: 1
//   contributor_name: "CALIFORNIA DEMOCRATIC PARTY"
//   percent_of_total_contribution_records: 33.7
//   percent_of_total_total_dollars: 57.1
//   total_contribution_records: 247
//   total_dollars: 1926107

  office = "Governor"
  salutation = choose(["Dear friends,", "Dear constituent,", "Hello friend,"])
  request = choose(["If you vote for me,", "If you put your trust in me,"])
  biggest = choose(["is my biggest campaign contributor",
		    "gave more money to my campaign than anyone else"])
  fighting = choose(["be fighting hard for", "doing whatever I can to please",
		     "giving 100% of my effort for"])
  thank = choose(["Thank you for helping me serve special interests to the best of my abilities!",
	    "Thank you, and if you'd like me to support your interests, please make sure to make major donations to my next campaign!",
	    "Thank you, both for you vote, and for taking part in 'sponsored democracy!"])

  name = candidate.candidate_name.toLowerCase().replace(/\b[a-z]/g, function(letter) { return letter.toUpperCase(); } );

  return salutation + " my name is " + name + ", and I am running for " +
	  office + ". " + request + " you can be sure that my top priority " +
	  "will be the best interests of " + topContributors[0] + 
	  ", which " + biggest + ". Of course, I will also " + fighting +
	  " " + topContributors[1] + ", which is my second biggest source of campaign cash. " +
	  "If any legislation comes before me that benefits the " + 
	  topIndustries[0] + " or " + topIndustries[1] + "industries, I will be sure to vote in favor, " +
	  "since those two industries were the financial pillars of my campaign. " +
	  thank;
  };
});
