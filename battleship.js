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
        cell.id = i.toString().padStart(2, "0");
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
            attackCell(e, board);
        });
    }
}

function attackCell(e, board) {
    const target = e.target;
    console.log(target);
    let cell = target.closest("div");
    if (cell.classList.contains("gameCont")) {
        return;
    }
    if (cell.firstChild && cell.innerText != "X") {
        console.log(cell, cell.firstChild.value);
        cell.removeChild(cell.querySelector("button"));
    }
    console.log(cell);
    checkBoard(cell, board);
}

function checkBoard(cell, board) {
    const row = cell.id[0];
    const col = cell.id[1];
    if (board.grid[row][col] == 1) {
        cell.style.backgroundColor = "red";
    } else {
        cell.textContent = "X";
        cell.classList.add("miss");
    }
    board.receiveAttack([row.col]);
    updateMoves(row, col, board);
}

function updateMoves(row, col, board) {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const moveLabel = document.querySelector(".playerText")
    let result
    if (board.checkCoords) {


        moveLabel.textContent = letters[row] + nums[col];
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
