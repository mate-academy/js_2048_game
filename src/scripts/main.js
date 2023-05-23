'use strict';

const root = document.querySelector('.container');

let masNumbers = [
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
];

let gameStart = false;
let createGamer = false;
let endGame = false;
let winOrLose = false;

let score = 0;

render();

function render() {
  const header = `
    <div class="game-header">
      <h1>2048</h1>
      <div class="controls">
        <p class="info">
          Score: <span class="game-score">${score}</span>
        </p>
        <button
          class="button ${gameStart ? 'restart' : 'start'}"
        ><span>${gameStart ? 'Restart' : 'Start'}</span></button>
      </div>
    </div>
  `;

  const main = `
    <table class="game-field">
      <tbody>
        <tr class="field-row">
        ${masNumbers[0]
    .map(
      (numb) => `<td class="field-cell field-cell--${numb}">${numb}</td>`
    )
    .join('')}
        </tr>

        <tr class="field-row">
          ${masNumbers[1]
    .map(
      (numb) =>
        `<td class="field-cell field-cell--${numb}">${numb}</td>`
    )
    .join('')}
        </tr>

        <tr class="field-row">
          ${masNumbers[2]
    .map(
      (numb) =>
        `<td class="field-cell field-cell--${numb}">${numb}</td>`
    )
    .join('')}
        </tr>

        <tr class="field-row">
          ${masNumbers[3]
    .map(
      (numb) =>
        `<td class="field-cell field-cell--${numb}">${numb}</td>`
    )
    .join('')}
        </tr>
      </tbody>
    </table>
  `;

  const footer = `
    <div class="message-container">
      <p class="message message-lose ${
  endGame ? (winOrLose ? 'hidden' : '') : 'hidden'
}">You lose! Restart the game?</p>
      <p class="message message-win ${
  endGame ? (winOrLose ? '' : 'hidden') : 'hidden'
}">Winner! Congrats! You did it!</p>
      <p class="message message-start" ${createGamer ? 'hidden' : ''}>
        Press "Start" to begin game. Good luck!
      </p>
    </div>
  `;

  root.innerHTML = `${header}${main}${footer}`;

  const buttonStart = root.querySelector('.button');

  buttonStart.addEventListener('click', GameController);
}

document.addEventListener('keydown', (ev) => {
  if (endGame) {
    return;
  }

  if (!createGamer) {
    return;
  }

  switch (ev.key) {
    case 'ArrowUp':
      const copyUp = up();

      if (checkCopy(copyUp)) {
        masNumbers = copyUp;
        spawnNumb();
      } else {
        loseOrNo ();
      }
      render();
      break;
    case 'ArrowDown':
      const copyDown = down();

      if (checkCopy(copyDown)) {
        masNumbers = copyDown;
        spawnNumb();
      } else {
        loseOrNo ();
      }
      render();
      break;
    case 'ArrowLeft':
      const copyLeft = left();

      if (checkCopy(copyLeft)) {
        masNumbers = copyLeft;
        spawnNumb();
      } else {
        loseOrNo ();
      }
      render();
      break;
    case 'ArrowRight':
      const copyRigth = rigth();

      if (checkCopy(copyRigth)) {
        masNumbers = copyRigth;
        spawnNumb();
      } else {
        loseOrNo ();
      }
      render();
      break;
    default:
      break;
  }
});

function GameController() {
  if (gameStart) {
    restart();

    return;
  }

  if (createGamer) {
    clear();
  }
  createGamer = true;
  score = 0;
  spawnNumb();
  spawnNumb();

  render();
}

function restart() {
  clear();
  score = 0;
  gameStart = false;
  endGame = false;
  winOrLose = false;
  GameController();
}

function clear() {
  masNumbers = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];
}

function twoOrFour() {
  if (Math.floor(Math.random() * 11) > 9) {
    return 4;
  } else {
    return 2;
  }
}

function spawnNumb() {
  const indexOfEmpty = [];

  for (let i = 0; i < masNumbers.length; i++) {
    for (let j = 0; j < masNumbers[0].length; j++) {
      if (masNumbers[i][j] === '') {
        indexOfEmpty.push({
          x: i,
          y: j,
        });
      }
    }
  }

  if (indexOfEmpty.length === 0) {
    endGame = true;

    return;
  }

  const newPosition = Math.floor(Math.random() * indexOfEmpty.length);

  masNumbers[indexOfEmpty[newPosition].x][indexOfEmpty[newPosition].y]
    = twoOrFour();
}

function up() {
  gameStart = true;

  let copy = createCopy();

  for (let j = 0; j < copy.length; j++) {
    let temp = [];

    for (let i = 0; i < copy.length; i++) {
      temp.push(copy[i][j]);
    }
    temp = slide(temp);

    for (let i = 0; i < copy.length; i++) {
      copy[i][j] = '';
    }

    for (let i = 0; i < temp.length; i++) {
      copy[i][j] = temp[i];
    }
  }

  return copy;
}

function down() {
  gameStart = true;
  
  let copy = createCopy();

  for (let j = 0; j < copy.length; j++) {
    let temp = [];

    for (let i = 0; i < copy.length; i++) {
      temp.push(copy[i][j]);
    }
    temp = slide(temp).reverse();

    for (let i = 0; i < copy.length; i++) {
      copy[i][j] = '';
    }

    for (let i = copy.length - 1, k = 0; k < temp.length; k++, i--) {
      copy[i][j] = temp[k];
    }
  }

  return copy;
}

function left() {
  gameStart = true;

  let copy = createCopy();

  for (let i = 0; i < copy.length; i++) {
    const teml = slide(copy[i]);

    copy[i].forEach((el, index, mas) => (mas[index] = ''));

    for (let j = 0; j < teml.length; j++) {
      copy[i][j] = teml[j];
    }
  }

  return copy;
}

function rigth() {
  gameStart = true;

  let copy = createCopy();

  for (let i = 0; i < copy.length; i++) {
    const teml = slide(copy[i]).reverse();

    copy[i].forEach((el, index, mas) => (mas[index] = ''));

    for (let k = 0, j = copy.length - 1; k < teml.length; k++, j--) {
      copy[i][j] = teml[k];
    }
  }

  return copy;
}

function slide(masiv) {
  const mas = masiv.filter((x) => x !== '');

  for (let i = 1; i < mas.length; i++) {
    if (mas[i] === mas[i - 1]) {
      mas[i - 1] = mas[i] + mas[i];
      score += mas[i - 1];

      if (score >= 2048) {
        endGame = true;
        winOrLose = true;
      }
      mas[i] = '';
    }
  }

  return mas.filter((x) => x !== '');
}

function createCopy() {
  let copy = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];

  for (let i = 0; i < masNumbers.length; i++) {
    for (let j = 0; j < masNumbers[i].length; j++) {
      copy[i][j] = masNumbers[i][j];
    }
  }

  return copy;
}

function checkCopy(copy) {
  for (let i = 0; i < masNumbers.length; i++) {
    for (let j = 0; j < masNumbers[i].length; j++) {
      if (masNumbers[i][j] !== copy[i][j]) {
        return true;
      }
    }
  }
  return false;
}

function loseOrNo () {
  const l =  checkCopy(left());
  const r =  checkCopy(rigth());
  const u =  checkCopy(up());
  const d = checkCopy(down());

  if (l || r || u || d) {
    return;
  } else {
    endGame = true;
    winOrLose = false;
  }
}
