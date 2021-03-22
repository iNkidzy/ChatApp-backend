import { Module } from '@nestjs/common';
import { ChatModule } from './chat/api/chat.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './chat/infrastructure/database.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({
      // validation for the variables in the .env
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
