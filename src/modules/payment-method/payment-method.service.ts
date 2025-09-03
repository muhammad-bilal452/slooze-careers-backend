import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './entity/payment-method.entity';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepo: Repository<PaymentMethod>,
  ) {}

  async findAll(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepo.find();
  }

  async findById(id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepo.findOne({
      where: { id },
    });
    if (!paymentMethod)
      throw new NotFoundException(`Payment method ${id} not found`);
    return paymentMethod;
  }

  async create(
    createPaymentMethodeDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const paymentMethod = this.paymentMethodRepo.create(
      createPaymentMethodeDto,
    );
    return this.paymentMethodRepo.save(paymentMethod);
  }

  async update(
    id: string,
    updatePaymentMethodeDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const paymentMethod = await this.findById(id);
    Object.assign(paymentMethod, updatePaymentMethodeDto);
    return this.paymentMethodRepo.save(paymentMethod);
  }

  async remove(id: string): Promise<void> {
    const paymentMethod = await this.findById(id);
    await this.paymentMethodRepo.remove(paymentMethod);
  }
}
