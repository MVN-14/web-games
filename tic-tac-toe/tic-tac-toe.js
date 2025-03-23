let currentPlayer = 'X';


const message = document.getElementById("message");
updateMessage(`Player ${currentPlayer}'s turn`);

const restartButton = document.getElementById("restart");
restartButton.addEventListener("click", () => {
  Array.from(cells).forEach(cell => {
    cell.innerHTML = '';
    cell.dataset.filled = false;
  })
  currentPlayer = 'X';
  updateMessage(`Player ${currentPlayer}'s turn`);
})

const cells = document.getElementsByClassName("cell");
Array.from(cells).forEach(onCellClicked);

function getPossibleWinningCellValues() {
  return [
    //vertical rows
    [cells[0].innerHTML, cells[1].innerHTML, cells[2].innerHTML],
    [cells[3].innerHTML, cells[4].innerHTML, cells[5].innerHTML],
    [cells[6].innerHTML, cells[7].innerHTML, cells[8].innerHTML],
    //horizontal rows
    [cells[0].innerHTML, cells[3].innerHTML, cells[6].innerHTML],
    [cells[1].innerHTML, cells[4].innerHTML, cells[7].innerHTML],
    [cells[2].innerHTML, cells[5].innerHTML, cells[8].innerHTML],
    //diagonals
    [cells[0].innerHTML, cells[4].innerHTML, cells[8].innerHTML],
    [cells[2].innerHTML, cells[4].innerHTML, cells[6].innerHTML],
  ];
}

function updateMessage(text) {
  message.innerHTML = text;
}

function togglePlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
}

function newTurn() {
  if (!checkWinner()) {
    togglePlayer();
    updateMessage(`Player ${currentPlayer}'s turn`);
  }
}

function onCellClicked(cell, index) {
  cell.addEventListener("click", () => {
    if (cell.dataset.filled === "true") return;

    cell.innerHTML = currentPlayer;
    cell.dataset.filled = true;
    newTurn();
  })
}

function checkWinner() {
  const cellValues = getPossibleWinningCellValues();
  let hasWinner = false;
  cellValues.forEach(values => {
    if (values.every(v => v === 'X')) {
      updateMessage("X is the winner!");
      hasWinner = true;
      return;
    } else if (values.every(v => v === 'O')) {
      updateMessage("O is the winner!");
      hasWinner = true;
      return;
    }
  })
  return hasWinner;
}
