import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
// import { ChildCollection } from "../../api/child";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [doesNotExist, setDoesNotExist] = useState(false);

  const submit = (e) => {
    Meteor.call("createLog", "action", "login", "login", "");
    e.preventDefault();
    Meteor.loginWithPassword(username, password, (err) => {
      if (err) {
        console.log(err);
        setDoesNotExist(true);
      } else {
        // const userFilter = { familyId: Meteor.userId() };
        // const child = ChildCollection.findOne(userFilter);
        // setColor("red");
        // context.setColor(possibleColors[child.favoriteColor]);
        setRedirect(true);
      }
      err ? console.log(err) : setRedirect(true);
    });
  };

  if (Meteor.userId() && username == "") {
    Meteor.logout();
  }

  if (redirect) {
    Meteor.call("createLog", "navigate", "", "login", "to home");
    return <Navigate to="/" />;
  } else {
    Meteor.call("createLog", "render", "", "login", "");
    return (
      <div className="onboarding-contentcenterflex">
        <div style={{ flexGrow: 1 }}></div>

        <h1>Jouw logingegevens</h1>

        <input
          type="text"
          placeholder="Vul je familienaam in"
          name="username"
          required
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "80%" }}
        />

        <div style={{ height: "10px" }}></div>

        <input
          type="text"
          placeholder="Vul jullie wachtwoord in"
          name="username"
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "80%" }}
        />

        <div style={{ height: "10px" }}></div>

        <div
          style={{ width: "80%" }}
          className="button-standard"
          onClick={(e) => submit(e)}
        >
          Inloggen
        </div>
        <div style={{ height: "20px" }}></div>
        {doesNotExist ? (
          <p style={{ fontSize: "24px" }}>Dit account bestaat niet</p>
        ) : (
          ""
        )}
        <div style={{ flexGrow: 1 }}></div>
        <Link to="/onboarding">
          <div
            className="button-standard"
            style={{
              backgroundColor: "#dddddd",
              fontSize: "20px",
              fontWeight: "300",
            }}
          >
            Ik wil een account aanmaken
          </div>
        </Link>
        <div style={{ height: "40px" }}></div>
      </div>
    );
  }
};
