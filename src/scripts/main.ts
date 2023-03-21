'use strict';

interface Field {
  height: number,
  width: number,
  cells: FieldCell[],
};

interface FieldCell {
  coords: Coords,
  contains: FieldUnit | null,
};

interface FieldUnit {
  coords: Coords,
  value: number,
};

interface Coords {
  x: number,
  y: number,
}

interface Start {
  axis: Axis,
  line: number,
};

enum Axis {
  X = 'x',
  Y = 'y',
}

enum MoveDirection {
  Up = 'ArrowUp',
  Down = 'ArrowDown',
  Left = 'ArrowLeft',
  Right = 'ArrowRight',
};

function generateField(rowLength, tierLength): Field {
  return {
    height: rowLength,
    width: tierLength,
    cells: generateCells({ x: rowLength, y: tierLength }),
  }
}

function generateCells(maxSize: Coords): FieldCell[] {
  const cells: FieldCell[] = [];

  for (let x = 1; x <= maxSize.x; x++) {
    for (let y = 1; y <= maxSize.y; y++) {
      const newCell: FieldCell = {
        coords: {
          x,
          y,
        },
        contains: null,
      }
      cells.push(newCell)
    }
  }

  return cells;
};

function fillCell(x, y, value) {
  const cell = document.querySelector(`.field-row:nth-last-child(${y}) > .field-cell:nth-child(${x}`);
  if (cell) {
    cell.textContent = `${value || ''}`;
    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  }
}

function clearCell(field: Field, x, y) {

  const index = field.cells.findIndex((cell: FieldCell) => {
    return cell.coords.x === x && cell.coords.y === y
  })
  const cell = document.querySelector(`.field-row:nth-last-child(${y}) > .field-cell:nth-child(${x}`);
  cell?.classList.remove(`field-cell--${field.cells[index].contains?.value}`);
  field.cells[index].contains = null;
}

function generateUnit(quantity: number, field: Field) {

  let valueOptions: number[] = [2, 4];

  let coordsOptions: Coords[] = field.cells
    .filter((cell: FieldCell) => !cell.contains)
    .map((cell: FieldCell) => cell.coords);

  for (let i = 0; i < quantity; i++) {

    const targetCoords = coordsOptions[Math.floor(Math.random() * (coordsOptions.length))];
    coordsOptions = coordsOptions.filter((coords: Coords) => coords !== targetCoords);
    const newValue = Math.floor(Math.random() * 10) < 9
      ? valueOptions[0]
      : valueOptions[1];

    const index = field.cells.findIndex((cell: FieldCell) => cell.coords === targetCoords);

    field.cells[index].contains = {
      coords: targetCoords,
      value: newValue,
    }

    fillCell(targetCoords.x, targetCoords.y, newValue);
  };

  return field;
}

function moveUnit(unit: FieldUnit, field: Field, direction: string): FieldUnit | undefined {
  let newCoords: Coords = { ...unit.coords }

  switch (direction) {
    case MoveDirection.Up:
      newCoords = {
        x: unit.coords.x,
        y: unit.coords.y + 1,
      };
      break;
    case MoveDirection.Down:
      newCoords = {
        x: unit.coords.x,
        y: unit.coords.y - 1,
      };
      break;
    case MoveDirection.Left:
      newCoords = {
        x: unit.coords.x - 1,
        y: unit.coords.y,
      };
      break;
    case MoveDirection.Right:
      newCoords = {
        x: unit.coords.x + 1,
        y: unit.coords.y,
      };
      break;
  }

  const targetCell = field.cells.find((cell: FieldCell) => {
    return cell.coords.x === newCoords.x && cell.coords.y === newCoords.y
  })


  if (!targetCell || (targetCell.contains?.value && (targetCell.contains?.value !== unit.value))) {
    // assign current cell for the unit
    const index = field.cells.findIndex((cell: FieldCell) => {
      return cell.coords.x === unit.coords.x && cell.coords.y === unit.coords.y
    })
    field.cells[index].contains = unit;

    return unit;
  } else if (targetCell.contains?.value && (targetCell.contains?.value === unit.value)) {
    // merge
    clearCell(field, unit.coords.x, unit.coords.y);
    targetCell.contains.value += unit.value;

    return targetCell.contains;
  }
  // next move
  clearCell(field, unit.coords.x, unit.coords.y);
  moveUnit({ ...unit, coords: { ...newCoords } }, field, direction)
};

function moveTier(i: number, direction: MoveDirection, axis: Axis, field: Field) {
  const tier = field.cells.filter((cell: FieldCell) => {
    return cell.contains && cell.coords[axis] === i;
  })
    .map((cell: FieldCell) => cell.contains);


  tier.forEach((unit: FieldUnit | null) => {
    if (unit) {
      moveUnit(unit, field, direction);
    }
  })
}

function updateCells(field: Field) {
  field.cells.forEach((cell: FieldCell) => {
    fillCell(cell.coords.x, cell.coords.y, cell.contains?.value);
  })
};

function checkResult(field: Field) {
  if (field.cells.some((cell: FieldCell) => cell.contains?.value === 2048)) {
    alert('You win!');
    document.querySelector('.message-win')?.classList.remove('hidden');
  }
};

function calculateScore(field: Field) {
  let score = 0;
  field.cells.forEach((cell: FieldCell) => {
    if (cell.contains) {
      score += cell.contains.value;
    }
  })
  return score;
}

function unpdateScore(field: Field) {
  const score = calculateScore(field);
  const scoreElem = document.querySelector('.game-score');
  if (scoreElem) {
    scoreElem.textContent = `${score}`;
  }
}

function handleMove(field: Field, direction: string) {
  switch (direction) {
    case MoveDirection.Down:
      for (let i = 1; i <= field.height; i++) {
        moveTier(i, direction, Axis.Y, field);
      }
      break
    case MoveDirection.Up:
      for (let i = field.height - 1; i; i--) {
        moveTier(i, direction, Axis.Y, field);
      }
      break
    case MoveDirection.Left:
      for (let i = 1; i <= field.height; i++) {
        moveTier(i, direction, Axis.X, field);
      }
      break
    case MoveDirection.Right:
      for (let i = field.width - 1; i; i--) {
        moveTier(i, direction, Axis.X, field);
      }
      break
  }
}

function isGameOver(field: Field, score: number) {
  const trialField = { ...field }
  for (let direction in MoveDirection) {
    handleMove(trialField, direction);
  }
  console.log('calculateScore(trialField):', calculateScore(trialField));
  console.log('score', score);
  return score === calculateScore(trialField)
}

function resetField(field: Field) {
  field.cells = field.cells.map((cell: FieldCell) => {
    if (cell.contains) {
      return { ...cell, contains: null }
    }

    return cell;
  })

  updateCells(field);
}

const startButton: HTMLButtonElement | null = document.querySelector('.start');
startButton?.addEventListener('click', function () {
  document.querySelector('.message-start')?.classList.add('hidden');
  const rows = document.querySelectorAll('.field-row').length;
  const tiers = document.querySelectorAll('.field-row:first-child > .field-cell').length;
  const field = generateField(rows, tiers);

  if (field.cells.filter((cell: FieldCell) => cell.contains)) {
    resetField(field);
  }

  generateUnit(2, field);
  unpdateScore(field);

  document.body.addEventListener('keyup', (e) => {

    handleMove(field, e.key);

    const isFull = !field.cells.filter((cell: FieldCell) => !cell.contains).length

    if (isFull && isGameOver(field, calculateScore(field))) {
      console.log('insile Game Over');
      document.querySelector('.message-lose')?.classList.remove('hidden')
    }

    if (startButton.classList.contains('start')) {
      startButton.classList.replace('start', 'restart');
      startButton.textContent = 'Restart';
    }

    if (!isFull) {
      generateUnit(1, field);
    }

    updateCells(field);
    unpdateScore(field);
    checkResult(field);
  });
})
