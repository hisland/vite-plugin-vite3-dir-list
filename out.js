var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var main_exports = {};
__export(main_exports, {
  default: () => dirListPlugin
});
module.exports = __toCommonJS(main_exports);
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
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
        const thatPath = import_path.default.join(process.cwd(), url);
        try {
          const stat = import_fs.default.statSync(thatPath);
          if (stat.isDirectory()) {
            if (!thatPath.endsWith("/")) {
              res.writeHead(301, { Location: `${url}/` });
              res.end();
            } else {
              const list1 = import_fs.default.readdirSync(thatPath, {
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
