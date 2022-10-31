import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PoolDetailsDocument = DailyPoolDetails & Document;

@Schema()
export class DailyPoolDetails {
  @Prop()
  date: Date;

  @Prop()
  trait: string;

  @Prop()
  balanceX: string;

  @Prop()
  balanceY: string;

  @Prop()
  lpTokenSupply: string;
}

export const PoolDetailsSchema = SchemaFactory.createForClass(DailyPoolDetails);
