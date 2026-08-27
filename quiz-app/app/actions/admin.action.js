"use server";

import { dbUser } from "./user.action";
import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export const createSubject = async (subjectData, questionsData) => {
  try {
    const user = await dbUser();

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return { success: false, message: "Unauthorized" };
    }

    if (!subjectData?.subjectName?.trim()) {
      return {
        success: false,
        message: "Subject name is required",
      };
    }

    const existingQuiz = await prisma.subject.findFirst({
      where: {
        subjectName: subjectData.subjectName.trim(),
        userId: user.id,
      },
    });

    if (existingQuiz) {
      return {
        success: false,
        message: "Subject already exists",
        data: existingQuiz,
      };
    }

   
    const validQuestions = questionsData
      .filter((q) => q && typeof q === 'object') 
      .map((q) => {
        const correctOpt = parseInt(q.correctOption);
        
        return {
          question: q.question?.trim(),
          option1: q.option1?.trim(),
          option2: q.option2?.trim(),
          option3: q.option3?.trim(),
          option4: q.option4?.trim(),
          correctOption: correctOpt,
        };
      })
      .filter((q) => 
        q.question && 
        q.option1 && 
        q.option2 && 
        q.option3 && 
        q.option4 && 
        !isNaN(q.correctOption) &&  
        q.correctOption >= 1 && 
        q.correctOption <= 4
      )
      .map((q, index) => ({
        ...q,
        questionNumber: index + 1,  
      }));

    if (validQuestions.length === 0) {
      return {
        success: false,
        message: "No valid questions provided",
      };
    }

    const time = parseInt(subjectData.time);
    const numberOfquestions = parseInt(subjectData.numberOfquestions);
    const positiveMarking = parseInt(subjectData.positiveMarking);
    const negativeMarking = parseFloat(subjectData.negativeMarking) || 0;

    if (isNaN(time) || time <= 0) {
      return {
        success: false,
        message: "Valid time is required",
      };
    }

    if (isNaN(numberOfquestions) || numberOfquestions <= 0) {
      return {
        success: false,
        message: "Valid number of questions is required",
      };
    }

    if (isNaN(positiveMarking) || positiveMarking < 0) {
      return {
        success: false,
        message: "Valid positive marking is required",
      };
    }

    const newSubject = await prisma.subject.create({
      data: {
        subjectName: subjectData.subjectName.trim(),
        time: time,
        numberOfquestions: numberOfquestions,
        positiveMarking: positiveMarking,
        negativeMarking: negativeMarking,
        userId: user.id,
        questions: {
          create: validQuestions,
        },
      },
      include: {
        questions: true,
      },
    });

    revalidatePath("/");
    return { success: true, data: newSubject };
  } catch (error) {
    console.log("error in creating new subject ", error);
    
    console.error("Prisma error code:", error.code);
    console.error("Prisma error meta:", error.meta);
    console.error("Full error:", error);

    return { 
      success: false, 
      message: error.code === "P2011" 
        ? "Some question data is incomplete. Please check all fields." 
        : "Something went wrong" 
    };
  }
};

export const getSubject = async ()=>{
   try {
        const allSubjects = await prisma.subject.findMany({});
        if(!allSubjects){
          return {success: false, message: "No subject found ..."}
        }
        return {success: true, data: allSubjects};
   } catch (error) {
      console.log("error in getting a subject ", error);
      return { success: false, message: "Something went wrong" };
   }
}

export const deleteSubject = async({id}) =>{
   try {
        const currentUser = await dbUser();
        if(!currentUser){
          return {success: false, message: "login first !!!"};
        }

        const isAdmin = Boolean(
          currentUser?.email && process.env.ADMIN_EMAIL && currentUser.email === process.env.ADMIN_EMAIL
        );

        if(!isAdmin){
          return {success:false, message: "only admin can delete this !"}
        }

        if(!id){
           return {success:false, message: "subject id is required !!"}
        }

        const subjectTobeDelete = await prisma.subject.delete({
           where : {
             id 
           },
        });
        
       revalidatePath("/")
       return {success: true, message: "subject deleted successfully..."}

   } catch (error) {
       console.log("error in deleting a subject ",error);
       return {success:false, message: "Something went wrong"};
   }
}

export const getUsersResults = async ()=>{
  try {
      const user = await dbUser();
      if(!user || user.email!==process.env.ADMIN_EMAIL) 
       return {success:false, message: "admin user is not logged in !"};

      const allUserResults = await prisma.quizAttempt.findMany({
         include:{
           user: {
             select : {
                username: true,
                email: true,
                profile: true,
             }
           },
           subject: {
              select : {
                 subjectName: true,
              }
           }
         },
         orderBy:{
           createdAt : "desc",
         },
      });

      return {success: true, data: allUserResults};

  } catch (error) {
     return {success: false , message: "error in getting all users results !"}
  }
}

export const deleteUserResult = async (attemptId) => {
  try {
    const user = await dbUser();

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return {
        success: false,
        message: "Admin user is not authorized!",
      };
    }

    const result = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
      },
    });

    if (!result) {
      return {
        success: false,
        message: "Quiz result not found!",
      };
    }

    await prisma.quizAttempt.delete({
      where: {
        id: attemptId,
      },
    });

    return {
      success: true,
      message: "Quiz result deleted successfully!",
    };
  } catch (error) {
    console.error("Error deleting user result:", error);

    return {
      success: false,
      message: "Error in deleting user result!",
    };
  }
};