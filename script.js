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
const numericInputCells = [
  "B1", "I1", "N1", "G1", "O1",
  "B2", "I2", "N2", "G2", "O2",
  "B3", "I3", "N3", "G3", "O3",
  "B4", "I4", "N4", "G4", "O4",
  "B5", "I5", "N5", "G5", "O5",
];
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

function changeTextInputCell(event) {
  saveStatetoURL();
}

function changeNumericInputCell(event) {
  saveStatetoURL();
  recalculate();
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
