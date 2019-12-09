/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
//eslint-disable-next-line
import { ActionPopover } from 'teaset'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { DatasetType, ThemeType, SMap } from 'imobile_for_reactnative'
import { Toast, scaleSize, LayerUtils } from '../../../../utils'
import SwipeOut from 'react-native-swipeout'
import styles from './styles'
import { color } from '../../../../styles'
import {
  getThemeIconByType,
  getThemeWhiteIconByType,
  getLayerIconByType,
  getLayerWhiteIconByType,
  getThemeAssets,
} from '../../../../assets'
import { getLanguage } from '../../../../language'

const LAYER_GROUP = 'layerGroup'

export default class LayerManager_item extends React.Component {
  props: {
    user: Object,
    data: Object,
    parentData?: Object,
    isClose: boolean,
    swipeEnabled: boolean,
    hasSelected: boolean, // 是否有选择Radio
    selected: boolean, // 选择Radio
    operable: boolean,
    // showRenameDialog: () => {},
    // showRemoveDialog: () => {},
    // setEditable: () => {},
    child: Array,
    sectionID: number,
    rowID: number,
    isSelected: boolean,
    index: number,
    layers: Object,
    hasBaseMap: boolean,

    setLayerVisible: () => {},
    onArrowPress: () => {},
    onPress: () => {},
    onAllPress: () => {},
    onToolPress: () => {},
    onOpen: () => {},
    getLayers: () => {},
    refreshParent: () => {},
  }

  static defaultProps = {
    isClose: true,
    isSelected: false,
    swipeEnabled: false,
    hasSelected: false,
    selected: false,
    operable: true,
    child: [],
  }

  constructor(props) {
    super(props)
    let data = JSON.parse(JSON.stringify(this.props.data))
    let options = this.getOptions(data)
    let { showLevelOne, showLevelTwo, isVectorLayer } = this.getValidate(data)
    this.state = {
      data: data,
      selected: props.selected,
      options: options,
      editable: data.isEditable,
      visible: data.isVisible,
      selectable: data.isSelectable,
      snapable: data.isSnapable,
      rowShow: false,
      image: this.getStyleIconByType(data),
      showLevelOne: showLevelOne,
      showLevelTwo: showLevelTwo,
      isVectorLayer: isVectorLayer,
      isClose: false,
      child: props.child,
      sectionID: props.sectionID || 0,
      rowID: props.rowID || 0,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props) !== JSON.stringify(nextProps)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.getData(this.props.data)
    }
  }

  getValidate = data => {
    let isThemeLayer = false,
      showLevelOne = true,
      isVectorLayer = false
    switch (data.themeType) {
      case 0: // 非专题图层
        isThemeLayer = false
        showLevelOne = true
        break
      case ThemeType.UNIQUE:
      case ThemeType.RANGE:
        isThemeLayer = true
        showLevelOne = true
        break
      case ThemeType.LABEL:
      default:
        isThemeLayer = true
        showLevelOne = false
        break
    }
    let showLevelTwo =
      data.type !== DatasetType.CAD && data.type !== LAYER_GROUP
    if (
      data.type === DatasetType.CAD ||
      data.type === DatasetType.LINE ||
      data.type === DatasetType.LINE3D ||
      data.type === DatasetType.POINT ||
      data.type === DatasetType.POINT3D ||
      data.type === DatasetType.REGION ||
      data.type === DatasetType.REGION3D ||
      data.type === DatasetType.TEXT ||
      data.type === DatasetType.TABULAR
    ) {
      isVectorLayer = true
    }

    return { isThemeLayer, showLevelOne, showLevelTwo, isVectorLayer }
  }

  getData = (data = this.props.data) => {
    (async function() {
      let options = this.getOptions(data)
      let { showLevelOne, isVectorLayer } = this.getValidate(data)
      this.setState({
        data,
        showLevelOne: !showLevelOne,
        isVectorLayer: isVectorLayer,
        options: options,
        editable: data.isEditable && !showLevelOne,
        // visible: data.isVisible && !showLevelOne,
        visible: data.isVisible,
        selectable: data.isSelectable && !showLevelOne,
        snapable: data.isSnapable && !showLevelOne,
        rowShow: this.state.rowShow || false,
        image: this.getStyleIconByType(data),
      })
    }.bind(this)())
  }

  // updateEditable = () => {
  //   (async function() {
  //     let idEditable = await this.props.layer.getEditable()
  //     this.setState({
  //       editable: idEditable,
  //     })
  //   }.bind(this)())
  // }

  getOptions = data => {
    let { isThemeLayer, isVectorLayer } = this.getValidate(data)
    let options = []

    if (
      !isThemeLayer &&
      isVectorLayer &&
      data.type !== DatasetType.TEXT &&
      data.type !== DatasetType.CAD
    ) {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-theme-white.png')}
            />
          </View>
        ),
        onPress: this._openTheme,
      })
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-style-white.png')}
            />
          </View>
        ),
        onPress: this._openStyle,
      })
    } else if (isThemeLayer || data.type === DatasetType.CAD) {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-theme-white.png')}
            />
          </View>
        ),
        onPress: this._openTheme,
      })
    }
    options.push({
      component: (
        <View style={styles.btnImageView}>
          <Image
            resizeMode={'contain'}
            style={styles.btnImage}
            source={require('../../../../assets/mapEdit/icon-rename-white.png')}
          />
        </View>
      ),
      onPress: this._rename,
    })

    if (data.type === 'layerGroup') {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-ungroup-white.png')}
            />
          </View>
        ),
        onPress: this._unGroup,
      })
    } else {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-delete-white.png')}
            />
          </View>
        ),
        onPress: this._remove,
      })
    }

    return options
  }

  action = () => {
    Toast.show('待做')
  }

  _visible_change = async () => {
    let oldVisibe = this.state.visible
    let rel = await this.props.setLayerVisible(this.props.data, !oldVisibe)
    if (rel) {
      this.setState(() => {
        let newState = {}
        // if (this.state.data.groupName) {
        let data = JSON.parse(JSON.stringify(this.state.data))
        data.isVisible = !oldVisibe
        newState.data = data
        newState.visible = !oldVisibe
        // }
        return newState
      })
    }
  }

  // _openTheme = () => {
  //   let title = '',
  //     themeType = ''
  //   switch (this.state.data.themeType) {
  //     case ThemeType.LABEL:
  //       title = Const.LABEL
  //       break
  //     case ThemeType.UNIQUE:
  //       title = Const.UNIQUE
  //       break
  //     case ThemeType.RANGE:
  //       title = Const.RANGE
  //       break
  //   }
  //   if (this.state.data.type === DatasetType.CAD) {
  //     title = Const.LABEL
  //     themeType = ThemeType.LABEL
  //   }
  //   if (title) {
  //     let editLayer = this.props.layer
  //     Object.assign(editLayer, {
  //       index: this.state.data.index,
  //       themeType: themeType || this.state.data.themeType,
  //       name: this.state.data.name,
  //       caption: this.state.data.caption,
  //     })
  //     NavigationService.navigate('ThemeEdit', {
  //       title,
  //       layer: this.props.layer,
  //       map: this.props.map,
  //       mapControl: this.props.mapControl,
  //       isThemeLayer: !themeType,
  //     })
  //   } else {
  //     NavigationService.navigate('ThemeEntry', {
  //       layer: this.props.layer,
  //       map: this.props.map,
  //       mapControl: this.props.mapControl,
  //     })
  //   }
  // }

  // _openStyle = () => {
  //   NavigationService.navigate('ThemeStyle', {
  //     layer: this.props.layer,
  //     map: this.props.map,
  //     mapControl: this.props.mapControl,
  //     type: this.state.data.type,
  //   })
  // }

  // _rename = () => {
  //   this.props.showRenameDialog &&
  //     this.props.showRenameDialog(true, this.props.layer)
  // }

  // _remove = () => {
  //   this.props.showRemoveDialog &&
  //     this.props.showRemoveDialog(true, this.state.data, '是否要删除该图层？')
  // }

  // _unGroup = () => {
  //   this.props.showRemoveDialog &&
  //     this.props.showRemoveDialog(true, this.state.data, '是否要解散该图层组？')
  // }

  _pop_row = async () => {
    if (this.props.onPress) {
      await this.props.onPress({
        data: this.state.data,
        parentData: this.props.parentData,
      })
      await SMap.setLayerEditable(this.state.data.path, true)
    } else return
  }

  _all_pop_row = async () => {
    if (this.props.onAllPress) {
      await this.props.onAllPress({
        data: this.state.data,
        parentData: this.props.parentData,
      })
      await SMap.setLayerEditable(this.state.data.path, true)
    } else return
  }

  _tool_row = async () => {
    if (this.props.onToolPress) {
      await this.props.onToolPress({
        data: this.state.data,
        index: this.props.index,
        parentData: this.props.parentData,
      })
    } else return
  }

  setChildrenList = children => {
    this.setState({
      child: children,
    })
  }

  _arrow_pop_row = async () => {
    let isShow = !this.state.rowShow
    if (this.state.data.type === 'layerGroup') {
      let child = []
      if (isShow) {
        child =
          (this.props.onArrowPress &&
            (await this.props.onArrowPress({
              data: this.state.data,
            }))) ||
          []
      }
      this.setState({
        rowShow: isShow,
        child: child,
      })
    } else {
      this.setSelected(!this.state.selected, async () => {
        this.props.onPress &&
          (await this.props.onPress({
            data: this.state.data,
          }))
      })
    }
  }

  _renderAdditionView = () => {
    return <View style={styles.additionView}>{this.state.child}</View>
  }

  getStyleIconByType = item => {
    if (item.themeType > 0) {
      if (this.props.isSelected) {
        return getThemeWhiteIconByType(item.themeType)
      } else {
        return getThemeIconByType(item.themeType)
      }
    } else if (item.isHeatmap) {
      if (this.props.isSelected) {
        return getThemeAssets().themeType.heatmap_selected
      } else {
        return getThemeAssets().themeType.heatmap
      }
    } else {
      if (this.props.isSelected) {
        return getLayerWhiteIconByType(item.type)
      } else {
        return getLayerIconByType(item.type)
      }
    }
  }

  close = () => {
    this.setState({
      isClose: true,
    })
  }

  /**
   * 设置是否选择
   * @param isSelect
   * @param cb
   */
  setSelected = (isSelect, cb?: () => {}) => {
    let select = isSelect
    if (isSelect === null) {
      select = !this.state.selected
    }
    this.setState(
      {
        selected: select,
      },
      () => {
        cb && cb(this.state.data)
      },
    )
  }

  renderRadioBtn = () => {
    let viewStyle = styles.radioView,
      dotStyle = styles.radioSelected
    return (
      <View style={viewStyle}>
        {this.state.selected && <View style={dotStyle} />}
      </View>
    )
  }

  _showPopover = (pressView, layer) => {
    let items = []

    items = [
      {
        title: getLanguage(global.language).Map_Layer.LAYERS_MOVE_UP,
        onPress: () => {
          (async function() {
            await SMap.moveUpLayer(layer.path)
            if (this.props.parentData) {
              this.props.refreshParent &&
                this.props.refreshParent(this.props.parentData)
            } else {
              await this.props.getLayers()
            }
          }.bind(this)())
        },
      },
      {
        title: getLanguage(global.language).Map_Layer.LAYERS_MOVE_DOWN,
        onPress: () => {
          (async function() {
            await SMap.moveDownLayer(layer.path)
            if (this.props.parentData) {
              this.props.refreshParent &&
                this.props.refreshParent(this.props.parentData)
            } else {
              await this.props.getLayers()
            }
          }.bind(this)())
        },
      },
      {
        title: getLanguage(global.language).Map_Layer.LAYERS_TOP,
        onPress: () => {
          (async function() {
            await SMap.moveToTop(layer.path)
            if (layer.path.indexOf('/') === -1) {
              let count = await SMap.getTaggingLayerCount(
                (this.props.user.currentUser &&
                  this.props.user.currentUser.userName) ||
                  'Customer',
              )
              for (let i = 0; i < count; i++) {
                await SMap.moveDownLayer(layer.path)
              }
            }
            if (this.props.parentData) {
              this.props.refreshParent &&
                this.props.refreshParent(this.props.parentData)
            } else {
              await this.props.getLayers()
            }
          }.bind(this)())
        },
      },
      {
        title: getLanguage(global.language).Map_Layer.LAYERS_BOTTOM,
        onPress: () => {
          (async function() {
            await SMap.moveToBottom(layer.path)
            if (layer.path.indexOf('/') === -1 && this.props.hasBaseMap) {
              SMap.moveUpLayer(layer.path)
            }
          }.bind(this)())
          // if (
          //   this.props.layers[this.props.layers.length - 1].name.indexOf(
          //     'vec@TD',
          //   ) >= 0
          // ) {
          //   SMap.moveToBottom(layer.name)
          // }
          if (this.props.parentData) {
            this.props.refreshParent &&
              this.props.refreshParent(this.props.parentData)
          } else {
            this.props.getLayers()
          }
        },
      },
    ]
    pressView.measure((ox, oy, width, height, px, py) => {
      ActionPopover.show(
        {
          x: px,
          y: py,
          width,
          height,
        },
        items,
      )
    })
  }
  renderItem = () => {
    let name = this.state.data.caption
    const visibleImgWhite = this.state.visible
      ? require('../../../../assets/mapTools/icon_multi_selected_disable.png')
      : require('../../../../assets/mapTools/icon_multi_unselected_disable.png')
    const visibleImgBlack = this.state.visible
      ? require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
    const arrowImg = this.state.rowShow
      ? require('../../../../assets/mapEdit/icon-arrow-down.png')
      : require('../../../../assets/mapEdit/icon-arrow-left.png')
    let leftView = this.props.hasSelected ? (
      this.renderRadioBtn()
    ) : this.state.data.groupName ? (
      <View style={styles.btn} />
    ) : null
    let select = 'transparent'
    let selectcolor = color.black
    let visibleImg = visibleImgBlack
    let moreImg = require('../../../../assets/function/icon_shallow_more_gray.png')
    let image = this.getStyleIconByType(this.state.data)
    if (this.props.isSelected) {
      select = '#4680df'
      selectcolor = color.white
      visibleImg = visibleImgWhite
      moreImg = require('../../../../assets/function/icon_shallow_more.png')
    } else {
      select = 'transparent'
      selectcolor = color.black
      visibleImg = visibleImgBlack
      moreImg = require('../../../../assets/function/icon_shallow_more_gray.png')
    }

    let iTemView
    return (
      <TouchableOpacity
        ref={ref => (iTemView = ref)}
        activeOpacity={1}
        style={[styles.rowOne, { backgroundColor: select }]}
        onPress={this._all_pop_row}
        onLongPress={() => {
          //非标注，底图
          if (
            this.state.data.name.indexOf('@Label_') === -1 &&
            !LayerUtils.isBaseLayer(this.state.data.name)
          ) {
            this._showPopover(iTemView, this.state.data)
          }
        }}
      >
        <View style={styles.btn_container}>
          {this.state.data.type === LAYER_GROUP ? (
            <TouchableOpacity style={styles.btn} onPress={this._arrow_pop_row}>
              <Image
                resizeMode={'contain'}
                style={styles.btn_image_samll}
                source={arrowImg}
              />
            </TouchableOpacity>
          ) : (
            leftView
          )}
          {this.props.operable && (
            <TouchableOpacity style={styles.btn} onPress={this._visible_change}>
              <Image
                resizeMode={'contain'}
                style={styles.btn_image}
                source={visibleImg}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btn1} onPress={this._pop_row}>
            <Image
              resizeMode={'contain'}
              style={[
                this.state.data.type === DatasetType.POINT &&
                this.state.data.themeType <= 0
                  ? styles.samllImage
                  : styles.btn_image,
              ]}
              source={image}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.text_container}>
          <Text style={[styles.text, { color: selectcolor }]}>{name}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={this._tool_row}>
          <Image
            resizeMode={'contain'}
            style={styles.more_image}
            source={moreImg}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  renderSwipeItem = () => {
    return (
      <SwipeOut
        style={styles.container}
        close={this.state.isClose}
        // left={rowData.left}
        right={this.state.options}
        // rowID={this.state.rowID}
        // sectionID={this.state.sectionID}
        autoClose={true}
        backgroundColor={'white'}
        onOpen={() => {
          // 参数sectionID, rowID
          this.props.onOpen && this.props.onOpen(this.state.data)
        }}
        buttonWidth={scaleSize(100)}
        // onClose={() => console.log('===close') }
        // scroll={event => console.log('scroll event') }
      >
        {this.renderItem()}
      </SwipeOut>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.swipeEnabled ? this.renderSwipeItem() : this.renderItem()}
        {this.state.rowShow && this._renderAdditionView()}
      </View>
    )
  }
}
