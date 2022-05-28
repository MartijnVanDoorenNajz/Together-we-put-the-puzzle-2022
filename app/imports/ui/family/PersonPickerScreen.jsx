import React, { useEffect, useState } from "react";
import { ContentContainer } from "../recurring/ContentContainer";
import { useTracker } from "meteor/react-meteor-data";
import { ParentCollection } from "../../api/parent";
import { BrusCollection } from "../../api/brus";
import { Meteor } from "meteor/meteor";
import { Navigate } from "react-router";

export const PersonPickerScreen = () => {
  const [redirect, setRedirect] = useState(false);
  const userFilter = { familyId: Meteor.userId() };
  const parents = useTracker(() => ParentCollection.find(userFilter).fetch());
  const brussen = useTracker(() => BrusCollection.find(userFilter).fetch());
  const [chosenMember, setChosenMember] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const generateFamilyMembers = () => {
    var brusList = brussen.map((member, index) => {
      return (
        <div
          key={index + "0"}
          className="button-surface small"
          onClick={() => {
            setChosenMember(member);
            Meteor.call(
              "createLog",
              "action",
              "family_brus_select",
              "family_home",
              member._id
            );
            setRedirect(true);
          }}
        >
          {member.firstName}
        </div>
      );
    });

    var parentList = parents.map((member, index) => {
      return (
        <div
          key={index}
          className="button-surface small"
          onClick={() => {
            setChosenMember(member);
            Meteor.call(
              "createLog",
              "action",
              "family_parent_select",
              "family_home",
              member
            );
            setRedirect(true);
          }}
        >
          {member.firstName}
        </div>
      );
    });

    return brusList.concat(parentList);
  };

  if (redirect) {
    Meteor.call(
      "createLog",
      "navigate",
      "",
      "family_home",
      // @ts-ignore
      "to family_memberscreen_" + chosenMember._id
    );
    // @ts-ignore
    return <Navigate to={"parentbrus/" + chosenMember._id} />;
  } else {
    Meteor.call("createLog", "render", "", "family_home", "");
    return (
      <ContentContainer title="Ouders en Brussen" arrow={false}>
        {/* <div className="text-heading-standard">Samen aan de slag</div>
        <div style={{ height: "20px" }}></div>
        <div className="button-surface small">Wij als familie</div>

        <div style={{ height: "40px" }}></div> */}

        <div className="text-heading-standard">Kies jouw naam</div>
        <div style={{ height: "20px" }}></div>
        {generateFamilyMembers()}
      </ContentContainer>
    );
  }
};
