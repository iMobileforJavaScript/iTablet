import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { _getHomePath } from './Method'
import { getLanguage } from '../../../../language'
import { getThemeAssets } from '../../../../assets'
export default class LocalDataItem extends Component {
  props: {
    info: Object,
    isImporting: Boolean,
    itemOnpress: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  getImg = fileType => {
    let img
    switch (fileType) {
      case 'workspace':
        img = getThemeAssets().mine.my_import_ws
        break
      case 'workspace3d':
        img = getThemeAssets().mine.my_import_ws3d
        break
      case 'plotting':
        img = getThemeAssets().mine.my_import_plot
        break
      case 'datasource':
        img = getThemeAssets().mine.my_import_udb
        break
      case 'tif':
        img = getThemeAssets().mine.my_import_tif
        break
      case 'shp':
        img = getThemeAssets().mine.my_import_shp
        break
      case 'mif':
        img = getThemeAssets().mine.my_import_mif
        break
      case 'kml':
        img = getThemeAssets().mine.my_import_kml
        break
      case 'kmz':
        img = getThemeAssets().mine.my_import_kmz
        break
      case 'dwg':
        img = getThemeAssets().mine.my_import_dwg
        break
      case 'dxf':
        img = getThemeAssets().mine.my_import_dxf
        break
      case 'gpx':
        img = getThemeAssets().mine.my_import_gpx
        break
      case 'img':
        img = getThemeAssets().mine.my_import_img
        break
      case 'color':
        img = getThemeAssets().mine.my_color
        break
      case 'symbol':
        img = getThemeAssets().mine.my_symbol
        break
      default:
        img = require('../../../../assets/Mine/mine_my_import_local_light.png')
        break
    }
    return img
  }

  render() {
    let txtInfo = this.props.info.item.fileName
    let txtindex = txtInfo.lastIndexOf('.')
    if (txtindex > 0) {
      txtInfo = txtInfo.substring(0, txtindex)
    }
    let homePath = _getHomePath()
    let path = this.props.info.item.directory.substring(homePath.length)
    let index = path.indexOf('iTablet')
    path = path.slice(index)
    let itemHeight = scaleSize(80)
    let imageWidth = scaleSize(40),
      imageHeight = scaleSize(40)
    // let separatorLineHeight = 1
    let fontSize = size.fontSize.fontSizeXl
    let imageColor = color.imageColorBlack
    let fontColor = color.fontColorBlack
    let display = this.props.info.section.isShowItem ? 'flex' : 'none'
    return (
      <TouchableOpacity
        style={{
          display: display,
          width: '100%',
        }}
        onPress={() => {
          this.props.itemOnpress && this.props.itemOnpress(this.props.info)
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: itemHeight,
            paddingLeft: 15,
          }}
        >
          <View style={{ width: scaleSize(50) }}>
            {this.props.isImporting ? (
              <ActivityIndicator size="small" color="#505050" />
            ) : (
              <Image
                style={{
                  width: scaleSize(50),
                  height: scaleSize(50),
                  tintColor: imageColor,
                }}
                resizeMode={'contain'}
                source={this.getImg(this.props.info.item.fileType)}
              />
            )}
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text
              numberOfLines={1}
              style={{
                marginTop: scaleSize(5),
                color: fontColor,
                paddingLeft: 15,
                fontSize: fontSize,
              }}
            >
              {txtInfo}
            </Text>
            <Text
              ellipsizeMode={'middle'}
              numberOfLines={1}
              style={{
                marginTop: scaleSize(5),
                color: color.fontColorGray,
                paddingLeft: 15,
                fontSize: 10,
                height: 15,
                marginRight: 20,
              }}
            >
              {getLanguage(global.language).Profile.PATH + `:${path}`}
            </Text>
          </View>
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              marginRight: 10,
              // tintColor: imageColor,
            }}
            resizeMode={'contain'}
            source={require('../../../../assets/Mine/icon_more_gray.png')}
          />
        </View>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: color.separateColorGray,
          }}
        />
      </TouchableOpacity>
    )
  }
}
