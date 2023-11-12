export class ScoreCounter {
  constructor(counterElement, recordElement) {
    this.HTMLelement = counterElement;
    this.recordElement = recordElement;

    this.counter = 0;
    this.record = localStorage.getItem('scoreRecord') || 0;

    this.updateHTML();
  }

  updateHTML() {
    this.HTMLelement.textContent = this.counter;
    this.recordElement.textContent = this.record;
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

  updateRecord(value = this.counter) {
    this.record = value;
    localStorage.setItem('scoreRecord', value);
  }
}
