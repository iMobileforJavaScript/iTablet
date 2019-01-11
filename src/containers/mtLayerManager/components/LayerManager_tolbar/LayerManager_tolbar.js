import React from 'react'
import { screen, Toast } from '../../../../utils/index'
import { ConstToolType } from '../../../../constants/index'
import { layersetting, layerThemeSetting } from './LayerToolbarData'
import { View, TouchableOpacity, Animated } from 'react-native'
import ToolBarSectionList from '../../../workspace/components/ToolBar/ToolBarSectionList'
import styles from './styles'
import { SMap } from 'imobile_for_reactnative'

/** 工具栏类型 **/
const list = 'list'

export default class LayerManager_tolbar extends React.Component {
  props: {
    type?: string,
    containerProps?: Object,
    data: Array,
    existFullMap: () => {},
    layerdata?: Object,
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
      layerdata: props.layerdata,
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
      case ConstToolType.MAP_THEME_STYLE:
        data = layerThemeSetting
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
        layerdata: params.layerdata,
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
        await SMap.removeLayer(this.state.layerdata.name)
        await this.props.getLayers()
      }.bind(this)())
      this.setVisible(false)
    } else if (section.title === '取消') {
      this.setVisible(false)
    } else if (section.title === '新建专题图') {
      let themeType = this.state.layerdata.themeType
      let type = this.state.layerdata.type
      if (parseInt(themeType) > 0) {
        Toast.show('不支持由该图层创建专题图')
      } else if (
        parseInt(type) === 1 ||
        parseInt(type) === 3 ||
        parseInt(type) === 5
      ) {
        //由图层创建专题图(点，线，面)
        this.setVisible(false)
        GLOBAL.toolBox.setVisible(
          true,
          ConstToolType.MAP_THEME_CREATE_BY_LAYER,
          {
            isFullScreen: true,
            column: 3,
            height: ConstToolType.HEIGHT[0],
            createThemeByLayer: this.state.layerdata.name,
          },
        )
        GLOBAL.toolBox.showFullMap()
        // eslint-disable-next-line react/prop-types
        this.props.navigation.navigate('MapView')
      } else {
        Toast.show('不支持由该图层创建专题图')
      }
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
        // activeOpacity={0.4}
        underlayColor={'#rgba(105, 105, 105, 0.8)'}
        sectionStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F0F0F0',
        }}
        sectionTitleStyle={{
          marginLeft: 0,
          color: 'black',
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
          case ConstToolType.MAP_THEME_STYLE:
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
