/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Toast ,scaleSize} from '../../../../utils'

import { BtnOne, ListSeparator } from '../../../../components'

export default class Btnbar_home extends React.Component {

  props: {
    mapLoad: () => {},
    myMap: () => {},
    mapShare: () => {},
    track: () => {},
  }

  constructor(props) {
    super(props)
  }

  _addElement = (delegate, src, str) => {
    if (typeof delegate === 'function' && typeof str === 'string') {

      let element = <BtnOne BtnClick={() => {
        delegate(str)
      }} image={src} BtnText={str} />
      return (element)
    } else {
      throw Error('BthBar: please check type of params')
    }
  }

  _click_defalt = str => {
    // defalt function
    Toast.show("待做" + str || '√')
  }

  render() {
    const mapLoadClick = this.props.mapLoad ? this.props.mapLoad : this._click_defalt
    const myMapClick = this.props.myMap ? this.props.myMap : this._click_defalt
    const mapShareClick = this.props.mapShare ? this.props.mapShare : this._click_defalt
    const trackClick = this.props.track ? this.props.track : this._click_defalt
    return (
      <View style={styles.container}>
        {this._addElement(mapLoadClick, require('../../../../assets/home/icon-map-load.png'), '地图加载')}
        {/*{this._addElement(myMapClick, require('../../../../assets/home/icon-my-map.png'), '我的地图')}*/}
        {this._addElement(mapShareClick, require('../../../../assets/home/icon-map-share.png'), '地图分享')}
        {/*{this._addElement(trackClick, require('../../../../assets/home/icon-trail-mannagement.png'), '轨迹记录')}*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'white',
    alignSelf: 'center',
    paddingVertical: scaleSize(10),
  },
})