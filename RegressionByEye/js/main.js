//There are twenty images per graph folder

//Global variables
var globalSequence = 0;
var maxSequenceLength = 4; //How many charts are shown to the participant (NEEDS TO BE EQUAL OR SMALLER THAN folderArray)
var numberArray = Array(60).fill(0);
var folderArray = Array(maxSequenceLength).fill("folder");  //declare an array which will be filled with the folders of the images;
var data= Array(maxSequenceLength).fill("");
var experiment;


//This function returns an array with a sequence of ten numbers
function getImages(){
  let imageNrArray = Array(100).fill(0);
  let start = Math.floor(Math.random() * 40) + 1;
  for(let i = 0; i < 60; i++){
    imageNrArray[i] = start;
    start++;
  }
  //console.log(imageNrArray);
  return imageNrArray
}


//Shows images in the passed folder and changes the image based on the slider position
function changeImage(folder){
  numberArray = getImages();
  let slider = document.getElementById("myRange");
  let defaultImageNumber = numberArray[slider.value - 1];
  //Get first image, based on the first number in the array
  document.getElementById("img").src = folder + defaultImageNumber + ".png";
  slider.oninput = function() {
    document.getElementById("img").src = folder + numberArray[this.value - 1] + ".png";
  }
}


function submitAnswer(){
  let slider = document.getElementById("myRange");
  let selectedImageNr = numberArray[slider.value - 1];
  console.log(selectedImageNr); //Prints the image number (out of the total 100 images
  let error = calculateError(selectedImageNr);
  //Writes answer to an array, which can then be converted to csv, and triggers the next image
  if(globalSequence + 1 === maxSequenceLength){
    data[globalSequence][5] = error; //error
    data[globalSequence][6] = Math.abs(error); //unsigned error
    data[globalSequence][7] = globalSequence; //index
    //Create CSV
    download_csv(data);
    //Hide the submit button, when the user is done
    document.getElementById('submitButton').style.visibility = 'hidden';
    document.getElementById('myRange').style.visibility = 'hidden';
    document.getElementById("img").src = "img/finish.png";
  }
  else {
    data[globalSequence][5] = error;
    data[globalSequence][6] = Math.abs(error);
    data[globalSequence][7] = globalSequence;
    globalSequence++; //increments the global sequence by 1, so that the next question is displayed.
    changeImage(folderArray[globalSequence]);
  }
}


function download_csv(data) {
  let csv = 'Sigma, Type, M, Participant, Graph Type, Error, Error (unsigned), Index, Filepath, isValidation\n';
  data.forEach(function(row) {
    csv += row.join(',');
    csv += "\n";
  });


  console.log(csv);
  let hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = getParticipant() + '.csv';
  hiddenElement.click();
}


function calculateError(imageNumber){
  return (imageNumber - 50) * 0.01; //each image has a 0.01 difference, so we can multiply the amount of images the are off by times 0.01
}


//Returns the selected participant from the dropdown
function getParticipant(){
  let e = document.getElementById("participantSelection");
  return e.options[e.selectedIndex].value;
}


function getExperimentSequence(participant){
  //Code for the sequence
  console.debug("get exp sequence for", participant);
  var participantArray = experiment.get(participant);
  console.debug(participantArray);
  //Should pick make a list of filepaths which contain the images
  for(let i = 0; i < maxSequenceLength; i++){
    var filepath = participantArray[i].imgs;
    folderArray[i] = filepath;
    data[i][0] = participantArray[i].sigma;
    data[i][1] = participantArray[i].type;
    data[i][2] = participantArray[i].m;
    data[i][3] = participant;
    data[i][4] = participantArray[i].graphtype;
    data[i][8] = filepath;
    data[i][9] = participantArray[i].validation;
  }
  return folderArray;
}


function startExperiment(){
  let valuesTemp;
  if (getParticipant() === "Demo") { //if demo then set length to 4
    maxSequenceLength = 4;
  } else { //if regular experiment, set sequence length the the length of the imported csv
    valuesTemp = experiment.values();
    valuesTemp.next().value;
    maxSequenceLength = valuesTemp.next().value.length; //take length of csv plus 4 (for the validation plots)
    console.log(maxSequenceLength);
  }
  for(let i = 0; i < maxSequenceLength; i++){
    data[i] = Array(10).fill(""); //Initializes the empty answer arrays
  }
  getExperimentSequence(getParticipant());
  changeImage(folderArray[globalSequence]);
  document.getElementById('setup').style.visibility = 'hidden'; //Hide Setup when experiment starts
  document.getElementById('mainArea').style.visibility = 'visible';
}


// Reader for a Touchstone2 experiment csv export file.
// - CSV File Handling is based on https://github.com/evanplaice/jquery-csv/blob/master/examples/file-handling.html
const kvSlopes = [
  ['n_0_8', -0.8],
  ['n_0_4', -0.4],
  ['n_0_2', -0.2],
  ['n_0_1', -0.1],
  ['p_0_1', 0.1],
  ['p_0_2', 0.2],
  ['p_0_4', 0.4],
  ['p_0_8', 0.8],
];
const slopes = new Map(kvSlopes);
const kvBandwiths = [
  ['b_0_05', 0.05],
  ['b_0_1', 0.1],
  ['b_0_15', 0.15],
  ['b_0_2', 0.2]
];
const bandwiths = new Map(kvBandwiths);


function isFileAPIAvailable() {
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    return true;
  } else {
    // source: File API availability - http://caniuse.com/#feat=fileapi
    // source: <output> availability - http://html5doctor.com/the-output-element/
    document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
    // 6.0 File API & 13.0 <output>
    document.writeln(' - Google Chrome: 13.0 or later<br />');
    // 3.6 File API & 6.0 <output>
    document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
    // 10.0 File API & 10.0 <output>
    document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
    // ? File API & 5.1 <output>
    document.writeln(' - Safari: Not supported<br />');
    // ? File API & 9.2 <output>
    document.writeln(' - Opera: Not supported');
    return false;
  }
}


function mapSlopeDescription(desc) {
  console.debug("map", desc, slopes.get(desc));
  return slopes.get(desc);
}


function mapBandwidthDescription(desc) {
  console.debug("map", desc, bandwiths.get(desc));
  return bandwiths.get(desc);
}


function handleDialog(event) {
  let files = event.target.files;
  let file = files[0];
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function (event) {
    let csv = event.target.result;
    let data = $.csv.toArrays(csv);
    handleTouchstoneCSVData(data);
  }
}


function extractFieldPositions(header) {
  let fields = {
    "participantId": { "label": "ParticipantID" },
    "trialId": { "label": "TrialID" },
    "blockSeq": { "label": "Block1" },
    "graphtype": { "label": "c" },
    "m": { "label": "m" },
    "sigma": { "label": "s" },
    "type": { "label": "f" },
  };
  for (let c = 0; c < header.length; c++) {
    let column = header[c];
    switch (column) {
      case fields.participantId.label:
        console.debug(fields.participantId.label, "at pos", c);
        fields.participantId.pos = c;
        break;
      case fields.trialId.label:
        console.debug(fields.trialId.label, "at pos", c);
        fields.trialId.pos = c;
        break;
      case fields.blockSeq.label:
        console.debug(fields.blockSeq.label, "at pos", c);
        fields.blockSeq.pos = c;
        break;
      case fields.graphtype.label:
        console.debug(fields.graphtype.label, "at pos", c);
        fields.graphtype.pos = c;
        break;
      case fields.m.label:
        console.debug(fields.m.label, "at pos", c);
        fields.m.pos = c;
        break;
      case fields.sigma.label:
        console.debug(fields.sigma.label, "at pos", c);
        fields.sigma.pos = c;
        break;
      case fields.type.label:
        console.debug(fields.type.label, "at pos", c);
        fields.type.pos = c;
        break;
      default:
        console.debug("Ignore column", column, "at pos", c);
    }
  }
  console.debug(fields);
  return fields;
}


function handleTouchstoneCSVData(data) {
  const fields = extractFieldPositions(data[0]);
  let trialsByParticipants = new Map();
  for (let i = 1; i < data.length; i++) {
    let trialDef = extractFieldsFromRecord(fields, data[i]);
    let participantId = trialDef.participantId;
    if (!trialsByParticipants.has(participantId)) {
      console.debug("New participant id", participantId);
      trialsByParticipants.set(participantId, [])
    }
    trialsByParticipants.get(participantId).push(trialDef);
  }
  console.info("Parsed experiment trials by participants:");
  console.info(trialsByParticipants);
  for(let part of trialsByParticipants){
    experiment.set(part[0], part[1]);
    $('#participantSelection').append('<option value="'+part[0]+'">'+part[0]+'</option>');
  }
}


function extractFieldsFromRecord(fields, record) {
  let chart = record[fields.graphtype.pos];
  let slope = mapSlopeDescription(record[fields.m.pos]);
  let bandwidth = mapBandwidthDescription(record[fields.sigma.pos]);
  let func = record[fields.type.pos];
  let nonValidation = 0;
  let trialDefinition = {
    "participantId": "P" + record[fields.participantId.pos],
    "trialId": record[fields.trialId.pos],
    "blockSeq": record[fields.blockSeq.pos],
    "graphtype": chart,
    "sigma": bandwidth,
    "m": slope,
    "type": func,
    "imgs": "img/" + func + "/" + chart + "/s" + bandwidth + "m" + slope + "/",
    "validation": nonValidation
  };
  console.debug(trialDefinition);
  return trialDefinition;
}


function buildDemoSequence(){
  return [
    {
      "participantId": "Demo",
      "trialId": "10001",
      "blockSeq": "1",
      "graphtype": "line",
      "sigma": 0.05,
      "m": 0.4,
      "type": "trig",
      "imgs": "img/trig/line/s0.05m0.4/"
    },
    {
      "participantId": "Demo",
      "trialId": "10002",
      "blockSeq": "2",
      "graphtype": "area",
      "sigma": 0.15,
      "m": -0.1,
      "type": "quad",
      "imgs": "img/quad/area/s0.15m-0.1/"
    },
    {
      "participantId": "Demo",
      "trialId": "10003",
      "blockSeq": "3",
      "graphtype": "scatter",
      "sigma": 0.2,
      "m": 0.8,
      "type": "line",
      "imgs": "img/line/scatter/s0.2m0.8/"
    },
    {
      "participantId": "Demo",
      "trialId": "10004",
      "blockSeq": "4",
      "graphtype": "area",
      "sigma": 0.15,
      "m": -0.2,
      "type": "line",
      "imgs": "img/line/area/s0.15m-0.2/"
    },
  ]
}


$(document).ready(function () {
  console.debug("doc ready.");
  experiment = new Map();
  experiment.set("Demo", buildDemoSequence());
  console.debug(experiment);
  if (isFileAPIAvailable()) {
    $('#files').bind('change', handleDialog);
  }
});
