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

function Player(name, marker) {
  let _name = name;
  let _marker = marker;
  let _score = 0;

  return {
    getName() {
      return _name;
    },
    getMarker() {
      return _marker;
    },
    getScore() {
      return _score;
    },
    incrementScore() {
      _score++;
    }
  };
}

function createPlayers() {
  const player1Name = prompt('Player 1 - Enter Name: ');
  const player1Marker = 'X';

  const player2Name = prompt('Player 2 - Enter Name: ');
  const player2Marker = 'O';

  const player1 = Player(player1Name, player1Marker);
  const player2 = Player(player2Name, player2Marker);
  return { player1, player2 }
}

document.querySelector('#new-game-btn').addEventListener('click', () => {
  const players = createPlayers();
  DisplayController();
});

// let currentPlayer;

// if (checkWinCondition()) {
//   alert(`${currentPlayer.getName()} wins!`);
//   return;
// }
// swapPlayer();

function swapPlayer() {
  currentPlayer = currentPlayer === players.player1 ? players.player2 : players.player1;
  console.log(`${currentPlayer.getName}'s turn.`);  
}
