import path from 'path'
import fs from 'fs'
import { type ViteDevServer } from 'vite/dist/node'

function genDirListHtml(list: string[]) {
  return `
  <style>
  a{line-height: 1.8em;}
  a:hover{color:darkcyan}
  </style>
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
        if (typeof url === 'string' && url.endsWith('/')) {
          const pwd = path.join(process.cwd(), url)
          const list1 = fs.readdirSync(pwd, {
            withFileTypes: true,
          })

          const hasIndex = list1.some((vv) => vv.name === 'index.html')
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
        } else {
          next()
        }
      })
    },
  }
}
