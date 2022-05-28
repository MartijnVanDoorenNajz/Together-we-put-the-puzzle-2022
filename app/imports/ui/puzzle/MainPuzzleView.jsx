import React, { useEffect, useState } from "react";
import { ContentContainer } from "../recurring/ContentContainer";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Link, Navigate } from "react-router-dom";
import { ChildCollection } from "../../api/child";
import { possibleColors, possibleFontColors } from "../../appContext";
import { TextBalloon } from "../recurring/TextBalloon";

export const MainPuzzleView = () => {
  // const user = useTracker(() => Meteor.user());
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];
  const [editPiece, setEditPiece] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const chosenPieces = child.chosenPieces;

  const generatePuzzlePieces = () => {
    return chosenPieces && chosenPieces.length > 0 ? (
      chosenPieces.map((piece, index) => {
        const curHeight = (350 * piece.scale).toString() + "px";
        const curWidth = (350 * piece.scale).toString() + "px";

        return (
          <div
            key={index}
            style={{
              width: "auto",
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#f7f7f7",
              marginBottom: "25px",
              borderRadius: "10px",
              padding: "10px",
              paddingBottom: "30px",
              position: "relative",
            }}
            onClick={() => {
              setEditPiece(chosenPieces.indexOf(piece));
            }}
          >
            <div
              style={{
                height: curHeight,
                width: curWidth,
                backgroundImage: `url(${piece.dbObject.pathToImage})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                marginBottom: "10px",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-15px",
                backgroundColor: "white",
                padding: "3px 15px",
                borderRadius: "5px",
                fontSize: "28px",
                fontFamily: "Cardenio",
                fontWeight: "bold",
                color: possibleFontColors[child.favoriteColor],
                border: "3px solid #f7f7f7",
              }}
            >
              {piece.dbObject.title}
            </div>
          </div>
        );
      })
    ) : (
      <>
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

        <TextBalloon
          words={
            "Je puzzel is leeg. Zoek je eerste puzzelstuk door op de knop hierboven te duwen."
          }
        />
      </>
    );
  };

  if (editPiece != null) {
    Meteor.call(
      "createLog",
      "render",
      "",
      "puzzle_overview",
      "to puzzle_pieceActions_" + chosenPieces[editPiece]._id
    );
    return <Navigate to={"editPiece/" + editPiece} />;
  } else if (child) {
    Meteor.call("createLog", "render", "", "puzzle_overview", "");
    return (
      <ContentContainer title="Jouw Puzzel" arrow={false}>
        <Link
          to="/puzzleCategorySplit"
          onClick={() =>
            Meteor.call(
              "createLog",
              "navigate",
              "",
              "puzzle_overview",
              "to puzzle_categorySplit"
            )
          }
        >
          <div
            style={{ marginBottom: "40px" }}
            className="button-surface centered"
          >
            + Meer puzzelstoeken zoeken
          </div>
        </Link>
        {generatePuzzlePieces()}
      </ContentContainer>
    );
  } else {
    return "";
  }
};
