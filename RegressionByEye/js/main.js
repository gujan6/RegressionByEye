//There are twenty images per graph folder

//Global variables
var globalSequence = 0;
var maxSequenceLength = 10;

//This function returns an array with a sequence of ten numbers
function getTenImages(){
  var imageNrArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let start = Math.floor(Math.random() * 10) + 1;
  for(let i = 0; i < 10; i++){
    imageNrArray[i] = start;
    start++;
  }
  console.log(imageNrArray);
  return imageNrArray
}

//Shows images in the passed folder and changes the image based on the slider position
function changeImage(folder){
  let numberArray = getTenImages();
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
