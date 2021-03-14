import { atom } from "recoil";

export const admin = atom({
  key: "admin",
  default: null,
  persistence_UNSTABLE: {
    type: "admin",
  },
});

export const loggedInUser = atom({
  key: "loggedInUser",
  default: null,
  persistence_UNSTABLE: {
    type: "loggedInUser",
  },
});

export const loggedInAdmin = atom({
  key: "loggedInAdmin",
  default: null,
  persistence_UNSTABLE: {
    type: "loggedInAdmin",
  },
});

export const projects = atom({
  key: "projects",
  default: null,
  persistence_UNSTABLE: {
    type: "projects",
  },
});

export const chatActiveContact = atom({
  key: "chatActiveContact",
  default: null,
  persistence_UNSTABLE: {
    type: "chatActiveContact",
  },
});
