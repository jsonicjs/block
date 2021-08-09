


function Block(jsonic, options) {
  let { regexp, escre } = jsonic.util
  
  jsonic.lex(function makeBlockMatcher() {
    let blockre = regexp(
      's',
      '^(',
      Object
        .entries(options.marker)
        .filter(([sm,em]) => 'string'===typeof(sm) && 'string'===typeof(em))
        .map(([sm,em])=>
             (escre(sm)+'(.*?)('+escre(em)+')'))
        .join('|'),
      ')'
    )

    return function blockMatcher(lex) {
      let pnt = lex.pnt
      let fwd = lex.src.substring(pnt.sI)

      let m = fwd.match(blockre)
      
      if (m) {
        let msrc = m[0]
        let mlen = msrc.length

        if (0 < mlen) {
          let mf = m.filter(p=>null!=p)

          let txt = mf[2]
              .replace(/^\s*\r?\n/,'')
              .replace(/\r?\n\s*$/,'')

          let indent = (txt.match(/^(\s+)/)||['',''])[1]

          txt = txt
            .substring(indent.length)
            .replace(regexp('g','(\\r?\\n)',indent),'$1')
          
          let tkn = lex.token(jsonic.token.TX, txt, msrc, pnt)

          let rows = msrc.replace(/[^\n]/g,'').length
          pnt.sI += msrc.length
          pnt.rI += rows
          pnt.cI = (0<rows?1:pnt.cI)+(msrc.match(/[^\r\n]*$/)||[''])[0].length

          return tkn
        }
      }
    }
  })

  
}


Block.defaults = {
   
  // Block markers
  marker: {
    "'''": "'''",
  },
}


module.exports = { Block }
