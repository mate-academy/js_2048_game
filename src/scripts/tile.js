export class Tile {
  constructor(gameField) {
    this.tile = document.createElement('div');
    this.value = Math.floor(Math.random() * 10) === 0 ? 4 : 2;
    this.tile.classList.add('tile');
    this.tile.classList.add(`field-cell--${this.value}`);
    this.tile.textContent = this.value;
    gameField.append(this.tile);

    const coordinates = Tile.getRandomEmptyPosition();

    this.x = coordinates[0];
    this.y = coordinates[1];

    this.tile.style.setProperty('--index-x', this.x);
    this.tile.style.setProperty('--index-y', this.y);

    Tile.tilesMatrix[coordinates[1]][coordinates[0]] = this;

    if (Tile.isFieldFull()) {
      Tile.checkGameEnd();
    }
  }

  moveTileTo(x, y) {
    this.tile.style.setProperty('--index-x', x);
    this.tile.style.setProperty('--index-y', y);

    Tile.tilesMatrix[y][x] = this;
    Tile.tilesMatrix[this.y][this.x] = null;

    this.x = x;
    this.y = y;
  }

  mergeTiles(tileToRemove) {
    this.tile.classList.remove(`field-cell--${this.value}`);
    this.value *= 2;
    this.tile.classList.add(`field-cell--${this.value}`);
    this.tile.textContent = this.value;

    Tile.tilesMatrix[tileToRemove.y][tileToRemove.x] = null;
    this.tile.style.setProperty('z-index', 2);
    tileToRemove.tile.style.setProperty('--index-x', this.x);
    tileToRemove.tile.style.setProperty('--index-y', this.y);

    setTimeout(() => {
      tileToRemove.tile.remove();
      this.tile.style.removeProperty('z-index', 2);
    }, 200);

    if (this.value >= 2048) {
      document.querySelector('.message-win').classList.remove('hidden');
    }

    return this.value;
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
        if (Tile.tilesMatrix[i][j] === null) {
          return false;
        }
      }
    }

    return true;
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

  static checkGameEnd() {
    let mergeAvailable = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 1; j < 4; j++) {
        if (Tile.tilesMatrix[i][j - 1].value
          === Tile.tilesMatrix[i][j].value) {
          mergeAvailable = true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 2; j >= 0; j--) {
        if (Tile.tilesMatrix[i][j + 1].value
          === Tile.tilesMatrix[i][j].value) {
          mergeAvailable = true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 1; j < 4; j++) {
        if (Tile.tilesMatrix[j - 1][i].value
          === Tile.tilesMatrix[j][i].value) {
          mergeAvailable = true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 2; j >= 0; j--) {
        if (Tile.tilesMatrix[j + 1][i].value
          === Tile.tilesMatrix[j][i].value) {
          mergeAvailable = true;
        }
      }
    }

    if (!mergeAvailable) {
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }
}

Tile.TILES_COUNT = 4;
Tile.tilesMatrix = Tile.initTilesMatrix();
