const AuraPermission = require("./permission.model");

class PermissionRepository {
  async findByUserId(userId) {
    return AuraPermission.findOne({
      user: userId,
    }).lean();
  }

  async create(data) {
    return AuraPermission.create(data);
  }

  async updateByUserId(userId, data) {
    return AuraPermission.findOneAndUpdate(
      {
        user: userId,
      },
      data,
      {
        new: true,
        runValidators: true,
      }
    ).lean();
  }

  async ensureForUser(userId, defaultPermissions) {
    return AuraPermission.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $setOnInsert: {
          user: userId,
          permissions: defaultPermissions,
          version: 1,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).lean();
  }
}

module.exports = new PermissionRepository();