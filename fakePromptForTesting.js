

module.exports = {
  fakePrompt: () => Promise.resolve(( '1,0.05,1' + ',0,1'.repeat(500) ).split(','))
}
