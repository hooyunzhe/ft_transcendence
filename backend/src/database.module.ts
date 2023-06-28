import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: 'database',
      // for dev
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'ft_transcendence',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
