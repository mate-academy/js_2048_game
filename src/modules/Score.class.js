'use strict';

class ScoreService {
  constructor() {
    this.score = 0;
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
