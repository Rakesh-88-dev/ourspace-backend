const { body, param } = require("express-validator");

exports.inviteValidation = [
  body("receiverEmail")
    .trim()
    .notEmpty()
    .withMessage("Receiver email is required.")
    .isEmail()
    .withMessage("Invalid email address."),
    

  body("message")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Message cannot exceed 300 characters."),
];

exports.invitationIdValidation = [
  param("invitationId")
    .isMongoId()
    .withMessage("Invalid invitation ID."),
];