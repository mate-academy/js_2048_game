export function preenche(state) {
  // Preenche tabela
  for (let i = 0; i < state.length; i++) {
    const row = document.querySelectorAll('.field-row')[i];

    for (let j = 0; j < state.length; j++) {
      const cell = row.querySelectorAll('.field-cell')[j];

      if (state[i][j] % 2 === 0 && state[i][j] >= 2 && state[i][j] <= 2048) {
        cell.classList.add(`field-cell--${state[i][j]}`);
        cell.textContent = state[i][j];
      } else {
        let vet = [];

        vet = cell.className.split(' ');

        if (vet.length > 1) {
          for (let k = 1; k < vet.length; k++) {
            cell.classList.remove(vet[k]);
          }
        }

        cell.textContent = state[i][j];
      }
    }
  }
}

export function showMessage(type) {
  // Mostra menssagem
  document.querySelectorAll('.message').forEach((msg) => {
    msg.classList.add('hidden');
  });

  const messageToShow = document.querySelector(`.message-${type}`);

  if (messageToShow) {
    messageToShow.classList.remove('hidden');
  }
}

export function hideMessages() {
  // Mostra menssagem
  document.querySelectorAll('.message').forEach((msg) => {
    msg.classList.add('hidden');
  });
}

export function changeScore(score) {
  // Mostra menssagem
  const scoreTemp = document.querySelector('.game-score');

  scoreTemp.textContent = score;
}

export function randomNumber() {
  const r = Math.random();

  if (r < 0.9) {
    return 2;
  } else {
    return 4;
  }
}

export function randomPosition(table) {
  const vet = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (table[i][j] === 0) {
        vet.push({ row: i, column: j });
      }
    }
  }

  const index1 = Math.floor(Math.random() * vet.length);
  const obj = {};

  obj.row = vet[index1].row;
  obj.column = vet[index1].column;

  return obj;
}
