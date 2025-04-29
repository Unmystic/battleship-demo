import { Player } from "./player";

test("creating player with gameboard", () => {
    const player = new Player();
    expect(player.board.grid[0][0]).toBe(0);
});

test("check for homo", () => {
    const player = new Player(true);
    expect(player.isHuman).toBe(true);
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
