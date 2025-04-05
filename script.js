const GameLogic = (() => {
  const GameBoard = (() => {
    let board = Array(9).fill(null);

    const resetBoard = () => {
      board = Array(9).fill(null);
    };

    const getBoardState = () => board;

    const checkMoveValidity = (index, marker) => {
      if (index >= 0 && index < 9 && board[index] === null) {
        board[index] = marker;
        return true;
      }
      return false;
    };

    return {getBoardState, checkMoveValidity, resetBoard};
  })();

  const Player = (name, marker) => {
    return { name, marker };
  };

  const GameController = (() => {
    let players = [];
    let activePlayer = 0;
    let gameOver = false;

    const newGame = (player1Name = 'Player 1', player2Name = 'Player 2') => {
      players = [
        Player(player1Name, 'X'),
        Player(player2Name, 'O')
      ];
      activePlayer = 0;
      gameOver = false;
      GameBoard.resetBoard();
    };

    const getActivePlayer = () => players[activePlayer];

    const swapActivePlayer = () => {
      activePlayer = activePlayer === 0 ? 1 : 0;
    };

    const checkWinCondition = () => {
      const boardState = GameBoard.getBoardState();
      const winConditions = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];

      for (const winCondition of winConditions) {
        const [a,b,c] = winCondition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]){
          return {
            marker: boardState[a],
            winningCells: [a, b, c]
          };
        }
      }

      if (!boardState.includes(null)) return { marker: 'draw' };
      return null;
    };

    const playerTurn = (index) => {
      if (gameOver) return false;

      const player = getActivePlayer();

      if (GameBoard.checkMoveValidity(index, player.marker)) {
        const result = checkWinCondition();

        if (result) {
          gameOver = true;
          return {gameOver: true, result};
        }
        swapActivePlayer();
        return {gameOver: false, result: null};
      }
      return false;
    };
    
    const isGameOver = () => gameOver;

    return {newGame, getActivePlayer, playerTurn, isGameOver};
  })();

  const DisplayController = (() => {
    const elements = {
    board: document.getElementById('game-board'),
    status: document.getElementById('game-status'),
    controls: document.getElementById('game-controls'),
    container: document.getElementById('game-container')
    }

    let gameboardCreated = false;
    let playerFormVisible = true;
    let playerNames = {
      player1: 'Player 1',
      player2: 'Player 2'
    };

    const init = () => {
      setupPlayerForm();
      
      if (elements.board) elements.board.style.display = 'none';
      if (elements.status) elements.status.style.display = 'none';
      if (elements.controls) elements.controls.style.display = 'none';
    };

    const setupPlayerForm = () => {
      if (!elements.container) return;
      
      const formContainer = document.createElement('div');
      formContainer.id = 'add-players';
      formContainer.innerHTML = `
        <h2>Enter Player Names</h2>
        <div>
            <label for='player1'>Player X:</label>
            <input type='text' id='player1' value='Player 1'></input>
        </div>
        <div>
            <label for='player2'>Player O:</label>
            <input type='text' id='player2' value='Player 2'></input>
        </div>
        <button id='new-game-btn-form'>Start Game</button>
      `;

      elements.container.prepend(formContainer);
      
      const startButton = document.getElementById('new-game-btn-form');
      if (startButton) {
        startButton.addEventListener('click', () => startNewGame(true));
      }
    };

    const startNewGame = (isFirstGame = false) => {
      if (isFirstGame && playerFormVisible) {
        setupFirstGame();
      }
      resetWinningCells();
      GameController.newGame(playerNames.player1, playerNames.player2);

      if (!gameboardCreated) {
        createGameBoard();
        gameboardCreated = true;
      } else {
        updateBoard();
      }
      
      updateStatus(`${playerNames.player1}'s turn (X)`);
    };

    const setupFirstGame = () => {
      const player1Input = document.getElementById('player1');
      const player2Input = document.getElementById('player2');
      
      if (player1Input) playerNames.player1 = player1Input.value || 'Player 1';
      if (player2Input) playerNames.player2 = player2Input.value || 'Player 2';
      
      const formContainer = document.getElementById('add-players');
      if (formContainer) formContainer.style.display = 'none';
      playerFormVisible = false;
      
      if (elements.board) elements.board.style.display = 'grid';
      if (elements.status) elements.status.style.display = 'block';
      if (elements.controls) elements.controls.style.display = 'block';
      
      const resetButton = document.getElementById('new-game-btn');
      if (resetButton) {
        resetButton.textContent = 'Reset Game';
        resetButton.addEventListener('click', () => startNewGame(false)); // indicates this is a reset
      }
    };

    const resetWinningCells = () => {
      if (elements.board) {
        const cells = elements.board.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('winner'));
      }
    };

    const createGameBoard = () => {
      if (!elements.board) return;
      
      elements.board.innerHTML = '';

      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;

        cell.addEventListener('click', () => handleCellClick(i));
        elements.board.appendChild(cell);
      }
    };

    const handleCellClick = (index) => {
      const result = GameController.playerTurn(index);
      if (!result) return;

      updateBoard();

      if (result.gameOver) {
        handleGameOver(result.result);
      } else {
        const player = GameController.getActivePlayer();
        const currentPlayerName = player.marker === 'X' ? playerNames.player1 : playerNames.player2;
        updateStatus(`${currentPlayerName}'s turn (${player.marker})`);
      }
    };

    const handleGameOver = (result) => {
      if (result.marker === 'draw') {
        updateStatus('Draw Game');
      } else {
        if (result.winningCells && elements.board) {
          const cells = elements.board.querySelectorAll('.cell');
          result.winningCells.forEach(index => cells[index].classList.add('winner'));
        }

        const winner = result.marker === 'X' ? playerNames.player1 : playerNames.player2;
        updateStatus(`${winner} wins!`);
      }
    };

    const updateBoard = () => {
      if (!elements.board) return;
      
      const boardState = GameBoard.getBoardState();
      const cells = elements.board.querySelectorAll('.cell');

      cells.forEach((cell, index) => {
        cell.textContent = boardState[index] || '';

        if (boardState[index]) {
          cell.dataset.marker = boardState[index];
        } else {
          delete cell.dataset.marker;
        }
      });
    };

    const updateStatus = (status) => {
      if (elements.status) {
        elements.status.textContent = status;
      }
    };

    return { init };
  })();

  const init = () => {
    DisplayController.init();
  };
  
  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  GameLogic.init();
});