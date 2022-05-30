import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
  async findById(userId) {
    const order = await Order.find({ userId });
    return order;
  }

  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  async findAll() {
    const orderes = await Order.find({});
    return orderes;
  }

  async update({ _id, update }) {
    const updatedOrder = await Order.findOneAndUpdate({ _id, returnOriginal: false }, update);
    return updatedOrder;
  }

  async delete(_id) {
    const order = await Order.deleteOne({ _id });
    return order;
  }
}

const orderModel = new OrderModel();

export { orderModel };
