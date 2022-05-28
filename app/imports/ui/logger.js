import { LogCollection } from "../api/log";
import { Meteor } from "meteor/meteor";

export function createLog(type, subType, scherm, detail) {
  LogCollection.insert({
    time: new Date(),
    user: Meteor.userId(),
    type: type,
    scherm: scherm,
    subType: subType,
    detail: detail,
  });
}
