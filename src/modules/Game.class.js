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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = 'idle';
    this.score = 0;
    this.initialState = initialState;
  }

  // eslint-disable-next-line no-console

  moveLeft() {
    if (this.state === 'idle') {
      return;
    }

    const updatedState = this.processMoveLeft();

    this.updatedGameState(updatedState);

    return this.initialState;
  }
  moveRight() {
    if (this.state === 'idle') {
      return;
    }

    const updatedState = this.processMoveRight();

    this.updatedGameState(updatedState);

    return this.initialState;
  }
  moveUp() {
    if (this.state === 'idle') {
      return;
    }

    const updatedState = this.processMoveUp();

    this.updatedGameState(updatedState);

    return this.initialState;
  }
  moveDown() {
    if (this.state === 'idle') {
      return;
    }

    const updatedState = this.processMoveDown();

    this.updatedGameState(updatedState);

    return this.initialState;
  }
  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.initialState;
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
    return this.state;
  }

  /**
   * Starts the game.
   */
  start() {
    const initialStateEmpty = this.isInitialStateAllZeros;

    const newInitialState = this.generateInitialState(initialStateEmpty);

    this.resetGamesState(newInitialState);

    return this.initialState;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.state = 'idle';

    return this.initialState;
  }

  // add metodo de inicialização do jogo
  isInitialStateAllZeros() {
    return this.initialState.flat().every((value) => value === 0);
  }

  generateInitialState(isEmpty) {
    const numberOfCellsToAdd = isEmpty ? 2 : 1;

    return this.addNewCellRandomCell(this.initialState, numberOfCellsToAdd);
  }

  resetGamesState(newState) {
    this.initialState = newState;
    this.score = 0;
    this.state = 'playing';
  }

  // add metodo de atualização do tabuleiro quando se move para a esquerda
  processMoveLeft() {
    const moveRows = this.initialState.map(this.mergeToTheLeft);
    const withNewCell = this.addNewCellRandomCell(moveRows, 1);

    return withNewCell;
  }

  // atualiza os movimentos independente da direção
  updatedGameState(newState) {
    this.state = this.loseWinState(newState);
    this.score += this.calculateScore(this.initialState, newState);
    this.initialState = newState;
  }

  // add metodo de atualização do tabuleiro quando se move para a direta
  processMoveRight() {
    const moveRows = this.initialState(this.mergeToTheRight);
    const withNewCell = this.addNewCellRandomCell(moveRows, 1);

    return withNewCell;
  }

  // add metodo de atualização do tabuleiro quando se move para cima
  processMoveUp() {
    const moveRows = this.initialState(this.mergeToTheUp);
    const withNewCell = this.addNewCellRandomCell(moveRows, 1);

    return withNewCell;
  }

  // add metodo de atualização do tabuleiro quando se move para baixo
  processMoveDown() {
    const moveRows = this.initialState(this.mergeToTheDown);
    const withNewCell = this.addNewCellRandomCell(moveRows, 1);

    return withNewCell;
  }

  // add novas celulas ao tabuleiro
  addNewCellRandomCell(initialState, qtdCellAdd) {
    const matrixInRow = initialState.flat();

    const indexEvaluation = matrixInRow.forEach((value, index) => {
      if (value === 0 && qtdCellAdd > 0) {
        matrixInRow[index] = 1;
      } else {
        matrixInRow[index] = null;
      }
    });

    if (indexEvaluation.length === 0) {
      return initialState;
    }
  }

  // verifica se perdeu ou ganhou
  loseWinState() {}

  // verifca a pontuação
  calculateScore() {}

  // mescla para a esquerda
  mergeToTheLeft() {}

  // mescla para a direita
  mergeToTheRight() {}

  // mescla para cima
  mergeToTheUp() {}

  // mescla para baixo
  mergeToTheDown() {}
}

module.exports = Game;
