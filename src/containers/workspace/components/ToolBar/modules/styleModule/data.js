import ToolbarBtnType from '../../ToolbarBtnType'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'

const line = (param, orientation = 'PORTRAIT') => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    //'符号线',
    action: () => {
      let height, column
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 8
      }
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.STYLE_SYMBOL, {
          containerType: ToolbarType.symbol,
          isFullScreen: false,
          column,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    //'符号线',
    selectName: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    //'符号线',
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
        })
    },
    //线宽
    selectName: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      let height, column
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.HEIGHT[2]
        column = 12
      }
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.LINECOLOR_SET, {
          containerType: ToolbarType.colorTable,
          column,
          isFullScreen: false,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
  },
]

const point = (param, orientation = 'PORTRAIT') => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      let height, column
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 8
      }
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
          containerType: ToolbarType.symbol,
          isFullScreen: false,
          column,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
          selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      let height, column
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.HEIGHT[2]
        column = 12
      }
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.POINTCOLOR_SET, {
          containerType: ToolbarType.colorTable,
          column,
          isFullScreen: false,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
  },
]

const region = (param, orientation = 'PORTRAIT') => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    //'面符号',
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      let height, column
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 8
      }
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
          containerType: ToolbarType.symbol,
          isFullScreen: false,
          column,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    //'面符号',
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FOREGROUND,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      let height, column
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 12
      }
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONBEFORECOLOR_SET, {
          containerType: ToolbarType.colorTable,
          column,
          isFullScreen: false,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_FOREGROUND,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FOREGROUND,
  },
  // {
  //   key: getLanguage(param).Map_Main_Menu.STYLE_BACKGROUND,
  //   action: () => {
  //     GLOBAL.toolBox && GLOBAL.toolBox.menu()
  //     let height, column
  //     if (orientation === 'PORTRAIT') {
  //       height = ConstToolType.THEME_HEIGHT[3]
  //       column = 8
  //     } else {
  //       height = ConstToolType.TOOLBAR_HEIGHT_2[3]
  //       column = 12
  //     }
  //     GLOBAL.toolBox &&
  //       GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONAFTERCOLOR_SET, {
  //         containerType: ToolbarType.colorTable,
  //         column,
  //         isFullScreen: false,
  //         height,
  //         buttons: [
  //           ToolbarBtnType.CANCEL,
  //           ToolbarBtnType.MENU,
  //           ToolbarBtnType.MENU_FLEX,
  //           ToolbarBtnType.TOOLBAR_COMMIT,
  //         ],
  //         selectKey: getLanguage(param).Map_Main_Menu.STYLE_BACKGROUND,
  //       })
  //   },
  //   selectKey: getLanguage(param).Map_Main_Menu.STYLE_BACKGROUND,
  // },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BORDER,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      let height, column
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 12
      }
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONBORDERCOLOR_SET, {
          containerType: ToolbarType.colorTable,
          column,
          isFullScreen: false,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_BORDER,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_BORDER,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BORDER_WIDTH,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.STYLE_BORDER_WIDTH,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_BORDER_WIDTH,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_BORDER_WIDTH,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
  },
  // {
  //   key: '渐变',
  //   action: () => {
  //     GLOBAL.toolBox && GLOBAL.toolBox.setState({
  //       isTouchProgress: true,
  //       showMenuDialog: false,
  //       buttons: [
  //         ToolbarBtnType.CANCEL,
  //         ToolbarBtnType.MENUS,
  //         ToolbarBtnType.PLACEHOLDER,
  //       ],
  //     })
  //   },
  // },
]

const grid = param => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.CONTRAST,
          selectKey: getLanguage(param).Map_Main_Menu.CONTRAST,
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.CONTRAST,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
  },
]

const colors = [
  '#FFFFFF',
  '#000000',
  '#F0EDE1',
  '#1E477C',
  '#4982BC',
  '#00A1E9',
  '#803000',
  '#BD5747',
  '#36E106',
  '#9CBB58',
  '#8364A1',
  '#4AADC7',
  '#F89746',
  '#E7A700',
  '#E7E300',
  '#D33248',
  '#F1F1F1',
  '#7D7D7D',
  '#DDD9C3',
  '#C9DDF0',
  '#DBE4F3',
  '#BCE8FD',
  '#E5C495',
  '#F4DED9',
  '#DBE9CE',
  '#EBF4DE',
  '#E5E1ED',
  '#DDF0F3',
  '#FDECDC',
  '#FFE7C4',
  '#FDFACA',
  '#F09CA0',
  '#D7D7D7',
  '#585858',
  '#C6B797',
  '#8CB4EA',
  '#C1CCE4',
  '#7ED2F6',
  '#B1894F',
  '#E7B8B8',
  '#B0D59A',
  '#D7E3BD',
  '#CDC1D9',
  '#B7DDE9',
  '#FAD6B1',
  '#F5CE88',
  '#FFF55A',
  '#EF6C78',
  '#BFBFBF',
  '#3E3E3E',
  '#938953',
  '#548ED4',
  '#98B7D5',
  '#00B4F0',
  '#9A6C34',
  '#D79896',
  '#7EC368',
  '#C5DDA5',
  '#B1A5C6',
  '#93CDDD',
  '#F9BD8D',
  '#F7B550',
  '#FFF100',
  '#E80050',
  '#A6A6A7',
  '#2D2D2B',
  '#494428',
  '#1D3A5F',
  '#376192',
  '#00A1E9',
  '#825320',
  '#903635',
  '#13B044',
  '#76933C',
  '#5E467C',
  '#31859D',
  '#E46C07',
  '#F39900',
  '#B7AB00',
  '#A50036',
  '#979D99',
  '#0C0C0C',
  '#1C1A10',
  '#0C263D',
  '#1D3A5F',
  '#005883',
  '#693904',
  '#622727',
  '#005E14',
  '#4F6028',
  '#3E3050',
  '#245B66',
  '#974805',
  '#AD6A00',
  '#8B8100',
  '#7C0022',
  '#F0DCBE',
  '#F2B1CF',
  '#D3FFBF',
  '#00165F',
  '#6673CB',
  '#006EBF',
  '#89CF66',
  '#70A900',
  '#13B044',
  '#93D150',
  '#70319F',
  '#00B4F0',
  '#D38968',
  '#FFBF00',
  '#FFFF00',
  '#C10000',
  '#F0F1A6',
  '#FF0000',
]

const colorsWithNull = [
  {
    key: 'NULL',
    text: 'NULL',
  },
].concat(colors)

export { line, point, region, grid, colors, colorsWithNull }
