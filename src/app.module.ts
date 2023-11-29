import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { TypeOrmModule } from "@nestjs/typeorm";

console.log(process.env.NODE_ENV);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.POSTGRES_HOST}`,
      port: Number(`${process.env.POSTGRES_PORT}`),
      username: `${process.env.POSTGRES_USERNAME}`,
      password: `${process.env.POSTGRES_PASSWORD}`,
      database: `${process.env.POSTGRES_DB}`,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
  ]
})
export class AppModule {}
