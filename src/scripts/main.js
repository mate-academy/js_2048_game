'use strict';

const scores = document.querySelector('.game-score');
const bestScores = document.querySelector('.best-score');
const button = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

bestScores.textContent = localStorage.getItem('best') || 0;

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');

    button.textContent = 'Restart';

    startMessage.classList.add('hidden');
  } else {
    [...cells].forEach(cell => {
      if (filledCheck(cell)) {
        cell.children[0].remove();
      }
    });

    if (!winMessage.classList.contains('hidden')) {
      winMessage.classList.add('hidden');
    }

    if (!loseMessage.classList.contains('hidden')) {
      loseMessage.classList.add('hidden');
    }

    scores.textContent = 0;
  }

  addCard();
  addCard();
});

// creating a variable 'move' to store any moves of cards
// to understand is it necessary to add a new card;
let move = 0;

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowDown':
      goDown();
      break;
    case 'ArrowUp':
      goUp();
      break;
    case 'ArrowRight':
      goRight();
      break;
    case 'ArrowLeft':
      goLeft();
      break;
  }

  if (move > 0) {
    setTimeout(addCard, 150);

    move = 0;
  }

  function goDown() {
    downMerge();
    downShift();

    function downMerge() {
      for (let i = (cells.length - 1); i >= 0; i--) {
        if (filledCheck(cells[i])) {
          const sumCard = cells[i].children[0];
          const current = sumCard.textContent;

          for (let j = (i - 4); j >= 0; j -= 4) {
            if (filledCheck(cells[j])) {
              const addedCard = cells[j].children[0];

              if (addedCard.textContent === current) {
                const steps = (i - j) / 4;

                merge(sumCard, addedCard, current, steps, 'down');
              }

              break;
            }
          }
        }
      }
    }

    function downShift() {
      for (let i = (cells.length - 1); i >= 0; i--) {
        if (filledCheck(cells[i])) {
          let newIndex;

          for (let j = (i + 4); j < cells.length; j += 4) {
            if (emptyCheck(cells[j])) {
              newIndex = j;
            } else {
              break;
            }
          }

          if (newIndex >= 0) {
            const steps = (newIndex - i) / 4;
            const currentCard = cells[i].children[0];

            shift(currentCard, newIndex, steps, 'down');
          }
        }
      }
    }
  }

  function goUp() {
    upMerge();
    upShift();

    function upMerge() {
      for (let i = 0; i < cells.length; i++) {
        if (filledCheck(cells[i])) {
          const sumCard = cells[i].children[0];
          const current = sumCard.textContent;

          for (let j = (i + 4); j < cells.length; j += 4) {
            if (filledCheck(cells[j])) {
              const addedCard = cells[j].children[0];

              if (addedCard.textContent === current) {
                const steps = (j - i) / 4;

                merge(sumCard, addedCard, current, steps, 'up');
              }

              break;
            }
          }
        }
      }
    }

    function upShift() {
      for (let i = 0; i < cells.length; i++) {
        if (filledCheck(cells[i])) {
          let newIndex;

          for (let j = (i - 4); j >= 0; j -= 4) {
            if (emptyCheck(cells[j])) {
              newIndex = j;
            } else {
              break;
            }
          }

          if (newIndex >= 0) {
            const steps = (i - newIndex) / 4;
            const currentCard = cells[i].children[0];

            shift(currentCard, newIndex, steps, 'up');
          }
        }
      }
    }
  }

  function goRight() {
    rightMerge();
    rightShift();

    function rightMerge() {
      let min = cells.length - 4;

      for (let i = (cells.length - 1); i >= 0; i--) {
        if (i < min) {
          min -= 4;
        }

        if (filledCheck(cells[i])) {
          const sumCard = cells[i].children[0];
          const current = sumCard.textContent;

          for (let j = (i - 1); j >= min; j--) {
            if (filledCheck(cells[j])) {
              const addedCard = cells[j].children[0];

              if (addedCard.textContent === current) {
                const steps = i - j;

                merge(sumCard, addedCard, current, steps, 'right');
              }

              break;
            }
          }
        }
      }
    }

    function rightShift() {
      let max = cells.length;

      for (let i = (cells.length - 1); i >= 0; i--) {
        if (i < (max - 4)) {
          max -= 4;
        }

        if (filledCheck(cells[i])) {
          let newIndex;

          for (let j = (i + 1); j < max; j++) {
            if (emptyCheck(cells[j])) {
              newIndex = j;
            } else {
              break;
            }
          }

          if (newIndex >= 0) {
            const steps = newIndex - i;
            const currentCard = cells[i].children[0];

            shift(currentCard, newIndex, steps, 'right');
          }
        }
      }
    }
  }

  function goLeft() {
    leftMerge();
    leftShift();

    function leftShift() {
      let min = 0;

      for (let i = 0; i < cells.length; i++) {
        if (i === (min + 4)) {
          min += 4;
        }

        if (filledCheck(cells[i])) {
          let newIndex;

          for (let j = (i - 1); j >= min; j--) {
            if (emptyCheck(cells[j])) {
              newIndex = j;
            } else {
              break;
            }
          }

          if (newIndex >= 0) {
            const steps = i - newIndex;
            const currentCard = cells[i].children[0];

            shift(currentCard, newIndex, steps, 'left');
          }
        }
      }
    }

    function leftMerge() {
      let max = 4;

      for (let i = 0; i < cells.length; i++) {
        if (i === max) {
          max += 4;
        }

        if (filledCheck(cells[i])) {
          const sumCard = cells[i].children[0];
          const current = sumCard.textContent;

          for (let j = (i + 1); j < max; j++) {
            if (filledCheck(cells[j])) {
              const addedCard = cells[j].children[0];

              if (addedCard.textContent === current) {
                const steps = j - i;

                merge(sumCard, addedCard, current, steps, 'left');
              }

              break;
            }
          }
        }
      }
    }
  }

  function merge(sumCard, addedCard, current, steps, direction) {
    let sign;
    let axis;

    switch (direction) {
      case 'down':
        sign = '-';
        axis = 'Y';
        break;
      case 'up':
        sign = '+';
        axis = 'Y';
        break;
      case 'right':
        sign = '-';
        axis = 'X';
        break;
      case 'left':
        sign = '+';
        axis = 'X';
        break;
    }

    sumCard.classList.remove(`field-cell__card--${current}`);

    sumCard.classList.add(`field-cell__card--${current * 2}`);
    sumCard.textContent = current * 2;

    addedCard.remove();

    const movedCard = document.createElement('div');

    movedCard.classList.add('field-cell__moved-card');
    movedCard.classList.add(`field-cell__moved-card--${current}`);
    movedCard.textContent = current;

    sumCard.append(movedCard);

    movedCard.style.transform = `
      translate${axis}(calc(${sign}${steps} * (100% + 10px)))
    `;

    setTimeout(() => {
      movedCard.style.transform = `translateY(0)`;
    }, 0);

    setTimeout(() => {
      movedCard.remove();
      sumCard.style.transform = 'scale(1.1)';

      setTimeout(() => {
        sumCard.style.transform = 'scale(1.0)';
      }, 150);
    }, 150);

    scores.textContent = +scores.textContent + current * 2;

    if (scores.textContent > +bestScores.textContent) {
      localStorage.setItem('best', scores.textContent);
      bestScores.textContent = localStorage.getItem('best');
    }

    if ((current * 2) === 2048) {
      winMessage.classList.remove('hidden');
    }

    move++;
  }

  function shift(currentCard, newIndex, steps, direction) {
    let sign;
    let axis;

    switch (direction) {
      case 'down':
        sign = '-';
        axis = 'Y';
        break;
      case 'up':
        sign = '+';
        axis = 'Y';
        break;
      case 'right':
        sign = '-';
        axis = 'X';
        break;
      case 'left':
        sign = '+';
        axis = 'X';
        break;
    }

    currentCard.remove();

    cells[newIndex].append(currentCard);

    currentCard.style.transform = `
      translate${axis}(calc(${sign}${steps} * (100% + 10px)))
    `;

    setTimeout(() => {
      currentCard.style.transform = `translate${axis}(0)`;
    }, 0);

    move++;
  }
});

function addCard() {
  const emptyCells = [...cells].filter(cell => emptyCheck(cell));
  const maxIndex = emptyCells.length;

  const randomIndex = Math.floor(Math.random() * maxIndex);
  const randomNumber = Math.floor(Math.random() * 10) + 1;

  const newCard = document.createElement('div');

  newCard.classList.add('field-cell__card');

  if (randomNumber === 4) {
    newCard.classList.add('field-cell__card--4');
    newCard.textContent = 4;
  } else {
    newCard.classList.add('field-cell__card--2');
    newCard.textContent = 2;
  }

  emptyCells[randomIndex].append(newCard);

  newCard.style.transform = 'scale(0.5)';

  setTimeout(() => {
    newCard.style.transform = 'scale(1.0)';
  }, 75);

  // checking if is there any possible moves
  // to discover whether the game is lost
  if (maxIndex === 1) {
    const currentMove = move;

    for (let i = (cells.length - 1); i >= 0; i--) {
      if (filledCheck(cells[i])) {
        const sumCard = cells[i].children[0];
        const current = sumCard.textContent;

        for (let j = (i - 4); j >= 0; j -= 4) {
          if (filledCheck(cells[j])) {
            const addedCard = cells[j].children[0];

            if (addedCard.textContent === current) {
              move++;
            }

            break;
          }
        }
      }
    }

    for (let i = 0; i < cells.length; i++) {
      if (filledCheck(cells[i])) {
        const sumCard = cells[i].children[0];
        const current = sumCard.textContent;

        for (let j = (i + 4); j < cells.length; j += 4) {
          if (filledCheck(cells[j])) {
            const addedCard = cells[j].children[0];

            if (addedCard.textContent === current) {
              move++;
            }

            break;
          }
        }
      }
    }

    let min = cells.length - 4;

    for (let i = (cells.length - 1); i >= 0; i--) {
      if (i < min) {
        min -= 4;
      }

      if (filledCheck(cells[i])) {
        const sumCard = cells[i].children[0];
        const current = sumCard.textContent;

        for (let j = (i - 1); j >= min; j--) {
          if (filledCheck(cells[j])) {
            const addedCard = cells[j].children[0];

            if (addedCard.textContent === current) {
              move++;
            }

            break;
          }
        }
      }
    }

    let max = 4;

    for (let i = 0; i < cells.length; i++) {
      if (i === max) {
        max += 4;
      }

      if (filledCheck(cells[i])) {
        const sumCard = cells[i].children[0];
        const current = sumCard.textContent;

        for (let j = (i + 1); j < max; j++) {
          if (filledCheck(cells[j])) {
            const addedCard = cells[j].children[0];

            if (addedCard.textContent === current) {
              move++;
            }

            break;
          }
        }
      }
    }

    if (currentMove === move) {
      if (!winMessage.classList.contains('hidden')) {
        winMessage.classList.add('hidden');
      }

      loseMessage.classList.remove('hidden');
    }
  }
}

function emptyCheck(cell) {
  return cell.children.length === 0;
}

function filledCheck(cell) {
  return cell.children.length === 1;
}
