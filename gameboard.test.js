import { GameBoard } from "./gameboard";

test("check if gameboard is created", () => {
    const board = new GameBoard();
    expect(board.grid[0][0]).toBe(0);
});

test("is ship in this coords", () => {
    const board = new GameBoard();
    board.grid[5][5] = 1;

    expect(board.checkCoords(5, 5)).toBeTruthy();
});
test("is ship in this coords2", () => {
    const board = new GameBoard();
    board.grid[3][9] = 1;

    expect(board.checkCoords(5, 5)).toBeFalsy();
});

test("adding ships to the board", () => {
    const board = new GameBoard();
    board.addShip("ship");
    expect(board.ships.length).toBe(1);
});

test("adding ships with horizontal checks", () => {
    const board = new GameBoard();
    board.grid[0] = new Array(10).fill(1);
    board.grid[2] = new Array(10).fill(1);
    expect(board.checkHorizontally(1, 2, 3)).toBe(false);
});
test("adding ships with horizontal checks", () => {
    const board = new GameBoard();
    expect(board.checkHorizontally(1, 2, 3)).toBe(true);
});
