const getUserName = require("./user");
const axios = require("axios").default;
axios.get.mockResolvedValue({ data: { username: "almostlover" } });
function mockTest(shouldCall, cb) {
  if (shouldCall) {
    return cb(42);
  }
}

it("test with mock function", () => {
  const mockCb = jest.fn();
  mockTest(true, mockCb);
  expect(mockCb).toHaveBeenCalled();
  expect(mockCb).toHaveBeenCalledWith(42);
  expect(mockCb).toHaveBeenCalledTimes(1);
  console.log(mockCb.mock.calls);
  console.log(mockCb.mock.results);
});

it("test mock with implementation", () => {
  // const mockCb = jest.fn((x) => x * 2);
  const mockCb = jest.fn().mockReturnValue(100);
  mockTest(true, mockCb);
  console.log(mockCb.mock.results);
});

it("test with mock modules", () => {
  return getUserName(1).then((name) => {
    console.log(name);
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users/1"
    );
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
