const { GraphQLServer } = require('graphql-yoga')
const {PrismaClient}    = require('@prisma/client')

const prisma = new PrismaClient();
const typeDefs = `
  type Query {
    
  }
`

const resolvers = {
  Query: {
    
  }
}

const server = new GraphQLServer({ typeDefs, resolvers, context: {prisma} })

server.start(() => console.log('Server is running on localhost:4000 🚀'))