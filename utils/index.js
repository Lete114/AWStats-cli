const { join } = require('path')
const { writeFileSync } = require('fs')

/**
 *  获取绝对路径
 * @param {*} Path 路径，必须以‘/’开头
 * @returns 绝对路径完整地址
 */
function resolvePath(...Path) {
  let root_dir = process.cwd()
  return join(root_dir, ...Path)
}

function DeepClone(obj = {}) {
  const str = JSON.stringify(obj)
  return JSON.parse(str)
}

function SetVersion(dirname) {
  const pkgPath = resolvePath(dirname, 'package.json')
  const pkg = require(pkgPath)
  const awstatsVersion = pkg.dependencies.awstats || ''
  const version = awstatsVersion.replace(/\^|\~|\*/, '')
  pkg.awstats.version = version
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), { encoding: 'utf-8' })
}

module.exports = { resolvePath, DeepClone, SetVersion }
