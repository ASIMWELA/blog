import { atom } from "recoil";

export const admin = atom({
  key: "admin",
  default: {},
  persistence_UNSTABLE: {
    type: "admin",
  },
});

export const loggedInUser = atom({
  key: "loggedInUser",
  default: {},
  persistence_UNSTABLE: {
    type: "loggedInUser",
  },
});

export const loggedInAdmin = atom({
  key: "loggedInAdmin",
  default: {},
  persistence_UNSTABLE: {
    type: "loggedInAdmin",
  },
});

export const projects = atom({
  key: "projects",
  default: [],
  persistence_UNSTABLE: {
    type: "projects",
  },
});

export const chatActiveContact = atom({
  key: "chatActiveContact",
  default: {},
  persistence_UNSTABLE: {
    type: "chatActiveContact",
  },
});
