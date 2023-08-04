const axios = {
  get: jest.fn(() => Promise.resolve({ data: { username: "almostlover" } })),
};

export default axios;
