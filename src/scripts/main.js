'use strict';
import { Cell } from './Cell.js';

const score = document.querySelector('#score');
const startBtn = document.querySelector('#start');
const cells = document.getElementsByClassName('field-cell');
const [loseMessage, winMessage, startMessage] = document.querySelectorAll('#message');

// 1. On click on start button - start message hides and text in start button changes to 'restart'
// 2. When game started - first to blocks are randoly spawns on the field

startBtn.addEventListener('click', () => {
  gamePreparation();
  spawnCell();
});

function gamePreparation() {
  startBtn.classList.toggle('start');
  startBtn.classList.toggle('restart');
  startBtn.innerHTML = 'Stop';
  startMessage.classList.toggle('hidden');

  startBtn.addEventListener('click', function() {
    Cell.cells = [];
    startBtn.innerHTML = 'Start';
  });
}

function spawnCell(quantity = 1, innerNumber = 2) {
  const cellsCoords = {
    x: cells[0].offsetLeft,
    y: cells[0].offsetHeight,
  }

  const cell = new Cell(cellsCoords);

  console.dir(cell);
}
