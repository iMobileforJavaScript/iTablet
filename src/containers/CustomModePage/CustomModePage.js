/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { SThemeCartography, SMap } from 'imobile_for_reactnative'
import { Container } from '../../components'
import { color } from '../../styles'
import { scaleSize, setSpText, Toast } from '../../utils'
import { ToolbarModule } from '../workspace/components/ToolBar/modules'
import { ConstToolType, TouchType } from '../../constants'
import { getLanguage } from '../../language'

export default class CustomModePage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.type = (params && params.type) || ToolbarModule.getData().type
    this.state = {
      originData: [],
      data: [],
      length: 0,
    }
  }
  async componentDidMount() {
    let data = ToolbarModule.getData().customModeData
    let length
    if (data) {
      length = data.length
    } else {
      let layerParams = {
        LayerName: GLOBAL.currentLayer.name || '',
      }
      switch (this.type) {
        case ConstToolType.MAP_THEME_PARAM_RANGE_MODE:
          data = await SThemeCartography.getRangeList(layerParams)
          break
        case ConstToolType.MAP_THEME_PARAM_RANGELABEL_MODE:
          data = await SThemeCartography.getRangeLabelList(layerParams)
          break
        case ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR:
          data = await SThemeCartography.getUniqueList(layerParams)
          break
        case ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_COLOR:
          data = await SThemeCartography.getUniqueLabelList(layerParams)
          break
      }
      length = data.length
    }
    this.setState({
      originData: data,
      data,
      length,
    })
  }

  _back = async () => {
    let mapXml = ToolbarModule.getData().mapXml
    await SMap.mapFromXml(mapXml) // 不保存专题图修改，还原地图
    this.props.navigation.goBack()
    GLOBAL.PreviewHeader && GLOBAL.PreviewHeader.setVisible(false)
    GLOBAL.PreviewColorPicker && GLOBAL.PreviewColorPicker.setVisible(false)
    GLOBAL.ToolBar && GLOBAL.ToolBar.existFullMap()
    ToolbarModule.setData({})
  }

  _changeItemVisible = index => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    data[index].visible = !data[index].visible
    this.setState({
      data,
    })
  }
  _changeItemValue = (index, text) => {
    if (isNaN(Math.round(text)) || text.indexOf('.') > 0) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.ONLY_INTEGER)
      return
    }
    let data = JSON.parse(JSON.stringify(this.state.data))
    let item = data[index]
    let nextItem = data[index + 1]
    let val = text
    if (text <= Math.round(item.start)) {
      val = Math.round(item.start) + 1
    } else if (text >= Math.round(nextItem.end)) {
      val = Math.round(nextItem.end) - 1
    }
    data[index].end = val + ''
    data[index + 1].start = val + ''
    this.setState({
      data,
    })
  }

  _changeLength = length => {
    if (isNaN(Math.round(length)) || length.indexOf('.') > 0 || length < 3) {
      Toast.show(
        getLanguage(GLOBAL.language).Prompt.ONLY_INTEGER_GREATER_THAN_2,
      )
      return
    }
    let data = JSON.parse(JSON.stringify(this.state.data))
    let min = data[0].end - 0
    let max = data[this.state.length - 1].start - 0

    let rand = (max - min) / (length - 2)

    let minusRel = this.state.length - length
    if (minusRel > 0) {
      data.splice(this.state.length - 1 - minusRel, minusRel)
    } else {
      for (let i = 0; i < Math.abs(minusRel); i++) {
        let newObj = {
          visible: true,
          color: {
            r: 0,
            g: 0,
            b: 0,
          },
        }
        data.splice(this.state.length - 1, 0, newObj)
      }
    }
    data.map((item, index) => {
      if (item.start === 'min' || item.end === 'max') {
        return
      }
      item.start = min + rand * (index - 1) + ''
      item.end = min + rand * index + ''
    })
    this.setState({
      data,
      length: ~~length,
    })
  }

  _preView = async () => {
    let data = {
      LayerName: GLOBAL.currentLayer.name,
      RangeList: this.state.data,
    }
    let rel = await this._setAttrToMap(data)
    if (rel) {
      const params = ToolbarModule.getParams()
      params.showFullMap && params.showFullMap(true)
      GLOBAL.PreviewHeader && GLOBAL.PreviewHeader.setVisible(true)
      ToolbarModule.addData({
        customModeData: this.state.data,
        type: this.type,
      })
      this.props.navigation.goBack()
    } else {
      Toast.show(getLanguage(GLOBAL.language).Prompt.PARAMS_ERROR)
    }
  }

  _confirm = async () => {
    let data = {
      LayerName: GLOBAL.currentLayer.name,
      RangeList: this.state.data,
    }
    let rel = await this._setAttrToMap(data)
    if (rel) {
      GLOBAL.PreviewHeader && GLOBAL.PreviewHeader.setVisible(false)
      GLOBAL.PreviewColorPicker && GLOBAL.PreviewColorPicker.setVisible(false)
      GLOBAL.ToolBar && GLOBAL.ToolBar.existFullMap()
      GLOBAL.TouchType = TouchType.NORMAL
      ToolbarModule.setData({})
      this.props.navigation.goBack()
    } else {
      Toast.show(getLanguage(GLOBAL.language).Prompt.PARAMS_ERROR)
    }
  }

  _pressColor = index => {
    const params = ToolbarModule.getParams()
    ToolbarModule.addData({ customModeData: this.state.data, type: this.type })
    params.showFullMap && params.showFullMap(true)
    GLOBAL.PreviewHeader && GLOBAL.PreviewHeader.setVisible(true)
    GLOBAL.PreviewColorPicker &&
      GLOBAL.PreviewColorPicker.setVisible(true, index)
    this.props.navigation.goBack()
  }

  _setAttrToMap = async params => {
    let result
    switch (this.type) {
      case ConstToolType.MAP_THEME_PARAM_RANGE_MODE:
        result = await SThemeCartography.setCustomThemeRange(params)
        break
      case ConstToolType.MAP_THEME_PARAM_RANGELABEL_MODE:
        result = await SThemeCartography.setCustomRangeLabel(params)
        break
      case ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR:
        result = await SThemeCartography.setCustomThemeUnique(params)
        break
      case ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_COLOR:
        result = true
        break
    }
    return result
  }

  _renderRight = () => {
    return (
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.btn} onPress={this._preView}>
          <Text style={styles.rightText}>
            {getLanguage(GLOBAL.language).Map_Main_Menu.PREVIEW}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this._confirm}>
          <Text style={styles.rightText}>
            {getLanguage(GLOBAL.language).Map_Settings.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderInput = () => {
    const minus = require('../../assets/mapTool/icon_minus.png')
    const plus = require('../../assets/mapTool/icon_plus.png')
    let length = this.state.length
    return (
      <View style={styles.row}>
        <Text style={styles.itemTitle}>
          {getLanguage(GLOBAL.language).Map_Main_Menu.RANGE}
        </Text>

        <View style={styles.inputView}>
          <TouchableOpacity
            style={styles.minus}
            onPress={() => {
              this._changeLength(this.state.length - 1 + '')
            }}
          >
            <Image style={styles.icon} source={minus} resizeMode={'contain'} />
          </TouchableOpacity>
          <TextInput
            defaultValue={length + ''}
            style={styles.inputItem}
            keyboardType={'number-pad'}
            returnKeyType={'done'}
            onEndEditing={evt => {
              this._changeLength(evt.nativeEvent.text)
            }}
          />
          <TouchableOpacity
            style={styles.plus}
            onPress={() => {
              this._changeLength(this.state.length + 1 + '')
            }}
          >
            <Image style={styles.icon} source={plus} resizeMode={'contain'} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderItem = ({ item, index }) => {
    let visibleImg = item.visible
      ? require('../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../assets/mapTools/icon_multi_unselected_disable_black.png')
    let start, end, str
    if (item.start) {
      start = item.start === 'min' ? item.start : Math.round(item.start)
      end = item.end === 'max' ? item.end : Math.round(item.end)
      str = `${start}<=x<=`
    } else {
      str = item.title
    }
    let color = `rgb(${item.color.r},${item.color.g},${item.color.b})`
    return (
      <KeyboardAvoidingView behavior={'position'}>
        <View style={styles.itemRow}>
          <View style={styles.left}>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                this._changeItemVisible(index)
              }}
            >
              <Image
                source={visibleImg}
                resizeMode={'contain'}
                style={styles.checkImg}
              />
            </TouchableOpacity>
            <Text style={styles.constText}>{str}</Text>
            {end !== undefined &&
              (end === 'max' ? (
                <Text style={[styles.constText, { marginLeft: 0 }]}>{end}</Text>
              ) : (
                <TextInput
                  value={end + ''}
                  style={styles.normalText}
                  keyboardType={'number-pad'}
                  returnKeyType={'done'}
                  onChangeText={text => {
                    let data = JSON.parse(JSON.stringify(this.state.data))
                    data[index].end = ~~text
                    this.setState({
                      data,
                    })
                  }}
                  onBlur={evt => {
                    this._changeItemValue(index, evt.nativeEvent.text)
                  }}
                />
              ))}
          </View>
          <TouchableOpacity
            style={[styles.right, { backgroundColor: color }]}
            activeOpacity={1}
            onPress={() => {
              this._pressColor(index)
            }}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }

  render() {
    let title, hasSubTitle
    switch (this.type) {
      case ConstToolType.MAP_THEME_PARAM_RANGELABEL_MODE:
        title = getLanguage(GLOBAL.language).Map_Main_Menu
          .THEME_RANGES_LABEL_MAP_TITLE
        hasSubTitle = true
        break
      case ConstToolType.MAP_THEME_PARAM_RANGE_MODE:
        hasSubTitle = true
        title = getLanguage(GLOBAL.language).Map_Main_Menu
          .THEME_RANGES_MAP_TITLE
        break
      case ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR:
        hasSubTitle = false
        title = getLanguage(GLOBAL.language).Map_Main_Menu
          .THEME_UNIQUE_VALUES_MAP_TITLE
        break
      case ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_COLOR:
        hasSubTitle = false
        title = getLanguage(GLOBAL.language).Map_Main_Menu
          .THEME_UNIQUE_VALUE_LABEL_MAP_TITLE
        break
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title,
          backAction: this._back,
          navigation: this.props.navigation,
          headerRight: this._renderRight(),
        }}
      >
        <View style={styles.pageContainer}>
          {hasSubTitle && this._renderInput()}
          <FlatList
            style={styles.list}
            keyExtractor={(item, index) => item.toString() + index}
            data={this.state.data}
            renderItem={this._renderItem}
          />
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.separateColorGray,
  },
  //headerRight
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    height: scaleSize(60),
    maxWidth: scaleSize(120),
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: scaleSize(10),
  },
  rightText: {
    fontSize: setSpText(20),
    color: color.white,
  },
  //page
  pageContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: scaleSize(20),
    height: scaleSize(80),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.white,
  },
  icon: {
    width: scaleSize(40),
    height: scaleSize(40),
    tintColor: color.imageColorBlack,
  },
  inputView: {
    width: scaleSize(100),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputItem: {
    textAlign: 'center',
    width: scaleSize(60),
    height: scaleSize(40),
    fontSize: setSpText(16),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
    backgroundColor: color.white,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  plus: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
    backgroundColor: color.white,
  },
  minus: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
    backgroundColor: color.white,
  },
  itemTitle: {
    fontSize: setSpText(18),
    flex: 1,
  },

  //FlatList
  list: {
    marginTop: scaleSize(20),
    backgroundColor: color.white,
  },
  itemRow: {
    height: scaleSize(80),
    marginHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  checkImg: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    width: scaleSize(120),
    height: scaleSize(40),
  },
  constText: {
    marginLeft: scaleSize(40),
    fontSize: scaleSize(18),
    color: color.gray,
  },
  normalText: {
    fontSize: scaleSize(18),
    width: scaleSize(60),
    height: scaleSize(40),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
