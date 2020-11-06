const { GraphQLServer } = require('graphql-yoga')
const {PrismaClient}    = require('@prisma/client')
//TODO: Add a query for book based on the genre
const prisma = new PrismaClient();

const typeDefs = `
 type Author {
     id: Int
     name: String
     books: [Book]
 }

 type Book {
    id: Int
    title: String
    genre: String
    author: Author
 }

  type Query {
    authors: [Author],
    books: [Book], 
  }

  type Mutation {
    addAuthor(name: String!): Author,
    addAuthorConnectToBook(name: String!, title: String, genre: String, bookId: Int): Author,
    addBook(title: String!, genre: String): Book,
  }
`

const resolvers = {
  Query: {
    authors: async (parent, args, context) => {
        return await context.prisma.author.findMany()
    },
    books: async (parent, args, context) => {
        return await context.prisma.book.findMany();
    }
  },
  Mutation: {
    addAuthorConnectToBook: async (parent, args, context, info) => {
        const newAuthor = await context.prisma.author.create({
            data: {
                name: args.name,
                //Look into how the author id is getting set to the book id
                book: {
                    connect: {
                     id: args.bookId
                    },
                },
            },
        })
        return newAuthor;
    },
        addAuthor: async (parent, args, context, info) => {
        const newAuthor = await context.prisma.author.create({
            data: {
                name: args.name
            },
        })
        return newAuthor;
    },
    addBook: async (parent, args, context, info) => {
        const newBook = await context.prisma.book.create({
            data: {
                title: args.title,
                genre: args.genre,
            },
        })
        return newBook;
    }

  }
}

const server = new GraphQLServer({ typeDefs, resolvers, context: {prisma,}});

server.start(() => console.log('Server is running on localhost:4000 🚀'))