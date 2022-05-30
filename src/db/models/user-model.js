import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

const User = model('users', UserSchema);

export class UserModel {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(_id) {
    return await User.findOne({ _id });
  }

  async create(userInfo) {
    return await User.create(userInfo);
  }

  async findAll() {
    return await User.find({});
  }

  async update({ _id, update }) {
    return await User.findOneAndUpdate({ _id, returnOriginal: false }, update);
  }
  async delete({ _id }) {
    return await User.deleteOne({ _id, returnOriginal: false });
  }
}

const userModel = new UserModel();

export { userModel };
