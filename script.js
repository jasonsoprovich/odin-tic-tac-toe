(function gameboard() {
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
  this.name = name;
  this.marker = marker;
  this.score = 0;
}

const player1 = new Player('Jason','X');
const player2 = new Player('Casey','O');

Player.prototype.incrementScore = function() {
  return this.score++;
}