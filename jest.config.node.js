module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["coffee", "js"],
  transform: {
    "^.+\\.(coffee)$": "<rootDir>/jest-preprocessor.js"
  },
  testMatch: ["**/*.nodetest.(coffee|js)", "**/*.test.(coffee|js)"]
};
