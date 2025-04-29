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
}

export { Player };
