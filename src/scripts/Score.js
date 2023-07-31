'use strict';

class Score {
  constructor(element) {
    this.element = element;
    this.value = 0;
  }

  addPoints(value) {
    this.value += value;
    this.element.textContent = this.value;
  }

  reset() {
    this.value = 0;
    this.element.textContent = this.value;
  }
}

module.exports = Score;
