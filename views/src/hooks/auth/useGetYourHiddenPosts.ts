import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TPost } from "./useGetPosts";

function useGetYourHiddenPosts() {
  return useInfiniteQuery({
    queryKey: ["your-hidden-posts"],
    queryFn: async ({ pageParam = 1 }): Promise<THiddenPosts> => {
      return await axiosPrivateRoute.get(`/your-hidden-posts/${pageParam}`);
    },
    initialPageParam: 1,
    getNextPageParam: (_, page) => page.length + 1,
    refetchOnMount: false,
  });
}

export type THiddenPosts = {
  data: {
    hiddenPosts: [THiddenPost];
  };
};

export type THiddenPost = {
  createdAt: "2024-05-04T23:22:42.045Z";
  hiddenBy: "6630da627ab49348b40d3ca5";
  post: TPost;
  updatedAt: "2024-05-04T23:22:42.045Z";
  __v: 0;
  _id: "6636c342aceae7d7ce48dbdf";
};

export default useGetYourHiddenPosts;
