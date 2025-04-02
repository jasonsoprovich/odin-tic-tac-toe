(function initGameboard() {
  const container = document.querySelector('.container');
  if (container) {
    const gameBoardExists = document.querySelector('.game-board');

    if (gameBoardExists) {
      container.removeChild(gameBoardExists);
      console.log('game board reset')
    }

    const gameBoard = document.createElement('div');
    gameBoard.id = 'game-board';
    
    const cells = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
    
    cells.forEach(cellID => {
      const cell = document.createElement('div');
      cell.id = cellID;
      cell.classList.add('cell');

      gameBoard.appendChild(cell);
    });

    container.appendChild(gameBoard);
    console.log('gameboard created');
  }
})();

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

  const player1 = Player(player1Name,player1Marker);
  const player2 = Player(player2Name,player2Marker);
  return {player1, player2}
}

document.querySelector('#new-game-btn').addEventListener('click', () => {
  const players = createPlayers();
  initGameboard();
});
// function gameLogic(player, location) {
// if A1.innerText = A2.innerText
// }

function displayController(player,marker) {
  cell.addEventListener('click', () => {
    cell.innerText = `${marker}`;
  });

}

