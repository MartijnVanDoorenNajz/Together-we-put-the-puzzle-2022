import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { ChildCollection } from "../../api/child";
import { Meteor } from "meteor/meteor";

export const OnboardingChild = () => {
  const [redirect, setRedirect] = useState(false);
  const [childName, setChildName] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    Meteor.call(
      "createLog",
      "action_db",
      "create",
      "onboarding_child_01",
      "child"
    );
    // CREATE CHILD
    ChildCollection.insert(
      {
        firstName: childName,
        familyId: Meteor.userId(),
      },
      (err) => (err ? console.log(err) : setRedirect(true))
    );
  };

  if (redirect) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "onboarding_child_01",
      "to onboarding_child_02"
    );
    return <Navigate to="/onboardingChild1" />;
  } else {
    Meteor.call("createLog", "render", "", "onboarding_child_01", "");
    return (
      <div className="onboarding-contentcenterflex">
        <h1 style={{ marginBottom: "10px" }}>Wie heeft bij jullie 22q11?</h1>
        <h4 style={{ marginTop: "0px", color: "darkblue" }}>
          Vul hier jouw naam in
        </h4>

        <div style={{ height: "30px" }}></div>

        <input
          type="text"
          placeholder="Voornaam"
          name="childName"
          required
          onChange={(e) => setChildName(e.target.value)}
          style={{ width: "80%", marginBottom: "10px" }}
        />

        <div
          className="button-standard"
          style={{ width: "80%", marginBottom: "10px" }}
          onClick={(e) => onSubmit(e)}
        >
          Doorgaan
        </div>
      </div>
    );
  }
};
