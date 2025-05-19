export default {
  testEnvironment: "jsdom",
  transform: {
    '\\.[jt]sx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
};