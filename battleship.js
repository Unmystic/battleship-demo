import { Player } from "./player.js";
import { Ship } from "./ship.js";

const gameCont = document.querySelectorAll(".gameCont");

function createBoard(board, side = "left") {
    const gameCont =
        side === "left"
            ? document.querySelector(".leftBoard")
            : document.querySelector(".rightBoard");
    const grid = board.grid.flat();
    grid.forEach((c) => {
        const cell = document.createElement("div");
        gameCont.appendChild(cell);
        if (c === 1) {
            console.log(cell);
            cell.style.border = "0.75mm ridge #968ea4";

            cell.classList.add("ridge");
        }
    });
}

function setPlayers() {
    const player1 = new Player(true);
    const player2 = new Player(false);
    player1.board.grid[0] = new Array(10).fill(1);
    createBoard(player1.board, "left");
    createBoard(player2.board, "right");
}

setPlayers();
