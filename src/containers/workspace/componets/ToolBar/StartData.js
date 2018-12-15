import { SMap } from 'imobile_for_reactnative'
import { NativeMethod } from '../../../../native'
import { ConstToolType } from '../../../../constants'
import { Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import constants from '../../constants'

let _params = {}

function getStart(type, params) {
  _params = params
  let data = [],
    buttons = []
  switch (type) {
    case ConstToolType.MAP3D_START:
      data = [
        {
          key: constants.OPEN,
          title: constants.OPEN,
          action: () => {
            if (!_params.setToolbarVisible) return
            _params.setToolbarVisible(false)
            NavigationService.navigate('WorkspaceFlieList', { type: 'MAP_3D' })
          },
          size: 'large',
          image: require('../../../../assets/mapTools/icon_point.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point.png'),
        },
        // {
        //   key: constants.CREATE,
        //   title: constants.CREATE,
        //   size: 'large',
        //   action: () => {},
        //   image: require('../../../../assets/mapTools/icon_words.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_words.png'),
        // },
        // {
        //   key: constants.HISTORY,
        //   title: constants.HISTORY,
        //   size: 'large',
        //   action: () => {},
        //   image: require('../../../../assets/mapTools/icon_point_line.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_point_line.png'),
        // },
        {
          key: constants.BASE_MAP,
          title: constants.BASE_MAP,
          size: 'large',
          action: () => {
            changeBaseLayer('MAP_3D')
          },
          image: require('../../../../assets/mapTools/icon_free_line.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
        },
        // {
        //   key: constants.ADD,
        //   title: constants.ADD,
        //   size: 'large',
        //   action: () => {
        //     add('MAP_3D')
        //   },
        //   image: require('../../../../assets/mapTools/icon_free_line.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
        // },
      ]
      break
    case ConstToolType.MAP_COLLECTION_START:
      data = [
        {
          key: constants.OPEN,
          title: constants.OPEN,
          action: openMap,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_point.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point.png'),
        },
        {
          key: constants.CREATE,
          title: constants.CREATE,
          size: 'large',
          action: create,
          image: require('../../../../assets/mapTools/icon_words.png'),
          selectedImage: require('../../../../assets/mapTools/icon_words.png'),
        },
        {
          key: constants.HISTORY,
          title: constants.HISTORY,
          size: 'large',
          action: showHistory,
          image: require('../../../../assets/mapTools/icon_point_line.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_line.png'),
        },
        {
          key: constants.BASE_MAP,
          title: constants.BASE_MAP,
          size: 'large',
          action: changeBaseLayer,
          image: require('../../../../assets/mapTools/icon_free_line.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
        },
        {
          key: constants.ADD,
          title: constants.ADD,
          size: 'large',
          action: add,
          image: require('../../../../assets/mapTools/icon_free_line.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
        },
      ]
      break
    case ConstToolType.MAP_THEME_START:
      data = [
        // {
        //   key: constants.WORKSPACE,
        //   title: constants.WORKSPACE,
        //   action: openWorkspace,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_point.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_point.png'),
        // },
        {
          key: constants.OPEN,
          title: constants.OPEN,
          action: openThemeMap,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_point.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point.png'),
        },
        {
          key: constants.CREATE,
          title: constants.CREATE,
          size: 'large',
          action: add,
          image: require('../../../../assets/mapTools/icon_words.png'),
          selectedImage: require('../../../../assets/mapTools/icon_words.png'),
        },
        {
          key: constants.HISTORY,
          title: constants.HISTORY,
          size: 'large',
          action: showHistory,
          image: require('../../../../assets/mapTools/icon_point_line.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_line.png'),
        },
        {
          key: constants.BASE_MAP,
          title: constants.BASE_MAP,
          size: 'large',
          action: changeBaseLayer,
          image: require('../../../../assets/mapTools/icon_free_line.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
        },
        // {
        //   key: constants.ADD,
        //   title: constants.ADD,
        //   size: 'large',
        //   action: add,
        //   image: require('../../../../assets/mapTools/icon_free_line.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
        // },
      ]
      break
  }
  return { data, buttons }
}

/** 切换工作空间 **/
function openWorkspace(cb) {
  // return SMap.setAction(Action.PATCH_HOLLOW_REGION)
  NavigationService.navigate('WorkspaceFlieList', {
    type: 'WORKSPACE',
    title: '选择工作空间',
    cb: path => {
      if (cb) {
        cb(path)
      } else {
        SMap.closeWorkspace().then(async () => {
          try {
            _params.setContainerLoading &&
              _params.setContainerLoading(true, '正在打开工作空间')
            let data = { server: path }
            let result = await SMap.openWorkspace(data)
            Toast.show(result ? '已为您切换工作空间' : '切换工作空间失败')
            NavigationService.goBack()
            _params.setContainerLoading && _params.setContainerLoading(false)
          } catch (error) {
            Toast.show('打开失败')
            _params.setContainerLoading && _params.setContainerLoading(false)
          }
        })
      }
    },
  })
}

/** 打开地图 **/
function openMap(isOpenTemplate = GLOBAL.Type === constants.COLLECTION) {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  let data = []
  _params.getMaps(list => {
    data = [
      {
        title: '地图',
        data: list,
      },
    ]
    isOpenTemplate &&
      NativeMethod.getTemplates(_params.user.currentUser.userName).then(
        templateList => {
          data.push({
            title: '模板',
            data: templateList,
          })
          _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
            containerType: 'list',
            height: ConstToolType.HEIGHT[3],
            data,
          })
        },
      )
  })
}

/** 专题图打开 **/
function openThemeMap(isOpenTemplate = GLOBAL.Type === constants.MAP_THEME) {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  let data = []
  _params.getMaps(list => {
    data = [
      {
        title: '地图',
        data: list,
      },
    ]
    isOpenTemplate &&
      NativeMethod.getTemplates(_params.user.currentUser.userName).then(
        templateList => {
          data.push({
            title: '模板',
            data: templateList,
          })
          _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
            containerType: 'list',
            height: ConstToolType.HEIGHT[3],
            data,
          })
        },
      )
  })
}

/** 导入 **/
// function importWorkspace() {
//   if (GLOBAL.Type === constants.COLLECTION) {
//     openWorkspace(async path => {
//       try {
//         _params.setContainerLoading &&
//         _params.setContainerLoading(true, '正在导入工作空间')
//
//         let fileNameAndType = path.substr(path.lastIndexOf('/') + 1, path.length - 1).split('.')
//         let alias = fileNameAndType[0]
//         let fileType = fileNameAndType[1].toString().toUpperCase()
//         let type
//         switch (fileType) {
//           case 'SXW':
//             type = WorkspaceType.SXW
//             break
//           case 'SMW':
//             type = WorkspaceType.SMW
//             break
//           case 'SXWU':
//             type = WorkspaceType.SXWU
//             break
//           case 'SMWU':
//           default:
//             type = WorkspaceType.SMWU
//         }
//
//         let data = { server: path, type, alias }
//         _params.importTemplate(data, result => {
//           _params.getLayers()
//           Toast.show(result ? '已为您导入工作空间' : '导入工作空间失败')
//           NavigationService.goBack()
//           _params.setContainerLoading && _params.setContainerLoading(false)
//         })
//       } catch (error) {
//         Toast.show('导入工作空间失败')
//         _params.setContainerLoading && _params.setContainerLoading(false)
//       }
//     })
//   }
// }

/** 打开工作空间 **/
function create() {
  if (GLOBAL.Type === constants.COLLECTION) {
    openWorkspace()
  }
}

/** 历史 **/
function showHistory() {
  // return SMap.setAction(Action.PATCH_HOLLOW_REGION)
}

/** 切换底图 **/
function changeBaseLayer(type) {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  switch (type) {
    case 'MAP_3D':
      _params.setToolbarVisible(true, ConstToolType.MAP3D_BASE, {
        containerType: 'list',
      })
      break
    default:
      _params.setToolbarVisible(true, ConstToolType.MAP_BASE, {
        containerType: 'list',
        height: ConstToolType.HEIGHT[3],
      })
      break
  }
}

/** 添加 **/
function add(type) {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  switch (type) {
    case 'MAP_3D':
      _params.setToolbarVisible(true, ConstToolType.MAP3D_ADD_LAYER, {
        containerType: 'list',
        isFullScreen: true,
        height: ConstToolType.HEIGHT[3],
      })
      break

    default:
      _params.setToolbarVisible(true, ConstToolType.MAP_ADD_LAYER, {
        containerType: 'list',
        isFullScreen: true,
        height: ConstToolType.HEIGHT[2],
      })
      break
  }
}

export default {
  getStart,
}
