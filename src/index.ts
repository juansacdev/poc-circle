import 'dotenv/config'
import express from 'express'
import { encryptSensibleData } from './encryptData'
import { makeRequest } from './fetch'
import { logger } from './logger'
import { createConnection } from './mongo'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT

app.post('/cards', async (req, res) => {
  try {
    const { body } = req
    // Tokenize card
    const response = await makeRequest('/v1/cards', 'POST', body)
    if (!response) throw new Error('No fetch')

    const { data } = await response.json()

    const db = await createConnection()

    const cardCollection = db.collection('cards')
    const doc = await cardCollection.insertOne({ data })

    res.json({ doc, data })
  } catch (error) {
    res.status(500).json(error)
  }
})

app.get('/encryption', async (_req, res) => {
  try {
    const response = await makeRequest('/v1/encryption/public', 'GET')
    if (!response) throw new Error('No fetch')

    const { data: publicDataFromCircle } = await response.json()

    const encryptData = await encryptSensibleData(
      { cvv: '123', number: '4007410000000006' },
      publicDataFromCircle.publicKey,
      publicDataFromCircle.keyId
    )

    return res.json({ data: { ...encryptData }, publicDataFromCircle })
    // Mandar data (no sensible) de la card de usuario y el keyId y el encryptedData que se recibio de la API Circle
    // Enviar todo esto a nuestro back para que procedamos a crear la tarjeta / Metodo de pago
  } catch (error) {
    res.status(500).json(error)
  }
})

app.listen(port, () => logger.info('Server Running!'))

// endpoints:
// * 1. que simule lo que haria el front, encryptar la data sensible
// * 2. Tokenizacion con lo que mande el front
// * 3. checkear status de la verificacion
// * 4. pagos
// * 5. checkear el status del pago
// * 6. anular un pago

// * Validar si puedo ejecutar otro pago a la card guardada anteriormente
