import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Cart,Prisma } from '@prisma/client';


@Injectable()
export class CartService {

  constructor(private prisma:PrismaService){}

  async create(data: Cart):Promise<any>  {

      const checkGame = await this.prisma.game.findUnique({
        where:{
          id:Number(data.game_id), status_id:{
            not:2
          }, active:true
        },
      })

      const checkPackage = await this.prisma.package.findUnique({
        where:{
          id:Number(data.package_id), numpack:{
            not:0
          }, active:true
        }
      })


      if(checkGame && checkPackage){
        const amountPackage = checkPackage.numpack - 1 ;

        const updatePackage = await this.prisma.package.update({
          where:{id:Number(data.package_id)},
          data:{
            numpack: amountPackage
          }
        })

        const createCart : Cart = await this.prisma.cart.create({
          data:{
            ...data,
          }
        })
        return createCart;
      }else{
         return 'Game and Package are not found.';
      }
  }

  async findMyCart(user_id: number):Promise<any> {
      return this.prisma.cart.findMany({
        where:{
          user_id:Number(user_id)
        }
    });
  }

  update(id: number, updateCartDto: Cart) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
