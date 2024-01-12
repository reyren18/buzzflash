import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetNewPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { useLayoutEffect } from "react";

const Home = () => {
  const {
    data: posts,
    isPending: isLoadingPosts,
    isError: isErrorPosts,
  } = useGetNewPosts();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold sm:h2-bold text-left w-full">Home Feed</h2>
          {isLoadingPosts && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-7 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.caption}>{<PostCard post={post}/>}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
