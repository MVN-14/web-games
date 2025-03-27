const messageElement = document.getElementById("message");

const keyboard = document.querySelector("wg-keyboard");
keyboard.addEventListener("wg-keyboard-key-pressed", handleKeyPress)


const wordList = new WordList();
const correctWord = wordList.getRandomWord();
updateMessage("");

const rowLength = 5;
let currentRow = 1;
let currentCell = 1;
let gameOver = false;

let disabledKeys = [];

function handleKeyPress(e) {
  if (gameOver) {
    return;
  }
  const key = e.detail;
  if (key === "BACKSPACE") {
    if (currentCell === 1) {
      return;
    }
    const cellToClear = document.getElementById(`row-${currentRow}`).children[currentCell - 2];
    cellToClear.querySelector("span").innerHTML = '';
    --currentCell;
  } else if (key === "ENTER") {
    if (currentCell <= rowLength) {
      updateMessage("Not enough letters!");
    } else {
      const guess = getWordFromCurrentRow();
      if (wordList.isValidWord(guess)) {
        testWord(guess);
        ++currentRow;
        currentCell = 1;
      } else {
        updateMessage(`Word '${guess}' not in word list.`);
      }
    }
  } else if (currentCell <= rowLength) {
    const row = document.getElementById(`row-${currentRow}`);
    row.children[currentCell - 1].innerHTML = `<span class="letter">${e.detail}</span>`;
    ++currentCell;
  }
}

function testWord(word) {
  if (correctWord === word) {
    for (let i = 0; i < rowLength; ++i) {
      colorCell(i, "green");
    };
    updateMessage(`You Won in ${currentRow} guesses!`);
    gameOver = true;
  } else {
    for (let i = 0; i < rowLength; ++i) {
      if (correctWord[i] === word[i]) {
        colorCell(i, "green");
      } else if (correctWord.includes(word[i])) {
        colorCell(i, "yellow");
      } else {
        colorCell(i, "gray");
        disabledKeys.push(word[i]);
        keyboard.disabledKeys = disabledKeys;
      }
    }
  }
}

function colorCell(cellIdx, color) {
  const cells = getCurrentRow().children;
  cells[cellIdx].style.background = color;
  if (color === "grey") {
    cells[cellIdx].children[0].style.color = "lightgray";
  }
}

function getWordFromCurrentRow() {
  let word = "";
  const row = getCurrentRow();
  const letters = row.querySelectorAll(".letter");
  Array.from(letters).forEach(letter => {
    word += letter.innerText;
  });
  return word;
}

function getCurrentRow() {
  return document.getElementById(`row-${currentRow}`);
}

function updateMessage(message) {
  messageElement.innerText = message;
}

function clearCurrentRow() {
  const row = getCurrentRow();
  const cells = row.querySelectorAll("span");
  Array.from(cells).forEach(cell => {
    cell.innerHTML = '';
  })
}

