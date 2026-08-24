'use strict';

export class ScoreView {
  constructor(element) {
    this.element = element;
  }

  render(score) {
    this.element.textContent = score;
  }
}
