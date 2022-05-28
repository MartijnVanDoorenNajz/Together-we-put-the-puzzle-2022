// @ts-nocheck
import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// @ts-ignore
import { App } from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChildCollection } from "../api/child";
// @ts-ignore
import { PersonPickerScreen } from "./family/PersonPickerScreen";
import { Onboarding0 } from "./onboarding/Onboarding0";
import { Login } from "./onboarding/Login";
import { OnboardingChild } from "./onboarding/OnboardingChild";
import { OnboardingBrussen } from "./onboarding/OnboardingBrussen";
import { OnboardingMumDad } from "./onboarding/OnboardingMumDad";
import { OnboardingChild1 } from "./onboarding/OnboardingChild1";
import { OnboardingChild2 } from "./onboarding/OnboardingChild2";
import { BrusScreen } from "./family/BrusScreen";
import { QuestionDetailScreen } from "./family/QuestionDetailScreen";
import { ChildHomescreen } from "./child/ChildHomeScreen";
import { MainPuzzleView } from "./puzzle/MainPuzzleView";
import { PuzzleCategorySplit } from "./puzzle/PuzzleCategorySplit";
import { PiecesOverview } from "./puzzle/PiecesOverview";
import { PieceView } from "./puzzle/PieceView";
import { AddPuzzlePiece } from "./puzzle/AddPuzzlePiece";
import { EditColorAndAnimal } from "./child/EditColorAndAnimal";
import { EditPuzzlePiece } from "./puzzle/EditPuzzlePiece";
import { ChosenPieceSplit } from "./puzzle/ChosenPieceSplit";
import { InformationPuzzlePiece } from "./puzzle/InformationPuzzlePiece";
import { CreateOwnPiece } from "./puzzle/CreateOwnPiece";
import { ChildQuestionsScreens } from "./child/ChildQuestionsScreens";
import { ChildQuestionDetailScreen } from "./child/ChildQuestionDetailScreen";
import { DitBenIk } from "./child/DitBenIk";

export const AppContainer = () => {
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];
  const loggingIn = Meteor.loggingIn();

  if (!loggingIn || child) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

          <Route
            path="family/parentbrus/:memberId/:questionId"
            element={<QuestionDetailScreen />}
          />
          <Route path="family/parentbrus/:memberId" element={<BrusScreen />} />
          <Route path="family" element={<PersonPickerScreen />} />

          {/* EVERYTHING FOR CHILD */}
          <Route path="child" element={<ChildHomescreen />} />
          <Route path="/child/editChild" element={<EditColorAndAnimal />} />
          <Route path="/child/questions" element={<ChildQuestionsScreens />} />
          <Route
            path="/child/questions/:questionId"
            element={<ChildQuestionDetailScreen />}
          />
          <Route path="/child/ditbenik" element={<DitBenIk />} />

          {/* EVERYTHING FOR PUZZLE */}
          <Route path="puzzle" element={<MainPuzzleView />} />
          <Route path="puzzleCategorySplit" element={<PuzzleCategorySplit />} />
          <Route path="puzzle/:category" element={<PiecesOverview />} />
          <Route path="puzzle/piece/:pieceId" element={<PieceView />} />
          <Route path="addPiece/:pieceId" element={<AddPuzzlePiece />} />
          <Route
            path="puzzle/editPiece/:chosenPieceIndex"
            element={<ChosenPieceSplit />}
          />
          <Route
            path="editPiece/information/:pieceId"
            element={<InformationPuzzlePiece />}
          />
          <Route
            path="editPiece/edit/:chosenPieceIndex"
            element={<EditPuzzlePiece />}
          />
          <Route path="createPiece/:category" element={<CreateOwnPiece />} />

          {/* EVERYTHING FOR ONBOARDING */}
          <Route path="onboarding" element={<Onboarding0 />} />
          <Route path="onboardingChild" element={<OnboardingChild />} />
          <Route path="onboardingChild1" element={<OnboardingChild1 />} />
          <Route path="onboardingChild2" element={<OnboardingChild2 />} />
          <Route path="onboardingBrussen" element={<OnboardingBrussen />} />
          <Route path="onboardingMumDad" element={<OnboardingMumDad />} />

          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return <p>logging in ...</p>;
  }
};
