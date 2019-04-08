//There are twenty images per graph folder

//Global variables
var globalSequence = 0;
var maxSequenceLength = 5; //How many charts are shown to the participant (NEEDS TO BE EQUAL OR SMALLER THAN folderArray)
var numberArray = Array(50).fill(0);
var folderArray = Array(maxSequenceLength).fill("folder");  //declare an array which will be filled with the folders of the images;
var trendType = ["line", "trig", "quad"];
var chartType = ["area", "line", "scatter"];
var slopeAndBandwidthType = ["s0.05m-0.1", "s0.05m-0.2", "s0.05m-0.4", "s0.05m-0.8", "s0.05m0.1", "s0.05m0.2", "s0.05m0.4", "s0.05m0.8", "s0.1m-0.1", "s0.1m-0.2", "s0.1m-0.4", "s0.1m-0.8", "s0.1m0.1", "s0.1m0.2", "s0.1m0.4", "s0.1m0.8", "s0.15m-0.1", "s0.15m-0.2", "s0.15m-0.4", "s0.15m-0.8", "s0.15m0.1", "s0.15m0.2", "s0.15m0.4", "s0.15m0.8", "s0.2m-0.1", "s0.2m-0.2", "s0.2m-0.4", "s0.2m-0.8", "s0.2m0.1", "s0.2m0.2", "s0.2m0.4", "s0.2m0.8"];
var data = Array(maxSequenceLength).fill("");


//This function returns an array with a sequence of ten numbers
function getTenImages(){
  var imageNrArray = Array(100).fill(0);
  let start = Math.floor(Math.random() * 50) + 1;
  for(let i = 0; i < 50; i++){
    imageNrArray[i] = start;
    start++;
  }
  //console.log(imageNrArray);
  return imageNrArray
}

//Shows images in the passed folder and changes the image based on the slider position
function changeImage(folder){
  numberArray = getTenImages();
  var slider = document.getElementById("myRange");
  var defaultImageNumber = numberArray[slider.value - 1];
  //Get first image, based on the first number in the array
  document.getElementById("img").src = folder + defaultImageNumber + ".png";
  slider.oninput = function() {
    document.getElementById("img").src = folder + numberArray[this.value - 1] + ".png";
  }
}

function submitAnswer(){
  var slider = document.getElementById("myRange");
  let selectedImageNr = numberArray[slider.value - 1];
  console.log(selectedImageNr); //Prints the image number (out of the total 100 images
  var error = calculateError(selectedImageNr);
  //Writes answer to an array, which can then be converted to csv, and triggers the next image
  if(globalSequence + 1 === maxSequenceLength){
    data[globalSequence][3] = error;
    //Create CSV
    download_csv(data);
  }
  else {
    data[globalSequence][3] = error;
    globalSequence++; //increments the global sequence by 1, so that the next question is displayed.
    changeImage(folderArray[globalSequence]);
  }
}

function download_csv(data) {
  var csv = 'Trend, Chart, Slope, Error(signed)\n';
  data.forEach(function(row) {
    csv += row.join(',');
    csv += "\n";
  });

  console.log(csv);
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = getParticipant() + '.csv';
  hiddenElement.click();
}

function calculateError(imageNumber){
  return error = (imageNumber - 50) * 0.01;
}

//Returns the selected participant from the dropdown
function getParticipant(){
  var e = document.getElementById("participantSelection");
  var participantNumberString = e.options[e.selectedIndex].value;
  switch (participantNumberString) {
    case "P1":
      return "Participant 1";
    case "P2":
      return "Participant 2";
    case "P3":
      return "Participant 3";
    case "P4":
      return "Participant 4";
  }
}

function getExperimentSequence(){
  //Code for the sequence
  //Should pick make a list of filepaths which contain the images
  for(let i = 0; i < maxSequenceLength; i++){
    var filepath = "img/";
    var randomNumber1 = Math.floor(Math.random()*trendType.length);
    let trend = trendType[randomNumber1];
    var randomNumber2 = Math.floor(Math.random()*chartType.length);
    let chart = chartType[randomNumber2];
    var randomNumber3 = Math.floor(Math.random()*slopeAndBandwidthType.length);
    let slopeAndBandwidth = slopeAndBandwidthType[randomNumber3];

    filepath = filepath + trend + "/" + chart + "/" + slopeAndBandwidth + "/";
    folderArray[i] = filepath;

    data[i][0] = trend;
    data[i][1] = chart;
    data[i][2] = slopeAndBandwidth;
  }
  return folderArray;
}

function startExperiment(){
  for(let i = 0; i < maxSequenceLength; i++){
    data[i] = Array(4).fill(""); //Initializes the empty answer arrays
  }
  getExperimentSequence();
  changeImage(folderArray[globalSequence]);
}

