let model;
let imageFilePaths = [];
let imageMap = {};

async function init() {
  const modelURL = "./model/model.json";
  const metadataURL = "./model/metadata.json";

  model = await tmImage.load(modelURL, metadataURL); //loading the predefined model to our model
}

//Load filepaths from the json files

function loadFiles() {
  return fetch("../json/file.json")
    .then((response) => response.json())
    .then((images) => {
      return images;
    });
}

//Create elements for containing images and their corresponding predictions

function addDomElements(images) {
  for (let i = 0; i < images.length; i++) {
    let row = document.createElement("div");
    row.setAttribute("class", "row");

    let img = document.createElement("img");
    img.setAttribute("id", "image-" + i);
    img.setAttribute("src", "unsorted/" + images[i]);

    let predictions = document.createElement("div");
    predictions.setAttribute("id", "prediction-" + i);

    row.appendChild(img);
    row.appendChild(predictions);

    document.getElementById("main").appendChild(row);
  }
}

//predict function
async function predict(num) {
  let img = document.getElementById("image-" + num);
  let predictions = document.getElementById("prediction-" + num);

  const prediction = await model.predict(img);

  const CONFIDENCE_SCORE = 0.7; //set probability lease limit

  let dir = "other"; //initialise dir

  for (let i = 0; i < prediction.length; i++) {
    let predictionText =
      prediction[i].className + ":" + prediction[i].probability.toFixed(6);

    predictions.appendChild(document.createElement("div"));
    predictions.childNodes[i].innerHTML = predictionText; //display the predicted text

    if (prediction[i].probability > CONFIDENCE_SCORE) {
      dir = prediction[i].className.toLowerCase();
    }
  }
  imageMap[imageFilePaths[num]] = dir; //map the files to the dir
  console.log(predictions);
}

//prediction functions
function getPredictions() {
  for (let i = 0; i < imageFilePaths.length; i++) {
    predict(i);
  }
  document.getElementById("download-data-button").style.display = "block";
  document.getElementById("get-predictions-button").style.display = "none";
}

function downloadData() {
  //to download JSON data

  let dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(imageMap));
  let dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "sorted.json");
  dlAnchorElem.click();
}

//THE Main thread

init().then(() => {
  document.getElementById("loading-message").style.display = "none";
  loadFiles().then((images) => {
    imageFilePaths = images;
    addDomElements(images);
    document.getElementById("get-predictions-button").style.display = "block";
  });
});
