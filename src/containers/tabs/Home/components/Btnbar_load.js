import * as React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { ConstOnline } from '../../../../constants'
import { scaleSize } from '../../../../utils'
import { BtnOne } from '../../../../components'
import NavigationService from '../../../NavigationService'
import { Point2D, Action } from 'imobile_for_reactnative'
const width = Dimensions.get('window').width

const TDImgSrc = require('../../../../assets/public/TD.png')
const BaiduMapImgSrc = require('../../../../assets/public/Baidu.png')
const OSMImgSrc = require('../../../../assets/public/OSM.png')
const GoogleImgSrc = require('../../../../assets/public/Google.png')

const TD = '天地图'
const Baidu = '百度'
const OSM = 'OSM'
const Google = '谷歌'

export default class Btnbar_mapLoad extends React.Component {
  props: {
    style: any,
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

  _click_TD = () => {
    this.goToMapView('TD')
  }

  _click_Baidu = () => {
    this.goToMapView('Baidu')
  }

  _click_OSM = () => {
    this.goToMapView('OSM')
  }

  _click_Google = () => {
    this.goToMapView('Google')
  }

  goToMapView = type => {
    (async function() {
      let exist = false
      // let routes = this.props.nav.routes

      // if (routes && routes.length > 0) {
      //   for (let index = 0; index < routes.length; index++) {
      //     if (routes[index].routeName === 'MapView') {
      //       key = index === routes.length - 1 ? '' : routes[index + 1].key
      //       exist = true
      //       break
      //     }
      //   }
      // }

      if (exist && this.workspace && this.mapControl && this.map) {
        await this.map.close()
        await this.workspace.closeAllDatasource()
        const point2dModule = new Point2D()

        await this.map.setScale(0.0001)
        navigator.geolocation.getCurrentPosition(position => {
          let lat = position.coords.latitude
          let lon = position.coords.longitude
          ;(async () => {
            let centerPoint = await point2dModule.createObj(lon, lat)
            await this.map.setCenter(centerPoint)
            await this.map.viewEntire()
            await this.mapControl.setAction(Action.PAN)
            await this.map.refresh()
            // key && NavigationService.goBack(key)
          }).bind(this)()
        })
        let DSParams = ConstOnline[type].DSParams
        let labelDSParams = ConstOnline[type].labelDSParams
        let layerIndex = ConstOnline[type].layerIndex

        let dsBaseMap = await this.workspace.openDatasource(DSParams)

        let dataset = await dsBaseMap.getDataset(layerIndex)
        await this.map.addLayer(dataset, true)

        if (ConstOnline[type].labelDSParams) {
          let dsLabel = await this.workspace.openDatasource(labelDSParams)
          await this.map.addLayer(await dsLabel.getDataset(layerIndex), true)
        }
      } else {
        NavigationService.navigate('MapView', ConstOnline[type])
      }
    }.bind(this)())
  }

  render() {
    const TDClick = this.props.TD ? this.props.TD : this._click_TD
    const BaiduClick = this.props.Baidu ? this.props.Baidu : this._click_Baidu
    const OSMClick = this.props.OSM ? this.props.OSM : this._click_OSM
    const GoogleClick = this.props.Google
      ? this.props.Google
      : this._click_Google
    return (
      <View style={[styles.container, this.props.style]}>
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
