import { GameBoard } from "./gameboard.js";
import { Computer, Player } from "./player.js";
import { Ship } from "./ship.js";

const gameCont = document.querySelectorAll(".gameCont");
const playField = document.querySelector(".playField");
const gameMsg = document.querySelector(".menuMsg");
const leftBoard = document.querySelector(".leftBoard");
const rightBoard = document.querySelector(".rightBoard");
const btnReset = document.querySelector("#btnReset");
const btnStart = document.querySelector("#btnStart");
let whoMoves = 0;
const timeToMove = new CustomEvent("botTime");

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
        if (gameCont.classList.contains("leftBoard")) {
            cell.addEventListener("dragover", (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                ev.dataTransfer.dropEffect = "move";
            });
            cell.addEventListener("dragenter", dragEnterHandler);
            cell.addEventListener("dragleave", dragLeaveHandler);

            // Store drop listener on cell with board parameter
            cell.dropListener = (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                const data = ev.dataTransfer.getData("text/plain");
                const cellList = cellHList(cell.id, data);

                cell.classList.remove("hover");
                cellList.forEach((c) => c.classList.remove("hover"));

                if (canDrop(cell.id, data, board)) {
                    // board is captured in closure
                    cell.style.border = "1.75mm ridge #968ea4";
                    cell.style.boxSizing = "border-box";
                    cellList.forEach((c) => {
                        c.style.border = "1.75mm ridge #968ea4";
                        c.style.boxSizing = "border-box";
                    });
                    readyToStart();
                }
            };
            cell.addEventListener("drop", cell.dropListener);
        }

        if (gameCont.classList.contains("rightBoard")) {
            const btn = document.createElement("button");
            btn.classList.add("btnGrid");
            cell.appendChild(btn);
        }
    }

    if (gameCont.classList.contains("rightBoard")) {
        gameCont.attackHandler = (e) => {
            e.preventDefault();
            console.log("Click", gameCont);
            attackCell(e, board);
        };
        gameCont.addEventListener("click", gameCont.attackHandler);
    }
}

function dragEnterHandler(ev) {
    const cell = ev.currentTarget;
    ev.stopPropagation();
    ev.preventDefault();
    const data = document.querySelector(".dragInfo").textContent;
    cell.classList.toggle("hover");
    //console.log(cellHList(cell.id, data));
    const cellList = cellHList(cell.id, data);
    for (const c of cellList) {
        c.classList.toggle("hover");
    }
}

function dragLeaveHandler(ev) {
    const cell = ev.currentTarget;
    ev.stopPropagation();
    ev.preventDefault();
    cell.classList.toggle("hover");
    const data = document.querySelector(".dragInfo").textContent;
    const cellList = cellHList(cell.id, data);
    for (const c of cellList) {
        c.classList.toggle("hover");
    }
}

function canDrop(cellId, data, board) {
    const [shipId, off] = data.split("-");
    const [size, direction] = [...shipId];
    let startCoords;
    if (direction === "v") {
        startCoords = [parseInt(cellId[0]) - (off - 1), parseInt(cellId[1])];
    }
    if (direction === "h") {
        startCoords = [parseInt(cellId[0]), parseInt(cellId[1] - (off - 1))];
    }
    console.log("Starting coordinats are: ", startCoords);
    if (board.canPlace(startCoords, parseInt(size), direction)) {
        board.addShip(startCoords, new Ship(parseInt(size)), direction);
        removeElements(shipId, direction);
        return true;
    }

    return false;
}

function removeElements(shipId, direction) {
    const element = document.querySelector(`#${CSS.escape(shipId)}`);
    element.draggable = false;
    element.parentElement.removeChild(element);
    let revertId = [...shipId];
    revertId[1] = direction === "v" ? "h" : "v";
    revertId = revertId.join("");
    const revertEl = document.querySelector(`#${CSS.escape(revertId)}`);
    revertEl.draggable = false;
    revertEl.parentElement.removeChild(revertEl);
}

function cellHList(cellId, data) {
    const [shipId, off] = data.split("-");
    const [size, direction] = [...shipId];
    const cellList = [];
    if (direction == "v") {
        for (let i = off; i < size; i++) {
            const newRow = parseInt(cellId[0]) + (size - i);
            const newId = `${newRow}${cellId[1]}`;
            if (leftBoard.querySelector(`#${CSS.escape(newId)}`)) {
                cellList.push(leftBoard.querySelector(`#${CSS.escape(newId)}`));
            }
        }
        for (let i = off - 1; i > 0; i--) {
            const newRow = parseInt(cellId[0]) - i;
            const newId = `${newRow}${cellId[1]}`;
            if (leftBoard.querySelector(`#${CSS.escape(newId)}`)) {
                cellList.push(leftBoard.querySelector(`#${CSS.escape(newId)}`));
            }
        }
    }
    if (direction == "h") {
        for (let i = off; i < size; i++) {
            const newCol = parseInt(cellId[1]) + (size - i);
            const newId = `${cellId[0]}${newCol}`;
            if (leftBoard.querySelector(`#${CSS.escape(newId)}`)) {
                cellList.push(leftBoard.querySelector(`#${CSS.escape(newId)}`));
            }
        }
        for (let i = off - 1; i > 0; i--) {
            const newCol = parseInt(cellId[1]) - i;
            const newId = `${cellId[0]}${newCol}`;
            if (leftBoard.querySelector(`#${CSS.escape(newId)}`)) {
                cellList.push(leftBoard.querySelector(`#${CSS.escape(newId)}`));
            }
        }
    }
    return cellList;
}

function readyToStart() {
    const shipyard = document.querySelector(".shipyard");
    if (shipyard.firstChild.children.length === 0) {
        // removent highlighting cell elements
        const cells = Array.from(leftBoard.querySelectorAll("div"));
        cells.forEach((element) => {
            element.removeEventListener("dragenter", dragEnterHandler);
            element.removeEventListener("dragleave", dragLeaveHandler);
            if (element.dropListener) {
                element.removeEventListener("drop", element.dropListener);
                delete element.dropListener; // Clean up the property
            }
        });
        btnStart.disabled = false;
        document.querySelector("body").removeChild(shipyard);
        gameMsg.textContent = "Press start to begin!";
    }
}

function attackCell(e, board) {
    if (!whoMoves) {
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
}

function checkBoard(cell, board) {
    const row = cell.id[0];
    const col = cell.id[1];

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
        console.log(board);
        gameMsg.textContent = "All ships are destroyed!";
        document.querySelector(".rightBoard").style.pointerEvents = "none";
    } else if (!board.checkCoords(row, col)) {
        whoMoves = whoMoves === 0 ? 1 : 0;
    }
    if (whoMoves && !board.isGameFinished()) {
        gameMsg.dispatchEvent(
            new timeToMove.constructor(timeToMove.type, timeToMove),
        );
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

function botMove(computer) {
    if (whoMoves) {
        const [row, col] = computer.makeMove();
        updateMoves(row, col, computer.opponentBoard, ".leftBoard");
    }
}

function setPlayers() {
    const player1 = new Player(true);
    //player1.placeShips();
    createBoard(player1.board, "left");

    // Store the handler on the button itself
    btnStart.startClickHandler = () => {
        btnStart.disabled = true;
        const player2 = new Computer(player1.board);

        player2.placeShips();
        createBoard(player2.board, "right");
        console.log(player1.board.grid, player2.board.grid);

        gameMsg.botTimeHandler = function() {
            botMove(player2);
        };
        gameMsg.addEventListener("botTime", gameMsg.botTimeHandler);
    };

    btnStart.addEventListener("click", btnStart.startClickHandler);
}

function createShipyard() {
    const shipyard = document.createElement("div");
    shipyard.classList.add("shipyard");
    const horizRow = document.createElement("div");
    horizRow.classList.add("horizontalRow");
    const vertRow = document.createElement("div");
    vertRow.classList.add("verticalRow");
    shipyard.appendChild(vertRow);
    shipyard.appendChild(horizRow);
    let idCount = 420;

    const shipsSizes = [5, 4, 3, 3, 2];

    for (const size of shipsSizes) {
        const ship = document.createElement("div");
        vertRow.appendChild(ship);
        ship.draggable = true;
        const idx = size + "v";
        if (vertRow.querySelector(`#${CSS.escape(idx)}`)) {
            ship.id = idx + 1;
        } else ship.id = idx;
        ship.classList.add("ship", "vertical", "draggable");
        ship.style.height = `${size * 30}px`;
        for (let i = 0; i < size; i++) {
            const cell = document.createElement("div");
            cell.classList.add("ridge");
            cell.id = idCount;
            idCount += 1;
            ship.appendChild(cell);
        }
    }
    for (const size of shipsSizes) {
        const ship = document.createElement("div");
        horizRow.appendChild(ship);
        ship.draggable = true;
        const idx = size + "h";
        if (horizRow.querySelector(`#${CSS.escape(idx)}`)) {
            ship.id = idx + 1;
        } else ship.id = idx;
        ship.classList.add("ship", "horizontal", "draggable");
        ship.style.width = `${size * 30}px`;
        for (let i = 0; i < size; i++) {
            const cell = document.createElement("div");
            cell.classList.add("ridge");
            cell.id = idCount;
            idCount += 1;
            ship.appendChild(cell);
        }
    }

    const draggables = Array.from(shipyard.querySelectorAll(".draggable"));
    draggables.forEach((draggable) => {
        draggable.addEventListener("dragstart", (ev) => {
            let offset;
            if (draggable.id[1] === "v") {
                offset = Math.trunc(ev.offsetY / 30) + 1;
            } else {
                offset = Math.trunc(ev.offsetX / 30) + 1;
            }
            ev.stopPropagation();
            document.querySelector(".dragInfo").textContent =
                `${draggable.id}-${offset}`;
            ev.dataTransfer.setData("text/plain", `${draggable.id}-${offset}`);
            ev.dataTransfer.dropEffect = "move";
            draggable.classList.add("dragging");
        });
        draggable.addEventListener("dragend", (ev) => {
            ev.stopPropagation();
            draggable.classList.remove("dragging");
        });
    });

    document.querySelector("body").appendChild(shipyard);
}

btnReset.addEventListener("click", function() {
    if (btnStart.startClickHandler) {
        btnStart.removeEventListener("click", btnStart.startClickHandler);
        delete btnStart.startClickHandler;
    }
    if (rightBoard.attackHandler) {
        console.log("dfsd");
        rightBoard.removeEventListener("click", rightBoard.attackHandler);
        delete rightBoard.attackHandler;
    }
    if (gameMsg.botTimeHandler) {
        gameMsg.removeEventListener("botTime", gameMsg.botTimeHandler);
        delete gameMsg.botTimeHandler;
    }

    whoMoves = 0;
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
    createShipyard();
});

setPlayers();
createShipyard();
