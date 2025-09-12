import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { GameModule } from './game/game.module';
import { PackageModule } from './package/package.module';
import { TransactionModule } from './transaction/transaction.module';
import { QrCodeModule } from './qr-code/qr-code.module';
import { PaymentmethodModule } from './paymentmethod/paymentmethod.module';



@Module({
  imports: [AuthModule, AwsModule, GameModule, PackageModule,  TransactionModule, QrCodeModule, PaymentmethodModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
