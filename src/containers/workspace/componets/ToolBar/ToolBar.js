import React from 'react'
import { scaleSize, screen } from '../../../../utils'
import { color, zIndexLevel } from '../../../../styles'
import { MTBtn, TableList } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SectionList,
  Animated,
} from 'react-native'

const list = 'list'
const table = 'table'
/** 地图按钮类型 **/
const cancel = 'cancel' // 取消
const flex = 'flex' // 伸缩
const style = 'style' // 样式
const commit = 'commit' // 提交
const placeholder = 'placeholder' // 占位

// /** 地图功能列表类型 **/
// const MAP_COLLECTION = 'MAP_COLLECTION'
// const MAP_EDIT = 'MAP_EDIT'
// const MAP_3D = 'MAP_3D'

const HEIGHT = [scaleSize(280), scaleSize(410), scaleSize(560)]
const DEFAULT_COLUMN = 4
const DEFAULT_FULL_SCREEN = true
const BUTTON_HEIGHT = scaleSize(80)

export default class ToolBar extends React.Component {
  props: {
    children: any,
    type?: string,
    containerProps?: Object,
    data: Array,
    existFullMap: () => {},
  }

  static defaultProps = {
    containerProps: {
      data: [],
      containerType: table,
      height: HEIGHT[0],
      isFullScreen: DEFAULT_FULL_SCREEN,
      column: DEFAULT_COLUMN, // 只有table可以设置
    },
  }

  constructor(props) {
    super(props)
    this.state = {
      // isShow: false,
      type: props.type,
      containerType: props.containerProps.containerType,
      isFullScreen: props.containerProps.isFullScreen,
      height: props.containerProps.height,
      column: props.containerProps.column,
      // data: this.getData(props.type),
      data: [],
      buttons: [],
      bottom: new Animated.Value(-screen.deviceHeight),
      boxHeight: new Animated.Value(
        props.containerProps.height - BUTTON_HEIGHT,
      ),
    }
    this.isShow = false
    this.isBoxShow = true
  }

  getData = type => {
    let data = [],
      buttons = []
    switch (type) {
      case ConstToolType.MAP_BASE:
        buttons = [cancel]
        break
      case ConstToolType.MAP_ADD_LAYER:
        buttons = [cancel, placeholder, commit]
        break
      case ConstToolType.MAP_SYMBOL:
        buttons = [cancel]
        break
      case ConstToolType.MAP_COLLECTION:
        data = [
          {
            key: 'gpsPoint',
            title: 'GPS打点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'gpsPath',
            title: 'GPS轨迹',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        buttons = [cancel, flex]
        break
      case ConstToolType.MAP_EDIT_REGION:
        data = [
          {
            key: 'addPoint',
            title: '添加节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'editPoint',
            title: '编辑节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        buttons = [cancel, flex]
        break
      case ConstToolType.MAP_EDIT_LINE:
        data = [
          {
            key: 'addPoint',
            title: '添加节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'editPoint',
            title: '编辑节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        buttons = [cancel, flex]
        break
      case ConstToolType.MAP_EDIT_POINT:
        data = [
          {
            key: 'addPoint',
            title: '添加节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'editPoint',
            title: '编辑节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        buttons = [cancel, flex]
        break
      case ConstToolType.MAP_TOOL:
        buttons = [cancel, flex]
        break
    }
    return { data, buttons }
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
  setVisible = (isShow, type = this.state.type, params = {}) => {
    if (this.isShow === isShow) return
    if (
      this.state.type !== type ||
      params.isFullScreen !== this.state.isFullScreen ||
      params.height !== this.state.height ||
      params.column !== this.state.column
    ) {
      let { data, buttons } = this.getData(type)
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          isFullScreen:
            params && params.isFullScreen !== undefined
              ? params.isFullScreen
              : DEFAULT_FULL_SCREEN,
          height:
            params && typeof params.height === 'number'
              ? params.height
              : HEIGHT[0],
          column:
            params && typeof params.column === 'number'
              ? params.column
              : DEFAULT_COLUMN,
          containerType:
            params && typeof params.containerType
              ? params.containerType
              : table,
        },
        () => {
          this.showToolbar(isShow)
          !isShow && this.props.existFullMap && this.props.existFullMap()
        },
      )
    } else {
      this.showToolbar(isShow)
      !isShow && this.props.existFullMap && this.props.existFullMap()
    }
    this.isBoxShow = true
  }

  showToolbar = isShow => {
    if (this.isShow === isShow) return
    Animated.timing(this.state.bottom, {
      toValue: isShow ? 0 : -screen.deviceHeight,
      duration: 300,
    }).start()
    setTimeout(() => {
      Animated.timing(this.state.boxHeight, {
        toValue: this.state.height - BUTTON_HEIGHT,
        duration: 0,
      }).start()
    }, 300)
    this.isShow = isShow
  }

  close = () => {
    this.showToolbar(false)
    this.props.existFullMap && this.props.existFullMap()
  }

  commit = () => {
    this.showToolbar(false)
    this.props.existFullMap && this.props.existFullMap()
  }

  showBox = () => {
    Animated.timing(this.state.boxHeight, {
      toValue: this.isBoxShow ? 0 : this.state.height - BUTTON_HEIGHT,
      duration: 300,
    }).start()
    this.isBoxShow = !this.isBoxShow
  }

  renderList = () => {
    if (this.state.data.length === 0) return
    return (
      <SectionList
        sections={this.state.data}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={item.action}>
              <Text style={styles.item}>{item.title}</Text>
            </TouchableOpacity>
          )
        }}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item, index) => index}
      />
    )
  }

  renderTable = () => {
    return (
      <TableList
        data={this.state.data}
        numColumns={this.state.column}
        renderCell={this._renderItem}
      />
    )
  }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    return (
      <MTBtn
        style={[styles.cell, { width: screen.deviceWidth / this.state.column }]}
        key={rowIndex + '-' + cellIndex}
        title={item.title}
        textColor={'white'}
        size={MTBtn.Size.NORMAL}
        image={item.image}
        onPress={item.action}
      />
    )
  }

  renderView = () => {
    let box
    switch (this.state.containerType) {
      case list:
        box = this.renderList()
        break
      case table:
      default:
        box = this.renderTable()
    }
    return (
      <Animated.View style={{ height: this.state.boxHeight }}>
        {box}
      </Animated.View>
    )
  }

  renderBottomBtn = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => item.action(item)}
        style={styles.button}
      >
        <Image style={styles.img} resizeMode={'contain'} source={item.image} />
      </TouchableOpacity>
    )
  }

  renderBottomBtns = () => {
    let btns = []
    this.state.buttons.forEach((type, index) => {
      switch (type) {
        case cancel:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/cancel.png'),
                action: this.close,
              },
              index,
            ),
          )
          break
        case flex:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/cancel.png'),
                action: this.showBox,
              },
              index,
            ),
          )
          break
        case style:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/cancel.png'),
                action: this.showBox,
              },
              index,
            ),
          )
          break
        case commit:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/commit.png'),
                action: this.commit,
              },
              index,
            ),
          )
          break
        case placeholder:
          btns.push(<View key={type + '-' + index} />)
          break
      }
    })
    return <View style={styles.buttonz}>{btns}</View>
  }

  render() {
    let containerStyle = this.state.isFullScreen
      ? styles.fullContainer
      : styles.wrapContainer
    return (
      <Animated.View style={[containerStyle, { bottom: this.state.bottom }]}>
        {this.state.isFullScreen && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setVisible(false)}
            style={styles.overlay}
          />
        )}
        <View style={styles.containers}>
          {this.renderView()}
          {this.renderBottomBtns()}
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  fullContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    height: screen.deviceHeight,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  wrapContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    // zIndex: zIndexLevel.FOUR,
  },
  containers: {
    flexDirection: 'column',
    width: '100%',
    maxHeight: scaleSize(600),
    minHeight: BUTTON_HEIGHT,
    backgroundColor: color.theme,
    // zIndex: zIndexLevel.FOUR,
  },
  buttonz: {
    flexDirection: 'row',
    height: BUTTON_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    height: scaleSize(60),
    width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.theme,
  },
  img: {
    height: scaleSize(40),
    width: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 23,
    fontWeight: 'bold',
    backgroundColor: color.theme,
    color: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    paddingLeft: 20,
    height: 44,
    backgroundColor: color.theme,
    color: 'white',
  },
  cell: {
    // flex: 1,
  },
})
