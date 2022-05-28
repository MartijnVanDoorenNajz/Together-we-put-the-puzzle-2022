import React from "react";

export const ParentQuestion = ({ question: question }) => {
  return (
    <>
      <div className="button-surface small">{question.question}</div>
    </>
  );
};
