import { GameBoard } from "./gameboard.js";
import { Ship } from "./ship.js";

class Player {
    constructor(human = false) {
        this.board = new GameBoard();
        this.isHuman = human;
    }

    placeShips() {
        const sizes = [5, 4, 3, 3, 2];
        for (let i = 0; i < sizes.length; i++) {
            const [coords, placement] = this.generatePosition(sizes[i]);
            const ship = new Ship(sizes[i]);
            this.board.addShip(coords, ship, placement);
        }
    }
    generatePosition(size = 3) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const choices = ["v", "h"];
        const placement = choices[Math.floor(Math.random() * choices.length)];
        if (this.board.canPlace([row, col], size, placement)) {
            return [[row, col], placement];
        } else return this.generatePosition(size);
    }

    stringifyCoords(coords) {
        return `${coords[0]}-${coords[1]}`;
    }
    checkBoundaries(coords) {
        if (coords[0] < 0 || coords[0] > 9) return false;
        if (coords[1] < 0 || coords[1] > 9) return false;
        return true;
    }
}

class Computer extends Player {
    constructor(opponentBoard) {
        super();
        this.opponentBoard = opponentBoard;
        this.excludedCells = new Set();
        this.suggestedCells = [];
    }
    checkEx(coords) {
        const strCoords = this.stringifyCoords(coords);
        return this.excludedCells.has(strCoords);
    }
    selectVector(coords) {
        const row = coords[0];
        const col = coords[1];
        const directions = {
            "-h": [0, -1],
            "+h": [0, 1],
            "-v": [-1, 0],
            "+v": [1, 0],
        };

        for (const d of Object.values(directions)) {
            const newRow = row + d[0];
            const newCol = col + d[1];
            if (
                this.excludedCells.has(this.stringifyCoords([newRow, newCol])) &&
                this.opponentBoard.grid[newRow][newCol] === 1
            ) {
                return Object.keys(directions).find((key) => directions[key] === d);
            }
        }
    }

    randomChoice() {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        if (this.checkEx([row, col])) return this.randomChoice();
        return [row, col];
    }
    makeMove() {
        if (this.suggestedCells) {
            const cellCoords = this.suggestedCells.pop();
            this.opponentBoard.receiveAttack(cellCoords);
            const strCoords = this.stringifyCoords(cellCoords);
            this.excludedCells.add(strCoords);
            if (this.opponentBoard.grid[cellCoords[0]][cellCoords[1]] === 1) {
                this.suggestedCells = [];
                const ship = this.opponentBoard.findShip(cellCoords);
                if (!ship.isSunk()) {
                    const v = this.selectVector(cellCoords);
                }
            }
        }
    }

    addSuggestions(vector, coord) {
        const [row, col] = coord;
        if (vector === "-h") {
            if (
                this.checkBoundaries([row, col + 1]) &&
                !this.excludedCells.has(this.stringifyCoords([row, col + 1]))
            )
                this.suggestedCells.push([row, col + 1]);
            for (let i = 2; i < 5; i++) {
                if (
                    this.checkBoundaries([row, col - i]) &&
                    !this.excludedCells.has(this.stringifyCoords([row, col - i]))
                ) {
                    this.suggestedCells.push([row, col - i]);
                    return;
                }
            }
        }
    }
}

export { Player, Computer };
