const { existsSync } = require('fs')
const { join } = require('path')
const spawn = require('cross-spawn')
const logger = require('../utils/logger')
const { resolvePath, DeepClone, SetVersion } = require('../utils')

const options = { stdio: 'inherit' }

module.exports = function (dirname) {
  if (!dirname) dirname = ''

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

  const repoURL = 'https://github.com/lete114/AWStats-Theme-HomePage.git'

  logger.info('Clone ...')

  if (existsSync(HomePageConfigFilePath)) {
    logger.warn('Already Initialize pass')
    return
  }

  // 删除多余的文件
  spawn.sync('rm', ['-rf', localPath], options)

  // 克隆默认主题
  spawn.sync('git', ['clone', repoURL, localPath], options)

  if (!existsSync(HomePageConfigFilePath)) {
    logger.err('Initialization failed. Please try again later')
    return
  }

  // // 复制默认信息文件
  spawn.sync('cp', ['-rf', PkgFilePath, RootPkgFilePath], options)
  spawn.sync('cp', ['-rf', configFilePath, RootConfigFilePath], options)
  spawn.sync('cp', ['-rf', HomePageConfigFilePath, RootHomePageConfigFilePath], options)

  // 安装 AWStatas
  const newOptions = DeepClone(options)
  newOptions.cwd = initPath
  spawn.sync('npm', ['install', 'awstats', '--save'], newOptions)

  SetVersion()

  logger.info('Clone success')
}
