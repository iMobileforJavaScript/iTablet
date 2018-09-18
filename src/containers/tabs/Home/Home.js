import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { HomeSwiper, BtnbarHome, HomeUsualMap, BtnbarLoad, OffLineList, ExampleMapList } from './components'
import NavigationService from '../../NavigationService'
import { Container, UsualTitle } from '../../../components'
import { ConstOnline } from '../../../constains'
import { Point2D, Action } from 'imobile_for_javascript'
import styles from './styles'

export default class Home extends Component {
  props: {
    latestMap: Array,
  }

  constructor(props) {
    super(props)
    // const { params } = this.props.navigation.state
    // this.workspace = params.workspace
    // this.map = params.map
    // this.mapControl = params.mapControl
    this.state = {
      sceneStyle: styles.invisibleMap,
      mapviewshow: true,
      selectlist: true,
      BtnbarLoad: true,
      OffLineList: false,
      mapbtn1: styles.mapbtnselected,
      mapbtn2: styles.mapbtn,
    }
  }

  TD = () => {

    this.goToMapView('TD')
  }

  Baidu = () => {
    this.goToMapView('Baidu')
  }

  OSM = () => {
    this.goToMapView('OSM')
  }

  Google = () => {
    this.goToMapView('Google')
  }

  goToMapView = type => {
    NavigationService.navigate('MapView', ConstOnline[type])
  }

  offmap = async () => {
    this.setState({ OffLineList: false, BtnbarLoad: true, mapbtn1: styles.mapbtnselected, mapbtn2: styles.mapbtn })
  }
  onlinemap = async () => {
    this.setState({ BtnbarLoad: false, OffLineList: true, mapbtn1: styles.mapbtn, mapbtn2: styles.mapbtnselected })
  }

  _goToMapLoad = () => { this.setState({ mapviewshow: !this.state.mapviewshow, selectlist: !this.state.selectlist }) }
  // _goToMapLoad = () => {NavigationService.navigate('MapLoad',{})}
  render() {
    return (
      <Container
        scrollable={true}
        withoutHeader
        style={styles.container}>
        <HomeSwiper />
        <BtnbarHome mapLoad={this._goToMapLoad} />
        {this.state.mapviewshow ? (null) :
          (<View style={styles.mapbtnview}>
            <TouchableOpacity style={this.state.mapbtn1} onPress={this.offmap}><Text style={styles.mapunselect}>本地地图</Text></TouchableOpacity>
            <View style={styles.cutline}></View>
            <TouchableOpacity style={this.state.mapbtn2} onPress={this.onlinemap}><Text style={styles.mapunselect}>在线地图</Text></TouchableOpacity>
          </View>)}
        {this.state.selectlist ? (null) :
          (<View style={styles.selectlist}>
            <View>
              {this.state.OffLineList ? (null) : (<OffLineList Workspace={this.workspace} map={this.map} mapControl={this.mapControl} />)}
            </View>
            <View>
              {this.state.BtnbarLoad ? (null) : (<BtnbarLoad
                TD={this.TD}
                Baidu={this.Baidu}
                OSM={this.OSM}
                Google={this.Google}
              />)}
            </View>
          </View>)}
        <View style={styles.btnbarhome}></View>
        <HomeUsualMap data={this.props.latestMap} style={styles.ususalmap} />
        <UsualTitle title='示例地图' style={styles.examplemaplist} />
        <ExampleMapList />
      </Container>
    )
  }
}
