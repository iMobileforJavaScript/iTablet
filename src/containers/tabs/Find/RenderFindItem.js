/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import styles from './Styles'
import { Toast } from '../../../utils/index'
import NavigationService from '../../NavigationService'

export default class RenderFindItem extends Component {
  props: {
    data: Object,
  }

  _navigator = uri => {
    NavigationService.navigate('MyOnlineMap', {
      uri: uri,
    })
  }
  _nextView = async () => {
    if (this.props.data.type === 'WORKSPACE') {
      if (this.props.data.serviceStatus === 'UNPUBLISHED') {
        let dataId = this.props.data.id
        let dataUrl = 'https://www.supermapol.com/web/datas/' + dataId + '.json'
        this._navigator(dataUrl)
      } else {
        Toast.show('服务没有公开，无权限浏览')
      }
    } else {
      let info = this.props.data.type + '数据无法浏览'
      Toast.show(info)
    }
  }

  render() {
    let date = new Date(this.props.data.lastModfiedTime)
    let year = date.getFullYear() + '年'
    let month = date.getMonth() + 1 + '月'
    let day = date.getDate() + '日'
    let hour = date.getHours() + ':'
    if (hour.length < 3) {
      hour = '0' + hour
    }
    let minute = date.getMinutes() + ''
    if (minute.length < 2) {
      minute = '0' + minute
    }
    let time = year + month + day + ' ' + hour + minute
    return (
      <View>
        <TouchableOpacity
          style={styles.itemViewStyle}
          onPress={() => {
            this._nextView()
          }}
        >
          <Image
            resizeMode={'contain'}
            style={styles.imageStyle}
            source={{ uri: this.props.data.thumbnail }}
          />

          <View>
            <Text style={styles.restTitleTextStyle} numberOfLines={1}>
              {this.props.data.fileName}
            </Text>
            <View style={styles.viewStyle2}>
              <Image
                style={styles.imageStyle2}
                resizeMode={'contain'}
                source={require('../../../assets/tabBar/tab-我的-当前.png')}
              />
              <Text style={styles.textStyle2} numberOfLines={1}>
                {this.props.data.nickname}
              </Text>
            </View>
            <View style={[styles.viewStyle2, { marginTop: 5 }]}>
              <Image
                style={styles.imageStyle2}
                resizeMode={'contain'}
                source={require('../../../assets/tabBar/tmp-time-icon.png')}
              />
              <Text style={styles.textStyle2} numberOfLines={1}>
                {time}
              </Text>
            </View>
            {/*<View style={{flex:1}}/>*/}
            {/*<Text style={[styles.restTitleTextStyle,{lineHeight:textHeight,textAlign:'right',paddingRight:25}]}>...</Text>*/}
          </View>
        </TouchableOpacity>
        <View style={styles.separateViewStyle} />
      </View>
    )
  }
}
