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
    Gameboard.reset();
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
      if (board[a] && board[a] === board[b] && board[a] ===board[c]){
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
});

document.querySelector('#new-game-btn').addEventListener('click', () => {
  gameBoard();
  gameController();
});