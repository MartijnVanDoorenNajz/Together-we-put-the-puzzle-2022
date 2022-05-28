import React from "react";
import { Slider } from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {},
});

const CustomSlider = withStyles({
  rail: {
    backgroundImage: "linear-gradient(.25turn, #b2e0ab, #1a9107)",
  },
  track: {
    backgroundImage: "linear-gradient(.25turn, #1a9107, #1a9107)",
  },
})(Slider);

export default function ContinuousSlider({ pinchValue, setPuzzleValue }) {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    newValue < 0 ? (newValue = 0) : "";
    newValue != pinchValue ? setPuzzleValue(0.3 + 0.7 * newValue * 0.01) : "";
  };

  return (
    <div className={classes.root}>
      <CustomSlider
        value={pinchValue}
        onChange={handleChange}
        aria-labelledby="continuous-slider"
        step={1}
      />
    </div>
  );
}
