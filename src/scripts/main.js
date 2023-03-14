"use strict";

const startButton = document.querySelector(".button.start");
const allCells = document.querySelectorAll(".field-cell");
let emptyCells = [...allCells];
const messageStart = document.querySelector(".message.message-start");

const getEmptyCells = () =>
  emptyCells.filter((cell) => cell.classList.length === 1);

startGame();

function startGame() {
  onStart();
}

function onStart() {
  startButton.addEventListener(
    "click",
    () => {
      messageStart.classList.add("hidden");
      setRandomCell();
      setRandomCell();
      onArrowClick();
    },
    { once: true }
  );
}

function setRandomCell() {
  const randomPosition = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomPosition];

  randomCell.innerText = getRandomNumber();
  randomCell.classList.add(`field-cell--${randomCell.innerText}`);

  emptyCells = getEmptyCells();
}

function getRandomNumber() {
  const randomNum = Math.random();

  return randomNum < 0.1 ? 4 : 2;
}

function move(direction) {
  allCells.forEach((cell) => {
    if (cell.classList.length > 1) {
      const previousCellClassName = cell.className;
      const previousCellInnerText = cell.innerText;

      switch (direction) {
        case "top":
          break;

        case "down":
          break;

        case "right":
          let currentCell = cell;
          let nextCell = currentCell.nextElementSibling;

          if (nextCell && nextCell.classList.length === 1) {
            nextCell.className = previousCellClassName;
            nextCell.innerText = previousCellInnerText;

            currentCell.innerText = "";
            currentCell.className = "field-cell";

            currentCell = nextCell;
            nextCell = currentCell.nextElementSibling;

            console.log(emptyCells);
          }

          break;

        case "left":
          break;

        default:
          break;
      }
    }
  });
}

function onArrowClick() {
  // we are going to set here some keyboards events and make the logic for them
  document.body.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowUp":
        //* we should move all elements to the top if there is a space
        allCells.forEach((cell) => {});
        break;

      case "ArrowDown":
        //* we should move all elements to the down if there is a space
        allCells.forEach((cell) => {});
        break;

      case "ArrowRight":
        //* we should move all elements to the right if there is a space
        move("right");
        setRandomCell();
        break;

      default:
        break;
    }
  });
}
