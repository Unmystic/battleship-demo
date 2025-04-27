class GameBoard {
    constructor() {
        this.grid = new Array(10).fill(new Array(10).fill(0));
    }
    checkCoords(row, col) {
        return this.grid[row][col] === 1;
    }
}

export { GameBoard };
