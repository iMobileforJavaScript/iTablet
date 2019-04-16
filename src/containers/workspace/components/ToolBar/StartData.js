import { FileTools, NativeMethod } from '../../../../native'
import {
  ConstToolType,
  ConstInfo,
  ConstPath,
  // Const,
  UserType,
  ConstOnline,
} from '../../../../constants'
import { Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import constants from '../../constants'
// import Orientation from 'react-native-orientation'
let _params = {}
import { SMap, SScene } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language/index'
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
          title: getLanguage(global.language).Map_Main_Menu.START_OPEN_MAP,
          //constants.OPEN,
          action: openMap,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_open_black.png'),
        },
        {
          key: constants.CREATE,
          title: getLanguage(global.language).Map_Main_Menu.START_NEW_MAP,
          //constants.CREATE,
          size: 'large',
          action: () => isNeedToSave(create),
          image: require('../../../../assets/mapTools/icon_create_black.png'),
        },
        {
          key: constants.HISTORY,
          title: getLanguage(global.language).Map_Main_Menu.START_RECENT,
          //constants.HISTORY,
          size: 'large',
          action: showHistory,
          image: require('../../../../assets/mapTools/icon_history_black.png'),
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
          title: getLanguage(global.language).Map_Main_Menu.START_SAVE_MAP,
          //constants.SAVE,
          size: 'large',
          // TODO 保存地图
          action: () => saveMap('TempMap'),
          image: require('../../../../assets/mapTools/icon_save_black.png'),
        },
        {
          key: constants.SAVE_AS,
          title: getLanguage(global.language).Map_Main_Menu.START_SAVE_AS_MAP,
          //constants.SAVE_AS,
          size: 'large',
          action: saveMapAs,
          image: require('../../../../assets/mapTools/icon_save_as_black.png'),
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
          title: getLanguage(global.language).Map_Main_Menu.START_OPEN_SENCE,
          //'打开场景',
          action: () => {
            if (!_params.setToolbarVisible) return
            _params.setToolbarVisible(
              true,
              ConstToolType.MAP3D_WORKSPACE_LIST,
              {
                containerType: 'list',
                isFullScreen: true,
              },
            )
          },
          size: 'large',
          image: require('../../../../assets/mapTools/icon_open_black.png'),
        },
        // {
        //   key: constants.BASE_MAP,
        //   title: constants.BASE_MAP,
        //   size: 'large',
        //   action: () => {
        //     changeBaseLayer('MAP_3D')
        //   },
        //   image: require('../../../../assets/mapTools/icon_base_black.png'),
        // },
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
          title: getLanguage(global.language).Map_Main_Menu.START_OPEN_MAP,
          //constants.OPEN,
          action: openMap,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_open_black.png'),
        },
        {
          key: constants.CREATE,
          title: getLanguage(global.language).Map_Main_Menu.START_NEW_MAP,
          //constants.CREATE,
          size: 'large',
          action: () => isNeedToSave(openTemplate),
          image: require('../../../../assets/mapTools/icon_create_black.png'),
        },
        {
          key: constants.HISTORY,
          title: getLanguage(global.language).Map_Main_Menu.START_RECENT,
          //constants.HISTORY,
          size: 'large',
          action: showHistory,
          image: require('../../../../assets/mapTools/icon_history_black.png'),
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
          title: getLanguage(global.language).Map_Main_Menu.START_SAVE_MAP,
          //constants.SAVE,
          size: 'large',
          // TODO 保存地图
          action: () => saveMap('TempMap'),
          image: require('../../../../assets/mapTools/icon_save_black.png'),
        },
        {
          key: constants.SAVE_AS,
          title: getLanguage(global.language).Map_Main_Menu.START_SAVE_AS_MAP,
          //constants.SAVE_AS,
          size: 'large',
          action: saveMapAs,
          image: require('../../../../assets/mapTools/icon_save_as_black.png'),
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
          title: getLanguage(global.language).Map_Main_Menu.START_OPEN_MAP,
          //constants.THEME_OPEN,
          action: openMap,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_open_black.png'),
        },
        {
          key: constants.CREATE,
          title: getLanguage(global.language).Map_Main_Menu.START_NEW_MAP,
          //constants.THEME_CREATE,
          size: 'large',
          // action: createThemeMap,
          action: () => isNeedToSave(create),
          image: require('../../../../assets/mapTools/icon_create_black.png'),
        },
        {
          key: constants.HISTORY,
          title: getLanguage(global.language).Map_Main_Menu.START_RECENT,
          //constants.HISTORY,
          size: 'large',
          action: showHistory,
          image: require('../../../../assets/mapTools/icon_history_black.png'),
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
          title: getLanguage(global.language).Map_Main_Menu.START_SAVE_MAP,
          //constants.SAVE,
          size: 'large',
          // TODO 保存地图
          action: () => saveMap('TempMap'),
          image: require('../../../../assets/mapTools/icon_save_black.png'),
        },
        {
          key: constants.SAVE_AS,
          title: getLanguage(global.language).Map_Main_Menu.START_SAVE_AS_MAP,
          //constants.SAVE_AS,
          size: 'large',
          action: saveMapAs,
          image: require('../../../../assets/mapTools/icon_save_as_black.png'),
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

    // let customerPath =
    //   (await FileTools.appendingHomeDirectory(ConstPath.CustomerPath)) +
    //   ConstPath.RelativeFilePath.Map
    // // let fileList = await FileTools.getPathListByFilter(customerPath, {
    // //   extension: 'xml',
    // //   type: 'file',
    // // })
    // let fileList = await FileTools.getMaps(customerPath)
    let userFileList
    // if (
    //   _params.user &&
    //   _params.user.currentUser.userName &&
    //   _params.user.currentUser.userType !== UserType.PROBATION_USER
    // ) {
    // userFileList = await FileTools.getPathListByFilter(path, {
    //   extension: 'xml',
    //   type: 'file',
    // })
    userFileList = await FileTools.getMaps(path)
    // }

    // let list = []
    // fileList.forEach(item => {
    //   let name = item.name
    //   item.title = name
    //   item.name = name.split('.')[0]
    //   item.image = item.isTemplate
    //     ? require('../../../../assets/mapToolbar/list_type_template_black.png')
    //     : require('../../../../assets/mapToolbar/list_type_map_black.png')
    //   item.info = {
    //     infoType: 'mtime',
    //     lastModifiedDate: item.mtime,
    //     isTemplate: item.isTemplate,
    //   }
    //   list.push(item)
    // })
    // data = [
    //   {
    //     title:
    //       _params.user &&
    //       _params.user.currentUser.userName &&
    //       _params.user.currentUser.userType !== UserType.PROBATION_USER
    //         ? '游客地图'
    //         : '我的地图',
    //     image: require('../../../../assets/mapToolbar/list_type_maps.png'),
    //     data: list,
    //   },
    // ]
    if (userFileList && userFileList.length > 0) {
      let userList = []
      userFileList.forEach(item => {
        let name = item.name
        item.title = name
        item.name = name.split('.')[0]
        item.image = item.isTemplate
          ? require('../../../../assets/mapToolbar/list_type_template_black.png')
          : require('../../../../assets/mapToolbar/list_type_map_black.png')
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
          isTemplate: item.isTemplate,
        }
        userList.push(item)
      })
    }
    data.push({
      title: getLanguage(global.language).Map_Main_Menu.OPEN_MAP,
      //'我的地图',
      image: require('../../../../assets/mapToolbar/list_type_maps.png'),
      data: userFileList || [],
    })
    _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
      containerType: 'list',
      height:
        _params.device.orientation === 'LANDSCAPE'
          ? ConstToolType.THEME_HEIGHT[4]
          : ConstToolType.HEIGHT[3],
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

/** 判断是否保存 **/
function isNeedToSave(cb = () => {}) {
  let isAnyMapOpened = true //是否有打开的地图
  SMap.mapIsModified().then(async result => {
    isAnyMapOpened = await SMap.isAnyMapOpened()
    if (isAnyMapOpened && result) {
      setSaveViewVisible(true, cb)
    } else {
      cb()
    }
  })
}

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
  NativeMethod.getTemplates(
    _params.user.currentUser.userName,
    ConstPath.Module.Collection,
  ).then(async templateList => {
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
        title: getLanguage(global.language).Map_Main_Menu.CREATE_WITH_SYMBOLS,
        //Const.CREATE_SYMBOL_COLLECTION,
        data: [],
      },
      {
        title: getLanguage(global.language).Map_Main_Menu.CREATE_WITH_TEMPLATE,
        //Const.CREATE_MODULE,
        data: tpList,
      },
    ]
    _params.setToolbarVisible(true, ConstToolType.MAP_TEMPLATE, {
      containerType: 'list',
      height: ConstToolType.HEIGHT[3],
      data,
    })
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
      let userPath =
        _params.user.currentUser.userName &&
        _params.user.currentUser.userType !== UserType.PROBATION_USER
          ? ConstPath.UserPath + _params.user.currentUser.userName + '/'
          : ConstPath.CustomerPath
      let mapPath = await FileTools.appendingHomeDirectory(
        userPath + ConstPath.RelativePath.Map,
      )
      let newName = await FileTools.getAvailableMapName(mapPath, 'DefaultMap')
      NavigationService.navigate('InputPage', {
        headerTitle: getLanguage(global.language).Map_Main_Menu.START_NEW_MAP,
        //'新建地图',
        value: newName,
        placeholder: ConstInfo.PLEASE_INPUT_NAME,
        cb: async value => {
          GLOBAL.Loading &&
            GLOBAL.Loading.setLoading(
              true,
              getLanguage(global.language).Prompt.CREATING,
              // ConstInfo.MAP_SYMBOL_COLLECTION_CREATING,
            )
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

          await SMap.openDatasource(
            ConstOnline['Google'].DSParams,
            // ConstOnline['Google'].layerIndex,
            1,
          )
          _params.getLayers && (await _params.getLayers())

          _params.saveMap &&
            (await _params.saveMap({
              mapName: value,
              nModule: GLOBAL.Type,
              notSaveToXML: true,
            }))

          GLOBAL.Loading && GLOBAL.Loading.setLoading(false)

          NavigationService.goBack()
          _params.setToolbarVisible && _params.setToolbarVisible(false)
        },
      })
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
    item.image = require('../../../../assets/mapToolbar/list_type_map_black.png')
  })
  let data = [
    {
      title: getLanguage(global.language).Map_Main_Menu.START_RECENT,
      //Const.HISTORY,
      data: latestMap,
    },
  ]
  _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
    containerType: 'list',
    height:
      _params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[4]
        : ConstToolType.HEIGHT[3],
    data,
  })
}

/** 切换底图 **/
// function changeBaseLayer(type) {
//   if (!_params.setToolbarVisible) return
//   _params.showFullMap && _params.showFullMap(true)

//   switch (type) {
//     case 'MAP_3D':
//       _params.setToolbarVisible(true, ConstToolType.MAP3D_BASE, {
//         containerType: 'list',
//         isFullScreen: true,
//         height: ConstToolType.HEIGHT[2],
//       })
//       break
//     default:
//       _params.setToolbarVisible(true, ConstToolType.MAP_BASE, {
//         containerType: 'list',
//         height: ConstToolType.HEIGHT[3],
//         isFullScreen: true,
//       })
//       break
//   }
// }

// /** 导出成图片 **/
// function outPutMap() {
//
// }

function setSaveViewVisible(visible, cb) {
  if (!_params.setSaveViewVisible) return
  GLOBAL.isBackHome = false
  // _params.setSaveViewVisible(visible)
  GLOBAL.SaveMapView && GLOBAL.SaveMapView.setVisible(visible, null, cb)
}

/**新建专题图 **/
// function createThemeMap() {
//   let isAnyMapOpened = true //是否有打开的地图
//   SMap.mapIsModified().then(async result => {
//     isAnyMapOpened = await SMap.isAnyMapOpened()
//     if (isAnyMapOpened && result) {
//       setSaveViewVisible(true)
//     } else {
//       //先关闭地图
//       if (isAnyMapOpened) {
//         _params.setContainerLoading &&
//           _params.setContainerLoading(true, '正在关闭当前地图')
//         if (!_params.closeMap) return
//         _params.closeMap()
//         _params.setContainerLoading && _params.setContainerLoading(false)
//       }
//
//       if (!_params.setToolbarVisible) return
//       _params.showFullMap && _params.showFullMap(true)
//
//       Orientation.getOrientation((e, orientation) => {
//         let column = orientation === 'PORTRAIT' ? 3 : 8
//         let height =
//           orientation === 'PORTRAIT'
//             ? ConstToolType.HEIGHT[0]
//             : ConstToolType.HEIGHT[0]
//
//         _params.setToolbarVisible(true, ConstToolType.MAP_THEME_START_CREATE, {
//           containerType: 'table',
//           isFullScreen: true,
//           isTouchProgress: false,
//           showMenuDialog: false,
//           column: column,
//           height: height,
//         })
//       })
//     }
//   })
// }

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
  // if (!_params.setSaveViewVisible) return
  // GLOBAL.isBackHome = false
  // _params.setSaveViewVisible(true)

  (async function() {
    try {
      if (GLOBAL.Type === ConstToolType.MAP_3D) {
        GLOBAL.openWorkspace && Toast.show(ConstInfo.SAVE_SCENE_SUCCESS)
        _params.setToolbarVisible && _params.setToolbarVisible(false)
        return
      }

      _params.setContainerLoading &&
        _params.setContainerLoading(true, getLanguage(global.language).Prompt.SAVING)
        //'正在保存地图')
      let mapName = ''
      if (_params.map.currentMap.name) {
        // 获取当前打开的地图xml的名称
        mapName = _params.map.currentMap.name
        mapName =
          mapName.substr(0, mapName.lastIndexOf('.')) ||
          _params.map.currentMap.name
      } else {
        let mapInfo = await SMap.getMapInfo()
        if (mapInfo && mapInfo.name) {
          // 获取MapControl中的地图名称
          mapName = mapInfo.name
        } else if (_params.layers.length > 0) {
          // 获取数据源名称作为地图名称
          mapName = _params.collection.datasourceName
        }
      }
      let addition = {}
      if (_params.map.currentMap.Template) {
        addition.Template = _params.map.currentMap.Template
      }

      let result = await _params.saveMap({ mapName, addition })
      _params.setContainerLoading && _params.setContainerLoading(false)
      result && _params.setToolbarVisible && _params.setToolbarVisible(false)
      Toast.show(
        result ? getLanguage(global.language).Prompt.SAVE_SUCCESSFULLY : ConstInfo.SAVE_MAP_FAILED,
      )
    } catch (e) {
      _params.setContainerLoading && _params.setContainerLoading(false)
      Toast.show(ConstInfo.SAVE_MAP_FAILED)
    }
  })()
}

/** 另存地图 **/
function saveMapAs() {
  (async function() {
    // if (!_params.setSaveMapDialogVisible) return
    // _params.setSaveMapDialogVisible(true)
    let userPath =
      _params.user.currentUser.userName &&
      _params.user.currentUser.userType !== UserType.PROBATION_USER
        ? ConstPath.UserPath + _params.user.currentUser.userName + '/'
        : ConstPath.CustomerPath
    let mapPath = await FileTools.appendingHomeDirectory(
      userPath + ConstPath.RelativePath.Map,
    )
    let newName = await FileTools.getAvailableMapName(
      mapPath,
      _params.map.currentMap.name || 'DefaultMap',
    )
    NavigationService.navigate('InputPage', {
      value: newName,
      headerTitle: getLanguage(global.language).Map_Main_Menu.START_SAVE_AS_MAP,
      //'地图另存',
      placeholder:getLanguage(global.language).Prompt.ENTER_MAP_NAME,
      cb: async value => {
        let addition = {}
        if (
          _params.map &&
          _params.map.currentMap &&
          _params.map.currentMap.Template
        ) {
          addition.Template = _params.map.currentMap.Template
        }
        _params.setToolbarVisible &&
          _params.setToolbarVisible(true,  getLanguage(global.language).Prompt.SAVING)
        _params.saveMap &&
          _params.saveMap({ mapName: value, addition, isNew: true }).then(
            result => {
              _params.setToolbarVisible && _params.setToolbarVisible(false)
              if (result) {
                NavigationService.goBack()
                setTimeout(() => {
                  Toast.show( getLanguage(global.language).Prompt.SAVE_SUCCESSFULLY)
                }, 1000)
              } else {
                Toast.show(ConstInfo.MAP_EXIST)
              }
            },
            () => {
              _params.setToolbarVisible && _params.setToolbarVisible(false)
            },
          )
      },
    })
  })()
}

export default {
  getStart,
  setParams,
}
