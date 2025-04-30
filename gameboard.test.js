import { GameBoard } from "./gameboard";
import { Ship } from "./ship";

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
    const ship = new Ship();
    board.addShip([0, 0], ship);
    expect(board.ships.length).toBe(1);
});

test("adding ships to the board2", () => {
    const board = new GameBoard();
    const ship = new Ship();
    board.addShip([1, 1], ship, "h");
    expect(board.grid[1][1]).toBe(1);
    expect(board.grid[1][2]).toBe(1);
    expect(board.grid[1][3]).toBe(1);
});

test("adding ships to the board3", () => {
    const board = new GameBoard();
    const ship = new Ship();
    board.addShip([1, 1], ship, "v");
    expect(board.grid[1][1]).toBe(1);
    expect(board.grid[2][1]).toBe(1);
    expect(board.grid[3][1]).toBe(1);
});

test("adding ships to the board4", () => {
    const board = new GameBoard();
    const ship = new Ship();
    board.addShip([0, 0], ship);
    const res = {
        ship: ship,
        position: new Set(),
    };
    res.position.add("0-0");
    res.position.add("0-1");
    res.position.add("0-2");
    expect(board.ships[0]).toEqual(res);
});

test("adding ships with horizontal checks", () => {
    const board = new GameBoard();
    board.grid[0] = new Array(10).fill(1);
    board.grid[2] = new Array(10).fill(1);
    expect(board.checkHorizontally(1, 2, 3)).toBe(false);
});
test("adding ships with horizontal checks2", () => {
    const board = new GameBoard();
    expect(board.checkHorizontally(1, 2, 3)).toBe(true);
});
test("adding ships with horizontal checks3", () => {
    const board = new GameBoard();
    board.grid[4] = new Array(10).fill(1);
    expect(board.checkHorizontally(1, 2, 3, "v")).toBe(false);
});
test("adding ships with vertical checks", () => {
    const board = new GameBoard();
    expect(board.checkVertically(1, 2, 3, "h")).toBe(true);
});

test("adding ships with vertical checks2", () => {
    const board = new GameBoard();
    board.grid[1][5] = 1;
    expect(board.checkVertically(1, 2, 3, "h")).toBe(false);
});
test("adding ships with vertical checks3", () => {
    const board = new GameBoard();
    board.grid[2][1] = 1;
    expect(board.checkVertically(1, 2, 3, "v")).toBe(false);
});

test("can place ship", () => {
    const board = new GameBoard();
    expect(board.canPlace([2, 1], 3, "h")).toBe(true);
});

test("can place ship2", () => {
    const board = new GameBoard();
    expect(board.canPlace([2, 8], 3, "h")).toBe(false);
});

test("can place ship3", () => {
    const board = new GameBoard();
    expect(board.canPlace([8, 1], 3, "v")).toBe(false);
});

test("attack received", () => {
    const board = new GameBoard();
    board.receiveAttack([0, 1]);
    expect(board.hittedPlaces.has("0-1")).toBe(true);
});

test("attack received2", () => {
    const board = new GameBoard();
    board.receiveAttack([0, 1]);
    expect(board.hittedPlaces.has("0-2")).toBe(false);
});

test("ship hitted", () => {
    const board = new GameBoard();
    const ship = new Ship();
    board.addShip([0, 0], ship);
    board.receiveAttack([0, 1]);
    expect(ship.numHits).toBe(1);
});
test("ship missed", () => {
    const board = new GameBoard();
    const ship = new Ship();
    board.addShip([0, 0], ship);
    board.receiveAttack([1, 0]);
    expect(ship.numHits).toBe(0);
});
test("ship sunked", () => {
    const board = new GameBoard();
    const ship = new Ship();
    board.addShip([0, 0], ship);
    board.receiveAttack([0, 1]);
    board.receiveAttack([0, 2]);
    board.receiveAttack([0, 0]);

    expect(ship.isSunk()).toBe(true);
});

test("game is finished", () => {
    const board = new GameBoard();

    const ship = new Ship();
    board.addShip([0, 0], ship);
    board.receiveAttack([0, 1]);
    board.receiveAttack([0, 2]);
    board.receiveAttack([0, 0]);

    const ship2 = new Ship(2);
    board.addShip([8, 8], ship2);
    board.receiveAttack([8, 8]);
    board.receiveAttack([8, 9]);

    expect(board.isGameFinished()).toBe(true);
});

test("game is not finished", () => {
    const board = new GameBoard();

    const ship = new Ship();
    board.addShip([0, 0], ship);
    board.receiveAttack([0, 1]);
    board.receiveAttack([0, 2]);
    board.receiveAttack([0, 0]);

    const ship2 = new Ship(2);
    board.addShip([8, 8], ship2);
    board.receiveAttack([8, 8]);
    board.receiveAttack([8, 7]);

    expect(board.isGameFinished()).toBe(false);
});

test("find hitted ship", () => {
    const board = new GameBoard();

    const ship = new Ship();
    board.addShip([0, 0], ship);
    board.receiveAttack([0, 1]);
    const ship2 = new Ship(2);
    board.addShip([8, 8], ship2);

    expect(board.findShip([0, 1])).toEqual(ship);
});
