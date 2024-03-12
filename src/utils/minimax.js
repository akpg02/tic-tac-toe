import { SCORES } from "./constants";
import { switchPlayer } from "./utils";

export const minimax = (grid, player) => {
  const multiplier = SCORES[String(player)];
  let thisScore;
  let maxScore = -1;
  let bestMove = null;
  
  // check if the game is over and retrun the score and move if so
  const winner = grid.getWinner();
  if (winner !== null) {
    return [SCORES[winner], 0];
  } else {
    // loop through each empty square on the board
    for (const square of grid.getEmptySquares()) {
      // create a copy of the board and make a move for the current player
      let copy = grid.clone();
      copy.makeMove(square, player);
      // recursively call minimax on the resulting board state,
      // switching the player and multiplying the resulting scrore by the multiplier
      thisScore = multiplier * minimax(copy, switchPlayer(player))[0];

      // update the maxScore and bestMove variables if the current move
      // produces a higher score than previous ones
      if (thisScore >= maxScore) {
        maxScore = thisScore;
        bestMove = square;
      }
    }
    // return the best score found, multiplied by the multiplier,
    // and the corresponding best move as a tuple
    return [multiplier * maxScore, bestMove];
  }
};
