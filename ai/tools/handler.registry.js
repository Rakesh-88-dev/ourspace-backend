const responseHandler = require("./handlers/response.handler");
const toolHandler = require("./handlers/tool.handler");

const HandlerRegistry = Object.freeze({
  response: responseHandler,
  tool: toolHandler,
});

module.exports = HandlerRegistry;