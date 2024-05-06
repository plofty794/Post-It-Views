import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useQuery } from "@tanstack/react-query";
import { TUserData } from "./useGetUser";

function useGetProfile() {
  return useQuery({
    queryKey: ["your-profile"],
    queryFn: async (): Promise<TUserData> => {
      return await axiosPrivateRoute.get("/me");
    },
    enabled: localStorage.getItem("token") != null,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export default useGetProfile;