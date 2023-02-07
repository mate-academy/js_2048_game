export class View {
  constructor() {
    this.tileContainer = document.querySelector('.game-field__tile-container');
    this.cells = document.querySelectorAll('.game-field__cell');
    this.gameField = document.querySelector('.game-field');
    this.gameScore = document.querySelector('.game-score');
    this.messageContainer = document.querySelector('.message-container');
  }

  printMessage(statusName, messageText) {
    const message = document.createElement('div');

    message.className = `message message-${statusName}`;
    message.innerHTML = `${messageText}`;
    this.messageContainer.append(message);
  }
  createTileElement() {
    return document.createElement('div');
  }

  update(matrix) {
    matrix.flat().forEach(tile => {
      if (tile) {
        tile.htmlElement.className = `
          game-field__tile game-field__tile--${tile.value}
        `;
        tile.htmlElement.innerHTML = `${tile.value}`;
        this.setTilePosition(tile);
      }
    });
  }

  getTilePosition(tile) {
    const { offsetTop, offsetLeft } = this.cells[tile.coords.index];

    return {
      top: offsetTop / this.gameField.offsetHeight * 100,
      left: offsetLeft / this.gameField.offsetWidth * 100,
    };
  }

  setTilePosition(tile) {
    const { topPosition, leftPosition } = this.getTilePosition(tile);

    tile.htmlElement.style.top = `${topPosition}%`;
    tile.htmlElement.style.left = `${leftPosition}%`;
  }

  resetTiles(matrix) {
    matrix
      .flat()
      .filter(el => el)
      .forEach(el => el.removeHtmlElement());
  }

  updateGameScore(value) {
    this.gameScore.innerHTML = value;
  }
}
