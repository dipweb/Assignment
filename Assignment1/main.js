var sportsData;

let xhr = new XMLHttpRequest();
xhr.open(
  "GET",
  "https://s3-ap-southeast-1.amazonaws.com/takehomeproject/feed.json",
  true
);
xhr.onload = function() {
  //check if the status is 200(means everything is okay)
  if (this.status === 200) {
    //return server response as an object with JSON.parse
    sportsData = JSON.parse(this.responseText).data.rows;

    console.log(sportsData);
    var divElement;
    var node;
    var paraElement;

    var element = document.getElementById("Main__Container");
    sportsData.map((sportData, key) => {
      divElement = document.createElement("div");
      if (
        (key % 3 === 2 && key % 2 == 0) ||
        (key % 3 === 0 && key !== 0 && key % 2 === 1)
      ) {
        divElement.classList.add("Two__X");
      }else{
        divElement.classList.add("One__X");
      }
      paraElement = document.createElement("p");
      node = document.createTextNode(sportData.title);
      paraElement.append(node);
      divElement.append(paraElement);
      element.append(divElement);
    });
  }
};
//call send
xhr.send();
