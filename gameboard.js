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
    addShip(coords, ship, placement = "h") {
        const [row, col] = coords;
        const shipInfo = {
            ship: ship,
            position: [],
        };
        for (let i = 0; i < ship.size; i++) {
            if (placement === "h") {
                this.grid[row][col + i] = 1;
                shipInfo.position.push([row, col + i]);
            }
            if (placement === "v") {
                this.grid[row + i][col] = 1;
                shipInfo.position.push([row + i, col]);
            }
        }

        this.ships.push(shipInfo);
    }

    canPlace(coords, size, placement = "h") {
        const [row, col] = coords;
        if (placement === "h" && col + size > 10) return false;
        if (placement === "v" && row + size > 10) return false;
        return (
            this.checkHorizontally(row, col, size, placement) &&
            this.checkVertically(row, col, size, placement)
        );
    }

    checkHorizontally(row, col, size, placement = "h") {
        if (placement === "h") {
            for (let i = 0; i < size; i++) {
                if (row - 1 >= 0 && this.grid[row - 1][col + i] === 1) return false;
                if (row + 1 < 10 && this.grid[row + 1][col + i] === 1) return false;
            }
        }
        if (placement === "v") {
            if (row - 1 >= 0 && this.grid[row - 1][col] === 1) return false;
            if (row + size < 10 && this.grid[row + size][col] === 1) return false;
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
