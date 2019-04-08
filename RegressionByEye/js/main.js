//There are twenty images per graph folder

//Global variables
var globalSequence = 0;
var maxSequenceLength = 5; //How many charts are shown to the participant (NEEDS TO BE EQUAL OR SMALLER THAN folderArray)
var numberArray = Array(50).fill(0);
var folderArray = Array(50).fill("folder");  //declare an array which will be filled with the folders of the images;
var trendType = ["line", "trig", "quad"];
var chartType = ["area", "line", "scatter"];
var slopeAndBandwithType = ["s0.05m1.0"];


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
  var output = document.getElementById("sliderValue");
  //Get first image, based on the first number in the array
  document.getElementById("img").src = folder + defaultImageNumber + ".png";
  slider.oninput = function() {
    document.getElementById("img").src = folder + numberArray[this.value - 1] + ".png";
  }
}

function submitAnswer(){
  //Writes answer to an array, which can then be converted to csv, and triggers the next image
  if(globalSequence + 1 === maxSequenceLength){
    //Create CSV
  }
  else {
    var slider = document.getElementById("myRange");
    let selectedImageNr = numberArray[slider.value - 1];
    console.log(selectedImageNr); //Prints the image number (out of the total 100 images
    var error = calculateError(selectedImageNr);

    globalSequence++; //increments the global sequence by 1, so that the next question is displayed.
    changeImage(folderArray[globalSequence]);
  }
}

function calculateError(imageNumber){
  var error = 0;
  if(imageNumber < 50){
    error = 50 - imageNumber;
  }
  else if (imageNumber > 50){
    error =  imageNumber - 50;
  }
  return error;
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
  for(let i = 0; i < 50; i++){
    var filepath = "img/";
    var randomNumber1 = Math.floor(Math.random()*trendType.length);
    let trend = trendType[randomNumber1];
    var randomNumber2 = Math.floor(Math.random()*chartType.length);
    let chart = chartType[randomNumber2];
    var randomNumber3 = Math.floor(Math.random()*slopeAndBandwithType.length);
    let slopeAndBandwith = trendType[randomNumber3];

    filepath = filepath + trend + "/" + chart + "/" + slopeAndBandwith + "/";
    folderArray[i] = filepath;
  }
  return folderArray;
}

function startExperiment(){
  var participantNumber = getParticipant();
  getExperimentSequence();
  changeImage(folderArray[globalSequence]);
}

