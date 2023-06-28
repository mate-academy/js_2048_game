import { maxMoveCoords, cellsArray } from '../variables.js'

export class Card {
  static cards = [];

  constructor(coords, number = 2) {
    this.number = number;
    this.coords = {
      x: coords.x,
      y: coords.y,
    };

    this.htmlCard = Object.assign(
      document.createElement('span'),
      {
        classList: 'field-card field-card--2',
      }
    );

    this.htmlCard.innerHTML = `<p>${this.number}</p>`;
    this.htmlCard.style.top =  this.coords.y + 'px';
    this.htmlCard.style.left = this.coords.x + 'px';

    Card.cards.push(this);

    return this;
  }

  moveUp() {
    const oldCell = cellsArray.find(cell => {
      return cell.coords.x === this.coords.x
        && cell.coords.y === this.coords.y;
    });

    // const closestCard = Card.cards.find(card => {
    //   return this.coords.x === card.coords.x
    //     && this.coords.y > card.coords.y
    // });

    // if (closestCard === undefined) {
    //   this.coords.y = maxMoveCoords.maxUp;
    //   this.htmlCard.style.top =  this.coords.y + 'px';

    //   return this;
    // }

    // this.coords.y = closestCard.coords.y + this.htmlCard.clientHeight + borderSpacing;
    // this.htmlCard.style.top =  this.coords.y + 'px';

    this.coords.y = maxMoveCoords.maxUp;
    this.htmlCard.style.top =  this.coords.y + 'px';

    const newCell = cellsArray.find(cell => {
      return cell.coords.x === this.coords.x
        && cell.coords.y === this.coords.y;
    });

    oldCell.isFree = true;
    newCell.isFree = false;

    console.log(oldCell, newCell);

    return this;
  }

  moveDown() {
    this.coords.y += this.htmlCard.clientHeight + 10;
    this.htmlCard.style.top =  this.coords.y + 'px';

    return this;
  }

  moveRight() {
    this.coords.x += this.htmlCard.clientHeight + 10;
    this.htmlCard.style.left =  this.coords.x + 'px';

    return this;
  }

  moveLeft() {
    this.coords.x -= this.htmlCard.clientHeight + 10;
    this.htmlCard.style.left =  this.coords.x + 'px';

    return this;
  }
}
