import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PoolBalancesDocument = DailyPoolBalances & Document;

@Schema()
export class DailyPoolBalances {
  @Prop()
  date: Date;

  @Prop()
  trait: string;

  @Prop()
  balanceX: string;

  @Prop()
  balanceY: string;
}

export const PoolBalanceSchema =
  SchemaFactory.createForClass(DailyPoolBalances);
