import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TransactionService {

  constructor(private prisma:PrismaService){}


  async create(data: Transaction):Promise<any> {
    return this.prisma.transaction.create({
      data:data,
    })
  }

  async getNewTransaction():Promise<any> {
     return this.prisma.transaction.findMany({
      where:{
        status_id:3
      },
      select:{
        user_id:true,
        user:{
          select:{
            fname:true,
            lname:true,
          }
        },
    
        game_id:true,
        game:{
          select:{
            game_name:true,
            game_profile:true,
          }
        },
        package_id:true,
        package:{
          select:{
            package_name:true,
            package_profile:true,
          }
        },
        UID:true,
        paymentMethod:{
          select:{
            payment_profile:true
          }
        }
      }
     });
  }


  async getManageTransaction():Promise<any>{
    return this.prisma.transaction.findMany({
      where:{
        status_id:{
          not:3
        },
        
      },
      select:{
        user_id:true,
        user:{
          select:{
            fname:true,
            lname:true,
          }
        },
    
        game_id:true,
        game:{
          select:{
            game_name:true,
            game_profile:true,
          }
        },
        package_id:true,
        package:{
          select:{
            package_name:true,
            package_profile:true,
          }
        },
        UID:true,
        paymentMethod:{
          select:{
            payment_profile:true
          }
        }
      }
    })
  }

  async getStatusTransaction(status_id:number):Promise<any>{
    return this.prisma.transaction.findMany({
      where:{
        status_id:Number(status_id)
      },
      select:{
        user_id:true,
        user:{
          select:{
            fname:true,
            lname:true,
          }
        },
    
        game_id:true,
        game:{
          select:{
            game_name:true,
            game_profile:true,
          }
        },
        package_id:true,
        package:{
          select:{
            package_name:true,
            package_profile:true,
          }
        },
        UID:true,
        paymentMethod:{
          select:{
            payment_profile:true
          }
        }
      }
    })
  }

  async findMyTransaction(user_id: number):Promise<any> {
     return this.prisma.transaction.findMany({
        where:{
          user_id:Number(user_id)
        },
        select:{
        user_id:true,
        user:{
          select:{
            fname:true,
            lname:true,
          }
        },
    
        game_id:true,
        game:{
          select:{
            game_name:true,
            game_profile:true,
          }
        },
        package_id:true,
        package:{
          select:{
            package_name:true,
            package_profile:true,
          }
        },
        UID:true,
        paymentMethod:{
          select:{
            payment_profile:true
          }
        }
      }
    });
  }

  async updateTransactionStatus(id: number,  status_id:number):Promise<any>  {
     return this.prisma.transaction.update({
      where:{id:Number(id)},
      data:{
        status_id:Number(status_id)
      }
     })
  }
}
