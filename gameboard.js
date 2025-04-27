class GameBoard {
    constructor() {
        this.grid = new Array(10).fill(new Array(10).fill(0));
        this.ships = [];
    }
    checkCoords(row, col) {
        return this.grid[row][col] === 1;
    }
    addShip(ship) {
        this.ships.push(ship);
    }

    checkHorizontally(row, col, size) {
        for (let i = 0; i < size; i++) {
            if (row - 1 >= 0 && this.grid[row - 1][col + i] === 1) return false;
            if (row + 1 < 10 && this.grid[row + 1][col + i] === 1) return false;
        }
        return true;
    }
}

export { GameBoard };
