import React, { useState } from "react";
import { Navigate } from "react-router";
import { ContentContainer } from "../recurring/ContentContainer";
import { useParams } from "react-router-dom";
import { BrusCollection } from "../../api/brus";
import { useTracker } from "meteor/react-meteor-data";
import { ParentQuestionCollection } from "../../api/parentQuestions";
import { ParentCollection } from "../../api/parent";
import { Meteor } from "meteor/meteor";

export const QuestionDetailScreen = () => {
  const [redirect] = useState(false);
  const { memberId, questionId } = useParams();
  const userFilter = { _id: memberId };
  const questionFilter = { _id: questionId };
  let currentBrus = useTracker(() =>
    BrusCollection.find(userFilter).fetch()
  )[0];
  let currentParent = useTracker(() =>
    ParentCollection.find(userFilter).fetch()
  )[0];

  const currentMember = currentBrus ? currentBrus : currentParent;

  const currentQuestion = useTracker(() =>
    ParentQuestionCollection.find(questionFilter).fetch()
  )[0];

  if (redirect) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "family_questionScreen_" + memberId + "_" + questionId,
      "to family_memberscreen_" + memberId
    );
    return <Navigate to="family/parentbrus" />;
  } else {
    Meteor.call(
      "createLog",
      "render",
      "",
      "family_questionScreen_" + memberId + "_" + questionId,
      ""
    );
    return (
      <ContentContainer title={currentMember.firstName} arrow={true}>
        <div className="text-heading-standard">{currentQuestion.question}</div>
        <div style={{ height: "30px" }}></div>
        <div>{currentQuestion.answer}</div>
      </ContentContainer>
    );
  }
};
