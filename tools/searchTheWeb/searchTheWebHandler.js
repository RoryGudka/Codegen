const { tvly } = require("../../clients/tavily");

const searchTheWebHandler = async ({ query }) => {
  try {
    const response = await tvly.search(query, { searchDepth: "basic" });
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return `An error occurred: ${error.message}`;
  }
};

module.exports = {
  searchTheWebHandler,
};
