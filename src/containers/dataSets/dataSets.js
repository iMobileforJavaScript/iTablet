import React from 'react'
import { PixelRatio, Image, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native'
import { Container } from '../../components'
import NavigationService from '../NavigationService'
const point = require('../../assets/map/icon-dot.png')
const line = require('../../assets/map/icon-line.png')
const text = require('../../assets/map/icon-surface.png')
const cad = require('../../assets/map/icon-surface.png')
const region = require('../../assets/map/icon-surface.png')
export default class dataSets extends React.Component {

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
      data: [],
    }
  }
  componentDidMount() {
    this.container.setLoading(true)
    this._adddata()
  }
  _adddata = async () => {
    let result = await this._getdatasetslist(this.datasource)
    this.setState({ data: result })
    this.container.setLoading(false)
  }

  _getdatasetslist = async datasource => {
    try {
      let datasetslist = []
      let count = await datasource.getDatasetCount()
      for (let index = 0; index < count; index++) {
        let dataset = await datasource.getDataset(index)
        let type = await dataset.getType()
        let name = await dataset.getName()
        let result = { name: name, type: type, dataset: dataset }
        datasetslist.push(result)
      }
      return datasetslist
    } catch (error) {
      return error
    }
  }

  _tosetlayer = (w, m, t, d) => {
    NavigationService.navigate('AddLayer', { workspace: w, map: m, type: t, dataset: d ,mapControl:this.mapControl})
  }

  _renderItem = ({ item }) => {
    if (item.type == '1') {
      return (<TouchableOpacity onPress={() => this._tosetlayer(this.workspace, this.map, item.type, item.dataset)} style={styles.itemclick}>
        <Image source={point} style={styles.img} />
        <Text style={styles.item}>{item.name}</Text>
      </TouchableOpacity>)
    }
    else if (item.type == '3') {
      return (<TouchableOpacity onPress={() => this._tosetlayer(this.workspace, this.map, item.dataset, item.dataset)} style={styles.itemclick}>
        <Image source={line} style={styles.img} />
        <Text style={styles.item}>{item.name}</Text>
      </TouchableOpacity>)
    }
    else if (item.type == '7') {
      return (<TouchableOpacity onPress={() => this._tosetlayer(this.workspace, this.map, item.dataset, item.dataset)} style={styles.itemclick}>
        <Image source={text} style={styles.img} />
        <Text style={styles.item}>{item.name}</Text>
      </TouchableOpacity>)
    }
    else if (item.type == '149') {
      return (<TouchableOpacity onPress={() => this._tosetlayer(this.state.workspace, this.state.map, item.dataset, item.dataset)} style={styles.itemclick}>
        <Image source={cad} style={styles.img} />
        <Text style={styles.item}>{item.name}</Text>
      </TouchableOpacity>)
    }
    else if (item.type == '5') {
      return (<TouchableOpacity onPress={() => this._tosetlayer(this.state.workspace, this.state.map, item.dataset)} style={styles.itemclick}>
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