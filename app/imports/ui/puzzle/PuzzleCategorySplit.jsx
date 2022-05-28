import React from "react";
import { ContentContainer } from "../recurring/ContentContainer";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Navigate } from "react-router";
import { possibleColors } from "../../appContext";
import { Link } from "react-router-dom";
import { ChildCollection } from "../../api/child";
import { TextBalloon } from "../recurring/TextBalloon";

export const PuzzleCategorySplit = () => {
  const loggingIn = Meteor.loggingIn();
  const user = useTracker(() => Meteor.user());
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];

  if (user == null && !loggingIn) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_categorySplit",
      "to login"
    );
    return <Navigate to="/login" />;
  } else if (child) {
    Meteor.call("createLog", "render", "", "puzzle_categorySplit", "");
    return (
      <ContentContainer
        title="Puzzelstukken zoeken"
        arrow={true}
        previous={"/puzzle"}
      >
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
        <div style={{ height: "20px" }}></div>

        <TextBalloon words={"Welke puzzelstukken willen jullie bekijken?"} />

        <Link
          to="/puzzle/mental"
          onClick={() => {
            Meteor.call(
              "createLog",
              "navigate",
              "",
              "puzzle_categorySplit",
              "to puzzle_piecesOverview_mental"
            );
          }}
        >
          <div
            style={{
              marginTop: "40px",
              marginBottom: "20px",
              padding: "45px 10px",
              backgroundColor: "#d3e9f4",
            }}
            className="button-surface centered"
          >
            Hoofd
            <div
              style={{
                width: "100%",
                height: "100%",
                marginBottom: "0px",
                backgroundImage: "url(/images/mentaal_bg-01.png)",
                backgroundPosition: "center",
                bottom: 0,
                backgroundSize: "cover",
                position: "absolute",
                left: 10,
              }}
            ></div>
          </div>
        </Link>
        <Link
          to="/puzzle/physical"
          onClick={() => {
            Meteor.call(
              "createLog",
              "navigate",
              "",
              "puzzle_categorySplit",
              "to puzzle_piecesOverview_physical"
            );
          }}
        >
          <div
            style={{
              marginBottom: "20px",
              padding: "45px 10px",
              backgroundColor: "#f0f7e4",
            }}
            className="button-surface centered"
          >
            Lichaam
            <div
              style={{
                width: "100%",
                height: "100%",
                marginBottom: "0px",
                backgroundImage: "url(/images/physical_bg-02.png)",
                backgroundPosition: "center",
                bottom: 0,
                backgroundSize: "cover",
                position: "absolute",
                left: 10,
              }}
            ></div>
          </div>
        </Link>
      </ContentContainer>
    );
  } else {
    return "";
  }
};
