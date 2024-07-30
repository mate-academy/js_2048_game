export class FullCell {
  constructor(gridElement) {
    this.element = document.createElement('div');
    this.element.classList.add('full-cell');
    this.setValue(Math.random() < 0.9 ? 2 : 4);

    gridElement.append(this.element);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.element.style.setProperty('--x', x);
    this.element.style.setProperty('--y', y);
  }

  setValue(value) {
    this.value = value;
    this.element.textContent = this.value;

    this.element.classList.remove(
      'full-cell--2',
      'full-cell--4',
      'full-cell--8',
      'full-cell--16',
      'full-cell--32',
      'full-cell--64',
      'full-cell--128',
      'full-cell--256',
      'full-cell--512',
      'full-cell--1024',
      'full-cell--2048',
    );

    this.element.classList.add(`full-cell--${value}`);
  }

  remove() {
    this.element.remove();
  }
}
