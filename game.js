const Gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];

    function getBoard() {
        return board;
    }

    function setCell(index, value) {
        if (index >= 0 && index < 9 && board[index] === "") {
            board[index] = value;
            return true;
        }
        return false;
    }

    function resetBoard() {
        board = ["", "", "", "", "", "", "", "", ""];
    }

    return {
        getBoard,
        setCell,
        resetBoard
    };
})();

const Player = (name, mark) => {
    return { name, mark };
};

const DisplayController = (function() {
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const startButton = document.getElementById('start-game');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const gameContainer = document.querySelector('.game-container');

    let currentPlayer;
    let gameActive = false;

    function renderBoard() {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    }

    function checkWinner() {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]            
        ];
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes("") ? null : "Tie";
    }

    function handleCellClick(event) {
        if (!gameActive) return;
        const cell = event.target;
        const index = cell.getAttribute('data-index');
        if (Gameboard.setCell(index, currentPlayer.mark)) {
            renderBoard();
            const result = checkWinner();
            if (result) {
                gameActive = false;
                if (result === "Tie") {
                    status.textContent = "It's a Tie!";
                } else {
                    status.textContent = `${currentPlayer.name} wins!`;
                }
                startButton.textContent = "Restart Game";
            } else {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
                status.textContent = `${currentPlayer.name}'s turn`;
            }
        }
    }

    function startGame() {
        if (gameActive) {
            Gameboard.resetBoard();
            renderBoard();
            status.textContent = `${currentPlayer.name}'s turn`;
            return;
        }

        const player1Name = player1Input.value || "Player 1";
        const player2Name = player2Input.value || "Player 2";
        player1 = Player(player1Name, "X");
        player2 = Player(player2Name, "O");
        currentPlayer = player1;
        gameActive = true;
        Gameboard.resetBoard();
        renderBoard();
        status.textContent = `${currentPlayer.name}'s turn`;
        gameContainer.style.display = 'flex';
        startButton.textContent = "Restart Game";
    }

    function init() {
        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        startButton.addEventListener('click', startGame);
    }

    return {
        init
    };
})();

DisplayController.init();
