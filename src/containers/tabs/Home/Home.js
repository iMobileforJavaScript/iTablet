import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { HomeSwiper, BtnbarHome, HomeUsualMap, BtnbarLoad, OffLineList, ExampleMapList } from './components'
import NavigationService from '../../NavigationService'
import { Container, UsualTitle } from '../../../components'
import { ConstOnline } from '../../../constains'
import styles from './styles'

export default class Home extends Component {
  props: {
    nav: Object,
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
      mapviewshow: false,
      selectlist: false,
      BtnbarLoad: false,
      OffLineList: true,
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
    this.setState({ OffLineList: true, BtnbarLoad: false, mapbtn1: styles.mapbtnselected, mapbtn2: styles.mapbtn })
  }
  onlinemap = async () => {
    this.setState({ BtnbarLoad: true, OffLineList: false, mapbtn1: styles.mapbtn, mapbtn2: styles.mapbtnselected })
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  _goToMapLoad = () => { this.setState({ mapviewshow: !this.state.mapviewshow, selectlist: !this.state.selectlist }) }
  // _goToMapLoad = () => {NavigationService.navigate('MapLoad',{})}

  renderMapBtn() {
    if (this.state.mapviewshow) {
      return (
        <View style={styles.mapbtnview}>
          <TouchableOpacity style={this.state.mapbtn1} onPress={this.offmap}><Text style={styles.mapunselect}>本地地图</Text></TouchableOpacity>
          <View style={styles.cutline} />
          <TouchableOpacity style={this.state.mapbtn2} onPress={this.onlinemap}><Text style={styles.mapunselect}>在线地图</Text></TouchableOpacity>
        </View>
      )
    }
  }

  renderItem() {

  }

  renderSelectList() {
    if (this.state.selectlist && this.state.OffLineList) {
      return (
        <View style={styles.selectlist}>
          <OffLineList Workspace={this.workspace} map={this.map} mapControl={this.mapControl} />
        </View>
      )
    }
    if (this.state.selectlist && this.state.BtnbarLoad) {
      return (
        <View style={styles.selectlist}>
          <BtnbarLoad
            TD={this.TD}
            Baidu={this.Baidu}
            OSM={this.OSM}
            Google={this.Google}
          />
        </View>
      )
    }
  }
  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        scrollable={true}
        withoutHeader
        style={styles.container}>
        <HomeSwiper />
        <BtnbarHome mapLoad={this._goToMapLoad} />
        {this.renderMapBtn()}
        {this.renderSelectList()}
        <View style={styles.btnbarhome} />
        <HomeUsualMap data={this.props.latestMap} style={styles.ususalmap} />
        <UsualTitle title='示例地图'  />
        <ExampleMapList setLoading={this.setLoading} />
      </Container>
    )
  }
}
