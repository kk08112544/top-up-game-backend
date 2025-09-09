import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { GameModule } from './game/game.module';
import { PackageModule } from './package/package.module';
import { CartModule } from './cart/cart.module';



@Module({
  imports: [AuthModule, AwsModule, GameModule, PackageModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
