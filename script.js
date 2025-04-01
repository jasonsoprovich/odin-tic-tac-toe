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

      // cell.addEventListener('click', () => {
      //   cell.innerText = 'X';
      // });

      gameBoard.appendChild(cell);
    });

    container.appendChild(gameBoard);
    console.log('gameboard created');
  }
})();

function createPlayer(name, marker) {
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

const player1 = new createPlayer('Jason','X');
const player2 = new createPlayer('Casey','O');

// function gameLogic(player, location) {

// }

// function displayController {
//   const cellSelection = document.querySelectorAll('cell');
// }