import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: User) {
    const newUser = new this.userModel(user);
    await newUser.save();
    return newUser;
  }

  async update(id: string, data: any) {
    return this.userModel.findOneAndUpdate(
      {
        _id: id,
      },
      data,
      {
        returnDocument: 'after',
      },
    );
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email: email,
    });
  }

  async findById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async index(filter) {
    return await this.userModel.find(filter);
  }
}
