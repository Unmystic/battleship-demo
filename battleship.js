import { Player } from "./player.js";
import { Ship } from "./ship.js";

const gameCont = document.querySelectorAll(".gameCont");

function createBoard(board, side = "left") {
    const gameCont =
        side === "left"
            ? document.querySelector(".leftBoard")
            : document.querySelector(".rightBoard");
    const grid = board.grid.flat();

    for (let i = 0; i < grid.length; i++) {
        const cell = document.createElement("div");
        cell.id = i;
        gameCont.appendChild(cell);
        if (grid[i] === 1 && gameCont.classList.contains("leftBoard")) {
            cell.style.border = "0.75mm ridge #968ea4";
            cell.style.boxSizing = "border-box";
            //cell.style.margin = "1mm";
            cell.classList.add("ridge");
        }
        if (gameCont.classList.contains("rightBoard")) {
            const btn = document.createElement("button");
            btn.classList.add("btnGrid");
            cell.appendChild(btn);
        }
    }
    if (gameCont.classList.contains("rightBoard")) {
        gameCont.addEventListener("click", function(e) {
            attackCell(e);
        });
    }
}

function attackCell(e) {
    const target = e.target;
    console.log(target);
    let cell = target.closest("div");
    if (cell.classList.contains("gameCont")) {
        cell = cell.firstChild;
    }
    if (cell.firstChild) {
        cell.removeChild(cell.querySelector("button"));
    }
}

function setPlayers() {
    const player1 = new Player(true);
    const player2 = new Player(false);
    player1.placeShips();
    player2.placeShips();
    createBoard(player1.board, "left");
    createBoard(player2.board, "right");
}

setPlayers();
