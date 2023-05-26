const path = require('path');
const fs = require('fs');
const version = `?v=${+new Date()}`;
const exec = require('child_process').exec;
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');
const { createReadStream, createWriteStream } = require('node:fs');
const CryptoJS = require("./src/core/crypt.js");
const OriginFilePath = path.resolve(__dirname, 'src');
const CopyFilePath = path.resolve(__dirname, 'dist');
const CopyFiles = [];
let tag = 0;
let env = ''

/**
 * 删除文件
 * @param {*} filePath 
 * @returns 
 */
function rmdirPromise(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(CopyFilePath)) {
      resolve();
      return;
    }
    fs.stat(filePath, function (err, stat) {
      if (err) reject(err)
      if (stat.isFile()) {
        fs.unlink(filePath, function (err) {
          if (err) reject(err)
          resolve()
        })
      } else {
        fs.readdir(filePath, function (err, dirs) {
          if (err) reject(err)
          dirs = dirs.map(dir => path.join(filePath, dir))
          dirs = dirs.map(dir => rmdirPromise(dir))
          Promise.all(dirs).then(() => {
            fs.rmdir(filePath, resolve)
          })
        })
      }
    })
  })
}

/**
 * 复制文件
 * @param {*} OriginFilePath 
 * @param {*} CopyFilePath 
 */
function copyFiles(OriginFilePath, CopyFilePath, callback) {
  fs.readdir(OriginFilePath, { withFileTypes: true }, (err, files) => {
    for (let file of files) {
      if (!file.isDirectory()) {
        const OriginFile = path.resolve(OriginFilePath, file.name)
        const CopyFile = path.resolve(CopyFilePath, file.name)
        tag++;
        fs.copyFile(OriginFile, CopyFile, () => {
          CopyFiles.push(CopyFile);
          callback && callback(CopyFile)
        })
      } else {//如果是文件夹就递归变量把最新的文件夹路径传过去
        const CopyDirPath = path.resolve(CopyFilePath, file.name)
        const OriginDirPath = path.resolve(OriginFilePath, file.name)
        fs.mkdir(CopyDirPath, () => { })
        copyFiles(OriginDirPath, CopyDirPath, callback)
      }
    }
  })
}

/**
 * 文件重写
 * @param {*} CopyFile 
 */
function overwriteFile(CopyFile) {
  process.stdout.write("正在处理：" + CopyFile + "\r\n");
  if (CopyFile.endsWith(".html")) {
    //加密html文件
    if (!CopyFile.endsWith("dist\\index.html")) {
      fs.readFile(CopyFile, 'utf8', (err, data) => {
        const str = data.toString();
        const content = CryptoJS.AES.encrypt(str, "system").toString()
        fs.writeFile(CopyFile, content, () => { })
      })
    } else {
      //index.html入口中的JS文件增加版本号
      fs.readFile(CopyFile, 'utf-8', (err, data) => {
        let str = data.toString();
        str = str.replaceAll(`.js"`, `.js${version}"`)
          .replaceAll(`.js'`, `.js${version}'`)
          .replaceAll(`.css'`, `.css${version}'`)
          .replaceAll(`.css"`, `.css${version}"`)
        fs.writeFile(CopyFile, str, () => { });
      });
    }
  }
  else if (CopyFile.endsWith(".css")) {
    fs.readFile(CopyFile, 'utf8', (err, data) => {
      const str = data.toString();
      fs.writeFile(CopyFile, str, () => { })
    })
  }
  else if (CopyFile.endsWith(".js") && !CopyFile.includes("\\core")) {
    fs.readFile(CopyFile, 'utf8', (err, data) => {
      const str = data.toString();
      let content = str.replaceAll(`.js"`, `.js${version}"`)
        .replaceAll(`.js'`, `.js${version}'`)
        .replaceAll(`.css'`, `.css${version}'`)
        .replaceAll(`.css"`, `.css${version}"`)
        .replaceAll(`.html'`, `.html${version}'`)
        .replaceAll(`.html"`, `.html${version}"`);
      if (CopyFile.endsWith("const.js")) {
        content = content.replace("'dev'", `'${env}'`);
      }
      fs.writeFile(CopyFile, content, () => { })
    })

    var cmd = `javascript-obfuscator ${CopyFile} --output ${CopyFile} --config ./javascript-obfuscator.json`
    process.stdout.write(`正在混淆JS代码：${cmd} \r\n`);
    exec(cmd, () => { })
  }

  gizp(CopyFile);



  if (CopyFiles.length === tag) {
    process.stdout.write('打包成功 \r\n');
  }
}

/**
 * gzip压缩
 * @param {*} filePath 
 */
function gizp(filePath) {
  const gzip = createGzip();
  const source = createReadStream(filePath);
  const gzipPath = filePath + '.gz';
  const destination = createWriteStream(gzipPath);
  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
      return
    }
    if (filePath.endsWith(".scss")) {
      fs.unlink(filePath, () => { })
    }
    if (gzipPath.endsWith(".scss.gz")) {
      fs.unlink(gzipPath, () => { })
    }
  });
}

module.exports = {
  publish(_env = 'dev') {
    env = _env
    process.stdout.write("正在打包 \r\n");
    rmdirPromise(CopyFilePath).then(() => {
      fs.mkdir(CopyFilePath, () => { });
      copyFiles(OriginFilePath, CopyFilePath, (CopyFile) => {
        overwriteFile(CopyFile);
      });
    })
  }
}



