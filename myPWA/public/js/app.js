if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("js/serviceworker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

//Series of functions crucial to background processing

//Function to process votes preferentially and return results
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
    fetch(`/delete_from_tally?candname${encodeURIComponent(omit_cand)}`);
    fetch(`/delete_from_raw_data?candname${encodeURIComponent(omit_cand)}`);
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

//Processing votes based on who gets the most "1" preferences
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
//The random integer would be 24 characters this way 
//Probably not the best way to do this though
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

//Identifies what kind of key is submitted by a user (organiser or voter)
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

//Sending voters their codes to access the campaign
function generateEmails(list, rel_campaign) {
  for (i=0; i < list.length; i++) {
      code = generateVoterKey();
      code_hashed = hash(code);
      //Not actually emailing, unfortunately.
      //'i' would be an email
      //Key gets added though, can be used for demo
      fetch(`/insert_key_info?code${encodeURIComponent(code_hashed)}type${encodeURIComponent("voter")}campaign${encodeURIComponent(rel_campaign)}`)
  }
}

//Separate function to validate the emails provided by an organiser
function validateEmails(document) {
  let invalid_emails = [];
  let valid_emails = [];
  //Separating document into lines assuming new email each line as instructed
  let lines = document.split(/[\r\n]+/g);
  for (i = 0; i < lines.length; i++) {
    //Removing whitespace
    let proper_string = i.replace(/\s+/g, '')
    //Very simple email regex, more complex systems are recommended though
    let email_regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if (proper_string.test(email_regex)) {
      valid_emails.push(proper_string);
    } else {
      invalid_emails.push(proper_string);
    }
  }
//If there is no issue, all valid emails (which should be all of them) are returned to be used
  if (invalid_emails) {
    alert("There is an issue with your emails. No campign has been initiated. Please refer to the troubleshooting page and try again.");
    return false;
  } else {
    return valid_emails
  };
}

//Creation of a new campaign
//Only occurs once program checks if information is valid
//Adds information to tables 
//This information is later fetched and utilised for various purposes
function createNewCampaign(name, candidates, voters, process, type, duration) {
  let campaign_key = generateCampaignKey();
  let camp_page = hash(campaign_key);
  let organiser_key = generateOrganiserKey();
  let organiser_key_hashed = hash(organiser_key);
  fetch(`/insert_key_info?code${encodeURIComponent(organiser_key_hashed)}code_type${encodeURIComponent("organiser")}campaign${encodeURIComponent(campaign_key)}`)
  fetch(`/insert_campaign_details?camp_key${encodeURIComponent(campaign_key)}camp_status${encodeURIComponent("active")}duration${encodeURIComponent(duration)}selected_process${encodeURIComponent(process)}vote_page${encodeURIComponent(camp_page)}`)
  // Source - https://stackoverflow.com/a/46545530
  // Posted by superluminary, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-06-16, License - CC BY-SA 4.0
  //Relatively simple shuffle method just to prevent candidates appearing the same
  //Prevent unserious voters going "1,2,3,4 etc" for everyone 
  let unshuffled_cand_array = candidates
  //randomise candidate array
  let shuffled_cand_array = unshuffled_cand_array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    
  for (i=0; i < shuffled_cand_array.length; i++) {
    //add cand name to candidate div
    //add cand div to vote page
    //add title to vote page
  }
  //Sending out emails (which at the moment is not implemented)
  generateEmails(voters, campaign_key)
  //The organiser key is returned from the func to then be displayed to the organiser
  return organiser_key;
}

//Checks the information an organiser had provided about a campaign
//If there is an issue, the campaign won't be made
//The issue is returned to the organiser
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

//Obtaining the page for an organiser that wants to check in on their campaign
function getPageForOrganiser(key) {
  let ref = hash(key);
  //Obtain the status of the campaign
  fetch(`/camp_status?key${encodeURIComponent(key)}`)
  .then(res => res.json())
  .then(data => {
    if (data == "in_progress") {
      //If campaign is active, it displays a "waiting room" page
    } else if (data == "finished") {
      //If campaign is finished, the page shows results
      fetch //results array
      //for item in array add name to cand dive, add pref, add div to org page
    } else {
      //clear organiser page
      //show error div
    }
  })
}

//Obtaining the page for a user that entered their key
function getCampaignForUser(key) {
    let ref = hash(key);
    //let campaign = ref row active_campaign(vote page) cell
    //redirect user to vote page (link/campaign)
}


//General page algorithm

//Fresh result array
results_array = [];

const submitCampInfo = document.getElementById("create_campaign_submit");

//Listen for when an organiser submits information for a new campaign
submitCampInfo.addEventListener('click', function() {
  let event_name = document.getElementById("campaign_name").textContent;
  let candidates = document.getElementByClass("candidate_name_input");
  //let emails = document
  //Checking the value of the radio button that was selected
  let type = document.querySelector('input[name="votesys"]:checked').value;
  //Value as number returns time in Unix milliseconds allowing for duration calculation
  //The duration is used later on to monitor the status of campaigns
  let duration = document.getElementById("end_date").valueAsNumber;
  status = validateCampaignInfo(event_name, candidates, emails, type, duration)
  if (status == "clear") {
    org_code = createNewCampaign(event_name, candidates, emails, type, duration)
    //redirect organiser to their respective page
    //It will immediately show a "waiting room" page as the campaign would not have ended yet
    window.location.replace("/early_view.html")
    //add popup to the page to show organiser their code
    let organiser_code_popup = document.getElementById("organiser_popup")
    //clear the text in the popup
    organiser_code_popup.textContent = ""
    organiser_code_popup.textContent = "Use this code to access your results: " + org_code
    organiser_code_popup.style.visibility = 'visible'
    //Listen for when the user clicks to close the popup
    let organiser_popup_close = document.getElementById("organiser_popup_close")
    organiser_popup_close.addEventListener('click', function() {
      organiser_code_popup.style.visibility = 'hidden'
    })
  } else {
    alert(status)
  }
});

const codeEnter = document.getElementById("code_enter");

codeEnter.addEventListener('click', function() {
  let code = document.getElementById("code_field").textContent;
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
//Listen for when the vote submit button is clicked
voteEnter.addEventListener('click', function() {
  // for candidate div add value to candidate in raw results table
  //for (i=0, , i++,) {
  //  a='g';
  //}
  //Redirect voter to the "thank you" page
  window.location.replace("/thankyou.html")
  // delete user key instances in keys table
});

//Checking the status of a campaign consistently
function checkStatus() {
  fetch(`/camp_status?camp_key${encodeURIComponent(key)}`)
}
let intervalID = setInterval(checkStatus(), 100);
clearInterval(intervalID);
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