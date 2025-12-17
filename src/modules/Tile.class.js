'use strict';

const CELL_SIZE = 75;
const GAP = 10;
const STEP = CELL_SIZE + GAP;

class Tile {
  constructor(value, row, col) {
    this.value = value;
    this.row = row;
    this.col = col;

    this.element = document.createElement('div');
    this.element.className = 'tile';

    this.inner = document.createElement('div');
    this.inner.className = `tile-inner tile--${value}`;
    this.inner.textContent = value;

    this.element.appendChild(this.inner);

    this.setPosition();
  }

  setPosition() {
    const x = this.col * STEP;
    const y = this.row * STEP;

    this.element.style.transform = `translate(${x}px, ${y}px)`;
  }

  moveTo(row, col) {
    this.row = row;
    this.col = col;
    this.setPosition();
  }

  updateValue(newValue) {
    this.value = newValue;
    this.inner.textContent = newValue;

    this.inner.className = `tile-inner tile--${newValue}`;
  }

  remove() {
    this.element.remove();
  }
}

module.exports = Tile;
