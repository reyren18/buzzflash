import {
  useDeleteSavePost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post? : Models.Document;
  userID: string;
};

const PostStats = ({ post, userID }: PostStatsProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id); // since the likes attribute is mapped to a user

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost} = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeletingPost } = useDeleteSavePost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.saves.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  // handleLikePost function should be an event which on clicking will trigger the likePost function, add userID to the likesList and do opposite if already liked
  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    let likesArray = [...likes];
    if (likesArray.includes(userID)) {
      likesArray = likesArray.filter((ID) => ID != userID);
    } else {
      likesArray.push(userID);
    }
    setLikes(likesArray);
    likePost({ postID: post?.$id || '', likesArray });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }

    savePost({ userID: userID, postID: post?.$id || '' });
    setIsSaved(true);
  };
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <img
          src={`${
            checkIsLiked(likes, userID)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          className="mr-2 cursor-pointer"
          onClick={(e) => {
            handleLikePost(e);
          }}
          width={20}
          height={20}
        />
        <p>{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingPost ? <Loader/>:
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />}
      </div>
    </div>
  );
};

export default PostStats;
