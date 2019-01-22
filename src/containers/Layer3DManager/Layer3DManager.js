import React, { Component } from 'react'
import { Container } from '../../components'
import { MapToolbar } from '../../containers/workspace/components'
import Layer3DItem from './Layer3DItem'
import { SScene } from 'imobile_for_reactnative'
import { View, TouchableOpacity, Text, SectionList, Image } from 'react-native'
import styles from './styles'
export default class Map3DToolBar extends Component {
  props: {
    navigation: Object,
    type: string,
    data: Array,
  }
  constructor(props) {
    super(props)
    this.state = {
      data: [],
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

  componentDidMount() {
    SScene.getLayerList().then(result => {
      let basemaplist = [],
        layerlist = [],
        ablelist = [],
        terrainList = []
      for (let index = 0; index < result.length; index++) {
        const element = result[index]
        let item = { ...element, isShow: true }
        if (item.name === 'bingmap') {
          basemaplist.push(item)
        } else if (item.name === 'NodeAnimation') {
          ablelist.push(item)
        } else {
          layerlist.push(item)
        }
      }
      let data = [
        {
          title: '我的图层',
          data: layerlist,
          visible: true,
          index: 0,
        },
        {
          title: '我的底图',
          data: basemaplist,
          visible: true,
          index: 1,
        },
        {
          title: '我的标注',
          data: ablelist,
          visible: true,
          index: 2,
        },
        {
          title: '我的地形',
          data: terrainList,
          visible: true,
          index: 3,
        },
      ]
      this.setState({ data: data })
    })
  }

  renderListItem = ({ item }) => {
    if (item.isShow) {
      return <Layer3DItem item={item} />
    } else {
      return <View />
    }
  }

  renderListSectionHeader = ({ section }) => {
    let image = section.visible
      ? (image = require('../../assets/mapEdit/icon_spread.png'))
      : (image = require('../../assets/mapEdit/icon_packUP.png'))
    return (
      <TouchableOpacity
        style={styles.section}
        onPress={() => {
          this.refreshList(section)
        }}
      >
        <Image source={image} style={styles.selection} />
        <Text style={styles.sectionsTitle}>{section.title}</Text>
      </TouchableOpacity>
    )
  }

  renderItemSeparatorComponent = () => {}

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

  renderSelection = () => {
    return (
      <SectionList
        sections={this.state.data}
        renderItem={this.renderListItem}
        // ItemSeparatorComponent={this._renderItemSeparator}
        renderSectionHeader={this.renderListSectionHeader}
        keyExtractor={(item, index) => index}
        onRefresh={this.getdata}
        refreshing={false}
      />
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        initIndex={1}
        type={'MAP_3D'}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '图层',
          navigation: this.props.navigation,
          withoutBack: true,
        }}
        bottomBar={this.renderToolBar()}
        bottomProps={{ type: 'fix' }}
      >
        {this.renderSelection()}
      </Container>
    )
  }
}
