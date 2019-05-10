import React, { Component } from 'react'
import { Container } from '../../components'
import constants from '../workspace/constants'
import NavigationService from '../NavigationService'
import { MapToolbar } from '../workspace/components'
import {
  SectionList,
  View,
  InteractionManager,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import styles from './styles'
import { getMapSettings, getThematicMapSettings } from './settingData'
import SettingSection from './SettingSection'
import SettingItem from './SettingItem'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../language/index'
import { ConstToolType } from '../../constants'
import { scaleSize } from '../../utils'
import size from '../../styles/size'
import color from '../../styles/color'

export default class MapSetting extends Component {
  props: {
    language: string,
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
    InteractionManager.runAfterInteractions(() => {
      this.getData()
    })
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

  getData = async () => {
    let newData
    if (GLOBAL.Type === constants.MAP_THEME) {
      newData = getThematicMapSettings()
    } else {
      let isAntialias = await SMap.isAntialias()
      let isOverlapDisplayed = await SMap.isOverlapDisplayed()
      let isVisibleScalesEnabled = await SMap.isVisibleScalesEnabled()
      let isEnableRotateTouch = SMap.isEnableRotateTouch()
      let isEnableSlantTouch = SMap.isEnableSlantTouch()

      newData = getMapSettings()
      newData[0].data[0].value = isEnableRotateTouch
      newData[0].data[1].value = isEnableSlantTouch
      newData[1].data[0].value = isAntialias
      newData[1].data[1].value = isOverlapDisplayed
      newData[2].data[0].value = isVisibleScalesEnabled
    }

    this.setState({
      data: newData,
    })
  }

  getLegendData = async () => {
    let newData = JSON.parse(JSON.stringify(this.state.data))
    newData[0].data[2].value = this.props.mapLegend

    this.setState({
      data: newData,
    })
  }

  headerAction = section => {
    let newData = JSON.parse(JSON.stringify(this.state.data))
    section.visible = !section.visible

    for (let i = 0; i < newData.length; i++) {
      if (newData[i].title === section.title) {
        newData[i] = section
        break
      }
    }

    this.setState({
      data: newData,
    })
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setSaveViewVisible = visible => {
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, this.setLoading)
  }

  _onValueChange = ({ value, index, section }) => {
    let newData = JSON.parse(JSON.stringify(this.state.data))
    let sectionIndex = 0
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].title === section.title) {
        sectionIndex = i
        break
      }
    }
    newData[sectionIndex].data[index].value = value
    switch (newData[sectionIndex].data[index].name) {
      case getLanguage(this.props.language).Map_Setting.ROTATION_GESTURE:
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
      case getLanguage(this.props.language).Map_Setting.THEME_LEGEND:
        this.props.setMapLegend(value)
        if (value) {
          GLOBAL.toolBox &&
            GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
              containerType: 'colortable',
              column: 8,
              tableType: 'scroll',
              isFullScreen: false,
              height: ConstToolType.THEME_HEIGHT[3],
            })
          GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
          this.props.navigation.navigate('MapView')
        }
        break
    }
    this.setState({
      data: newData.concat(),
    })
  }

  renderListSectionHeader = ({ section }) => {
    return (
      <SettingSection
        data={section}
        onPress={data => this.headerAction(data)}
      />
    )
  }

  renderListItem = ({ item, index, section }) => {
    if (!section.visible) return <View />
    return (
      <SettingItem
        device={this.props.device}
        section={section}
        data={item}
        index={index}
        onPress={data => this._onValueChange(data)}
      />
    )
  }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.visible ? <View style={styles.itemSeparator} /> : null
  }

  flatListPressHandle = title => {
    //根据title跳转
    NavigationService.navigate('secondMapSettings', { title })
  }
  renderFlatListItem = ({ item }) => {
    const styles = {
      itemWidth: '100%',
      itemHeight: scaleSize(90),
      fontSize: size.fontSize.fontSizeXl,
      imageWidth: scaleSize(45),
      imageHeight: scaleSize(45),
      rightImagePath: require('../../assets/Mine/mine_my_arrow.png'),
    }
    let imageColor = color.imageColorBlack
    let txtColor = color.fontColorBlack
    let title = item.title
    return (
      <View style={{ flex: 1 }} display={this.state.display}>
        <TouchableOpacity
          onPress={() => this.flatListPressHandle(title)}
          style={{
            flexDirection: 'row',
            width: styles.itemWidth,
            height: styles.itemHeight,
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <Text
            style={{
              lineHeight: styles.itemHeight,
              flex: 1,
              textAlign: 'left',
              fontSize: styles.fontSize,
              color: txtColor,
              paddingLeft: 5,
            }}
          >
            {title}
          </Text>
          <Image
            style={{
              width: styles.imageWidth - 5,
              height: styles.imageHeight - 5,
              tintColor: imageColor,
            }}
            resizeMode={'contain'}
            source={styles.rightImagePath}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            height: 1,
            marginHorizontal: 10,
            backgroundColor: color.separateColorGray,
          }}
        />
      </View>
    )
  }

  renderSelection = () => {
    if (this.state.data.length === 0) return <View style={{ flex: 1 }} />
    if (GLOBAL.Type === constants.MAP_THEME) {
      return (
        <FlatList
          renderItem={this.renderFlatListItem}
          data={this.state.data}
          keyExtractor={(item, index) => item.title + index}
          numColumns={1}
        />
      )
    }
    return (
      <SectionList
        sections={this.state.data}
        renderItem={this.renderListItem}
        renderSectionHeader={this.renderListSectionHeader}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
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
        title = getLanguage(this.props.language).Map_Module.MAP_EDIT
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
