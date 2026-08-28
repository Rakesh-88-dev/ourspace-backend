const specialDateService = require("../../special-date/services/specialDate.service");

const { TOOL_TYPES } = require("./tool.types");

const SpecialDateTool = {
  [TOOL_TYPES.CREATE_SPECIAL_DATE]: async ({
    args,
    context,
  }) => {
    return specialDateService.createSpecialDate(
      context.userId,
      args,
      null
    );
  },

  [TOOL_TYPES.GET_SPECIAL_DATES]: async ({
    args,
    context,
  }) => {
    return specialDateService.getSpecialDates(
      context.userId
    );
  },

  [TOOL_TYPES.UPDATE_SPECIAL_DATE]: async ({
    args,
    context,
  }) => {
    return specialDateService.updateSpecialDate(
      context.userId,
      args.specialDateId,
      args.updates
    );
  },

  [TOOL_TYPES.DELETE_SPECIAL_DATE]: async ({
    args,
    context,
  }) => {
    return specialDateService.deleteSpecialDate(
      context.userId,
      args.specialDateId
    );
  },
};

module.exports = SpecialDateTool;