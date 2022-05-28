import React, { useState } from "react";
import { Navigate } from "react-router";
import { ContentContainer } from "../recurring/ContentContainer";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { ChildQuestionCollection } from "../../api/childQuestions";
import { Meteor } from "meteor/meteor";
import { ChildCollection } from "../../api/child";

export const ChildQuestionDetailScreen = () => {
  const [redirect] = useState(false);
  const { questionId } = useParams();
  const questionFilter = { _id: questionId };
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];

  const currentQuestion = useTracker(() =>
    ChildQuestionCollection.find(questionFilter).fetch()
  )[0];

  if (redirect) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "child_questionDetail_" + questionId,
      "to child_questionsScreen"
    );
    return <Navigate to="child/questions" />;
  } else {
    Meteor.call(
      "createLog",
      "render",
      "",
      "child_questionDetail_" + questionId,
      ""
    );
    return (
      <ContentContainer title={child.firstName} arrow={true}>
        <div className="text-heading-standard">{currentQuestion.question}</div>
        <div style={{ height: "30px" }}></div>
        <div>{currentQuestion.answer}</div>
        <div style={{ height: "30px" }}></div>
        {currentQuestion.videoId ? (
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
              src={`https://player.vimeo.com/video/${currentQuestion.videoId}?h=bdab936f1b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`}
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
          <></>
        )}
      </ContentContainer>
    );
  }
};
