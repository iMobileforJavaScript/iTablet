/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, Text, TextInput, FlatList } from 'react-native'
import { Toast, scaleSize } from '../../utils'
import { color } from '../../styles'
import { Container, ListSeparator, TextBtn } from '../../components'
import { LayerManager_item } from '../mtLayerManager/components'
import styles from './styles'

export default class AddLayerGroup extends React.Component {

  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.mapControl = params.mapControl
    this.map = params.map
    this.cb = params.cb
    this.state = {
      datasourceList: [],
      layerList: {},
    }
    this.groupName = ''
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.container.setLoading(true)
    try {
      this.itemRefs = {}
      this.map = await this.mapControl.getMap()
      let layerNameArr = await this.map.getLayersByType()
      for(let i = 0; i < layerNameArr.length; i++) {
        layerNameArr[i].key = layerNameArr[i].name
      }
      let mapName = await this.map.getName()
      this.setState({
        datasourceList: layerNameArr.concat(),
        mapName: mapName,
      }, () => {
        this.container.setLoading(false)
      })
    } catch (e) {
      this.container.setLoading(false)
    }
  }

  select = ({data}) => {
    if (data.type === 'layerGroup') {
      return this.getChildList({data})
    } else {
      let newList = this.state.layerList
      if (newList[data.section + '-' + data.name]) {
        delete(newList[data.section + '-' + data.name])
      } else {
        newList[data.section + '-' + data.name] = data
      }
      this.setState({
        layerList: newList,
      })
    }
  }

  getChildList = async ({data}) => {
    try {
      if (data.type !== 'layerGroup') return
      let layer = data.layer
      this.container.setLoading(true)
      let layerGroup = layer
      let count = await layerGroup.getCount()
      let child = []
      for (let i = 0; i < count; i++) {
        let item = await layerGroup.getLayer(i)
        child.push(this._renderItem({item}))
      }
      this.container.setLoading(false)
      return child
    } catch (e) {
      this.container.setLoading(false)
      Toast.show('获取失败')
      return []
    }
  }

  addNewLayerGroup = async () => {
    try {
      if (this.groupName.trim() === '') {
        Toast.show('请输入图层组名称')
        return
      }
      if (Object.getOwnPropertyNames(this.state.layerList).length <= 0) {
        Toast.show('请输选择图层')
        return
      }
      this.container.setLoading(true, '创建中')
      let layers = []
      for(let key in this.state.layerList) {
        let item = this.state.layerList[key]
        layers.push(item.layer)
      }
      let layerGroup = await this.map.addLayerGroup(this.groupName, layers)
      this.container.setLoading(false)
      if (!layerGroup) {
        Toast.show('新建图层组失败')
      } else {
        Toast.show('新建图层组成功')
        this.cb && this.cb()
        this.props.navigation.goBack()
      }
    } catch (e) {
      this.container.setLoading(false)
      Toast.show('新建图层组失败')
    }
  }

  _renderInput = () => {
    return (
      <View style={styles.subContainer}>
        <Text style={styles.title}>图层组名称</Text>
        <TextInput
          accessible={true}
          accessibilityLabel={'图层组名称'}
          onChangeText={text => {
            this.groupName = text
          }}
          style={styles.input}
          placeholder={'请输入图层组名称'}
          underlineColorAndroid='transparent'
          placeholderTextColor={color.USUAL_SEPARATORCOLOR} />
      </View>
    )
  }

  _renderListHeader = () => {
    return (
      <View style={styles.subContainer}>
        <Text style={styles.title}>选择图层</Text>
      </View>
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator />
  }

  _keyExtractor = (item, index) => (item.name + index)

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: scaleSize(80 + 1) * index,
      index,
    }
  }

  _renderItem = ({ item }) => {
    // sectionID = sectionID || 0
    return (
      <LayerManager_item
        key={item.id}
        operable={false}
        swipeEnabled={false}
        hasSelected={true}
        // sectionID={sectionID}
        // rowID={item.index}
        ref={ref => {
          if (!this.itemRefs) {
            this.itemRefs = {}
          }
          this.itemRefs[item.name] = ref
          return this.itemRefs[item.name]
        }}
        layer={item.layer}
        map={this.map}
        data={item}
        mapControl={this.mapControl}
        onPress={this.select}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        headerProps={{
          title: '新建图层组',
          navigation: this.props.navigation,
          headerRight: <TextBtn btnText="添加" textStyle={styles.headerBtnTitle} btnClick={this.addNewLayerGroup} />,
        }}>
        {this._renderInput()}
        {this._renderListHeader()}
        <FlatList
          ref={ref => this.listView = ref}
          data={this.state.datasourceList}
          renderItem={this._renderItem}
          getItemLayout={this.getItemLayout}
        />
      </Container>
    )
  }
}