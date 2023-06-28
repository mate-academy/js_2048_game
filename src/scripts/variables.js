import { Cell } from "./classes/Cell.js";

export const startBtn = document.querySelector('#start');
export const stopBtn = document.querySelector('#stop');
export const [loseMessage, winMessage, startMessage] = document.querySelectorAll('#message');
export const cells = [...document.getElementsByClassName('field-cell')];
export const cellsMatrix = [];
export const score = document.getElementById('score');
export let gameIsGoing = false;

export const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]

let cellsIndex = 0;

for (let i = 0; i < 4; i++) {
  cellsMatrix[i] = new Array();

  for (let y = 0; y < 4; y++){
    cellsMatrix[i].push(new Cell(cellsIndex));
    cellsIndex++;
  }
}
