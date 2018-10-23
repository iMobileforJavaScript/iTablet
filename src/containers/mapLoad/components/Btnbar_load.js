import * as React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { scaleSize } from '../../../utils'
import { BtnOne } from '../../../components'

const width = Dimensions.get('window').width

const TDImgSrc = require('../../../assets/public/TD.png')
const BaiduMapImgSrc = require('../../../assets/public/Baidu.png')
const OSMImgSrc = require('../../../assets/public/OSM.png')
const GoogleImgSrc = require('../../../assets/public/Google.png')

const TD = '天地图'
const Baidu = '百度'
const OSM = 'OSM'
const Google = '谷歌'

export default class Btnbar_mapLoad extends React.Component {
  props: {
    TD: () => {},
    Baidu: () => {},
    OSM: () => {},
    Google: () => {},
  }

  constructor(props) {
    super(props)
  }

  _addElement = (delegate, src, str) => {
    if (typeof delegate === 'function' && typeof str === 'string') {
      let element = (
        <BtnOne
          onPress={delegate}
          image={src}
          title={str}
          titleStyle={styles.btntop}
        />
      )
      return element
    } else {
      throw Error('BthBar: please check type of params')
    }
  }

  _click_TD = () => {}

  _click_Baidu = () => {}

  _click_OSM = () => {}

  _click_Google = () => {}

  render() {
    const TDClick = this.props.TD ? this.props.TD : this._click_TD
    const BaiduClick = this.props.Baidu ? this.props.Baidu : this._click_Baidu
    const OSMClick = this.props.OSM ? this.props.OSM : this._click_OSM
    const GoogleClick = this.props.Google
      ? this.props.Google
      : this._click_Google
    return (
      <View style={styles.container}>
        {this._addElement(TDClick, TDImgSrc, TD)}
        {this._addElement(BaiduClick, BaiduMapImgSrc, Baidu)}
        {this._addElement(OSMClick, OSMImgSrc, OSM)}
        {this._addElement(GoogleClick, GoogleImgSrc, Google)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 0.9 * width,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  btntop: {
    marginTop: scaleSize(5),
  },
})
