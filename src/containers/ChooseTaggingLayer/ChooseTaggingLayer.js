import * as React from 'react'
import { View, FlatList, TouchableOpacity, Text, Image } from 'react-native'
import { scaleSize, setSpText, Toast, LayerUtils } from '../../utils'
import { color } from '../../styles'
import NavigationService from '../NavigationService'
import { SMap, SAIDetectView } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import { Container } from '../../components'

import { ConstToolType } from '../../constants'
import ToolbarBtnType from '../../containers/workspace/components/ToolBar/ToolbarBtnType'
import ToolAction from '../../containers/workspace/components/ToolBar/modules/toolModule/ToolAction'
import { getLanguage } from '../../language'

export default class ChooseTaggingLayer extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    setCurrentLayer: PropTypes.func,
  }

  props: {
    navigation: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}
    this.type = params.type
    this.state = {
      show: false,
      data: [],
    }
    this.clickAble = true // 防止重复点击
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    let dataList = await SMap.getTaggingLayers(
      this.props.user.currentUser.userName,
    )
    this.setState({
      data: dataList,
    })
  }

  setVisible = iShow => {
    this.setState({ show: iShow })
  }

  _onPress = async item => {
    await this.props.setCurrentLayer(item)
    if (this.type === 'aiDetect') {
      await SAIDetectView.setProjectionModeEnable(true)
      // await SAIDetectView.setDrawTileEnable(false)
      await SAIDetectView.setIsPolymerize(false)
      let buttons = [
        // ToolbarBtnType.COLLECTTARGET,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.PLACEHOLDER,
        {
          type: ToolbarBtnType.SETTIING,
          action: ToolAction.setting,
          image: require('../../assets/mapTools/ai_setting.png'),
        },
      ]
      ;(await GLOBAL.toolBox) &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.AIDETECT, {
          buttons: buttons,
          isFullScreen: false,
          height: 0,
        })
      GLOBAL.AIDETECTCHANGE.setVisible(true)
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
      NavigationService.goBack()
    } else if (this.type === 'aiClassify') {
      let currentLayer = item
      // let reg = /^Label_(.*)#$/
      let isTaggingLayer = false
      if (currentLayer) {
        let layerType = LayerUtils.getLayerType(currentLayer)
        isTaggingLayer = layerType === 'TAGGINGLAYER'
        // && currentLayer.datasourceAlias.match(reg)
      }
      if (isTaggingLayer) {
        const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
        const datasetName = currentLayer.datasetName // 标注图层名称
        NavigationService.navigate('ClassifyView', {
          datasourceAlias,
          datasetName,
        })
      } else {
        Toast.show(
          getLanguage(this.props.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
        )
        NavigationService.navigate('LayerManager')
      }
    } else if (this.type === 'illegallyParkCollect') {
      let currentLayer = item
      // let reg = /^Label_(.*)#$/
      let isTaggingLayer = false
      if (currentLayer) {
        let layerType = LayerUtils.getLayerType(currentLayer)
        isTaggingLayer = layerType === 'TAGGINGLAYER'
        // isTaggingLayer = currentLayer.type === DatasetType.CAD
        // && currentLayer.datasourceAlias.match(reg)
      }
      if (isTaggingLayer) {
        const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
        const datasetName = currentLayer.datasetName // 标注图层名称
        NavigationService.navigate('IllegallyParkView', {
          datasourceAlias,
          datasetName,
        })
      } else {
        Toast.show(
          getLanguage(this.props.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
        )
        NavigationService.navigate('LayerManager')
      }
    } else if (this.type === 'arMeasureCollect') {
      let currentLayer = item
      // let reg = /^Label_(.*)#$/
      let isTaggingLayer = false
      if (currentLayer) {
        let layerType = LayerUtils.getLayerType(currentLayer)
        isTaggingLayer = layerType === 'TAGGINGLAYER'
        // isTaggingLayer = currentLayer.type === DatasetType.CAD
        // && currentLayer.datasourceAlias.match(reg)
      }
      if (isTaggingLayer) {
        const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
        const datasetName = currentLayer.datasetName // 标注图层名称
        NavigationService.navigate('MeasureView', {
          datasourceAlias,
          datasetName,
        })
      } else {
        Toast.show(
          getLanguage(this.props.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
        )
        NavigationService.navigate('LayerManager')
      }
    }
  }

  _renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={{
            paddingLeft: scaleSize(14),
            height: scaleSize(80),
            padding: scaleSize(6),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
          onPress={async () => {
            this._onPress(item)
          }}
        >
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              style={{
                height: scaleSize(50),
                width: scaleSize(60),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                style={{
                  height: scaleSize(40),
                  width: scaleSize(40),
                }}
                source={require('../../assets/lightTheme/layerType/layer_type_CAD.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: scaleSize(30),
              backgroundColor: 'transparent',
            }}
          >
            <Text
              style={{
                fontSize: setSpText(24),
                color: color.black,
                backgroundColor: 'transparent',
              }}
            >
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  back = () => {
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
      if (GLOBAL.isswitch) {
        GLOBAL.isswitch = false
        GLOBAL.toolBox && GLOBAL.toolBox.switchAr()
      }
      NavigationService.goBack()
    }
  }

  /**行与行之间的分隔线组件 */
  renderItemSeparator = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          marginLeft: scaleSize(84),
          width: '100%',
          height: 1,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: color.background,
        }}
      >
        <Container
          ref={ref => (this.container = ref)}
          headerProps={{
            title: getLanguage(this.props.language).Prompt.CHOOSE_LAYER,
            backAction: this.back,
          }}
        >
          <FlatList
            data={this.state.data}
            renderItem={this._renderItem}
            ItemSeparatorComponent={this.renderItemSeparator}
          />
        </Container>
      </View>
    )
  }
}
