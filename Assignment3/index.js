const axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
var path = require("path");

global.appRoot = path.resolve(__dirname);
console.log(appRoot);

const csvHead = [
  { id: "id", title: "ID" },
  { id: "title", title: "Title" },
  { id: "category", title: "Category" },
  { id: "url", title: "URL" },
  { id: "no_read", title: "No_Reads" }
];
const masterDestFile = appRoot + "/master.csv";

const masterCsvWriter = createCsvWriter({
  path: masterDestFile,
  header: csvHead,
  append: true
});

var prevData;
let timeLimit = new Date().getTime()+ 10800000 ;
var timeInterval = setInterval(CSVCreator, 1800000);

function CSVCreator() {
  //Api URL
  const URI = "https://login.sportskeeda.com/en/feed?page=1";

  getData(URI, function(results) {
    let data = results.map(result => {
      return {
        id: result["ID"],
        title: result["title"],
        category: result["category"][0],
        url: result["permalink"],
        no_read: result["read_count"]
      };
    });
    //Creating CSV file
    createCSV(data);

    //Creating MasterFile
    if (!prevData) {
      createMasterCSV(data);
    } else {
      //console.log(prevData[0]);
      var masterData = [];
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if (data[i].id != prevData[j].id) {
            masterData.push(data[i]);
            break;
          }
        }
        break;
      }
      console.log(masterData);
      createMasterCSV(masterData);
    }
    prevData = data;
  });

  //Schedule execution for three hours
  let end = new Date().getTime();
  if (timeLimit < end) {
    clearInterval(timeInterval);
  }
}


// Calling Api for Data
function getData(url, callback) {
  axios
    .get("https://login.sportskeeda.com/en/feed?page=1")
    .then(res => {
      //console.log(res.data);
      callback(res.data.cards);
    })
    .catch(err => {
      callback(err);
    });
}
//Create Master CSV
function createMasterCSV(data) {
  masterCsvWriter
    .writeRecords(data) // returns a promise
    .then(() => {
      console.log("...Done");
    });
}

//Creating Time based CSV
function createCSV(data) {
  let date = new Date();
  let fileName =
    "sk_csv" +
    date.getHours() +
    "_" +
    date.getMinutes() +
    "_" +
    date.getDay() +
    "_" +
    date.getMonth() +
    "_" +
    date.getFullYear();

  let desfile = appRoot.toString() + "/" + fileName.toString() + ".csv";
  console.log(desfile);
  const csvWriter = createCsvWriter({
    path: desfile,
    header: csvHead
  });

  csvWriter
    .writeRecords(data) // returns a promise
    .then(() => {
      console.log("...Done");
    });
}
