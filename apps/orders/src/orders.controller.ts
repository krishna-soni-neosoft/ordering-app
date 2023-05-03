import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderBody } from './dto/create-order.body';
import { JwtAuthGuard } from '@app/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() body: CreateOrderBody, @Req() req: any) {
    return this.ordersService.createOrder(body, req.cookies?.Authentication);
  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }
}
