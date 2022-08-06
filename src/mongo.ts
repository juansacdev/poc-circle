import 'dotenv/config'
import { MongoClient } from 'mongodb'
import { logger } from './logger'

const mongoURI = process.env.MONGO_URI || ''

export async function createConnection() {
  const mongoClient = new MongoClient(mongoURI)

  const client = await mongoClient.connect()

  client.once('connectionCreated', () =>
    logger.info('[mongodb]: Connection Opened')
  )

  client.once('connectionReady', () =>
    logger.info('[mongodb]: Client connection ready')
  )

  client.once('connectionClosed', () =>
    logger.info('[mongodb]: Client was disconnected')
  )

  const db = client.db('test')

  return db
}
