import React from 'react'
import {
  ConstToolType,
} from '../../../../constants/index'
// import NavigationService from '../../../NavigationService'
import {
  layer3dSettingCanSelect,
  // layer3dSettingCanNotSelect,
  layereditsetting,
  base3DListData,
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
import { SScene } from 'imobile_for_reactnative'
// import { Dialog } from '../../../../components'
import { color } from '../../../../styles'
import { screen, scaleSize, setSpText } from '../../../../utils'
import Map3DToolBar from '../../../workspace/components/Map3DToolBar'
import { getLanguage } from '../../../../language/index'
/** 工具栏类型 **/
const list = 'list'

export default class LayerManager_tolbar extends React.Component {
  props: {
    language: string,
    type?: string,
    containerProps?: Object,
    data: Array,
    layerdata?: Object,
    existFullMap: () => {},
    getLayers: () => {}, // 更新数据（包括其他界面）
    setCurrentLayer: () => {},
    onPress: () => {},
    onThisPress: () => {},
    updateTagging: () => {},
    overlayView: () => {},
    device: Object,
    layers: Object,
    user: Object,
    curUserBaseMaps: Array,
    navigation: Object,
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
      index: 0,
      // layerName: '',
    }
    this.isShow = false
    this.isBoxShow = true
  }

  getData = type => {
    let data = []
    switch (type) {
      case ConstToolType.MAP3D_LAYER3D_IMAGE:
        data = layereditsetting(global.language)
        break
      case ConstToolType.MAP3D_BASE:
        data = base3DListData
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
    // if (this.state.type === ConstToolType.MAP_THEME_PARAM) {
    //   Animated.timing(this.state.boxHeight, {
    //     toValue: 0,
    //     duration: 300,
    //   }).start()
    //   this.isBoxShow = false
    // } else
    {
      if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
        Animated.timing(this.state.boxHeight, {
          toValue: this.height,
          duration: 300,
        }).start()
      }
      this.isBoxShow = true
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
  setVisible = (isShow, type, params = {},inputData = undefined) => {
    this.height =
      params && typeof params.height === 'number'
        ? params.height
        : ConstToolType.HEIGHT[1]
    let data = undefined
    if(inputData){
      data = this.getData(type)
    }else{
      data = this.getData(type)
    }
    this.setState(
      {
        data: data,
        type: type,
        layerdata: params.layerdata,
        index: params.index,
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

  listAction = ({ section }) => {
    if (section.action) {
      (async function() {
        await section.action()
        this.props.getLayers()
        this.setVisible(false)
      }.bind(this)())
      return
    }
    if (section.title === getLanguage(global.language).Map_Layer.BASEMAP_SWITH) {
      //'切换底图') {
      if (this.state.type === ConstToolType.MAP3D_LAYER3D_IMAGE) {
        this.setVisible(true, ConstToolType.MAP3D_BASE, {
          height: ConstToolType.TOOLBAR_HEIGHT[5],
          type: ConstToolType.MAP3D_BASE,
        })
      }
    }  else if (section.type && section.type==="setLayerSelect") {//设置图层可选择
      let selectable = this.layer3dItem.selectable
      let canChoose = !selectable
      SScene.setSelectable(this.layer3dItem.name, canChoose).then(result => {
        this.setVisible(false)
        this.props.overlayView && this.props.overlayView.setVisible(false)
        if (result) {
          this.changeState(canChoose)
        }
      })
    }else if(section.type && section.type==="scaleToLayer"){//缩放至当前图层
      this.setVisible(false)
      this.props.overlayView && this.props.overlayView.setVisible(false)
      SScene.ensureVisibleLayer(this.layer3dItem.name)
      this.props.navigation.navigate("Map3D")
      // this.props.navigation.navigate('InputPage'
    }
  }

  getLayer3dItem = (
    layer3dItem,
    changeState = () => {},
  ) => {
    this.layer3dItem = layer3dItem
    this.changeState = changeState
    let selectable = this.layer3dItem.selectable
    let data = layer3dSettingCanSelect(this.props.language,selectable)
    this.setState({ data })
  }

  // getLayer3d = () => {
  //   return this.layer3dItem
  // }
  getoverlayView = () => {
    return this.props.overlayView
  }
  renderList = () => {
    if (this.state.data.length === 0) return
    return (
      <ToolBarSectionList
        sections={this.state.data}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderHeader}
        layerManager={true}
      />
    )
  }

  renderHeader = ({ section }) => {
    if (!section.headers) {
      return <View style={{ height: 0 }} />
    }
    return (
      <View
        style={{
          height: scaleSize(86),
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: color.bgW,
        }}
      >
        {section.headers.map((item, index) => {
          if (this.state.layerdata.themeType === 7 && index === 1) {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
                activeOpacity={1}
              >
                <Image
                  source={item.image}
                  style={{
                    width: scaleSize(60),
                    height: scaleSize(60),
                  }}
                />
              </TouchableOpacity>
            )
          }
          return (
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
              }}
              key={index}
              // onPress={() => this.headerAction({ item, index, section })}
            >
              <Image
                source={item.image}
                style={{
                  width: scaleSize(60),
                  height: scaleSize(60),
                }}
              />
            </TouchableOpacity>
          )
        })}
      </View>
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

  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            this.listAction({ section: item })
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
            {item.image && (
              <Image
                resizeMode={'contain'}
                style={{
                  marginLeft: scaleSize(60),
                  height: scaleSize(60),
                  width: scaleSize(60),
                }}
                source={item.image}
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
              {item.title}
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
    if(this.state.type === ConstToolType.MAP3D_BASE){
      box = this.renderMap3DList()
    }else{
      box = this.renderList()
    }
    // switch (this.state.containerType) {
    //   case list:
    //     switch (this.state.type) {
    //       case ConstToolType.MAP3D_LAYER3DSELECT:
    //       case ConstToolType.MAP3D_LAYER3DCHANGE:
    //         box = this.renderList()
    //         break
    //       case ConstToolType.MAP3D_BASE:
    //         box = this.renderMap3DList()
    //         break
    //     }
    //     break
    // }
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
            onPress={() => {
              this.setVisible(false)
              if (this.props.overlayView) {
                this.props.overlayView.setVisible(false)
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
