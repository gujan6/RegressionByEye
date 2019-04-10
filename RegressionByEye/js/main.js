//There are twenty images per graph folder

//Global variables
var globalSequence = 0;
var maxSequenceLength = 5; //How many charts are shown to the participant (NEEDS TO BE EQUAL OR SMALLER THAN folderArray)
var numberArray = Array(60).fill(0);
var folderArray = Array(maxSequenceLength).fill("folder");  //declare an array which will be filled with the folders of the images;
var trendType = ["line", "trig", "quad"];
var chartType = ["area", "line", "scatter"];
var slopeAndBandwidthType = ["s0.05m-0.1", "s0.05m-0.2", "s0.05m-0.4", "s0.05m-0.8", "s0.05m0.1", "s0.05m0.2", "s0.05m0.4", "s0.05m0.8", "s0.1m-0.1", "s0.1m-0.2", "s0.1m-0.4", "s0.1m-0.8", "s0.1m0.1", "s0.1m0.2", "s0.1m0.4", "s0.1m0.8", "s0.15m-0.1", "s0.15m-0.2", "s0.15m-0.4", "s0.15m-0.8", "s0.15m0.1", "s0.15m0.2", "s0.15m0.4", "s0.15m0.8", "s0.2m-0.1", "s0.2m-0.2", "s0.2m-0.4", "s0.2m-0.8", "s0.2m0.1", "s0.2m0.2", "s0.2m0.4", "s0.2m0.8"];
var data= Array(maxSequenceLength).fill("");
var experiment;


//This function returns an array with a sequence of ten numbers
function getTenImages(){
  var imageNrArray = Array(100).fill(0);
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
    data[globalSequence][5] = error; //error
    data[globalSequence][6] = Math.abs(error); //unsigned error
    data[globalSequence][7] = globalSequence; //index
    //Create CSV
    download_csv(data);
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
  var csv = 'Sigma, Type, M, Participant, Graph Type, Error, Error (unsigned), Index, Filepath\n';
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
      return "P1";
    case "P2":
      return "P2";
    case "P3":
      return "P3";
    case "P4":
      return "P4";
  }
}

function getExperimentSequence(participant){
  //Code for the sequence

  let participantArray = experiment.get(participant);

  //Should pick make a list of filepaths which contain the images
  for(let i = 0; i < maxSequenceLength; i++){
    let trend = participantArray[i].type;
    let chart = participantArray[i].graphtype;
    let filepath = participantArray[i].imgs;
    folderArray[i] = filepath;

    data[i][0] = participantArray[i].sigma;
    data[i][1] = trend;
    data[i][2] = participantArray[i].m;
    data[i][3] = participant;
    data[i][4] = chart;
    data[i][8] = filepath;
  }
  return folderArray;
}

function startExperiment(){
  for(let i = 0; i < maxSequenceLength; i++){
    data[i] = Array(9).fill(""); //Initializes the empty answer arrays
  }
  getExperimentSequence(getParticipant());
  changeImage(folderArray[globalSequence]);
}

//
// Reader for a Touchstone2 experiment csv export file.
// - CSV File Handling is based on https://github.com/evanplaice/jquery-csv/blob/master/examples/file-handling.html
//

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

function mapBandwithDescription(desc) {
  console.debug("map", desc, bandwiths.get(desc));
  return bandwiths.get(desc);
}

function handleDialog(event) {
  var files = event.target.files;
  var file = files[0];

  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function (event) {
    var csv = event.target.result;
    var data = $.csv.toArrays(csv);
    handleTouchstoneCSVData(data);
  }
}


function extractFieldPositions(header) {
  var fields = {
    "participantId": { "label": "ParticipantID" },
    "trialId": { "label": "TrialID" },
    "blockSeq": { "label": "Block1" },
    "graphtype": { "label": "c" },
    "m": { "label": "m" },
    "sigma": { "label": "s" },
    "type": { "label": "f" },
  };

  for (c = 0; c < header.length; c++) {
    var column = header[c];
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

  var trialsByParticipants = new Map();

  for (i = 1; i < data.length; i++) {
    var trialDef = extractFieldsFromRecord(fields, data[i]);
    var participantId = trialDef.participantId;

    if (!trialsByParticipants.has(participantId)) {
      console.debug("New participant id", participantId);
      trialsByParticipants.set(participantId, [])
    }

    trialsByParticipants.get(participantId).push(trialDef);
  }

  console.info("Parsed experiment trials by participants:")
  console.info(trialsByParticipants);

  experiment = trialsByParticipants;
}

function extractFieldsFromRecord(fields, record) {
  var chart = record[fields.graphtype.pos];
  var slope = mapSlopeDescription(record[fields.m.pos]);
  var bandwith = mapBandwithDescription(record[fields.sigma.pos]);
  var func = record[fields.type.pos];

  var trialDefinition = {
    "participantId": "P" + record[fields.participantId.pos],
    "trialId": record[fields.trialId.pos],
    "blockSeq": record[fields.blockSeq.pos],
    "graphtype": chart,
    "sigma": bandwith,
    "m": slope,
    "type": func,
    "imgs": "img/" + func + "/" + chart + "/s" + bandwith + "m" + slope + "/"
  }

  console.debug(trialDefinition);
  return trialDefinition;
}

$(document).ready(function () {
  if (isFileAPIAvailable()) {
    $('#files').bind('change', handleDialog);
  }
});
