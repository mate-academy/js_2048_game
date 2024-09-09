'use strict';

const gameTable = document.querySelector('.game-field');

/* змінна для перевірки кінця гри,
якщо гра програна, керування в обробнику подій блокується */
let isGameOver = false;

class Game {
  constructor(initialState) {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  moveLeft() {
    // ітеруємо по всіх рядках зліва направо
    for (let row = 0; row < 4; row++) {
      let col = 0;

      for (let i = 1; i < 4; i++) {
        // якщо зустрічаєм непусту клітинку
        if (this.state[row][i] !== 0) {
          for (let j = i; j > col; j--) {
            // і якщо наступна пуста
            if (this.state[row][j - 1] === 0) {
              // переміщуєм її туди
              this.state[row][j - 1] = this.state[row][j];
              // попередня стає пуста
              this.state[row][j] = 0;
              // якщо натикаємось на таку саму
            } else if (this.state[row][j - 1] === this.state[row][j]) {
              // наступна клітинка стає х2, а попередня пустою
              this.state[row][j - 1] *= 2;
              this.state[row][j] = 0;
              // оновлення очок на значення злитої клітинки.
              this.score += this.state[row][j - 1];
              // використовується для відстеження останньої непустої клітинки
              col = j;
              break;
            } else {
              col = j - 1;
              break;
            }
          }
        }
      }
    }
    this.addRandomTile();
    this.updateHTML();
    this.updateScore();

    // перевірка на перемогу чи поразку в кінці кожного ходу
    switch (this.getStatus()) {
      case 'lose':
        this.gameOver();
        break;
      case 'win':
        document.querySelector('.message-win').classList.remove('hidden');
        break;
    }
  }

  moveRight() {
    for (let row = 0; row < 4; row++) {
      let col = 3;

      // тепер ітерація справа наліво
      for (let i = 2; i >= 0; i--) {
        if (this.state[row][i] !== 0) {
          for (let j = i; j < col; j++) {
            if (this.state[row][j + 1] === 0) {
              this.state[row][j + 1] = this.state[row][j];
              this.state[row][j] = 0;
            } else if (this.state[row][j + 1] === this.state[row][j]) {
              this.state[row][j + 1] *= 2;
              this.state[row][j] = 0;
              this.score += this.state[row][j + 1];
              col = j;
              break;
            } else {
              col = j + 1;
              break;
            }
          }
        }
      }
    }
    this.addRandomTile();
    this.updateHTML();
    this.updateScore();

    switch (this.getStatus()) {
      case 'lose':
        this.gameOver();
        break;
      case 'win':
        document.querySelector('.message-win').classList.remove('hidden');
        break;
    }
  }

  moveUp() {
    for (let col = 0; col < 4; col++) {
      let row = 0;

      // ітерація по колонках
      for (let i = 1; i < 4; i++) {
        if (this.state[i][col] !== 0) {
          for (let j = i; j > row; j--) {
            if (this.state[j - 1][col] === 0) {
              this.state[j - 1][col] = this.state[j][col];
              this.state[j][col] = 0;
            } else if (this.state[j - 1][col] === this.state[j][col]) {
              this.state[j - 1][col] *= 2;
              this.state[j][col] = 0;
              this.score += this.state[j - 1][col];
              row = j;
              break;
            } else {
              row = j - 1;
              break;
            }
          }
        }
      }
    }
    this.addRandomTile();
    this.updateHTML();
    this.updateScore();

    switch (this.getStatus()) {
      case 'lose':
        this.gameOver();
        break;
      case 'win':
        document.querySelector('.message-win').classList.remove('hidden');
        break;
    }
  }

  moveDown() {
    for (let col = 0; col < 4; col++) {
      let row = 3;

      for (let i = 2; i >= 0; i--) {
        if (this.state[i][col] !== 0) {
          for (let j = i; j < row; j++) {
            if (this.state[j + 1][col] === 0) {
              this.state[j + 1][col] = this.state[j][col];
              this.state[j][col] = 0;
            } else if (this.state[j + 1][col] === this.state[j][col]) {
              this.state[j + 1][col] *= 2;
              this.state[j][col] = 0;
              this.score += this.state[j + 1][col];
              row = j;
              break;
            } else {
              row = j + 1;
              break;
            }
          }
        }
      }
    }
    this.addRandomTile();
    this.updateHTML();
    this.updateScore();

    switch (this.getStatus()) {
      case 'lose':
        this.gameOver();
        break;
      case 'win':
        document.querySelector('.message-win').classList.remove('hidden');
        break;
    }
  }

  getStatus() {
    // метод для перевірки можливості ходів нижче
    const isAnyMovePossible = this.isAnyMovePossible();

    // перевірка чи масив містить 2048
    const hasWon = this.state.some((row) => row.includes(2048));

    if (hasWon) {
      return 'win';
    } else if (!isAnyMovePossible) {
      return 'lose';
    } else {
      return 'playing';
    }
  }

  isAnyMovePossible() {
    /* якщо є хоча б одне порожнє місце або є
     сусідні плитки з однаковими числами, то є можливий хід */
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  gameOver() {
    document.querySelector('.message-lose').classList.remove('hidden');
    isGameOver = true;
  }

  start() {
    // створюєм копію початкового масиву, щоб працювати з нею в подальшому
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.updateHTML();

    /* метод addRandomTile додає рандомну клітинку в пустому місці поля,
    тому викликаєм його двічі для кнопки старт */
    for (let i = 0; i < 2; i++) {
      this.addRandomTile();
    }
  }

  addRandomTile() {
    let row, col;

    do {
      /* для колонок і рядків створюєм рандомне число між 0 і 3
      (бо індекси в js поч з 0) і присвоюєм числа в масив стану */
      row = Math.floor(Math.random() * 4);
      col = Math.floor(Math.random() * 4);
    } while (this.state[row][col] !== 0);

    // 10% шансом може з'явитись 4:
    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;

    // вибираєм клітинку в самому HTML
    const cell = gameTable.rows[row].cells[col];

    /* присвоюєм вміст клітинки згідно масиву, додаєм клас
    (напр field-cell--2 щоб клітинки відрізнялись по кольору)
    для кольору і для анімації появи */
    cell.textContent = this.state[row][col];
    cell.classList.add(`field-cell--${this.state[row][col]}`);
    cell.classList.add('slide-in-down');

    setTimeout(() => {
      cell.classList.remove('slide-in-down');
    }, 300); // час, відповідний тривалості переходу в CSS
  }

  updateHTML() {
    /* метод для оновлення стану поля згідно числам в масиві state.
    ітеруєм по всіх рядках і колонках поля */
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = gameTable.rows[row].cells[col];

        // якщо число в масиві 0, то і вміст клітинки буде пустий
        cell.textContent = this.state[row][col] || '';

        /* якщо число в масиві яке відповідає за дану клітинку 0,
        то скидаєм клас до стандартного, щоб був колір пустої плитки,
        якщо клітинка не пуста, до додаєм клас до неї (сам клас css -
        таке ж число як в масиві, тому ними зручно маніпулювати) */
        cell.className = 'field-cell';

        if (this.state[row][col]) {
          cell.classList.add(`field-cell--${this.state[row][col]}`);
        }
      }
    }
  }

  updateScore() {
    // оновлення очок відбувається при рухові поля, значення береться із об'єкта
    const scores = document.querySelector('.game-score');

    scores.textContent = this.score;
  }
}

const game = new Game();

const startBtn = document.querySelector('.start');

startBtn.addEventListener('click', () => {
  /* при нажиманні на кнопку старт, викликаєм відповідний метод
  з класу і перетворюєм кнопку на рестарт, скидаєм щотчик очок */
  game.start();
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.innerText = 'Restart';
  game.score = 0;
  game.updateScore();

  // перезапуск гри якщо гравець програв
  if (isGameOver) {
    document.querySelector('.message-lose').classList.add('hidden');
    isGameOver = false;
  }
});

document.addEventListener('keydown', (e) => {
  /* додаємо керування стрілками на клавіатурі.
   запобігаєм стандартній поведінці клавіш */
  if (!isGameOver) {
    e.preventDefault();

    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
    }
  }
});
