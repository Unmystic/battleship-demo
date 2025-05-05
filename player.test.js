import { GameBoard } from "./gameboard";
import { Computer, Player } from "./player";
import { Ship } from "./ship";

test("creating player with gameboard", () => {
    const player = new Player();
    expect(player.board.grid[0][0]).toBe(0);
});

test("check for homo", () => {
    const player = new Player(true);
    expect(player.isHuman).toBe(true);
});

test("correct coords stringification", () => {
    const player = new Player();
    expect(player.stringifyCoords([0, 1])).toBe("0-1");
});
describe("generate correct position", () => {
    test("check coordinates length", () => {
        const player = new Player();
        const [coords, placement] = player.generatePosition();
        expect(coords.length).toBe(2);
    });

    test("see if placement matches", () => {
        const player = new Player();
        const [coords, placement] = player.generatePosition();
        expect(placement).toMatch(/(v|h)/i);
    });
});

describe("check for excluded cells", () => {
    test("selected cell is in list", () => {
        const machine = new Computer("board");
        machine.excludedCells.add("0-1");
        const compchoice = [0, 1];
        expect(machine.checkEx(compchoice)).toBe(true);
    });
    test("selected cell not in list", () => {
        const machine = new Computer("board");
        machine.excludedCells.add("0-1");
        const compchoice = [0, 2];
        expect(machine.checkEx(compchoice)).toBe(false);
    });
});

describe("computer ignored excluded cells", () => {
    test.each(Array(100).fill())("random cell is not in list", () => {
        const machine = new Computer("board");
        machine.excludedCells.add("0-1");
        machine.excludedCells.add("0-2");
        machine.excludedCells.add("1-2");
        machine.excludedCells.add("0-3");
        machine.excludedCells.add("0-4");
        machine.excludedCells.add("0-5");
        machine.excludedCells.add("0-6");
        machine.excludedCells.add("0-7");
        machine.excludedCells.add("0-8");
        const compchoice = machine.randomChoice();
        expect(machine.checkEx(compchoice)).toBe(false);
    });
});

describe("computer makes a move", () => {
    test("correct vectorization return", () => {
        const human = new Player();
        const machine = new Computer(human.board);
        const ship = new Ship();
        human.board.addShip([1, 1], ship, "h");
        human.board.receiveAttack([1, 1]);
        machine.excludedCells.add(machine.stringifyCoords([1, 1]));
        expect(machine.selectVector([1, 2])).toBe("-h");
    });
    test("correct move suggestions1", () => {
        const human = new Player();
        const machine = new Computer(human.board);
        const ship = new Ship();
        human.board.addShip([1, 1], ship, "h");
        human.board.receiveAttack([1, 1]);
        machine.excludedCells.add(machine.stringifyCoords([1, 1]));
        machine.addSuggestions("-h", [1, 2]);
        expect(machine.suggestedCells).toEqual([
            [1, 3],
            [1, 0],
        ]);
    });
    test("correct move suggestions1", () => {
        const human = new Player();
        const machine = new Computer(human.board);
        const ship = new Ship();
        human.board.addShip([1, 1], ship, "h");
        human.board.receiveAttack([1, 1]);
        machine.excludedCells.add(machine.stringifyCoords([1, 1]));
        machine.addSuggestions("-h", [1, 2]);
        expect(machine.suggestedCells).toEqual([
            [1, 3],
            [1, 0],
        ]);
    });
    test("correct move suggestions2", () => {
        const human = new Player();
        const machine = new Computer(human.board);
        const ship = new Ship();
        human.board.addShip([2, 2], ship, "h");
        human.board.receiveAttack([2, 2]);
        machine.excludedCells.add(machine.stringifyCoords([2, 2]));
        machine.addSuggestions("+h", [2, 1]);
        expect(machine.suggestedCells).toEqual([
            [2, 0],
            [2, 3],
        ]);
    });

    test("correct move suggestions3", () => {
        const human = new Player();
        const machine = new Computer(human.board);
        const ship = new Ship();
        human.board.addShip([3, 3], ship, "v");
        human.board.receiveAttack([3, 3]);
        machine.excludedCells.add(machine.stringifyCoords([3, 3]));
        machine.addSuggestions("-v", [4, 3]);
        expect(machine.suggestedCells).toEqual([
            [5, 3],
            [2, 3],
        ]);
    });
    test("correct move suggestions4", () => {
        const human = new Player();
        const machine = new Computer(human.board);
        const ship = new Ship();
        human.board.addShip([4, 4], ship, "v");
        human.board.receiveAttack([4, 4]);
        machine.excludedCells.add(machine.stringifyCoords([4, 4]));
        machine.addSuggestions("+v", [3, 4]);
        expect(machine.suggestedCells).toEqual([
            [2, 4],
            [5, 4],
        ]);
    });
});
