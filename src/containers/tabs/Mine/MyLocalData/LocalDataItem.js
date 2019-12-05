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
            paddingLeft: 20,
          }}
        >
          <View style={{ width: scaleSize(40) }}>
            {this.props.isImporting ? (
              <ActivityIndicator size="small" color="#505050" />
            ) : (
              <Image
                style={{
                  width: imageWidth,
                  height: imageHeight,
                  tintColor: imageColor,
                }}
                resizeMode={'contain'}
                source={require('../../../../assets/Mine/mine_my_import_local_light.png')}
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
