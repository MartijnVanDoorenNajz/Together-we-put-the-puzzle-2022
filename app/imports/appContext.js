import { createContext } from "react";

const possibleColors = {
  blue: "linear-gradient(45deg, rgba(13, 39, 159, 1) 0%, rgba(25, 132, 195, 1) 35%, rgba(15, 176, 221, 1) 100%)",
  red: "linear-gradient(45deg, rgba(119,2,2,1) 0%, rgba(172,46,2,1) 35%, rgba(255,102,54,1) 100%)",
  green:
    "linear-gradient(45deg, rgba(13,159,43,1) 0%, rgba(25,195,43,1) 35%, rgba(98,195,25,1) 100%)",
  yellow:
    "linear-gradient(45deg, rgba(119,119,2,1) 0%, rgba(172,169,2,1) 35%, rgba(255,254,54,1) 100%)",
  lightblue:
    "linear-gradient(45deg, rgba(2,119,91,1) 0%, rgba(2,172,152,1) 35%, rgba(54,255,221,1) 100%)",
  purple:
    "linear-gradient(45deg, rgba(54,2,119,1) 0%, rgba(86,2,172,1) 35%, rgba(173,54,255,1) 100%)",
  pink: "linear-gradient(45deg, rgba(119,2,111,1) 0%, rgba(172,2,172,1) 35%, rgba(251,54,255,1) 100%)",
};

const possibleFontColors = {
  blue: "rgba(23,104,185,1)",
  red: "rgba(167,42,3,1)",
  green: "rgba(24,193,41,1)",
  yellow: "#b0a701",
  lightblue: "#018db0",
  purple: "#6c01b0",
  pink: "#b001b0",
};

const appContext = createContext({
  color: possibleColors.red,
  fontColor: possibleFontColors.red,
  setColor: () => {},
  setFontColor: () => {},
});

export { appContext, possibleColors, possibleFontColors };
