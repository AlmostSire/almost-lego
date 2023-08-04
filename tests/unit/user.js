const axios = require("axios").default;

module.exports = function getUserName(id) {
  return axios
    .get(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then((res) => {
      return res.data.username;
    });
};
