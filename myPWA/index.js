const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(".database/datasource.db");
const express = require("express");
const path = require("path");
const app = express();


//SQL functions

// Querying to get all objects
function getDevices(callback) {
  db.all("SELECT * FROM site_objects;", (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
};

// Querying to get sorted objects
// alphabetical
function sortAlphabet(callback) {
  db.all("SELECT * FROM site_objects ORDER BY LOWER(device_name) COLLATE NOCASE ASC;", (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
};

// reverse alphabetical
function sortRevAlphabet(callback) {
  db.all("SELECT * FROM site_objects ORDER BY LOWER(device_name) COLLATE NOCASE DESC;", (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
};

// ascending year
function sortYear(callback) {
  db.all("SELECT * FROM site_objects ORDER BY year;", (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
};

// descending year
function sortRevYear(callback) {
  db.all("SELECT * FROM site_objects ORDER BY year DESC;", (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }
    callback(rows);
  })
};


// Retrieving JSON from query functions
// Get sorted objects

app.get("/sort_alphabet", (req, res) => {
  sortAlphabet((rows) => {
    res.json(rows);
  });
});

app.get("/sort_rev_alphabet", (req, res) => {
  sortRevAlphabet((rows) => {
    res.json(rows);
  });
});

app.get("/sort_year", (req, res) => {
  sortYear((rows) => {
    res.json(rows);
  });
});

app.get("/sort_rev_year", (req, res) => {
  sortRevYear((rows) => {
    res.json(rows);
  });
});

// Get all objects
app.get("/devices", (req, res) => {
  getDevices((rows) => {
    res.json(rows);
  });
});



app.use(express.static(path.join(__dirname, "public")));
app.listen(8000, () =>  {console.log("Server is running on Port 8000, visit http://localhost:8000/ or http://127.0.0.1:8000 to access your website");} );
