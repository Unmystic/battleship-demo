class Ship {
    constructor(size = 3) {
        this.size = size;
        this.numHits = 0;
    }

    hit() {
        this.numHits += 1;
    }
}

export { Ship };
