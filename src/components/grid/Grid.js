import { DIMENSIONS, DRAW } from "../../utils/constants";

export default class Board {
  grid;
  constructor(grid) {
    this.grid = grid || new Array(DIMENSIONS ** 2).fill(null);
  }

  makeMove = (square, player) => {
    if (this.grid[square] === null) {
      this.grid[square] = player;
    }
  };

  // Collect indices of the empty squares and return them
  getEmptySquares = (grid = this.grid) => {
    let squares = [];
    grid.forEach((square, i) => {
      if (square === null) squares.push(i);
    });
    return squares;
  };

  isEmpty = (grid = this.grid) => {
    return this.getEmptySquares(grid).length === DIMENSIONS ** 2;
  };

  getWinner = (grid = this.grid) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let res = null;
    winningCombos.forEach((el, i) => {
      if (
        grid[el[0]] !== null &&
        grid[el[0]] === grid[el[1]] &&
        grid[el[0]] === grid[el[2]]
      ) {
        res = grid[el[0]];
        this.winningIndex = i;
      } else if (res === null && this.getEmptySquares(grid).length === 0) {
        res = DRAW;
        this.winningIndex = null;
      }
    });
    return res;
  };

  /**
   * Get the styles for strike-through based on the combination that won
   */
  getStrikethroughStyles = () => {
    const defaultWidth = 40;
    const diagonalWidth = 49;
    switch (this.winningIndex) {
      case 0:
        return {
          transform: "none",
          top: "8rem",
          left: "1rem",
          width: `${defaultWidth}rem`,
        };
      case 1:
        return {
          transform: "none",
          top: "23rem",
          left: "0.938rem",
          width: `${defaultWidth}rem`,
        };
      case 2:
        return {
          transform: "none",
          top: "38.125rem",
          left: "0.938rem",
          width: `${defaultWidth}rem`,
        };
      case 3:
        return {
          transform: `rotate(90deg)`,
          top: "23rem",
          left: "-13.375rem",
          width: `${defaultWidth}rem`,
        };
      case 4:
        return {
          transform: "rotate(90deg)",
          top: "23rem",
          left: "0.938rem",
          width: `${defaultWidth}rem`,
        };
      case 5:
        return {
          transform: `rotate(90deg)`,
          top: "23rem",
          left: "14.188rem",
          width: `${defaultWidth}rem`,
        };
      case 6:
        return {
          transform: `rotate(45deg)`,
          top: "24rem",
          left: "-2.75rem",
          width: `${diagonalWidth}rem`,
        };

      case 7:
        return {
          transform: "rotate(-45deg)",
          top: "20rem",
          left: "-3rem",
          width: `${diagonalWidth}rem`,
        };
      default:
        return null;
    }
  };

  clone = () => {
    return new Board(this.grid.concat());
  };
}
