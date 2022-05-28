import React, { useEffect, useRef, useState } from "react";
import { ContentContainer } from "../recurring/ContentContainer";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Navigate, useParams } from "react-router";
import { possibleColors } from "../../appContext";
import { ChildCollection } from "../../api/child";
import { TextBalloon } from "../recurring/TextBalloon";
import { PuzzlePieceCollection } from "../../api/puzzlePiece";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ContinuousSlider from "./ContinuousSlider";

export const AddPuzzlePiece = () => {
  const loggingIn = Meteor.loggingIn();
  const user = useTracker(() => Meteor.user());
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];
  const { pieceId } = useParams();
  const pieceFilter = { _id: pieceId };
  const currentPiece = useTracker(() =>
    PuzzlePieceCollection.find(pieceFilter).fetch()
  )[0];
  const [pieceAdded, setPieceAdded] = useState(false);
  const pieceRef = useRef(null);
  const [curScale, setCurScale] = useState(0.65);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  curScale < 0.3 ? setCurScale(0.3) : "";

  const onPuzzleSelect = () => {
    var currentChosenPieces;
    child.chosenPieces
      ? (currentChosenPieces = [...child.chosenPieces])
      : (currentChosenPieces = []);

    currentChosenPieces.push({ dbObject: currentPiece, scale: curScale });

    Meteor.call(
      "createLog",
      "action",
      "puzzleAddition",
      "puzzle_addPiece_" + pieceId,
      "child_pieces: add " + pieceId
    );

    Meteor.call(
      "createLog",
      "action_db",
      "update",
      "puzzle_addPiece_" + pieceId,
      "child_pieces: add " + pieceId
    );

    ChildCollection.update(child._id, {
      $set: {
        chosenPieces: currentChosenPieces,
      },
    });

    setPieceAdded(true);
  };

  if (user == null && !loggingIn) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_addPiece_" + pieceId,
      "to login"
    );
    return <Navigate to="/login" />;
  } else if (pieceAdded) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_addPiece_" + pieceId,
      "to puzzle_overview"
    );
    return <Navigate to="/puzzle" />;
  } else if (child && currentPiece) {
    Meteor.call("createLog", "render", "", "puzzle_addPiece_" + pieceId, "");
    return (
      <ContentContainer title="Puzzelstuk toevoegen" arrow={true}>
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
            child.firstName +
            ", kan je vertellen tegen de rest waarom je dit herkent? Maak het puzzelstuk hieronder groter als dit sterk bij jou past, en kleiner als het een beetje bij jou past."
          }
        />

        <div style={{ height: "30px" }}></div>
        <TransformWrapper
          limitToBounds={true}
          centerZoomedOut={true}
          panning={{ disabled: true }}
          // wheel={{ disabled: true }}
          minScale={0.3}
          maxScale={1}
          key={curScale}
          initialScale={curScale}
          onPinchingStop={(ref) => {
            Meteor.call(
              "createLog",
              "action",
              "puzzleSizeChangePinch",
              "puzzle_addPiece_" + pieceId,
              "to size " + ref.state.scale
            );
            curScale >= 0.3 ? setCurScale(ref.state.scale) : "";
          }}
          onWheelStop={(ref) => {
            Meteor.call(
              "createLog",
              "action",
              "puzzleSizeChangePinch",
              "puzzle_addPiece_" + pieceId,
              "to size " + ref.state.scale
            );
            curScale >= 0.3 ? setCurScale(ref.state.scale) : "";
          }}
        >
          <TransformComponent
            wrapperStyle={{
              width: "auto",
              height: "320px",
              border: "lightblue",
              borderRadius: "5px",
              backgroundColor: "#f2f7f7",
              padding: "10px 30px",
            }}
          >
            <img
              src={currentPiece.pathToImage}
              style={{ width: "100%" }}
              alt="puzzelstuk"
              ref={pieceRef}
            />
          </TransformComponent>
        </TransformWrapper>
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

        <ContinuousSlider
          pinchValue={((curScale - 0.3) / 0.7) * 100}
          setPuzzleValue={(value) => {
            if (value > 0.3) {
              setCurScale(value);
              Meteor.call(
                "createLog",
                "action",
                "puzzleSizeChangeSlider",
                "puzzle_editPiece_" + pieceId,
                "to size " + value
              );
            }
          }}
        />

        <div
          style={{ marginTop: "20px", marginBottom: "40px" }}
          className="button-surface centered"
          onClick={() => onPuzzleSelect()}
        >
          Toevoegen aan mijn puzzel
        </div>
      </ContentContainer>
    );
  } else {
    return "";
  }
};
