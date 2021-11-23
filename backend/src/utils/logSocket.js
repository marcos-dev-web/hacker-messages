/**
 * beautiful log
 * @param {string} message message to log
 * @param {("new"|"disconnect"|"message")} type type of log
 * @param {("+"|"-"|"!"|"@"|"#"|"*"|"_")} symbol symbol
 */
function logSocket(message = "", type = "", symbol = "+") {
  switch (type) {
    case "disconnect":
      return console.log(
        `\x1b[1;31m[\x1b[1;37m${symbol}\x1b[1;31m] \x1b[1;37mUSER DISCONNECTED: \x1b[1;37m${message}\x1b[0m`
      );
    case "new":
      return console.log(
        `\x1b[1;32m[\x1b[1;37m${symbol}\x1b[1;32m] \x1b[1;37mUSER CONNECTED: \x1b[1;36m${message}\x1b[0m`
      );
    case "message":
      return console.log(
        `\x1b[1;32m[\x1b[1;37m${symbol}\x1b[1;32m] \x1b[1;37mMESSAGE: \x1b[1;36m${message}\x1b[0m`
      );
  }
}

module.exports = { logSocket };
