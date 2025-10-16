"use server";

import { auth } from "@/lib/auth";
import type { CreateProjectType, ProjectType } from "@/lib/types";
import { db } from "@/server/db";
import { headers } from "next/headers";

/**
 * CreateProject function
 * GetProject function
 */

const checkSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  return session;
};

export const createProjectInDb = async (project: CreateProjectType) => {
  //check user session

  try {
    const session = await checkSession();

    const createdProject = await db.project.create({
      data: {
        name: project.name ?? "Untitled Project",
        imageUrl: project.imageUrl,
        imageKitId: project.imageKitId,
        filePath: project.filePath,
        userId: session.user.id,
      },
    });
    return { success: true, data: createdProject };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const getUserProjects = async () => {
  try {
    const session = await checkSession();

    const projects: ProjectType[] = await db.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: projects };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const deductCredits = async (
  creditToDeduct: number,
  operation: string | undefined,
) => {
  try {
    if (!creditToDeduct || creditToDeduct <= 0 || !Number(creditToDeduct)) {
      return { success: false, error: "Invalid credit to deduct" };
    }

    const session = await checkSession();

    // First check if user has enough credits
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.credits < creditToDeduct) {
      return { success: false, error: "Insufficient credits" };
    }

    // Deduct the specified amount of credits
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditToDeduct } },
      select: { credits: true },
    });

    return { success: true, remainingCredits: updatedUser.credits };
  } catch (error) {
    console.error("Error deducting credits for " + operation || "");

    return { success: false, error: "Failed to deduct credits" };
  }
};

//kalo errornya custom kita bikin if, kalo yg official throw new Error
