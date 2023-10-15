// export default class Grid {
//   #cells
//   constructor(gridElement) {

//   }

//   get #emptyCells() {
//     return this.#cells.filter(cell => cell.tile == null)
//   }

//   randomEmptyCell() {
//     const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
//     return this.#emptyCells[randomIndex];
//   }
// }

// class Cell {
//   #cellElement
//   #x
//   #y
//   #tile

//   constructor(cellElement, x, y) {
//     this.#cellElement = cellElement
//     this.#x = x
//     this.#y = y
//   }

//   get tile() {
//     return this.#tile
//   }

//   set tile(value) {
//     this.#tile = value
//     if (value == null) return
//     this.#tile.x = this.#x
//     this.#tile.y = this.#y
//   }
// }

// я не можу тут використовувати export і №
