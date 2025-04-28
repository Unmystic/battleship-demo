import { GameBoard } from "./gameboard";

class Player {
    constructor(human = false) {
        this.board = new GameBoard();
        this.isHuman = human;
    }
}

export { Player };
