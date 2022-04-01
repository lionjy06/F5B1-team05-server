// import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { AdminCategory } from "../adminCategory/entities/adminCategory.entity";
// import { AdminQuery } from "../adminQuery/entities/adminQuery.entity";
// import { User } from "../user/entities/user.entity";
// import { AdminResolver } from "./admin.resolver";
// import { AdminService } from "./admin.service";
// import { Admin } from "./entities/admin.entity";

// @Module({
//     imports:[
//         TypeOrmModule.forFeature([
//             Admin,
//             User,
//             AdminQuery,
//             AdminCategory
//         ])
      
//     ],
//     providers:[AdminService,AdminResolver]
// })
// export class AdminModule{}