import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { PhotographIcon, LinkIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutation'
import client from '../apollo-client'
import { GET_ALL_POST, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'


// defining the type of formData we needed
// this is the information which we are going to have in the form
type FormData = {
    postTitle: string
    postBody: string
    postImage: string
    subreddit: string
}

type Props = {
    subreddit?: string
}

function PostBox({ subreddit }: Props) {
    // session keys
    const { data: session } = useSession()

    // useMutation is the part of GRAPHQL as it means you needs to add delete data
    // here we are adding post so useMutation gives us function >> addPost
    const [addPost] = useMutation(ADD_POST, {
        refetchQueries: [//when ever we add the post it refetch and call getPostList query
            GET_ALL_POST,
            'getPostList'
        ]
    })

    // to add subreddit
    const [addSubreddit] = useMutation(ADD_SUBREDDIT)

    // for image
    const [imageBoxOpen, setImageBoxOpen] = useState(false)

    // useForm
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>()


    // when form submitted we will get the data
    const onSubmit = handleSubmit(async (formData) => {
        console.log(formData)

        // TO GET TOASTER 
        const notification = toast.loading('Creating new Post...')

        try {
            // query for the subreddit topic...
            // this point it will query the subreddit if they are exist
            const { data: { getSubredditListByTopic } } = await client.query({
                query: GET_SUBREDDIT_BY_TOPIC,
                variables: {
                    topic: subreddit || formData.subreddit
                }
            })

            // checking if the subreddit it exist using the length
            const subredditExist = getSubredditListByTopic.length > 0;

            if (!subredditExist) {
                // create subreddit...
                console.log("SUBREDDIT IS NEW! -> CREATING A NEW SUBREDDIT!")

                // adding subreddit which we getting from formData > subreddit field
                // getting the new Subreddit into data inside inserSubreddit and renaming as newSubreddit
                const { data: { insertSubreddit: newSubreddit } } = await addSubreddit({
                    variables: {
                        topic: formData.subreddit
                    }
                })

                console.log("Creating post...", formData)

                // if postImage which user pass is undefine tends to error that can through error so replace it with ''
                const image = formData.postImage || ''

                // getting our data into newPost
                const { data: { insertPost: newPost } } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: newSubreddit.id,
                        title: formData.postTitle,
                        username: session?.user?.name,
                    }
                })

                console.log("NEW POST added -> ", newPost)

            } else {
                // use existing subreddit...
                console.log("Using existing subreddit!")
                console.log(getSubredditListByTopic)

                // if postImage which user pass is undefine tends to error that can through error so replace it with ''
                const image = formData.postImage || ''

                // getting our data into newPost
                // to existing get subreddit id from existing getSubredditListByTopic[0].id
                const { data: { insertPost: newPost } } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: getSubredditListByTopic[0].id,
                        title: formData.postTitle,
                        username: session?.user?.name,
                    }
                })

                console.log("NEW POST added -> ", newPost)
            }

            // After the post has beed added!
            setValue('postBody', '')
            setValue('postImage', '')
            setValue('postTitle', '')
            setValue('subreddit', '')

            // after creating above it will show below messages
            toast.success("New Post Created!", {
                id: notification
            })

        } catch (error) {
            console.log(error)
            toast.error('Whoops something goes wrong', {
                id: notification
            })
        }
    })

    return (
        <form onSubmit={onSubmit} className='sticky top-16 z-50 bg-white border rounded-md border-gray-300 p-2'>
            <div className='flex items-center space-x-3'>
                {/* avatar */}
                <Avatar />

                <input
                    // connect to form
                    {...register('postTitle', { required: true })}
                    disabled={!session} className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none" type="text" placeholder={session ? subreddit ? `Create a post in r/${subreddit}` : 'Create a Post by entering title!' : 'Sign in to Post'} />

                <PhotographIcon onClick={() => setImageBoxOpen(!imageBoxOpen)} className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && ('text-blue-300')}`} />
                <LinkIcon className='h-6 text-gray-300' />

            </div>


            {/* watch('postTitle) >> it will watch the postTitle which we have connected in input field and when it is true it will show that div */}
            {/* !!watch('postTitle') >> !! means it will convert any value to true or false (boolean) */}
            {!!watch('postTitle') && (
                <div className='flex flex-col py-2'>
                    {/* body */}
                    <div className='flex items-center px-2'>
                        <p className='min-w-[90px]'>Body:</p>
                        <input className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('postBody')} type="text" placeholder='Text (Optional)' />
                    </div>

                    {/* subreddit */}
                    {!subreddit && (
                        <div className='flex items-center px-2'>
                            <p className='min-w-[90px]'>Subreddit:</p>
                            <input className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('subreddit', { required: true })} type="text" placeholder='i.e reactjs' />
                        </div>
                    )}


                    {/* if img is open */}
                    {
                        imageBoxOpen && (
                            <div className='flex flex-col py-2'>
                                <div className='flex items-center px-2'>
                                    <p className='min-w-[90px]'>Image URL:</p>
                                    <input className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('postImage')} type="text" placeholder='Optional...' />

                                </div>
                            </div>
                        )
                    }

                    {/* Error from FORM obj */}
                    {/* we check that if errors array length is greater that 0; means there is an error */}
                    {Object.keys(errors).length > 0 && (
                        <div className='space-y-2 py-2 text-red-500'>
                            {errors.postTitle?.type === 'required' && (
                                <p> - A Post Title is required</p>
                            )}

                            {errors.subreddit?.type === 'required' && (
                                <p> - A Subreddit is required</p>
                            )}
                        </div>
                    )}

                    {/* watch postTitle and if its true(!!) when user typed in it */}
                    {!!watch('postTitle') && (
                        <button className='w-full rounded-full bg-blue-400 text-white p-2'>
                            Create Post
                        </button>
                    )}

                </div>
            )
            }
        </form >
    )
}

export default PostBox