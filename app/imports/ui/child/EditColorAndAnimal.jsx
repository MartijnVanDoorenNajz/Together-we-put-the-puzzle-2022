// @ts-nocheck
import React, { useState } from "react";
// import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Navigate } from "react-router-dom";
import { ChildCollection } from "../../api/child";
import { possibleFontColors } from "../../appContext";
import { ContentContainer } from "../recurring/ContentContainer";
import { TextBalloon } from "../recurring/TextBalloon";
import { possibleColors } from "../../appContext";
import { useSwipeable } from "react-swipeable";

export const EditColorAndAnimal = () => {
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];
  const loggingIn = Meteor.loggingIn();
  const user = useTracker(() => Meteor.user());
  const [spriteIndex, setSpriteIndex] = useState(0);
  const [refres, setRefresh] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      Meteor.call(
        "createLog",
        "action",
        "spriteChangeSwipe",
        "onboarding_child_02",
        "to sprite " + spriteIndex
      );
      goSpriteHigher();
    },
    onSwipedRight: () => {
      Meteor.call(
        "createLog",
        "action",
        "spriteChangeSwipe",
        "onboarding_child_02",
        "to sprite " + spriteIndex
      );
      goSpriteLower();
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  const goSpriteLower = () => {
    if (spriteIndex == 0) setSpriteIndex(18);
    else setSpriteIndex(spriteIndex - 1);
  };

  const goSpriteHigher = () => {
    setSpriteIndex((spriteIndex + 1) % 19);
  };

  const onAnimalChange = (e) => {
    e.preventDefault();

    Meteor.call(
      "createLog",
      "action_db",
      "update",
      "child_editSettings",
      "child_spriteIndex: " + spriteIndex
    );

    // CREATE CHILD
    ChildCollection.update(
      child._id,
      {
        $set: {
          spriteIndex: spriteIndex,
        },
      },
      (err) => (err ? console.log(err) : setRefresh(refres + 1))
    );

    window.scrollTo(0, 0);
  };

  const onColorChange = (color) => {
    Meteor.call(
      "createLog",
      "action",
      "colorChange",
      "child_editSettings",
      "to color " + color
    );

    Meteor.call(
      "createLog",
      "action_db",
      "update",
      "child_editSettings",
      "child_color: " + color
    );

    // CREATE CHILD
    ChildCollection.update(
      child._id,
      {
        $set: {
          favoriteColor: color,
        },
      },
      (err) => (err ? console.log(err) : setRefresh(refres + 1))
    );
  };

  const generateColors = () => {
    return Object.entries(possibleColors).map(([k, v]) => (
      <div
        key={k}
        onClick={() => {
          onColorChange(k);
        }}
        style={{
          background: v,
          height: "80px",
          width: "80px",
          marginBottom: "20px",
          marginLeft: "5px",
          marginRight: "5px",
          minWidth: "20%",
        }}
      ></div>
    ));
  };

  if (user == null && !loggingIn) {
    Meteor.call("createLog", "navigate", "", "child_editSettings", "to login");
    return <Navigate to="/login" />;
  } else if (child) {
    Meteor.call("createLog", "render", "", "child_editSettings", "");
    return (
      <ContentContainer title={child.firstName} arrow={true}>
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

        <TextBalloon
          words={"Hier kan je een andere kleur kiezen, of mij veranderen!"}
        />
        <div style={{ height: "70px" }}></div>

        <div>
          <h1
            style={{
              color: possibleFontColors[child.favoriteColor],
              textAlign: "center",
            }}
          >
            {"Verander je kleur"}
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {generateColors()}
          </div>
        </div>

        <div className="onboarding-contentcenterflex">
          <h1 style={{ color: possibleFontColors[child.favoriteColor] }}>
            {"Verander je icoon"}
          </h1>

          <div style={{ height: "30px" }}></div>

          <div
            style={{
              width: "80%",
              marginBottom: "10px",
              height: "300px",
              backgroundImage: `url(/images/Avatars/Avatar-${(
                spriteIndex + 1
              ).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}.png)`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
            {...handlers}
          />

          <h4>{spriteIndex + 1 + "/" + "19"}</h4>

          <div style={{ display: "flex", direction: "row", width: "100%" }}>
            <div
              className="button-surface"
              style={{
                width: "50%",
                marginBottom: "10px",
                marginLeft: "5px",
                marginRight: "5px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                Meteor.call(
                  "createLog",
                  "action",
                  "spriteChangeButton",
                  "onboarding_child_02",
                  "to sprite " + spriteIndex
                );
                goSpriteLower();
              }}
            >
              {"<"}
            </div>
            <div
              className="button-surface"
              style={{
                width: "50%",
                marginBottom: "10px",
                marginLeft: "5px",
                marginRight: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50px",
              }}
              onClick={() => {
                Meteor.call(
                  "createLog",
                  "action",
                  "spriteChangeButton",
                  "onboarding_child_02",
                  "to sprite " + spriteIndex
                );
                goSpriteHigher();
              }}
            >
              {">"}
            </div>
          </div>

          <div style={{ height: "20px" }}></div>

          <div
            className="button-surface"
            style={{ width: "80%", marginBottom: "10px" }}
            onClick={(e) => onAnimalChange(e)}
          >
            Opslaan
          </div>
        </div>
      </ContentContainer>
    );
  } else return "";
};
