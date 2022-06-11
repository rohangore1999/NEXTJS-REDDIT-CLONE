import Image from 'next/image'
import React from 'react'
import { BeakerIcon, MenuIcon } from '@heroicons/react/solid'
import { StarIcon, BellIcon, ChatIcon, ChevronDownIcon, GlobeIcon, HomeIcon, PlusIcon, SearchIcon, SparklesIcon, SpeakerphoneIcon, VideoCameraIcon } from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'

function Header() {
    // to get session if we logged in

    // const { data: session } >> renaming data by session
    const { data: session } = useSession()
    return (
        <div className='flex bg-white px-4 py-2 shadow-sm sticky top-0 z-50 justify-center items-center'>
            {/* img */}
            {/* flex-shrink-0 >> when we shrink window size never want image to shrink */}
            <div className='relative h-10 w-20 flex-shrink-0 cursor-pointer'>
                {/* as layout is fill will capture entire screen so we made above div as relative to it will take that div only */}
                <Image src={'https://links.papareact.com/fqy'} layout="fill" objectFit='contain' />
            </div>


            {/* icons */}
            <div className='flex items-center mx-7 xl:min-w-[300px]'>
                <HomeIcon className='h-5 w-5' />
                <p className='flex-1 ml-2 hidden lg:inline'>Home</p>
                <ChevronDownIcon className='h-5 w-5' />
            </div>


            {/* Search box */}
            <form className='flex flex-1 items-center space-x-2 border border-gray-200 rounded-sm bg-gray-100 px-3 py-1'>
                <SearchIcon className='h-6 w-6 text-gray-400' />
                <input placeholder='Search Reddit' className='flex flex-1 outline-none bg-transparent' />
                {/* its hidden and when submit value submit */}
                <button type='submit' hidden />
            </form>


            {/* right Icons */}
            <div className='text-gray-500 space-x-2 items-center hidden lg:inline-flex mx-5'>
                <SparklesIcon className='icon' />
                <GlobeIcon className='icon' />
                <VideoCameraIcon className='icon' />

                <hr className='h-10 border border-gray-100' />

                <ChatIcon className='icon' />
                <BellIcon className='icon' />
                <PlusIcon className='icon' />
                <SpeakerphoneIcon className='icon' />
            </div>

            <div className='ml-5 flex items-center lg:hidden text-gray-500'>
                <MenuIcon className='icon' />
            </div>


            {/* sign in/out */}
            {session ? (
                // if we already signed in then signout logic below
                <div className='hidden lg:flex items-center space-x-2 border-gray-100 p-2 cursor-pointer' onClick={() => signOut()}>
                    <div className='relative h-5 w-5 flex-shrink-0'>
                        <Image src='https://links.papareact.com/23l' alt="" layout='fill' objectFit='contain' />
                    </div>

                    <div className='flex-1 text-xs'>
                        <p className='truncate'>{session?.user?.name}</p>
                        <p className='text-gray-400'>1 Karma</p>
                    </div>

                    <ChevronDownIcon className='h-5 flex-shrink-0 text-gray-400' />
                </div>

            ) : (
                // if we already signed out then signin logic below
                <div className='hidden lg:flex items-center space-x-2 border-gray-100 p-2 cursor-pointer' onClick={() => signIn()}>
                    <div className='relative h-5 w-5 flex-shrink-0'>
                        <Image src='https://links.papareact.com/23l' alt="" layout='fill' objectFit='contain' />
                    </div>

                    <p className='text-gray-400'>Sign In</p>
                </div >
            )
            }

        </div >
    )
}

export default Header
