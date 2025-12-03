// noinspection JSNonASCIINames,NonAsciiCharacters

'use strict';

import { CbContainer, Control } from './Control.class.js';
import { Effect } from './Effect.class.js';
import { Palette } from './Palette.class.js';
import { About } from './About.class.js';
import { Score } from './Score.class.js';
import { Doomguy } from './Doomguy.class.js';
import { BounceEffect } from './BounceEffect.class.js';
import { InitialsPrompt } from './InitialsPrompt.class.js';
import { Sound } from './Sound.class';

/**
 * This class represents the game.
 * Now it has a basic structure needed for testing.
 * Feel free to add more props and methods if needed.
 */
export class Game {
  /**
   * Control key up
   * @type {string}
   * @private
   */
  static #ctrUp = 'ArrowUp';

  /**
   * Control key down
   * @type {string}
   * @private
   */
  static #ctrDown = 'ArrowDown';

  /**
   * Control key left
   * @type {string}
   * @private
   */
  static #ctrLeft = 'ArrowLeft';

  /**
   * Control key right
   * @type {string}
   * @private
   */
  static #ctrRight = 'ArrowRight';

  /**
   * Game statuses
   * @type {Object}
   * @private
   */
  static #statuses = Object.freeze({
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  });

  /**
   * Current game status
   * @type {string}
   * @private
   */
  #status = Game.#statuses.IDLE;

  /**
   * Current board state
   * @type {number[][]}
   * @private
   */
  #state;

  /**
   * Initial score
   * @type {number}
   * @private
   */
  #score;

  /**
   * Board width
   * @type {number}
   * @private
   */
  #width;

  /**
   * Board height
   * @type {number}
   * @private
   */
  #height;

  /**
   * Width of game board
   * @type {number}
   * @protected
   */
  static #defaultWidth = 4;

  /**
   * Height of game board
   * @type {number}
   * @protected
   */
  static #defaultHeight = 4;

  /**
   * Cell value generator
   * @return {number}
   */
  static #cellValueGenerator = () => (Math.random() > 0.9 ? 4 : 2);

  /**
   * Initial not empty cell count
   * @type {number}
   */
  static #initialNonEmptyCellCount = 2;

  /**
   * Win score limit
   * @type {number}
   * @private
   */
  static #winScore = 2048;

  /**
   * Valid direction vectors
   * @type {{'1,0': boolean, '0,1': boolean}}
   */
  static #validDirectionVectors = {
    '1,0': true,
    '0,1': true,
    '-1,0': true,
    '0,-1': true,
  };

  /**
   * Selector for container of messages
   * @type {string}
   */
  static #messageContainerSelector = '.message-container';

  /**
   * Selector for a message
   * @type {string}
   */
  static #messageSelector = '.message';

  /**
   * Class used to hide messages
   * @type {string}
   */
  static #hiddenClass = 'hidden';

  /**
   * Selector for the start button
   * @type {string}
   */
  static #startButtonSelector = '.button.start';

  /**
   * Selector for the restart button
   * @type {string}
   */
  static #restartButtonSelector = '.button.restart';

  /**
   * Selector for the game board
   * @type {string}
   */
  static #boardSelector = '.game-field tbody';

  /**
   * Control manager that supports touchpad and mouse swipes
   * @type {Control}
   * @private
   */
  #control;

  /**
   * Logo element selector
   * @type {string}
   */
  static #logoSelector = '#logo';

  /**
   * Effect manager for app
   * @type {Effect}
   * @private
   */
  #logoEffect;

  /**
   * About element selector
   * @type {string}
   */
  static #aboutSelector = '#about';

  /**
   * Window about wrapper element selector
   * @type {string}
   */
  static #windowAboutWrapperSelector = '.window-about-wrapper';

  /**
   * About flow controller
   * @type {About}
   * @private
   */
  #aboutController;

  /**
   * Score element selector
   * @type {string}
   */
  static #scoreSelector = '#score';

  /**
   * Score flow controller
   * @type {Score}
   * @private
   */
  #scoreController;

  /**
   * Selector for game board and related elements
   * @type {string}
   */
  static #gameContentSelector =
    '.game-wrapper, .shift-mobile-container, .bottom-container';

  /**
   * Generic selector for all modal windows
   * @type {string}
   */
  static #genericModalWindowSelector = '.window-wrapper';

  /**
   * Domguy elements selector
   * @type {string}
   */
  static #doomGuySelector = '.doomguy';

  /**
   * Doom guy animation helper
   *
   * @type {Doomguy}
   * @private
   */
  #doomguy;

  /**
   * Custom animation helper for the restart button
   *
   * @type {BounceEffect}
   * @private
   */
  #bounceEffect;

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
   * If passed, the board will be initialised with the provided
   * initial state.
   */
  constructor(initialState) {
    this._initInteractiveElements();
    this._initControls();

    // if there is some initial state - start the game automatically
    if (initialState) {
      this.restart(initialState);
    }
  }

  /**
   * Init game effects
   * @private
   */
  _initInteractiveElements() {
    /**
     * Game content HTML elements
     * @type {NodeListOf<Element>}
     */
    const gameContentElements = document.querySelectorAll(
      Game.#gameContentSelector,
    );

    /**
     * List of HTML elements for modal windows
     * @type {NodeListOf<Element>}
     */
    const modalWindowElements = document.querySelectorAll(
      Game.#genericModalWindowSelector,
    );

    /**
     * Logo element - hide all modal windows
     * @type {Element}
     */
    const logoElement = document.querySelector(Game.#logoSelector);

    // hide all modals, show the main board
    logoElement.addEventListener('click', () => {
      gameContentElements.forEach((el) => el.classList.remove('hidden'));
      modalWindowElements.forEach((el) => el.classList.add('hidden'));
    });

    /**
     * Effect manager for app
     * @type {Effect}
     * @private
     */
    this.#logoEffect = new Effect(logoElement);
    this.#logoEffect.apply();

    /**
     * About CTA HTML element
     * @type {Element}
     */
    const aboutElement = document.querySelector(Game.#aboutSelector);

    /**
     * About window HTML element
     * @type {Element}
     */
    const windowAboutElement = document.querySelector(
      Game.#windowAboutWrapperSelector,
    );

    /**
     * About controller
     * @type {About}
     */
    this.#aboutController = new About(
      aboutElement,
      windowAboutElement,
      modalWindowElements,
      gameContentElements,
    );

    /**
     * Score CTA HTML element
     * @type {Element}
     */
    const scoreElement = document.querySelector(Game.#scoreSelector);

    /**
     * Score window HTML element
     * @type {Score}
     */
    const windowScoreElement = document.querySelector('.window-score-wrapper');

    /**
     * Score controller
     * @type {Score}
     */
    this.#scoreController = new Score(
      scoreElement,
      windowScoreElement,
      modalWindowElements,
      gameContentElements,
    );

    /**
     * All doomguy elements on the page
     * @type {NodeList}
     */
    const doomguyElements = document.querySelectorAll(Game.#doomGuySelector);

    /**
     * Doomguy manager
     * @type {Doomguy}
     * @private
     */
    this.#doomguy = new Doomguy(doomguyElements);

    /**
     * Restart button element
     * @type {HTMLElement}
     */
    const restartButtonElement = document.querySelector(
      Game.#restartButtonSelector,
    );

    /**
     * Restart button inner part
     * @type {HTMLElement}
     */
    const restartButtonInnerElement =
      restartButtonElement.querySelector('div:nth-child(1)');

    // fancy animation for the restart button
    this.#bounceEffect = new BounceEffect(
      restartButtonElement,
      restartButtonInnerElement,
    );
  }

  /**
   * Initialise control keyboard control for the game
   * @private
   */
  _initControls() {
    const controls = new CbContainer({
      left: this.moveLeft.bind(this),
      right: this.moveRight.bind(this),
      down: this.moveDown.bind(this),
      up: this.moveUp.bind(this),
    });

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case Game.#ctrUp:
          if (this.#status === Game.#statuses.PLAYING) {
            // eslint-disable-next-line no-unused-expressions
            controls.up && controls.up();
          }
          break;
        case Game.#ctrDown:
          if (this.#status === Game.#statuses.PLAYING) {
            // eslint-disable-next-line no-unused-expressions
            controls.down && controls.down();
          }
          break;
        case Game.#ctrLeft:
          if (this.#status === Game.#statuses.PLAYING) {
            // eslint-disable-next-line no-unused-expressions
            controls.left && controls.left();
          }
          break;
        case Game.#ctrRight:
          if (this.#status === Game.#statuses.PLAYING) {
            // eslint-disable-next-line no-unused-expressions
            controls.right && controls.right();
          }
          break;
      }
    });

    /**
     * Helper to assign click handlers
     * @param selector
     * @param handler
     */
    const addClickHandlers = (selector, handler) => {
      if (typeof handler !== 'function') {
        return;
      }

      document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener('click', handler);
      });
    };

    addClickHandlers('.shift-left', controls.left);
    addClickHandlers('.shift-right', controls.right);
    addClickHandlers('.shift-up', controls.up);
    addClickHandlers('.shift-down', controls.down);

    const onStart = this.start.bind(this);

    document
      .querySelector(Game.#startButtonSelector)
      ?.addEventListener('click', onStart);

    const onRestart = this.restart.bind(this);

    document
      .querySelector(Game.#restartButtonSelector)
      ?.addEventListener('click', onRestart);

    // add support of mouse and touchpad / screen for swipe actions
    this._control = new Control(
      document.querySelector(Game.#boardSelector),
      controls,
    );
  }

  /**
   * Game inner loop actions
   * @private
   */
  _gameCycle() {
    // set all elements on the page as up-to-date
    this._recalculateScore();

    // check if game status changed
    this._сheckWinLose();

    // update board
    this._updateBoard();

    // update score indicator
    this._updateScore();

    // update message
    this._updateMessage();

    // update doomguy fancy icon
    this._updateDoomguy();

    // update start / restart buttons visibility
    this._updatePlayButtons();

    // update score table
    if ([Game.#statuses.WIN, Game.#statuses.LOSE].includes(this.#status)) {
      this._updateHighScore();
    }
  }

  /**
   * Shift board by vector
   *
   * @param {number} dx
   * @param {number} dy
   * @return {boolean} if something moved
   * @private
   */
  _shift(dx, dy) {
    if (this.#status !== Game.#statuses.PLAYING) {
      throw new Error('Game is not started or it is finished');
    }

    if (typeof dx !== 'number' || typeof dy !== 'number') {
      throw new TypeError('dx and dy must be numbers');
    }

    const key = `${dx},${dy}`;

    if (!Game.#validDirectionVectors[key]) {
      throw new RangeError(
        'Invalid shift: only single shift allowed ' +
          '(dx,dy) = (+-1,0) or (0,+-1), ' +
          `got (${dx},${dy})`,
      );
    }

    let moved = false;

    // check if movement is horizontal
    const horizontal = dx !== 0;

    /**
     * Get vertical or horizontal line
     * @param i - index
     * @return {number[]}
     */
    const getLine = (i) => {
      const state = this.getState();

      if (horizontal) {
        // extract i-th row to array
        return state[i].slice();
      }

      // get i-th element of each row and create an array
      return state.map((row) => row[i]);
    };

    /**
     * Set vertical or horizontal line
     *
     * @param i - index
     * @param {number[]} newLine - new line
     */
    const setLine = (i, newLine) => {
      const state = this.getState();

      if (horizontal) {
        state[i] = newLine;
      } else {
        for (let j = 0; j < this.#height; j++) {
          state[j][i] = newLine[j];
        }
      }
    };

    /**
     * Merges line per 2048 rules
     * @param {number[]} inputLine - line
     * @param {boolean} reverse - reverse flag
     *   (for left to right and bottom to top)
     * @return {*}
     */
    const mergeLine = (inputLine, reverse = false) => {
      /**
       * For reverse shift - we reverse the array
       * and proceed with the default logic
       */
      const line = reverse ? inputLine.reverse() : inputLine;

      // filter out empty cells
      let nonZero = line.filter((v) => v !== 0);

      for (let i = 0; i < nonZero.length - 1; i++) {
        // if the current cell and next cell have the same value
        if (nonZero[i] === nonZero[i + 1]) {
          // multiple value of current cell by 2
          nonZero[i] *= 2;
          // set empty value to next cell
          nonZero[i + 1] = 0;
          // increment, skip the next cell, so we have no recursive merges
          // (merge 1 time)
          i++;
        }
      }

      // filter empty cells - so there is an effect of cell combine
      nonZero = nonZero.filter((v) => v !== 0);

      // fill line with empty cells to have the initial length
      const currentLength = nonZero.length;

      nonZero.length = line.length;
      nonZero.fill(0, currentLength, nonZero.length);

      /**
       * For reverse shift we restore the original order of elements
       * upon finish processing
       */
      if (reverse) {
        nonZero.reverse();
      }

      return nonZero;
    };

    /**
     * Detect if the shift is reversed,
     * so we will use this for merge line as a flag
     */
    const isReverse = (horizontal && dx > 0) || (!horizontal && dy > 0);

    for (let i = 0; i < (horizontal ? this.#width : this.#height); i++) {
      const line = getLine(i);
      const merged = mergeLine(line, isReverse);

      // check if after shift state for the line is changed
      if (!moved && merged.some((val, idx) => val !== line[idx])) {
        moved = true;
      }

      // set new merged line to current board state
      setLine(i, merged);
    }

    // return if something changed on board
    return moved;
  }

  /**
   * Check board state and change game status
   * @private
   */
  _сheckWinLose() {
    // no actions
    if ([Game.#statuses.WIN, Game.#statuses.LOSE].includes(this.#status)) {
      return;
    }

    // some 2048 cells in any row - change status to win
    if (this.#state.some((row) => row.includes(2048))) {
      this.#status = Game.#statuses.WIN;

      return;
    }

    // there are empty cells - so can continue
    for (let x = 0; x < this.#width; x++) {
      for (let y = 0; y < this.#height; y++) {
        if (this.#state[x][y] === 0) {
          return;
        }
      }
    }

    // check merging possibility
    for (let x = 0; x < this.#width; x++) {
      for (let y = 0; y < this.#height; y++) {
        // are there same values in neighbouring cells?
        if (
          (x < this.#width - 1 &&
            this.#state[x][y] === this.#state[x + 1][y]) ||
          (y < this.#height - 1 && this.#state[x][y] === this.#state[x][y + 1])
        ) {
          // so merging is still possible
          return;
        }
      }
    }

    // otherwise it is a defeat
    this.#status = Game.#statuses.LOSE;
  }

  /**
   * Recalculate current score on board
   * @private
   */
  _recalculateScore() {
    let score = 0;

    for (let i = 0; i < this.#width; i++) {
      for (let j = 0; j < this.#height; j++) {
        if (this.#state[i][j] !== 0) {
          score += this.#state[i][j];
        }
      }
    }
    this.#score = score;
  }

  /**
   * Colors generator using a predefined palette
   *
   * @param {number|null} inputValue
   * @return {TileColor}
   * @private
   */
  _getColors(inputValue = null) {
    // for empty cell used 0
    const value = inputValue || 0;

    // the level will be 1 for 2, 2 for 4, etc.
    const paletteIndex = Math.log2(value);

    /**
     * Return the color from the palette
     * or last color from the palette for inappropriate indexes
     */
    return (
      Palette.tilePalette[paletteIndex] ||
      Palette.tilePalette[Palette.tilePalette.length - 1]
    );
  }

  /**
   * Update board with current game state
   * @private
   */
  _updateBoard() {
    for (let i = 0; i < this.#width; i++) {
      for (let j = 0; j < this.#height; j++) {
        const cell = document.querySelector(
          `${Game.#boardSelector} tr:nth-child(${i + 1}) td:nth-child(${j + 1})`,
        );
        const colorConfig = this._getColors(
          this.#state[i][j] > 0 ? this.#state[i][j] : 1,
        );

        cell.style.color = colorConfig.text;
        cell.style.backgroundColor = colorConfig.background;
        cell.innerHTML = this.#state[i][j] > 0 ? this.#state[i][j] : '';
      }
    }
  }

  /**
   * Update current board score
   * @private
   */
  _updateScore() {
    const scoreElement = document.querySelector(Game.#scoreSelector);

    if (scoreElement) {
      scoreElement.innerText = this.#score;
    }
  }

  /**
   * Show an actual message
   * @private
   */
  _updateMessage() {
    const messagesSelector =
      Game.#messageContainerSelector + ' > ' + Game.#messageSelector;
    const targetMessageSelector = messagesSelector + '-' + this.#status;
    const messageElements = document.querySelectorAll(messagesSelector);
    const targetMessage = document.querySelector(targetMessageSelector);

    messageElements.forEach((messageElement) => {
      messageElement.classList.add(Game.#hiddenClass);
    });

    if (targetMessage) {
      targetMessage.classList.remove(Game.#hiddenClass);
    }
  }

  /**
   * Move the board left
   */
  moveLeft() {
    this._shift(-1, 0);
    Sound.beep(500);
    this._addRandomCell();
    this._gameCycle();
  }

  /**
   * Move the board right
   */
  moveRight() {
    this._shift(1, 0);
    Sound.beep(600);
    this._addRandomCell();
    this._gameCycle();
  }

  /**
   * Move the board up
   */
  moveUp() {
    this._shift(0, -1);
    Sound.beep(700);
    this._addRandomCell();
    this._gameCycle();
  }

  /**
   * Move the board down
   */
  moveDown() {
    this._shift(0, 1);
    Sound.beep(400);
    this._addRandomCell();
    this._gameCycle();
  }

  /**
   * Returns current score
   *
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * Returns current board state
   * @returns {number[][]}
   */
  getState() {
    return this.#state;
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
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.restart();
  }

  /**
   * Resets the game.
   * @param {Array|Event} initialState
   */
  restart(initialState = false) {
    // status playing
    this.#status = Game.#statuses.PLAYING;
    this._updatePlayButtons();
    // score 0
    this.#score = 0;

    try {
      /**
       * Initialize the board with empty cells or some initial state
       */
      this._initializeBoard(initialState);

      /**
       * Draw board
       */
      this._drawBoard();

      /**
       * Add some initial cell
       */
      this._addRandomCell(Game.#initialNonEmptyCellCount);

      /**
       * Update current state of health (doom guy)
       */
      this._updateDoomguy();

      // inner cycle of the game
      this._gameCycle();
    } catch (error) {
      // no-op, production mode, "something goes wrong"?
    }
  }

  /**
   * Initialize the board with empty cells or some initial state
   *
   * @param initialState
   * @private
   */
  _initializeBoard(initialState) {
    // check against a passed array for initialState defined
    if (!Array.isArray(initialState)) {
      // initialize board dimensions
      this.#width = Game.#defaultWidth;
      this.#height = Game.#defaultHeight;

      // create a new clear board
      this.#state = this._create2DArray(
        Game.#defaultWidth,
        Game.#defaultHeight,
        0,
      );
    } else {
      // initiate board with not empty cells
      if (!this._isValidRectangleMatrix(initialState)) {
        throw new TypeError('Invalid initial state');
      }
      // initialize board dimensions
      this.#width = initialState[0].length;
      this.#height = initialState.length;

      this.#state = initialState;
    }
  }

  static gameFieldRowClass = 'field-row';
  static gameFieldCellClass = 'field-cell';
  /**
   * Draw board
   * @private
   */
  _drawBoard() {
    const board = document.querySelector(Game.#boardSelector);

    board.innerHTML = '';

    for (let i = 0; i < this.#height; i++) {
      const tr = document.createElement('tr');

      tr.classList.add(Game.gameFieldRowClass);

      for (let j = 0; j < this.#width; j++) {
        const td = document.createElement('td');

        td.classList.add(Game.gameFieldCellClass);
        tr.appendChild(td);
      }
      board.appendChild(tr);
    }
  }

  /**
   * Update actual start/restart buttons visibility
   * @private
   */
  _updatePlayButtons() {
    const startButton = document.querySelector(Game.#startButtonSelector);
    const reStartButton = document.querySelector(Game.#restartButtonSelector);
    const startBtnVisible = this.#status !== Game.#statuses.PLAYING;

    if (startBtnVisible) {
      startButton.classList.remove(Game.#hiddenClass);
      reStartButton.classList.add(Game.#hiddenClass);
    } else {
      startButton.classList.add(Game.#hiddenClass);
      reStartButton.classList.remove(Game.#hiddenClass);
    }
  }

  /**
   * Initial state validator
   * @param {number[][]} initialState - matrix of number
   * @returns {boolean} validity
   */
  _isValidRectangleMatrix(initialState) {
    if (!Array.isArray(initialState) || initialState.length === 0) {
      return false;
    }

    const firstRowLength = initialState[0].length;

    for (let i = 0; i < initialState.length; i++) {
      const row = initialState[i];

      // check for the same row length
      if (!Array.isArray(row) || row.length !== firstRowLength) {
        return false;
      }

      // check for spaces and integer > 0 for each cell
      for (let j = 0; j < row.length; j++) {
        if (
          !Number.isInteger(row[j]) ||
          row[j] < 0 ||
          row[j] >= Game._WIN_SCORE
        ) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Add value to random cell of board
   * @param {number} count - number of prefilled cells on board
   * @private
   */
  _addRandomCell(count = 1) {
    for (let i = 0; i < count; i++) {
      // get random empty cell
      const result = this._getRandomEmptyCell();

      /**
       * If there are no free cells for previous concrete action by user,
       * but state is still playable - just skip
       */
      if (result === null) {
        break;
      }

      const [r, c] = result;
      // get current board
      const state = this.getState();

      // initiate value to cell
      state[r][c] = Game.#cellValueGenerator();
    }
  }

  /**
   * Get random empty cell from the board
   * @return {[row: number, column: number]|null}
   * @private
   */
  _getRandomEmptyCell() {
    let result = null;
    let count = 0;

    const state = this.getState();

    /**
     * Reservoir sampling
     */
    for (let r = 0; r < state.length; r++) {
      for (let c = 0; c < state[r].length; c++) {
        if (state[r][c] === 0) {
          count++;

          if (Math.random() < 1 / count) {
            result = [r, c];
          }
        }
      }
    }

    if (result === null) {
      // throw new Error('No empty cells');
    }

    return result;
  }

  /**
   * Create 2 dimensions array and fill with value
   * @param rows
   * @param cols
   * @param initialValue
   * @return {any[]}
   * @private
   */
  _create2DArray(rows, cols, initialValue = 0) {
    const result = new Array(rows);

    for (let i = 0; i < rows; i++) {
      result[i] = new Array(cols).fill(initialValue);
    }

    return result;
  }

  /**
   * Get fancy health status (number of free cells' percentage)
   *
   * @return {number} - integer percentage
   */
  _getHealthStatus() {
    const state = this.getState();
    const freeCellNumber = state
      .flat()
      .filter((val) => (parseInt(val) === 0 ? 1 : 0)).length;

    return Math.round((freeCellNumber / (this.#width * this.#height)) * 100);
  }

  /**
   * Update doomguy fancy icon
   * @return void
   * @private
   */
  _updateDoomguy() {
    /**
     * Custom doom guy event
     * @type {CustomEvent}
     */
    const doomguyEvent = new CustomEvent(Doomguy.event, {
      detail: { health: this._getHealthStatus() },
    });

    // Dispatching on the window object
    window.dispatchEvent(doomguyEvent);
  }

  /**
   * Update high-score table
   * @return void
   * @private
   */
  _updateHighScore() {
    // eslint-disable-next-line no-new
    new InitialsPrompt({
      onSubmit: (initials) => {
        this.#scoreController.addScore(initials, this.getScore());
        this.restart();
      },
    });
  }
}
