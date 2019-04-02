import React from 'react'
import { ConstToolType, layerManagerData } from '../../../../constants/index'
import NavigationService from '../../../NavigationService'
import {
  layersetting,
  layerThemeSetting,
  layer3dSettingCanSelect,
  layer3dSettingCanNotSelect,
  layerCollectionSetting,
  layerThemeSettings,
  layereditsetting,
  baseListData,
  taggingData,
  scaleData,
  mscaleData,
} from './LayerToolbarData'
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  Text,
  // TextInput,
  TouchableHighlight,
} from 'react-native'
import ToolBarSectionList from '../../../workspace/components/ToolBar/ToolBarSectionList'
import styles from './styles'
import { SMap, SScene } from 'imobile_for_reactnative'
// import { Dialog } from '../../../../components'
import { color } from '../../../../styles'
import { screen, Toast, scaleSize, setSpText } from '../../../../utils'
import Map3DToolBar from '../../../workspace/components/Map3DToolBar'
/** 工具栏类型 **/
const list = 'list'

export default class LayerManager_tolbar extends React.Component {
  props: {
    type?: string,
    containerProps?: Object,
    data: Array,
    layerdata?: Object,
    existFullMap: () => {},
    getLayers: () => {}, // 更新数据（包括其他界面）
    setCurrentLayer: () => {},
    onPress: () => {},
    onThisPress: () => {},
    getOverlayView: () => {},
    device: Object,
    layers: Object,
  }

  static defaultProps = {
    containerProps: {
      data: [],
      containerType: list,
    },
  }

  constructor(props) {
    super(props)
    this.layer3d = {}
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
      showMenuDialog: false,
      listSelectable: false, // 列表是否可以选择（例如地图）
      isTouch: true,
      layerdata: props.layerdata || '',
      // layerName: '',
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
      case ConstToolType.MAP_THEME_STYLES:
        data = layerThemeSettings
        break
      case ConstToolType.MAP3D_LAYER3DSELECT:
        data = layer3dSettingCanSelect
        break
      case ConstToolType.MAP3D_LAYER3DCHANGE:
        data = layereditsetting
        break
      case ConstToolType.COLLECTION:
        data = layerCollectionSetting
        break
      case ConstToolType.MAP_EDIT_STYLE:
        data = layereditsetting
        break
      case ConstToolType.MAP_EDIT_MORE_STYLE:
        data = layerManagerData
        break
      case ConstToolType.MAP3D_BASE:
        data = baseListData
        break
      case ConstToolType.MAP_EDIT_TAGGING:
        data = taggingData
        break
      case ConstToolType.MAP_SCALE:
        data = scaleData
        break
      case ConstToolType.MAP_MAX_SCALE:
        data = mscaleData
        break
      case ConstToolType.MAP_MIN_SCALE:
        data = mscaleData
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
        this.updateOverlayerView()
      },
    )
  }

  /**
   * 设置遮罩层的显隐
   * @param visible
   */
  setOverlayViewVisible = visible => {
    GLOBAL.LayerManagerOverlayView &&
      GLOBAL.LayerManagerOverlayView.setVisible(visible)
  }

  //更新遮盖层状态
  updateOverlayerView = () => {
    this.setOverlayViewVisible(this.isShow)
  }

  mapStyle = async () => {
    if (this.props.onPress) {
      await this.props.onPress({
        data: this.state.layerdata,
      })
    } else return
  }

  setThislayer = async () => {
    if (this.props.onThisPress) {
      await this.props.onThisPress({
        data: this.state.layerdata,
      })
    } else return
  }

  listAction = ({ section }) => {
    if (section.action) {
      (async function() {
        await section.action()
        this.props.getLayers()
        this.setVisible(false)
      }.bind(this)())
    }
    if (section.title === '移除') {
      (async function() {
        await SMap.removeLayer(this.state.layerdata.name)
        await this.props.getLayers()
      }.bind(this)())
      this.setVisible(false)
    } else if (section.title === '切换底图') {
      if (this.state.type === ConstToolType.MAP3D_LAYER3DCHANGE) {
        this.setVisible(true, ConstToolType.MAP3D_BASE, {
          height: ConstToolType.TOOLBAR_HEIGHT[5],
          type: ConstToolType.MAP3D_BASE,
        })
      } else {
        this.setVisible(true, ConstToolType.MAP_EDIT_MORE_STYLE, {
          height: ConstToolType.TOOLBAR_HEIGHT[5],
          layerdata: this.state.layerdata,
        })
      }
    } else if (section.title === '图层风格') {
      this.mapStyle()
      this.setVisible(false)
    } else if (section.title === '可见比例尺范围') {
      this.setVisible(true, ConstToolType.MAP_SCALE, {
        height: ConstToolType.TOOLBAR_HEIGHT[1],
        layerdata: this.state.layerdata,
      })
    } else if (section.title === '最大可见比例尺') {
      this.setVisible(true, ConstToolType.MAP_MAX_SCALE, {
        height: ConstToolType.TOOLBAR_HEIGHT[6],
        layerdata: this.state.layerdata,
      })
    } else if (section.title === '最小可见比例尺') {
      this.setVisible(true, ConstToolType.MAP_MIN_SCALE, {
        height: ConstToolType.TOOLBAR_HEIGHT[6],
        layerdata: this.state.layerdata,
      })
    } else if (section.title === '1:5,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.name, 5000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.name, 5000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:10,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.name, 10000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.name, 10000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:25,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.name, 25000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.name, 25000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:50,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.name, 50000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.name, 50000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:100,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.name, 100000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.name, 100000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:250,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.name, 250000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.name, 250000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:500,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.name, 500000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.name, 500000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:1,000,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.name, 1000000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.name, 1000000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '重命名') {
      NavigationService.navigate('InputPage', {
        headerTitle: '图层名称',
        value: this.state.layerdata ? this.state.layerdata.caption : '',
        cb: async value => {
          if (value !== '') {
            (async function() {
              await SMap.renameLayer(this.state.layerdata.name, value)
              await this.props.getLayers()
            }.bind(this)())
          }
          await this.setVisible(false)
          NavigationService.goBack()
        },
      })
      // this.dialog.setDialogVisible(true)
    } else if (section.title === '上移') {
      (async function() {
        await SMap.moveUpLayer(this.state.layerdata.name)
        await this.props.getLayers()
      }.bind(this)())
    } else if (section.title === '下移') {
      (async function() {
        await SMap.moveDownLayer(this.state.layerdata.name)
        await this.props.getLayers()
      }.bind(this)())
    } else if (section.title === '置顶') {
      (async function() {
        await SMap.moveToTop(this.state.layerdata.name)
        await this.props.getLayers()
      }.bind(this)())
      this.setVisible(false)
    } else if (section.title === '置底') {
      (async function() {
        await SMap.moveToBottom(this.state.layerdata.name)
      }.bind(this)())
      SMap.moveUpLayer(this.state.layerdata.name)
      if (
        this.props.layers[this.props.layers.length - 1].name.indexOf(
          'vec@TD',
        ) >= 0
      ) {
        SMap.moveUpLayer(this.state.layerdata.name)
      }
      this.props.getLayers()
      this.setVisible(false)
    } else if (section.title === '导入标注') {
      (async function() {
        GLOBAL.value = this.state.layerdata
        await SMap.openTaggingDataset(this.state.layerdata)
        await this.props.getLayers(-1, layers => {
          this.props.setCurrentLayer(layers.length > 0 && layers[0])
        })
      }.bind(this)())
      this.setVisible(false)
    } else if (section.title === '删除标注') {
      (async function() {
        await SMap.removeTaggingDataset(this.state.layerdata)
        await this.props.getLayers(-1, layers => {
          this.props.setCurrentLayer(layers.length > 0 && layers[0])
        })
      }.bind(this)())
      this.setVisible(false)
    } else if (section.title === '设置为当前图层') {
      if (this.state.type === ConstToolType.MAP3D_LAYER3DSELECT) {
        this.cb && this.cb(this.layer3dItem)
        this.setVisible(false)
        let overlayView = this.props.getOverlayView
          ? this.props.getOverlayView()
          : null
        if (overlayView) {
          overlayView.setVisible(false)
        }
        return
      }
      this.props.setCurrentLayer &&
        this.props.setCurrentLayer(this.state.layerdata)
      this.setThislayer()
      Toast.show('当前图层为' + this.state.layerdata.caption)
      this.setVisible(false)
    } else if (section.title === '修改专题图') {
      this.mapStyle()
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
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setVisible(
            true,
            ConstToolType.MAP_THEME_CREATE_BY_LAYER,
            {
              isFullScreen: true,
              column: 4,
              height: ConstToolType.THEME_HEIGHT[10],
              createThemeByLayer: this.state.layerdata.name,
            },
          )
        GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
        // eslint-disable-next-line react/prop-types
        this.props.navigation.navigate('MapView')
      } else {
        Toast.show('不支持由该图层创建专题图')
      }
    } else if (
      section.title === '设置图层可选' ||
      section.title === '设置图层不可选'
    ) {
      //console.warn(this.state.data)
      let _title = section.title
      let canChoose = true
      _title.indexOf('不') > 0 && (canChoose = false)
      SScene.setSelectable(this.layer3dItem.name, canChoose).then(result => {
        result ? Toast.show(`${_title}成功`) : Toast.show(`${_title}失败`)
        // this.overlayView&&this.overlayView.setVisible(false)
        this.setVisible(false)
        let overlayView = this.props.getOverlayView
          ? this.props.getOverlayView()
          : null
        if (overlayView) {
          overlayView.setVisible(false)
        }
        if (result) {
          this.changeState(!canChoose)
        }
      })
    }
  }

  getLayer3dItem = (
    layer3dItem,
    cb = () => {},
    setItemSelectable = () => {},
    overlayView = {},
    changeState = () => {},
  ) => {
    //console.log(layer3dItem)
    this.layer3dItem = layer3dItem
    this.cb = cb
    this.setItemSelectable = setItemSelectable
    this.overlayView = overlayView
    this.changeState = changeState
    let selectabel = this.layer3dItem.selectable
    let data
    selectabel
      ? (data = layer3dSettingCanSelect)
      : (data = layer3dSettingCanNotSelect)
    this.setState({ data })
  }

  getLayer3d = () => {
    return this.layer3dItem
  }
  getoverlayView = () => {
    return this.overlayView
  }
  renderList = () => {
    if (this.state.data.length === 0) return
    return (
      <ToolBarSectionList
        sections={this.state.data}
        renderSectionHeader={({ section }) => this.renderHeader({ section })}
        layerManager={true}
      />
    )
  }

  renderMap3DList = () => {
    return (
      <Map3DToolBar
        ref={ref => (this.Map3DToolBar = ref)}
        data={this.state.data}
        type={this.state.type}
        setVisible={this.setVisible}
        device={this.props.device}
        getLayer3d={this.getLayer3d}
        getoverlayView={this.getoverlayView}
      />
    )
  }

  renderHeader = ({ section }) => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            this.listAction({ section })
          }}
          underlayColor={color.headerBackground}
        >
          <View
            style={{
              height: scaleSize(86),
              backgroundColor: color.content_white,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {section.image && (
              <Image
                resizeMode={'contain'}
                style={{
                  marginLeft: scaleSize(60),
                  height: scaleSize(60),
                  width: scaleSize(60),
                }}
                source={section.image}
              />
            )}
            <Text
              style={{
                fontSize: setSpText(24),
                marginLeft: scaleSize(60),
                textAlign: 'center',
                backgroundColor: 'transparent',
              }}
            >
              {section.title}
            </Text>
          </View>
        </TouchableHighlight>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            height: 1,
            backgroundColor: color.bgG,
          }}
        />
      </View>
    )
  }

  renderView = () => {
    let box
    switch (this.state.containerType) {
      case list:
        switch (this.state.type) {
          case ConstToolType.MAP_SCALE:
            box = this.renderList()
            break
          case ConstToolType.MAP_MAX_SCALE:
            box = this.renderList()
            break
          case ConstToolType.MAP_MIN_SCALE:
            box = this.renderList()
            break
          case ConstToolType.MAP_EDIT_TAGGING:
            box = this.renderList()
            break
          case ConstToolType.MAP_STYLE:
            box = this.renderList()
            break
          case ConstToolType.MAP_THEME_STYLE:
            box = this.renderList()
            break
          case ConstToolType.MAP_THEME_STYLES:
            box = this.renderList()
            break
          case ConstToolType.MAP3D_LAYER3DSELECT:
            box = this.renderList()
            break
          case ConstToolType.COLLECTION:
            box = this.renderList()
            break
          case ConstToolType.MAP_EDIT_STYLE:
            box = this.renderList()
            break
          case ConstToolType.MAP_EDIT_MORE_STYLE:
            box = this.renderList()
            break
          case ConstToolType.MAP3D_LAYER3DCHANGE:
            box = this.renderList()
            break
          case ConstToolType.MAP3D_BASE:
            box = this.renderMap3DList()
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

  // confirm = () => {
  //   this.dialog.setDialogVisible(false)
  //   this.setState({
  //     layerName: '',
  //   })
  // }
  //
  // cancel = () => {
  //   if (this.state.layerName !== '') {
  //     (async function() {
  //       await SMap.renameLayer(this.state.layerdata.name, this.state.layerName)
  //       await this.props.getLayers()
  //     }.bind(this)())
  //   }
  //   this.dialog.setDialogVisible(false)
  //   this.setVisible(false)
  //   this.setState({
  //     layerName: '',
  //   })
  // }

  // renderDialog = () => {
  //   return (
  //     <Dialog
  //       ref={ref => (this.dialog = ref)}
  //       showDialog={true}
  //       confirmAction={this.confirm}
  //       cancelAction={this.cancel}
  //       confirmBtnTitle={'取消'}
  //       cancelBtnTitle={'确认'}
  //     >
  //       <View style={styles.item}>
  //         <Text style={styles.title}>图层名称</Text>
  //         <TextInput
  //           underlineColorAndroid={'transparent'}
  //           accessible={true}
  //           accessibilityLabel={'图层名称'}
  //           onChangeText={text => {
  //             this.setState({
  //               layerName: text,
  //             })
  //           }}
  //           placeholderTextColor={color.themeText2}
  //           defaultValue={
  //             this.state.layerdata ? this.state.layerdata.caption : ''
  //           }
  //           placeholder={'请输入图层名称'}
  //           keyboardAppearance="dark"
  //           style={styles.textInputStyle}
  //         />
  //       </View>
  //     </Dialog>
  //   )
  // }

  render() {
    let containerStyle = styles.fullContainer
    return (
      <Animated.View style={[containerStyle, { bottom: this.state.bottom }]}>
        {
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.setVisible(false)
              let overlayView = this.props.getOverlayView
                ? this.props.getOverlayView()
                : null
              if (overlayView) {
                overlayView.setVisible(false)
              }
            }}
            style={styles.overlay}
          />
        }
        <View style={styles.containers}>{this.renderView()}</View>
        {/*{this.renderDialog()}*/}
      </Animated.View>
    )
  }
}
