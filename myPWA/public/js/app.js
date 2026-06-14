if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("js/serviceworker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

//Series of functions crucial to background processing

function prefVote(ID) {
  var tally_table_version = 1;
  results_array = [];
  var number_of_candidates = 0;
  preterm_winners = [];
  //for column in raw data table add 1 to num candidates and add a column with cand name to tally table

  fetch(`/get_candidates?key${encodeURIComponent(ID)}`)
    .then(res => res.json())
    .then(data => {
      const num_of_candidates = data.length;
      for (i=0; i < data.length; i++) {
        let temp_cand = data[i];
        fetch(`/add_candidate_column?tableID${encodeURIComponent(ID)}candname${temp_cand}`)
      }
    })

  while (number_of_candidates != 2) {
    
    //let total_votes = sum 
  }



}

function majorityVote(ID) {
  tally_table = [];
  results_array = [];
  for (var i = 0; i < tally_table.count; i++) {
    if (row == 1) {
      //tally_table(column name) += 1
    }
  }
  //order columns ascending
  // for column in id tally table
      // add column name to results array, return results array
}

//Get a string of numbers close to "true random"
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const { createHash } = require('crypto');
const { type } = require('os');

//Hashing a string through SHA256
function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}


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
  fetch(`/get_identity?key${encodeURIComponent(key_to_verify)}`)
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
  for (i=0, email in list, i++) {
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














//Keeping past work below for reference

/*
//changing popup data to specific item clicked
function appendData(obj_index) {
  fetch(`/devices`)
              .then(res => res.json())
              .then(devices => {
                const device = devices.find(d => d.obj_index === Number(obj_index));
                const {image, device_name, year, brand, type, colour, description} = device;
                //data obtained is added to the relevant popup text fields
                  document.getElementById("rightpopup").innerHTML = `
                    <h2 class="name">${device_name}</h2>
                    <p class="brand">${brand}</p>
                    <p class="year">${year}</p>
                    <p class="type">${type}</p>
                    <p class="colour">${colour}</p>
                    <p class="about">${description}</p>
                  `;
                // image assigned to image div
                  document.getElementById("leftpopup").innerHTML = `
                    <img src="/${image}" alt="Device image">
                  `;
                });
}

const open_buttons = document.getElementsByClassName('object')
for (let btn of open_buttons) {
  //open popup on click
  btn.addEventListener('click', function() {
    //get the id of the clicked button
    popup_func(this.id); 
  }); 
}

// adding object data to popup and revealing it
function popup_func(item_id) {
  appendData(item_id);
  //displays popup
  document.getElementById('popup_win').style.visibility = 'visible'
  // prevent page from scrolling
  document.body.style.overflow = 'hidden';
  //blur body of site
  document.getElementById('blur_body').style.filter = 'blur(5px)' 
}

//close popup
const close_btn = document.getElementById('popup_close');
//on click close popup
close_btn.addEventListener('click', close_popup_func);

function close_popup_func() {
  //hide popup
  document.getElementById('popup_win').style.visibility = 'hidden' 
  // allow scroll again
  document.body.style.overflow = 'visible'; 
  //unblur body
  document.getElementById('blur_body').style.filter = 'blur(0px)' 
}


// need to add appendData() somewhere to append the data changes 
const object_order_default = [1,2,3,4,5,6,7,8,9,10]; //dunno if relevant
const device_objects = document.getElementsByClassName('object');

// function hides all device objects and then unhides as per default array
function reset_objects () {
  for (var i = 0; i < device_objects.length; i++) {
  device_objects[i].style.visibility = "hidden";
  }
  for (var i = 0; i < object_order_default.length; i++) {
    device_objects[i].style.visibility = "visible";
  }
}

// function to sort objects
function sort_by (selected_option) {
  //hide all the objects
  for (var i = 0; i < device_objects.length; i++) {
    device_objects[i].style.display = "none";
  }

  if (selected_option === "alphabetical") {
  // fetch json
    fetch("/sort_alphabet")
    .then(response => response.json ())
    .then(data => {
      // access device object div
      const container = document.querySelector(".device_objects");
      data.forEach((obj) => {
        // move each object to the end of div to sort
        const dev = document.getElementById(obj.obj_index);
        container.appendChild(dev);
        dev.style.display="block";
      });
    })
  // same process for other sorting options
  } else if (selected_option === "reverse") {
    fetch("/sort_rev_alphabet")
    .then(response => response.json ())
    .then(data => {
      const container=document.querySelector(".device_objects");
      data.forEach((obj) => {
        const dev = document.getElementById(obj.obj_index);
        container.appendChild(dev);
        dev.style.display="block";
      });
    })
  } else if (selected_option === "increase") {
    fetch("/sort_year")
    .then(response => response.json ())
    .then(data => {
      const container=document.querySelector(".device_objects");
      data.forEach((obj) => {
        const dev = document.getElementById(obj.obj_index);
        container.appendChild(dev);
        dev.style.display="block";
      });
    })
  } else if (selected_option === "decrease") {
    fetch("/sort_rev_year")
    .then(response => response.json ())
    .then(data => {
      const container=document.querySelector(".device_objects");
      data.forEach((obj) => {
        const dev = document.getElementById(obj.obj_index);
        dev.style.display="block";
        container.appendChild(dev);
      });
    })
  };
}

// Listening for sort button to change 
document.getElementById("sort_popup").addEventListener("change", function() {
  // get the sort type
  const selectedId = this.options[this.selectedIndex].id;
  // call relevant sort
  sort_by(selectedId);
});

*/
