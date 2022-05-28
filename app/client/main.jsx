import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
// @ts-ignore
// import { App } from "/imports/ui/App";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// // @ts-ignore
// import { PersonPickerScreen } from "/imports/ui/family/PersonPickerScreen";
// import { Onboarding0 } from "../imports/ui/onboarding/Onboarding0";
// import { Login } from "../imports/ui/onboarding/Login";
// import { OnboardingChild } from "../imports/ui/onboarding/OnboardingChild";
// import { OnboardingBrussen } from "../imports/ui/onboarding/OnboardingBrussen";
// import { OnboardingMumDad } from "../imports/ui/onboarding/OnboardingMumDad";
// import { OnboardingChild1 } from "../imports/ui/onboarding/OnboardingChild1";
// import { OnboardingChild2 } from "../imports/ui/onboarding/OnboardingChild2";
// import { BrusScreen } from "../imports/ui/family/BrusScreen";
// import { QuestionDetailScreen } from "../imports/ui/family/QuestionDetailScreen";
// import {appContext} from "../imports/appContext";
import { AppContainer } from "../imports/ui/AppContainer";

Meteor.startup(() => {
  render(
    <AppContainer />,
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<App />} />

    //     <Route
    //       path="family/parentbrus/:memberId/:questionId"
    //       element={<QuestionDetailScreen />}
    //     />
    //     <Route path="family/parentbrus/:memberId" element={<BrusScreen />} />
    //     <Route path="family" element={<PersonPickerScreen />} />

    //     <Route path="child" element={<div>Child page</div>} />

    //     {/* EVERYTHING FOR ONBOARDING */}
    //     <Route path="onboarding" element={<Onboarding0 />} />
    //     <Route path="onboardingChild" element={<OnboardingChild />} />
    //     <Route path="onboardingChild1" element={<OnboardingChild1 />} />
    //     <Route path="onboardingChild2" element={<OnboardingChild2 />} />
    //     <Route path="onboardingBrussen" element={<OnboardingBrussen />} />
    //     <Route path="onboardingMumDad" element={<OnboardingMumDad />} />

    //     <Route path="login" element={<Login />} />
    //   </Routes>
    // </BrowserRouter>,
    document.getElementById("react-target")
  );
});
