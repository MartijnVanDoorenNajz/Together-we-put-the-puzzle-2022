import React, { useState } from "react";
import { Navigate } from "react-router";
import { ContentContainer } from "../recurring/ContentContainer";
import { useTracker } from "meteor/react-meteor-data";
import { ParentQuestion } from "../ParentQuestion";
import { ChildQuestionCollection } from "../../api/childQuestions";
import { Meteor } from "meteor/meteor";
import { ChildCollection } from "../../api/child";

export const ChildQuestionsScreens = () => {
  const [redirect, setRedirect] = useState(false);
  const [chosenQuestion, setChosenQuestion] = useState();
  const [ownQuestion, setOwnQuestion] = useState(" ");

  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];

  const childQuestions = useTracker(() =>
    ChildQuestionCollection.find({}).fetch()
  );

  const onQuestionAdd = () => {
    var current;
    child.questions ? (current = [...child.questions]) : (current = []);

    current.push(ownQuestion);

    ChildCollection.update(child._id, {
      $set: {
        questions: current,
      },
    });

    Meteor.call(
      "createLog",
      "action",
      "addQuestion",
      "child_questionsScreen",
      "add_new_personal_question"
    );

    Meteor.call(
      "createLog",
      "action_db",
      "create",
      "child_questionsScreen",
      "add_new_personal_question"
    );

    setOwnQuestion("");
  };

  const onQuestionDelete = (question) => {
    var current = [...child.questions];

    const index = current.indexOf(question);
    if (index > -1) {
      current.splice(index, 1); // 2nd parameter means remove one item only
    }

    ChildCollection.update(child._id, {
      $set: {
        questions: current,
      },
    });

    Meteor.call(
      "createLog",
      "action",
      "deleteQuestion",
      "child_questionsScreen",
      "delete_personal_question"
    );

    Meteor.call(
      "createLog",
      "action_db",
      "delete",
      "child_questionsScreen",
      "delete_personal_question"
    );
  };

  if (redirect) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "child_questionsScreen",
      // @ts-ignore
      "to child_questionDetail_" + chosenQuestion._id
    );
    // @ts-ignore
    return <Navigate to={chosenQuestion._id} />;
  } else {
    Meteor.call("createLog", "render", "", "child_questionScreen", "");
    return (
      <ContentContainer title={child.firstName} arrow={true}>
        <div className="text-heading-standard">
          Waarover wil je meer weten?{" "}
        </div>
        <div style={{ height: "30px" }}></div>
        {childQuestions.map((question) => (
          <div
            key={question._id}
            onClick={() => {
              setChosenQuestion(question);
              setRedirect(true);
            }}
          >
            <ParentQuestion question={question} />
          </div>
        ))}

        <div style={{ height: "40px" }}></div>

        <div className="text-heading-standard">
          Heb je zelf nog vragen voor mama, papa of de dokter?
        </div>

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

        {child.questions
          ? child.questions.map((question) => (
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
  }
};
