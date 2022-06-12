import { ArrowDownIcon, ArrowUpIcon, BookmarkIcon, ChatAltIcon, DotsHorizontalIcon, GiftIcon, ShareIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { Jelly } from "@uiball/loaders"
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries'
import { ADD_VOTE } from '../graphql/mutation'

type Props = {
    post: Post
}

function Post({ post }: Props) {
    // get user session
    const { data: session } = useSession()

    // to get votes
    const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
        variables: {
            post_id: post?.id
        }
    })

    // to add votes
    const [addVotes] = useMutation(ADD_VOTE, {
        refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getVotesByPostId']
    })

    // intiallyundefine
    const [vote, setVote] = useState<boolean>()


    useEffect(() => {
        const votes: Vote[] = data?.getVotesByPostId

        // latest vote (as we sorted by newly created first in sql query)

        // finding the vote which are equal or giveing by user who logged in
        const vote = votes?.find((vote) => vote.username == session?.user?.name)?.upvote

        setVote(vote)

    }, [data])





    const upVote = async (isUpvote: boolean) => {
        // true -> voted up
        // false -> voted down
        // undefine -> havent voted yet
        if (!session) {
            toast("!You'll need to sign in to Vote")
            return
        }

        // if already voted and again trying to vote then stop/return
        if (vote && isUpvote) return

        // if already voted as down/false and again trying to downvote/!upvote then stop/return
        if (vote === false && !isUpvote) return

        console.log(".. you are voting")


        // vote happening
        await addVotes({
            variables: {
                post_id: post.id,
                username: session?.user?.name,
                upvote: isUpvote,
            }
        })

    }

    const displayVote = (data: any) => {
        const votes: Vote[] = data?.getVotesByPostId
        const displayNumber = votes?.reduce(
            (total, vote) => (vote.upvote ? (total += 1) : (total -= 1))
            , 0)
        // if no vote then return 0
        if (votes?.length === 0) return 0

        // if current vote is 0 then check for last recent vote and if it is positive then make 1 or -1 for negative
        if (displayNumber === 0) {
            return votes[0]?.upvote ? 1 : -1
        }

        return displayNumber
    }

    // while fetching data show loader
    if (!post)
        return (
            <div className='flex w-full items-center justify-center p-10 text-xl'>
                <Jelly size={50} color="#FF4501" />
            </div>
        )

    return (
        <Link href={`/post/${post.id}`}>
            <div className='flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600'>
                {/* VOtes */}
                <div className='flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400'>
                    <ArrowUpIcon onClick={() => upVote(true)} className={`voteButtons hover:text-blue-400 ${vote && 'text-blue-400'}`} />
                    <p className='text-black font-bold text-xs'>{displayVote(data)}</p>
                    <ArrowDownIcon onClick={() => upVote(false)} className={`voteButtons hover:text-red-400 
                    ${vote === false && 'text-red-400'}`} />
                </div>

                {/* Body */}
                <div className='p-3 pb-1'>
                    {/* header */}
                    <div className='flex items-center space-x-2'>
                        <Avatar seed={post.subreddit[0]?.topic} />
                        <p className='text-xs text-gray-400'>
                            <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
                                <span className='font-bold text-black hover:text-blue-400 hover:underline'>r/{post.subreddit[0]?.topic}</span>
                            </Link>
                            • Posted by u/{post.username} <TimeAgo date={post.created_at} />

                        </p>
                    </div>

                    {/* body */}
                    <div className='py-4'>
                        <h2 className='text-xl font-semibold'>{post.title}</h2>
                        <p className='mt-2 text-sm font-light'>{post.body}</p>
                    </div>

                    {/* image */}
                    <img className='w-full' src={post.image} />

                    {/* footer */}
                    <div className='flex space-x-4 text-gray-400'>
                        <div className='postButtons'>
                            <ChatAltIcon className='h-6 w-6' />
                            <p className=''>{post.comments.length} Comments</p>
                        </div>

                        <div className='postButtons'>
                            <GiftIcon className='h-6 w-6' />
                            <p className='hidden sm:inline'>Award</p>
                        </div>

                        <div className='postButtons'>
                            <ShareIcon className='h-6 w-6' />
                            <p className='hidden sm:inline'>Share</p>
                        </div>

                        <div className='postButtons'>
                            <BookmarkIcon className='h-6 w-6' />
                            <p className='hidden sm:inline'>Save</p>
                        </div>

                        <div className='postButtons'>
                            <DotsHorizontalIcon className='h-6 w-6' />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Post