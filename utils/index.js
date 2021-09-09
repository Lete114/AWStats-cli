const { join, resolve } = require('path')
const fs = require('fs')

/**
 *  获取绝对路径
 * @param {*} Path 路径，必须以‘/’开头
 * @returns 绝对路径完整地址
 */
function resolvePath(...Path) {
  let root_dir = process.cwd()
  return join(root_dir, ...Path)
}

/**
 * 复制文件
 * @param {*} sourcesPath 原文件路径
 * @param {*} attachPath 指定输出路径
 */
function fileCopy(sourcesPath, attachPath) {
  fs.stat(sourcesPath, (err, stat) => {
    if (err) throw err
    if (stat.isFile()) {
      // 创建读取流
      let readable = fs.createReadStream(sourcesPath)
      // 创建写入流
      let writable = fs.createWriteStream(attachPath)
      readable.on('data', (chunk) => writable.write(chunk))
      readable.on('end', () => writable.end())
    }
  })
}

/**
 * 删除目录下的所有文件及目录，包括当前目录
 * @param path 需要删除的路径文件夹
 */
function removeAll(_path) {
  if (!fs.existsSync(_path)) return
  const files = fs.readdirSync(_path)
  for (let item of files) {
    const file_path = resolve(`${_path}/${item}`)
    const stats = fs.statSync(file_path)
    if (stats.isDirectory()) removeAll(file_path)
    else fs.unlinkSync(file_path) //删除文件
  }
  fs.rmdirSync(_path) // 删除文件夹
}

module.exports = { removeAll, fileCopy, resolvePath }
