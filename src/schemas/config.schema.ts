import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Config {
  @Prop({ type: Number })
  endTransfers: number;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
