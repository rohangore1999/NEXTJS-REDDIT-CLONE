// in GRAPHQL we have Mutation and Query.
// Ṃutation means to insert data and Query to query the data

// here we are making muation to insertpost >>  ADD_POST which we will be using in the PostBox.tsx to insert the PostTitle, PostBody...

// insertPost(
//     body: $body 
//     image: $image
//     $subreddit_id:$$subreddit_id
//     title:$title
//     username:$username   
//    ) {  <<< this is the data which we want to return
//        body
//        created_at
//        id
//        image
//        subreddit_id
//        title
//        username
//    }

import { gql } from "@apollo/client";

export const ADD_POST = gql`
    mutation MyMutation(
        $body:String!
        $image:String!
        $subreddit_id:ID!
        $title:String!
        $username:String!
    ) {
        insertPost(
         body: $body 
         image: $image
         subreddit_id:$subreddit_id
         title:$title
         username:$username   
        ) {
            body
            created_at
            id
            image
            subreddit_id
            title
            username
        }
    }
`


export const ADD_SUBREDDIT = gql`
    mutation MyMutation($topic: String!) {
        insertSubreddit(topic: $topic) {
            id
            topic
            created_at
        }
    }
`