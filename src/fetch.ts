import 'dotenv/config'
import { logger } from './logger'

const circleApiKey = process.env.CIRCLE_API_KEY
const circleUrl = process.env.CIRCLE_URL
type VerbHTTP = 'GET' | 'POST'

export async function makeRequest(
  endpoint: string,
  verbHTTP: VerbHTTP,
  body?: unknown
) {
  try {
    return fetch(`${circleUrl}${endpoint}`, {
      method: verbHTTP,
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${circleApiKey}`
      }
    })
  } catch (error) {
    logger.error(`[fetch]: ${error}`)
  }
}
