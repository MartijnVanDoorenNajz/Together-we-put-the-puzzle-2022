// @ts-nocheck
import React from "react";
// import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import "./app.import.less";
import "./main.less";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Navigate } from "react-router-dom";
import { ChildCollection } from "../api/child";
import { possibleColors, possibleFontColors } from "../appContext";

export const App = () => {
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];
  const loggingIn = Meteor.loggingIn();
  const user = useTracker(() => Meteor.user());

  if ((user == null) & !loggingIn) {
    Meteor.call("createLog", "navigate", "", "home", "to login");
    return <Navigate to="/login" />;
  } else if (child) {
    Meteor.call("createLog", "render", "", "home", "");
    return (
      <>
        <div
          className="homeBackground"
          style={{ background: possibleColors[child.favoriteColor] }}
        ></div>
        <div className="flex-center-vertical" style={{ padding: "20px" }}>
          <Link
            to="/child"
            onClick={() => {
              Meteor.call("createLog", "navigate", "", "home", "to child_home");
            }}
          >
            <div
              className="button-surface centered"
              style={{ color: possibleFontColors[child.favoriteColor] }}
            >
              {"voor mij, " + (child ? child.firstName : "")}
            </div>
          </Link>

          <div style={{ height: "20px" }}></div>

          <Link
            to="/puzzle"
            onClick={() =>
              Meteor.call(
                "createLog",
                "navigate",
                "",
                "home",
                "to puzzle_overview"
              )
            }
          >
            <div
              className="button-surface centered"
              style={{
                color: possibleFontColors[child.favoriteColor],
                minHeight: "250px",
              }}
            >
              <div style={{ zIndex: 100, marginBottom: "35px" }}>
                Samen de puzzel leggen
              </div>
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  marginBottom: "-50px",
                  backgroundImage: "url(/images/puzzle.png)",
                  bottom: 0,
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
          </Link>

          <div style={{ height: "20px" }}></div>

          <Link
            to="/family"
            onClick={() =>
              Meteor.call("createLog", "navigate", "", "home", "to family_home")
            }
          >
            <div
              className="button-surface centered"
              style={{ color: possibleFontColors[child.favoriteColor] }}
            >
              Voor ouders en brussen
            </div>
          </Link>
        </div>
      </>
    );
  } else {
    return "";
  }
};
