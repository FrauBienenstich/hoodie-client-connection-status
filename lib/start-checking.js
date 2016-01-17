module.exports = startChecking

var internals = module.exports.internals = {}
internals.check = require('./check')

function startChecking (state, options) {
  options = parse(options)
  handleInterval(state, options)
}

function handleInterval (state, options) {
  // state looks like this: { method: 'HEAD', url: 'https://example.com/ping' }
  // options: { interval: { connected: 1000, disconnected: 1000 } }
  if (options.interval) {
    var interval = options.interval
    // we use setTimeout on purpose, we don't want to send requests each
    // x seconds, but rather set a timeout for x seconds after each response
    // but we use `interval` as variable as the effect is the same
    function checkInterval () {
      var checkAgain = handleInterval.bind(null, state, options)
      internals.check(state, options).then(checkAgain, checkAgain)
    }

    state.interval = setTimeout(checkInterval, interval)
  }
}

function parse (options) {
  // options look like this:
  // { interval: { connected: 1000, disconnected: 1000 } }
  if (!options) {
    return {}
  }
  if (typeof(options) === 'object'){
     options.interval = options.interval.connected;
  }
  if (!isNaN(options))
    console.log("Options is a number")


  return options
}
