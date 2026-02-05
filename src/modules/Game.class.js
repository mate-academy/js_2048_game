export class Game {
    constructor(size = 4) {
        this.size = size;
        this.grid = [];
        this.score = 0;
        this.init();
    }

    init() {
        // Inicializa o grid com zeros
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.addRandomTile();
        this.addRandomTile();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        const oldGrid = JSON.stringify(this.grid);

        // Rotaciona o board para tratar todos os movimentos como "para a esquerda"
        const rotations = { 'ArrowLeft': 0, 'ArrowUp': 3, 'ArrowRight': 2, 'ArrowDown': 1 };
        const count = rotations[direction];

        for (let i = 0; i < count; i++) this.rotate();
        this.processMove();
        for (let i = 0; i < (4 - count) % 4; i++) this.rotate();

        // Retorna true se o grid mudou (para saber se deve adicionar novo tile e renderizar)
        return oldGrid !== JSON.stringify(this.grid);
    }

    processMove() {
        for (let r = 0; r < this.size; r++) {
            let row = this.grid[r].filter(val => val !== 0);
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) {
                    row[i] *= 2;
                    this.score += row[i];
                    row.splice(i + 1, 1);
                }
            }
            while (row.length < this.size) row.push(0);
            this.grid[r] = row;
        }
    }

    rotate() {
        const newGrid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                newGrid[c][this.size - 1 - r] = this.grid[r][c];
            }
        }
        this.grid = newGrid;
    }
}
