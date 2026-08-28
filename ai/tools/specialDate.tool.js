const specialDateService = require("../../special-date/services/specialDate.service");

const { TOOL_TYPES } = require("./tool.types");

const SpecialDateTool = {
  // ==========================================
  // CREATE SPECIAL DATE
  // ==========================================

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

  // ==========================================
  // GET SPECIAL DATES
  // ==========================================

  [TOOL_TYPES.GET_SPECIAL_DATES]: async ({
    context,
  }) => {
    return specialDateService.getSpecialDates(
      context.userId
    );
  },

  // ==========================================
  // UPDATE SPECIAL DATE
  // ==========================================

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

  // ==========================================
  // DELETE SPECIAL DATE
  // ==========================================

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