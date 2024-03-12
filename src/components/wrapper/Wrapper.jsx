import React, { useState, useEffect, useCallback } from "react";
import { minimax } from "../../utils/minimax.js";
import {
  DIMENSIONS,
  PLAYER_X,
  PLAYER_O,
  GAME_STATES,
  GAME_MODES,
  DRAW,
} from "../../utils/constants.js";
import { getRandomInt, switchPlayer } from "../../utils/utils.js";
import "./Wrapper.css";
import Board from "../board/Board";
import Grid from "../grid/Grid";
import ResultModal from "../modal/ResultModal.jsx";

const emptyGrid = new Array(DIMENSIONS ** 2).fill(null);
const grid = new Grid();

function Wrapper() {
  const [players, setPlayers] = useState({ human: null, ai: null });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [board, setBoard] = useState(emptyGrid);

  const [nextMove, setNextMove] = useState(null);

  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(GAME_MODES.medium);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const boardWinner = grid.getWinner(board);
    const declareWinner = (winner) => {
      let winnerStr;
      switch (winner) {
        case PLAYER_X:
          winnerStr = "Player X wins!";
          break;
        case PLAYER_O:
          winnerStr = "Player O wins!";
          break;
        case DRAW:
        default:
          winnerStr = "It's a draw";
      }
      setGameState(GAME_STATES.over);
      setWinner(winnerStr);
      // Slight delay for the modal so there is some time to see the last move
      setTimeout(() => setModalOpen(true), 300);
    };

    if (boardWinner !== null && gameState !== GAME_STATES.over) {
      declareWinner(boardWinner);
    }
  }, [gameState, board, nextMove]);

  const move = useCallback(
    (index, player) => {
      if (player !== null && gameState === GAME_STATES.inProgress) {
        setBoard((board) => {
          const boardCopy = board.concat();
          boardCopy[index] = player;
          return boardCopy;
        });
      }
    },
    [gameState]
  );

  /**
   * Make the AI move. If it's the first move (the board is empty),
   * make the move at any random cell to skip unnecessary Minimax calculations
   */
  const aiMove = useCallback(() => {
    const grid = new Grid(board.concat());
    const emptyIndices = grid.getEmptySquares(board);
    let index;
    switch (mode) {
      case GAME_MODES.easy:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyIndices.includes(index));
        break;
      // Medium level is approx. half of the moves are Minimax and the other half random
      case GAME_MODES.medium:
        const smartMove = !grid.isEmpty(board) && Math.random() < 0.5;
        if (smartMove) {
          index = minimax(grid, players.ai)[1];
        } else {
          do {
            index = getRandomInt(0, 8);
          } while (!emptyIndices.includes(index));
        }
        break;
      case GAME_MODES.difficult:
      default:
        index = grid.isEmpty(board)
          ? getRandomInt(0, 8)
          : minimax(grid, players.ai)[1];
    }

    if (index !== null && !board[index]) {
      if (players.ai !== null) {
        move(index, players.ai);
      }
      setNextMove(players.human);
    }
  }, [move, board, players, mode]);

  useEffect(() => {
    let timeout;
    if (
      nextMove !== null &&
      nextMove === players.ai &&
      gameState !== GAME_STATES.over
    ) {
      timeout = setTimeout(() => {
        aiMove();
      }, 500);
    }
    return () => timeout && clearTimeout(timeout);
  }, [aiMove, gameState, nextMove, players.ai]);

  const humanMove = (index) => {
    if (!board[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.ai);
    }
  };

  const choosePlayer = (option) => {
    setPlayers({ human: option, ai: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
    setNextMove(PLAYER_X);
  };

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setBoard(emptyGrid);
    setModalOpen(false);
  };

  const changeMode = (e) => {
    setMode(e.target.value);
  };

  return gameState === GAME_STATES.notStarted ? (
    <div>
      <div className="inner">
        <p>Select difficulty</p>
        <select className="levels" onChange={changeMode} value={mode}>
          {Object.keys(GAME_MODES).map((key) => {
            const gameMode = GAME_MODES[key];
            return (
              <option key={gameMode} value={gameMode}>
                {key}
              </option>
            );
          })}
        </select>
      </div>
      <div className="inner">
        <p>Choose your player</p>
        <div className="button-row">
          <button onClick={() => choosePlayer(PLAYER_X)}>X</button>
          <p>or</p>
          <button onClick={() => choosePlayer(PLAYER_O)}>O</button>
        </div>
      </div>
    </div>
  ) : (
    <div className="wrapper">
      <Board board={board} onClick={(e) => humanMove(e)} />
      <div
        className="strike-through"
        style={
          gameState === GAME_STATES.over ? grid.getStrikethroughStyles() : {}
        }
      ></div>
      <ResultModal
        close={() => setModalOpen(false)}
        startNewGame={startNewGame}
        winner={winner}
        isOpen={modalOpen}
      />
    </div>
  );
}

export default Wrapper;
