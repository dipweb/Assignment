let APIURI =
  "https://s3-ap-southeast-1.amazonaws.com/takehomeproject/feed.json";
let modifiedData;

getData(APIURI, function(data) {
  console.log(data);
  modifiedData = data.map((sportdata, index) => {
    return { title: sportdata["title"], show: index < 6 ? true : false };
  });

  createHTML(modifiedData);
});

// createHTML function will create HTML element
function createHTML(modifiedData) {
  console.log(modifiedData)
  let element = document.getElementById("Main__Container");
  modifiedData.map((sData, key) => {
    if (sData.show) {
      divElement = document.createElement("div");
      if (
        (key % 3 === 2 && key % 2 == 0) ||
        (key % 3 === 0 && key !== 0 && key % 2 === 1)
      ) {
        divElement.classList.add("Two__X");
      } else {
        divElement.classList.add("One__X");
      }

      if (key > 5) {
        divElement.classList.add("hide");
      }
      paraElement = document.createElement("p");
      node = document.createTextNode(sData.title);
      paraElement.append(node);
      divElement.append(paraElement);
      element.append(divElement);
    }
  });
}

// Calling Api
function getData(URI, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", URI, true);
  xhr.onload = function() {
    //check if the status is 200(means everything is okay)
    if (this.status === 200) {
      //return server response as an object with JSON.parse
      var sportsData = JSON.parse(this.responseText).data.rows;
      // console.log(sportsData);
      callback(sportsData);
    }
  };
  //call send
  xhr.send();
}

// Showing Data onClick More Button

function More() {
  let dataToShow=[];
  let count=0;
  for(let i=0;i<modifiedData.length;i++){
    if(count===6){
      break;
    }
    if(!modifiedData[i].show){
      modifiedData[i].show=true;
      dataToShow.push(modifiedData[i]);
      count++;
    }
  }
 createHTML(dataToShow);
}
