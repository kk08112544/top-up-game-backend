import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { jwtConstants } from 'src/token/constant/constant';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/token/local/local-strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/token/jwt/jwt-strategy';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports:[
    PassportModule,
    JwtModule.register({
      secret:jwtConstants.secret,
      signOptions:{expiresIn:'2h'},
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,PrismaService,LocalStrategy, JwtStrategy],
})
export class AuthModule {}
