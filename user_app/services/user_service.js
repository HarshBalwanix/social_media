const User = require("../models/user");

class UserService {
  async getAllUsers() {
    console.log("user name alpha beta gamma!");
    return await User.find({});
  }

  async getuSerByUsername(username) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async createUser(userData) {
    const user = new User(userData);
    await user.save();

    return user;
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("user not found");
    }
    const isPasswordMatch = user.password === password;
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }
  }
}

module.exports = new UserService();
