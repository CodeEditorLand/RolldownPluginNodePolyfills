import vm from 'node:vm'
import os from 'node:os'
import constants from 'node:constants'
import { rolldown } from 'rolldown'
import nodePolyfills from '../dist/index.cjs'
import { describe, test } from 'vitest'

const files = [
  'events.js',
  'crypto.js',
  'url-parse.js',
  'url-file-url-to-path.js',
  'url-format.js',
  'stream.js',
  'assert.js',
  'constants.js',
  'os.js',
  'path.js',
  'string-decoder.js',
  'zlib.js',
  'domain.js',
  'crypto.js'
]

describe('rollup-plugin-node-polyfills', function () {
  files.forEach(file => {
    test('works with ' + file, async () => {
      const bundle = await rolldown({
        input: 'test/examples/' + file,
        plugins: [nodePolyfills()]
      })
      const generated = await bundle.generate({ format: 'cjs' })
      const code = generated.output[0].code
      const script = new vm.Script(code)

      let done
      const p = new Promise(r => (done = r))
      const context = vm.createContext({
        done,
        global,
        setTimeout,
        clearTimeout,
        console,
        _constants: constants,
        _osEndianness: os.endianness()
      })
      context.self = context
      script.runInContext(context)
      await p
    })
  })

  // it('crypto option works (though is broken)', function (done) {
  //   rollup
  //     .rollup({
  //       input: 'test/examples/crypto-broken.js',
  //       plugins: [
  //         nodePolyfills({
  //           include: null,
  //           crypto: true
  //         })
  //       ]
  //     })
  //     .then(
  //       function () {
  //         done(new Error('should not get here'))
  //       },
  //       function (err) {
  //         if (
  //           err.message ===
  //           `"diffieHellman" is not exported by "\u0000polyfill-node.crypto.js", imported by "test/examples/crypto-broken.js".`
  //         ) {
  //           done()
  //           return
  //         }
  //         done(err)
  //       }
  //     )
  // })
})
