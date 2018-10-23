/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Toast, scaleSize } from '../../../../utils'

import { BtnOne } from '../../../../components'

export default class Btnbar_home extends React.Component {
  props: {
    mapLoad: () => {},
    myMap: () => {},
    mapShare: () => {},
    track: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          title: '地图加载',
          action: props.mapLoad,
          image: require('../../../../assets/home/icon-map-load.png'),
        },
        {
          // title: '我的地图',
          action: props.myMap,
          image: require('../../../../assets/home/icon-my-map.png'),
        },
        {
          // title: '地图分享',
          action: props.mapShare,
          image: require('../../../../assets/home/icon-map-share.png'),
        },
        {
          // title: '轨迹记录',
          action: props.track,
          image: require('../../../../assets/home/icon-trail-mannagement.png'),
        },
      ],
    }
  }

  renderBtn = ({ data, index }) => {
    if (data.title) {
      return (
        <BtnOne
          key={index}
          onPress={() => {
            if (data.action && typeof data.action === 'function') {
              data.action(data.title)
            } else {
              this._click_defalt(data.title)
            }
          }}
          image={data.image}
          title={data.title}
        />
      )
    } else {
      return <View key={index} style={styles.placeHolder} />
    }
  }

  renderBtns = () => {
    let btns = []
    for (let i = 0; i < this.state.data.length; i++) {
      btns.push(
        this.renderBtn({
          data: this.state.data[i],
          index: i,
        }),
      )
    }
    return btns
  }

  _click_defalt = str => {
    Toast.show('待做' + str || '')
  }

  render() {
    return <View style={styles.container}>{this.renderBtns()}</View>
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    alignSelf: 'center',
    paddingVertical: scaleSize(10),
    width: '90%',
  },
  placeHolder: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
})
