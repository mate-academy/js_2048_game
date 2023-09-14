document.addEventListener('DOMContentLoaded', () =>  {
  const gridDisplay = document.querySelector('.grid');
  const scoreDisplay = document.querySelector('.game-score');
  let cellsCount = [];
  const width = 4;
  let score = 0;
  const elementScore = document.querySelector('.game-score');
  let countScore = +(document.querySelector('.game-score').textContent);
  const startButton = document.querySelector('.start');

  // select messages of the game

  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

    // create the playing board
    function createBoard() {
      for (let i=0; i < width*width; i++) {
        square = document.createElement('div');
        square.innerHTML = 0;
        gridDisplay.appendChild(square);
        cellsCount.push(square);
      }
    }
    createBoard();

  // create start button

  startButton.addEventListener('click', (e) => {
    if (e.target.classList.contains('restart')) {
      for (const cell of cellsCount) {
        cell.className = 'field-cell';
        cell.textContent = '';
      }
  
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      countScore = 0;
      score = 0;
      elementScore.innerHTML = 0;
    }
  
    if (e.target.classList.contains('start')) {
      e.target.classList.remove('start');
      e.target.classList.add('restart');
      e.target.textContent = 'Restart';
      startMessage.hidden = true;
      countScore = 0;
      score = 0;
      startMessage.classList.add('hidden');
    }
    generate();
    generate();
  });

  //generate a random number

  function generate() {
    randomNumber = Math.floor(Math.random() * cellsCount.length);
    if (cellsCount[randomNumber].innerHTML == 0) {
      cellsCount[randomNumber].innerHTML = 2;
    } else generate();
  }

  function moveRight() {
    for (let i=0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = cellsCount[i].innerHTML;
        let totalTwo = cellsCount[i+1].innerHTML;
        let totalThree = cellsCount[i+2].innerHTML;
        let totalFour = cellsCount[i+3].innerHTML;
        let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

        let filteredRow = row.filter(num => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill('0');
        let newRow = zeros.concat(filteredRow);

        cellsCount[i].innerHTML = newRow[0];
        cellsCount[i +1].innerHTML = newRow[1];
        cellsCount[i +2].innerHTML = newRow[2];
        cellsCount[i +3].innerHTML = newRow[3];
      }
    }
  }

  function moveLeft() {
    for (let i=0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = cellsCount[i].innerHTML;
        let totalTwo = cellsCount[i+1].innerHTML;
        let totalThree = cellsCount[i+2].innerHTML;
        let totalFour = cellsCount[i+3].innerHTML;
        let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

        let filteredRow = row.filter(num => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill('0');
        let newRow = filteredRow.concat(zeros);

        cellsCount[i].innerHTML = newRow[0];
        cellsCount[i +1].innerHTML = newRow[1];
        cellsCount[i +2].innerHTML = newRow[2];
        cellsCount[i +3].innerHTML = newRow[3];
      }
    }
  }


  function moveUp() {
    for (let i=0; i < 4; i++) {
      let totalOne = cellsCount[i].innerHTML;
      let totalTwo = cellsCount[i+width].innerHTML;
      let totalThree = cellsCount[i+(width*2)].innerHTML;
      let totalFour = cellsCount[i+(width*3)].innerHTML;
      let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      let filteredColumn = column.filter(num => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill('0');
      let newColumn = filteredColumn.concat(zeros);

      cellsCount[i].innerHTML = newColumn[0];
      cellsCount[i +width].innerHTML = newColumn[1];
      cellsCount[i+(width*2)].innerHTML = newColumn[2];
      cellsCount[i+(width*3)].innerHTML = newColumn[3];
    }
  }

  function moveDown() {
    for (let i=0; i < 4; i++) {
      let totalOne = cellsCount[i].innerHTML;
      let totalTwo = cellsCount[i+width].innerHTML;
      let totalThree = cellsCount[i+(width*2)].innerHTML;
      let totalFour = cellsCount[i+(width*3)].innerHTML;
      let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      let filteredColumn = column.filter(num => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill('0');
      let newColumn = zeros.concat(filteredColumn);

      cellsCount[i].innerHTML = newColumn[0];
      cellsCount[i +width].innerHTML = newColumn[1];
      cellsCount[i+(width*2)].innerHTML = newColumn[2];
      cellsCount[i+(width*3)].innerHTML = newColumn[3];
    }
  }

  function combineRow() {
    for (let i =0; i < 15; i++) {
      if (cellsCount[i].innerHTML === cellsCount[i +1].innerHTML) {
        let combinedTotal = parseInt(cellsCount[i].innerHTML) + parseInt(cellsCount[i +1].innerHTML);
        cellsCount[i].innerHTML = combinedTotal;
        cellsCount[i +1].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    check()
  }

  function combineColumn() {
    for (let i =0; i < 12; i++) {
      if (cellsCount[i].innerHTML === cellsCount[i +width].innerHTML) {
        let combinedTotal = parseInt(cellsCount[i].innerHTML) + parseInt(cellsCount[i +width].innerHTML);
        cellsCount[i].innerHTML = combinedTotal;
        cellsCount[i +width].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    check()
  }

  //assign functions to keyCodes
  
  function control(e) {
    if(document.querySelector('.restart')!==null) {
      switch(e.keyCode){
        case 37:
          keyLeft();
          break;
        case 38:
          keyUp();
          break;
        case 39:
          keyRight();
          break;
        case 40:
          keyDown();
          break;
      }
    }
    return;
  }
  document.addEventListener('keyup', control);

  // pressing keys
  function keyRight() {
    moveRight();
    combineRow();
    moveRight();
    generate();
  }

  function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
    generate();
  }

  function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
    generate();
  }

  function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
    generate();
  }

  // check for win or lose

  function check() {
    let cellsOpen = 0;
  
    for (const cell of cellsCount) {
      if (cell.innerHTML === '2048') {
        winMessage.classList.remove('hidden');
      };
  
      if (cell.innerHTML === '') {
        cellsOpen ++;
      };
    }
  
    if (cellsOpen === 0) {
      let canMove = 0;
  
      for (let i = 0; i < 15; i++) {
        if (cellsCount[i].innerHTML === cellsCount[i + 1].innerHTML
          && cellsCount[i].innerHTML !== '') {
            canMove++;
        }
      }
  
      for (let i = 0; i < 12; i++) {
        if (cellsCount[i].innerHTML === cellsCount[i + 4].innerHTML
          && cellsCount[i].innerHTML !== '') {
            canMove++;
        }
      }
  
      if (canMove === 0) {
        loseMessage.classList.remove('hidden');
      }
    }
  }

  //clear timer

  function clear() {
    clearInterval(myTimer);
  }

  //add colours

  function addColours() {
    for (let i=0; i < cellsCount.length; i++) {
      if (cellsCount[i].innerHTML == 0) {
        cellsCount[i].style.backgroundColor = '#afa192';
        cellsCount[i].style.color = '#afa192';
      } else if (cellsCount[i].innerHTML == 2) {
        cellsCount[i].style.backgroundColor = '#eee4da';
        cellsCount[i].style.color = '#afa192';
      } else if (cellsCount[i].innerHTML  == 4) {
        cellsCount[i].style.backgroundColor = '#ede0c8';
        cellsCount[i].style.color = '#afa192';
      } else if (cellsCount[i].innerHTML  == 8) {
        cellsCount[i].style.backgroundColor = '#f2b179';
        cellsCount[i].style.color = '#f9f6f2';
      } else if (cellsCount[i].innerHTML  == 16) {
        cellsCount[i].style.backgroundColor = '#f59563';
        cellsCount[i].style.color = '#f9f6f2';
      } else if (cellsCount[i].innerHTML  == 32) {
        cellsCount[i].style.backgroundColor = '#f67c5f';
        cellsCount[i].style.color = '#f9f6f2';
      } else if (cellsCount[i].innerHTML == 64) {
        cellsCount[i].style.backgroundColor = '#f65e3b';
        cellsCount[i].style.color = '#f9f6f2';
      } else if (cellsCount[i].innerHTML == 128) {
        cellsCount[i].style.backgroundColor = '#edcf72';
        cellsCount[i].style.color = '#f9f6f2';
      } else if (cellsCount[i].innerHTML == 256) {
        cellsCount[i].style.backgroundColor = '#edcc61';
        cellsCount[i].style.color = '#f9f6f2';
      } else if (cellsCount[i].innerHTML == 512) {
        cellsCount[i].style.backgroundColor = '#edc850';
        cellsCount[i].style.color = '#f9f6f2';
      } else if (cellsCount[i].innerHTML == 1024) {
        cellsCount[i].style.backgroundColor = '#edc53f';
        cellsCount[i].style.color = '#f9f6f2';
      } else if (cellsCount[i].innerHTML == 2048) {
        cellsCount[i].style.backgroundColor = '#edc22e';
        cellsCount[i].style.color = '#f9f6f2';
      }
    }
}
addColours();

var myTimer = setInterval(addColours, 50)

})