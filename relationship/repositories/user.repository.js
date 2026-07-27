const User = require("../../models/User");

class UserRepository {
  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({
      email: email.toLowerCase(),
    });
  }

  async updateById(userId, data) {
  return User.findByIdAndUpdate(
    userId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
}
}

module.exports = new UserRepository();