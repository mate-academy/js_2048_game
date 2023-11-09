export class ScoreCounter {
  constructor(counterElement) {
    this.HTMLelement = counterElement;
    this.counter = 0;
  }

  updateHTML() {
    this.HTMLelement.textContent = this.counter;
  }

  playAddScoreAnimation(amount) {
    this.HTMLelement.style.setProperty('--amount', `'+${amount}'`);
    this.HTMLelement.classList.add('game-score--before');

    setTimeout(() => {
      this.HTMLelement.classList.remove('game-score--before');
    }, 500);
  }

  add(amount) {
    this.counter += amount;

    this.playAddScoreAnimation(amount);

    this.updateHTML();
  }

  reset() {
    this.counter = 0;
    this.updateHTML();
  }
}
