import { useQuery } from '@apollo/client'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Feed from '../components/Feed'
import Header from '../components/Header'
import PostBox from '../components/PostBox'
import SubredditRow from '../components/SubredditRow'
import { GET_SUBREDDIT_WITH_LIMIT } from '../graphql/queries'

const Home: NextPage = () => {
  const {data} = useQuery(GET_SUBREDDIT_WITH_LIMIT,{
    variables:{
      limit: 10
    }
  })

  // getting subreddit from queried data
  const subreddits: Subreddit[] = data?.getSubredditListLimit

  return (
    <div className='max-w-5xl my-7 mx-auto'>
      <Head>
        <title>Reddit - Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />

        {/* for post picture */}
        <meta property="og:title" content="" />
        <meta property="og:type" content="" />
        <meta property="og:image" content="/reddit.png" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:description" content="" />
        <meta name="twitter:image:alt" content="" />
      </Head>

      {/* postbox component */}
      <PostBox />

      <div className='flex'>
        {/* feed component */}
        <Feed />

        <div className='sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline'>
          <p className='text-md mb-1 p-4 pb-3 font-bold'>Top Communities</p>

          <div className=''>
            {/* List Subreddits 10 limit */}
            {subreddits?.map((subreddit,i)=>(
              <SubredditRow key={subreddit.id} topic={subreddit.topic} index={i} />
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

export default Home
