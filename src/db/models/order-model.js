import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
  async findById(userId) {
    const order = await Order.find({ userId: userId });
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

  async update({ orderId, update }) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false };

    const updatedOrder = await Order.findOneAndUpdate(filter, update, option);
    return updatedOrder;
  }

  async delete(orderId) {
    const order = await Order.deleteOne({ _id: orderId });
    return order;
  }
}

const orderModel = new OrderModel();

export { orderModel };
