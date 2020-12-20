import $ from 'jquery'

let challenge = null
let signature = null

export default {
  /**
   * Logs the user in by using single sign-off mechanism.
   *
   * @param web3
   * @param account
   * @param signRoute
   * @param authRoute
   * @param method
   * @param body
   * @returns {Promise<any>}
   */
  login({ web3, account, signRoute, authRoute, method, body }) {
    return generateSignature(web3, account, signRoute)
      .then(signature => authenticateWithSignature(signature, account, authRoute, method, body))
  },
}

/**
 * Fetch challenge from backend and generate signature based on it.
 *
 * @param web3
 * @param account
 * @param signRoute
 * @returns {Promise<any>}
 */
function generateSignature(web3, account, signRoute) {
  return new Promise((resolve, reject) => {
    console.log('Login with account', account)
    $.ajax({
      type: 'GET',
      url: 'http://localhost:8000' + signRoute + account,
      data: null,
      success: function (data) {
        console.log('Received response from login request...')

        challenge = data
        const from = account

        console.log(challenge)
        console.log(from)

        const params = [challenge, from]
        const method = 'eth_signTypedData'

        console.log('sign message')
        console.log(web3.currentProvider)
        web3.currentProvider.sendAsync(
          {
            method,
            params,
            from,
          },
          (err, result) => {
            console.log(result)
            if (err) {
              return console.error(err)
            }

            signature = result.result
            console.log('Generated signature', signature)

            if (result.error) {
              reject(result.error)
            }

            resolve(signature)
          },
        )
      },
    })
  })
}

/**
 * Authenticate user with generated signature. Will receive JWT token if authenticated successfully.
 *
 * @param signature
 * @param account
 * @param authRoute
 * @param method
 * @param body
 */
function authenticateWithSignature(signature, account, authRoute, method, body) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: method,
      url: 'http://localhost:8000' + authRoute + challenge[1].value + '/' + signature,
      data: body,
      success: function (res) {
        console.log('Received response:', res)
        if (res.user && res.user.address === account) {
          /*  console.log('JWT Token', res.token) */
          resolve(res)
        } else {
          reject(res)
        }
      },
    })
  })
}
