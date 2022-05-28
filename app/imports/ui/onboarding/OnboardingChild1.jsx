// @ts-nocheck
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { ChildCollection } from "../../api/child";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useSwipeable } from "react-swipeable";

export const OnboardingChild1 = () => {
  const [redirect, setRedirect] = useState(false);
  const [spriteIndex, setSpriteIndex] = useState(0);

  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.findOne(userFilter));

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      Meteor.call(
        "createLog",
        "action",
        "spriteChangeSwipe",
        "onboarding_child_02",
        "to sprite " + spriteIndex
      );
      goSpriteHigher();
    },
    onSwipedRight: () => {
      Meteor.call(
        "createLog",
        "action",
        "spriteChangeSwipe",
        "onboarding_child_02",
        "to sprite " + spriteIndex
      );
      goSpriteLower();
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  const goSpriteLower = () => {
    if (spriteIndex == 0) setSpriteIndex(18);
    else setSpriteIndex(spriteIndex - 1);
  };

  const goSpriteHigher = () => {
    setSpriteIndex((spriteIndex + 1) % 19);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    Meteor.call(
      "createLog",
      "action_db",
      "update",
      "onboarding_child_02",
      "child_spriteIndex: " + spriteIndex
    );
    // CREATE CHILD
    ChildCollection.update(
      child._id,
      {
        $set: {
          spriteIndex: spriteIndex,
        },
      },
      (err) => (err ? console.log(err) : setRedirect(true))
    );
  };

  if (redirect) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "onboarding_child_02",
      "to onboarding_child_03"
    );
    return <Navigate to="/onboardingChild2" />;
  } else {
    Meteor.call("createLog", "render", "", "onboarding_child_02", "");
    return (
      <div className="onboarding-contentcenterflex">
        <h1>{"Hoi " + child.firstName + ", kies een icoon"}</h1>

        <div style={{ height: "30px" }}></div>

        <div
          style={{
            width: "80%",
            marginBottom: "10px",
            height: "300px",
            backgroundImage: `url(/images/Avatars/Avatar-${(
              spriteIndex + 1
            ).toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}.png)`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundColor: "white",
            borderRadius: "10px",
          }}
          {...handlers}
        />

        <h4>{spriteIndex + 1 + "/" + "19"}</h4>

        <div style={{ display: "flex", direction: "row", width: "100%" }}>
          <div
            className="button-standard"
            style={{
              width: "50%",
              marginBottom: "10px",
              marginLeft: "5px",
              marginRight: "5px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              if (spriteIndex == 0) setSpriteIndex(18);
              else setSpriteIndex(spriteIndex - 1);
              Meteor.call(
                "createLog",
                "action",
                "spriteChangeButton",
                "onboarding_child_02",
                "to sprite " + spriteIndex
              );
            }}
          >
            {"<"}
          </div>
          <div
            className="button-standard"
            style={{
              width: "50%",
              marginBottom: "10px",
              marginLeft: "5px",
              marginRight: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
            }}
            onClick={() => {
              setSpriteIndex((spriteIndex + 1) % 19);
              Meteor.call(
                "createLog",
                "action",
                "spriteChangeButton",
                "onboarding_child_02",
                "to sprite " + spriteIndex
              );
            }}
          >
            {">"}
          </div>
        </div>

        <div style={{ height: "20px" }}></div>

        <div
          className="button-standard"
          style={{ width: "80%", marginBottom: "10px" }}
          onClick={(e) => onSubmit(e)}
        >
          Opslaan
        </div>
      </div>
    );
  }
};
