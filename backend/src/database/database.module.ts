import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from 'src/match_history/entities/match_history.entity';
import { User } from 'src/users/entities/user.entity';


@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'database',
			port: 5432,
			username: 'admin',
			password: 'admin',
			database: 'ft_transcendence',
			// entities: [User, MatchHistory],
			synchronize: true,
			autoLoadEntities: true
		}),
	],
})
export class DatabaseModule {}
