import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Link, Navigate } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import "./onboarding.import.less";

export const Onboarding0 = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    Accounts.createUser({
      username: username,
      password: password,
    });
    Meteor.loginWithPassword(username, "password", () => {
      Meteor.call(
        "createLog",
        "action_db",
        "create",
        "onboarding_start",
        "user"
      );
      Meteor.call(
        "createLog",
        "navigate",
        "",
        "onboarding_start",
        "to onboarding_child_01"
      );
    });
    setRedirect(true);
  };

  if (Meteor.userId() && !redirect) {
    Meteor.logout();
  }

  if (redirect) {
    return <Navigate to="/onboardingChild" />;
  } else {
    return (
      <div className="onboarding-contentcenterflex">
        <div style={{ flexGrow: 1 }}></div>
        <h1 style={{ marginBottom: "10px", color: "darkblue" }}>
          Account maken
        </h1>
        <input
          type="text"
          placeholder="Vul jullie familienaam in"
          name="username"
          required
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "80%" }}
        />
        <div style={{ height: "10px" }}></div>
        <input
          type="text"
          placeholder="Kies een simpel wachtwoord"
          name="username"
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "80%" }}
        />
        <div style={{ height: "10px" }}></div>
        <div
          className="button-standard"
          style={{ width: "80%" }}
          onClick={(e) => submit(e)}
        >
          Account aanmaken
        </div>
        <div style={{ flexGrow: 1 }}></div>
        <Link to="/login">
          <div
            className="button-standard"
            style={{
              backgroundColor: "#dddddd",
              fontSize: "20px",
              fontWeight: "300",
            }}
          >
            Ik heb al een account, ik wil aanmelden
          </div>
        </Link>
        <div style={{ height: "40px" }}></div>
      </div>
    );
  }
};
