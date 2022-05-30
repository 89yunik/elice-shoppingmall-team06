import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

const User = model('users', UserSchema);

export class UserModel {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(userId) {
    return await User.findOne({ _id: userId });
  }

  async create(userInfo) {
    return await User.create(userInfo);
  }

  async findAll() {
    return await User.find({});
  }

  async update({ userId, update }) {
    return await User.findOneAndUpdate({ _id: userId, returnOriginal: false }, update);
  }
  async delete({ _id }) {
    return await User.deleteOne({ _id, returnOriginal: false });
  }
}

const userModel = new UserModel();

export { userModel };
