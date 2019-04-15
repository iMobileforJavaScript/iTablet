import React, { Component } from 'react'
import { Container } from '../../components'
import { MAP_MODULE } from '../../constants'
import constants from '../workspace/constants'
// import NavigationService from '../NavigationService'
import { MapToolbar } from '../workspace/components'
import { SectionList, View, Platform, BackHandler } from 'react-native'
import styles from './styles'
import { getMapSettings } from './settingData'
import SettingSection from './SettingSection'
import SettingItem from './SettingItem'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../language/index'

export default class MapSetting extends Component {
  props: {
    language:Object,
    navigation: Object,
    currentMap: Object,
    data: Array,
    setMapSetting: () => {},
    closeMap: () => {},
    mapSetting: any,
    device: Object,
    mapLegend: boolean,
    setMapLegend: () => {},
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
    } else if (
      JSON.stringify(prevProps.currentMap) !==
        JSON.stringify(this.props.currentMap) &&
      this.props.currentMap.name
    ) {
      this.getData()
    }
    if (
      JSON.stringify(prevProps.mapLegend) !==
      JSON.stringify(this.props.mapLegend)
    ) {
      this.getLegendData()
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.back)
    }
  }

  getData = async () => {
    let isAntialias = await SMap.isAntialias()
    let isOverlapDisplayed = await SMap.isOverlapDisplayed()
    let isVisibleScalesEnabled = await SMap.isVisibleScalesEnabled()

    let newData = getMapSettings()
    newData[1].data[0].value = isAntialias
    newData[1].data[1].value = isOverlapDisplayed
    newData[2].data[0].value = isVisibleScalesEnabled

    this.setState({
      data: newData,
    })
  }

  getLegendData = async () => {
    let newData = getMapSettings()
    newData[0].data[2].value = this.props.mapLegend

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
      case getLanguage(this.props.language).Map_Setting.ROTATION_GRSTURE:
      //'手势旋转':
        SMap.enableRotateTouch(value)
        break
      case getLanguage(this.props.language).Map_Setting.PITCH_GESTURE:
      //'手势俯仰':
        SMap.enableSlantTouch(value)
        break
      case getLanguage(this.props.language).Map_Setting.ANTI_ALIASING_MAP:
      //'反走样地图':
        SMap.setAntialias(value)
        break
      case getLanguage(this.props.language).Map_Setting.SHOW_OVERLAYS:
      //'显示压盖对象':
        SMap.setOverlapDisplayed(value)
        break
      case getLanguage(this.props.language).Map_Setting.FIX_SCALE:
      //'固定比例尺':
        SMap.setVisibleScalesEnabled(value)
        break
      case '专题图图例':
        this.props.setMapLegend(value)
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
        device={this.props.device}
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
        title = getLanguage(this.props.language).Map_Module.MAP_COLLECTION
        //MAP_MODULE.MAP_COLLECTION
        break
      case constants.MAP_EDIT:
        title =getLanguage(this.props.language).Map_Module.MAP_EDIT
        //MAP_MODULE.MAP_EDIT
        break
      case constants.MAP_3D:
        title = getLanguage(this.props.language).Map_Module.MAP_3D
        //MAP_MODULE.MAP_3D
        break
      case constants.MAP_THEME:
        title = getLanguage(this.props.language).Map_Module.MAP_THEME
        //MAP_MODULE.MAP_THEME
        break
      case constants.MAP_PLOTTING:
        title = getLanguage(this.props.language).Map_Module.MAP_PLOTTING
        //MAP_MODULE.MAP_PLOTTING
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
          // backImg: require('../../assets/mapTools/icon_close.png'),
          withoutBack: true,
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.renderSelection()}
      </Container>
    )
  }
}
