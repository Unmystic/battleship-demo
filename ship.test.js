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
