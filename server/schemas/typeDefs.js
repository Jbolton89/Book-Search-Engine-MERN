const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID
        email: String!
        username: String!  
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    input BookInput {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        title: String!
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }


    type Query {
        me: User
      }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): User
        saveBook(input: BookInput): User
        removeBook(bookId: String): User
      }`;

    module.exports = typeDefs;