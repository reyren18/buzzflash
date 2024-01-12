import {useQuery, useMutation, useInfiniteQuery, useQueryClient} from '@tanstack/react-query'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '../types'
import { createNewPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostByID, getRecentPosts, getUserById, getUsers, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost, updateUser } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys';

export const useCreateUserAccount = () => { 
    return useMutation({
        mutationFn: (user:INewUser) => createUserAccount(user),
    });
}

export const useSignInAccount = () => { 
    return useMutation({
        mutationFn: (user:{email: string, password: string}) => signInAccount(user),
    });
}

export const useSignOutAccount = () => { 
    return useMutation({
        mutationFn: signOutAccount,
    });
}

export const useCreatePost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createNewPost(post),
        onSuccess: () =>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS] // invalidating the query so that new posts can be fetched instead of posts from cache
            })
        }
    })
}

export const useGetNewPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({postID, likesArray}: {postID: string, likesArray: string[]}) => likePost(postID, likesArray),
        onSuccess: (data) => {
            // since react query caches our data, we need to invalidate the old one so that the new and updated data gets reflected
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id] 
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({userID, postID}: {userID: string, postID: string}) => savePost(userID, postID),
        onSuccess: () => {
            // since react query caches our data, we need to invalidate the old one so that the new and updated data gets reflected
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
        }
    })
}

export const useDeleteSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (savedRecordID:string) => deleteSavedPost(savedRecordID),
        onSuccess: () => {
            // since react query caches our data, we need to invalidate the old one so that the new and updated data gets reflected
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
        }
    })
}



export const useGetPostById = (postID: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postID],
        queryFn: () => getPostByID(postID),
        enabled: !!postID
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({postID, imageID}: {postID: string | undefined, imageID: string }) => deletePost(postID, imageID),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        // @ts-ignore
        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage?.documents[lastPage?.documents.length-1].$id;
            return lastId;
        }
    })
}

export const useSearchPost = (searchTerm: string) => {
    return useQuery ({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm // automaticall enabled when search term changed 
    })
}

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser,
    });
  };
  
  export const useGetUsers = (limit?: number) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USERS],
      queryFn: () => getUsers(limit),
    });
  };
  
  export const useGetUserById = (userId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    });
  };
  
  export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (user: IUpdateUser) => updateUser(user),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
        });
      },
    });
  };