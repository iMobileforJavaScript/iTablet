import React from 'react'
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
import { MultiPicker } from '../../../../../../components'
function getData(type) {
  const _params = ToolbarModule.getParams()
  let data = [],
    buttons = getButtons(type),
    customView = null
  switch (type) {
    case ConstToolType.LEGEND_POSITION:
      data = getPickerData(_params.mapLegend[GLOBAL.Type].legendPosition)
      customView = () => (
        <MultiPicker
          language={GLOBAL.language}
          confirm={LegendAction.changePosition}
          cancel={LegendAction.cancelSelect}
          popData={data}
          currentPopData={_params.mapLegend[GLOBAL.Type].legendPosition}
          viewableItems={1}
        />
      )
      break
    case ConstToolType.LEGEND:
      data = legendColor
      break
    case ConstToolType.LEGEND_NOT_VISIBLE:
    default:
      data = legendColor
      break
  }
  return { data, buttons, customView }
}

function getPickerData(selectKey) {
  let options = [
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.TOP_LEFT,
      value: 'topLeft',
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.TOP_RIGHT,
      value: 'topRight',
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.LEFT_BOTTOM,
      value: 'leftBottom',
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.RIGHT_BOTTOM,
      value: 'rightBottom',
    },
  ]
  let selectedItem = options.filter(item => item.value === selectKey)[0]
  return [
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_POSITION,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_POSITION,
      initItem: selectedItem,
      children: options,
      selectedItem,
    },
  ]
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
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_FONT,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setState({
            isTouchProgress: true,
            showMenuDialog: false,
            selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_FONT,
            selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_FONT,
            buttons: getButtons(type),
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_FONT,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_FONT,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setState({
            isTouchProgress: true,
            showMenuDialog: false,
            selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
            selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
            buttons: getButtons(type),
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_POSITION,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND_POSITION, {
            isFullScreen: false,
            height: ConstToolType.TOOLBAR_HEIGHT[1],
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
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
