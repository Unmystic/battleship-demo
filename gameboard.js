class GameBoard {
    constructor() {
        this.grid = Array.from({ length: 10 }, () =>
            Array.from({ length: 10 }, () => 0),
        );
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

    checkVertically(row, col, size, placement = "h") {
        if (placement === "h") {
            if (col - 1 >= 0 && this.grid[row][col - 1] === 1) return false;
            if (col + size < 10 && this.grid[row][col + size] === 1) return false;
        }
        if (placement === "v") {
            for (let i = 0; i < size; i++) {
                if (col - 1 >= 0 && this.grid[row + i][col - 1] === 1) return false;
                if (col + 1 < 10 && this.grid[row + i][col + 1] === 1) return false;
            }
        }
        return true;
    }
}

export { GameBoard };
