// CSV File Handling is based on https://github.com/evanplaice/jquery-csv/blob/master/examples/file-handling.html 

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
  var kvArray = [
    ['n_0_8', -0.8], 
    ['n_0_4', -0.4],
    ['n_0_2', -0.2],
    ['n_0_1', -0.1],
    ['p_0_1', 0.1],
    ['p_0_2', 0.2],
    ['p_0_4', 0.4],
    ['p_0_8', 0.8],
  ];

  var myMap = new Map(kvArray);

  console.log("map",desc, myMap.get(desc));
  return myMap.get(desc);

}

function mapBandwithDescription(desc) {
  var kvArray = [
    ['b_0_05', 0.05], 
    ['b_0_1', 0.1],
    ['b_0_15', 0.15],
    ['b_0_2', 0.2]
  ];

  var myMap = new Map(kvArray);

  console.log("map",desc, myMap.get(desc));
  return myMap.get(desc);

}

function handleDialog(event) {
  var files = event.target.files;
  var file = files[0];

  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function (event) {
    var csv = event.target.result;
    var data = $.csv.toArrays(csv);
    console.log(data);

    console.log("ParticipantID:", data[1][1]);
    console.log("TrialID:", data[1][2]);
    console.log("BlockSequence:", data[1][3]);
    console.log("C-Charttype:", data[1][4]);
    console.log("M-Slope:", mapSlopeDescription(data[1][5]));
    console.log("S-Bandwith:", mapBandwithDescription(data[1][6]));
    console.log("F-Function:", data[1][7]);

  }
}

$(document).ready(function () {
  if (isFileAPIAvailable()) {
    $('#files').bind('change', handleDialog);
  }
});
