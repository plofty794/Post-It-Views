import useDeletePost from "@/hooks/auth/posts/useDeletePost";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetProfile from "@/hooks/auth/users/useGetProfile";
import useGetYourHiddenPosts from "@/hooks/auth/posts/useGetYourHiddenPosts";
import useGetYourSavedPosts from "@/hooks/auth/posts/useGetYourSavedPosts";
import useHidePost from "@/hooks/auth/posts/useHidePost";
import useSavePost from "@/hooks/auth/posts/useSavePost";
import useUnsavePost from "@/hooks/auth/posts/useUnsavePost";
import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import useVisitPost from "@/hooks/auth/posts/useVisitPost";
import EditPostDialog from "./EditPostDialog";

function PostDropdownMenu({
  username,
  postID,
}: {
  username: string;
  postID: string;
}) {
  const { data } = useGetProfile();
  const savedPostsData = useGetYourSavedPosts();
  const hiddenPostsData = useGetYourHiddenPosts();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={savedPostsData.isPending || hiddenPostsData.isPending}
        asChild
      >
        <Button
          disabled={savedPostsData.isPending}
          size={"sm"}
          variant={"ghost"}
          className="hover:!bg-stone-600 px-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" align="end">
        <DropdownMenuItem className="p-0">
          {savedPostsData.data?.pages
            .flatMap((page) => page.data.savedPosts)
            .find((savedPost) => savedPost.post?._id === postID) ? (
            <UnsavePost postID={postID} />
          ) : (
            <SavePost postID={postID} />
          )}
        </DropdownMenuItem>
        {username === data?.data.username && <EditPost postID={postID} />}
        {username !== data?.data.username && (
          <>
            <DropdownMenuItem className=" p-0">
              <HidePost postID={postID} />
            </DropdownMenuItem>
            <DropdownMenuItem className=" p-0">
              <Button
                size={"sm"}
                variant={"ghost"}
                className="w-full gap-2 text-xs !bg-transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                  />
                </svg>
                Report post
              </Button>
            </DropdownMenuItem>
          </>
        )}

        {username === data?.data.username && <DeletePost postID={postID} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EditPost({ postID }: { postID: string }) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useVisitPost(postID);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={isPending} asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="w-full text-xs gap-2 rounded-sm hover:!bg-[#1e293b]"
        >
          <PencilIcon className="size-4" />
          Edit post
        </Button>
      </DialogTrigger>
      <DialogContent className=" dark:text-white flex flex-col max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit post</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <EditPostDialog
            postID={postID}
            setOpen={setOpen}
            postTitle={data?.data.post.title}
            postContent={data?.data.post.body}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeletePost({ postID }: { postID: string }) {
  const deletePost = useDeletePost();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="w-full text-xs gap-2 rounded-sm hover:!bg-[#1e293b]"
        >
          <Trash2Icon className="size-5" />
          Delete post
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this post
            including comments, votes and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deletePost.mutate({ postID });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SavePost({ postID }: { postID: string }) {
  const { mutate, isPending } = useSavePost();

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate({ postID })}
      size={"sm"}
      variant={"ghost"}
      className="w-full gap-2 text-xs !bg-transparent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
      Save post
    </Button>
  );
}

function UnsavePost({ postID }: { postID?: string }) {
  const { mutate, isPending } = useUnsavePost();
  return (
    <Button
      disabled={isPending}
      onClick={() => mutate({ postID })}
      size={"sm"}
      variant={"ghost"}
      className="w-full gap-2 text-xs !bg-transparent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
        />
      </svg>
      Unsave post
    </Button>
  );
}

function HidePost({ postID }: { postID: string }) {
  const { mutate, isPending } = useHidePost();

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate({ postID })}
      size={"sm"}
      variant={"ghost"}
      className="w-full gap-2 text-xs !bg-transparent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
      Hide post
    </Button>
  );
}

export default PostDropdownMenu;
