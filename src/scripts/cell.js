
import { stopGame } from './main.js';

const scoreBoard = document.querySelector('.game-score');
const bestScoreBoard = document.querySelector('.best-score');
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
  const bestScore = localStorage.getItem('bestScore') || 0;

  bestScoreBoard.textContent = bestScore;
});

export function changeScoreForStart() {
  score = 0;
  scoreBoard.textContent = 0;
}

function updateScoreBoard(scoreValue) {
  const bestScore = localStorage.getItem('bestScore') || 0;

  scoreBoard.textContent = scoreValue;
  bestScoreBoard.textContent = Math.max(scoreValue, bestScore);
  localStorage.setItem('bestScore', bestScoreBoard.textContent);
}

export function messageWin(value, action = 'add') {
  const messageWinScreen = document.getElementById('message-win');

  if (action === 'add') {
    messageWinScreen.classList.add('hidden');
  }

  if (value === 2048) {
    messageWinScreen.classList.remove('hidden');
    stopGame();
  }
}

export class Cell {
  constructor(gridElement, x, y) {
    const cell = document.createElement('div');

    cell.classList.add('field-cell');
    gridElement.append(cell);
    this.x = x;
    this.y = y;
  }

  linkTile(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  unlinkTile() {
    this.linkedTile = null;
  }

  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }

  isEmpty() {
    return !this.linkedTile;
  }

  linkTileForMerge(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  canAccept(newTile) {
    return this.isEmpty()
      || (!this.hasTileForMerge()
      && this.linkedTile.value === newTile.value);
  }

  mergeTiles() {
    this.linkedTile.setValue(this
      .linkedTile.value + this.linkedTileForMerge.value);
    score += this.linkedTile.value;
    updateScoreBoard(score);
    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();
    messageWin(this.linkedTile.value);
  }
}
