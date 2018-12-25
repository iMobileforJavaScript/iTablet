import { NativeMethod, FileTools } from '../../../../native'
import {
  ConstToolType,
  ConstInfo,
  ConstPath,
  Const,
} from '../../../../constants'
import { Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import constants from '../../constants'
// import { Utility } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
let _params = {}

function getStart(type, params) {
  _params = params
  let data = [],
    buttons = []
  switch (type) {
    case ConstToolType.MAP_EDIT_START:
      data = [
        {
          key: constants.WORKSPACE,
          title: constants.WORKSPACE,
          action: openWorkspace,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_open.png'),
        },
        {
          key: constants.OPEN,
          title: constants.OPEN,
          action: openMap,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_open.png'),
        },
        {
          key: constants.CREATE,
          title: constants.CREATE,
          size: 'large',
          action: create,
          image: require('../../../../assets/mapTools/icon_create.png'),
        },
        {
          key: constants.HISTORY,
          title: constants.HISTORY,
          size: 'large',
          action: showHistory,
          image: require('../../../../assets/mapTools/icon_history_white.png'),
        },
        {
          key: constants.BASE_MAP,
          title: constants.BASE_MAP,
          size: 'large',
          action: changeBaseLayer,
          image: require('../../../../assets/mapTools/icon_base.png'),
        },
        // {
        //   key: constants.ADD,
        //   title: constants.ADD,
        //   size: 'large',
        //   action: add,
        //   image: require('../../../../assets/mapTools/icon_add_white.png'),
        // },
      ]
      break
    case ConstToolType.MAP_3D_START:
      data = [
        {
          key: constants.OPEN,
          title: constants.OPEN,
          action: () => {
            if (!_params.setToolbarVisible) return
            // _params.setToolbarVisible(false)
            // NavigationService.navigate('WorkspaceFlieList', { type: 'MAP_3D' })
            _params.setToolbarVisible(
              true,
              ConstToolType.MAP3D_WORKSPACE_LIST,
              {
                containerType: 'list',
                height: ConstToolType.HEIGHT[3],
              },
            )
          },
          size: 'large',
          image: require('../../../../assets/mapTools/icon_open.png'),
        },
        {
          key: constants.BASE_MAP,
          title: constants.BASE_MAP,
          size: 'large',
          action: () => {
            changeBaseLayer('MAP_3D')
          },
          image: require('../../../../assets/mapTools/icon_base.png'),
        },
      ]
      break
    case ConstToolType.MAP_COLLECTION_START:
      data = [
        // {
        //   key: constants.WORKSPACE,
        //   title: constants.WORKSPACE,
        //   action: openWorkspace,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_open.png'),
        // },
        {
          key: constants.OPEN,
          title: constants.OPEN,
          action: openMap,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_open.png'),
        },
        {
          key: constants.CREATE,
          title: constants.CREATE,
          size: 'large',
          action: openTemplate,
          image: require('../../../../assets/mapTools/icon_create.png'),
        },
        {
          key: constants.HISTORY,
          title: constants.HISTORY,
          size: 'large',
          action: showHistory,
          image: require('../../../../assets/mapTools/icon_history_white.png'),
        },
        {
          key: constants.BASE_MAP,
          title: constants.BASE_MAP,
          size: 'large',
          action: changeBaseLayer,
          image: require('../../../../assets/mapTools/icon_base.png'),
        },
        {
          key: constants.ADD,
          title: constants.ADD,
          size: 'large',
          action: add,
          image: require('../../../../assets/mapTools/icon_add_white.png'),
        },
      ]
      break
    case ConstToolType.MAP_THEME_START:
      data = [
        {
          key: constants.WORKSPACE,
          title: constants.THEME_WORKSPACE,
          action: openWorkspace,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_open.png'),
        },
        {
          key: constants.OPEN,
          title: constants.THEME_OPEN,
          action: openMap,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_open.png'),
        },
        {
          key: constants.CREATE,
          title: constants.THEME_CREATE,
          size: 'large',
          action: createThemeMap,
          image: require('../../../../assets/mapTools/icon_create.png'),
        },
        // {
        //   key: constants.HISTORY,
        //   title: constants.HISTORY,
        //   size: 'large',
        //   action: showHistory,
        //   image: require('../../../../assets/mapTools/icon_history_white.png'),
        // },
        {
          key: constants.BASE_MAP,
          title: constants.THEME_BASE_MAP,
          size: 'large',
          action: changeBaseLayer,
          image: require('../../../../assets/mapTools/icon_base.png'),
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
        _params.closeWorkspace().then(async () => {
          try {
            _params.setContainerLoading &&
              _params.setContainerLoading(true, ConstInfo.WORKSPACE_OPENING)
            let data = { server: path }
            let result = await _params.openWorkspace(data)
            Toast.show(
              result
                ? ConstInfo.WORKSPACE_OPEN_SUCCESS
                : ConstInfo.WORKSPACE_OPEN_FAILED,
            )
            NavigationService.goBack()
            _params.setContainerLoading && _params.setContainerLoading(false)
          } catch (error) {
            Toast.show(ConstInfo.WORKSPACE_OPEN_FAILED)
            _params.setContainerLoading && _params.setContainerLoading(false)
          }
        })
      }
    },
  })
}

/** 打开地图 **/
function openMap() {
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
    _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
      containerType: 'list',
      height: ConstToolType.HEIGHT[3],
      data,
    })
  })
}

/** 打开模板 **/
function openTemplate() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  NativeMethod.getTemplates(_params.user.currentUser.userName).then(
    async templateList => {
      let isDefaultWS = false
      let defaultWorkspacePath = await FileTools.appendingHomeDirectory(
        (_params.user && _params.user.userName
          ? ConstPath.UserPath + _params.userName
          : ConstPath.CustomerPath) + ConstPath.RelativeFilePath.Workspace,
      )

      if (
        _params.map &&
        _params.map.workspace.server === defaultWorkspacePath
      ) {
        isDefaultWS = true
      }

      let data = isDefaultWS
        ? [
          {
            title: Const.MODULE,
            data: templateList,
          },
        ]
        : [
          {
            title: Const.RETURN_TO_DEFAULT_MODULE,
            data: [],
          },
          {
            title: Const.MODULE,
            data: templateList,
          },
        ]
      _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
        containerType: 'list',
        height: ConstToolType.HEIGHT[3],
        data,
      })
    },
  )
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

/**新建专题图 **/
function createThemeMap() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  Orientation.getOrientation((e, orientation) => {
    let column = orientation === 'PORTRAIT' ? 3 : 8
    let height =
      orientation === 'PORTRAIT'
        ? ConstToolType.HEIGHT[0]
        : ConstToolType.HEIGHT[0]

    _params.setToolbarVisible(true, ConstToolType.MAP_THEME_CREATE, {
      containerType: 'table',
      isFullScreen: true,
      column: column,
      height: height,
    })
  })
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
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
      break
  }
}

export default {
  getStart,
}
