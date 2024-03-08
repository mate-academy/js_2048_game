/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable brace-style */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game
{
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
  constructor(initialState)
  {
    this.initialState = initialState;

    this.initialStateRestart = initialState ? initialState.map(row => row.map(cell => cell)) : [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';

    this.isMerged = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
  }

  moveLeft()
  {
    if (this.status !== 'playing')
    {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.state.length; i++)
    {
      for (let j = 1; j < this.state[i].length; j++)
      {
        if (this.state[i][j] !== 0)
        {
          let k = j;

          while (k > 0 && (this.state[i][k - 1] === 0 || this.state[i][k - 1] === this.state[i][k]))
          {
            if (this.state[i][k - 1] === 0)
            {
              this.state[i][k - 1] = this.state[i][k];
              this.state[i][k] = 0;
              moved = true;
              k--;
            }
            else if (this.state[i][k - 1] === this.state[i][k] && !this.isMerged[i][k - 1])
            {
              this.state[i][k - 1] *= 2;
              this.state[i][k] = 0;
              this.score += this.state[i][k - 1];
              this.isMerged[i][k - 1] = true;
              moved = true;
            }
            else
            {
              break;
            }
          }
        }
      }
    }

    if (moved)
    {
      this.isMerged.forEach(row => row.fill(false));
      this.generateNewTiles();
    }
  }

  moveRight()
  {
    if (this.status !== 'playing')
    {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.state.length; i++)
    {
      for (let j = this.state[i].length - 2; j >= 0; j--)
      {
        if (this.state[i][j] !== 0)
        {
          let k = j;

          while (k < this.state[i].length - 1 && (this.state[i][k + 1] === 0 || this.state[i][k + 1] === this.state[i][k]))
          {
            if (this.state[i][k + 1] === 0)
            {
              this.state[i][k + 1] = this.state[i][k];
              this.state[i][k] = 0;
              moved = true;
              k++;
            }
            else if (this.state[i][k + 1] === this.state[i][k] && !this.isMerged[i][k + 1])
            {
              this.state[i][k + 1] *= 2;
              this.score += this.state[i][k + 1];
              this.state[i][k] = 0;
              moved = true;
              this.isMerged[i][k + 1] = true;
            }
            else
            {
              break;
            }
          }
        }
      }
    }

    if (moved)
    {
      this.isMerged.forEach(row => row.fill(false));
      this.generateNewTiles();
    }
  }

  moveUp()
  {
    if (this.status !== 'playing')
    {
      return;
    }

    let moved = false;

    for (let i = 1; i < this.state.length; i++)
    {
      for (let j = 0; j < this.state[i].length; j++)
      {
        if (this.state[i][j] !== 0)
        {
          let k = i;

          while (k > 0 && (this.state[k - 1][j] === 0 || this.state[k - 1][j] === this.state[k][j]))
          {
            if (this.state[k - 1][j] === 0)
            {
              this.state[k - 1][j] = this.state[k][j];
              this.state[k][j] = 0;
              moved = true;
              k--;
            }
            else if (this.state[k - 1][j] === this.state[k][j] && !this.isMerged[k - 1][j])
            {
              this.state[k - 1][j] *= 2;
              this.score += this.state[k - 1][j];
              this.state[k][j] = 0;
              moved = true;
              this.isMerged[k - 1][j] = true;
            }
            else
            {
              break;
            }
          }
        }
      }
    }

    if (moved)
    {
      this.isMerged.forEach(row => row.fill(false));
      this.generateNewTiles();
    }
  }

  moveDown()
  {
    if (this.status !== 'playing')
    {
      return;
    }

    let moved = false;

    for (let i = this.state.length - 2; i >= 0; i--)
    {
      for (let j = 0; j < this.state[i].length; j++)
      {
        if (this.state[i][j] !== 0)
        {
          let k = i;

          while (k < this.state.length - 1 && (this.state[k + 1][j] === 0 || this.state[k + 1][j] === this.state[k][j]))
          {
            if (this.state[k + 1][j] === 0)
            {
              this.state[k + 1][j] = this.state[k][j];
              this.state[k][j] = 0;
              moved = true;
              k++;
            }
            else if (this.state[k + 1][j] === this.state[k][j] && !this.isMerged[k + 1][j])
            {
              this.state[k + 1][j] *= 2;
              this.score += this.state[k + 1][j];
              this.state[k][j] = 0;
              moved = true;
              this.isMerged[k + 1][j] = true;
            }
            else
            {
              break;
            }
          }
        }
      }
    }

    if (moved)
    {
      this.isMerged.forEach(row => row.fill(false));
      this.generateNewTiles();
    }

  }

  /**
   * @returns {number}
   */
  getScore()
  {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState()
  {
    this.getStatus();

    return this.state;
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
  getStatus()
  {
    if (this.state.some(row => row.includes(2048)))
    {
      this.status = 'win';
    }

    if (!this.canMove())
    {
      this.status = 'lose';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start()
  {
    this.status = 'playing';
    this.generateNewTiles();
    this.generateNewTiles();
  }

  /**
   * Resets the game.
   */
  restart()
  {
    this.score = 0;
    this.status = 'idle';
    this.state = this.initialStateRestart.map(row => [...row]);
  }

  // Add your own methods here
  generateNewTiles()
  {

    if (this.status === 'win' || this.status === 'lose')
    {
      return;
    }

    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++)
    {
      for (let j = 0; j < this.state[i].length; j++)
      {
        if (this.state[i][j] === 0)
        {
          emptyCells.push({
            row: i,
            col: j,
          });
        }
      }
    }

    if (emptyCells.length > 0)
    {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  canMove()
  {
    for (let i = 0; i < this.state.length; i++)
    {
      for (let j = 0; j < this.state[i].length; j++)
      {
        if (
          this.state[i][j] === 0
          || (j < this.state[i].length - 1 && this.state[i][j] === this.state[i][j + 1])
          || (i < this.state.length - 1 && this.state[i][j] === this.state[i + 1][j])
        )
        {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
