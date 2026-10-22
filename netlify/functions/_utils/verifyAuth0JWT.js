/**
 * 🔒 Utilitaire pour vérifier un JWT Auth0 dans une Netlify Function
 * Compatible RS256 avec téléchargement des clés via JWKS
 */

import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

// Client JWKS pour récupérer la clé publique à partir du kid
const client = jwksClient({
  jwksUri: 'https://dev-z5og82304fhuq1rx.eu.auth0.com/.well-known/jwks.json',
})

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, null)
    } else {
      const signingKey = key.getPublicKey()
      callback(null, signingKey)
    }
  })
}

export function verifyAuth0Token(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: 'https://pateuf-festival/api',
        issuer: 'https://dev-z5og82304fhuq1rx.eu.auth0.com/',
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      }
    )
  })
}