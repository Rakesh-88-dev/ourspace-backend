const SpecialDateRepository = require("../special-date/specialDate.query");
const { TOOL_TYPES } = require("./tool.types");

const SpecialDateTool = {
  [TOOL_TYPES.CREATE_SPECIAL_DATE]: async ({
    args,
    context,
  }) => {
    return SpecialDateRepository.addSpecialDate({
      userId: context.userId,
      specialDate: args,
    });
  },

  [TOOL_TYPES.GET_SPECIAL_DATES]: async ({
    args,
    context,
  }) => {
    return SpecialDateRepository.getSpecialDates({
      userId: context.userId,
      title: args?.title,
    });
  },

  [TOOL_TYPES.UPDATE_SPECIAL_DATE]: async ({
    args,
    context,
  }) => {
    return SpecialDateRepository.updateSpecialDate({
      userId: context.userId,
      title: args.title,
      updates: args.updates,
    });
  },

  [TOOL_TYPES.DELETE_SPECIAL_DATE]: async ({
    args,
    context,
  }) => {
    return SpecialDateRepository.deleteSpecialDate({
      userId: context.userId,
      title: args.title,
    });
  },
};

module.exports = SpecialDateTool;