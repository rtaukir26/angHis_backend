const bcrypt = require("bcrypt");
exports.hashPassword = async (password) => {
  try {
    const saltRound = 10;
    const hashedPwd = await bcrypt.hash(password, saltRound);
    return hashedPwd;
  } catch (error) {
    console.log(error);
  }
};

exports.comparePassword = async (password, hashedPwd) => {
  return bcrypt.compare(password, hashedPwd);
};
