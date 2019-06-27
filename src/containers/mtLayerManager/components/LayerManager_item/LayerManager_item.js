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
import { Toast, scaleSize } from '../../../../utils'
import * as LayerUtils from '../../LayerUtils'

// import { Const } from '../../../../constants'
// import NavigationService from '../../../NavigationService'
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
    map: Object,
    data: Object,
    mapControl: Object,
    isClose: boolean,
    swipeEnabled: boolean,
    hasSelected: boolean, // 是否有选择Radio
    selected: boolean, // 选择Radio
    operable: boolean,
    showRenameDialog: () => {},
    showRemoveDialog: () => {},
    setEditable: () => {},
    onArrowPress: () => {},
    onPress: () => {},
    onAllPress: () => {},
    onToolPress: () => {},
    onOpen: () => {},
    getLayers: () => {},
    child: Array,
    sectionID: number,
    rowID: number,
    selectLayer: Object,
    index: number,
    layers: Object,
    setLayerVisible: () => {},
  }

  static defaultProps = {
    isClose: true,
    swipeEnabled: false,
    hasSelected: false,
    selected: false,
    operable: true,
    child: [],
  }

  constructor(props) {
    super(props)
    let data = this.props.data
    let options = this.getOptions(data)
    let { showLevelOne, showLevelTwo, isVectorLayer } = this.getValidate(data)
    this.state = {
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

    this.renderItem = this.renderItem.bind(this)
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
      this.props.data.type !== DatasetType.TEXT &&
      this.props.data.type !== DatasetType.CAD
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
    } else if (isThemeLayer || this.props.data.type === DatasetType.CAD) {
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

    if (this.props.data.type === 'layerGroup') {
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

  _visible_change = () => {
    this.setState(oldstate => {
      let oldVisibe = oldstate.visible
      ;(async function() {
        this.props.setLayerVisible(this.props.data, !oldVisibe)
      }.bind(this)())
      return { visible: !oldVisibe }
    })
  }

  // _openTheme = () => {
  //   let title = '',
  //     themeType = ''
  //   switch (this.props.data.themeType) {
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
  //   if (this.props.data.type === DatasetType.CAD) {
  //     title = Const.LABEL
  //     themeType = ThemeType.LABEL
  //   }
  //   if (title) {
  //     let editLayer = this.props.layer
  //     Object.assign(editLayer, {
  //       index: this.props.data.index,
  //       themeType: themeType || this.props.data.themeType,
  //       name: this.props.data.name,
  //       caption: this.props.data.caption,
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
  //     type: this.props.data.type,
  //   })
  // }

  // _rename = () => {
  //   this.props.showRenameDialog &&
  //     this.props.showRenameDialog(true, this.props.layer)
  // }

  // _remove = () => {
  //   this.props.showRemoveDialog &&
  //     this.props.showRemoveDialog(true, this.props.data, '是否要删除该图层？')
  // }

  // _unGroup = () => {
  //   this.props.showRemoveDialog &&
  //     this.props.showRemoveDialog(true, this.props.data, '是否要解散该图层组？')
  // }

  _pop_row = async () => {
    if (this.props.onPress) {
      await this.props.onPress({
        data: this.props.data,
      })
    } else return
  }

  _all_pop_row = async () => {
    if (this.props.onAllPress) {
      await this.props.onAllPress({
        data: this.props.data,
      })
    } else return
  }

  _tool_row = async () => {
    if (this.props.onToolPress) {
      await this.props.onToolPress({
        data: this.props.data,
        index: this.props.index,
      })
    } else return
  }

  refreshChildlist= async ()=>{
    let isShow = this.state.rowShow
    if (this.props.data.type === 'layerGroup') {
      let child = []
      if (isShow) {
        child =
          (this.props.onArrowPress &&
            (await this.props.onArrowPress({
              layer: this.props.data.layer,
              data: this.props.data,
              // sectionID: this.state.sectionID,
            }))) ||
          []

        this.setState({
          rowShow: isShow,
          child: child,
        })
      }
    }
  }
  _arrow_pop_row = async () => {
    let isShow = !this.state.rowShow
    if (this.props.data.type === 'layerGroup') {
      let child = []
      if (isShow) {
        child =
          (this.props.onArrowPress &&
            (await this.props.onArrowPress({
              layer: this.props.data.layer,
              data: this.props.data,
              // sectionID: this.state.sectionID,
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
            data: this.props.data,
          }))
      })
    }
  }

  updateChild = (child = []) => {
    this.setState({
      child: child,
    })
  }

  _renderAdditionView = () => {
    return <View style={styles.additionView}>{this.state.child}</View>
  }

  getStyleIconByType = item => {
    if (item.themeType > 0) {
      if (this.props.selectLayer === this.props.data.name) {
        return getThemeWhiteIconByType(item.themeType)
      } else {
        return getThemeIconByType(item.themeType)
      }
    } else if (item.isHeatmap) {
      if (this.props.selectLayer === this.props.data.name) {
        return getThemeAssets().themeType.heatmap_selected
      } else {
        return getThemeAssets().themeType.heatmap
      }
    } else {
      if (this.props.selectLayer === this.props.data.name) {
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
        cb && cb(this.props.data)
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
            await this.props.getLayers()
          }.bind(this)())
        },
      },
      {
        title: getLanguage(global.language).Map_Layer.LAYERS_MOVE_DOWN,
        onPress: () => {
          (async function() {
            await SMap.moveDownLayer(layer.path)
            await this.props.getLayers()
          }.bind(this)())
        },
      },
      {
        title: getLanguage(global.language).Map_Layer.LAYERS_TOP,
        onPress: () => {
          (async function() {
            await SMap.moveToTop(layer.path)
            let count = await SMap.getTaggingLayerCount(
              this.props.user.currentUser.userName,
            )
            for (let i = 0; i < count; i++) {
              await SMap.moveDownLayer(layer.path)
            }
            await this.props.getLayers()
          }.bind(this)())
        },
      },
      {
        title: getLanguage(global.language).Map_Layer.LAYERS_BOTTOM,
        onPress: () => {
          (async function() {
            await SMap.moveToBottom(layer.path)
          }.bind(this)())
          if (
            LayerUtils.isBaseLayer(
              this.props.layers[this.props.layers.length - 1].name,
            )
          ) {
            SMap.moveUpLayer(layer.path)
          }
          // if (
          //   this.props.layers[this.props.layers.length - 1].name.indexOf(
          //     'vec@TD',
          //   ) >= 0
          // ) {
          //   SMap.moveToBottom(layer.name)
          // }
          this.props.getLayers()
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
  renderItem() {
    let name = this.props.data.caption
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
    ) : this.props.data.groupName ? (
      <View style={styles.btn} />
    ) : null
    let select = 'transparent'
    let selectcolor = color.black
    let visibleImg = visibleImgBlack
    let moreImg = require('../../../../assets/function/icon_shallow_more_gray.png')
    let image = this.getStyleIconByType(this.props.data)
    if (this.props.selectLayer === this.props.data.name) {
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

    let thisHandle = this
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
            thisHandle.props.data.name.indexOf('@Label_') === -1 &&
            !LayerUtils.isBaseLayer(thisHandle.props.data.name)
          ) {
            this._showPopover(iTemView, this.props.data)
          }
        }}
      >
        <View style={styles.btn_container}>
          {this.props.data.type === LAYER_GROUP ? (
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
                this.props.data.type === DatasetType.POINT &&
                this.props.data.themeType <= 0
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
          this.props.onOpen && this.props.onOpen(this.props.data)
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
