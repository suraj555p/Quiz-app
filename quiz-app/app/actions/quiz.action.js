"use server";

import { prisma } from "../../lib/prisma";
import { dbUser } from "./user.action";

export const getQuiz = async ({ id }) => {
  try {
    const loggedInUser = await dbUser();

    if (!loggedInUser) {
      return {
        success: false,
        message: "User is not logged in!",
      };
    }

    if (!id) {
      return {
        success: false,
        message: "Subject ID is required!",
      };
    }

    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        subjectName: true,
        time: true,
        numberOfquestions: true,
        positiveMarking: true,
        negativeMarking: true,
      },
    });

    if (!subject) {
      return {
        success: false,
        message: "Subject does not exist!",
      };
    }

    const questions = await prisma.question.findMany({
      where: {
        subjectId: subject.id,
      },
      orderBy: {
        questionNumber: "asc",
      },
      select: {
        id: true,
        subjectId: true,
        questionNumber: true,
        question: true,
        option1: true,
        option2: true,
        option3: true,
        option4: true,

      },
    });

    return {
      success: true,
      message: "Quiz fetched successfully!",
      data: {
        subject,
        questions,
      },
    };
  } catch (error) {
    console.error("getQuiz error:", error);

    return {
      success: false,
      message: "Error while fetching quiz!",
    };
  }
};

export async function submitQuiz({
  subjectId,
  answers = [],
}) {
  try {
    const loggedInUser = await dbUser();

    if (!loggedInUser) {
      return {
        success: false,
        message: "User is not logged in!",
      };
    }

    if (!subjectId) {
      return {
        success: false,
        message: "Subject ID is required!",
      };
    }

    if (!Array.isArray(answers)) {
      return {
        success: false,
        message: "Invalid answers format!",
      };
    }

    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
      select: {
        id: true,
        subjectName: true,
        positiveMarking: true,
        negativeMarking: true,
      },
    });

    if (!subject) {
      return {
        success: false,
        message: "Subject does not exist!",
      };
    }

    const questions = await prisma.question.findMany({
      where: {
        subjectId,
      },
      orderBy: {
        questionNumber: "asc",
      },
      select: {
        id: true,
        questionNumber: true,
        correctOption: true,
      },
    });

    if (questions.length === 0) {
      return {
        success: false,
        message: "No questions found for this subject!",
      };
    }

    /*
     * केवल उन्हीं question IDs को accept करेंगे
     * जो इसी subject के questions हैं।
     */
    const questionIds = new Set(
      questions.map((question) => question.id)
    );

    const validAnswers = answers.filter((answer) =>
      questionIds.has(answer?.questionId)
    );

    const answerMap = new Map();

    validAnswers.forEach((answer) => {
      if (!answerMap.has(answer.questionId)) {
        answerMap.set(answer.questionId, answer);
      }
    });

    const questionResults = questions.map((question) => {
      const submittedAnswer = answerMap.get(question.id);

      const selectedOption =
        submittedAnswer?.selectedOption ?? null;

      const isSkipped =
        selectedOption === null ||
        selectedOption === undefined;

      const isCorrect =
        !isSkipped &&
        Number(selectedOption) === Number(question.correctOption);

      return {
        questionId: question.id,
        questionNumber: question.questionNumber,
        selectedOption,
        correctOption: question.correctOption,
        isCorrect,
        isSkipped,
        isMarked: Boolean(
          submittedAnswer?.markedForReview
        ),
      };
    });

    const correctAnswers = questionResults.filter(
      (item) => item.isCorrect
    ).length;

    const wrongAnswers = questionResults.filter(
      (item) =>
        !item.isSkipped && !item.isCorrect
    ).length;

    const skippedAnswers = questionResults.filter(
      (item) => item.isSkipped
    ).length;

    const positiveMarking = Number(
      subject.positiveMarking ?? 1
    );

    const negativeMarking = Number(
      subject.negativeMarking ?? 0
    );

    const score =
      correctAnswers * positiveMarking -
      wrongAnswers * negativeMarking;

    const totalMarks =
      questions.length * positiveMarking;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: loggedInUser.id,
        subjectId: subject.id,
        score,
        totalMarks,
        correctAnswers,
        wrongAnswers,
        skippedAnswers,
        answers: {
          create: questionResults.map((item) => ({
            questionId: item.questionId,
            selectedOption: item.selectedOption,
            isCorrect: item.isCorrect,
            isMarked: item.isMarked,
          })),
        },
      },
    });

    return {
      success: true,
      message: "Quiz submitted successfully!",
      attemptId: attempt.id,
    };
  } catch (error) {
    console.error("submitQuiz error:", error);

    return {
      success: false,
      message: "Error while submitting quiz!",
    };
  }
}

export async function getQuizResult({ attemptId }) {
  try {
    const loggedInUser = await dbUser();

    if (!loggedInUser) {
      return {
        success: false,
        message: "User is not logged in!",
      };
    }

    if (!attemptId) {
      return {
        success: false,
        message: "Attempt ID is required!",
      };
    }

    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        id: attemptId,
        userId: loggedInUser.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: true,
          },
        },
        subject: {
          select: {
            id: true,
            subjectName: true,
            time: true,
            positiveMarking: true,
            negativeMarking: true,
          },
        },
        answers: {
          include: {
            question: {
              select: {
                questionNumber: true,
                question: true,
                option1: true,
                option2: true,
                option3: true,
                option4: true,
                correctOption: true,
              },
            },
          },
          orderBy: {
            question: {
              questionNumber: "asc",
            },
          },
        },
      },
    });

    if (!attempt) {
      return {
        success: false,
        message: "Quiz result not found!",
      };
    }

    const formattedResult = {
      id: attempt.id,
      subjectId: attempt.subjectId,
      subjectName: attempt.subject.subjectName,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      correctAnswers: attempt.correctAnswers,
      wrongAnswers: attempt.wrongAnswers,
      skippedAnswers: attempt.skippedAnswers,
      createdAt: attempt.createdAt,

      answers: attempt.answers.map((answer) => ({
        id: answer.id,
        questionId: answer.questionId,
        questionNumber: answer.question.questionNumber,
        question: answer.question.question,
        selectedOption: answer.selectedOption,
        correctOption: answer.question.correctOption,
        isCorrect: answer.isCorrect,
        isMarked: answer.isMarked,
        isSkipped: answer.selectedOption === null,
      })),
    };

    return {
      success: true,
      data: {
        result: formattedResult,
        userName:
          attempt.user.username ||
          attempt.user.email?.split("@")[0] ||
          "Student",
      },
    };
  } catch (error) {
    console.error("getQuizResult error:", error);

    return {
      success: false,
      message: "Error while fetching quiz result!",
    };
  }
}

export async function getUserAttempts() {
  try {
    const loggedInUser = await dbUser();

    if (!loggedInUser) {
      return {
        success: false,
        message: "User is not logged in!",
        data: [],
      };
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId: loggedInUser.id,
      },
      include: {
        subject: {
          select: {
            id: true,
            subjectName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: attempts,
    };
  } catch (error) {
    console.error("getUserAttempts error:", error);

    return {
      success: false,
      message: "Unable to fetch scores.",
      data: [],
    };
  }
}