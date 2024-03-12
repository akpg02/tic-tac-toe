import React from "react";
import "./Button.css";

function Button({ value, onClick, index }) {
  return <button onClick={() => onClick(index)}>{value}</button>;
}

export default Button;
