const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(".database/datasource.db");
const express = require("express");
const path = require("path");
const app = express();


const { createHash } = require('crypto');
const { type } = require('os');

//SQL functions

//Function to return the identity of a code
function getIdentity(key, callback) {
  db.get("SELECT * FROM key_table WHERE code = ?", [key], (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
};

app.get("/get_identity", (req, res) => {
  let key = req.query.key;
  
  getIdentity(key, (rows) => {
    res.json(rows);
  });
});



// Querying to count candidates
function getCandidates(callback) {
  db.all("SELECT candidates FROM raw_data_table", (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
};

app.get("/get_candidates", (req, res) => {
  getCandidates((rows) => {
    res.json(rows);
  });
});



//Adding a column?
function addColumn(candname, callback) {
  db.run("ALTER TABLE tally_table ADD COLUMN ? VARCHAR(50)", [candname])
    if (err) {
          if (err.message.includes("duplicate column name")) {
              console.log("Column already exists.");
          } else {
              console.error("Error adding column:", err.message);
          }
      } else {
          console.log("Column added successfully");
      }
}

app.post("/add_candidate_column", (req, res) => {
  let candname = req.query.candname;
  addColumn(candname)
})



//adding together the overall votes
function sumTotalVotes(callback) {
  db.get("SELECT SUM (votes) FROM tally_table", (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
}

app.get("/sumTotalVotes", (req, res) => {
  sumTotalVotes((rows) => {
    res.json(rows);
  });
});



//Getting the number of first preferences
function getRow(candname, callback) {
  db.get("SELECT COUNT(?) FROM raw_results_table WHERE ? = 1", [candname], (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
}

app.get("/number_of_ones", (req, res) => {
  let candname = req.query.candname;
  getRow(candname, (rows) => {
    res.json(rows);
  });
});


//Adding tallies for candidates
function addToTallyTable(candname, callback) {
  db.run("UPDATE tally_table SET tally = tally + 1 WHERE name = ?", [candname])
}

app.post("/add_ones_to_tally", (req, res) => {
  let candname = req.query.candname;
  addToTallyTable(candname)
})


//Sorting descending
function sortDescending(callback) {
  db.all("SELECT * FROM tally_table ORDER BY tally DESC", (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
}

app.get("/sort_tally_desc", (req, res) => {
  sortDescending((rows) => {
    res.json(rows);
  });
})

//Sorting ascending
function sortAscending(callback) {
  db.all("SELECT * FROM tally_table ORDER BY tally ASC", (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
}

app.get("/sort_tally_asc", (req, res) => {
  sortAscending((rows) => {
    res.json(rows);
  });
})


//Remove row from tally table
function deleteFromTallyTable(candname, callback) {
  db.run("DELETE FROM tally_table WHERE candidatename = ?", [candname])
}

app.post("/delete_from_tally", (req, res) => {
  let candname = req.query.candname;
  deleteFromTallyTable(candname)
})


//Remove row from raw data table
function deleteFromRawData(candname, callback) {
  db.run("DELETE FROM raw_data WHERE candidates = ?", [candname])
}

app.post("/delete_from_raw_data", (req, res) => {
  let candname = req.query.candname;
  deleteFromRawData(candname)
})


//Get rows of omitted candidate
function getOmitPreferences(omitcand, callback) {
  db.get("SELECT * FROM raw_data WHERE candidates = ?", [omitcand], (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
}

app.get("/get_omit_prefs", (req, res) => {
  let omitcand = req.query.omitcand;
  getOmitPreferences(omitcand, (rows) => {
    res.json(rows);
  });
});


//Select all rows for final comparison
function getRows(callback) {
  db.all("SELECT *", (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    };
    callback(rows);
  });
};

app.get("/get_rows", (req, res) => {
  getRows((rows) => {
    res.json(rows);
  });
});


//Inserting key details into table
function insertKeyInfo(code, type, campaign, callback) {
  db.run("INSERT INTO key_table (?, ?, ?)", [code, type, campaign])
}

app.post("/insert_key_info", (req, res) => {
  let code = req.query.code;
  let code_type = req.query.code_type;
  let campaign = req.query.campaign
  insertKeyInfo(code, type, campaign)
});

//Inserting campaign details into table
function insertCampDetails(camp_key, camp_status, duration, selected_process, vote_page, organiser_page, callback) {
  db.run("INSERT INTO active_campaigns (?, ?, ?, ?, ?, ?, ?)", [camp_key, camp_status, duration, selected_process, vote_page, organiser_page])
}

app.post("/insert_campaign_details", (req, res) => {
  let camp_key = req.query.camp_key;
  let camp_status = req.query.status;
  let duration = req.query.duration;
  let selected_process = req.query.selected_process;
  let vote_page = req.query.vote_page;
  let organiser_page = req.query.organiser_page;
  insertCampDetails(code, type, campaign)
});



//Getting status of a campaign
function getCampStatus(camp_key, callback) {
  db.get("SELECT camp_status FROM active_campaigns WHERE camp_key = ?", [camp_key], (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    };
    callback(rows);
  })
}

app.get("/camp_status", (req, res) => {
  let camp_key = req.query.camp_key;
  getCampStatus(camp_key, (rows) => {
    res.json(rows);
  });
})

//Getting the vote page for a campaign
function getVotePage(key, callback) {
  db.run("SELECT vote_page FROM active_campaigns WHERE camp_key = ?", [camp_key], (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    };
    callback(rows);
  })
}

app.get("/camp_vote_page", (req, res) => {
  let camp_key = req.query.camp_key;
  getVotePage(camp_key, (rows) => {
    res.json(rows);
  });
})


//Deleting all user key instances
function deleteUserKeyInstances(user_key, callback) {
  db.run("DELETE FROM key_table WHERE ", [user_key])
}

app.post("/delete_user_instances", (req, res) => {
  let user_key = req.query.user_key;
  deleteUserKeyInstances(user_key)
});

//Deleting all campaign instances from key_table
function deleteCampaignInstances(user_key, callback) {
  db.run("", [user_key])
}

app.post("/delete_campaign_instances", (req, res) => {
  let user_key = req.query.user_key;
  deleteCampaignInstances(user_key)
});


//Deleting all campaign instances from active_campaigns table
function deleteCampaignInstances(user_key, callback) {
  db.run("", [user_key])
}

app.post("/delete_campaign_instances", (req, res) => {
  let user_key = req.query.user_key;
  deleteCampaignInstances(user_key)
});



app.use(express.static(path.join(__dirname, "public")));
app.listen(8000, () =>  {console.log("Server is running on Port 8000, visit http://localhost:8000/ or http://127.0.0.1:8000 to access your website");} );
