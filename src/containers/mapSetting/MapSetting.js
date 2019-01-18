import React, { Component } from 'react'
import { Container } from '../../components'
import { MAP_MODULE } from '../../constants'
import constants from '../workspace/constants'
// import NavigationService from '../NavigationService'
import { MapToolbar } from '../workspace/components'
import {
  SectionList,
  StatusBar,
  View,
  Platform,
  BackHandler,
} from 'react-native'
import styles from './styles'
import { getMapSettings } from './settingData'
import SettingSection from './SettingSection'
import SettingItem from './SettingItem'
import { SMap } from 'imobile_for_reactnative'
import { SPUtils } from '../../native'

export default class MapSetting extends Component {
  props: {
    navigation: Object,
    data: Array,
    setMapSetting: () => {},
    closeMap: () => {},
    mapSetting: any,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params && params.type
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', this.back)
    this.getData()
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.mapSetting) !==
      JSON.stringify(this.props.mapSetting)
    ) {
      this.setState({ data: this.props.mapSetting })
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.back)
    }
  }

  getData = async () => {
    let statusBar = false
    // let navigationBar = false
    let isAntialias = true
    let isVisibleScalesEnabled = false

    statusBar = await SPUtils.getBoolean('MapSetting', '显示状态栏', false)
    // navigationBar = await SPUtils.getBoolean('MapSetting', '显示导航栏', false)
    isAntialias = await SMap.isAntialias()
    isVisibleScalesEnabled = await SMap.isVisibleScalesEnabled()

    let newData = getMapSettings()
    newData[0].data[0].value = statusBar
    // newData[0].data[1].value = navigationBar
    newData[1].data[0].value = isAntialias
    newData[2].data[0].value = isVisibleScalesEnabled

    this.setState({
      data: newData,
    })
  }

  refreshList = section => {
    let newData = this.state.data
    for (let index = 0; index < section.data.length; index++) {
      section.data[index].isShow = !section.data[index].isShow
    }
    section.visible = !section.visible

    newData[section.index] = section
    this.setState({
      data: newData.concat(),
    })
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setStatusBarHidden = hidden => {
    StatusBar.setHidden(hidden, 'fade')
    StatusBar.setBackgroundColor('#2D2D2F')
    StatusBar.setTranslucent(false)
    StatusBar.setBarStyle('default')
  }

  setSaveViewVisible = visible => {
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, this.setLoading)
  }

  back = () => {
    this.props.navigation.navigate('MapView')
    // if (GLOBAL.Type === ConstToolType.MAP_3D) {
    //   NavigationService.goBack()
    // } else {
    //   this.backAction = async () => {
    //     try {
    //       this.setLoading(true, '正在关闭地图')
    //       await this.props.closeMap()
    //       GLOBAL.clearMapData()
    //       this.setLoading(false)
    //       NavigationService.goBack()
    //     } catch (e) {
    //       this.setLoading(false)
    //     }
    //   }
    //   SMap.mapIsModified().then(async result => {
    //     if (result) {
    //       this.setSaveViewVisible(true)
    //     } else {
    //       await this.backAction()
    //       this.backAction = null
    //     }
    //   })
    // }
    return true
  }

  _onValueChange = ({ value, item, index }) => {
    let newData = this.state.data
    newData[item.sectionIndex].data[index].value = value
    switch (newData[item.sectionIndex].data[index].name) {
      case '显示状态栏':
        SPUtils.putBoolean('MapSetting', '显示状态栏', value)
        this.setStatusBarHidden(!value)
        break
      case '显示导航栏':
        SPUtils.putBoolean('MapSetting', '显示导航栏', value)
        break
      case '地图反走样':
        SMap.setAntialias(value)
        break
      case '固定比例尺':
        SMap.setVisibleScalesEnabled(value)
        break
    }
    this.setState({
      data: newData.concat(),
    })
  }

  renderListSectionHeader = ({ section }) => {
    return (
      <SettingSection data={section} onPress={data => this.refreshList(data)} />
    )
  }

  renderListItem = ({ item, index }) => {
    return (
      <SettingItem
        data={item}
        index={index}
        onPress={data => this._onValueChange(data)}
      />
    )
  }

  renderSelection = () => {
    if (this.state.data.length === 0) return <View style={{ flex: 1 }} />
    return (
      <SectionList
        sections={this.state.data}
        renderItem={this.renderListItem}
        renderSectionHeader={this.renderListSectionHeader}
        keyExtractor={(item, index) => index}
        onRefresh={this.getData}
        refreshing={false}
      />
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        initIndex={3}
        type={this.type}
      />
    )
  }

  render() {
    let title = ''
    switch (GLOBAL.Type) {
      case constants.COLLECTION:
        title = MAP_MODULE.MAP_COLLECTION
        break
      case constants.MAP_EDIT:
        title = MAP_MODULE.MAP_EDIT
        break
      case constants.MAP_3D:
        title = MAP_MODULE.MAP_3D
        break
      case constants.MAP_THEME:
        title = MAP_MODULE.MAP_THEME
        break
    }
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: title,
          navigation: this.props.navigation,
          // backAction: this.back,
          backImg: require('../../assets/mapTools/icon_close.png'),
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.renderSelection()}
      </Container>
    )
  }
}
