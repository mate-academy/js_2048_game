'use strict';

class ScoreService {
  constructor(score) {
    this.score = score;
  }

  reset() {
    this.score = 0;
  }

  add(amount) {
    this.score += amount;
  }

  get() {
    return this.score;
  }

  set(amount) {
    this.score = amount;
  }
}

module.exports = ScoreService;
