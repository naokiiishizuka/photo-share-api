const { ApolloServer } = require("apollo-server")

const typeDefs = `
    schema {
        query: Query
        mutation: Mutation
    }

    type Query {
        totalPhotos: Int!
        allPhotos: [Photo!]!
        totalUsers: Int!
        allUsers: [User!]!
    }

    type Mutation {
        postPhoto(name: String!, description: String): Photo!
    }

    scalar DateTime

    enum PhotoCategory {
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
    }

    type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedPhotos: [Photo!]!
    }

    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        created: DateTime!
        category: PhotoCategory!
        postedBy: User!
    }
`
var _id = 0
var photos = []

const resolvers = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: () => photos
    },

    Mutation: {
        postPhoto(parent, args) {
            var newPhoto = {
                id: _id++,
                ...args
            }

            photos.push(newPhoto)

            return newPhoto
        }
    },

    Photo: {
        url: parent => `http://yoursite.com/img/${parent.id}.jpg`
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => console.log(`GraphQL Service runninng on ${url}`))
