const outputCells = [
  "diagonal_up",
  "row1",
  "row2",
  "row3",
  "row4",
  "row5",
  "col1",
  "col2",
  "col3",
  "col4",
  "col5",
  "diagonal_down",
  "P_any",
];

// TODO: use CSS class instead
const numericInputCells = [
  "B1", "I1", "N1", "G1", "O1",
  "B2", "I2", "N2", "G2", "O2",
  "B3", "I3", "N3", "G3", "O3",
  "B4", "I4", "N4", "G4", "O4",
  "B5", "I5", "N5", "G5", "O5",
];
// TODO: use CSS class instead
const textInputCells = [
  "B1text", "I1text", "N1text", "G1text", "O1text",
  "B2text", "I2text", "N2text", "G2text", "O2text",
  "B3text", "I3text", "N3text", "G3text", "O3text",
  "B4text", "I4text", "N4text", "G4text", "O4text",
  "B5text", "I5text", "N5text", "G5text", "O5text",
];

function saveStatetoURL() {
  var allIDs = textInputCells.concat(numericInputCells);
  var cellState = {};
  for (var i = 0; i < allIDs.length; i++) {
    var ID = allIDs[i];
    var elem = document.getElementById(ID);
    if (elem == null) {
      console.log("Error: Could not get ID: '" + ID + "'");
    } else {
      cellState[ID] = elem.value;
    }
  }
  var payload = {
    "cellState": cellState
  }
  var payloadStr = JSON.stringify(payload);
  window.location.hash = '#' + encodeURIComponent(payloadStr);
}

function changeTextInputCell(evt) {
  saveStatetoURL();
}

function changeNumericInputCell(evt) {
  saveStatetoURL();
  recalculate();
}
function shiftForward() {
  const mapForward = {
    "B1" : "O5",
    "I1" : "B1",
    "N1" : "I1",
    "G1" : "N1",
    "O1" : "G1",
    "B2" : "O1",
    "I2" : "B2",
    "N2" : "I2",
    "G2" : "N2",
    "O2" : "G2",
    "B3" : "O2",
    "I3" : "B3",
    "G3" : "I3", // Skip free space
    "O3" : "G3",
    "B4" : "O3",
    "I4" : "B4",
    "N4" : "I4",
    "G4" : "N4",
    "O4" : "G4",
    "B5" : "O4",
    "I5" : "B5",
    "N5" : "I5",
    "G5" : "N5",
    "O5" : "G5",
    "B1text" : "O5text",
    "I1text" : "B1text",
    "N1text" : "I1text",
    "G1text" : "N1text",
    "O1text" : "G1text",
    "B2text" : "O1text",
    "I2text" : "B2text",
    "N2text" : "I2text",
    "G2text" : "N2text",
    "O2text" : "G2text",
    "B3text" : "O2text",
    "I3text" : "B3text",
    "G3text" : "I3text", // Skip free space
    "O3text" : "G3text",
    "B4text" : "O3text",
    "I4text" : "B4text",
    "N4text" : "I4text",
    "G4text" : "N4text",
    "O4text" : "G4text",
    "B5text" : "O4text",
    "I5text" : "B5text",
    "N5text" : "I5text",
    "G5text" : "N5text",
    "O5text" : "G5text",
  }
  var allIDs = textInputCells.concat(numericInputCells);
  var cellState = {};
  for (var i = 0; i < allIDs.length; i++) {
    var ID = allIDs[i];
    var elem = document.getElementById(ID);
    if (elem == null) {
      console.log("Error: Could not get ID: '" + ID + "'");
    } else {
      cellState[ID] = elem.value;
    }
  }
  for (key in mapForward) {
    if (mapForward.hasOwnProperty(key)) {
      elem = document.getElementById(key);
      if (elem == null) {
        console.log("Error: Could not get ID: " + key);
      } else {
        var mappedId = mapForward[key];
        var newValue = cellState[mappedId]
        elem.value = newValue;
      }
    }
  }
  saveStatetoURL();
  recalculate();
}

function shiftBackward() {
  const mapBackward = {
    "B1" : "I1",
    "I1" : "N1",
    "N1" : "G1",
    "G1" : "O1",
    "O1" : "B2",
    "B2" : "I2",
    "I2" : "N2",
    "N2" : "G2",
    "G2" : "O2",
    "O2" : "B3",
    "B3" : "I3",
    "I3" : "G3", // Skip free space
    "G3" : "O3",
    "O3" : "B4",
    "B4" : "I4",
    "I4" : "N4",
    "N4" : "G4",
    "G4" : "O4",
    "O4" : "B5",
    "B5" : "I5",
    "I5" : "N5",
    "N5" : "G5",
    "G5" : "O5",
    "O5" : "B1", // Back to beginning
    "B1text" : "I1text",
    "I1text" : "N1text",
    "N1text" : "G1text",
    "G1text" : "O1text",
    "O1text" : "B2text",
    "B2text" : "I2text",
    "I2text" : "N2text",
    "N2text" : "G2text",
    "G2text" : "O2text",
    "O2text" : "B3text",
    "B3text" : "I3text",
    "I3text" : "G3text", // Skip free space
    "G3text" : "O3text",
    "O3text" : "B4text",
    "B4text" : "I4text",
    "I4text" : "N4text",
    "N4text" : "G4text",
    "G4text" : "O4text",
    "O4text" : "B5text",
    "B5text" : "I5text",
    "I5text" : "N5text",
    "N5text" : "G5text",
    "G5text" : "O5text",
    "O5text" : "B1text", // Back to beginning
  }
  var allIDs = textInputCells.concat(numericInputCells);
  var cellState = {};
  for (var i = 0; i < allIDs.length; i++) {
    var ID = allIDs[i];
    var elem = document.getElementById(ID);
    if (elem == null) {
      console.log("Error: Could not get ID: '" + ID + "'");
    } else {
      cellState[ID] = elem.value;
    }
  }
  for (key in mapBackward) {
    if (mapBackward.hasOwnProperty(key)) {
      elem = document.getElementById(key);
      if (elem == null) {
        console.log("Error: Could not get ID: " + key);
      } else {
        var mappedId = mapBackward[key];
        var newValue = cellState[mappedId]
        elem.value = newValue;
      }
    }
  }
  saveStatetoURL();
  recalculate();
}

function shuffleCells() {
  var allIDs = textInputCells.concat(numericInputCells);
  var cellState = {};
  for (var i = 0; i < allIDs.length; i++) {
    var ID = allIDs[i];
    var elem = document.getElementById(ID);
    if (elem == null) {
      console.log("Error: Could not get ID: '" + ID + "'");
    } else {
      cellState[ID] = elem.value;
    }
  }
  // Source - https://stackoverflow.com/a/12646864
  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  let original = [
    "B1", "I1", "N1", "G1", "O1",
    "B2", "I2", "N2", "G2", "O2",
    "B3", "I3", "G3", "O3", // Omit free space N3
    "B4", "I4", "N4", "G4", "O4",
    "B5", "I5", "N5", "G5", "O5",
  ];
  var shuffled = original.slice();
  shuffleArray(shuffled);
  for (var i = 0; i < original.length; i++) {
    // Numeric cell
    var numCellId = original[i];
    var numElem1 = document.getElementById(numCellId);
    if (numElem1 == null) {
      console.log("Error: Could not get ID: '" + numCellId + "'");
    } else {
      var numId2 = shuffled[i];
      var numElem2 = document.getElementById(numId2);
      if (numElem2 == null) {
        console.log("Error: Could not get ID: '" + numId2 + "'");
      } else {
        numElem1.value = cellState[numId2];
      }
    }
    // Text cell
    textCellId = numCellId + "text";
    var textElem1 = document.getElementById(textCellId);
    if (textElem1 == null) {
      console.log("Error: Could not get ID: '" + textCellId + "'");
    } else {
      var textId2 = shuffled[i] + "text";
      var textElem2 = document.getElementById(textId2);
      if (numElem2 == null) {
        console.log("Error: Could not get ID: '" + textId2 + "'");
      } else {
        textElem1.value = cellState[textId2];
      }
    }
  }
  saveStatetoURL();
  recalculate();
}

function exportJSON(evt) {
  console.log("save");
  var elementsToSave = document.getElementsByClassName("save-state")
  var checklistState = {};
  for (elem of elementsToSave) {
    if (elem.type == "textarea") {
      checklistState[elem.id] = elem.value;
    } else if (elem.type == "number") {
      checklistState[elem.id] = elem.value;
    } else {
      console.warn("for id '" + elem.id + "', type not implemented: '" + elem.type + "'");
    }
  }
  var filename = 'bingo_card.json';
  var jsonBlob = new Blob([JSON.stringify(checklistState)], {
      type: 'application/json',
      name: filename
  });
  var tmpAnchor = document.createElement("a");
  tmpAnchor.href = URL.createObjectURL(jsonBlob);
  tmpAnchor.download = filename;
  tmpAnchor.click();
  // No need to delete tmpAnchor manually, it will be automatically garbage-collected.
  return;
}

function importFile(evt) {
  console.log("processFile");
  var jsonString = evt.target.result;
  var desiredStates = JSON.parse(jsonString);
  var elementsToLoad = document.getElementsByClassName("load-state")
  for (elem of elementsToLoad) {
    var newState = desiredStates[elem.id];
    if (elem.type === "textarea") {
      elem.value = newState;
    } else if (elem.type === "number") {
      elem.value = newState;
    } else {
      console.warn("for id '" + elem.id + "', type not implemented: '" + elem.type + "'");
    }
  }
}
function readFile(evt) {
  console.log("readFile");
  var fileList = evt.target.files;
  var currentFile = fileList[0];
  console.log(currentFile.name)
  var reader = new FileReader();
  reader.onload = importFile;
  reader.readAsText(currentFile);
  return;
}

function registerEventHandlers() {
  // Numeric input cells
  for (var i = 0; i < numericInputCells.length; i++) {
    var elementID = numericInputCells[i];
    var element = document.getElementById(elementID);
    if (element == null) {
      console.log("Error: Could not get ID: " + elementID);
    } else {
      element.onkeyup = changeNumericInputCell;
      element.onchange = recalculate;
    }
  }
  // Text input cells
  for (var i = 0; i < textInputCells.length; i++) {
    var elementID = textInputCells[i];
    var element = document.getElementById(elementID);
    if (element == null) {
      console.log("Error: Could not get ID: " + elementID);
    } else {
      element.onkeyup = changeTextInputCell;
    }
  }
  // Rounding checkbox.
  roundElem = document.getElementById('rounding_on');
  roundElem.addEventListener('change', recalculate);
  // Significant figures input.
  sigFigElem = document.getElementById('significant_figures');
  sigFigElem.addEventListener('change', recalculate);
  // Shift forward button
  shift_forward = document.getElementById("shift_forward");
  shift_forward.addEventListener("click", shiftForward);
  // Shift backward button
  shift_backward = document.getElementById("shift_backward");
  shift_backward.addEventListener("click", shiftBackward);
  // Shuffle button
  shuffle_button = document.getElementById("shuffle_cells");
  shuffle_button.addEventListener("click", shuffleCells);

  // Save to JSON.
  var exportButton = document.getElementById("export_json");
  exportButton.addEventListener('click', exportJSON);
  // Save from JSON.
  var importButton = document.getElementById("import_json");
  importButton.addEventListener('change', readFile);

}

function formatNum(number) {
  var nSigFig = document.getElementById('significant_figures').value;
  if (Math.abs(number) > 1e-4 && Math.abs(number) < 1e4) {
    var rounded = number.toPrecision(nSigFig);
  } else {
    var rounded = number.toExponential(nSigFig - 1);
  }
  return rounded;
}

function loadStateFromURLFragment() {
  var fragmentWithPoundSign = window.location.hash;
  var fragment = fragmentWithPoundSign.substring(1);
  if (fragment === '') {
    // Nothing in fragment to load.
    return;
  }
  var payloadStr = decodeURIComponent(fragment);
  var payload = JSON.parse(payloadStr);
  var cellState = payload["cellState"];
  for (key in cellState) {
    if (cellState.hasOwnProperty(key)) {
      elem = document.getElementById(key);
      if (elem == null) {
        console.log("Error: Could not get ID: " + key);
      } else {
        elem.value = cellState[key];
      }
    }
  }
}

function recalculate() {
  var P = {};
  const nInputCells = numericInputCells.length;
  for (var i = 0; i < nInputCells; i++) {
    var elementID = numericInputCells[i];
    var element = document.getElementById(elementID);
    if (element == null) {
      console.log("Error: Could not get ID: " + elementID);
    } else {
      P[elementID] = element.value/100;
    }
  }
  var P_out = {
    "row1" : P.B1 * P.I1 * P.N1 * P.G1 * P.O1,
    "row2" : P.B2 * P.I2 * P.N2 * P.G2 * P.O2,
    "row3" : P.B3 * P.I3 * P.N3 * P.G3 * P.O3,
    "row4" : P.B4 * P.I4 * P.N4 * P.G4 * P.O4,
    "row5" : P.B5 * P.I5 * P.N5 * P.G5 * P.O5,
    "col1" : P.B1 * P.B2 * P.B3 * P.B4 * P.B5,
    "col2" : P.I1 * P.I2 * P.I3 * P.I4 * P.I5,
    "col3" : P.N1 * P.N2 * P.N3 * P.N4 * P.N5,
    "col4" : P.G1 * P.G2 * P.G3 * P.G4 * P.G5,
    "col5" : P.O1 * P.O2 * P.O3 * P.O4 * P.O5,
    "diagonal_up"   : P.B5 * P.I4 * P.N3 * P.G2 * P.O1,
    "diagonal_down" : P.B1 * P.I2 * P.N3 * P.G4 * P.O5,
  };
  const bingoOptions = [
    "row1", "row2", "row3", "row4", "row5",
    "col1", "col2", "col3", "col4", "col5",
    "diagonal_up", "diagonal_down"
  ]
  var P_none = 1.0
  const nOptions = bingoOptions.length;
  for (var i = 0; i < nOptions; i++) {
    var this_option = bingoOptions[i];
    var this_P = P_out[this_option];
    P_none *= 1 - this_P
  }
  var P_any = 1.0 - P_none
  P_out["P_any"] = P_any

  var rounding_on = document.getElementById('rounding_on').checked;
  var nOutputCells = outputCells.length;
  for (var i = 0; i < nOutputCells ; i++) {
    var elementID = outputCells[i];
    var element = document.getElementById(elementID);
    if (element == null) {
      console.log("Error: Could not get ID: " + elementID);
    } else {
      if (P_out[elementID] != null) {
        var this_P = P_out[elementID]
        var rawPercent = 100*this_P
        if (rounding_on === true) {
          element.value = formatNum(rawPercent);
        } else {
          element.value = rawPercent;
        }
      }
    }
  }
}

function initialize() {
  loadStateFromURLFragment();
  registerEventHandlers();
  recalculate();
}

window.onload = initialize;
