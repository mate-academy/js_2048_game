import getMatrix, { winGame, getScore, setScore, setAddScore
  , getEmptyMatrixCoordinates, setBoxToMatrix, delFromMatrix }
  from './main';

function getValue() {
  return Math.random() > 0.9 ? 4 : 2;
}

function getBoxPosition() {
  const emptyMatrix = getEmptyMatrixCoordinates();
  const randomEmptyIndex = Math.floor(Math.random() * emptyMatrix.length);

  return emptyMatrix[randomEmptyIndex];
}

function createBoxElem(obj) {
  const boxElem = document.createElement('div');

  boxElem.classList.add('field-tile');
  boxElem.classList.add(`field-tile--${obj.value}`);

  return boxElem;
}

function moveBoxLine({
  matrix,
  x,
  y,
  startCondition,
  endCondition,
  change,
  box,
}) {
  if (startCondition(y)) {
    return;
  }

  const boxLine = matrix[x];
  let currentY = y;
  let foundY = null;

  do {
    currentY = change(currentY);

    if (!boxLine[currentY]) {
      foundY = currentY;
    } else {
      if ((boxLine[currentY].value === box.value)
        && (!boxLine[currentY].merged)) {
        boxLine[currentY].mergeBoxValue();
        boxLine[currentY].merged = true;
        delFromMatrix(box);

        box.setPosition({
          x,
          y: currentY,
        });
        box.changeBoxPosition();
        box.killBoxFromScreen();

        return;
      }
      break;
    }
  } while (endCondition(currentY));

  if (foundY != null) {
    delFromMatrix(box);

    box.setPosition({
      x,
      y: foundY,
    });
    box.changeBoxPosition();
    setBoxToMatrix(box);
  }
}

function moveBoxColumn({
  matrix,
  x,
  y,
  startCondition,
  endCondition,
  change,
  box,
}) {
  if (startCondition(x)) {
    return;
  }

  const boxColumn = matrix.map(line => {
    return line[y];
  });
  let currentX = x;
  let foundX = null;

  do {
    currentX = change(currentX);

    if (!boxColumn[currentX]) {
      foundX = currentX;
    } else {
      if ((boxColumn[currentX].value === box.value)
        && (!boxColumn[currentX].merged)) {
        boxColumn[currentX].mergeBoxValue();
        boxColumn[currentX].merged = true;
        delFromMatrix(box);

        box.setPosition({
          x: currentX,
          y,
        });
        box.changeBoxPosition();
        box.killBoxFromScreen();

        return;
      }
      break;
    }
  } while (endCondition(currentX));

  if (foundX != null) {
    delFromMatrix(box);

    box.setPosition({
      x: foundX,
      y,
    });
    box.changeBoxPosition();
    setBoxToMatrix(box);
  }
}

class Box {
  constructor() {
    this.merged = false;
    this.size = 75;
    this.margin = 10;
    this.value = getValue();
    this.position = getBoxPosition();
    setBoxToMatrix(this);
    this.box = createBoxElem(this);
  }

  changeBoxPosition() {
    const boxX = (this.position.x * (this.size + this.margin)) + this.margin;
    const boxY = (this.position.y * (this.size + this.margin)) + this.margin;

    this.box.style.top = `${boxX}px`;
    this.box.style.left = `${boxY}px`;
  }

  setValue() {
    this.box.textContent = this.value;
  }

  mergeBoxValue() {
    this.value = this.value * 2;
    this.box.classList.add(`field-tile--${this.value}`);

    setTimeout(() => {
      this.setValue();
    }, 110);

    let score = getScore();

    score += this.value;
    setScore(score);
    setAddScore(this.value);

    if (this.value === 2048) {
      winGame();
    }
  }

  killBoxFromScreen() {
    setTimeout(() => {
      this.box.remove();
    }, 110);
  }

  setPosition(newPosition) {
    this.position = newPosition;
  }

  getPosition() {
    return this.position;
  }

  setBoxToScreen() {
    const gameField = document.querySelector('.game-field');

    this.setValue();
    this.changeBoxPosition();
    gameField.append(this.box);
  }

  move(moveDirection) {
    // ArrowLeft ArrowUp ArrowRight ArrowDown
    const matrix = getMatrix();
    const { x, y } = this.getPosition();

    switch (moveDirection) {
      case 'ArrowLeft':
        moveBoxLine({
          matrix,
          x,
          y,
          startCondition: y1 => y1 === 0,
          endCondition: currentY => currentY > 0,
          change: currentY => currentY - 1,
          box: this,
        });
        break;

      case 'ArrowRight':
        moveBoxLine({
          matrix,
          x,
          y,
          startCondition: y1 => y1 === 3,
          endCondition: currentY => currentY < 3,
          change: currentY => currentY + 1,
          box: this,
        });
        break;

      case 'ArrowUp':
        moveBoxColumn({
          matrix,
          x,
          y,
          startCondition: x1 => x1 === 0,
          endCondition: currentX => currentX > 0,
          change: currentX => currentX - 1,
          box: this,
        });
        break;

      case 'ArrowDown':
        moveBoxColumn({
          matrix,
          x,
          y,
          startCondition: x1 => x1 === 3,
          endCondition: currentX => currentX < 3,
          change: currentX => currentX + 1,
          box: this,
        });
        break;
      default:
    }
  }
}

export function createBox() {
  const newBox = new Box();

  newBox.setBoxToScreen();

  return newBox;
}
