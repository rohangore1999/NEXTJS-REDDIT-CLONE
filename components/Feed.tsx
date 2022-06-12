import { useQuery } from '@apollo/client'
import React from 'react'
import { GET_ALL_POST, GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries'
import Post from './Post'

type Props = {
    topic?: string
}
function Feed({ topic }: Props) {
    console.log(topic)
    // getting all the post using useQuery
    const { data, error } = !topic ? useQuery(GET_ALL_POST) : useQuery(GET_ALL_POSTS_BY_TOPIC, {
        variables: {
            topic: topic
        }
    })

    console.log(data)
    // posts: Post[] (hover) >> as we have declase what to be expect in :Post[] in typing.d.ts file
    const posts: Post[] = !topic ? data?.getPostList : data?.getPostListByTopic

    return (
        <div className='mt-5 space-y-4'>
            {posts?.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    )
}

export default Feed