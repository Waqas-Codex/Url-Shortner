import { getCurrentUser } from "../api/user.api";


export const userQueryOptions = {
  queryKey: ["currentUser"],
  queryFn: getCurrentUser,
};