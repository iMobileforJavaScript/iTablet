import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getThemeAssets } from '../../../../../../assets'
import NavigationService from '../../../../../NavigationService'
import { scaleSize } from '../../../../../../utils'
import { color } from '../../../../../../styles'
import { Const, TouchType } from '../../../../../../constants'
import ToolbarModule from '../../modules/ToolbarModule'

export default class ToolbarBottomButtons extends React.Component {
  props: {
    selection: Array,
    buttons: Array,
    type: string,
    language: string,
    toolbarStatus: Object,
    close: () => {},
    back: () => {}, // 返回上一个Toolbar状态
    showBox: () => {},
    setVisible: () => {},
    existFullMap: () => {},
    setCurrentLayer: () => {},
    getLayers: () => {},
    showMenuBox: () => {},
    menu: () => {},
  }

  static defaultProps = {
    buttons: [],
  }

  constructor(props) {
    super(props)
    this.lastState = {}
    ToolbarModule.addParams({
      buttonView: this, // ToolbarBottomButtons ref
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    // TODO 根据具体情况，判断是否更新
    if (
      JSON.stringify(this.props.selection) !==
        JSON.stringify(nextProps.selection) ||
      JSON.stringify(this.props.buttons) !==
        JSON.stringify(nextProps.buttons) ||
      JSON.stringify(this.props.toolbarStatus) !==
        JSON.stringify(nextProps.toolbarStatus) ||
      this.props.type !== nextProps.type ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    ) {
      return true
    }
    return false
  }

  //二三维量算功能 撤销事件
  undo = () => {}

  redo = () => {}

  /******************************** 新功能分割线 ********************************/
  /** 提交 **/
  commit = () => {
    let isFinished = false
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.commit
    ) {
      // 返回false表示没有找到对应type的方法，返回undefined表示没有返回值，不作为判断
      isFinished = ToolbarModule.getData().actions.commit(this.props.type)
    }
    if (isFinished === false) {
      this.props.close && this.props.close(this.props.type)
      ToolbarModule.setData() // 关闭Toolbar清除临时数据
    }
  }

  /** 关闭 **/
  close = () => {
    let isFinished = false
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.close
    ) {
      isFinished = ToolbarModule.getData().actions.close(this.props.type)
    }
    if (isFinished === false) {
      this.props.close && this.props.close(this.props.type)
    }
    GLOBAL.TouchType = TouchType.NORMAL
    // ToolbarModule.setData() // 关闭Toolbar清除临时数据
  }

  /** 菜单 **/
  menu = () => {
    // 关系到上层组件state变化，交给上层处理
    this.props.menu && this.props.menu(this.props.type)
  }

  /** 菜单和Box切换显示 **/
  showMenuBox = () => {
    // 关系到上层组件state变化，交给上层处理
    this.props.showMenuBox && this.props.showMenuBox(this.props.type)
  }

  /** 显示属性 **/
  showAttribute = () => {
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.showAttribute
    ) {
      ToolbarModule.getData().actions.showAttribute(this.props.selection)
    }
  }

  /** 显示属性 **/
  matchPictureStyle = () => {
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.matchPictureStyle
    ) {
      ToolbarModule.getData().actions.matchPictureStyle()
    }
  }

  /******************************** 新功能分割线 END********************************/

  /** 记录Toolbar上一次的state **/
  setLastState = () => {
    Object.assign(this.lastState, this.state, { height: this.height })
  }

  renderBottomBtn = (item, index) => {
    return (
      <TouchableOpacity
        key={item.type + '-' + index}
        onPress={() => item.action(item)}
        style={styles.button}
      >
        <Image style={styles.img} resizeMode={'contain'} source={item.image} />
      </TouchableOpacity>
    )
  }

  render() {
    let btns = []
    if (this.props.buttons.length === 0) return null
    this.props.buttons.forEach((item, index) => {
      if (!item || (item instanceof Object && !item.type)) return
      let type, image, action
      if (item instanceof Object) {
        // 自定义Button
        type = item.type
        image = item.image
        action = item.action
      } else {
        // 常用按钮
        type = item
      }
      switch (type) {
        case ToolbarBtnType.TOOLBAR_COMMIT:
          image =
            image ||
            require('../../../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = action || this.commit
          break
        case ToolbarBtnType.TOOLBAR_DONE:
          image = image || getThemeAssets().publicAssets.tab_done
          action = action || this.commit
          break
        case ToolbarBtnType.MENU_FLEX:
          //菜单框-显示与隐藏
          image =
            image ||
            require('../../../../../../assets/mapEdit/icon_function_theme_param_style.png')
          action = action || this.showMenuBox
          break
        case ToolbarBtnType.CANCEL:
        case ToolbarBtnType.THEME_CANCEL: // TODO 待删除
          image =
            image ||
            require('../../../../../../assets/mapEdit/icon_function_cancel.png')
          action = action || this.close
          break
        case ToolbarBtnType.MENU:
          image =
            image ||
            require('../../../../../../assets/mapEdit/icon_function_theme_param_menu.png')
          action = action || this.menu
          break
        case ToolbarBtnType.UNDO:
          //二三维 量算功能 撤销按钮
          if (this.props.toolbarStatus.canUndo) {
            action = action || this.undo
            image = image || getThemeAssets().publicAssets.icon_undo_dark
          } else {
            image = image || getThemeAssets().publicAssets.icon_undo_disable
          }
          break
        case ToolbarBtnType.REDO:
          //二三维 量算功能 撤销按钮
          if (this.props.toolbarStatus.canRedo) {
            action = action || this.redo
            image = image || getThemeAssets().publicAssets.icon_redo_dark
          } else {
            image = image || getThemeAssets().publicAssets.icon_redo_disable
          }
          break
        case ToolbarBtnType.FLEX:
          image = require('../../../../../../assets/mapEdit/icon_function_theme_param_style.png')
          action = () => this.props.showBox()
          break
        case ToolbarBtnType.FLEX_FULL:
          image = require('../../../../../../assets/mapEdit/flex.png')
          action = () => this.props.showBox(true)
          break

        case ToolbarBtnType.COMPLETE:
          image = require('../../../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = this.props.close
          break
        case ToolbarBtnType.CANCEL_2:
          image = require('../../../../../../assets/mapEdit/icon_function_cancel.png')
          action = () => this.props.close(this.props.type, true)
          break
        case ToolbarBtnType.TAGGING_BACK:
          //返回上一级
          image = require('../../../../../../assets/public/Frenchgrey/icon-back-white.png')
          action = this.taggingBack
          break
        case ToolbarBtnType.SHOW_MAP3D_ATTRIBUTE:
          image = require('../../../../../../assets/mapTools/icon_attribute_white.png')
          action = () => {
            NavigationService.navigate('LayerAttribute3D', { type: 'MAP_3D' })
          }
          break
        // case ToolbarBtnType.VISIBLE:
        //   // 图例的显示与隐藏
        //   image = getPublicAssets().mapTools.tools_legend_on
        //   action = this.changeLegendVisible
        //   break
        // case ToolbarBtnType.NOT_VISIBLE:
        //   // 图例的显示与隐藏
        //   image = getPublicAssets().mapTools.tools_legend_off
        //   action = this.changeLegendVisible
        //   break
        case ToolbarBtnType.TOOLBAR_BACK:
          //返回上一级
          image = require('../../../../../../assets/public/Frenchgrey/icon-back-white.png')
          action = this.props.back
          break
      }

      if (type === ToolbarBtnType.PLACEHOLDER) {
        btns.push(<View style={styles.button} key={type + '-' + index} />)
      } else if (image) {
        btns.push(
          this.renderBottomBtn(
            {
              key: type,
              image: image,
              action: () => action && action(this.props.type),
            },
            index,
          ),
        )
      }
    })
    return <View style={styles.buttonz}>{btns}</View>
  }
}

const styles = StyleSheet.create({
  buttonz: {
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    // flex: 1,
    height: scaleSize(60),
    width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.theme,
  },
  img: {
    height: scaleSize(45),
    width: scaleSize(45),
    alignItems: 'center',
    justifyContent: 'center',
  },
})
