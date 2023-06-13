import sum1 from "./ES6.js";
describe("testing sum1 for ES6 syntax", () => {
  it("should print 2+3=5", () => {
    expect(sum1(2, 3)).toBe(5);
  });

});

const { sum2 } = require("./common");
describe("testing sum2 for commonjs", () => {
  it("should print 2+3=5", () => {
    expect(sum2(2, 3)).toBe(5);
  });
});
