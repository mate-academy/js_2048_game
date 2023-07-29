'use strict';

function getRandonCell() {
  // let randomIndex;
  function whileBody(i, j) {

  }

  do {
    const randomIndex = Math.floor(Math.random() * 15);
    let indexRow;
    let indexCol;

  } while (
    // fields[randomCellIndex].classList.length > 1
    indexRow = Math.floor(randomIndex / 4);
    indexCol = randomIndex - (indexRow * 4);
    table[indexRow][indexCol] !== 0
  );

  // return randomCellIndex;
}

function appearingTwoRandomCells() {
  const firstFieldIndex = getRandonCell();
  const firstField = fields[firstFieldIndex];

  const firstRandomNum = Math.floor(Math.random() * 10);

  if (firstRandomNum === 4) {
    table[firstFieldIndex] = 4;
    firstField.classList.add(`field-cell--${table[firstFieldIndex]}`);
    firstField.textContent = table[firstFieldIndex];
  } else {
    table[firstFieldIndex] = 2;
    firstField.classList.add(`field-cell--${table[firstFieldIndex]}`);
    firstField.textContent = table[firstFieldIndex];
  }

  const secondFieldIndex = getRandonCell();
  const secondField = fields[secondFieldIndex];
  const secondRandomNum = Math.floor(Math.random() * 10);

  if (secondRandomNum === 4) {
    table[secondFieldIndex] = 4;
    secondField.classList.add(`field-cell--${table[secondFieldIndex]}`);
    secondField.textContent = table[secondFieldIndex];
  } else {
    table[secondFieldIndex] = 2;
    secondField.classList.add(`field-cell--${table[secondFieldIndex]}`);
    secondField.textContent = table[secondFieldIndex];
  }
}

function appearingOneRandomCell() {
  const fieldIndex = getRandonCell();
  // const field = fields[fieldIndex];

  const firstRandomNum = Math.floor(Math.random() * 10);

  if (firstRandomNum === 4) {
    table[fieldIndex] = 4;
    // field.classList.add(`field-cell--${table[fieldIndex]}`);
    // field.textContent = table[fieldIndex];
  } else {
    table[fieldIndex] = 2;
    // field.classList.add(`field-cell--${table[fieldIndex]}`);
    // field.textContent = table[fieldIndex];
  }
}

function restart() {
  for (let i = 0; i < fields.length; i++) {
    // fields[i].classList = ['field-cell'];
    // fields[i].textContent = '';

    const rowIndex = Math.floor(i / 4);
    const colIndex = i - (rowIndex * 4);

    table[rowIndex][colIndex] = 0;
    updateGameFields();
  }
}
