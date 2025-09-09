import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Cart,Prisma } from '@prisma/client';


@Injectable()
export class CartService {

  constructor(private prisma:PrismaService){}

  async create(data: Cart):Promise<any>  {

      const checkGame = await this.prisma.game.findUnique({
        where:{
          id:Number(data.game_id)
        },
      })

      const checkPackage = await this.prisma.package.findUnique({
        where:{
          id:Number(data.package_id),
        }
      })

        // ถ้าไม่เจอเกมหรือแพ็คเกจ → return null เลย
      if (!checkGame || !checkPackage) {
        return 'Game and Package are not found.';
      }


      if(checkGame?.status_id !== 2 && checkPackage?.numpack!==0 ){
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
        return null
      }
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: Cart) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
