import React from "react";
import { ContentContainer } from "../recurring/ContentContainer";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Navigate, useParams } from "react-router";
import { possibleFontColors } from "../../appContext";
import { PuzzlePieceCollection } from "../../api/puzzlePiece";
import { CustomPuzzlePieceCollection } from "../../api/customPieces";
import { ChildCollection } from "../../api/child";

export const InformationPuzzlePiece = () => {
  const loggingIn = Meteor.loggingIn();
  const user = useTracker(() => Meteor.user());
  const { pieceId } = useParams();
  const pieceFilter = { _id: pieceId };
  var currentPiece = useTracker(() =>
    PuzzlePieceCollection.find(pieceFilter).fetch()
  )[0];
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];

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

  if (!currentPiece)
    currentPiece = useTracker(() =>
      CustomPuzzlePieceCollection.find(pieceFilter).fetch()
    )[0];

  if (user == null && !loggingIn) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "puzzle_information_" + pieceId,
      "to login"
    );
    return <Navigate to="/login" />;
  } else if (currentPiece) {
    Meteor.call("createLog", "render", "", "puzzle_information_" + pieceId, "");
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

        {currentPiece.videoId ? (
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
        ) : (
          ""
        )}
      </ContentContainer>
    );
  } else {
    return "";
  }
};
