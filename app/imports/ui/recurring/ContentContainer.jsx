import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { ImArrowLeft } from "react-icons/im";
import { possibleColors } from "../../appContext";
import { Meteor } from "meteor/meteor";
import { ChildCollection } from "../../api/child";
import { useTracker } from "meteor/react-meteor-data";

export const ContentContainer = ({
  children,
  title,
  arrow,
  previous = null,
}) => {
  const navigate = useNavigate();
  const userFilter = { familyId: Meteor.userId() };
  const child = useTracker(() => ChildCollection.find(userFilter).fetch())[0];
  const [barVisible, setBarVisible] = useState(false);
  const [barOpacity, setBarOpacity] = useState(0);

  const showBar = () => {
    window.scrollY > 80 ? setBarVisible(true) : setBarVisible(false);
    scrollY > 100
      ? setBarOpacity(1)
      : scrollY < 80
      ? setBarOpacity(0)
      : setBarOpacity((scrollY - 80) / 20);
  };

  useEffect(() => {
    window.addEventListener("scroll", showBar);
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <div
          className="themeBackground"
          style={{
            height: "150px",
            position: "fixed",
            width: "100%",
            marginBottom: "150px",
            background: possibleColors[child.favoriteColor],
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              fontSize: "35px",
              color: "white",
              fontWeight: "normal",
            }}
          >
            {arrow ? (
              <div
                onClick={() => {
                  previous ? navigate(previous) : navigate(-1);
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "28px",
                    left: "22px",
                  }}
                >
                  <ImArrowLeft size="28px" color="white" />
                </div>
              </div>
            ) : (
              <Link to="/">
                <div
                  style={{
                    position: "absolute",
                    top: "28px",
                    left: "22px",
                  }}
                >
                  <AiFillHome size="35px" color="white" />
                </div>
              </Link>
            )}

            {title}
          </div>
        </div>

        <div
          style={{
            marginTop: "100px",
            backgroundColor: "white",
            borderTopLeftRadius: "50px",
            borderTopRightRadius: "50px",
            flexGrow: 1,
            padding: "40px 30px",
            zIndex: 100,
            boxShadow: "0px -5px 7px 0px #00000024",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
      {barVisible ? (
        <div
          style={{
            position: "fixed",
            top: "0px",
            zIndex: 1000000,
            background: possibleColors[child.favoriteColor],
            width: "100%",
            opacity: barOpacity,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              fontSize: "35px",
              color: "white",
              fontWeight: "normal",
            }}
          >
            {arrow ? (
              <div
                onClick={() => {
                  previous ? navigate(previous) : navigate(-1);
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "28px",
                    left: "22px",
                  }}
                >
                  <ImArrowLeft size="28px" color="white" />
                </div>
              </div>
            ) : (
              <Link to="/">
                <div
                  style={{
                    position: "absolute",
                    top: "28px",
                    left: "22px",
                  }}
                >
                  <AiFillHome size="35px" color="white" />
                </div>
              </Link>
            )}

            {title}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
