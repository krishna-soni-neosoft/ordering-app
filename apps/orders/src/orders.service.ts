import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderBody } from './dto/create-order.body';
import { OrdersRepository } from './orders.repository';
import { BILLING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}
  async createOrder(body: CreateOrderBody, authentication: string) {
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(body, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          body,
          Authentication: authentication,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }
  async getOrders() {
    return this.ordersRepository.find({});
  }
}
