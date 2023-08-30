import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preference } from './entities/preference.entity';
import { PreferenceController } from './preference.controller';
import { PreferenceService } from './preference.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Preference]), UserModule],
  controllers: [PreferenceController],
  providers: [PreferenceService],
})
export class PreferenceModule {}
