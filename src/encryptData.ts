import atob from 'atob'
import btoa from 'btoa'
import { createMessage, encrypt, readKey } from 'openpgp'

// Object to be encrypted
interface CardDetails {
  // required when storing card details
  number?: string
  // required when cardVerification is set to cvv
  cvv?: string
}

// Encrypted result
interface EncryptedValue {
  encryptedData: string
  keyId: string
}

/**
 * Encrypt card data function
 */
export async function encryptSensibleData(
  dataToEncrypt: CardDetails,
  publicKey: string,
  keyId: string
): Promise<EncryptedValue> {
  const rawPublicKey = atob(publicKey)
  const decodedPublicKey = await readKey({ armoredKey: rawPublicKey })
  const message = await createMessage({ text: JSON.stringify(dataToEncrypt) })
  const encryptedMessage = await encrypt({
    message,
    encryptionKeys: decodedPublicKey
  })

  const encodeData = btoa(encryptedMessage as string)

  return {
    encryptedData: encodeData,
    keyId
  }
}
