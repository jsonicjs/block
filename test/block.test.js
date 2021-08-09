

const { Jsonic } = require('jsonic')
const { Block } = require('../block')


const j = Jsonic.make().use(Block)


describe('block', () => {

  test('happy', () => {
    expect(j('{"a":1}')).toEqual({ a: 1 })

    expect(j.options.plugin.Block).toEqual({marker: { "'''": "'''" }})

    expect(j(`{a:'''foo'''}`)).toEqual({ a: 'foo' })

    expect(j(`{a:\n'''\nfoo\nbar\n'''}`)).toEqual({ a: 'foo\nbar' })

    expect(j(`
{
  a: '''
  foo\t
    bar\t
  '''
}
`)).toEqual({ a: 'foo\t\n  bar\t' })
  })


  test('multiple', () => {
    const jm = Jsonic.make().use(Block, {
      marker: {
        '#<': '>#',
        '{{': '}}',
        "'''": null, // Turns off '''
      }
    })
    
    expect(jm('{"a":1}')).toEqual({ a: 1 })

    expect(jm.options.plugin.Block).toEqual({marker: {
      '#<': '>#',
      '{{': '}}',
      "'''": null,
    }})

    expect(jm(`{a:#<foo>#}`)).toEqual({ a: 'foo' })
    expect(jm(`{b:{{bar}}}`)).toEqual({ b: 'bar' })
    expect(jm(`{a:#<foo>#, b:{{bar}}}`)).toEqual({ a: 'foo', b: 'bar' })
    expect(jm(`{a:#<\nfoo\n>#, b:{{  \n  bar\n   }}}`))
      .toEqual({ a: 'foo', b: 'bar' })
  })

  
  
  test('point', () => {
    expect(()=>j(`{a:'''foo''']`)).toThrow(/unexpected.*:1:13/s)
    expect(()=>j(`{a:\n'''foo''']`)).toThrow(/unexpected.*:2:10/s)
    expect(()=>j(`{a:\n'''\nfoo''']`)).toThrow(/unexpected.*:3:7/s)
    expect(()=>j(`{a:\n'''\nfoo\n''']`)).toThrow(/unexpected.*:4:4/s)

    expect(()=>j(`{a: '''foo''']`)).toThrow(/unexpected.*:1:14/s)
    expect(()=>j(`{a:\n '''foo''']`)).toThrow(/unexpected.*:2:11/s)
    expect(()=>j(`{a:\n '''\nfoo''']`)).toThrow(/unexpected.*:3:7/s)
    expect(()=>j(`{a:\n '''\nfoo\n''']`)).toThrow(/unexpected.*:4:4/s)

    expect(()=>j(`{a: ''' foo''']`)).toThrow(/unexpected.*:1:15/s)
    expect(()=>j(`{a:\n ''' foo''']`)).toThrow(/unexpected.*:2:12/s)
    expect(()=>j(`{a:\n '''\n foo''']`)).toThrow(/unexpected.*:3:8/s)
    expect(()=>j(`{a:\n '''\n foo\n''']`)).toThrow(/unexpected.*:4:4/s)

    expect(()=>j(`{a: ''' foo ''']`)).toThrow(/unexpected.*:1:16/s)
    expect(()=>j(`{a:\n ''' foo ''']`)).toThrow(/unexpected.*:2:13/s)
    expect(()=>j(`{a:\n '''\n foo ''']`)).toThrow(/unexpected.*:3:9/s)
    expect(()=>j(`{a:\n '''\n foo \n''']`)).toThrow(/unexpected.*:4:4/s)

    expect(()=>j(`{a:\n '''\n foo \n ''']`)).toThrow(/unexpected.*:4:5/s)

    expect(()=>j(`{a: ''' foo ''' ]`)).toThrow(/unexpected.*:1:17/s)
    expect(()=>j(`{a:\n ''' foo ''' ]`)).toThrow(/unexpected.*:2:14/s)
    expect(()=>j(`{a:\n '''\n foo ''' ]`)).toThrow(/unexpected.*:3:10/s)
    expect(()=>j(`{a:\n '''\n foo \n ''' ]`)).toThrow(/unexpected.*:4:6/s)

    expect(()=>j(`{a: ''' foo '''\n ]`)).toThrow(/unexpected.*:2:2/s)
    expect(()=>j(`{a:\n ''' foo '''\n ]`)).toThrow(/unexpected.*:3:2/s)
    expect(()=>j(`{a:\n '''\n foo '''\n ]`)).toThrow(/unexpected.*:4:2/s)
    expect(()=>j(`{a:\n '''\n foo \n '''\n ]`)).toThrow(/unexpected.*:5:2/s)

    
  })
  
  
})
