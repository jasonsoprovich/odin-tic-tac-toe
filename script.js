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
          return boardState[a];
        }
      }

      if (!boardState.includes(null)) return 'draw';
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
    const getPlayers = () => players;

    return {newGame, getActivePlayer, playerTurn, isGameOver, getPlayers};
  })();

  const DisplayController = (() => {
    const boardElement = document.getElementById('game-board');
    const statusElement = document.getElementById('game-status');
    const gameControlsElement = document.getElementById('game-controls');
    let gameboardCreated = false;
    let playerFormVisible = true;
    
    // Keep track of player names
    let currentPlayer1Name = 'Player 1';
    let currentPlayer2Name = 'Player 2';

    const init = () => {
      // Create the player form first
      setupPlayerForm();
      
      // Initially hide the game board and controls
      if (boardElement) boardElement.style.display = 'none';
      if (statusElement) statusElement.style.display = 'none';
      if (gameControlsElement) gameControlsElement.style.display = 'none';
    };

    const setupPlayerForm = () => {
      const container = document.getElementById('game-container');
      if (!container) return;
      
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

      container.prepend(formContainer);
      
      // Set up the New Game button in the form
      const newGameBtnForm = document.getElementById('new-game-btn-form');
      if (newGameBtnForm) {
        newGameBtnForm.addEventListener('click', () => {
          startNewGame(true); // true indicates this is the first game
        });
      }
    };

    const startNewGame = (isFirstGame = false) => {
      if (isFirstGame && playerFormVisible) {
        // Get player names from the form if this is the first game
        const player1Input = document.getElementById('player1');
        const player2Input = document.getElementById('player2');
        
        if (player1Input) currentPlayer1Name = player1Input.value || 'Player 1';
        if (player2Input) currentPlayer2Name = player2Input.value || 'Player 2';
        
        // Hide the form
        const formContainer = document.getElementById('add-players');
        if (formContainer) formContainer.style.display = 'none';
        playerFormVisible = false;
        
        // Show the game elements
        if (boardElement) boardElement.style.display = 'grid';
        if (statusElement) statusElement.style.display = 'block';
        if (gameControlsElement) gameControlsElement.style.display = 'block';
        
        // Set up the New Game button in the game controls
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) {
          newGameBtn.textContent = 'Reset Game';
          newGameBtn.addEventListener('click', () => {
            startNewGame(false); // false indicates this is a reset
          });
        }
      }
      
      // Start or reset the game with the current player names
      GameController.newGame(currentPlayer1Name, currentPlayer2Name);
      
      // Create or update the game board
      if (!gameboardCreated) {
        createGameBoard();
        gameboardCreated = true;
      } else {
        updateBoard();
      }
      
      // Update the status
      updateStatus(`${currentPlayer1Name}'s turn (X)`);
    };

    const createGameBoard = () => {
      if (!boardElement) return;
      
      boardElement.innerHTML = '';

      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;

        cell.addEventListener('click', () => {
          const result = GameController.playerTurn(i);
          if (result) {
            updateBoard();

            if (result.gameOver) {
              if (result.result === 'draw') {
                updateStatus('Draw Game!');
              } else {
                const winner = result.result === 'X' ? currentPlayer1Name : currentPlayer2Name;
                updateStatus(`${winner} wins!`);
              }
            } else {
              const player = GameController.getActivePlayer();
              const playerName = player.marker === 'X' ? currentPlayer1Name : currentPlayer2Name;
              updateStatus(`${playerName}'s turn (${player.marker})`);
            }
          }
        });

        boardElement.appendChild(cell);
      }
    };

    const updateBoard = () => {
      if (!boardElement) return;
      
      const boardState = GameBoard.getBoardState();
      const cells = boardElement.querySelectorAll('.cell');

      cells.forEach((cell, index) => {
        cell.textContent = boardState[index] || '';
      });
    };

    const updateStatus = (status) => {
      if (statusElement) {
        statusElement.textContent = status;
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