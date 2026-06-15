if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("js/serviceworker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

//Series of functions crucial to background processing

function prefVote() {
  results_array = [];
  var number_of_candidates = 0;
  preterm_winners = [];
  //for column in raw data table add 1 to num candidates and add a column with cand name to tally table
  fetch(`/get_candidates`)
  //Fetches data from server, parses response body into JSON obj
    .then(res => res.json())
  //Receives parsed obj that can then be used
    .then(data => {
    //Keeping all the cadidates as an array so I don't have to keep calling this fetch
      const candidate_array = data;
      const num_of_candidates = data.length;
      for (i=0; i < num_of_candidates; i++) {
        let temp_cand = data[i];
        fetch(`/add_candidate_column?candname${encodeURIComponent(column_name)}`)
      }
    })
  while (number_of_candidates != 2) {
    fetch(`/sumTotalVotestable`)
    .then(res => res.json())
    .then(data => {
      let total_votes = data[0];
    })
    for (i=1; i < num_of_candidates; i++) {
      let column_name = candidate_array[i];
      fetch(`/number_of_ones?candname${encodeURIComponent(column_name)}`)
      .then(res => res.json())
      .then(data => {
        let votes_for_cand = data[0]
        fetch(`/add_ones_to_tally`)
        total_votes += 1;
      }) 
    }
    let half_votes = total_votes * 0.5;
    fetch(`/sort_tally_desc`)
    .then(res => res.json())
    .then(data => {
      //Access the numerical value of the most voted candidate
      let first_running = data[0].tally;
      let first_name = data[0].candidatename;
    })
    //Check if they got more than half of the votes
    if (first_running >= half_votes) {
      preterm_winners.push(first_name)
      //Deleting the candidate from tables
      fetch(`/delete_from_tally?candname${encodeURIComponent(first_name)}`)
      fetch(`delete_from_raw_data?candname${encodeURIComponent(first_name)}`)
      //Hence decreasing num of candidates 
      number_of_candidates -= 1;
    }
    let tie_gate = [];
    fetch(`/sort_tally_asc`)
    .then(res => res.json())
    .then(data => { 
      let last_value = data[0].candidatename
      //Starting from 1 so it doesn't count the last value
      for (i=1; i < data.length; i++) {
          if (data[i] == last_value) {
            tie_gate.push(data[i].candidatename);
          }
      }
      tie_gate.push(last_value);
    })
    let tie_gate_values = tie_gate.length;
    if (tie_gate_values > 1) {
      let rand_cand = tie_gate[Math.floor(Math.random() * tie_gate.length)];
      let omit_cand = rand_cand
    } else {
      let omit_cand = tie_gate[0];
    }
    fetch(`/get_omit_prefs?omitcand${encodeURIComponent(omit_cand)}`)
    .then (res => res.json())
    .then(data => {
      for (i=0; i < data.length; i++) {
        let next_best = 2;
        let success_second_pref = false
        while (success_second_pref = false) {
          for (i=0; i < data.length; i++) {
            if (data[i] = next_best) {  
              //Adding a tally to the name
              fetch(`/add_ones_to_tally?candname${encodeURIComponent(data[i])}`)
              success_second_pref = true;
            } else {
              next_best += 1
            }
          }
        } 
      }
    })
    results.push(omit_cand);
    fetch(`/delete_from_tally$candname${encodeURIComponent(omit_cand)}`);
    fetch(`/delete_from_raw_data$candname${encodeURIComponent(omit_cand)}`);
    number_of_candidates -= 1
  }
  fetch(`/get_rows`)
  .then (res => res.json())
  .then(data => {
    let remainder_1 = data[0];
    let remainder_2 = data[1];
    if (remainder_1 = remainder_2) {
      fetch("/sort_tally_asc")
      .then (res => res.json())
      .then(data => { 
        results_array.push(data[1]);
        results_array.push(data[0]);
      })
      if (preterm_winners) {
        preterm_winners.reverse()
        for (i=0; i < preterm_winners.length(); i++){
          results_array.push(i);
        }
      }
    } else {
      fetch("/sort_tally_asc")
      .then (res => res.json())
      .then(data => { 
        results_array.push(data[1] + "TIE");
        results_array.push(data[0] + "TIE");
      })
      if (preterm_winners) {
        preterm_winners.reverse()
        for (i=0; i < preterm_winners.length(); i++){
          results_array.push(i);
        }
      }
    }
  })
  results_array.reverse()
  return results_array
}

function majorityVote() {
  tally_table = [];
  results_array = [];
  fetch(`/get_candidates`)
  //Fetches data from server, parses response body into JSON obj
    .then(res => res.json())
  //Receives parsed obj that can then be used
    .then(data => {
    //Keeping all the cadidates as an array so I don't have to keep calling this fetch
      const candidate_array = data;
      const num_of_candidates = data.length;
      for (i=0; i < num_of_candidates; i++) {
        let temp_cand = data[i];
        fetch(`/add_candidate_column?candname${encodeURIComponent(column_name)}`)
      }
      for (i=0; i < num_of_candidates; i++) {
        fetch(`/number_of_ones?candname${encodeURIComponent(data[i])}`)
      }
    })
  fetch(`/sort_tally_desc`)
  .then (res => res.json())
  .then (data => {
    for (i=0; i < data.length; i++) {
      results_array.push(data[i])
    }
  })
  return results_array
}

//Get a string of numbers close to "true random"
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}


//Hashing function, using SHA256
function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

//Three functions do almost the same thing just for different labels
function generateCampaignKey() {
  let campaign_initial_string = getRndInteger(100000000000000000000000, 999999999999999999999999);
  let campaign_string_hash = hash(campaign_initial_string);
  return campaign_string_hash;
}

function generateVoterKey() {
  let voter_initial_string = getRndInteger(100000000000000000000000, 999999999999999999999999);
  let voter_string_hash = hash(campaign_initial_string);
  return voter_string_hash;
}

function generateOrganiserKey() {
  let organiser_initial_string = getRndInteger(100000000000000000000000, 999999999999999999999999);
  return organiser_initial_string;
}

function identifyKey(entered_key) {
  let key_to_verify = entered_key;
  let entered_hash = hash(key_to_verify);
  fetch(`/get_identity?key${encodeURIComponent(entered_hash)}`)
    .then(res => res.json())
    .then(data => {
      const user_type = data.type;
    })
    if (user_type == "organiser") {
      return user_type;
    } else if (user_type == "voter") {
      return user_type;
    } else {
      return "invalid key"
    };
}

function generateEmails(list, rel_campaign) {
  for (i=0; i < list.length; i++) {
      code = generateVoterKey();
      code_hashed = hash(code);

      // send email to email with link and code
      // add code_hashed, type=voter, campaign=rel_campaign to key table

  }
}

function validateEmails(document) {
  let invalid_emails = [];
  let valid_emails = [];


  while (line in document) {
    //email = remove whitespace of line
    //if email matches email regex
    // add email to valid emails
    //else add email to invalid emails
  };


  if (invalid_emails) {
    alert("There is an issue with your emails. No campign has been initiated. Please refer to the troubleshooting page and try again.");
    return false;
  } else {
    return valid_emails
  };
}

function createNewCampaign(name, candidates, voters, type, duration) {
  let campaign_key = generateCampaignKey();
  let camp_page = hash(campaign_key);
  let organiser_key = generateOrganiserKey();
  let organiser_key_hashed = hash(organiser_key);
  // add to key table organiser_key_hashed, type=organiser, campaign=campaign_key
  // add to active_campaigns database name, duration, camp_page=vote page
  //randomise candidate array
  /*
    FOR candidate IN candidate array
      add candidate name to candidate_div
      add candidate_div to vote page
      add campaign_title to vote page
    call generateEmails(voters, campaign_key)
  */
  generateEmails(voters, campaign_key)
  return organiser_key;
}

function validateCampaignInfo(name, cands, email_doc, type) {
  let error_info = "";
  let validity_status = false;
  function verify_status() {
    if (event_name.length < 50 && event_name.length > 3) {
      if (num_of_candidates >= 2) {
        if (validateEmails(email_doc) == true) {
          validity_status = true;
        } else {
            error_info = "Invalid emails";
            validity_status = false;
        };
      } else {
          error_info = "Invalid candidate amount";
          validity_status = false;
      };
    } else {
      error_info = "Invalid title";
      validity_status = false;
    };
  }

  if (validity_status == false) {
    return error_info;
  } else {
    return "clear";
  }
}

function getPageForOrganiser(key) {
  let ref = hash(key);
  /*
    IF campaign(ref)_status == in_progress;
	    clear organiser_page(ref)
		  add waiting_room div
    ELSEIF campaign(ref)_status == finished;
	    clear organiser_page(ref)
		  get campaign(results_array)
			  FOR item IN results_array
				  add name to candidate_div
				  add preference to candidate_div
				  add div to organiser_page(ref)
	  ELSE
		  clear organiser_page
		  show error_div
	  ENDIF

  */
}

function getCampaignForUser(key) {
    let ref = hash(key);
    //let campaign = ref row active_campaign(vote page) cell
    //redirect user to vote page (link/campaign)
}

//General page algorithm

results_array = [];


const submitCampInfo = document.getElementById("create_campaign_submit");

submitCampInfo.addEventListener('click', function() {
  //get event name, cand, emails, type, duration


  let eventName = ""
  let candidates = ""
  let emails = ""
  let type = ""
  let duration = ""
  status = validateCampaignInfo(eventName, candidates, emails, type, duration)
  if (status == "clear") {
    createNewCampaign(eventName, candidates, emails, type, duration)
    //redirect to success page and return organiser code
    //change the.. organiser page? to.. waiting room?
  } else {
    alert(status)
  }
});

const codeEnter = document.getElementById("code_enter");

codeEnter.addEventListener('click', function() {
  //get field input
  let code = "";
  let user_check = identifyKey(code);
  if (user_check == "voter") {
    getCampaignForUser();
  } else if (user_check == "organiser") {
    getPageForOrganiser();
  } else {
    alert("Invalid code.");
  }
});

const voteEnter = document.getElementById("vote_submit");

voteEnter.addEventListener('click', function() {
  // for candidate dive add value to candidate in raw results table
  //for (i=0, , i++,) {
  //  a='g';
  //}
  // redirect home
  // display thanks for voting popup
  // delete user key instances in keys table
});


/*
IF campaign(status) == active AND campaign(duration) == 0
IF selected_process of ID column in active_campaigns == "pref"
	determined_results =  pref_vote(campaignID)
	add to campaign(results) determined_results
ELSEIF selected_process of ID column in active_campaigns == "most"
	determined_results = call majority_vote(campaignID)
	add to campaign(results) determined_results
ELSE   raise error "Invalid vote system allocation"
	break
ENDIF
campaign(status) == pending 
campaign(duration) == 48h
ENDIF

IF campaign(status) == pending AND campaign(duration) == 0:
delete all relevant info wipe all data
ENDIF
*/