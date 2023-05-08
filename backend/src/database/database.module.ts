import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity'

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'database',
			port: 5432,
			username: 'admin',
			password: 'admin',
			database: 'ft_transcendence',
			entities: [User],
			synchronize: true
		}),
	],
})
export class DatabaseModule {}
