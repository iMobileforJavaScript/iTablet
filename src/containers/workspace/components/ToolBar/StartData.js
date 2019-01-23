import { FileTools, NativeMethod } from '../../../../native'
import {
  ConstToolType,
  ConstInfo,
  ConstPath,
  Const,
} from '../../../../constants'
import { Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import constants from '../../constants'
import Orientation from 'react-native-orientation'
let _params = {}
import { SMap, SScene } from 'imobile_for_reactnative'

function setParams(params) {
  _params = params
}

function getStart(type, params) {
  _params = params
  let data = [],
    buttons = []
  switch (type) {
    case ConstToolType.MAP_EDIT_START:
      data = [
        // {
        //   key: constants.THEME_WORKSPACE,
        //   title: constants.THEME_WORKSPACE,
        //   action: importTemplate,
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
        // {
        //   key: constants.BASE_MAP,
        //   title: constants.BASE_MAP,
        //   size: 'large',
        //   action: changeBaseLayer,
        //   image: require('../../../../assets/mapTools/icon_base.png'),
        // },
        // {
        //   key: constants.ADD,
        //   title: constants.ADD,
        //   size: 'large',
        //   action: add,
        //   image: require('../../../../assets/mapTools/icon_add_white.png'),
        // },
        // {
        //   key: '导出',
        //   title: '导出',
        //   size: 'large',
        //   action: outPutMap,
        //   image: require('../../../../assets/mapTools/icon_share.png'),
        // },
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
      ]
      break
    case ConstToolType.MAP_3D_START:
      data = [
        // {
        //   key: constants.CREATE,
        //   title: '导入场景',
        //   size: 'large',
        //   action: () => {
        //     if (!_params.setToolbarVisible) return
        //     // _params.setToolbarVisible(false)
        //     // NavigationService.navigate('WorkspaceFlieList', { type: 'MAP_3D' })
        //     _params.setToolbarVisible(
        //       true,
        //       ConstToolType.MAP3D_IMPORTWORKSPACE,
        //       {
        //         containerType: 'list',
        //       },
        //     )
        //   },
        //   image: require('../../../../assets/mapTools/icon_create.png'),
        // },
        {
          key: constants.OPEN,
          title: '打开场景',
          action: () => {
            if (!_params.setToolbarVisible) return
            _params.setToolbarVisible(
              true,
              ConstToolType.MAP3D_WORKSPACE_LIST,
              {
                containerType: 'list',
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
        // {
        //   key: constants.BASE_MAP,
        //   title: constants.BASE_MAP,
        //   size: 'large',
        //   action: changeBaseLayer,
        //   image: require('../../../../assets/mapTools/icon_base.png'),
        // },
        // {
        //   key: constants.ADD,
        //   title: constants.ADD,
        //   size: 'large',
        //   action: add,
        //   image: require('../../../../assets/mapTools/icon_add_white.png'),
        // },
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
      ]
      break
    case ConstToolType.MAP_THEME_START:
      data = [
        // {
        //   key: constants.THEME_WORKSPACE,
        //   title: constants.THEME_WORKSPACE,
        //   action: importTemplate,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_open.png'),
        // },
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
        {
          key: constants.HISTORY,
          title: constants.HISTORY,
          size: 'large',
          action: showHistory,
          image: require('../../../../assets/mapTools/icon_history_white.png'),
        },
        // {
        //   key: constants.BASE_MAP,
        //   title: constants.THEME_BASE_MAP,
        //   size: 'large',
        //   action: changeBaseLayer,
        //   image: require('../../../../assets/mapTools/icon_base.png'),
        // },
        // {
        //   key: constants.ADD,
        //   title: constants.ADD,
        //   size: 'large',
        //   action: add,
        //   image: require('../../../../assets/mapTools/icon_free_line.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
        // },
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
  ;(async function() {
    let data = [],
      path =
        (await FileTools.appendingHomeDirectory(
          _params.user && _params.user.currentUser.userName
            ? ConstPath.UserPath + _params.user.currentUser.userName + '/'
            : ConstPath.CustomerPath,
        )) + ConstPath.RelativeFilePath.Map
    // FileTools.getPathListByFilter(path, {
    //   extension: 'xml',
    //   type: 'file',
    // }).then(fileList => {
    //   let list = []
    //   fileList.forEach(item => {
    //     let name = item.name
    //     item.title = name
    //     item.name = name.split('.')[0]
    //     list.push(item)
    //   })
    //   data = [
    //     {
    //       title: '地图',
    //       data: list,
    //     },
    //   ]
    //   _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
    //     containerType: 'list',
    //     height: ConstToolType.HEIGHT[3],
    //     data,
    //   })
    // })
    let customerPath =
      (await FileTools.appendingHomeDirectory(ConstPath.CustomerPath)) +
      ConstPath.RelativeFilePath.Map
    let fileList = await FileTools.getPathListByFilter(customerPath, {
      extension: 'xml',
      type: 'file',
    })
    let userFileList
    if (_params.user && _params.user.currentUser.userName) {
      userFileList = await FileTools.getPathListByFilter(path, {
        extension: 'xml',
        type: 'file',
      })
    }

    let list = []
    fileList.forEach(item => {
      let name = item.name
      item.title = name
      item.name = name.split('.')[0]
      item.image = require('../../../../assets/mapToolbar/list_type_map.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
      list.push(item)
    })
    data = [
      {
        title:
          _params.user && _params.user.currentUser.userName
            ? '公共地图'
            : '地图',
        image: require('../../../../assets/mapToolbar/list_type_maps.png'),
        data: list,
      },
    ]
    if (userFileList && userFileList.length > 0) {
      let userList = []
      userFileList.forEach(item => {
        let name = item.name
        item.title = name
        item.name = name.split('.')[0]
        item.image = require('../../../../assets/mapToolbar/list_type_map.png')
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
        }
        userList.push(item)
      })
      data.push({
        title: '地图',
        image: require('../../../../assets/mapToolbar/list_type_maps.png'),
        data: userFileList,
      })
    }
    _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
      containerType: 'list',
      height: ConstToolType.HEIGHT[3],
      data,
    })
  })()
}

/**地图制图，专题制图：导入模块（暂用） */
// function importTemplate() {
//   if (!_params.setToolbarVisible) return
//   _params.showFullMap && _params.showFullMap(true)
//   ;(async function() {
//     let templatePath = FileTools.appendingHomeDirectory(
//       ConstPath.UserPath +
//         (_params.user.currentUser.userName || 'Customer') +
//         '/' +
//         ConstPath.RelativePath.ExternalData,
//     )
//     FileTools.getFilterFiles(templatePath, { smwu: 'smwu', sxwu: 'sxwu' }).then(
//       async listData => {
//         let tpList = []
//         for (let i = 0; i < listData.length; i++) {
//           let item = listData[i]
//           let path = item.filePath
//           let is3D = await SScene.is3DWorkspace({ server: path })
//           if (!is3D) {
//             tpList.push({
//               name: item.fileName,
//               path: item.filePath,
//             })
//           }
//         }
//
//         let data = [
//           {
//             title: Const.INFORMATION,
//             data: tpList,
//           },
//         ]
//         _params.setToolbarVisible(true, ConstToolType.MAP_IMPORT_TEMPLATE, {
//           containerType: 'list',
//           height: ConstToolType.HEIGHT[3],
//           data,
//         })
//       },
//     )
//   }.bind(this)())
//   // NativeMethod.getTemplates(_params.user.currentUser.userName).then(
//   //   async templateList => {
//   //     let tpList = []
//   //     for (let i = 0; i < templateList.length; i++) {
//   //       let item = templateList[i]
//   //       let path = await FileTools.appendingHomeDirectory(item.path)
//   //       let is3D = await SScene.is3DWorkspace({ server: path })
//   //       if (!is3D) {
//   //         tpList.push(item)
//   //       }
//   //     }
//   //     let data = [
//   //       {
//   //         title: Const.MODULE,
//   //         data: tpList,
//   //       },
//   //     ]
//   //     _params.setToolbarVisible(true, ConstToolType.MAP_IMPORT_TEMPLATE, {
//   //       containerType: 'list',
//   //       height: ConstToolType.HEIGHT[3],
//   //       data,
//   //     })
//   //   },
//   // )
// }

/** 打开模板 **/
function openTemplate() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  // ;(async function() {
  //   _params.setContainerLoading &&
  //     _params.setContainerLoading(true, ConstInfo.TEMPLATE_LIST_LOADING)
  //   let templatePath = await FileTools.appendingHomeDirectory(
  //     ConstPath.UserPath +
  //       (_params.user.currentUser.userName || 'Customer') +
  //       '/' +
  //       ConstPath.RelativePath.ExternalData,
  //   )
  //   FileTools.getFilterFiles(templatePath, { smwu: 'smwu', sxwu: 'sxwu' }).then(
  //     async listData => {
  //       let tpList = []
  //       for (let i = 0; i < listData.length; i++) {
  //         let item = listData[i]
  //         let path = item.filePath
  //         let is3D = await SScene.is3DWorkspace({ server: path })
  //         if (!is3D) {
  //           tpList.push({
  //             name: item.fileName,
  //             path: item.filePath,
  //           })
  //         }
  //       }
  //
  //       let data = [
  //         {
  //           title: Const.CREATE_SYMBOL_COLLECTION,
  //           data: [],
  //         },
  //         {
  //           title: Const.MODULE,
  //           data: tpList,
  //         },
  //       ]
  //       _params.setToolbarVisible(true, ConstToolType.MAP_TEMPLATE, {
  //         containerType: 'list',
  //         height: ConstToolType.HEIGHT[3],
  //         data,
  //       })
  //       _params.setContainerLoading && _params.setContainerLoading(false)
  //     },
  //   )
  // }.bind(this)())
  NativeMethod.getTemplates(_params.user.currentUser.userName).then(
    async templateList => {
      let tpList = []
      for (let i = 0; i < templateList.length; i++) {
        let item = templateList[i]
        let path = await FileTools.appendingHomeDirectory(item.path)
        let is3D = await SScene.is3DWorkspace({ server: path })
        if (!is3D) {
          tpList.push(item)
        }
      }
      let data = [
        {
          title: Const.CREATE_SYMBOL_COLLECTION,
          data: [],
        },
        {
          title: Const.MODULE,
          data: tpList,
        },
      ]
      _params.setToolbarVisible(true, ConstToolType.MAP_TEMPLATE, {
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

/** 新建 **/
function create() {
  if (GLOBAL.Type === constants.COLLECTION) {
    openWorkspace()
  }
  if (
    GLOBAL.Type === constants.MAP_EDIT ||
    GLOBAL.Type === constants.MAP_THEME
  ) {
    (async function() {
      await _params.closeMap()

      let userPath =
        ConstPath.UserPath +
        (_params.user.currentUser.userName || 'Customer') +
        '/'
      let fillLibPath = await FileTools.appendingHomeDirectory(
        userPath +
          ConstPath.RelativeFilePath.DefaultWorkspaceDir +
          'Workspace.bru',
      )
      let lineLibPath = await FileTools.appendingHomeDirectory(
        userPath +
          ConstPath.RelativeFilePath.DefaultWorkspaceDir +
          'Workspace.lsl',
      )
      let markerLibPath = await FileTools.appendingHomeDirectory(
        userPath +
          ConstPath.RelativeFilePath.DefaultWorkspaceDir +
          'Workspace.sym',
      )
      await SMap.importSymbolLibrary(fillLibPath) // 导入面符号库
      await SMap.importSymbolLibrary(lineLibPath) // 导入线符号库
      await SMap.importSymbolLibrary(markerLibPath) // 导入点符号库
      // await _params.setCurrentMap()
      // await SMap.removeAllLayer() // 移除所有图层
      // await SMap.closeDatasource(-1) // 关闭所有数据源
    }.bind(this)())
  }
}

/** 历史 **/
function showHistory() {
  let userName = _params.user.currentUser.userName || 'Customer'
  let latestMap = []
  if (
    _params.map.latestMap &&
    _params.map.latestMap[userName] &&
    _params.map.latestMap[userName][GLOBAL.Type]
  ) {
    latestMap = _params.map.latestMap[userName][GLOBAL.Type]
  }
  latestMap.forEach(item => {
    item.image = require('../../../../assets/mapToolbar/list_type_map.png')
  })
  let data = [
    {
      title: Const.HISTORY,
      data: latestMap,
    },
  ]
  _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
    containerType: 'list',
    height: ConstToolType.HEIGHT[3],
    data,
  })
}

/** 切换底图 **/
function changeBaseLayer(type) {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  switch (type) {
    case 'MAP_3D':
      _params.setToolbarVisible(true, ConstToolType.MAP3D_BASE, {
        containerType: 'list',
        isFullScreen: true,
      })
      break
    default:
      _params.setToolbarVisible(true, ConstToolType.MAP_BASE, {
        containerType: 'list',
        height: ConstToolType.HEIGHT[3],
        isFullScreen: true,
      })
      break
  }
}

// /** 导出成图片 **/
// function outPutMap() {
//
// }

function setSaveViewVisible(visible) {
  if (!_params.setSaveViewVisible) return
  GLOBAL.isBackHome = false
  GLOBAL.isCreateThemeMap = true
  _params.setSaveViewVisible(visible)
}

/**新建专题图 **/
function createThemeMap() {
  let isAnyMapOpened = true //是否有打开的地图
  SMap.mapIsModified().then(async result => {
    isAnyMapOpened = await SMap.isAnyMapOpened()
    if (isAnyMapOpened && result) {
      setSaveViewVisible(true)
    } else {
      //先关闭地图
      if (isAnyMapOpened) {
        _params.setContainerLoading &&
          _params.setContainerLoading(true, '正在关闭当前地图')
        if (!_params.closeMap) return
        _params.closeMap()
        _params.setContainerLoading && _params.setContainerLoading(false)
      }

      if (!_params.setToolbarVisible) return
      _params.showFullMap && _params.showFullMap(true)

      Orientation.getOrientation((e, orientation) => {
        let column = orientation === 'PORTRAIT' ? 3 : 8
        let height =
          orientation === 'PORTRAIT'
            ? ConstToolType.HEIGHT[0]
            : ConstToolType.HEIGHT[0]

        _params.setToolbarVisible(true, ConstToolType.MAP_THEME_START_CREATE, {
          containerType: 'table',
          isFullScreen: true,
          isTouchProgress: false,
          showMenuDialog: false,
          column: column,
          height: height,
        })
      })
    }
  })
}

/** 添加 **/
// function add(type) {
//   if (!_params.setToolbarVisible) return
//   _params.showFullMap && _params.showFullMap(true)
//
//   switch (type) {
//     case 'MAP_3D':
//       _params.setToolbarVisible(true, ConstToolType.MAP3D_ADD_LAYER, {
//         containerType: 'list',
//         isFullScreen: true,
//         height: ConstToolType.HEIGHT[3],
//       })
//       break
//
//     default:
//       _params.setToolbarVisible(true, ConstToolType.MAP_ADD_LAYER, {
//         containerType: 'list',
//         isFullScreen: false,
//         height: ConstToolType.THEME_HEIGHT[3],
//       })
//       break
//   }
// }

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

export default {
  getStart,
  setParams,
}
