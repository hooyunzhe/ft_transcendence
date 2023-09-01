import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFactor } from './entities/two-factor.entity';
import { TwoFactorController } from './two-factor.controller';
import { TwoFactorService } from './two-factor.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TwoFactor]), UserModule],
  controllers: [TwoFactorController],
  providers: [TwoFactorService],
})
export class TwoFactorModule {}
