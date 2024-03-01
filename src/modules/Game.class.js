/* eslint-disable prettier/prettier */
/* eslint-disable brace-style */
/* eslint-disable max-len */
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

    this.initialForRestart = initialState ? initialState.map(row => row.map(cell => cell)) : [
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
    this.tilesMerged = [];
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
              k--;
              moved = true;
            } else if (this.state[i][k - 1] === this.state[i][k])
            {
              this.state[i][k - 1] *= 2;
              this.score += this.state[i][k - 1];
              this.state[i][k] = 0;
              moved = true;
              break;
            }
          }
        }
      }
    }

    if (moved)
    {
      this.generateNewTile();
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
              k++;
              moved = true;
            } else if (this.state[i][k + 1] === this.state[i][k])
            {
              this.state[i][k + 1] *= 2;
              this.score += this.state[i][k + 1];
              this.state[i][k] = 0;
              moved = true;
              break; // Exit loop after merging once
            }
          }
        }
      }
    }

    this.count++;

    if (moved)
    {
      this.generateNewTile();
    }
  }

  moveUp()
  {
    if (this.status !== 'playing')
    {
      return;
    }

    let moved = false;

    for (let j = 0; j < this.state[0].length; j++)
    {
      for (let i = 1; i < this.state.length; i++)
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
              k--;
              moved = true;
            } else if (this.state[k - 1][j] === this.state[k][j])
            {
              this.state[k - 1][j] *= 2;
              this.score += this.state[k - 1][j];
              this.state[k][j] = 0;
              moved = true;
              break; // Exit loop after merging once
            }
          }
        }
      }
    }

    this.count++;

    if (moved)
    {
      this.generateNewTile();
    }
  }

  moveDown()
  {
    if (this.status !== 'playing')
    {
      return;
    }

    let moved = false;

    for (let j = 0; j < this.state[0].length; j++)
    {
      for (let i = this.state.length - 2; i >= 0; i--)
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
              k++;
              moved = true;
            } else if (this.state[k + 1][j] === this.state[k][j])
            {
              this.state[k + 1][j] *= 2;
              this.score += this.state[k + 1][j];
              this.state[k][j] = 0;
              moved = true;
              break; // Exit loop after merging once
            }
          }
        }
      }
    }

    this.count++;

    if (moved)
    {
      this.generateNewTile();
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
      return 'win'; // Check for win condition
    }

    if (!this.canMove())
    {
      return 'lose'; // Check for lose condition
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start()
  {
    if (this.initialState && this.count === 0)
    {
      this.state = this.initialState;
    }

    this.generateNewTile();
    this.generateNewTile();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart(initialState)
  {
    this.score = 0;
    this.status = 'idle';
    this.state = this.initialForRestart.map(row => [...row]);
  }

  // Add your own methods here
  generateNewTile()
  {
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

      // 90% chance for 2, 10% chance for 4
      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }

    // Update the game status after generating a new tile
    this.updateGameStatus();
  }

  updateGameStatus()
  {
    if (this.state.some(row => row.includes(2048)))
    {
      this.status = 'win';
    } else if (!this.canMove())
    {
      this.status = 'lose';
    } else
    {
      this.status = 'playing';
    }
  }

  canMove()
  {
    // Check if there are any empty cells
    for (let i = 0; i < this.state.length; i++)
    {
      for (let j = 0; j < this.state[i].length; j++)
      {
        if (this.state[i][j] === 0)
        {
          return true;
        }
      }
    }

    // Check if there are adjacent cells with the same value
    for (let i = 0; i < this.state.length; i++)
    {
      for (let j = 0; j < this.state[i].length; j++)
      {
        if (
          (j < this.state[i].length - 1 && this.state[i][j] === this.state[i][j + 1]) // Check right
          || (i < this.state.length - 1 && this.state[i][j] === this.state[i + 1][j]) // Check down
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
