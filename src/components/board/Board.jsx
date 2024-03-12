import React from "react";
import "./Board.css";
import Button from "../button/Button";
import { PLAYER_X } from "../../utils/constants";

function Board({ board, onClick }) {
  return (
    <div className="board">
      {board.map((value, i) => {
        const isActive = value !== null;
        return (
          <Button
            key={i}
            index={i}
            onClick={() => onClick(i)}
            value={isActive ? (value === PLAYER_X ? "X" : "O") : ""}
          />
        );
      })}
    </div>
  );
}

export default Board;
