import React from 'react'
import { PixelRatio, Image, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native'
import { Container } from '../../components'
import NavigationService from '../NavigationService'
import { DatasetType } from 'imobile_for_javascript'
const point = require('../../assets/map/icon-dot.png')
const line = require('../../assets/map/icon-line.png')
const text = require('../../assets/map/icon-surface.png')
const cad = require('../../assets/map/icon-surface.png')
const region = require('../../assets/map/icon-surface.png')
export default class DataSets extends React.Component {

  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.datasource = params.datasource
    this.workspace = params.workspace
    this.mapControl=params.mapControl
    this.map = params.map
    this.name = params.name
    this.state = {
      data: [
        {name:'点',type:DatasetType.POINT},
        {name:'线',type:DatasetType.LINE},
        {name:'面',type:DatasetType.REGION},
        {name:'CAD',type:DatasetType.IMAGE},
        {name:'文本',type:'txt'},
      ],
    }
  }
  _tosetlayer = (w, m, t) => {
    NavigationService.navigate('AddLayer', { workspace: w, map: m, type: t ,mapControl:this.mapControl})
  }

  _renderItem = ({ item }) => {
    if (item.type ===  DatasetType.POINT) {
      return (<TouchableOpacity onPress={() => this._tosetlayer(this.workspace, this.map,item.type)} style={styles.itemclick}>
        <Image source={point} style={styles.img} />
        <Text style={styles.item}>{item.name}</Text>
      </TouchableOpacity>)
    }
    else if (item.type === DatasetType.LINE) {
      return (<TouchableOpacity onPress={() => this._tosetlayer(this.workspace, this.map, item.type)} style={styles.itemclick}>
        <Image source={line} style={styles.img} />
        <Text style={styles.item}>{item.name}</Text>
      </TouchableOpacity>)
    }
    else if (item.type === 'txt') {
      return (<TouchableOpacity onPress={() => this._tosetlayer(this.workspace, this.map, item.type)} style={styles.itemclick}>
        <Image source={text} style={styles.img} />
        <Text style={styles.item}>{item.name}</Text>
      </TouchableOpacity>)
    }
    else if (item.type === DatasetType.IMAGE) {
      return (<TouchableOpacity onPress={() => this._tosetlayer(this.workspace, this.map, item.type)} style={styles.itemclick}>
        <Image source={cad} style={styles.img} />
        <Text style={styles.item}>{item.name}</Text>
      </TouchableOpacity>)
    }
    else if (item.type === DatasetType.REGION  ) {
      return (<TouchableOpacity onPress={() => this._tosetlayer(this.workspace, this.map, item.type)} style={styles.itemclick}>
        <Image source={region} style={styles.img} />
        <Text style={styles.item}>{item.name}</Text>
      </TouchableOpacity>)
    }
    else {
      return null
    }
  }

  _keyExtractor = (item, index) => {
    return index
  }
  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        initWithLoading
        headerProps={{
          title: '选择图层类型',
          navigation: this.props.navigation,
          headerRight: [

          ],
        }}>
        <FlatList
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
    fontSize: 18,
    // margin:10,
    paddingLeft: 5,
    paddingTop: 2,
    // textAlign:'center'
  },
  itemclick: {
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: '#DBDBDB',
    marginTop: 10,
  },
  cantainer: {
    flex: 1,
  },
  img: {
    width: PixelRatio.get() * 20,
    height: PixelRatio.get() * 20,
    marginLeft: 10,
    marginRight: 5,
  },
})