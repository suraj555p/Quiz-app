"use server";

import { currentUser,auth } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma"

export const syncUser = async ()=>{
   try {
      const {userId}=await auth();
      const user = await currentUser();

      if(!userId || !user ) return;

      const existingUser = await prisma.user.findUnique({
        where : {clerkId : userId}
      })

      if(existingUser) return existingUser;

      const createUser = await prisma.user.create({
         data: {
             clerkId: userId,
             username: user.username ?? user.firstName ?? "User",
             email: user.emailAddresses[0]?.emailAddress,
             profile: user.imageUrl,

         }
      })

      return createUser;

   } catch (error) {
      console.log("error in syncUser ",error);
   }
};

export const dbUser = async()=>{
   try {
      const {userId} = await auth();
      const user = await currentUser();

      if(!userId || !user) return;

      const getUser = await prisma.user.findUnique({
         where : {clerkId : userId},
         select : {
            id: true,
            username : true,
            email : true,
            profile : true,
            subjects : {
               select : {
                   subjectName: true,
               }
            }
         }
      });

      return getUser;
   } catch (error) {
      console.log("error in fetching user ",error);
   }
};
