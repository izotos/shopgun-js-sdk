module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["coffee", "js"],
  transform: {
    "^.+\\.(coffee)$": "<rootDir>/jest-preprocessor.js"
  },
  testMatch: ["**/*.browsertest.(coffee|js)", "**/*.test.(coffee|js)"]
};
