import { Game2048 } from "./Game2048.js";

const game = new Game2048();

const start = document.querySelector(".start");
const fieldHtml = document.querySelectorAll(".field-row");
const gameScore = document.querySelector(".game-score");
const startMessage = document.querySelector(".message-start");
const loseMessage = document.querySelector(".hidden");
const winner = document.querySelector(".message-win");

const size = game.size;
let score = game.score;

let gameField = game.gameField;

function addLayoutOnHtml() {
  for (let row = 0; row < size; row++) {
    for (let cell = 0; cell < size; cell++) {
      if (gameField[row][cell] === 2048) {
        winner.classList.remove("hidden");
      }

      const setFieldHtml = fieldHtml[row].children[cell];
      const currentValue = (setFieldHtml.textContent =
        gameField[row][cell] || "");

      setFieldHtml.className = currentValue
        ? `field-cell field-cell--${currentValue}`
        : "field-cell";
    }
  }

  gameScore.innerText = score;
}

function addRandomNumber() {
  const row = Math.floor(Math.random() * size);
  const cell = Math.floor(Math.random() * size);

  if (gameField[row][cell] === 0) {
    gameField[row][cell] = Math.random() < 0.1 ? 4 : 2;
  } else {
    addRandomNumber();
  }
}

function checkGameOver() {
  let hasMoveRL = false;
  let hasMoveUD = false;
  let comeIn = false;

  const result = gameField.every((r) => gameField.every((_, i) => r[i] > 0));

  if (result) {
    comeIn = true;

    for (let row = 0; row < 4; row++) {
      const eachRow = gameField[row];

      for (let cell = 0; cell < 4; cell++) {
        if (eachRow[cell] === eachRow[cell + 1]) {
          hasMoveRL = true;
        }
      }
    }

    gameField = transpose(gameField);

    for (let row = 0; row < 4; row++) {
      const eachRow = gameField[row];

      for (let cell = 0; cell < 4; cell++) {
        if (eachRow[cell] === eachRow[cell + 1]) {
          hasMoveUD = true;
        }
      }
    }
  }

  if (!hasMoveRL && !hasMoveUD && comeIn) {
    loseMessage.classList.remove("hidden");
  }
}

function transpose(arr) {
  return arr.map((_, index) => arr.map((row) => row[index]));
}

function uniteCells(row) {
  let moved = false;

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row.splice(i + 1, 1);
      score += row[i];
      moved = true;
    } else if (row[i] === 0 && row[i + 1] === 0) {
      moved = false;
    }
  }

  while (row.length < size) {
    row.push(0);
  }

  return {
    row,
    moved,
  };
}

function clickArrowLeft() {
  let hasMoved = false;

  for (let row = 0; row < size; row++) {
    const copyGameField = [...gameField[row]];
    const removeZero = game.removeZeros(gameField[row]);
    const move = uniteCells(removeZero);

    gameField[row] = removeZero;

    if (
      move.moved ||
      JSON.stringify(copyGameField) !== JSON.stringify(move.row)
    ) {
      hasMoved = true;
    }
  }

  if (hasMoved) {
    addRandomNumber();
    checkGameOver();
  }

  addLayoutOnHtml();
}

function clickArrowRight() {
  let hasMoved = false;

  for (let row = 0; row < size; row++) {
    const copyOfGameField = [...gameField[row]];
    const removeZero = game.removeZeros(gameField[row].reverse());
    const newRow = uniteCells(removeZero);

    gameField[row] = newRow.row.reverse();

    if (
      newRow.moved ||
      JSON.stringify(copyOfGameField) !== JSON.stringify(newRow.row)
    ) {
      hasMoved = true;
    }
  }

  if (hasMoved) {
    addRandomNumber();
    checkGameOver();
  }
  addLayoutOnHtml();
}

function clickArrowUp() {
  let hasMoved = false;

  gameField = transpose(gameField);

  for (let row = 0; row < size; row++) {
    const copyOfGameField = [...gameField[row]];

    const removeZero = game.removeZeros(gameField[row]);
    const newRow = uniteCells(removeZero);

    gameField[row] = newRow.row;

    if (
      newRow.moved ||
      JSON.stringify(copyOfGameField) !== JSON.stringify(newRow.row)
    ) {
      hasMoved = true;
    }
  }

  gameField = transpose(gameField);

  if (hasMoved) {
    addRandomNumber();
    checkGameOver();
  }

  addLayoutOnHtml();
}

function clickArrowDown() {
  let hasMoved = false;

  gameField = transpose(gameField);

  for (let row = 0; row < size; row++) {
    const copyOfField = [...gameField[row]];
    const removeZero = game.removeZeros(gameField[row].reverse());
    const newRow = uniteCells(removeZero);

    gameField[row] = newRow.row.reverse();

    if (
      newRow.moved ||
      JSON.stringify(copyOfField) !== JSON.stringify(newRow.row)
    ) {
      hasMoved = true;
    }
  }

  gameField = transpose(gameField);

  if (hasMoved) {
    addRandomNumber();
    checkGameOver();
  }
  addLayoutOnHtml();
}

function handleArrows(e) {
  switch (e.key) {
    case "ArrowLeft":
      clickArrowLeft();
      break;
    case "ArrowRight":
      clickArrowRight();
      break;
    case "ArrowUp":
      clickArrowUp();
      break;
    case "ArrowDown":
      clickArrowDown();
      break;
    default:
      break;
  }
}

start.addEventListener("click", () => {
  document.addEventListener("keydown", handleArrows);
  startMessage.hidden = true;

  if (start.innerText === "Start") {
    start.innerText = "Restart";
    start.classList.replace("start", "restart");
  } else {
    loseMessage.classList.add("hidden");

    gameField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }
  addRandomNumber();
  addRandomNumber();
  addLayoutOnHtml();
});
