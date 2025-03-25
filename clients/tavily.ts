const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export { tvly };
