import { redirect } from "@tanstack/react-router";
import { queryClient } from "../lib/queryClient";
import { userQueryOptions } from "../utils/user.query";

export const checkAuth = async () => {
  try {
    await queryClient.ensureQueryData(userQueryOptions);
  } catch (error) {
    throw redirect({ to: "/auth" });
  }
};