const fs = require('fs')
const { join } = require('path')
const git = require('simple-git')
const spawn = require('cross-spawn')
const logger = require('../utils/logger')
const { removeAll, resolvePath, fileCopy } = require('../utils')

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

  try {
    const themeConfigExists = join(localPath, 'config.yml')
    if (fs.existsSync(themeConfigExists)) {
      logger.warn('Already Initialize pass')
      return
    }
    removeAll(localPath)

    git()
      .clone(repoURL, localPath)
      .then(() => {
        fileCopy(PkgFilePath, RootPkgFilePath)
        spawn('npm', ['install'], { cwd: initPath, stdio: 'inherit' })
        fileCopy(configFilePath, RootConfigFilePath)
        fileCopy(HomePageConfigFilePath, RootHomePageConfigFilePath)
        logger.info('Clone success')
      })
  } catch (error) {
    logger.err('Clone failure')
    logger.err(error)
  }
}
