const { validateToken } = require('../services/authentication.js')

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies?.[cookieName]

    if (!tokenCookieValue) {
      return next(); // ✅ return is CRITICAL
    }

    try {
      const userPayload = validateToken(tokenCookieValue)
      req.user = userPayload
    } catch (error) {
      // optional: clear invalid cookie
      res.clearCookie(cookieName)
    }

    return next(); // ✅ only once
  }
}

module.exports = {
  checkForAuthenticationCookie,
}
