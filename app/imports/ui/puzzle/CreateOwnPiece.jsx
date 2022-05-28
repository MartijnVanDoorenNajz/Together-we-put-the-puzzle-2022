import React, { useState } from "react";
import { ContentContainer } from "../recurring/ContentContainer";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Navigate, useParams } from "react-router";
import { possibleColors, possibleFontColors } from "../../appContext";
import { ChildCollection } from "../../api/child";
import { TextBalloon } from "../recurring/TextBalloon";
import { CustomPuzzlePieceCollection } from "../../api/customPieces";

export const CreateOwnPiece = () => {
  const loggingIn = Meteor.loggingIn();
  const user = useTracker(() => Meteor.user());
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];
  const { category } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [pieceAdded, setPieceAdded] = useState(false);

  const onPuzzleSelect = () => {
    CustomPuzzlePieceCollection.insert(
      {
        title: title,
        pathToImage:
          category == "physical"
            ? "/images/Puzzlepieces/PuzzlePiece-28.png"
            : "/images/Puzzlepieces/PuzzlePiece-27.png",
        description: description,
        category,
      },
      (err, newPieceId) => {
        var currentChosenPieces;
        child.chosenPieces
          ? (currentChosenPieces = [...child.chosenPieces])
          : (currentChosenPieces = []);

        currentChosenPieces.push({
          dbObject: {
            _id: newPieceId,
            title: title,
            pathToImage:
              category == "physical"
                ? "/images/Puzzlepieces/PuzzlePiece-28.png"
                : "/images/Puzzlepieces/PuzzlePiece-27.png",
            description: description,
            category,
          },
          scale: 1,
        });

        ChildCollection.update(child._id, {
          $set: {
            chosenPieces: currentChosenPieces,
          },
        });

        setPieceAdded(true);

        Meteor.call(
          "createLog",
          "action",
          "createPuzzlePiece",
          "puzzle_createOwnPiece",
          "new_own_puzzlepiece"
        );

        Meteor.call(
          "createLog",
          "action_db",
          "create",
          "puzzle_createOwnPiece",
          "new_own_puzzlepiece"
        );
      }
    );
  };

  if (user == null && !loggingIn) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_createOwnPiece",
      "to login"
    );
    return <Navigate to="/login" />;
  } else if (pieceAdded) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_createOwnPiece",
      "to puzzle_overview"
    );
    return <Navigate to="/puzzle" />;
  } else {
    Meteor.call("createLog", "render", "", "puzzle_createOwnPiece", "");
    return (
      <ContentContainer title="Puzzelstuk maken" arrow={true}>
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
          words={child.firstName + ", maak zelf een eigen puzzelstuk! "}
        />

        <div style={{ height: "30px" }}></div>

        <h1 style={{ color: possibleFontColors[child.favoriteColor] }}>
          Titel
        </h1>
        <input
          style={{
            width: "90%",
            border: "1px solid #eeeeee",
            fontSize: "20px",
          }}
          onChange={(e) => setTitle(e.target.value)}
        />

        <h1 style={{ color: possibleFontColors[child.favoriteColor] }}>
          Beschrijving
        </h1>
        <input
          style={{
            width: "90%",
            border: "1px solid #eeeeee",
            fontSize: "20px",
          }}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* <div 
        style={{
          height: "152px",
          width: "152px",
          backgroundImage: `url(${currentPiece.pathToImage})`,
          backgroundPosition: "center",
          backgroundSize: "140px",
          backgroundRepeat: "no-repeat",
          marginBottom: "10px",
        }}
      /> */}

        {/* {curScale > 0.6 ? (
      <p>HEEL GROOT</p>
    ) : curScale > 0.3 ? (
      <p>MEDIUM</p>
    ) : (
      <p>SMALL</p>
    )} */}

        <div
          style={{ marginTop: "20px", marginBottom: "40px" }}
          className="button-surface centered"
          onClick={() => onPuzzleSelect()}
        >
          Opslaan
        </div>
      </ContentContainer>
    );
  }
};
