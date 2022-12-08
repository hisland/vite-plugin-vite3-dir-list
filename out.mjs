import path from "path";
import fs from "fs";
function genDirListHtml(list) {
  return `
  <style>
  a{line-height: 1.8em;}
  a:hover{color:darkcyan}
  </style>
  <ul>
  ${list.map((vv) => `<li><a href="${vv}">${vv}</a></li>`).join("")}
  </ul>`;
}
function dirListPlugin() {
  return {
    name: "vite-plugin-dir-list",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const { url } = req;
        const thatPath = path.join(process.cwd(), url);
        try {
          const stat = fs.statSync(thatPath);
          if (stat.isDirectory()) {
            if (!thatPath.endsWith("/")) {
              res.writeHead(301, { Location: `${url}/` });
              res.end();
            } else {
              const list1 = fs.readdirSync(thatPath, {
                withFileTypes: true
              });
              const hasIndex = false;
              if (hasIndex) {
                res.writeHead(301, { Location: "index.html" });
                res.end();
              } else {
                const list2 = list1.map((file) => {
                  if (file.isDirectory()) {
                    return file.name + "/";
                  } else {
                    return file.name;
                  }
                });
                res.end(genDirListHtml(list2));
              }
            }
          } else {
            next();
          }
        } catch (error) {
          next();
        }
      });
    }
  };
}
export {
  dirListPlugin as default
};
