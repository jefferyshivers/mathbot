import React from "react";

const SVG_SEND = (
  <svg viewBox="0 0 100 80">
    <path d="M0,0 L97.5,35 a20,10 0 0 1 0,10 L0,80 L0,45 L60,40 L0,35 Z" />
  </svg>
);

const SVG_MESSAGE = (
  <svg viewBox="0 0 100 80">
    <path d="M1,11 a10,10 0 0 1 10,-10 L89,1 a10,10 0 0 1 10,10 L99,55 a10,10 0 0 1 -10,10 L50,65 L38,79 L26,65 L11,65 a10,10 0 0 1 -10,-10 Z" />
  </svg>
);

const SVG_HR = (
  <svg viewBox="0 0 100 100">
    <path d="M0,50 L100,50 Z" />
  </svg>
);

const SVG_X = (
  <svg viewBox="0 0 100 100">
    <path d="M0,50 L100,50 Z" />
    <path d="M50,100 L50,0 Z" />
  </svg>
);

module.exports = {
  SVG_SEND,
  SVG_MESSAGE,
  SVG_HR,
  SVG_X
};
