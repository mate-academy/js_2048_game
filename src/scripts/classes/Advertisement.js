export class Advertisement {
  constructor(HTMLelement) {
    this.HTMLelement = HTMLelement;

    this.setGameInfo();
  }

  setGameInfo() {
    this.HTMLelement.textContent = 'Press "Start" to start game';
  }

  setAd() {
    this.HTMLelement.textContent = 'Your ad can be here';
  }
}
