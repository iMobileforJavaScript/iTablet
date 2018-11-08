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

// 工具视图高度级别
const HEIGHT = [scaleSize(100), scaleSize(200), scaleSize(600)]
// 工具表格默认高度
const DEFAULT_COLUMN = 4
// 是否全屏显示，是否有Overlay
const DEFAULT_FULL_SCREEN = true
// 地图按钮栏默认高度
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
      // height: HEIGHT[1],
      isFullScreen: DEFAULT_FULL_SCREEN,
      column: DEFAULT_COLUMN, // 只有table可以设置
    },
  }

  constructor(props) {
    super(props)
    this.height =
      props.containerProps.height >= 0
        ? props.containerProps.height
        : props.containerProps.containerType === list
          ? HEIGHT[2]
          : HEIGHT[1]
    this.state = {
      // isShow: false,
      type: props.type,
      containerType: props.containerProps.containerType,
      isFullScreen: props.containerProps.isFullScreen,
      // height: props.containerProps.height,
      column: props.containerProps.column,
      // data: this.getData(props.type),
      data: [],
      buttons: [],
      bottom: new Animated.Value(-screen.deviceHeight),
      boxHeight: new Animated.Value(this.height),
    }
    this.isShow = false
    this.isBoxShow = true
  }

  getData = type => {
    let data, buttons

    let { collectionData, collectionButtons } = this.getCollectionData(type)
    data = collectionData
    buttons = collectionButtons

    if (data.length > 0) return { data, buttons }

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
      // 第一级采集选项
      case ConstToolType.MAP_COLLECTION_POINT:
      case ConstToolType.MAP_COLLECTION_LINE:
      case ConstToolType.MAP_COLLECTION_REGION:
        data.push({
          key: 'gpsPoint',
          title: 'GPS打点',
          action: () => this.showCollection(type + '_POINT'),
          size: 'large',
          image: require('../../../../assets/function/icon_function_base_map.png'),
        })
        if (type !== ConstToolType.MAP_COLLECTION_POINT) {
          data.push({
            key: 'gpsPath',
            title: 'GPS轨迹',
            action: () => this.showCollection(type + '_PATH'),
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          })
        }
        data.push({
          key: 'pointDraw',
          title: '点绘式',
          action: () => this.showCollection(type + '_PATH'),
          size: 'large',
          image: require('../../../../assets/function/icon_function_base_map.png'),
        })
        if (type !== ConstToolType.MAP_COLLECTION_POINT) {
          data.push({
            key: 'freeDraw',
            title: '自由式',
            action: () => this.showCollection(type + '_FREE_DRAW'),
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          })
        } else {
          data.push({
            key: 'takePhoto',
            title: '拍照',
            action: () => this.showCollection(type),
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          })
        }
        buttons = [cancel, flex, placeholder]
        break
      // 第二级采集选项
      // case ConstToolType.MAP_COLLECTION_POINT_POINT:
      // case ConstToolType.MAP_COLLECTION_POINT_GPS:
      // case ConstToolType.MAP_COLLECTION_LINE_POINT:
      // case ConstToolType.MAP_COLLECTION_LINE_GPS_POINT:
      // case ConstToolType.MAP_COLLECTION_LINE_GPS_PATH:
      // case ConstToolType.MAP_COLLECTION_LINE_FREE_DRAW:
      // case ConstToolType.MAP_COLLECTION_REGION_POINT:
      // case ConstToolType.MAP_COLLECTION_REGION_GPS_POINT:
      // case ConstToolType.MAP_COLLECTION_REGION_GPS_PATH:
      // case ConstToolType.MAP_COLLECTION_REGION_FREE_DRAW:
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
   * 获取采集二级操作选项
   * @param type
   * @returns {{collectionData: Array, collectionButtons: Array}}
   */
  getCollectionData = type => {
    let data = [],
      buttons = []

    if (
      type.indexOf('MAP_COLLECTION_POINT_') < 0 &&
      type.indexOf('MAP_COLLECTION_LINE_') < 0 &&
      type.indexOf('MAP_COLLECTION_REGION_') < 0
    )
      return { collectionData: data, collectionButtons: buttons }
    if (
      type.indexOf('_POINT_GPS') > 0 ||
      type.indexOf('_LINE_GPS_POINT') > 0 ||
      type.indexOf('_REGION_GPS_POINT') > 0
    ) {
      data.push({
        key: 'addGPSPoint',
        title: '打点',
        action: () => {},
        size: 'large',
        image: require('../../../../assets/function/icon_function_base_map.png'),
      })
    }
    if (
      type.indexOf('_LINE_GPS_PATH') > 0 ||
      type.indexOf('_REGION_GPS_PATH') > 0
    ) {
      data.push({
        key: 'start',
        title: '开始',
        action: () => {},
        size: 'large',
        image: require('../../../../assets/function/icon_function_base_map.png'),
      })
      data.push({
        key: 'stop',
        title: '停止',
        action: () => {},
        size: 'large',
        image: require('../../../../assets/function/icon_function_base_map.png'),
      })
    }
    data.push({
      key: 'undo',
      title: '撤销',
      action: () => {},
      size: 'large',
      image: require('../../../../assets/function/icon_function_base_map.png'),
    })
    data.push({
      key: 'redo',
      title: '重做',
      action: () => {},
      size: 'large',
      image: require('../../../../assets/function/icon_function_base_map.png'),
    })
    data.push({
      key: 'cancel',
      title: '取消',
      action: () => {},
      size: 'large',
      image: require('../../../../assets/function/icon_function_base_map.png'),
    })
    data.push({
      key: 'submit',
      title: '提交',
      action: () => {},
      size: 'large',
      image: require('../../../../assets/function/icon_function_base_map.png'),
    })
    buttons = [cancel, flex, placeholder]

    return { collectionData: data, collectionButtons: buttons }
  }

  /** 采集分类点击事件 **/
  showCollection = type => {
    let { data, buttons } = this.getData(type)
    this.setState(
      {
        type: type,
        data: data,
        buttons: buttons,
        // height: HEIGHT[0],
        column: data.length,
      },
      () => {
        this.height = HEIGHT[0]
        this.showToolbar()
      },
    )
  }

  /** 拍照 **/
  takePhoto = () => {}

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
              : HEIGHT[1],
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
    isShow = isShow === undefined ? true : isShow
    Animated.timing(this.state.bottom, {
      toValue: isShow ? 0 : -screen.deviceHeight,
      duration: 300,
    }).start()
    setTimeout(() => {
      Animated.timing(this.state.boxHeight, {
        toValue: this.height,
        duration: 300,
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
      toValue: this.isBoxShow ? 0 : this.state.height,
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
          btns.push(<View style={{ flex: 1 }} key={type + '-' + index} />)
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
    flex: 1,
    height: scaleSize(60),
    // width: scaleSize(60),
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
