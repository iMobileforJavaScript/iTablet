import React from 'react'
import { screen, scaleSize } from '../../../../utils/index'
import { ConstToolType } from '../../../../constants/index'
import { layersetting } from './LayerToolbarData'
import { View, TouchableOpacity, Animated } from 'react-native'
import ToolBarSectionList from '../../../workspace/components/ToolBar/ToolBarSectionList'
import styles from './styles'
import { color, size } from '../../../../styles/index'
import { SMap } from 'imobile_for_reactnative'

/** 工具栏类型 **/
const list = 'list'

export default class LayerManager_tolbar extends React.Component {
  props: {
    type?: string,
    containerProps?: Object,
    data: Array,
    existFullMap: () => {},
    layername: string,
    getLayers: () => {}, // 更新数据（包括其他界面）
  }

  static defaultProps = {
    containerProps: {
      data: [],
      containerType: list,
    },
  }

  constructor(props) {
    super(props)
    this.height =
      props.containerProps.height >= 0
        ? props.containerProps.height
        : props.containerProps.containerType === list
          ? ConstToolType.HEIGHT[3]
          : ConstToolType.HEIGHT[1]
    this.state = {
      type: props.type, // 当前传入的类型
      containerType: props.containerProps.containerType,
      data: [],
      bottom: new Animated.Value(-screen.deviceHeight),
      boxHeight: new Animated.Value(this.height),
      isSelectlist: false,
      listSelectable: false, // 列表是否可以选择（例如地图）
      isTouch: true,
      layername: props.layername,
    }
    this.isShow = false
    this.isBoxShow = true
  }

  getData = type => {
    let data
    switch (type) {
      case ConstToolType.MAP_STYLE:
        data = layersetting
        break
    }
    return data
  }

  showToolbarAndBox = isShow => {
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      Animated.timing(this.state.bottom, {
        toValue: isShow ? 0 : -screen.deviceHeight,
        duration: 300,
      }).start()
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    if (this.state.type === ConstToolType.MAP_THEME_PARAM) {
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: 300,
      }).start()
      this.isBoxShow = false
    } else {
      if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
        Animated.timing(this.state.boxHeight, {
          toValue: this.height,
          duration: 300,
        }).start()
      }
      this.isBoxShow = true
    }
  }

  showToolbar = isShow => {
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      Animated.timing(this.state.bottom, {
        toValue: isShow ? 0 : -screen.deviceHeight,
        duration: 300,
      }).start()
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
      Animated.timing(this.state.boxHeight, {
        toValue: this.height,
        duration: 300,
      }).start()
    }
  }

  /**
   * 设置是否显示
   * isShow: 是否显示
   * type:   显示数据类型
   * params: {
   *   isFullScreen:    是否全屏，
   *   height:          工具栏高度
   *   column:          表格列数（仅table可用）
   *   containerType:   容器的类型, list | table
   * }
   **/
  setVisible = (isShow, type, params = {}) => {
    this.height =
      params && typeof params.height === 'number'
        ? params.height
        : ConstToolType.HEIGHT[1]
    let data = this.getData(type)
    this.setState(
      {
        data: data,
        type: type,
        layername: params.layername,
      },
      () => {
        this.showToolbarAndBox(isShow)
        !isShow && this.props.existFullMap && this.props.existFullMap()
      },
    )
  }

  listAction = ({ section }) => {
    if (section.action) {
      section.action && section.action()
    }
    if (section.title === '移除') {
      (async function() {
        await SMap.removeLayerWithName(this.state.layername)
        await this.props.getLayers()
      }.bind(this)())
      this.setVisible(false)
      GLOBAL.isNewMap = false
    }
  }

  renderList = () => {
    if (this.state.data.length === 0) return
    return (
      <ToolBarSectionList
        ref={ref => (this.toolBarSectionList = ref)}
        listSelectable={this.state.listSelectable}
        sections={this.state.data}
        headerAction={({ section }) => {
          this.listAction({ section })
        }}
        activeOpacity={0.8}
        sectionTitleStyle={{
          marginLeft: scaleSize(60),
          fontSize: size.fontSize.fontSizeLg,
          fontWeight: 'bold',
          color: color.themeText,
        }}
        keyExtractor={(item, index) => index}
      />
    )
  }

  renderView = () => {
    let box
    switch (this.state.containerType) {
      case list:
        switch (this.state.type) {
          case ConstToolType.MAP_STYLE:
            box = this.renderList()
            break
        }
        break
    }
    return (
      <Animated.View style={{ height: this.state.boxHeight }}>
        {box}
      </Animated.View>
    )
  }

  render() {
    let containerStyle = styles.fullContainer
    return (
      <Animated.View style={[containerStyle, { bottom: this.state.bottom }]}>
        {
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setVisible(false)}
            style={styles.overlay}
          />
        }
        <View style={styles.containers}>{this.renderView()}</View>
      </Animated.View>
    )
  }
}
