export class Tile {
  constructor(gameField) {
    this.tile = document.createElement('div');
    this.tile.classList.add('tile');
    this.value = Math.floor(Math.random() * 10) === 0 ? 4 : 2;
    this.tile.textContent = this.value;
    gameField.append(this.tile);
  }
}
