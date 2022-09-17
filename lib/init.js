const { existsSync, remove, copy } = require('fs-extra')
const { join } = require('path')
const spawn = require('cross-spawn')
const commandExistsSync = require('command-exists').sync
const logger = require('../utils/logger')
const { resolvePath, SetVersion } = require('../utils')

const options = { stdio: 'inherit' }

let npmCommand = 'npm'
if (commandExistsSync('yarn')) npmCommand = 'yarn'
else if (commandExistsSync('pnpm')) npmCommand = 'pnpm'

const pkgMapper = {
  yarn: ['add', 'awstats', '--prod', '--ignore-optional', '--silent'],
  pnpm: ['add', 'awstats', '--prod', '--no-optional', '--silent'],
  npm: ['install', '--only=production', '--optional=false', '--silent']
}

module.exports = async function (dirname = '') {
  // 获取初始化路径
  const initPath = resolvePath(dirname)

  // 获取AWStats源码目录下的source路径
  const thisPath = join(__dirname, '../source')
  const configFilePath = join(thisPath, 'defaultConfig.yml')
  const PkgFilePath = join(thisPath, 'package.json')

  // 关于初始化目录的
  const RootConfigFilePath = resolvePath(dirname, 'config.yml')
  const HomePageConfigFilePath = resolvePath(dirname, 'themes/HomePage/config.yml')
  const RootHomePageConfigFilePath = resolvePath(dirname, 'config.HomePage.yml')
  const RootPkgFilePath = resolvePath(dirname, 'package.json')
  const localPath = resolvePath(dirname, 'themes/HomePage')

  const repoURL = 'https://github.com/Lete114/AWStats-Theme-HomePage.git'

  logger.info('Clone ...')

  if (existsSync(HomePageConfigFilePath)) {
    logger.warn('Already Initialize pass')
    return
  }

  // 删除多余的文件
  await remove(localPath)

  // 克隆默认主题
  spawn.sync('git', ['clone', repoURL, localPath, '--depth=1'], options)

  if (!existsSync(HomePageConfigFilePath)) {
    logger.err('Initialization failed. Please try again later')
    return
  }

  // 复制默认信息文件
  await copy(PkgFilePath, RootPkgFilePath)
  await copy(configFilePath, RootConfigFilePath)
  await copy(HomePageConfigFilePath, RootHomePageConfigFilePath)

  // 安装 AWStatas
  spawn.sync(npmCommand, pkgMapper[npmCommand], { ...options, ...{ cwd: initPath } })

  SetVersion(dirname)

  const gitDir = join(localPath, '.git')
  existsSync(gitDir) && remove(gitDir)

  logger.info('Clone success')
}
