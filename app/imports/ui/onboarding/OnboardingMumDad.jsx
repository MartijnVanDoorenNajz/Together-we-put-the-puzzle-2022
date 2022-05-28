import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { ParentCollection } from "../../api/parent";
import { Meteor } from "meteor/meteor";

export const OnboardingMumDad = () => {
  const [redirect, setRedirect] = useState(false);
  const [mum, setMum] = useState("");
  const [dad, setDad] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    Meteor.call(
      "createLog",
      "action_db",
      "create",
      "onboarding_parents",
      "parents"
    );
    if (mum != "") {
      ParentCollection.insert(
        {
          firstName: mum,
          familyId: Meteor.userId(),
        },
        (err) => (err ? console.log(err) : "")
      );
    }

    if (dad != "") {
      ParentCollection.insert(
        {
          firstName: dad,
          familyId: Meteor.userId(),
        },
        (err) => (err ? console.log(err) : "")
      );
    }

    setRedirect(true);
  };

  if (redirect) {
    Meteor.call("createLog", "navigate", "", "onboarding_parents", "to home");
    return <Navigate to="/" />;
  } else {
    Meteor.call("createLog", "render", "", "onboarding_parents", "");
    return (
      <div className="onboarding-contentcenterflex">
        <h1>{"Wie zijn jullie mama en papa ?"}</h1>
        <h4 style={{ marginTop: "0px", color: "darkblue" }}>
          Vul hier hun namen in!
        </h4>
        <div style={{ height: "30px" }}></div>

        <input
          type="text"
          placeholder="Naam mama"
          name="brusName"
          value={mum}
          required
          onChange={(e) => setMum(e.target.value)}
          style={{ width: "80%", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Naam papa"
          name="brusName"
          value={dad}
          required
          onChange={(e) => setDad(e.target.value)}
          style={{ width: "80%", marginBottom: "10px" }}
        />
        <div
          className="button-standard"
          style={{ width: "80%" }}
          onClick={(e) => onSubmit(e)}
        >
          Doorgaan
        </div>
      </div>
    );
  }
};
