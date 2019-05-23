import React, { Component } from 'react'
import { TouchableOpacity, View, Text, Image, ScrollView } from 'react-native'
import { SScene } from 'imobile_for_reactnative'
import styles from './styles'
import { scaleSize } from '../../utils'
import { ConstToolType } from '../../constants'
import { color } from '../../styles'
export default class Layer3DItem extends Component {
  props: {
    item: Object,
    device: Object,
    toHeightItem: Object,
    index: any,
    getlayer3dToolbar: () => {},
    setCurrentLayer3d: () => {},
    overlayView: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      name: props.item.name,
      visible: props.item.visible,
      selectable: props.item.selectable,
      type: props.item.type,
    }
  }

  // changeSelect = async () => {
  //   let newState = this.state
  //   newState.selectable = !this.state.selectable
  //   await SScene.setSelectable(this.state.name, newState.selectable)
  //   this.setState(newState)
  //   // console.log(this.state.visible,this.state.selectable)
  // }
  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.item) !== JSON.stringify(this.props.item) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)
    ){
      return true
    }
    return false
  }
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps) {
    this.setState({
      name: this.props.item.name,
      visible: this.props.item.visible,
      selectable: this.props.item.selectable,
      type: this.props.item.type,
    })
    // this.state = 
  }
  setItemSelectable(selectable) {
    this.setState({ selectable: selectable })
  }

  changeVisible = async () => {
    let newState = this.state
    newState.visible = !this.state.visible
    if (this.state.type === 'Terrain') {
      await SScene.setTerrainLayerListVisible(this.state.name, newState.visible)
    } else {
      await SScene.setVisible(this.state.name, newState.visible)
    }
    this.setState(newState)
  }

  /*
  const layer3dSettingCanSelect = param => [
  {
    title: '',
    data: [
      {
        title: getLanguage(param).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        image: require('../../../../assets/layerToolbar/layer_this.png'),
      },
      {
        title: getLanguage(param).Map_Layer.OPTIONAL,
        image: require('../../../../assets/map/Frenchgrey/icon_selectable_selected.png'),
      },
    ],
  },
]

const layer3dSettingCanNotSelect = param => [
  {
    title: '',
    data: [
      {
        title: getLanguage(param).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        image: require('../../../../assets/layerToolbar/layer_this.png'),
      },
      {
        title: getLanguage(param).Map_Layer.NOT_OPTIONAL,
        image: require('../../../../assets/map/Frenchgrey/icon_selectable.png'),
      },
    ],
  },
]

 {
      title: '',
      data: [
        {
          title: getLanguage(param).Map_Layer.BASEMAP_SWITH,
          image: require('../../../../assets/mapTools/icon_open_black.png'),
        },
      ],
    },
  */
  more = async () => {
    let layer3dToolbar = this.props.getlayer3dToolbar
      ? this.props.getlayer3dToolbar()
      : null
    // let overlayView = this.props.getOverlayView
    //   ? this.props.getOverlayView()
    //   : null
    if (layer3dToolbar) {
      switch (this.state.type) {
        case 'IMAGEFILE':
          layer3dToolbar.setVisible(true, ConstToolType.MAP3D_LAYER3D_IMAGE, {
            isFullScreen: true,
            height: scaleSize(87),
          })
          break
        case 'Terrain':
          layer3dToolbar.setVisible(true, ConstToolType.MAP3D_LAYER3D_TERRAIN, {
            isFullScreen: true,
            height: scaleSize(87),
          })
          break
        default:
          layer3dToolbar.setVisible(true, ConstToolType.MAP3D_LAYER3D_DEFAULT, {
            isFullScreen: true,
            height: scaleSize(174),
          })
          layer3dToolbar.getLayer3dItem(
            this.state,
            this.changeState,
          )
          break
      }
      this.props.overlayView.setVisible(true)
    }
  }

  changeState = canSelectable => {
    this.setState({ selectable: canSelectable })
  }
  render() {
    // let selectImg = this.state.selectable
    //   ? require('../../assets/map/Frenchgrey/icon_selectable_selected.png')
    //   : require('../../assets/map/Frenchgrey/icon_selectable.png')
    // let typeImg=require("")
    let visibleImg, textColor, moreImg, typeImg
    if (
      this.props.toHeightItem.index === this.props.index &&
      this.props.toHeightItem.itemName === this.props.item.name
    ) {
      textColor = { color: color.bgW }
      visibleImg = this.state.visible
        ? require('../../assets/mapTools/icon_multi_selected_disable.png')
        : require('../../assets/mapTools/icon_multi_unselected_disable.png')
      moreImg = require('../../assets/map/Frenchgrey/icon_more_white.png')
      typeImg = require('../../assets/map/Frenchgrey/icon_vectorfile_white.png')
    } else {
      visibleImg = this.state.visible
        ? require('../../assets/mapTools/icon_multi_selected_disable_black.png')
        : require('../../assets/mapTools/icon_multi_unselected_disable_black.png')
      textColor = { color: color.fontColorBlack }
      moreImg = require('../../assets/map/Frenchgrey/icon_more.png')
      typeImg = require('../../assets/map/Frenchgrey/icon_vectorfile.png')
    }
    // console.log(this.state.visible, this.state.selectable)
    // console.log(selectImg, visibleImg)
    return (
      <View>
        <View style={styles.row}>
          {/* <TouchableOpacity onPress={this.changeSelect}>
            <Image source={selectImg} style={styles.selectImg} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={this.changeVisible}>
            <Image source={visibleImg} style={styles.visibleImg} />
          </TouchableOpacity>

          <Image source={typeImg} style={styles.type} />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text style={[styles.itemName, textColor]}>{this.state.name}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.moreView} onPress={this.more}>
            <Image source={moreImg} style={styles.moreImg} />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.itemSeparator,
            {
              width: '100%',
            },
          ]}
        />
      </View>
    )
  }
}
