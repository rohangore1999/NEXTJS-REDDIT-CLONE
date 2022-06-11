import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

type Props = {
    // seed?:string >>> '?' means might be string or else
    seed?:string // for avatar based on string
    large?:boolean // if we need avator large in size for lg screen
}

// In typescript with props we have to define what props are..
function Avatar({seed,large}: Props) {
    const { data: session } = useSession()
    return (
        <div className={`relative h-10 w-10 rounded-full border-gray-300 bg-white overflow-hidden ${large && 'h-20 w-20'}`}>
            <Image src={`https://avatars.dicebear.com/api/open-peeps/${seed || session?.user?.name || 'placeholder'}.svg`} layout='fill' />
        </div>
    )
}

export default Avatar