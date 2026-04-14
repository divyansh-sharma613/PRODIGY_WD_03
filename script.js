const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = false;
let mode = "";

const winPatterns = [
 [0,1,2],[3,4,5],[6,7,8],
 [0,3,6],[1,4,7],[2,5,8],
 [0,4,8],[2,4,6]
];

cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});

function setMode(selectedMode) {
    mode = selectedMode;
    resetGame();
    gameActive = true;

    // Remove old glow
    document.querySelectorAll(".mode-select button").forEach(btn => {
        btn.classList.remove("active");
    });

    // Add glow to selected button
    if (mode === "pvp") {
        document.querySelectorAll(".mode-select button")[0].classList.add("active");
        statusText.innerText = "Player X Turn";
    } else {
        document.querySelectorAll(".mode-select button")[1].classList.add("active");
        statusText.innerText = "Your Turn (X)";
    }
}

function handleClick(e) {
    let i = e.target.dataset.i;

    if (board[i] !== "" || !gameActive) return;

    makeMove(i, currentPlayer);

    if (checkWinner()) return;

    if (mode === "ai") {
        currentPlayer = "O";
        setTimeout(aiMove, 400);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = `Player ${currentPlayer} Turn`;
    }
}

function aiMove() {
    let move = getBestMove();
    makeMove(move, "O");

    if (checkWinner()) return;

    currentPlayer = "X";
    statusText.innerText = "Your Turn (X)";
}

function makeMove(i, player) {
    board[i] = player;
    cells[i].innerText = player;
}

function getBestMove() {
    for (let p of winPatterns) {
        let [a,b,c] = p;
        let line = [board[a], board[b], board[c]];
        if (line.filter(x=>x==="O").length===2 && line.includes("")) {
            return p[line.indexOf("")];
        }
    }

    for (let p of winPatterns) {
        let [a,b,c] = p;
        let line = [board[a], board[b], board[c]];
        if (line.filter(x=>x==="X").length===2 && line.includes("")) {
            return p[line.indexOf("")];
        }
    }

    let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    return empty[Math.floor(Math.random()*empty.length)];
}

function checkWinner() {
    for (let p of winPatterns) {
        let [a,b,c] = p;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {

            cells[a].classList.add("win");
            cells[b].classList.add("win");
            cells[c].classList.add("win");

            gameActive = false;

            if (mode === "ai") {
                statusText.innerText = board[a] === "X" ? "🎉 You Win!" : "🤖 AI Wins!";
            } else {
                statusText.innerText = `🎉 Player ${board[a]} Wins!`;
            }

            return true;
        }
    }

    if (!board.includes("")) {
        statusText.innerText = "🤝 Draw!";
        gameActive = false;
        return true;
    }

    return false;
}

function resetGame() {
    board = ["","","","","","","","",""];
    currentPlayer = "X";
    gameActive = false;

    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("win");
    });

    statusText.innerText = "Select Mode";
}