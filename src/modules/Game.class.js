'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.tiles = [];
    this.tempTiles = [];
    this.removedItems = [];
    this.changed = 0;
    this.container = document.getElementById('tile-container');

    if (initialState) {
      this.convertToTiles(initialState);
    }
  }

  moveLeft() {
    const sorted = this.tiles.sort((item1, item2) =>
      this.getCoords(item1).x - this.getCoords(item2).x);

    for (const tile of sorted) {
      const coords = this.getCoords(tile);

      tile.classList.remove(coords.className);

      let tempX = 0;

      while (this.tiles
        .filter(t => t.classList
          .contains(`tile-cell--${coords.y}--${tempX}`))
        .length > 0) {
        tempX++;
      }

      if (tempX > 3) {
        tempX = coords.x;
      }

      if (tempX <= 3 && parseInt(coords.x) !== tempX) {
        this.changed++;
      }

      tile.classList.add(`tile-cell--${coords.y}--${tempX}`);

      if (tempX > 0) {
        const prevTempCord = tempX - 1;

        const previousItem = this.tiles
          .filter(item => item.classList
            .contains(`tile-cell--${coords.y}--${prevTempCord}`))[0];

        if (previousItem) {
          const prevContent = previousItem.querySelector('.tile-content');
          const currContent = tile.querySelector('.tile-content');

          if (prevContent.textContent === currContent.textContent
            && !this.tempTiles.includes(previousItem)) {
            tile.classList.remove(`tile-cell--${coords.y}--${tempX}`);
            tile.classList.add(`tile-cell--${coords.y}--${prevTempCord}`);
            tile.classList.add('tile-cell--hide');

            previousItem.classList
              .remove(`tile-cell--${prevContent.textContent}`);

            previousItem.classList
              .add(`tile-cell--${parseInt(prevContent.textContent) * 2}`);

            prevContent.textContent = parseInt(prevContent.textContent) * 2;

            this.tempTiles.push(previousItem);
            this.removedItems.push(tile);

            this.changed++;
          }
        }
      }
    }
  }

  moveRight() {
    const sorted = this.tiles.sort((item1, item2) =>
      this.getCoords(item2).x - this.getCoords(item1).x);

    for (const tile of sorted) {
      const coords = this.getCoords(tile);

      tile.classList.remove(coords.className);

      let tempX = 3;

      while (this.tiles
        .filter(t => t.classList
          .contains(`tile-cell--${coords.y}--${tempX}`))
        .length > 0) {
        tempX--;
      }

      if (tempX < 0) {
        tempX = coords.x;
      }

      if (tempX >= 0 && parseInt(coords.x) !== tempX) {
        this.changed++;
      }

      tile.classList.add(`tile-cell--${coords.y}--${tempX}`);

      if (tempX < 3) {
        const prevTempCord = tempX + 1;

        const previousItem = this.tiles
          .filter(item => item.classList
            .contains(`tile-cell--${coords.y}--${prevTempCord}`))[0];

        if (previousItem) {
          const prevContent = previousItem.querySelector('.tile-content');
          const currContent = tile.querySelector('.tile-content');

          if (prevContent.textContent === currContent.textContent
            && !this.tempTiles.includes(previousItem)) {
            tile.classList.remove(`tile-cell--${coords.y}--${tempX}`);
            tile.classList.add(`tile-cell--${coords.y}--${prevTempCord}`);
            tile.classList.add('tile-cell--hide');

            previousItem.classList
              .remove(`tile-cell--${prevContent.textContent}`);

            previousItem.classList
              .add(`tile-cell--${parseInt(prevContent.textContent) * 2}`);

            prevContent.textContent = parseInt(prevContent.textContent) * 2;

            this.tempTiles.push(previousItem);
            this.removedItems.push(tile);

            this.changed++;
          }
        }
      }
    }
  }

  moveUp() {
    const sorted = this.tiles.sort((item1, item2) =>
      this.getCoords(item1).y - this.getCoords(item2).y);

    for (const tile of sorted) {
      const coords = this.getCoords(tile);

      tile.classList.remove(coords.className);

      let tempY = 0;

      while (this.tiles
        .filter(t => t.classList
          .contains(`tile-cell--${tempY}--${coords.x}`))
        .length > 0) {
        tempY++;
      }

      if (tempY > 3) {
        tempY = coords.y;
      }

      if (tempY <= 3 && parseInt(coords.y) !== tempY) {
        this.changed++;
      }

      tile.classList.add(`tile-cell--${tempY}--${coords.x}`);

      if (tempY > 0) {
        const prevTempCord = tempY - 1;

        const previousItem = this.tiles
          .filter(item => item.classList
            .contains(`tile-cell--${prevTempCord}--${coords.x}`))[0];

        if (previousItem) {
          const prevContent = previousItem.querySelector('.tile-content');
          const currContent = tile.querySelector('.tile-content');

          if (prevContent.textContent === currContent.textContent
            && !this.tempTiles.includes(previousItem)) {
            tile.classList.remove(`tile-cell--${tempY}--${coords.x}`);
            tile.classList.add(`tile-cell--${prevTempCord}--${coords.x}`);
            tile.classList.add('tile-cell--hide');

            previousItem.classList
              .remove(`tile-cell--${prevContent.textContent}`);

            previousItem.classList
              .add(`tile-cell--${parseInt(prevContent.textContent) * 2}`);

            prevContent.textContent = parseInt(prevContent.textContent) * 2;

            this.tempTiles.push(previousItem);
            this.removedItems.push(tile);

            this.changed++;
          }
        }
      }
    }
  }

  moveDown() {
    const sorted = this.tiles.sort((item1, item2) =>
      this.getCoords(item2).y - this.getCoords(item1).y);

    for (const tile of sorted) {
      const coords = this.getCoords(tile);

      tile.classList.remove(coords.className);

      let tempY = 3;

      while (this.tiles
        .filter(t => t.classList
          .contains(`tile-cell--${tempY}--${coords.x}`))
        .length > 0) {
        tempY--;
      }

      if (tempY < 0) {
        tempY = coords.y;
      }

      if (tempY >= 0 && parseInt(coords.y) !== tempY) {
        this.changed++;
      }

      tile.classList.add(`tile-cell--${tempY}--${coords.x}`);

      if (tempY < 3) {
        const prevTempCord = tempY + 1;

        const previousItem = this.tiles
          .filter(item => item.classList
            .contains(`tile-cell--${prevTempCord}--${coords.x}`))[0];

        if (previousItem) {
          const prevContent = previousItem.querySelector('.tile-content');
          const currContent = tile.querySelector('.tile-content');

          if (prevContent.textContent === currContent.textContent
            && !this.tempTiles.includes(previousItem)) {
            tile.classList.remove(`tile-cell--${tempY}--${coords.x}`);
            tile.classList.add(`tile-cell--${prevTempCord}--${coords.x}`);
            tile.classList.add('tile-cell--hide');

            previousItem.classList
              .remove(`tile-cell--${prevContent.textContent}`);

            previousItem.classList
              .add(`tile-cell--${parseInt(prevContent.textContent) * 2}`);

            prevContent.textContent = parseInt(prevContent.textContent) * 2;

            this.tempTiles.push(previousItem);
            this.removedItems.push(tile);

            this.changed++;
          }
        }
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    const state = this.getState();
    let sum = 0;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        sum += state[i][j];
      }
    }

    return sum;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const result = [];

    for (let i = 0; i < 4; i++) {
      result.push([0, 0, 0, 0]);
    }

    for (const tile of this.tiles
      .filter(t => !t.classList.contains('tile-cell--hide'))) {
      const coords = this.getCoords(tile);

      result[coords.y][coords.x] = parseInt(tile
        .querySelector('.tile-content').innerHTML);
    }

    return result;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    if (this.tiles.filter(tile => {
      const inner = tile.querySelector('.tile-content');

      return parseInt(inner.innerHTML) === 2048;
    }).length > 0) {
      return 'win';
    }

    if (!this.checkPosibilityToContinue()) {
      return 'lose';
    } else {
      const btn = document
        .getElementsByClassName('button')[0].classList.contains('start');

      if (btn) {
        return 'idle';
      } else {
        return 'playing';
      }
    }
  }

  /**
   * Starts the game.
   */
  start() {
    const btn = document.getElementsByClassName('button')[0];

    this.tiles = [];

    btn.addEventListener('click', this.connectStart.bind(this));
    document.addEventListener('keydown', this.press.bind(this));
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here

  connectStart(e) {
    e.preventDefault();

    const btn = e.target;

    this.tiles = [];
    document.getElementById('tile-container').innerHTML = '';

    if (btn.classList.contains('start')) {
      btn.classList.remove('start');
      btn.classList.add('restart');

      btn.textContent = 'Restart';
    }

    this.spawnItem();
    this.spawnItem();

    const visible = [...document.getElementsByClassName('message')]
      .filter(x => !x.classList.contains('hidden'))[0];

    if (visible) {
      visible.classList.add('hidden');
    }

    document
      .getElementsByClassName('message-start')[0]
      .classList.remove('hidden');
  }

  press(e) {
    const key = e.key;

    this.tempTiles = [];
    this.removedItems = [];
    this.changed = 0;

    if (this.tiles.length === 0) {
      return;
    }

    switch (key) {
      case 'ArrowUp': {
        this.moveUp();

        break;
      }

      case 'ArrowDown': {
        this.moveDown();

        break;
      }

      case 'ArrowLeft': {
        this.moveLeft();

        break;
      }

      case 'ArrowRight': {
        this.moveRight();

        break;
      }
    }

    this.sleep().then(() => {
      for (let i = 0; i < this.removedItems.length; i++) {
        this.removedItems[i].remove();
      }

      if (this.changed > 0) {
        this.spawnItem();
      }

      if (!this.checkPosibilityToContinue()) {
        document.addEventListener('keydown', () => {});

        const getStat = this.getStatus();

        document
          .getElementsByClassName('message-start')[0]
          .classList.add('hidden');

        document
          .getElementsByClassName(`message-${getStat}`)[0]
          .classList.remove('hidden');
      }
    });
  }

  setScoreHTML() {
    const score = document.getElementsByClassName('game-score')[0];

    score.textContent = this.getScore();
  }

  spawnItem() {
    if (this.tiles
      .filter(t => !t.classList
        .contains('tile-cell--hide'))
      .length < 16) {
      const newItem = document.createElement('div');

      const side = Math.round(Math.random() * 10) < 2 ? 4 : 2;

      let tempX = Math.floor(Math.random() * 4);
      let tempY = Math.floor(Math.random() * 4);

      while (this.tiles
        .filter(t => t.classList
          .contains(`tile-cell--${tempY}--${tempX}`)).length > 0) {
        tempX = Math.floor(Math.random() * 4);
        tempY = Math.floor(Math.random() * 4);
      }

      newItem.classList.add('tile-cell');
      newItem.classList.add(`tile-cell--${side}`);
      newItem.classList.add(`tile-cell--${tempY}--${tempX}`);
      newItem.classList.add('tile-cell--hide');

      const pItem = document.createElement('p');

      pItem.classList.add('tile-content');
      pItem.textContent = side;

      newItem.appendChild(pItem);
      this.container.append(newItem);
      this.tiles.push(newItem);

      newItem.classList.remove('tile-cell--hide');

      this.setScoreHTML();
    }
  }

  sleep(ms = 200) {
    const prom = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });

    return prom;
  }

  getCoords(tile) {
    let x = 0;
    let y = 0;
    let classN = '';

    for (const className of tile.classList) {
      if (className.length >= 15 && className !== 'tile-cell--hide') {
        x = className.slice(-1);
        y = className.slice(-4, -3);

        classN = className;
      }
    }

    return {
      x,
      y,
      className: classN,
    };
  }

  checkPosibilityToContinue() {
    this.tiles = this.tiles
      .filter(cell => !cell.classList.contains('tile-cell--hide'));

    if (this.tiles.length >= 16) {
      for (let i = 0; i < this.tiles.length; i++) {
        const current = this.tiles[i].querySelector('.tile-content');
        const cCoords = this.getCoords(this.tiles[i]);

        if (cCoords.x > 0) {
          const prevLeft = this.tiles
            .filter(cell => cell.classList
              .contains(`tile-cell--${cCoords.y}--${cCoords.x - 1}`))[0];

          if (prevLeft && current.textContent === prevLeft
            .querySelector('.tile-content').textContent) {
            return true;
          }
        }

        if (cCoords.y > 0) {
          const prevTop = this.tiles
            .filter(cell => cell.classList
              .contains(`tile-cell--${cCoords.y - 1}--${cCoords.x}`))[0];

          if (prevTop && current.textContent === prevTop
            .querySelector('.tile-content').textContent) {
            return true;
          }
        }

        if (cCoords.y < 3) {
          const prevBottom = this.tiles
            .filter(cell => cell.classList
              .contains(`tile-cell--${cCoords.y + 1}--${cCoords.x}`))[0];

          if (prevBottom && current.textContent === prevBottom
            .querySelector('.tile-content').textContent) {
            return true;
          }
        }

        if (cCoords.x < 3) {
          const prevRight = this.tiles
            .filter(cell => cell.classList
              .contains(`tile-cell--${cCoords.y}--${cCoords.x + 1}`))[0];

          if (prevRight && current.textContent === prevRight
            .querySelector('.tile-content').textContent) {
            return true;
          }
        }
      }

      return false;
    }

    return true;
  }

  convertToTiles(state) {
    document.getElementById('tile-container').innerHTML = '';

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (state[i][j] > 0) {
          const div = document.createElement('div');

          div.classList.add('tile-cell');
          div.classList.add(`tile-cell--${state[i][j]}`);
          div.classList.add(`tile-cell--${i}--${j}`);

          const p = document.createElement('p');

          p.classList.add('tile-content');
          p.textContent = state[i][j];

          div.appendChild(p);

          document.getElementById('tile-container')
            .appendChild(div);

          this.tiles.add(div);
        }
      }
    }
  }
}

module.exports = Game;
