//There are twenty images per graph folder

//Global variables
var globalSequence = 0;
var maxSequenceLength = 10;
var numberArray = Array(50).fill(0);

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
  var defaultImageNumber = numberArray[0];
  var slider = document.getElementById("myRange");
  var output = document.getElementById("sliderValue");
  output.innerHTML = slider.value;
  //Get first image, based on the first number in the array
  document.getElementById("img").src = folder + defaultImageNumber + ".png";
  slider.oninput = function() {
    output.innerHTML = this.value;
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
    

    globalSequence++; //increments the global sequence by 1, so that the next question is displayed.
    changeImage(globalSequence);
  }
}

//Returns the selected participant from the dropdown
function getParticipant(){
  var e = document.getElementById("participantSelection");
  var participantNumberString = e.options[e.selectedIndex].value;
  switch (participantNumberString) {
    case "P1":
      return 1;
    case "P2":
      return 2;
    case "P3":
      return 3;
    case "P4":
      return 4;
  }
}

function getExperimentSequence(participantNumber){
  //Code for the sequence
  //Should pick make a list of filepaths which contain the images
  let folderArray;
  switch (participantNumber){
    case 1:
      return folderArray = ["img/", "img/scatter/XXXX"];
    case 2:
      return folderArray = ["img/", "img/scatter/XXXX"];
  }

}

function startExperiment(){
  var participantNumber = getParticipant();
  var folderArray = getExperimentSequence(participantNumber);
  changeImage(folderArray[0]);
}
