function getBoardState () {
  const boardState = {};
  const elements = document.getElementsByClassName('save-state');
  for (const elem of elements) {
    if (elem.type === 'textarea') {
      boardState[elem.id] = { value: elem.value };
    } else if (elem.type === 'number') {
      boardState[elem.id] = { value: elem.value };
    } else {
      console.warn("for id '" + elem.id + "', type not implemented: '" + elem.type + "'");
    }
  }
  return boardState;
}

function saveStatetoURL () {
  const boardState = getBoardState();
  const payload = {
    boardState
  };
  const jsonStr = JSON.stringify(payload);
  window.location.hash = '#' + encodeURIComponent(jsonStr);
}
function loadStateFromURLFragment () {
  const fragmentWithPoundSign = window.location.hash;
  const fragment = fragmentWithPoundSign.substring(1);
  if (fragment === '') {
    // Nothing in fragment to load.
    return;
  }
  const jsonStr = decodeURIComponent(fragment);
  const payload = JSON.parse(jsonStr);
  const boardState = payload.boardState;
  for (const key in boardState) {
    if (boardState.hasOwnProperty(key)) {
      const elem = document.getElementById(key);
      if (elem == null) {
        console.error('Error: Could not get ID: ' + key);
      } else {
        elem.value = boardState[key].value;
      }
    }
  }
}

function changeTextInputCell (evt) {
  saveStatetoURL();
}

function changeNumericInputCell (evt) {
  saveStatetoURL();
  recalculate();
}
function shiftForward () {
  const mapForward = {
    B1: 'O5',
    I1: 'B1',
    N1: 'I1',
    G1: 'N1',
    O1: 'G1',
    B2: 'O1',
    I2: 'B2',
    N2: 'I2',
    G2: 'N2',
    O2: 'G2',
    B3: 'O2',
    I3: 'B3',
    G3: 'I3', // Skip free space
    O3: 'G3',
    B4: 'O3',
    I4: 'B4',
    N4: 'I4',
    G4: 'N4',
    O4: 'G4',
    B5: 'O4',
    I5: 'B5',
    N5: 'I5',
    G5: 'N5',
    O5: 'G5'
  };
  const IdSuffixes = ['text', 'num'];
  const boardState = getBoardState();
  for (const key in mapForward) {
    if (mapForward.hasOwnProperty(key)) {
      for (const IdSuffix of IdSuffixes) {
        const Id = key + IdSuffix;
        const elem = document.getElementById(Id);
        if (elem == null) {
          console.error('Error: Could not get ID: ' + Id);
        } else {
          const mappedKey = mapForward[key];
          const mappedId = mappedKey + IdSuffix;
          const newValue = boardState[mappedId].value;
          elem.value = newValue;
        }
      }
    }
  }
  saveStatetoURL();
  recalculate();
}

function shiftBackward () {
  const mapBackward = {
    B1: 'I1',
    I1: 'N1',
    N1: 'G1',
    G1: 'O1',
    O1: 'B2',
    B2: 'I2',
    I2: 'N2',
    N2: 'G2',
    G2: 'O2',
    O2: 'B3',
    B3: 'I3',
    I3: 'G3', // Skip free space
    G3: 'O3',
    O3: 'B4',
    B4: 'I4',
    I4: 'N4',
    N4: 'G4',
    G4: 'O4',
    O4: 'B5',
    B5: 'I5',
    I5: 'N5',
    N5: 'G5',
    G5: 'O5',
    O5: 'B1' // Back to beginning
  };
  const IdSuffixes = ['text', 'num'];
  const boardState = getBoardState();
  for (const key in mapBackward) {
    if (mapBackward.hasOwnProperty(key)) {
      for (const IdSuffix of IdSuffixes) {
        const Id = key + IdSuffix;
        const elem = document.getElementById(Id);
        if (elem == null) {
          console.error('Error: Could not get ID: ' + Id);
        } else {
          const mappedKey = mapBackward[key];
          const mappedId = mappedKey + IdSuffix;
          const newValue = boardState[mappedId].value;
          elem.value = newValue;
        }
      }
    }
  }
  saveStatetoURL();
  recalculate();
}

function shuffleCells () {
  const boardState = getBoardState();
  // Source - https://stackoverflow.com/a/12646864
  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  function shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  const original = [
    'B1', 'I1', 'N1', 'G1', 'O1',
    'B2', 'I2', 'N2', 'G2', 'O2',
    'B3', 'I3', 'G3', 'O3', // Omit free space N3
    'B4', 'I4', 'N4', 'G4', 'O4',
    'B5', 'I5', 'N5', 'G5', 'O5'
  ];
  const shuffled = original.slice();
  shuffleArray(shuffled);
  const IdSuffixes = ['text', 'num'];
  for (let i = 0; i < original.length; i++) {
    for (const IdSuffix of IdSuffixes) {
      const Id1 = original[i] + IdSuffix;
      const Id2 = shuffled[i] + IdSuffix;
      const elem1 = document.getElementById(Id1);
      if (elem1 == null) {
        console.error("Error: Could not get ID: '" + Id1 + "'");
      } else {
        elem1.value = boardState[Id2].value;
      }
    }
  }
  saveStatetoURL();
  recalculate();
}

function exportJSON (evt) {
  const boardState = getBoardState();

  const filename = 'bingo_card.json';
  const jsonBlob = new Blob([JSON.stringify(boardState)], {
    type: 'application/json',
    name: filename
  });
  const tmpAnchor = document.createElement('a');
  tmpAnchor.href = URL.createObjectURL(jsonBlob);
  tmpAnchor.download = filename;
  tmpAnchor.click();
  // No need to delete tmpAnchor manually, it will be automatically garbage-collected.
}

function importFile (evt) {
  const jsonString = evt.target.result;
  const desiredStates = JSON.parse(jsonString);

  for (const key in desiredStates) {
    if (desiredStates.hasOwnProperty(key)) {
      const elem = document.getElementById(key);
      if (elem == null) {
        console.error('Error: Could not get ID: ' + key);
      } else {
        elem.value = desiredStates[key].value;
      }
    }
  }
  saveStatetoURL();
  recalculate();
}
function readFile (evt) {
  const fileList = evt.target.files;
  const currentFile = fileList[0];
  console.log("Reading file: '" + currentFile.name + "'");
  const reader = new FileReader();
  reader.onload = importFile;
  reader.readAsText(currentFile);
}

function registerEventHandlers () {
  // Numeric input cells
  const numberInputElems = document.getElementsByClassName('number-input');
  for (const elem of numberInputElems) {
    elem.onkeyup = changeNumericInputCell;
    elem.onchange = recalculate;
  }
  // Text input cells
  const textInputElems = document.getElementsByClassName('text-input');
  for (const elem of textInputElems) {
    elem.onkeyup = changeTextInputCell;
  }
  // Rounding checkbox.
  const roundElem = document.getElementById('rounding_on');
  roundElem.addEventListener('change', recalculate);
  // Significant figures input.
  const sigFigElem = document.getElementById('significant_figures');
  sigFigElem.addEventListener('change', recalculate);
  // Shift forward button
  const shift_forward = document.getElementById('shift_forward');
  shift_forward.addEventListener('click', shiftForward);
  // Shift backward button
  const shift_backward = document.getElementById('shift_backward');
  shift_backward.addEventListener('click', shiftBackward);
  // Shuffle button
  const shuffle_button = document.getElementById('shuffle_cells');
  shuffle_button.addEventListener('click', shuffleCells);

  // Save to JSON.
  const exportButton = document.getElementById('export_json');
  exportButton.addEventListener('click', exportJSON);
  // Save from JSON.
  const importButton = document.getElementById('import_json');
  importButton.addEventListener('change', readFile);
}

function formatNum (number) {
  const nSigFig = document.getElementById('significant_figures').value;
  if (Math.abs(number) > 1e-4 && Math.abs(number) < 1e4) {
    rounded = number.toPrecision(nSigFig);
  } else {
    rounded = number.toExponential(nSigFig - 1);
  }
  return rounded;
}

function recalculate () {
  const P = {};

  const cells = document.getElementsByClassName('cell');
  for (const elem of cells) {
    const numElem = document.getElementById(elem.id + 'num');
    P[elem.id] = numElem.value / 100;
  }
  const P_out = {
    row1: P.B1 * P.I1 * P.N1 * P.G1 * P.O1,
    row2: P.B2 * P.I2 * P.N2 * P.G2 * P.O2,
    row3: P.B3 * P.I3 * P.N3 * P.G3 * P.O3,
    row4: P.B4 * P.I4 * P.N4 * P.G4 * P.O4,
    row5: P.B5 * P.I5 * P.N5 * P.G5 * P.O5,
    col1: P.B1 * P.B2 * P.B3 * P.B4 * P.B5,
    col2: P.I1 * P.I2 * P.I3 * P.I4 * P.I5,
    col3: P.N1 * P.N2 * P.N3 * P.N4 * P.N5,
    col4: P.G1 * P.G2 * P.G3 * P.G4 * P.G5,
    col5: P.O1 * P.O2 * P.O3 * P.O4 * P.O5,
    diagonal_up: P.B5 * P.I4 * P.N3 * P.G2 * P.O1,
    diagonal_down: P.B1 * P.I2 * P.N3 * P.G4 * P.O5
  };
  const bingoOptions = [
    'row1', 'row2', 'row3', 'row4', 'row5',
    'col1', 'col2', 'col3', 'col4', 'col5',
    'diagonal_up', 'diagonal_down'
  ];
  let P_none = 1.0;
  const nOptions = bingoOptions.length;
  for (let i = 0; i < nOptions; i++) {
    const this_option = bingoOptions[i];
    const this_P = P_out[this_option];
    P_none *= 1 - this_P;
  }
  const P_any = 1.0 - P_none;
  P_out.P_any = P_any;

  const rounding_on = document.getElementById('rounding_on').checked;

  const elements = document.getElementsByClassName('num-output');
  for (const elem of elements) {
    if (P_out[elem.id] != null) {
      const this_P = P_out[elem.id];
      const rawPercent = 100 * this_P;
      if (rounding_on === true) {
        elem.value = formatNum(rawPercent);
      } else {
        elem.value = rawPercent;
      }
    }
  }
}

function initialize () {
  loadStateFromURLFragment();
  registerEventHandlers();
  recalculate();
}

window.onload = initialize;
