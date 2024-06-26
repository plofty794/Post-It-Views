import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentID }: { commentID: string }) => {
      return await axiosPrivateRoute.delete(
        `/comments/delete-comment/${commentID}`
      );
    },
    onSuccess(data) {
      toast.success(data.data.message);
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-saved-posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-hidden-posts"],
        refetchType: "all",
      });
    },
  });
}

export default useDeleteComment;
