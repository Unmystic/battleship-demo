import { Player } from "./player";

test("creating player with gameboard", () => {
    const player = new Player();
    expect(player.board.grid[0][0]).toBe(0);
});

test("check for homo", () => {
    const player = new Player(true);
    expect(player.isHuman).toBe(true);
});
