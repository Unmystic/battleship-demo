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
                }
            }
        }
    }
}

export { Player, Computer };
