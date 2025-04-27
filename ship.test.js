import { Ship } from "./ship";

test("create Ship class", () => {
    const ship = new Ship();
    expect(ship.numHits).toBe(0);
});

test("simulate ship hit", () => {
    const ship = new Ship();
    ship.hit();
    expect(ship.numHits).toBe(1);
});

test("simulate ship sinking", () => {
    const ship = new Ship();
    for (let i = 0; i < ship.size; i++) {
        ship.hit();
    }
    expect(ship.isSunk()).toBeTruthy();
});
