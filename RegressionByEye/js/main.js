//There are twenty images per graph folder

//This function returns an array with a sequence of ten numbers
function getTenImages(){
  var imageNrArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  let start = Math.floor(Math.random() * 10) + 1;
  for(let i = 0; i < 10; i++){
    imageNrArray[i] = start;
    start++;
  }
  console.log(imageNrArray);
  return imageNrArray
}

//Changes the image based on the slider position
function changeImage(){
  let numberArray = getTenImages();
  var defaultImageNumber = numberArray[0];
  var slider = document.getElementById("myRange");
  var output = document.getElementById("sliderValue");
  output.innerHTML = slider.value;
  //Get first image, based on the first number in the array
  document.getElementById("img").src = "img/" + defaultImageNumber + ".png";
  slider.oninput = function() {
    output.innerHTML = this.value;
    document.getElementById("img").src = "img/"+ numberArray[this.value - 1] + ".png";
  }
}

function submitAnswer(){
  //Writes answer to an array, which can then be converted to csv, and triggers the next image
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
}

function startExperiment(){
  var participantNumber = getParticipant();
  getExperimentSequence(participantNumber);
  changeImage();
}
