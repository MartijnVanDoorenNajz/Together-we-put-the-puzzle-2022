import React, { useEffect, useState } from "react";
import { ContentContainer } from "../recurring/ContentContainer";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Navigate, useParams } from "react-router";
import { possibleColors, possibleFontColors } from "../../appContext";
import { Link } from "react-router-dom";
import { ChildCollection } from "../../api/child";
import { TextBalloon } from "../recurring/TextBalloon";
import { PuzzlePieceCollection } from "../../api/puzzlePiece";

export const PieceView = () => {
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

  // main document must be focused in order for window blur to fire when the iframe is interacted with.
  // There's still an issue that if user interacts outside of the page and then click iframe first without clicking page, the following logic won't run. But since the OP is only concerned about first click this shouldn't be a problem.
  window.focus();

  window.addEventListener("blur", () => {
    setTimeout(() => {
      if (document.activeElement.tagName === "IFRAME") {
        Meteor.call(
          "createLog",
          "action",
          "videoPlay_" + pieceId,
          "puzzle_pieceDetail_" + pieceId,
          ""
        );
      }
    });
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onPuzzleSelect = () => {
    // var currentChosenPieces;
    // child.chosenPieces
    //   ? (currentChosenPieces = [...child.chosenPieces])
    //   : (currentChosenPieces = []);

    // currentChosenPieces.push({ dbObject: currentPiece, size: 0.5 });

    // ChildCollection.update(child._id, {
    //   $set: {
    //     chosenPieces: currentChosenPieces,
    //   },
    // });

    setPieceAdded(true);
  };

  if (user == null && !loggingIn) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_pieceDetail_" + pieceId,
      "to login"
    );
    return <Navigate to="/login" />;
  } else if (pieceAdded) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_pieceDetail_" + pieceId,
      "to puzzle_addPiece_" + pieceId
    );
    return <Navigate to={"/addPiece/" + currentPiece._id} />;
  } else {
    Meteor.call("createLog", "render", "", "puzzle_pieceDetail_" + pieceId, "");
    return (
      <ContentContainer title="Puzzelstukken zoeken" arrow={true}>
        <div
          style={{
            height: "125px",
            width: "125px",
            backgroundImage: `url(${currentPiece.pathToImage})`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            marginBottom: "10px",
            position: "absolute",
            top: -40,
            right: 0,
          }}
        />

        <div style={{ height: "30px" }}></div>

        <h1 style={{ color: possibleFontColors[child.favoriteColor] }}>
          {currentPiece.title}
        </h1>

        <p>{currentPiece.description} </p>

        <div
          className="video-responsive"
          style={{
            marginTop: "30px",
            position: "relative",
          }}
        >
          <iframe
            width="100%"
            height="210"
            // src="https://www.youtube.com/embed/jSihaa9619k?rel=0&amp;controls=0"
            src={`https://player.vimeo.com/video/${currentPiece.videoId}?h=bdab936f1b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
            style={{
              backgroundColor: "lightgrey",
              backgroundImage: "url(/images/thumbnail.png)",
              backgroundSize: "cover",
            }}
          />
        </div>

        <div style={{ height: "50px" }}></div>
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

        <TextBalloon words={child.firstName + ", herken jij dit?"} />

        <div
          style={{ marginTop: "40px", marginBottom: "20px" }}
          className="button-surface centered"
          onClick={() => {
            Meteor.call(
              "createLog",
              "action",
              "pieceSelect",
              "puzzle_pieceDetail_" + pieceId,
              ""
            );
            onPuzzleSelect();
          }}
        >
          Ja, dit herken ik
        </div>
        <Link
          to={"/puzzle/" + currentPiece.category}
          onClick={() => {
            Meteor.call(
              "createLog",
              "action",
              "pieceReject",
              "puzzle_pieceDetail_" + pieceId,
              ""
            );
            Meteor.call(
              "createLog",
              "navigate",
              "",
              "puzzle_pieceDetail_" + pieceId,
              "to puzzle_categorySplit_" + currentPiece.category
            );
          }}
        >
          <div
            style={{ marginBottom: "40px" }}
            className="button-surface centered"
          >
            Nee, dit herken ik niet
          </div>
        </Link>
      </ContentContainer>
    );
  }
};
