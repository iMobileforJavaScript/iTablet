import React, { Component } from 'react'
import { Container } from '../../components'
import constants from '../workspace/constants'
import NavigationService from '../NavigationService'
import { MapToolbar } from '../workspace/components'
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import styles from './styles'
import {
  getlegendSetting,
  getThematicMapSettings,
  // getnavigationSetting,
  getMapARSettings,
} from './settingData'
import SettingSection from './SettingSection'
import { getLanguage } from '../../language/index'
import { getHeaderTitle } from '../../constants'
import { legendModule } from '../workspace/components/ToolBar/modules'
import { scaleSize } from '../../utils'
import size from '../../styles/size'
import color from '../../styles/color'
export default class MapSetting extends Component {
  props: {
    nav: string,
    language: string,
    navigation: Object,
    currentMap: Object,
    data: Array,
    setMapSetting: () => {},
    closeMap: () => {},
    mapSetting: any,
    device: Object,
    mapLegend: Object,
    appConfig: Object,
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
  }

  getData = async () => {
    let newData = getThematicMapSettings().concat(getlegendSetting())
    /*if (GLOBAL.Type === constants.MAP_THEME) {
      newData = newData.concat(getlegendSetting())
    } else */
    if (GLOBAL.Type === constants.MAP_AR) {
      newData = newData.concat(getMapARSettings())
      //ios先暂时屏蔽POI设置和检测类型
      if (Platform.OS === 'ios') {
        newData.splice(4, 1)
      }
    }
    // if (GLOBAL.Type === constants.MAP_NAVIGATION) {
    //   newData = newData.concat(getnavigationSetting())
    // }
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

  // _onValueChange = ({ value, index, section }) => {
  //   let newData = JSON.parse(JSON.stringify(this.state.data))
  //   let sectionIndex = 0
  //   for (let i = 0; i < newData.length; i++) {
  //     if (newData[i].title === section.title) {
  //       sectionIndex = i
  //       break
  //     }
  //   }
  //   newData[sectionIndex].data[index].value = value
  //   switch (newData[sectionIndex].data[index].name) {
  //     case getLanguage(this.props.language).Map_Setting.ROTATION_GESTURE:
  //       //'手势旋转':
  //       SMap.enableRotateTouch(value)
  //       break
  //     case getLanguage(this.props.language).Map_Setting.PITCH_GESTURE:
  //       //'手势俯仰':
  //       SMap.enableSlantTouch(value)
  //       break
  //     case getLanguage(this.props.language).Map_Setting.ANTI_ALIASING_MAP:
  //       //'反走样地图':
  //       SMap.setAntialias(value)
  //       break
  //     case getLanguage(this.props.language).Map_Setting.SHOW_OVERLAYS:
  //       //'显示压盖对象':
  //       SMap.setOverlapDisplayed(value)
  //       break
  //     case getLanguage(this.props.language).Map_Setting.FIX_SCALE:
  //       //'固定比例尺':
  //       SMap.setVisibleScalesEnabled(value)
  //       break
  //     case getLanguage(this.props.language).Map_Setting.THEME_LEGEND:
  //       this.props.setMapLegend(value)
  //       if (value) {
  //         GLOBAL.toolBox &&
  //           GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
  //             containerType: 'colorTable',
  //             column: 8,
  //             tableType: 'scroll',
  //             isFullScreen: false,
  //             height: ConstToolType.THEME_HEIGHT[3],
  //           })
  //         GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
  //         this.props.navigation.navigate('MapView')
  //       }
  //       break
  //   }
  //   this.setState({
  //     data: newData.concat(),
  //   })
  // }

  renderListSectionHeader = ({ section }) => {
    return (
      <SettingSection
        data={section}
        onPress={data => this.headerAction(data)}
      />
    )
  }

  // renderListItem = ({ item, index, section }) => {
  //   if (!section.visible) return <View />
  //   return (
  //     <SettingItem
  //       device={this.props.device}
  //       section={section}
  //       data={item}
  //       index={index}
  //       onPress={data => this._onValueChange(data)}
  //     />
  //   )
  // }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.visible ? <View style={styles.itemSeparator} /> : null
  }

  flatListPressHandle = title => {
    //图例单独处理
    if (
      title === getLanguage(this.props.language).Map_Settings.LEGEND_SETTING
    ) {
      legendModule().action()
      // let mapLegend = this.props.mapLegend
      // if (mapLegend[GLOBAL.Type].isShow) {
      //   mapLegend[GLOBAL.Type] = {
      //     isShow: true,
      //     backgroundColor: mapLegend[GLOBAL.Type].backgroundColor,
      //     column: mapLegend[GLOBAL.Type].column,
      //     widthPercent: mapLegend[GLOBAL.Type].widthPercent,
      //     heightPercent: mapLegend[GLOBAL.Type].heightPercent,
      //   }
      // } else {
      //   mapLegend[GLOBAL.Type] = {
      //     isShow: true,
      //     backgroundColor: 'white',
      //     column: 2,
      //     widthPercent: 80,
      //     heightPercent: 80,
      //   }
      // }
      // this.props.setMapLegend(mapLegend)
      // GLOBAL.toolBox &&
      //   GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
      //     containerType: 'colorTable',
      //     column: this.props.device.orientation === 'LANDSCAPE' ? 16 : 8,
      //     isFullScreen: false,
      //     height:
      //       this.props.device.orientation === 'LANDSCAPE'
      //         ? ConstToolType.THEME_HEIGHT[2]
      //         : ConstToolType.THEME_HEIGHT[3],
      //   })
      // GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
      // this.props.navigation.navigate('MapView')
    } else {
      //根据title跳转
      NavigationService.navigate('SecondMapSettings', {
        title,
        language: this.props.language,
        //
        device: this.props.device,
      })
    }
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
    if (this.state.data.length === 0)
      return <View style={{ flex: 1, backgroundColor: color.contentWhite }} />
    return (
      <FlatList
        style={{ backgroundColor: color.contentWhite }}
        renderItem={this.renderFlatListItem}
        data={this.state.data}
        keyExtractor={(item, index) => item.title + index}
        numColumns={1}
      />
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        appConfig={this.props.appConfig}
        initIndex={3}
        type={this.type}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getHeaderTitle(GLOBAL.Type),
          navigation: this.props.navigation,
          // backAction: this.back,
          // backImg: require('../../assets/mapTools/icon_close.png'),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          withoutBack: true,
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.renderSelection()}
      </Container>
    )
  }
}
