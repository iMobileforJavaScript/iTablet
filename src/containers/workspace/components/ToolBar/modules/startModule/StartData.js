import { ConstToolType } from '../../../../../../constants'
import constants from '../../../../constants'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import StartAction from './StartAction'

function getData(type, params) {
  ToolbarModule.setParams(params)
  let data = [],
    buttons = []
  switch (type) {
    case ConstToolType.MAP_3D_START:
      data = [
        // {
        //   key: constants.CREATE,
        //   title: '导入场景',
        //   size: 'large',
        //   action: () => {
        //     if (!ToolbarModule.getParams().setToolbarVisible) return
        //     // ToolbarModule.getParams().setToolbarVisible(false)
        //     // NavigationService.navigate('WorkspaceFileList', { type: 'MAP_3D' })
        //     ToolbarModule.getParams().setToolbarVisible(
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
          action: StartAction.getSceneData,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_open_black.png'),
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
    case ConstToolType.MAP_START:
    case ConstToolType.MAP_ANALYST_START:
    case ConstToolType.MAP_EDIT_START:
    case ConstToolType.MAP_COLLECTION_START:
    case ConstToolType.MAP_PLOTTING_START:
    case ConstToolType.MAP_THEME_START:
    case ConstToolType.MAP_NAVIGATION_START:
      data = [
        // {
        //   key: constants.NAVIGATION,
        //   title: constants.NAVIGATION,
        //   action: naviWorkSpace,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_open_black.png'),
        // },
        {
          key: constants.OPEN,
          title: getLanguage(global.language).Map_Main_Menu.START_OPEN_MAP,
          //constants.OPEN,
          action: StartAction.openMap,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_open_black.png'),
        },
        {
          key: constants.CREATE,
          title: getLanguage(global.language).Map_Main_Menu.START_NEW_MAP,
          //constants.CREATE,
          size: 'large',
          action: () => StartAction.isNeedToSave(StartAction.create),
          image: require('../../../../../../assets/mapTools/icon_create_black.png'),
        },
        {
          key: constants.HISTORY,
          title: getLanguage(global.language).Map_Main_Menu.START_RECENT,
          //constants.HISTORY,
          size: 'large',
          action: StartAction.showHistory,
          image: require('../../../../../../assets/mapTools/icon_history_black.png'),
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
          action: () => StartAction.saveMap('TempMap'),
          image: require('../../../../../../assets/mapTools/icon_save_black.png'),
        },
        {
          key: constants.SAVE_AS,
          title: getLanguage(global.language).Map_Main_Menu.START_SAVE_AS_MAP,
          //constants.SAVE_AS,
          size: 'large',
          action: StartAction.saveMapAs,
          image: require('../../../../../../assets/mapTools/icon_save_as_black.png'),
        },
      ]
      break
  }
  return { data, buttons }
}

export default {
  getData,
}
