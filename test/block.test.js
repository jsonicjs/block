

const { Jsonic } = require('jsonic')
const { Block } = require('../block')


const j = Jsonic.make().use(Block)


describe('block', () => {

  test('happy', () => {
    expect(j('{"a":1}')).toEqual({ a: 1 })
    console.log('PO',j.options.plugin)
  })

})
