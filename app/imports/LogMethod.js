import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { LogCollection } from "./api/log";

Meteor.methods({
  createLog(type, subType, scherm, detail) {
    // "log"(component, method, navigator, extra) {
    check(type, String);
    check(subType, String);
    check(scherm, String);
    check(detail, String);

    LogCollection.insert({
      time: new Date(),
      user: Meteor.userId(),
      type: type,
      scherm: scherm,
      subType: subType,
      detail: detail,
    });
  },
});
