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
}

function extractFieldsFromRecord(fields, record) {
  var chart = record[fields.graphtype.pos];
  var slope = mapSlopeDescription(record[fields.m.pos]);
  var bandwith = mapBandwithDescription(record[fields.sigma.pos]);
  var func = record[fields.type.pos];

  var trialDefinition = {
    "participantId": "P" + record[fields.participantId.pos],
    "trailId": record[fields.trialId.pos],
    "blockSeq": record[fields.blockSeq.pos],
    "graphtype": chart,
    "sigma": bandwith,
    "m": slope,
    "type": func,
    "imgs": func + "/" + chart + "/s" + bandwith + "m" + slope
  }

  console.debug(trialDefinition);
  return trialDefinition;
}

$(document).ready(function () {
  if (isFileAPIAvailable()) {
    $('#files').bind('change', handleDialog);
  }
});

