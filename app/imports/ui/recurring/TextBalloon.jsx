import React from "react";
import { possibleFontColors } from "../../appContext";
import { useTracker } from "meteor/react-meteor-data";
import { ChildCollection } from "../../api/child";
import { Meteor } from "meteor/meteor";

export const TextBalloon = ({ words }) => {
  const [placeholder, setPlaceholder] = React.useState(" ");
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];

  const string = words,
    index = React.useRef(0);

  React.useEffect(() => {
    function tick() {
      setPlaceholder((prev) => prev + string[index.current]);
      index.current++;
    }
    if (index.current < string.length) {
      let addChar = setInterval(tick, 50);
      return () => clearInterval(addChar);
    }
  }, [placeholder]);

  return (
    <div
      style={{
        border: "2px solid " + possibleFontColors[child.favoriteColor],
        padding: "10px 20px",
        position: "relative",
        borderRadius: "10px",
        textAlign: "center",
        color: "#444444",
        fontStyle: "italic",
      }}
    >
      <div
        style={{
          position: "absolute",
          height: "0px",
          width: "0px",
          left: "50%",
          top: "-20px",
          borderLeft: "10px solid transparent",
          borderTop: "10px solid transparent",
          borderBottom: "10px solid " + possibleFontColors[child.favoriteColor],
          borderRight: "10px solid transparent",
        }}
      ></div>
      {placeholder}
    </div>
  );
};
