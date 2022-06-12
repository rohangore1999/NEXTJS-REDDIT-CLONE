// in GRAPHQL we have Mutation and Query.
// Ṃutation means to insert data and Query to query the data

// Here we are creating the query MyQuery to get the data by passing topic and to return "id topic created_at"

import { gql } from "@apollo/client";

export const GET_SUBREDDIT_BY_TOPIC = gql`
    query MyQuery($topic: String!){
        getSubredditListByTopic(topic:$topic) {
            id
            topic
            created_at
        }
    }
`