/* eslint-disable no-unused-vars */
import { Meteor } from "meteor/meteor";
import { ParentQuestionCollection } from "../imports/api/parentQuestions";
import "../imports/LogMethod";

//Imports to make sure collections work server side as well
import { ChildCollection } from "../imports/api/child";
import { BrusCollection } from "../imports/api/brus";
import { ParentCollection } from "../imports/api/parent";
import { PuzzlePieceCollection } from "../imports/api/puzzlePiece";
import { CustomPuzzlePieceCollection } from "../imports/api/customPieces";
import { LogCollection } from "../imports/api/log";
import { ChildQuestionCollection } from "../imports/api/childQuestions";

const insertQuestion = (questionText, questionAnswer) =>
  ParentQuestionCollection.insert({
    question: questionText,
    answer: questionAnswer,
  });

const insertChildquestion = (questionText, questionAnswer, videoId) =>
  ChildQuestionCollection.insert({
    question: questionText,
    answer: questionAnswer,
    videoId: videoId,
  });

const insertPuzzlePiece = (
  title,
  pathToImage,
  description,
  category,
  videoId
) =>
  PuzzlePieceCollection.insert({
    title: title,
    pathToImage: pathToImage,
    description: description,
    category: category,
    videoId: videoId,
  });

Meteor.startup(() => {
  if (ParentQuestionCollection.find().count() === 0) {
    [
      ["Question 1", "Answer 1", "replace this with vimeo-id"],
      ["Question 2", "Answer 2", "replace this with vimeo-id"],
      ["Question 3", "Answer 3", "replace this with vimeo-id"],
      ["Question 4", "Answer 4", "replace this with vimeo-id"],
    ].forEach((question) => insertQuestion(question[0], question[1]));
  }

  if (ChildQuestionCollection.find().count() === 0) {
    [
      ["Question 1", "Answer 1", "replace this with vimeo-id"],
      ["Question 2", "Answer 2", "replace this with vimeo-id"],
      ["Question 3", "Answer 3", "replace this with vimeo-id"],
      ["Question 4", "Answer 4", "replace this with vimeo-id"],
    ].forEach((question) =>
      insertChildquestion(question[0], question[1], question[2])
    );
  }

  if (PuzzlePieceCollection.find().count() === 0) {
    [
      [
        "Demo piece",
        "/images/Puzzlepieces/PuzzlePiece-28.png",
        "Demo explanation",
        "physical",
        "replace this with vimeo-id",
      ],
    ].forEach((piece) =>
      insertPuzzlePiece(piece[0], piece[1], piece[2], piece[3], piece[4])
    );
  }
});
