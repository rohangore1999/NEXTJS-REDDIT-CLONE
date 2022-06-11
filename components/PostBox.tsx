import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { PhotographIcon, LinkIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'


// defining the type of formData we needed
// this is the information which we are going to have in the form
type FormData = {
    postTitle: string
    postBody: string
    postImage: string
    subreddit: string
}

function PostBox() {
    // session keys
    const { data: session } = useSession()

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



    return (
        <form className='sticky top-16 z-50 bg-white border rounded-md border-gray-300 p-2'>
            <div className='flex items-center space-x-3'>
                {/* avatar */}
                <Avatar />

                <input
                    // connect to form
                    {...register('postTitle', { required: true })}
                    disabled={!session} className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none" type="text" placeholder={session ? 'Create a Post by entering title!' : 'Sign in to Post'} />

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
                    <div className='flex flex-col py-2'>
                        {/* body */}
                        <div className='flex items-center px-2'>
                            <p className='min-w-[90px]'>Subreddit:</p>
                            <input className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('subreddit')} type="text" placeholder='i.e reactjs' />
                        </div>
                    </div>

                    {/* if img is open */}
                    {
                        imageBoxOpen && (
                            <div className='flex flex-col py-2'>
                                {/* body */}
                                <div className='flex items-center px-2'>
                                    <p className='min-w-[90px]'>Image URL:</p>
                                    <input className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('postImage')} type="text" placeholder='Optional...' />
                                </div>
                            </div>
                        )
                    }

                </div>
            )}
        </form>
    )
}

export default PostBox