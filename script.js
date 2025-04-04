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
  });

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
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] ===board[c]){
          return board[a];
        }
      }

      if (!board.includes(null)) return 'draw';
      return null;
    };

    const playerTurn = (index) => {
      if (gameOver) return false;

      const activePlayer = getActivePlayer();

      if (GameBoard.checkMoveValidity(index,activePlayer.marker)) {
        const result = checkWinCondition();

        if (result) {
          gameOver = true;
          return {gameOver: true, result};
        }
        swapActivePlayer();
        return{gameOver:false, result:null};
      }
      return false;
    };
    const isGameOver = () => gameover;

    return {newGame, getActivePlayer, playerTurn, isGameOver};
  })();

  const DisplayController = (() => {
    const boardElement = document.getElementById('game-board');
    const statusElement = document.getElementById('game-status');
    const restartButton = document.getElementById('new-game-btn');    

    const newGame = () => {
      createGameBoard();
      updateStatus(`Player X's turn.`);

      restartButton.addEventListener('click', () => {
        gameController.newGame();
        updateBoard();
        updateStatus(`Player X's turn.`);
      });
    };

      const createGameBoard = () => {
        boardElement.innerHTML = '';

        for (let i = 0; i < 9; i++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.dataset.index = i;

          cell.addEventListener('click', () => {
            const result = gameController.playerTurn(i);
            if (result) {
              updateBoard();

              if (result.gameOver) {
                if (result.result === 'draw') {
                  updateStatus('Draw Game!');
                  } else {
                    updateStatus(`Player ${result.result} wins!`)
                  }
              } else {
                const activePlayer = GameController.getActivePlayer();
                updateStatus(`Player ${activePlayerPlayer.marker}'s turn`);
              }
            }
          });

          boardElement.appendChild(cell);
        }
      };

      const updateBoard = () => {
        const board = GameBoard.getBoardState();
        const cells = boardElement.querySelectorAll('.cell');

        cells.forEach((cell, index) => {
          cells.textContent = board[index] || '';
        });
      };

      const updateStatus = (status) => {
        statusElement.textContent = status;
      };
  })();

  const newGame = () => {
    gameController.newGame();
    DisplayController.newGame();
  };
  
  return { newGame };
})();
