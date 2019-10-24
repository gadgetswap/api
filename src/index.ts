const { MONGO_URI, PORT } = process.env

import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import { connect } from 'mongoose'
import { buildSchema } from 'type-graphql'
import { Container } from 'typedi'

import { authChecker, getUser } from './auth'
import { resolvers } from './resolvers'
import { Context } from './types'

const main = async (): Promise<void> => {
  await connect(
    MONGO_URI as string,
    {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )

  const schema = await buildSchema({
    authChecker,
    container: Container,
    dateScalarMode: 'isoDate',
    resolvers
  })

  const server = new ApolloServer({
    async context({ req }): Promise<Context> {
      const user = await getUser(req)

      return {
        user
      }
    },
    schema
  })

  await server.listen({
    port: Number(PORT)
  })

  console.log(`Running on ${PORT}`)
}

main()
