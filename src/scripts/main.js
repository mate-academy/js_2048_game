'use strict';

let score = 0;
let size = 4;
let field = new Array(size);
let loss = false;

function createCell() {
  let empty = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!field[i][j]) {
        empty.push({x: i, y: j});
      }
    }
  }
  if (empty.length) {
    let randPos = empty[Math.floor(Math.random() * empty.length)];
    field[randPos.x][randPos.y] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }
  return false;
}

function startGame() {
  createField();
  drawField();
}

function finishGame() {
  loss = true;
}

function drawField() {
  // Implement the drawing of the field here
}

function createField() {
  for (let i = 0; i < size; i++) {
    field[i] = [];
    for (let j = 0; j < size; j++) {
      field[i][j] = 0;
    }
  }
}

function rotateField() {
  let newField = [];
  for (let i = 0; i < size; i++) {
    newField[i] = [];
    for (let j = 0; j < size; j++) {
      newField[i][j] = field[j][i];
    }
  }
  field = newField;
}

function moveLeft() {
  let oldField = field;
  for (let i = 0; i < size; i++) {
    field[i] = moveLine(field[i]);
  }
}

function moveLine(line) {
  // Implement the move of a line here
}

function moveUp() {
  rotateField();
  moveLeft();
  rotateField();
  rotateField();
  rotateField();
}

function moveRight() {
  rotateField();
  rotateField();
  moveLeft();
  rotateField();
  rotateField();
}

function moveDown() {
  rotateField();
  rotateField();
  rotateField();
  moveLeft();
  rotateField();
}

document.onkeydown = function(event) {
  if (!loss) {
    if (event.keyCode === 38 || event.keyCode === 87) {
      moveUp();
    } else if (event.keyCode === 39 || event.keyCode === 68) {
      moveRight();
    } else if (event.keyCode === 40 || event.keyCode === 83) {
      moveDown();
    } else if (event.keyCode === 37 || event.keyCode === 65) {
      moveLeft();
    }
  }
}

startGame();
