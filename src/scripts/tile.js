export class Tile {
  constructor(gameField) {
    this.tile = document.createElement('div');
    this.value = Math.floor(Math.random() * 10) === 0 ? 4 : 2;
    this.tile.classList.add('tile');
    this.tile.classList.add(`field-cell--${this.value}`);
    this.tile.textContent = this.value;
    gameField.append(this.tile);

    const coordinates = Tile.getRandomEmptyPosition();

    this.tile.style.setProperty('--index-x', coordinates[0]);
    this.tile.style.setProperty('--index-y', coordinates[1]);

    Tile.tilesMatrix[coordinates[1]][coordinates[0]] = this;
  }

  moveTileTo(x, y) {
    this.tile.style.setProperty('--index-x', x);
    this.tile.style.setProperty('--index-y', y);
  }

  mergeTiles() {
    this.tile.classList.remove(`field-cell--${this.value}`);
    this.value *= 2;
    this.tile.classList.add(`field-cell--${this.value}`);
    this.tile.textContent = this.value;
  }

  static initNewTile() {
    return new Tile(document.querySelector('.game-field'));
  }

  static initTilesMatrix() {
    const arr = [];

    for (let i = 0; i < Tile.TILES_COUNT; i++) {
      arr[i] = [];

      for (let j = 0; j < Tile.TILES_COUNT; j++) {
        arr[i][j] = null;
      }
    }

    return arr;
  }

  static clearField() {
    Tile.tilesMatrix.forEach((row) => {
      row.forEach((tile) => {
        if (tile !== null) {
          tile.tile.remove();
        }
      });
    });

    Tile.tilesMatrix = Tile.initTilesMatrix();
  }

  static isFieldFull() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (Tile.tilesMatrix[i][j] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  static getRandomEmptyPosition() {
    let coordinates;

    do {
      coordinates = [Math.floor(Math.random() * Tile.TILES_COUNT),
        Math.floor(Math.random() * Tile.TILES_COUNT)];
    }
    while (Tile.tilesMatrix[coordinates[1]][coordinates[0]] !== null);

    return coordinates;
  }
}

Tile.TILES_COUNT = 4;
Tile.tilesMatrix = Tile.initTilesMatrix();
