import React, { useState } from "react";
import { Navigate } from "react-router";
import { ContentContainer } from "../recurring/ContentContainer";
import { useParams } from "react-router-dom";
import { BrusCollection } from "../../api/brus";
import { useTracker } from "meteor/react-meteor-data";
import { ParentCollection } from "../../api/parent";
import { Meteor } from "meteor/meteor";

export const BrusScreen = () => {
  const [redirect] = useState(false);
  const [chosenQuestion] = useState();
  const [ownQuestion, setOwnQuestion] = useState(" ");
  const params = useParams();
  const memberId = params.memberId;
  const userFilter = { _id: memberId };
  let currentBrus = useTracker(() =>
    BrusCollection.find(userFilter).fetch()
  )[0];
  let currentParent = useTracker(() =>
    ParentCollection.find(userFilter).fetch()
  )[0];

  const currentMember = currentBrus ? currentBrus : currentParent;

  // const parentQuestions = useTracker(() =>
  //   ParentQuestionCollection.find({}).fetch()
  // );

  const onQuestionAdd = () => {
    var current;
    currentMember.questions
      ? (current = [...currentMember.questions])
      : (current = []);

    current.push(ownQuestion);

    currentBrus
      ? BrusCollection.update(currentMember._id, {
          $set: {
            questions: current,
          },
        })
      : ParentCollection.update(currentMember._id, {
          $set: {
            questions: current,
          },
        });

    Meteor.call(
      "createLog",
      "action",
      "addQuestion",
      "family_memberscreen_" + memberId,
      "add_new_personal_question"
    );

    Meteor.call(
      "createLog",
      "action_db",
      "create",
      "family_memberscreen_" + memberId,
      "add_new_personal_question"
    );

    setOwnQuestion("");
  };

  const onQuestionDelete = (question) => {
    var current = [...currentMember.questions];

    const index = current.indexOf(question);
    if (index > -1) {
      current.splice(index, 1); // 2nd parameter means remove one item only
    }

    currentBrus
      ? BrusCollection.update(currentMember._id, {
          $set: {
            questions: current,
          },
        })
      : ParentCollection.update(currentMember._id, {
          $set: {
            questions: current,
          },
        });

    Meteor.call(
      "createLog",
      "action",
      "deleteQuestion",
      "family_memberscreen_" + memberId,
      "delete_personal_question"
    );

    Meteor.call(
      "createLog",
      "action_db",
      "delete",
      "family_memberscreen_" + memberId,
      "delete_personal_question"
    );
  };

  if (redirect) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "family_memberscreen_" + memberId,
      // @ts-ignore
      "to family_questionScreen_" + memberId + "_" + chosenQuestion._id
    );
    // @ts-ignore
    return <Navigate to={chosenQuestion._id} />;
  } else if (currentMember) {
    Meteor.call(
      "createLog",
      "render",
      "",
      "family_memberscreen_" + memberId,
      ""
    );
    return (
      <ContentContainer title={currentMember.firstName} arrow={true}>
        <div className="text-heading-standard">
          Met welke vragen zit jij rond 22q11? Stel ze binnenkort aan een arts,
          of ga er thuis een gesprek over aan.
        </div>
        <div style={{ height: "30px" }}></div>
        {/* {parentQuestions.map((question) => (
          <div
            key={question._id}
            onClick={() => {
              setChosenQuestion(question);
              setRedirect(true);
            }}
          >
            <ParentQuestion question={question} />
          </div>
        ))} */}
        <div style={{ display: "flex", marginTop: "10px" }}>
          <input
            style={{
              flexGrow: 1,
              border: "1px solid #eeeeee",
              fontSize: "20px",
            }}
            onChange={(e) => setOwnQuestion(e.target.value)}
            value={ownQuestion}
          />

          <div
            style={{
              backgroundColor: "green",
              padding: "10px",
              marginLeft: "10px",
              borderRadius: "5px",
              color: "white",
              fontFamily: "Arial",
              fontWeight: "800",
            }}
            onClick={() => onQuestionAdd()}
          >
            +
          </div>
        </div>

        {currentMember.questions
          ? currentMember.questions.map((question) => (
              <div
                key={question}
                style={{
                  display: "flex",
                  marginTop: "10px",
                  alignItems: "center",
                }}
              >
                <div
                  className="button-surface small"
                  style={{ flexGrow: 1, marginBottom: "0px" }}
                >
                  {question}
                </div>

                <div
                  style={{
                    backgroundColor: "red",
                    padding: "10px",
                    marginLeft: "10px",
                    borderRadius: "5px",
                    color: "white",
                    fontFamily: "Arial",
                    fontWeight: "800",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => onQuestionDelete(question)}
                >
                  x
                </div>
              </div>
            ))
          : ""}
      </ContentContainer>
    );
  } else {
    return "no member";
  }
};
