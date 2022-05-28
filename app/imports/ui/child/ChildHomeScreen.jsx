// @ts-nocheck
import React from "react";
// import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Navigate } from "react-router-dom";
import { ChildCollection } from "../../api/child";
import { possibleColors } from "../../appContext";
import { ContentContainer } from "../recurring/ContentContainer";
import { TextBalloon } from "../recurring/TextBalloon";
import { Link } from "react-router-dom";

export const ChildHomescreen = () => {
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];
  const loggingIn = Meteor.loggingIn();
  const user = useTracker(() => Meteor.user());

  if (user == null && !loggingIn) {
    Meteor.call("createLog", "navigate", "", "child_home", "to login");
    return <Navigate to="/login" />;
  } else if (child) {
    Meteor.call("createLog", "render", "", "child_home", "");
    return (
      <ContentContainer title={child.firstName} arrow={false}>
        <div style={{ height: "10px" }}></div>

        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              height: "140px",
              width: "140px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "150px",
              background: possibleColors[child.favoriteColor],
            }}
          >
            <div
              style={{
                height: "152px",
                width: "152px",
                borderRadius: "120px",
                backgroundImage: `url(/images/Avatars/Avatar-${(
                  child.spriteIndex + 1
                ).toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}.png)`,
                backgroundPosition: "center",
                backgroundSize: "140px",
                backgroundRepeat: "no-repeat",
                marginBottom: "-30px",
              }}
            />
          </div>
        </div>
        <div style={{ height: "30px" }}></div>

        <TextBalloon words={"Wat wil je doen?"} />
        <div style={{ height: "70px" }}></div>
        <Link
          to="questions"
          onClick={() =>
            Meteor.call(
              "createLog",
              "navigate",
              "",
              "child_home",
              "to child_questionScreen"
            )
          }
        >
          <div className="button-surface small">Meer weten over 22q11</div>
        </Link>
        <Link
          to="ditbenik"
          onClick={() =>
            Meteor.call(
              "createLog",
              "navigate",
              "",
              "child_home",
              "to child_ditbenik"
            )
          }
        >
          <div className="button-surface small">Dit ben ik</div>
        </Link>
        <Link
          to="editChild"
          onClick={() =>
            Meteor.call(
              "createLog",
              "navigate",
              "",
              "child_home",
              "to child_editSettings"
            )
          }
        >
          <div className="button-surface small">Kleur en dier aanpassen </div>
        </Link>
      </ContentContainer>
    );
  } else {
    return "";
  }
};
