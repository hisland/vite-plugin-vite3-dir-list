// @ts-ignore
import path from 'path'
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import { type ViteDevServer } from 'vite/dist/node'

function genDirListHtml(list: string[]) {
  return `
  <head>
    <meta charset="UTF-8" />
    <style>
      a {
        line-height: 1.8em;
      }
      a:hover {
        color: darkcyan;
      }
    </style>
  </head>
  <ul>
  ${list.map((vv) => `<li><a href="${vv}">${vv}</a></li>`).join('')}
  </ul>`
}

export default function dirListPlugin() {
  return {
    name: 'vite-plugin-dir-list',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const { url } = req
        // @ts-ignore
        const thatPath = path.join(process.cwd(), url)
        // console.log('thatPath: ', thatPath)
        try {
          const stat = fs.statSync(thatPath)
          // console.log('stat.isDirectory: ', stat.isDirectory())
          if (stat.isDirectory()) {
            if (!thatPath.endsWith('/')) {
              res.writeHead(301, { Location: `${url}/` })
              res.end()
            } else {
              const list1 = fs.readdirSync(thatPath, {
                withFileTypes: true,
              })
              // console.log('list1: ', list1)
              list1.sort((aa, bb) => {
                const aaNum = parseInt(aa.name)
                const bbNum = parseInt(bb.name)
                return aaNum - bbNum
              })

              // const hasIndex = list1.some((vv) => vv.name === 'index.html')
              const hasIndex = false
              // console.log('hasIndex: ', hasIndex)
              if (hasIndex) {
                res.writeHead(301, { Location: 'index.html' })
                res.end()
                // res.end(fs.readFileSync(path.join(pwd, 'index.html'), 'utf8'))
              } else {
                const list2 = list1.map((file) => {
                  if (file.isDirectory()) {
                    return file.name + '/'
                  } else {
                    return file.name
                  }
                })
                res.end(genDirListHtml(list2))
              }
            }
          } else {
            next()
          }
        } catch (error) {
          // console.log('error: ', error)
          next()
        }
      })
    },
  }
}
