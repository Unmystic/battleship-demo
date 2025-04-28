import { Player } from "./player.js";
import { Ship } from "./ship.js";

const gameCont = document.querySelector(".gameCont");

function createBoard(num = 100) {
    const numCells = num;

    for (let i = 0; i < numCells; i++) {
        const cell = document.createElement("div");
        console.log(i);
        gameCont.appendChild(cell);
    }
}

createBoard();
