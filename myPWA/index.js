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



app.use(express.static(path.join(__dirname, "public")));
app.listen(8000, () =>  {console.log("Server is running on Port 8000, visit http://localhost:8000/ or http://127.0.0.1:8000 to access your website");} );
