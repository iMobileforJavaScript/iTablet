import React from 'react'
import {
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'
import { Container, ListSeparator } from '../../components'
import NavigationService from '../NavigationService'
import { DatasetType } from 'imobile_for_reactnative'
import { scaleSize } from '../../utils'
import { color, size } from '../../styles'
const point = require('../../assets/map/icon-dot.png')
const line = require('../../assets/map/icon-line.png')
const text = require('../../assets/map/icon-text.png')
const cad = require('../../assets/map/icon-cad.png')
const region = require('../../assets/map/icon-polygon.png')
export default class DataSets extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.datasource = params.datasource
    this.workspace = params.workspace
    this.mapControl = params.mapControl
    this.map = params.map
    this.name = params.name
    this.state = {
      data: [
        { name: '点', type: DatasetType.POINT, imageSize: 'small' },
        { name: '线', type: DatasetType.LINE },
        { name: '面', type: DatasetType.REGION },
        { name: 'CAD', type: DatasetType.CAD },
        { name: '文本', type: DatasetType.TEXT },
      ],
    }
  }
  _tosetlayer = (w, m, t) => {
    NavigationService.navigate('AddLayer', {
      workspace: w,
      map: m,
      type: t,
      mapControl: this.mapControl,
      datasource: this.datasource,
    })
  }

  _renderItem = ({ item }) => {
    if (item.type === DatasetType.POINT) {
      return (
        <TouchableOpacity
          onPress={() => this._tosetlayer(this.workspace, this.map, item.type)}
          style={styles.itemclick}
        >
          <Image
            source={point}
            style={
              item.imageSize === 'small' ? styles.imageSmall : styles.image
            }
          />
          <Text style={styles.rowTitle}>{item.name}</Text>
        </TouchableOpacity>
      )
    } else if (item.type === DatasetType.LINE) {
      return (
        <TouchableOpacity
          onPress={() => this._tosetlayer(this.workspace, this.map, item.type)}
          style={styles.itemclick}
        >
          <Image
            source={line}
            style={
              item.imageSize === 'small' ? styles.imageSmall : styles.image
            }
          />
          <Text style={styles.rowTitle}>{item.name}</Text>
        </TouchableOpacity>
      )
    } else if (item.type === DatasetType.TEXT) {
      return (
        <TouchableOpacity
          onPress={() => this._tosetlayer(this.workspace, this.map, item.type)}
          style={styles.itemclick}
        >
          <Image
            source={text}
            style={
              item.imageSize === 'small' ? styles.imageSmall : styles.image
            }
          />
          <Text style={styles.rowTitle}>{item.name}</Text>
        </TouchableOpacity>
      )
    } else if (item.type === DatasetType.CAD) {
      return (
        <TouchableOpacity
          onPress={() => this._tosetlayer(this.workspace, this.map, item.type)}
          style={styles.itemclick}
        >
          <Image
            source={cad}
            style={
              item.imageSize === 'small' ? styles.imageSmall : styles.image
            }
          />
          <Text style={styles.rowTitle}>{item.name}</Text>
        </TouchableOpacity>
      )
    } else if (item.type === DatasetType.REGION) {
      return (
        <TouchableOpacity
          onPress={() => this._tosetlayer(this.workspace, this.map, item.type)}
          style={styles.itemclick}
        >
          <Image
            source={region}
            style={
              item.imageSize === 'small' ? styles.imageSmall : styles.image
            }
          />
          <Text style={styles.rowTitle}>{item.name}</Text>
        </TouchableOpacity>
      )
    } else {
      return null
    }
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator />
  }

  _keyExtractor = (item, index) => {
    return index
  }
  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '选择图层类型',
          navigation: this.props.navigation,
        }}
      >
        <View style={styles.top} />
        <FlatList
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          style={styles.container}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    color: '#1296db',
    fontSize: 20,
    // margin:10,
    paddingLeft: scaleSize(20),
    // textAlign:'center'
  },
  itemclick: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleSize(30),
  },
  cantainer: {
    flex: 1,
    backgroundColor: color.background,
  },
  itemseparator: {
    height: scaleSize(8),
  },
  top: {
    height: 1,
  },
  rowTitle: {
    fontSize: size.fontSize.fontSizeMd,
    marginLeft: scaleSize(30),
  },
  image: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  imageSmall: {
    height: scaleSize(20),
    width: scaleSize(20),
  },
})
