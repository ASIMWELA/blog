import { atom } from "recoil";

export const admin = atom({
  key: "admin",
  persistence_UNSTABLE: {
    type: "admin",
  },
});

export const pageAdmin = atom({
  key: "user",
  persistence_UNSTABLE: {
    type: "user",
  },
});
