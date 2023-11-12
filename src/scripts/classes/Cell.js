import { BOARD_SIZE } from './Board';

export function createCell(cell, i) {
  const x = i % BOARD_SIZE;
  const y = Math.floor(i / BOARD_SIZE);

  cell.x = x;
  cell.y = y;
  cell.wasMerged = false;

  cell.isEmpty = function() {
    return this.linkCard === null;
  };

  cell.canMergeWith = function(cell2) {
    return !this.isEmpty() && !cell2.isEmpty()
      && this.linkCard.weight === cell2.linkCard.weight
      && !this.wasMerged; // this must be targetCell
  };

  cell.mergeWith = function(cell2) {
    const card = this.linkCard;

    cell.wasMerged = true;

    card.setWeight(card.weight * 2);

    cell2.linkCard.setXY(card.x, card.y);

    cell2.linkCard.remove();
    cell2.resetLinkedCard();

    card.playAnimation('cardMerge');
  };

  cell.resetLinkedCard = function() {
    this.linkCard = null;
  };

  cell.resetLinkedCard();

  return cell;
}
