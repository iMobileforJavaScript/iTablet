import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { HomeSwiper, BtnbarHome, HomeUsualMap, BtnbarLoad, OffLineList ,ExampleMapList} from './components'
import NavigationService from '../../NavigationService'
import { Container, UsualTitle } from '../../../components'
import { ConstOnline } from '../../../constains'
import { Point2D, Action } from 'imobile_for_javascript'

import styles from './styles'

export default class Home extends Component {
  props: {
    nav: Object,
    latestMap: Array,
  }

  constructor(props) {
    super(props)
    // const { params } = this.props.navigation.state ? this.props.navigation.state:{ }
    // this.workspace = params.workspace
    // this.map = params.map
    // this.mapControl = params.mapControl
    this.state = {
      sceneStyle: styles.invisibleMap,
      mapviewshow: true,
      selectlist: true,
      BtnbarLoad: true,
      OffLineList:false,
      mapbtn1:styles.mapbtnselected,
      mapbtn2:styles.mapbtn,
    }
  }

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
    (async function () {
      let key = '', exist = false
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
        navigator.geolocation.getCurrentPosition(
          position => {
            let lat = position.coords.latitude
            let lon = position.coords.longitude
              ; (async () => {
              let centerPoint = await point2dModule.createObj(lon, lat)
              await this.map.setCenter(centerPoint)
              await this.map.viewEntire()
              await this.mapControl.setAction(Action.PAN)
              await this.map.refresh()
              key && NavigationService.goBack(key)
            }).bind(this)()
          }
        )
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
    }).bind(this)()
  }

   offmap = async () => {
     this.setState({
       OffLineList:false,
       BtnbarLoad:true,
       mapbtn1:styles.mapbtnselected,
       mapbtn2:styles.mapbtn,
     })
   }
   onlinemap = async () => {
     this.setState({
       BtnbarLoad:false,
       OffLineList:true,
       mapbtn1:styles.mapbtn,
       mapbtn2: styles.mapbtnselected,
     })
   }

  _goToMapLoad = () => {
    this.setState({
      mapviewshow:!this.state.mapviewshow,
      selectlist:!this.state.selectlist,
    })
  }

  render() {
    return (
      <Container
        scrollable={true}
        withoutHeader
        style={styles.container}>
        <HomeSwiper />
        <BtnbarHome mapLoad={this._goToMapLoad} />
        {this.state.mapviewshow ? (null) : (<View style={styles.mapbtnview}>
          <TouchableOpacity style={this.state.mapbtn1} onPress={this.offmap}><Text style={styles.mapunselect}>本地地图</Text></TouchableOpacity>
          <View style={styles.cutline} />
          <TouchableOpacity style={this.state.mapbtn2} onPress={this.onlinemap}><Text style={styles.mapunselect}>在线地图</Text></TouchableOpacity>
        </View>)}

        {this.state.selectlist ? (null) : (<View style={styles.selectlist}>
          <View>
            {this.state.OffLineList ? (null) : (<OffLineList Workspace={this.workspace} map={this.map} mapControl={this.mapControl} />)}
          </View>
          <View>
            {this.state.BtnbarLoad ? (null) : (<BtnbarLoad
              TD={this.TD}
              Baidu={this.Baidu}
              OSM={this.OSM}
              Google={this.Google} />)}
          </View>
        </View>)}
        <View style={styles.btnbarhome} />
        <HomeUsualMap data={this.props.latestMap} style={styles.ususalmap} />
        <UsualTitle title='示例地图' style={styles.examplemaplist} />
        <ExampleMapList />
      </Container>
    )
  }
}
