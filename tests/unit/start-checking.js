var lolex = require('lolex')
var simple = require('simple-mock')
var test = require('tape')

var startChecking = require('../../lib/start-checking')

test('startChecking() with interval & 200 response', function (t) {
  t.plan(2)

  var clock = lolex.install(0)
  var emitter = {emit: function () {}}

  var state = {
    method: 'HEAD',
    url: 'https://example.com/ping',
    emitter: emitter
  }

  simple.mock(startChecking.internals, 'check').callFn(function () {
    return { then: function (success) { success() } }
  })

  startChecking(state, {
    interval: 1000
  })

  t.ok(state.interval, 'state.interval is set')
  clock.tick(2000)
  t.is(startChecking.internals.check.callCount, 2, '2 requests sent')

  clearTimeout(state.interval)
  simple.restore()
  clock.uninstall()
})

test('startChecking() with interval & 500 error response', function (t) {
  t.plan(2)

  var clock = lolex.install(0)
  var emitter = {emit: function () {}}

  var state = {
    method: 'HEAD',
    url: 'https://example.com/ping',
    emitter: emitter
  }

  simple.mock(startChecking.internals, 'check').callFn(function () {
    return { then: function (success, error) { error() } }
  })

  startChecking(state, {
    interval: 1000
  })

  t.ok(state.interval, 'state.interval is set')
  clock.tick(2000)
  t.is(startChecking.internals.check.callCount, 2, '2 requests sent')

  clearTimeout(state.interval)
  simple.restore()
  clock.uninstall()
})


test('options.interval.connected & options.interval.disconnected', function (t) {
  t.plan(2)

  var clock = lolex.install(0)
  var emitter = {emit: function () {}}

  var state = {
   method: 'HEAD',
   url: 'https://example.com/ping'
  }

  simple.mock(startChecking.internals, 'check').callFn(function () {
   return { then: function (success) { success() } }
  })

  startChecking(state, {
   interval: { connected: 30000, disconnected: 3000 }
  })

  t.ok(state.interval, 'state.interval is set')
  clock.tick(70000)
  t.is(startChecking.internals.check.callCount, 2, '2 requests sent')

  clearTimeout(state.interval)
  simple.restore()
  clock.uninstall()
})

test.only('options.interval.connected & options.interval.disconnected', function (t) {
  t.plan(2)

  var clock = lolex.install(0)
  var emitter = {emit: function () {}}

  var state = {
   method: 'HEAD',
   url: 'https://example.com/ping'
  }

  simple.mock(startChecking.internals, 'check').callFn(function () {
   return { then: function (success) { success() } }
  })

  simple.mock(startChecking.internals, 'ok', false);

  startChecking(state, {
   interval: { connected: 30000, disconnected: 3000 }
  })

  t.ok(state.interval, 'state.interval is set')
  clock.tick(7000)
  t.is(startChecking.internals.check.callCount, 2, '2 requests sent')

  clearTimeout(state.interval)
  simple.restore()
  clock.uninstall()
})

