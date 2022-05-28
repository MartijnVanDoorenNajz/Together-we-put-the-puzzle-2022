// @ts-nocheck
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { ChildCollection } from "../../api/child";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { possibleColors, possibleFontColors } from "../../appContext";

export const OnboardingChild2 = () => {
  const [redirect, setRedirect] = useState(false);
  const [color, setColor] = useState("blue");

  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.findOne(userFilter));

  const onSubmit = (e) => {
    e.preventDefault();
    Meteor.call(
      "createLog",
      "action_db",
      "update",
      "onboarding_child_03",
      "child_color: " + color
    );
    // CREATE CHILD
    ChildCollection.update(
      child._id,
      {
        $set: {
          favoriteColor: color,
        },
      },
      (err) => (err ? console.log(err) : setRedirect(true))
    );
  };

  const generateColors = () => {
    return Object.entries(possibleColors).map(([k, v]) => (
      <div
        key={k}
        onClick={() => {
          setColor(k);
          Meteor.call(
            "createLog",
            "action",
            "colorChange",
            "onboarding_child_03",
            "to color " + k
          );
        }}
        style={{
          background: v,
          height: color == k ? "100px" : "80px",
          width: color == k ? "100px" : "80px",
          marginBottom: "20px",
          marginLeft: "5px",
          marginRight: "5px",
          minWidth: "20%",
        }}
      ></div>
    ));
  };

  if (redirect) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "onboarding_child_03",
      "to onboarding_brussen"
    );
    return <Navigate to="/onboardingBrussen" />;
  } else {
    Meteor.call("createLog", "render", "", "onboarding_child_03", "");
    return (
      <div className="onboarding-contentcenterflex">
        <h1 style={{ color: possibleFontColors[color] }}>
          {child.firstName + ", kies een kleur"}
        </h1>

        <div style={{ height: "20px" }}></div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {generateColors()}
        </div>

        <div style={{ height: "30px" }}></div>
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
