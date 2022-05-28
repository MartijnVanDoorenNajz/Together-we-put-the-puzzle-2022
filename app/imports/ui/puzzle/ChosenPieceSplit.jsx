import React, { useState } from "react";
import { ContentContainer } from "../recurring/ContentContainer";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Navigate, useParams } from "react-router";
import { possibleColors } from "../../appContext";
import { ChildCollection } from "../../api/child";
import { TextBalloon } from "../recurring/TextBalloon";
import { PuzzlePieceCollection } from "../../api/puzzlePiece";
import { ImBin } from "react-icons/im";

export const ChosenPieceSplit = () => {
  const loggingIn = Meteor.loggingIn();
  const [pieceDeleted, setPieceDeleted] = useState(false);
  const [pieceEdited, setPieceEdited] = useState(false);
  const [pieceInformation, setPieceInformation] = useState(false);
  const user = useTracker(() => Meteor.user());
  const userFilter = { familyId: Meteor.userId() };
  const child = ChildCollection.find(userFilter).fetch()[0];
  var { chosenPieceIndex } = useParams();
  const chosenPieceIndexNumber = Number(chosenPieceIndex);
  const chosenPiece = child.chosenPieces[chosenPieceIndexNumber];
  const pieceId = chosenPiece ? chosenPiece.dbObject._id : "3";
  const pieceFilter = { _id: pieceId };
  const originalPiece = useTracker(() =>
    PuzzlePieceCollection.find(pieceFilter).fetch()
  )[0];
  const currentPiece = { ...originalPiece };

  const deletePiece = () => {
    var currentChosenPieces = [...child.chosenPieces];

    const index = currentChosenPieces.indexOf(chosenPiece);
    if (index > -1) {
      currentChosenPieces.splice(index, 1); // 2nd parameter means remove one item only
    }

    Meteor.call(
      "createLog",
      "action_db",
      "remove",
      "puzzle_pieceActions_" + pieceId,
      "child_pieces: " + pieceId
    );

    ChildCollection.update(child._id, {
      $set: {
        chosenPieces: currentChosenPieces,
      },
    });

    setPieceDeleted(true);
  };

  if (user == null && !loggingIn) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_pieceActions_" + pieceId,
      "to login"
    );
    return <Navigate to="/login" />;
  } else if (pieceDeleted) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_pieceActions_" + pieceId,
      "to puzzle_overview"
    );
    return <Navigate to="/puzzle" />;
  } else if (pieceEdited) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_pieceActions_" + pieceId,
      "to puzzle_edit_" + pieceId
    );
    return <Navigate to={"/editPiece/edit/" + chosenPieceIndex} />;
  } else if (pieceInformation) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_pieceActions_" + pieceId,
      "to puzzle_information_" + pieceId
    );
    return <Navigate to={"/editPiece/information/" + pieceId} />;
  } else if (currentPiece) {
    Meteor.call(
      "createLog",
      "render",
      "",
      "puzzle_pieceActions_" + pieceId,
      ""
    );
    return (
      <ContentContainer
        title="Puzzelstuk veranderen"
        arrow={true}
        previous="/puzzle"
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
          words={child.firstName + ", wat wil je doen met dit puzzelstuk?"}
        />

        <div style={{ height: "30px" }}></div>

        <div
          style={{ marginTop: "20px", marginBottom: "40px" }}
          className="button-surface centered"
          onClick={() => {
            Meteor.call(
              "createLog",
              "action",
              "viewInformation",
              "puzzle_pieceActions_" + pieceId,
              pieceId
            );
            setPieceInformation(true);
          }}
        >
          Informatie bekijken
        </div>
        <div
          style={{ marginTop: "20px", marginBottom: "40px" }}
          className="button-surface centered"
          onClick={() => {
            Meteor.call(
              "createLog",
              "action",
              "editPiece",
              "puzzle_pieceActions_" + pieceId,
              pieceId
            );
            setPieceEdited(true);
          }}
        >
          Grootte aanpassen
        </div>
        <div
          style={{
            marginTop: "20px",
            marginBottom: "40px",
            backgroundColor: "#9e0101",
            color: "white",
            display: "flex",
            flexDirection: "row",
          }}
          className="button-surface centered"
          onClick={() => {
            Meteor.call(
              "createLog",
              "action",
              "removePiece",
              "puzzle_pieceActions_" + pieceId,
              pieceId
            );
            deletePiece();
          }}
        >
          <ImBin color="white" />{" "}
          <div style={{ marginLeft: "10px" }}>Verwijderen</div>
        </div>
      </ContentContainer>
    );
  } else {
    return "";
  }
};
