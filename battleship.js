import { GameBoard } from "./gameboard.js";
import { Computer, Player } from "./player.js";
import { Ship } from "./ship.js";

const gameCont = document.querySelectorAll(".gameCont");
const playField = document.querySelector(".playField");
const gameMsg = document.querySelector(".menuMsg");
const leftBoard = document.querySelector(".leftBoard");
const rightBoard = document.querySelector(".rightBoard");
const btnReset = document.querySelector("#btnReset");
const btnBotMove = document.querySelector("#btnBot");

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
            cell.style.border = "1.75mm ridge #968ea4";
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
    let cell = target.closest("div");
    if (cell.classList.contains("gameCont")) {
        return;
    }
    if (cell.firstChild && cell.innerText != "X") {
        cell.removeChild(cell.querySelector("button"));
    }
    checkBoard(cell, board);
}

function checkBoard(cell, board) {
    const row = cell.id[0];
    const col = cell.id[1];
    //if (board.grid[row][col] == 1) {
    //    cell.style.backgroundColor = "red";
    //} else {
    //    cell.textContent = "X";
    //    cell.classList.add("miss");
    //}
    board.receiveAttack([row, col]);
    updateMoves(row, col, board);
}

function updateMoves(row, col, board, cont = ".rightBoard") {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const moveLabel =
        cont === ".rightBoard"
            ? document.querySelector(".playerText")
            : document.querySelector(".compText");
    const result = markShip(row, col, board, cont);
    moveLabel.textContent =
        result.length > 0
            ? letters[row] + nums[col] + result
            : letters[row] + nums[col] + " -- Miss";
    if (board.isGameFinished()) {
        gameMsg.textContent = "All ships are destroyed!";
        document.querySelector(".rightBoard").style.pointerEvents = "none";
    }
}

function markShip(row, col, board, cont = ".rightBoard") {
    let result = "";
    const idx = `${row}${col}`;
    const cell = document.querySelector(cont).querySelector(`[id="${idx}"]`);
    if (board.checkCoords(row, col)) {
        cell.style.backgroundColor = "red";
        const ship = board.findShip([row, col]);
        if (ship.isSunk()) {
            result = "-- Ship SUNK";
        } else result = "-- HIT";
    } else {
        cell.textContent = "X";
        cell.classList.add("miss");
    }
    return result;
}
function setPlayers() {
    const player1 = new Player(true);
    player1.placeShips();
    createBoard(player1.board, "left");
    const player2 = new Computer(player1.board);
    player2.placeShips();
    createBoard(player2.board, "right");
    btnBotMove.addEventListener("click", function() {
        const [row, col] = player2.makeMove();
        updateMoves(row, col, player2.opponentBoard, ".leftBoard");
    });
}

btnReset.addEventListener("click", function() {
    //rightBoard.style.pointerEvents = "auto";
    //rightBoard.innerHTML = "";
    playField.removeChild(document.querySelector(".rightBoard"));
    const rb = document.createElement("div");
    rb.classList.add("gameCont");
    rb.classList.add("rightBoard");
    playField.appendChild(rb);
    leftBoard.innerHTML = "";
    gameMsg.textContent = "Click on cell to place a move";
    document.querySelector(".playerText").textContent = "Waiting for the move";
    document.querySelector(".compText").textContent = "No previous moves";
    setPlayers();
});

setPlayers();
