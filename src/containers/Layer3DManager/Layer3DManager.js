import React, { Component } from 'react'
import { Container } from '../../components'
import Layer3DItem from './Layer3DItem'
import { View, TouchableOpacity, Text, SectionList, Image } from 'react-native'
import styles from './styles'
import { scaleSize } from '../../utils'
import { Layer3DManager_tolbar } from '../mtLayerManager/components'
import { OverlayView, MapToolbar } from '../workspace/components'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { color } from '../../styles'
// import { SScene } from 'imobile_for_reactnative'
export default class Layer3DManager extends Component {
  props: {
    language: string,
    navigation: Object,
    type: string,
    data: Array,
    refreshLayer3dList: () => {},
    setCurrentLayer3d: () => {},
    layer3dList: Array,
    device: Object,
    appConfig: Object,
    currentLayer3d: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.layer3dList,
      toHeightItem: {},
    }
  }

  // eslint-disable-next-line
  //   componentWillReceiveProps(nextProps) {
  //     if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
  //       this.setState({
  //         data: nextProps.data,
  //       })
  //     }
  //   }

  componentWillUnmount() {
    this.props.setCurrentLayer3d({})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.layer3dList !== this.state.data) {
      this.setState({ data: nextProps.layer3dList })
    }
  }

  renderListItem = ({ item, index }) => {
    let itembtnStyle =
      this.state.toHeightItem.index === index &&
      this.state.toHeightItem.itemName === item.name
        ? { backgroundColor: '#4680DF' }
        : { backgroundColor: 'transparent' }
    if (item.isShow) {
      return (
        <Layer3DItem
          style={[styles.itemBtn, itembtnStyle]}
          onPress={async () => {
            this.setState({
              toHeightItem: { itemName: item.name, index: index },
            })
            // let data2 = await SScene.getAttributeByName(item.name)
            // console.log(data2)
          }}
          item={item}
          getlayer3dToolbar={this.getlayer3dToolbar}
          device={this.props.device}
          toHeightItem={this.state.toHeightItem}
          index={index}
          overlayView={this.OverlayView}
          setCurrentLayer3d={this.props.setCurrentLayer3d}
        />
      )
    } else {
      return <View />
    }
  }
  renderSectionFooter = ({ section }) => {
    if (
      this.state.data &&
      this.state.data.length > 0 &&
      this.state.data[this.state.data.length - 1].title === section.title
    ) {
      return <View />
    }
    return <View style={styles.sectionFooter} />
  }

  renderListSectionHeader = ({ section }) => {
    let visible = section.visible
    let image = visible
      ? getThemeAssets().publicAssets.icon_arrow_down
      : getThemeAssets().publicAssets.icon_arrow_right_2
    return (
      <TouchableOpacity
        style={styles.section}
        onPress={() => {
          this.refreshList(section)
        }}
      >
        <Image source={image} style={styles.selectionImg} />
        <Text style={styles.sectionsTitle}>{section.title}</Text>
      </TouchableOpacity>
    )
  }

  // renderItemSeparatorComponent = () => {}

  getlayer3dToolbar = () => {
    return this.layer3dToolbar
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

  /**行与行之间的分隔线组件 */
  _renderItemSeparator = ({ section }) => {
    if (section.visible) {
      return (
        <View
          style={{
            flexDirection: 'column',
            marginLeft: scaleSize(84),
            width: '100%',
            height: 1,
            backgroundColor: color.separateColorGray,
          }}
        />
      )
    } else {
      return <View />
    }
  }

  renderSelection = () => {
    return (
      <View style={{ flex: 1 }}>
        <SectionList
          sections={this.state.data}
          renderItem={this.renderListItem}
          renderSectionFooter={this.renderSectionFooter}
          ItemSeparatorComponent={this._renderItemSeparator}
          renderSectionHeader={this.renderListSectionHeader}
          keyExtractor={(item, index) => index}
          onRefresh={this.props.refreshLayer3dList}
          refreshing={false}
          initialNumToRender={15}
          getItemLayout={(data, index) => {
            return {
              length: scaleSize(80),
              offset: scaleSize(80 + 1) * index,
              index,
            }
          }}
        />
      </View>
    )
  }
  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        appConfig={this.props.appConfig}
        initIndex={1}
        type={'MAP_3D'}
      />
    )
  }

  renderLayerToolbar = () => {
    return (
      <Layer3DManager_tolbar
        language={this.props.language}
        navigation={this.props.navigation}
        ref={ref => (this.layer3dToolbar = ref)}
        overlayView={this.OverlayView}
        device={this.props.device}
        layer3dRefresh={this.props.refreshLayer3dList}
      />
    )
  }

  renderOverLayer = () => {
    return <OverlayView ref={ref => (this.OverlayView = ref)} />
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Map_Module.MAP_3D,
          //MAP_MODULE.MAP_3D,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          navigation: this.props.navigation,
          withoutBack: true,
        }}
        bottomBar={this.renderToolBar()}
        // bottomProps={{ type: 'fix' }}
      >
        {this.renderLayerToolbar()}
        {this.renderSelection()}
        {this.renderOverLayer()}
      </Container>
    )
  }
}
