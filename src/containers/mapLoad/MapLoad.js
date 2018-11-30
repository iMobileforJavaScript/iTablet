import React, { Component } from 'react'
import { View } from 'react-native'

import { BtnbarLoad, ExampleMapList, OffLineList } from './components'
import { UsualTitle, Container } from '../../components'
import { ConstOnline } from '../../constants'
import NavigationService from '../NavigationService'
import { Point2D, Action } from 'imobile_for_reactnative'
import styles from './styles'

export default class MapLoad extends Component {
  props: {
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.map = params.map
    this.mapControl = params.mapControl
  }

  // TD = async () => {
  //     this.map && await this.map.close()
  //     this.workspace && this.workspace.closeAllDatasource()
  //     const point2dModule = new Point2D()
  //     navigator.geolocation.getCurrentPosition(
  //       position => {
  //         let lat = position.coords.latitude
  //         let lon = position.coords.longitude
  //         ;(async () => {
  //           let centerPoint = await point2dModule.createObj(lon, lat)
  //           await this.map.setCenter(centerPoint)
  //           await this.map.viewEntire()
  //           await this.mapControl.setAction(Action.PAN)
  //           await this.map.refresh()
  //           NavigationService.goBack()
  //         }).bind(this)()
  //       }
  //     )
  //     let layerIndex = 0
  //     let dsBaseMap = await this.workspace.openDatasource(ConstOnline.TD.DSParams)
  //     let dataset = await dsBaseMap.getDataset(layerIndex)
  //     await this.map.addLayer(dataset, true)
  //   }

  TD = () => {
    this.cb && this.cb()
    this.goToMapView('TD')
  }

  Baidu = () => {
    this.cb && this.cb()
    this.goToMapView('Baidu')
  }

  OSM = () => {
    this.cb && this.cb()
    this.goToMapView('OSM')
  }

  Google = () => {
    this.cb && this.cb()
    this.goToMapView('Google')
  }

  goToMapView = type => {
    (async function() {
      let key = '',
        exist = false
      let routes = this.props.nav.routes

      if (routes && routes.length > 0) {
        for (let index = 0; index < routes.length; index++) {
          if (routes[index].routeName === 'MapView') {
            key = index === routes.length - 1 ? '' : routes[index + 1].key
            exist = true
            break
          }
        }
      }

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
            key && NavigationService.goBack(key)
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
        NavigationService.navigate('MapView', { wsData: [ConstOnline[type]] })
      }
    }.bind(this)())
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: '打开数据',
          navigation: this.props.navigation,
          headerRight: [],
        }}
      >
        <View style={styles.linlist}>
          <UsualTitle title="本地地图" />
          <OffLineList
            Workspace={this.workspace}
            map={this.map}
            mapControl={this.mapControl}
          />
        </View>
        <View style={styles.btnTabContainer}>
          <UsualTitle title="在线地图" />
          <BtnbarLoad
            TD={this.TD}
            Baidu={this.Baidu}
            OSM={this.OSM}
            Google={this.Google}
          />
        </View>
        <View style={styles.examplemaplist}>
          <UsualTitle title="示例地图" titleStyle={styles.examplemaplist} />
          <ExampleMapList />
        </View>
      </Container>
    )
  }
}
