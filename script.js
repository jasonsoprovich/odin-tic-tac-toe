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

    const newGame = () => {
      players = [
        Player('Player 1', 'X'),
        Player('Player 2', 'O')
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

    return {newGame, getActivePlayer, playerTurn, isGameOver};
  })();

  const DisplayController = (() => {
    const boardElement = document.getElementById('game-board');
    const statusElement = document.getElementById('game-status');
    const restartButton = document.getElementById('new-game-btn');    


    const init = () => {
      if (restartButton) {
        restartButton.addEventListener('click', () => {
          startNewGame();
        });
      }
    
      createGameBoard();
      updateStatus('Click "New Game" to start playing');
    };

    const startNewGame = () => {
      GameController.newGame();
      updateBoard();
      updateStatus(`Player X's turn.`);
    };

    const createGameBoard = () => {
      if (!boardElement) {
        console.error('Game board element not found');
        return;
      }
      
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
                updateStatus(`Player ${result.result} wins!`);
              }
            } else {
              const player = GameController.getActivePlayer();
              updateStatus(`Player ${player.marker}'s turn`);
            }
          }
        });

        boardElement.appendChild(cell);
      }
    };

    const updateBoard = () => {
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

    return { init, startNewGame, updateBoard, updateStatus };
  })();

  const init = () => {
    DisplayController.init();
  };
  
  return { init };
})();

// Initialize the UI when the DOM is loaded, but wait for "New Game" click to start playing
document.addEventListener('DOMContentLoaded', () => {
  GameLogic.init();
});
