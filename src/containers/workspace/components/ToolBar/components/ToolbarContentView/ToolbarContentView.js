import React from 'react'
import { View, Animated, Text, FlatList } from 'react-native'
import {
  ToolbarType,
  ConstToolType,
  Const,
  TouchType,
} from '../../../../../../constants'
import { color } from '../../../../../../styles'
import { setSpText } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { ColorTable } from '../../../../../mapSetting/secondMapSettings/components'
import { Row, HorizontalTableList, MTBtn } from '../../../../../../components'
import SymbolTabs from '../../../SymbolTabs'
import SymbolList from '../../../SymbolList'
import AnimationNodeListView from '../../../AnimationNodeListView'
import PlotAnimationView from '../../../PlotAnimationView'
import ToolbarPicker from '../ToolbarPicker'
import ToolList from '../ToolList'
import ToolbarTableList from '../ToolbarTableList'
import ToolbarHeight from '../../modules/ToolBarHeight'
import ToolbarModule from '../../modules/ToolbarModule'
import { SMap, Action } from 'imobile_for_reactnative'
import styles from './styles'

export default class ToolbarContentView extends React.Component {
  props: {
    type: any,
    containerType: string,
    device: Object,
    currentLayer: Object,
    data: Array,
    language: string,
    selection: Array,
    existFullMap: () => {},
    importSceneWorkspace: () => {},
    refreshLayer3dList: () => {},
    changeLayerList: () => {},
    setVisible: () => {},
    showBox: () => {},
    showFullMap: () => {},
    getMapSetting: () => {},
    setTemplate: () => {},
    customView: () => {},
    // showMap3DTool: () => {},
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props)
    const data = ToolbarHeight.getToolbarHeight(props.type)
    this.height = data.height
    this.state = {
      column: data.column,
      boxHeight: new Animated.Value(this.height),
      listSelectable: false,
      clipSetting: {},
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // let data = ToolbarHeight.getToolbarHeight(nextProps.device.orientation, nextProps.type)
    if (
      // this.height !== 0 ||
      this.props.type !== nextProps.type ||
      this.props.containerType !== nextProps.containerType ||
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device) ||
      JSON.stringify(this.props.currentLayer) !==
        JSON.stringify(nextProps.currentLayer) ||
      JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data) ||
      JSON.stringify(this.props.selection) !==
        JSON.stringify(nextProps.selection) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    // 点采集，GPS打点类型为0
    if (this.props.type !== undefined && this.props.type !== prevProps.type) {
      this.onChangeHeight(this.props.device.orientation, this.props.type)
    }
  }

  // TODO 每次更改高度和列数的方式可能会两次次setState，需要优化
  onChangeHeight = async (orientation, type) => {
    let data = ToolbarHeight.getToolbarHeight(type, this.height)
    if (
      data.column !== undefined &&
      data.height !== undefined &&
      (this.height !== data.height || this.state.column !== data.column)
    ) {
      this.height = data.height
      this.changeHeight(data)
    }
  }

  // Box内容框的显示和隐藏
  changeHeight = params => {
    let change = _params => {
      if (
        !isNaN(_params.height) &&
        JSON.stringify(this.state.boxHeight) !== _params.height.toString()
      ) {
        this.height = _params.height
        let animate = Animated.timing(this.state.boxHeight, {
          toValue: this.height,
          duration: Const.ANIMATED_DURATION,
        })
        if (_params.wait) {
          return animate
        }
        animate.start()
      }
    }
    if (typeof params === 'number') {
      return change({ height: params })
    } else if (
      params.column !== undefined &&
      params.column !== this.state.column
    ) {
      this.setState({
        column: params.column,
      })
    }
    return change(params)
  }

  getContentHeight = () => {
    return this.state.boxHeight
  }

  /***************************************** InputView ***************************************/
  //标注 RecordSet数据改变
  _onValueChange = ({ title, text }) => {
    switch (title) {
      case getLanguage(global.language).Map_Main_Menu.TOOLS_NAME:
        ToolbarModule.addData({
          tools_name: text,
        })
        // this.tools_name = text
        break
      case getLanguage(global.language).Map_Main_Menu.TOOLS_REMARKS:
        ToolbarModule.addData({
          tools_remarks: text,
        })
        // this.tools_remarks = text
        break
      case getLanguage(global.language).Map_Main_Menu.TOOLS_HTTP:
        ToolbarModule.addData({
          tools_http: text,
        })
        // this.tools_http = text
        break
    }
  }

  renderInputView = () => {
    let data = this.props.data[0]
    let renderList = ({ item }) => {
      return (
        <Row
          style={styles.row}
          customRightStyle={styles.customInput}
          title={item.title}
          getValue={this._onValueChange}
          defaultValue={item.value}
        />
      )
    }
    if (data) {
      return (
        <View>
          <View style={styles.textHeader}>
            <Text style={styles.textFont}>{data.title}</Text>
          </View>
          <FlatList
            renderItem={renderList}
            data={data.data}
            keyExtractor={(item, index) => item.value + index}
          />
        </View>
      )
    }
    return null
  }

  /***************************************** ToolBarSectionList ***************************************/
  renderList = () => {
    if (this.props.data.length === 0) return
    return (
      <ToolList
        ref={ref => (this.toolBarSectionList = ref)}
        type={this.props.type}
        data={this.props.data}
        containerType={this.props.containerType}
        getMapSetting={this.props.getMapSetting}
        setTemplate={this.props.setTemplate}
        setToolbarVisible={this.props.setVisible}
        headerAction={this.headerAction}
        underlayColor={color.item_separate_white}
        keyExtractor={(item, index) => index}
        device={this.props.device}
        language={this.props.language}
      />
    )
  }
  /***************************************** SymbolTabs ***************************************/
  renderTabs = () => {
    return (
      <SymbolTabs
        style={styles.tabsView}
        showToolbar={this.props.setVisible}
        showBox={this.props.showBox}
      />
    )
  }

  /***************************************** SymbolList ***************************************/
  renderSymbol = () => {
    return (
      <SymbolList
        device={this.props.device}
        layerData={this.props.currentLayer}
        type={this.props.type}
      />
    )
  }

  /***************************************** Table ***************************************/
  renderTable = () => {
    return (
      <ToolbarTableList
        data={this.props.data}
        type={this.props.type}
        containerType={this.props.containerType}
        column={this.state.column}
        device={this.props.device}
        language={this.props.language}
      />
    )
  }

  /***************************************** PlotAnimation ***************************************/
  saveAnimationAndContinue = () => {
    let createInfo =
      this.plotAnimationView && this.plotAnimationView.getCreateInfo()
    if (this.props.selection.length > 0 && this.props.selection[0].ids > 0) {
      createInfo.geoId = this.props.selection[0].ids[0]
      createInfo.layerName = this.props.selection[0].layerInfo.name
    }
    if (createInfo.animationMode !== -1) {
      SMap.createAnimationGo(createInfo, GLOBAL.newPlotMapName)
    }
  }

  //保存推演动画节点
  savePlotAnimationNode = () => {
    let createInfo =
      this.plotAnimationView && this.plotAnimationView.getCreateInfo()
    if (this.props.selection.length > 0 && this.props.selection[0].ids > 0) {
      createInfo.geoId = this.props.selection[0].ids[0]
      createInfo.layerName = this.props.selection[0].layerInfo.name
    }
    if (createInfo.animationMode !== -1) {
      SMap.createAnimationGo(createInfo, GLOBAL.newPlotMapName)
    }
    GLOBAL.TouchType = TouchType.NULL
    GLOBAL.animationWayData && (GLOBAL.animationWayData = null)

    let height = 0
    this.props.showFullMap && this.props.showFullMap(true)
    let type = ConstToolType.PLOT_ANIMATION_START
    this.props.setVisible(true, type, {
      isFullScreen: false,
      height,
      cb: () => SMap.setAction(Action.SELECT),
    })
  }

  renderPlotAnimation = () => {
    return (
      <PlotAnimationView
        ref={ref => (this.plotAnimationView = ref)}
        data={this.props.data}
        saveAndContinue={this.saveAnimationAndContinue}
        savePlotAnimationNode={this.savePlotAnimationNode}
        layerName={
          this.props.selection[0] && this.props.selection[0].layerInfo.name
        }
        geoId={this.props.selection[0] && this.props.selection[0].ids[0]}
        Heighttype={this.props.type}
        device={this.props.device}
        showToolbar={this.props.setVisible}
      />
    )
  }

  /***************************************** AnimationNodeList ***************************************/
  renderAnimationNodeList = () => {
    return (
      <AnimationNodeListView
        ref={ref => (this.AnimationNodeListView = ref)}
        data={this.props.data}
        type={this.props.type}
        device={this.props.device}
      />
    )
  }

  /***************************************** HorizontalTable ***************************************/
  renderHorizontalTable = () => {
    return (
      <HorizontalTableList
        data={this.props.data}
        numColumns={this.state.column}
        renderCell={({ item, rowIndex, cellIndex }) => {
          let column = this.state.column
          return (
            <MTBtn
              style={[styles.cell, { width: this.props.device.width / column }]}
              key={rowIndex + '-' + cellIndex}
              title={item.title}
              textColor={item.disable ? '#A0A0A0' : color.font_color_white}
              textStyle={{ fontSize: setSpText(20) }}
              // size={MTBtn.Size.NORMAL}
              image={item.image}
              background={item.background}
              onPress={() => {
                if (item.disable) return
                if (
                  ToolbarModule.getData().actions &&
                  ToolbarModule.getData().actions.tableAction
                ) {
                  ToolbarModule.getData().actions.tableAction(item)
                }
                if (item.action) {
                  item.action(item)
                }
              }}
            />
          )
        }}
        Heighttype={this.props.type}
        device={this.props.device}
      />
    )
  }

  /***************************************** ColorTable ***************************************/
  renderColorTable = () => {
    return (
      <ColorTable
        language={this.props.language}
        data={this.props.data}
        device={this.props.device}
        itemAction={async item => {
          if (
            ToolbarModule.getData().actions &&
            ToolbarModule.getData().actions.tableAction
          ) {
            let params = {
              type: this.props.type,
              key: typeof item === 'string' ? item : item.key,
              layerName: this.props.currentLayer.name,
            }
            typeof item === 'object' && Object.assign(params, item)
            await ToolbarModule.getData().actions.tableAction(params)
          }
          if (
            ToolbarModule.getData().actions &&
            ToolbarModule.getData().actions.colorAction
          ) {
            let params = {
              type: this.props.type,
              key: typeof item === 'string' ? item : item.key,
              layerName: this.props.currentLayer.name,
            }
            typeof item === 'object' && Object.assign(params, item)
            await ToolbarModule.getData().actions.colorAction(params)
          }
        }}
      />
    )
  }

  /***************************************** Picker ***************************************/
  renderPicker = () => {
    return ToolbarPicker.initPicker({
      confirm: item => {
        if (
          ToolbarModule.getData().actions &&
          ToolbarModule.getData().actions.pickerConfirm
        ) {
          ToolbarModule.getData().actions.pickerConfirm({
            selectKey: item,
            selectName: item,
          })
        }
      },
      cancel: () => {
        if (
          ToolbarModule.getData().actions &&
          ToolbarModule.getData().actions.pickerCancel
        ) {
          ToolbarModule.getData().actions.pickerCancel()
        }
      },
    })
  }

  render() {
    let box
    if (this.props.customView) {
      box = this.props.customView(this.props, this.state)
    } else {
      switch (this.props.containerType) {
        case ToolbarType.list:
        case ToolbarType.selectableList:
          if (this.props.data.length === 0) return <View /> // 若当前无数据，则不显示
          switch (this.props.type) {
            // case ConstToolType.MAP3D_BASE:
            // case ConstToolType.MAP3D_ATTRIBUTE:
            // case ConstToolType.MAP3D_WORKSPACE_LIST:
            // case ConstToolType.MAP3D_IMPORTWORKSPACE:
            // case ConstToolType.MAP3D_TOOL_DISTANCEMEASURE:
            // case ConstToolType.MAP3D_TOOL_SUERFACEMEASURE:
            //   box = this.renderMap3DList()
            //   break
            // case ConstToolType.MAP3D_BOX_CLIP:
            // case ConstToolType.MAP3D_PLANE_CLIP:
            // case ConstToolType.MAP3D_CROSS_CLIP:
            //   box = this.renderMap3DClip()
            //   break
            case ConstToolType.MAP_TOOL_TAGGING_SETTING:
              box = this.renderInputView()
              break
            case ConstToolType.PLOT_ANIMATION_XML_LIST:
            default:
              box = this.renderList()
              break
          }
          break
        case ToolbarType.tabs:
          box = this.renderTabs()
          break
        case ToolbarType.symbol:
          box = this.renderSymbol()
          break
        case ToolbarType.horizontalTable:
          box = this.renderHorizontalTable()
          break
        case ToolbarType.createPlotAnimation:
          box = this.renderPlotAnimation()
          break
        case ToolbarType.animationNode:
          box = this.renderAnimationNodeList()
          break
        case ToolbarType.picker:
          box = this.renderPicker()
          break
        case ToolbarType.colorTable:
          box = this.renderColorTable()
          break
        case ToolbarType.table:
        default:
          box = this.renderTable()
      }
    }
    return (
      <Animated.View
        style={{
          height: this.state.boxHeight,
          backgroundColor: color.content_white,
        }}
      >
        {box}
      </Animated.View>
    )
  }
}
