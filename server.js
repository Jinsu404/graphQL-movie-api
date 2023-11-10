import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let tweets = [
  {
    id: "1",
    text: "first",
    userId: "1",
  },
  {
    id: "2",
    text: "second",
    userId: "2",
  },
];

let users = [
  {
    id: "1",
    firstName: "kim",
    lastName: "chi",
  },
  {
    id: "2",
    firstName: "park",
    lastName: "chisung",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    """
    fullName = firstName + lastName
    """
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allMovie: [Movie]
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Int!
    summary: String!
    description_full: String!
    synopsis: String!
    language: String!
    mpa_rating: String!
    background_image: String!
    large_cover_image: String!
    state: String!
    genres: [String]!
  }
`;

const resolvers = {
  Query: {
    allUsers() {
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    async allMovie() {
      const res = await fetch("https://yts.mx/api/v2/list_movies.json");
        const json = await res.json();
        return json.data.movies;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`running on ${url}`);
});
