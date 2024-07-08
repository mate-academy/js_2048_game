'use strict';

class Game {

  static STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  }

  static INITIAL_STATE = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ]

  constructor(initialState = Game.INITIAL_STATE) {
    this.initialState = initialState;
    this.score = 0;
    this.status = Game.STATUS.idle;
    this.state = this.initialState.map((row) => row.slice())
    
  }

  moveLeft() {
    if (this.status === Game.STATUS.playing) {
      const newStateArr = [];
      for (let i = 0; i < this.state.length; i++) {
          // this code remove all 0 and push it back to the end
          
          let newRowArr = this.state[i].filter(el=> el > 0);
          for(let i = newRowArr.length; i < this.state.length; i++) {
              newRowArr.push(0);
          }
          
          
          // Here i merged neigber numbers in row
          for (let j = 0; j < newRowArr.length; j++) {
              if (newRowArr[j] === newRowArr[j + 1]) {
                  newRowArr[j] = newRowArr[j] + newRowArr[j + 1];
                  newRowArr[j + 1] = 0;
                  this.score += newRowArr[j] + newRowArr[j + 1]; 
              }
          }

          // this code remove all 0 and push it back to the end (The same as previus **Better to create a method)
          newRowArr = newRowArr.filter(el=> el > 0);
          for(let i = newRowArr.length; i < this.state.length; i++) {
              newRowArr.push(0);
          }
          
          newStateArr.push(newRowArr)
      }
      if(!(this.checkSameArr(newStateArr))) {
          this.state = newStateArr;
          this.randomNumber();
      }
      this.loseOrWin()
    };  
  }
  moveRight() {
      if (this.status === Game.STATUS.playing) {
        const newStateArr = [];
        for (let i = 0; i < this.state.length; i++) {
            // this code remove all 0 and unshift it back to the end
            
            let newRowArr = this.state[i].filter(el=> el > 0);
            for(let i = newRowArr.length; i < this.state.length; i++) {
                newRowArr.unshift(0);
            }
            
            
            //   Here i merged neigber numbers in row
            for (let j = newRowArr.length - 1; j > 0; j--) {
              if (newRowArr[j] === newRowArr[j - 1]) {
                newRowArr[j] = newRowArr[j] + newRowArr[j - 1];
                newRowArr[j - 1] = 0;
                this.score += newRowArr[j] + newRowArr[j - 1]; 
              }
            }
    
          
            newRowArr = newRowArr.filter(el=> el > 0);
            for(let i = newRowArr.length; i < this.state.length; i++) {
                newRowArr.unshift(0);
            }
            
            newStateArr.push(newRowArr)
      }
        
      if(!(this.checkSameArr(newStateArr))) {
          this.state = newStateArr;
          this.randomNumber();
      }
      this.loseOrWin()
    };  
  }
  moveUp() {
    if (this.status === Game.STATUS.playing) {
      let newStateArr = []
      
      this.funcReverse(newStateArr);
      this.state = newStateArr;

      newStateArr = [];
      this.moveLeft();

      this.funcReverse(newStateArr);
      this.state = newStateArr;
    }
  }
  moveDown() {
      if (this.status === Game.STATUS.playing) {
      let newStateArr = []
      
      this.funcReverse(newStateArr);
      this.state = newStateArr;

      newStateArr = [];
      this.moveRight();
      
      this.funcReverse(newStateArr);
      this.state = newStateArr;
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
      return this.state;
  }

  getStatus() {
    return this.status;
  }

  restart() {
    this.initialState = Game.INITIAL_STATE;
    this.state = this.initialState.map((row) => row.slice());
    this.start()
  }

  start() {
    this.score = 0;
    this.status = Game.STATUS.playing;
    this.randomNumber();
  }

  randomNumber() {

    const emptyCells = [];
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }


    if (emptyCells.length === 0) {
      return;
    }


    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    // Place a 2 or 4 in the selected cell
    const newValue = Math.random() < 0.8 ? 2 : 4;
    this.state[row][col] = newValue;
  }

  loseOrWin() {
    let isZero = false;
    let hasMove = false;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
              this.status = Game.STATUS.win;
              return;
        }
        if (this.state[i][j] === 0) {
              isZero = true;
        }
        // Check for possible moves horizontally and vertically -- Also AI helped to check
        if (j < this.state[i].length - 1 && this.state[i][j] === this.state[i][j + 1]) {
          hasMove = true;
        }

        if (i < this.state.length - 1 && this.state[i][j] === this.state[i + 1][j]) {
          hasMove = true;
        }
      }
    }

    if (!isZero && !hasMove) {
        this.status = Game.STATUS.lose;
    }
  }
    
  // AI helped to compare the Arrays    
  checkSameArr(firstArr, secondArr = this.state) {
    if (firstArr.length !== secondArr.length) {
      return false;
    }
    
    for (let i = 0; i < firstArr.length; i++) {
      if (Array.isArray(firstArr[i]) && Array.isArray(secondArr[i])) {
        // Recursively check for nested arrays
        if (!this.checkSameArr(firstArr[i], secondArr[i])) {
          return false;
        }
      } else if (firstArr[i] !== secondArr[i]) {
        return false;
      }
    }
    
    return true;
  }

  funcReverse(newStateArr) {
    for (let i = 0; i < this.state.length; i++) {
      const newRowArr = []
      for(let j = 0; j < this.state[i].length; j++) {
          newRowArr.push(this.state[j][i])
      }
      newStateArr.push(newRowArr);
    }
  }
}

module.exports = Game;