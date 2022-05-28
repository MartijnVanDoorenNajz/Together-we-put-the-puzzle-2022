import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { BrusCollection } from "../../api/brus";
import { Meteor } from "meteor/meteor";
import { ChildCollection } from "../../api/child";
import { useTracker } from "meteor/react-meteor-data";

export const OnboardingBrussen = () => {
  const [redirect, setRedirect] = useState(false);
  const [brussen, setBrussen] = useState([""]);

  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.findOne(userFilter));

  const onSubmit = (e) => {
    e.preventDefault();

    brussen.forEach((brus) => {
      if (brus != "") {
        Meteor.call(
          "createLog",
          "action_db",
          "create",
          "onboarding_brussen",
          "brus"
        );
        BrusCollection.insert(
          {
            firstName: brus,
            familyId: Meteor.userId(),
          },
          (err) => (err ? console.log(err) : "")
        );
      }
    });

    setRedirect(true);
  };

  const generateInputFields = () => {
    return brussen.map((brus, index) => {
      return (
        <input
          key={index}
          type="text"
          placeholder="Naam brus"
          name="brusName"
          value={brus}
          required
          onChange={(e) => {
            var brusCopy = [...brussen];
            brusCopy[index] = e.target.value;
            setBrussen(brusCopy);
          }}
          style={{ width: "80%", marginBottom: "10px" }}
        />
      );
    });
  };

  if (redirect) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "onboarding_brussen",
      "to onboarding_parents"
    );
    return <Navigate to="/onboardingMumDad" />;
  } else {
    Meteor.call("createLog", "render", "", "onboarding_brussen", "");
    return (
      <div className="onboarding-contentcenterflex">
        <h1>{"Wie zijn de broers en zussen van " + child.firstName + "?"}</h1>
        <h4 style={{ marginTop: "0px", color: "darkblue" }}>
          Vul hier hun namen in!
        </h4>
        <div style={{ height: "30px" }}></div>
        {generateInputFields()}
        <div
          className="button-standard"
          style={{ width: "80%", marginBottom: "10px" }}
          onClick={() => {
            var brusCopy = [...brussen];
            brusCopy.push("");
            setBrussen(brusCopy);
          }}
        >
          Nog een brus toevoegen
        </div>
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
