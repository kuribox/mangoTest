module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/", "<rootDir>/src/"],
  testRegex: "src/.*\\.jest\\.jsx$",
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/node_modules/jest-css-modules",
  },
};
