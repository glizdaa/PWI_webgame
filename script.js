document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const modeSelect = document.getElementById('mode-select');
    const startButton = document.getElementById('start-button');
    const gameBoard = document.getElementById('gameBoard');
    let turn = true; // true dla X, false dla O
    let gameMode = ""; // "single" lub "multi"
    let gameActive = true;

    startButton.addEventListener('click', () => {
        gameMode = modeSelect.value;
        startGame();
    });

	function startGame() {
		cells.forEach(cell => {
			cell.innerText = ''; // Czyści tekst w komórce
			cell.classList.remove("X", "O"); // Usuwa klasy X i O, jeśli istnieją
			cell.removeEventListener('click', handleCellClick); // Usuwa poprzednie nasłuchiwacze zdarzeń
			cell.addEventListener('click', handleCellClick, { once: true }); // Dodaje nasłuchiwacz zdarzeń
		});
		turn = true; // Resetuje turę na początkową (X)
		gameActive = true; // Ustawia grę jako aktywną
		gameBoard.style.display = 'grid'; // Wyświetla planszę
		gameBoard.style.pointerEvents = 'auto'; // Włącza klikalność planszy
	}

    function handleCellClick(e) {
        if (!gameActive) return;
        const cell = e.target;
        const currentPlayer = turn ? 'X' : 'O';
        placeMark(cell, currentPlayer);
        if (checkWin(currentPlayer)) {
            endGame(false, currentPlayer);
            return;
        }
        if (isDraw()) {
            endGame(true);
            return;
        }
        turn = !turn;
        if (gameMode === "single" && !turn) {
            gameBoard.style.pointerEvents = 'none'; // Temporarily disable board clicks
            setTimeout(() => {
                aiMove();
                gameBoard.style.pointerEvents = 'auto'; // Re-enable board clicks
            }, 400); // Daj AI czas na wykonanie ruchu
        }
    }

    function placeMark(cell, currentPlayer) {
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer);
    }

    function checkWin(currentPlayer) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return cells[index].classList.contains(currentPlayer);
            });
        });
    }

    function endGame(draw, winner = null) {
        gameActive = false;
        if (draw) {
            alert("Remis!");
        } else {
            alert(`${winner} Wygrywa!`);
        }
    }

    function isDraw() {
        return [...cells].every(cell => {
            return cell.innerText === 'X' || cell.innerText === 'O';
        });
    }

    function aiMove() {
        const availableCells = Array.from(cells).filter(cell => !cell.innerText);
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        randomCell.click();
    }
});