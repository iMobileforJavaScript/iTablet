/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 * 三维裁剪多页菜单，左右点击换页
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native'
import styles from './style'
import { scaleSize, setSpText } from '../../../../../../../../utils'
import color from '../../../../../../../../styles/color'
import ConstToolType from '../../../../../../../../constants/ConstToolType'
import { getLanguage } from '../../../../../../../../language'
import { getThemeAssets, getPublicAssets } from '../../../../../../../../assets'

export default class MenuList extends Component {
  props: {
    data: Array,
    device: Object,
    clipSetting: Object,
    changeHeight?: () => {}, //box高度change
    dataChangeCall: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      length: props.data ? props.data.length : 0,
      title: (props.data && props.data[0] && props.data[0].title) || '',
      layers: (props.data && props.data[0] && props.data[0].data) || [],
      data: (props.data && props.data[0] && props.data[0].data) || [],
      hiddenPart: false,
      wrapWidth: (props.device && props.device.width) || 0,
      clipSetting: props.clipSetting,
    }
    //函数防抖
    this.INTERVAL = 400
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.data.length > 0) {
      if (
        JSON.stringify(nextProps.clipSetting) !==
          JSON.stringify(this.state.clipSetting) ||
        JSON.stringify(nextProps.data[this.state.index]) !==
          JSON.stringify(this.state.data)
      ) {
        this.setState({
          data: nextProps.data[this.state.currentIndex].data,
          title: nextProps.data[this.state.currentIndex].title,
          clipSetting: nextProps.clipSetting,
        })
      }
    }
  }
  changeData = type => {
    let data, title
    let currentIndex = this.state.currentIndex
    if (type === 'indexAdd') {
      currentIndex++
    } else {
      currentIndex--
    }
    title = this.props.data[currentIndex].title
    data = this.props.data[currentIndex].data
    this.setState({
      data,
      title,
      currentIndex,
    })
  }

  //获取选中图层
  getlayers = () => {
    return this.state.layers.filter(item => item.isChecked === true)
  }

  // componentDidMount() {
  //   let clipSetting = JSON.parse(JSON.stringify(this.state.clipSetting))
  //   clipSetting.layers = this.getlayers()
  //   this.setState({
  //     clipSetting,
  //   })
  // }
  //改变第一页图层的选中状态
  changeListSelect = (title, index) => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    let layers = JSON.parse(JSON.stringify(this.state.layers))
    data[index].isChecked = !data[index].isChecked
    if (title === getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER) {
      layers[index].isChecked = !layers[index].isChecked
    }
    this.setState(
      {
        layers,
        data,
      },
      () => {
        this.mapcut()
      },
    )
  }

  //toolbar显示/部分隐藏
  changeHeight = () => {
    let hiddenPart = this.state.hiddenPart
    let height = hiddenPart
      ? ConstToolType.TOOLBAR_HEIGHT[5]
      : ConstToolType.HEIGHT[5]
    this.props.changeHeight && this.props.changeHeight(height)
    this.setState({
      hiddenPart: !hiddenPart,
    })
  }

  //改变input的值
  changeNumber = ({ flag, title, number }) => {
    let clipSetting = JSON.parse(JSON.stringify(this.state.clipSetting))
    let needBigerThanZero = false
    let stepNum = 1
    let needSmallerThan360 = false
    switch (title) {
      case 'X':
      case 'Y':
        stepNum = 0.00001
        needSmallerThan360 = true
        needBigerThanZero = true
        break
      case 'Z':
        stepNum = 0.5
        needBigerThanZero = true
        break
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_XROT:
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_YROT:
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_ZROT:
        needSmallerThan360 = true
        needBigerThanZero = true
        break
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_LENGTH:
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_WIDTH:
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_HEIGHT:
        needBigerThanZero = true
        break
    }
    let key = title
      .replace('旋转', 'Rot')
      .replace('底面长', 'length')
      .replace('底面宽', 'width')
      .replace('高度', 'height')
    if (number !== undefined) {
      if (needBigerThanZero) {
        number = number > 0 ? number : 0
      }
      if (needSmallerThan360) {
        number = number < 360 ? number : 360
      }
      clipSetting[key] = number
    }
    if (flag === 'minus') {
      if ((needBigerThanZero && clipSetting[key] > 0) || !needBigerThanZero) {
        clipSetting[key] -= stepNum
      }
    } else if (flag === 'plus') {
      if (
        (needSmallerThan360 && clipSetting[key] < 360) ||
        !needSmallerThan360
      ) {
        clipSetting[key] += stepNum
      }
    }
    //容错检验
    if (clipSetting[key].toString().replace(/^\d*./, '').length > 6) {
      clipSetting[key] = clipSetting[key].toFixed(6) - 0
    }
    this.setState(
      {
        clipSetting,
      },
      () => {
        if (number !== 0) {
          this.debounce(this.mapcut)
        }
      },
    )
  }

  mapcut = async () => {
    let data = JSON.parse(JSON.stringify(this.state.clipSetting))
    data.layers = this.getlayers()
    let clipSetting = await this.props.dataChangeCall(data)
    clipSetting.isCliped = true
    this.setState({
      clipSetting,
    })
  }
  changeNumberDebounce = ({ title, number }) => {
    let clipSetting = JSON.parse(JSON.stringify(this.state.clipSetting))
    let canClip = true
    if (number !== null) {
      if (title === 'X' || title === 'Y') {
        number = number < 360 ? (number > -360 ? number : -360) : 360
      } else if (
        title === 'width' ||
        title === 'height' ||
        title === 'length'
      ) {
        number = number < 0 ? 0 : number
        canClip = number
      }
    }
    let key = title
      .replace('旋转', 'Rot')
      .replace('底面长', 'length')
      .replace('底面宽', 'width')
      .replace('高度', 'height')
    clipSetting[key] = number
    this.setState(
      {
        clipSetting,
      },
      () => {
        canClip && this.debounce(this.mapcut)
      },
    )
  }
  debounce = fn => {
    if (
      this.state.clipSetting.width === 0 ||
      this.state.clipSetting.height === 0 ||
      this.state.clipSetting.length === 0
    ) {
      return
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
    let that = this
    this.timer = setTimeout(() => {
      fn()
      clearTimeout(that.timer)
      that.timer = null
    }, this.INTERVAL)
  }
  changeSwitchValue = ({ value, index }) => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    let clipSetting = JSON.parse(JSON.stringify(this.state.clipSetting))
    let pos = ~~index
    data[pos].value = value
    if (
      data[pos].title === getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_INNER
    )
      clipSetting.clipInner = value
    this.setState(
      {
        data,
        clipSetting,
      },
      () => {
        this.debounce(this.mapcut)
      },
    )
  }

  onInputBlur = item => {
    if (item.value) {
      this.changeNumberDebounce({
        title: item.title,
        number: Number.parseFloat(item.value),
      })
    }
  }
  renderSelectableItem = ({ item, index }) => {
    item = this.state.layers[index]
    let visibleImgBlack = item.isChecked
      ? require('../../../../../../../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../../../../../../../assets/mapTools/icon_multi_unselected_disable_black.png')

    let layerIcon = getThemeAssets().layer3dType.layer3d_type_normal

    switch (item.type) {
      case 'IMAGEFILE':
        layerIcon = getThemeAssets().layer3dType.layer3d_type_image
        break
      case 'KML':
        layerIcon = getThemeAssets().layer3dType.layer3d_type_kml
        break
      case 'Terrain':
        layerIcon = require('../../../../../../../../assets/map/Frenchgrey/icon_vectorfile.png')
        break
    }
    if (item.title === 'TianDiTu' || item.title === 'BingMap') {
      layerIcon = require('../../../../../../../../assets/Mine/my_basemap.png')
    }
    if (item.title === 'NodeAnimation') {
      layerIcon = require('../../../../../../../../assets/Mine/mine_my_plot.png')
    }
    return (
      <View>
        <View style={[styles.row, { justifyContent: 'flex-start' }]}>
          <TouchableOpacity
            onPress={() => {
              this.changeListSelect(this.state.title, index)
            }}
          >
            <Image style={styles.icon} source={visibleImgBlack} />
          </TouchableOpacity>
          <Image
            style={[styles.icon, { marginHorizontal: scaleSize(10) }]}
            source={layerIcon}
          />
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
        {this.renderLine()}
      </View>
    )
  }
  renderInputItem = ({ item }) => {
    const minus = require('../../../../../../../../assets/mapTool/icon_minus.png')
    const plus = require('../../../../../../../../assets/mapTool/icon_plus.png')
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{item.title}</Text>

          <View style={styles.inputView}>
            <TouchableOpacity
              style={styles.minus}
              onPress={() => {
                this.changeNumber({ flag: 'minus', title: item.title })
              }}
            >
              <Image
                style={styles.icon}
                source={minus}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TextInput
              defaultValue={item.value + ''}
              style={styles.inputItem}
              onChangeText={text => {
                let val = text - 0
                if (text !== '') text = val > 360 ? 360 : val
                else text = 0
                let clipSetting = JSON.parse(
                  JSON.stringify(this.state.clipSetting),
                )
                let key = item.title.replace('旋转', 'Rot')
                if (val === 0 || val > 360) {
                  clipSetting[key] = val === 0 ? '' : val
                  this.setState(
                    {
                      clipSetting,
                    },
                    () => {
                      clipSetting = JSON.parse(
                        JSON.stringify(this.state.clipSetting),
                      )
                      clipSetting[key] = val === 0 ? 0 : 360
                      this.setState({ clipSetting })
                    },
                  )
                } else {
                  clipSetting[key] = text
                  this.setState({
                    clipSetting,
                  })
                }
              }}
              onBlur={() => {
                this.onInputBlur(item)
              }}
              keyboardType={'number-pad'}
            />
            <TouchableOpacity
              style={styles.plus}
              onPress={() => {
                this.changeNumber({ flag: 'plus', title: item.title })
              }}
            >
              <Image style={styles.icon} source={plus} resizeMode={'contain'} />
            </TouchableOpacity>
          </View>
        </View>
        {this.renderLine()}
      </View>
    )
  }
  renderTextItem = ({ item }) => {
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={{ flex: 1, paddingRight: scaleSize(20) }}>
            <TextInput
              defaultValue={item.value + ''}
              style={styles.rightText}
              keyboardType={'number-pad'}
              onChangeText={text => {
                let val = text - 0
                if (text !== '')
                  text = val > 100000 ? 100000 : val < 0 ? 0 : val
                else text = 0
                let clipSetting = JSON.parse(
                  JSON.stringify(this.state.clipSetting),
                )
                let key = item.title
                  .replace('底面长', 'length')
                  .replace('底面宽', 'width')
                  .replace('高度', 'height')
                if (val === 0 || val > 100000) {
                  clipSetting[key] = val === 0 ? '' : val
                  this.setState(
                    {
                      clipSetting,
                    },
                    () => {
                      clipSetting = JSON.parse(
                        JSON.stringify(this.state.clipSetting),
                      )
                      clipSetting[key] = val === 0 ? 0 : 100000
                      this.setState({ clipSetting })
                    },
                  )
                } else {
                  clipSetting[key] = text
                  this.setState({
                    clipSetting,
                  })
                }
              }}
              onBlur={() => {
                this.onInputBlur(item)
              }}
              // onEndEditing={evt => {
              //   let val = evt.nativeEvent.text
              //   !val && (val = 0)
              //   this.changeNumberDebounce({
              //     title: item.title,
              //     number: Number.parseFloat(val),
              //   })
              // }}
            />
          </View>
        </View>
        {this.renderLine()}
      </View>
    )
  }
  renderSwitchItem = ({ item, index }) => {
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Switch
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={item.value ? color.bgW : color.bgW}
            ios_backgroundColor={item.value ? color.switch : color.bgG}
            value={item.value}
            onValueChange={value => {
              this.changeSwitchValue({ value, index })
            }}
          />
        </View>
        {this.renderLine()}
      </View>
    )
  }
  renderArrowItem = ({ item }) => {
    let arrowIcon = require('../../../../../../../../assets/Mine/mine_my_arrow.png')
    return (
      <View>
        <TouchableOpacity onPress={() => {}} style={styles.row}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Image style={styles.icon} source={arrowIcon} />
        </TouchableOpacity>
        {this.renderLine()}
      </View>
    )
  }
  //渲染分割线
  renderLine = () => {
    return (
      <View
        style={{
          flex: 1,
          height: 1,
          marginHorizontal: 20,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }
  renderTitle = () => {
    let backImage = require('../../../../../../../../assets/public/icon_map3d_back.png')
    let forwardImage = require('../../../../../../../../assets/public/icon_map3d_forward.png')
    let icon = this.state.hiddenPart
      ? getPublicAssets().mapTools.icon_arrow_up
      : getPublicAssets().mapTools.icon_arrow_down
    return (
      <View
        style={{
          flexDirection: 'column',
          height: scaleSize(82),
          paddingBottom: scaleSize(8),
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            height: scaleSize(40),
            alignItems: 'center',
          }}
          onPress={() => {
            this.changeHeight()
          }}
        >
          <Image
            style={{
              height: scaleSize(40),
            }}
            source={icon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            height: scaleSize(42),
            paddingHorizontal: scaleSize(10),
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            {this.state.currentIndex > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  this.changeData('indexMinus')
                }}
              >
                <Image
                  style={styles.titleImage}
                  resizeMode={'contain'}
                  source={backImage}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.titleImage} />
            )}
            <Text
              style={{
                fontSize: setSpText(20),
                marginLeft: scaleSize(20),
              }}
            >
              {this.state.title}
            </Text>
          </View>
          {this.state.currentIndex < this.state.length - 1 ? (
            <TouchableOpacity
              onPress={() => {
                this.changeData('indexAdd')
              }}
            >
              <Image
                style={styles.titleImage}
                resizeMode={'contain'}
                source={forwardImage}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.titleImage} />
          )}
        </View>
      </View>
    )
  }
  renderItem = ({ item, index }) => {
    let key
    switch (item.title) {
      case 'X':
      case 'Y':
      case 'Z':
        key = item.title
        break
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_ZROT:
        key = 'zRot'
        break
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_LENGTH:
        key = 'length'
        break
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_WIDTH:
        key = 'width'
        break
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_HEIGHT:
        key = 'height'
        break
      case getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_INNER:
        key = 'clipInner'
        break
    }
    if (key) {
      item.value = this.state.clipSetting[key]
    }
    switch (item.iconType) {
      case 'Arrow':
        return this.renderArrowItem({ item })
      case 'Input':
        return this.renderInputItem({ item })
      case 'Text':
        return this.renderTextItem({ item })
      case 'Switch':
        return this.renderSwitchItem({ item, index })
      case 'Select':
        return this.renderSelectableItem({ item, index })
    }
  }
  render() {
    if (!this.state.data || this.state.data.length === 0) return null
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color.background,
        }}
      >
        {this.renderTitle()}
        <FlatList
          renderItem={this.renderItem}
          data={this.state.data}
          extraData={this.state.clipSetting}
          keyExtractor={(item, index) => item.title + index}
        />
      </View>
    )
  }
}
