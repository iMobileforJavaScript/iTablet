import {
  ConstToolType,
  legendColor,
  ToolbarType,
} from '../../../../../../constants'
import { getPublicAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import ToolbarBtnType from '../../ToolbarBtnType'
import ToolbarModule from '../ToolbarModule'
import LegendAction from './LegendAction'

function getData(type) {
  let data = [],
    buttons = getButtons(type)

  switch (type) {
    case ConstToolType.LEGEND:
      data = legendColor
      break
    case ConstToolType.LEGEND_NOT_VISIBLE:
    default:
      data = legendColor
      break
  }
  return { data, buttons }
}

function getMenuData(type) {
  const _params = ToolbarModule.getParams()
  let data = [
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLOR,
      action: () => {
        let height, column
        if (_params.device.orientation === 'PORTRAIT') {
          height = ConstToolType.THEME_HEIGHT[3]
          column = 8
        } else {
          height = ConstToolType.THEME_HEIGHT[2]
          column = 16
        }
        GLOBAL.toolBox && GLOBAL.toolBox.menu()
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
            containerType: ToolbarType.colorTable,
            column,
            isFullScreen: false,
            height,
            buttons: getButtons(type),
            selectName: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_COLOR,
            selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLOR,
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLOR,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLOR,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLUMN,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setState({
            isTouchProgress: true,
            showMenuDialog: false,
            selectName: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_COLUMN,
            selectKey: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_COLUMN,
            buttons: getButtons(type),
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLUMN,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLUMN,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_WIDTH,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setState({
            isTouchProgress: true,
            showMenuDialog: false,
            selectName: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_WIDTH,
            selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_WIDTH,
            buttons: getButtons(type),
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_WIDTH,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_WIDTH,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_HEIGHT,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setState({
            isTouchProgress: true,
            showMenuDialog: false,
            selectName: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_HEIGHT,
            selectKey: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_HEIGHT,
            buttons: getButtons(type),
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_HEIGHT,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_HEIGHT,
    },
  ]
  return data
}

function getButtons(type) {
  let buttons = []
  switch (type) {
    case ConstToolType.LEGEND_NOT_VISIBLE:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.VISIBLE,
          action: LegendAction.changeLegendVisible,
          image: getPublicAssets().mapTools.tools_legend_on,
        },
        ToolbarBtnType.MENU,
        // ToolbarBtnType.FLEX,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.LEGEND:
    default:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.NOT_VISIBLE,
          action: LegendAction.changeLegendVisible,
          image: getPublicAssets().mapTools.tools_legend_off,
        },
        ToolbarBtnType.MENU,
        // ToolbarBtnType.FLEX,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
  }
  return buttons
}

export default {
  getData,
  getMenuData,

  getButtons,
}
