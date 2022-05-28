import React, { useState } from "react";
import { ContentContainer } from "../recurring/ContentContainer";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { ChildCollection } from "../../api/child";
import { TextBalloon } from "../recurring/TextBalloon";
import { possibleColors, possibleFontColors } from "../../appContext";
import { AiFillStar } from "react-icons/ai";

export const DitBenIk = () => {
  const [redirect] = useState(false);

  //   useEffect(() => {
  //     ChildCollection.update(child._id, {
  //       $set: {
  //         categories: {},
  //       },
  //     });
  //   });

  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];

  const onCategoryClick = (category, score) => {
    var current;
    child.categories ? (current = { ...child.categories }) : (current = {});

    current[category] = score;

    ChildCollection.update(child._id, {
      $set: {
        categories: current,
      },
    });

    Meteor.call(
      "createLog",
      "action",
      "editStars",
      "child_ditbenik",
      "update_category + " + category + " to " + score
    );

    Meteor.call(
      "createLog",
      "action_db",
      "update",
      "child_ditbenik",
      "child:categories update categorie " + category + " to " + score
    );
  };

  const renderCategories = () => {
    const categoryList = [
      "Ik ben zelfstandig",
      "Ik ben goed in taal",
      "Ik houd van natuur & dieren",
      "Ik kan goed tekenen",
      "Ik zorg graag voor anderen",
      "Ik ben graag samen",
      "Ik ben lief",
      "Ik kan goed helpen",
      "Ik praat graag",
      "Ik sport graag",
    ];

    return categoryList.map((category, index) => (
      <div key={index}>
        <h4
          style={{
            backgroundColor: "whitesmoke",
            padding: "10px",
            borderRadius: "15px",
            marginBottom: "3px",
          }}
        >
          {category}
        </h4>
        {generateStars(category)}
      </div>
    ));
  };

  const generateStars = (category) => {
    var score = 0;
    if (child.categories && child.categories[category]) {
      score = child.categories[category];
    }
    const array5 = [1, 2, 3, 4, 5];
    return array5.map((i) => {
      if (i <= score) {
        return (
          <AiFillStar
            key={i}
            color={possibleFontColors[child.favoriteColor]}
            size={50}
            onClick={() => onCategoryClick(category, i)}
          />
        );
      } else {
        return (
          <AiFillStar
            key={i}
            color={"lightgrey"}
            size={50}
            onClick={() => onCategoryClick(category, i)}
          />
        );
      }
    });
  };

  if (redirect) {
    // Meteor.call("createLog",
    //   "navigate",
    //   "",
    //   "child_questionsScreen",
    //   // @ts-ignore
    //   "to child_questionDetail_" + chosenQuestion._id
    // );
    // // @ts-ignore
    // return <Navigate to={chosenQuestion._id} />;
  } else {
    Meteor.call("createLog", "render", "", "child_ditbenik", "");
    return (
      <ContentContainer title={"Dit ben ik"} arrow={true}>
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
          words={"Vertel me wat je goed kan door jezelf sterren te geven"}
        />

        <div style={{ height: "30px" }}></div>

        {renderCategories()}
      </ContentContainer>
    );
  }
};
