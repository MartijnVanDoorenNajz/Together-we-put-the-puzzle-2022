import React, { useEffect } from "react";
import { ContentContainer } from "../recurring/ContentContainer";
import { useParams } from "react-router";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { ChildCollection } from "../../api/child";
import { PuzzlePieceCollection } from "../../api/puzzlePiece";
import { Link } from "react-router-dom";
import { TextBalloon } from "../recurring/TextBalloon";
import { possibleColors } from "../../appContext";

export const PiecesOverview = () => {
  const { category } = useParams();
  const piecefilter = { category: category };
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];
  const puzzlePieces = useTracker(() =>
    PuzzlePieceCollection.find(piecefilter).fetch()
  );
  const chosenPieceTitles = child.chosenPieces
    ? child.chosenPieces.map((chosenPiece) => chosenPiece.dbObject.title)
    : [];

  useEffect(() => {
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 2);
  }, []);

  const generatePuzzlePieces = () => {
    return puzzlePieces.map((piece, index) => {
      if (!chosenPieceTitles.includes(piece.title)) {
        return (
          <Link
            to={"/puzzle/piece/" + piece._id}
            key={index}
            onClick={() =>
              Meteor.call(
                "createLog",
                "navigate",
                "",
                "puzzle_piecesOverview_" + category,
                "to puzzle_pieceDetail_" + piece._id
              )
            }
          >
            <div
              style={{
                minHeight: "200px",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "200px",
                  width: "180px",
                  backgroundImage: `url(${piece.pathToImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  zIndex: "300",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
              <div className={"puzzlePiece-holder"}>{piece.title}</div>
            </div>
          </Link>
        );
      }
    });
  };

  const getTitle = () => {
    if (category == "mental") {
      return "Denken";
    } else {
      return "Mijn lichaam";
    }
  };

  if (!child) {
    return "";
  } else {
    Meteor.call(
      "createLog",
      "render",
      "",
      "puzzle_piecesOverview_" + category,
      ""
    );
    return (
      <ContentContainer
        title={getTitle()}
        arrow={true}
        previous={"/puzzleCategorySplit"}
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

        <TextBalloon
          words={
            "Kies een puzzelstuk uit de lijst hieronder om te bekijken, of maak zelf een puzzelstuk!"
          }
        />

        <div style={{ height: "25px" }}></div>

        {generatePuzzlePieces()}
        <div style={{ height: "20px" }}></div>
        <Link
          to={"/createPiece/" + category}
          onClick={() =>
            Meteor.call(
              "createLog",
              "navigate",
              "",
              "puzzle_piecesOverview_" + category,
              "to puzzle_createPiece"
            )
          }
        >
          <div
            style={{ marginBottom: "20px" }}
            className="button-surface centered"
          >
            Een eigen puzzelstuk maken
          </div>
        </Link>
        {/* <Link to="/puzzleCategoryMental">
      <div
        style={{ marginBottom: "40px" }}
        className="button-surface centered"
      >
        Mental category = {category}
      </div>
    </Link>
    <Link to="/puzzleCategoryPhysical">
      <div
        style={{ marginBottom: "40px" }}
        className="button-surface centered"
      >
        Physical category
      </div>
    </Link> */}
      </ContentContainer>
    );
  }
};
