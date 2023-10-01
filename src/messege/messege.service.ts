import { Messege, MessegeDocument } from './messege.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class MessageService {
  constructor(
    @InjectModel(Messege.name)
    private readonly messegeModel: Model<MessegeDocument>,
  ) {}

  async create(message: Messege) {
    const newMessege = new this.messegeModel(message);
    await newMessege.save();
    return newMessege;
  }

  async update(id: string, data: any) {
    return this.messegeModel.findOneAndUpdate(
      {
        _id: id,
      },
      data,
      {
        returnDocument: 'after',
      },
    );
  }

  async findById(id: string) {
    return await this.messegeModel.findById(id).exec();
  }
}
