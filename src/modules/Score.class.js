'use strict';

class Score {
  constructor(scoreColEls) {
    this.score = 0;
    this.scoreColEls = scoreColEls;
  }

  /**
   * Resets the HTML score state
   */
  resetScore() {
    if (this.scoreColEls.length) {
      for (let i = 0; i < this.scoreColEls.length; i++) {
        // Remove class that starts with score-col-- if it exists
        const classToRemove = [...this.scoreColEls[i].classList].find(
          (className) => {
            return className.startsWith('score-col--');
          },
        );

        if (classToRemove) {
          this.scoreColEls[i].classList.remove(classToRemove);
        }
      }
    }
  }

  /**
   * Initialize the HTML score structure
   */
  initializeScoreCounter() {
    if (!this.scoreColEls.length) {
      return;
    }

    for (const el of this.scoreColEls) {
      for (let i = 0; i < 9; i++) {
        const span = document.createElement('span');

        span.textContent = i;
        el.append(span);
      }
    }
  }

  /**
   * Updates HTML score count
   */
  updateHtmlScore() {
    if (this.scoreColEls.length) {
      this.resetScore();

      const score = String(this.score).padStart(4, '0');

      for (let i = 0; i < this.scoreColEls.length; i++) {
        // Add new class score-col--<i>
        this.scoreColEls[i].classList.add(`score-col--${score[i]}`);
      }
    }
  }

  setScore(score) {
    this.score = score;
  }
}

module.exports = Score;
