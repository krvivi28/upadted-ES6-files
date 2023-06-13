export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  clearMocks: true,
  setupFilesAfterEnv: ['regenerator-runtime/runtime'],
  testPathIgnorePatterns: [
    "/node_modules/",
  ],
  testResultsProcessor: "<rootDir>/custom-reporter",
};
