/**
 * 获取地图更多
 */
import { ConstToolType } from '../../../../constants'
// import NavigationService from '../../../NavigationService'
import constants from '../../constants'
import { SMap, SThemeCartography } from 'imobile_for_reactnative'
import { Toast } from '../../../../utils'

let _params = {}

function getMapMore(type, params) {
  let data = [],
    buttons = []
  _params = params
  switch (type) {
    case 'MAP_MORE_MAP3D':
      data = [
        // {
        //   key: constants.CLOSE,
        //   title: constants.CLOSE,
        //   action: () => {},
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_point.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_point.png'),
        // },
        // {
        //   key: constants.SAVE,
        //   title: constants.SAVE,
        //   size: 'large',
        //   // TODO 保存地图
        //   action: () => {},
        //   image: require('../../../../assets/mapTools/icon_words.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_words.png'),
        // },
        // {
        //   key: constants.SAVE_AS,
        //   title: constants.SAVE_AS,
        //   size: 'large',
        //   action: () => {},
        //   image: require('../../../../assets/mapTools/icon_point_line.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_point_line.png'),
        // },
        {
          key: constants.SHARE,
          title: constants.SHARE,
          size: 'large',
          action: shareMap3D,
          image: require('../../../../assets/mapTools/icon_share.png'),
        },
      ]
      break
    case ConstToolType.MAP_MORE_THEME:
      data = [
        {
          key: constants.CLOSE,
          title: constants.THEME_CLOSE,
          // 关闭地图
          action: closeMapTheme,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_close.png'),
        },
        {
          key: constants.SAVE,
          title: constants.THEME_SAVE,
          size: 'large',
          // 保存地图
          action: saveMapTheme,
          image: require('../../../../assets/mapTools/icon_save.png'),
        },
        {
          key: constants.SAVE_AS,
          title: constants.THEME_SAVE_AS,
          size: 'large',
          // 地图另存为
          action: saveMapAs,
          image: require('../../../../assets/mapTools/icon_save_as.png'),
        },
        {
          key: constants.SHARE,
          title: constants.THEME_SHARE,
          size: 'large',
          action: shareMap,
          image: require('../../../../assets/mapTools/icon_share.png'),
        },
      ]
      break
    default:
      data = [
        {
          key: constants.CLOSE,
          title: constants.CLOSE,
          action: closeMap,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_close.png'),
        },
        {
          key: constants.SAVE,
          title: constants.SAVE,
          size: 'large',
          // TODO 保存地图
          action: () => saveMap('TempMap'),
          image: require('../../../../assets/mapTools/icon_save.png'),
        },
        {
          key: constants.SAVE_AS,
          title: constants.SAVE_AS,
          size: 'large',
          action: saveMapAs,
          image: require('../../../../assets/mapTools/icon_save_as.png'),
        },
        {
          key: constants.SHARE,
          title: constants.SHARE,
          size: 'large',
          action: shareMap,
          image: require('../../../../assets/mapTools/icon_share.png'),
        },
      ]
      break
  }

  return { data, buttons }
}

/*******************************************操作分割线*********************************************/

/**专题制图:关闭地图 */
function closeMapTheme() {
  SMap.closeMap()
}

/**专题制图:保存地图 */
function saveMapTheme() {
  let save = SThemeCartography.saveMap()
  if (save) {
    Toast.show('保存成功')
  } else {
    Toast.show('保存失败')
  }
}

/** 关闭地图 **/
function closeMap() {
  if (!_params.closeMap) return
  _params.closeMap()
}

/** 保存地图 **/
function saveMap() {
  if (!_params.setSaveViewVisible) return
  GLOBAL.isBackHome = false
  _params.setSaveViewVisible(true)
}

/** 另存地图 **/
function saveMapAs() {
  if (!_params.setSaveMapDialogVisible) return
  _params.setSaveMapDialogVisible(true)
}

/** 分享 **/
function shareMap() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  _params.setToolbarVisible(true, ConstToolType.MAP_SHARE, {
    containerType: 'table',
    column: 4,
    isFullScreen: true,
    height: ConstToolType.HEIGHT[0],
  })
}

function shareMap3D() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  _params.setToolbarVisible(true, ConstToolType.MAP_SHARE_MAP3D, {
    containerType: 'table',
    column: 4,
    isFullScreen: true,
    height: ConstToolType.HEIGHT[0],
  })
}

export default {
  getMapMore,
}
