/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, Text, TextInput, SectionList } from 'react-native'
import { Toast } from '../../utils'
import { color } from '../../styles'
import { Container, ListSeparator, TextBtn, DataSetListSection, DataSetListItem } from '../../components'

import styles from './styles'

export default class AddLayerGroup extends React.Component {

  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.map = params.map
    this.state = {
      dataList: [],
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
      let list = []
      let dataSources = await this.workspace.getDatasources()
      let count = await dataSources.getCount()
      for (let i = 0; i < count; i++) {
        let dataSetList = []
        let dataSource = await dataSources.get(i)
        let name = await dataSource.getAlias()
        let dataSets = await dataSource.getDatasets()
        let dataSetCount = await dataSets.getCount()
        for (let j = 0; j < dataSetCount; j++) {
          let dataset = await dataSets.get(j)
          let dsName = await dataset.getName()
          let dsType = await dataset.getType()

          dataSetList.push({
            name: dsName,
            type: dsType,
            isAdd: false,
            section: i,
            dataset: dataset,
          })
        }

        list.push({
          key: name,
          isShow: true,
          data: dataSetList,
          index: i,
        })
      }
      this.setState({
        dataList: list,
      }, () => {
        this.container.setLoading(false)
      })
    } catch (e) {
      this.container.setLoading(false)
    }
  }

  showSection = (section, isShow?: boolean) => {
    let newData = this.state.dataList
    if (isShow === undefined) {
      section.isShow = !section.isShow
    } else {
      section.isShow = isShow
    }
    newData[section.index] = section
    this.setState({
      dataList: newData.concat(),
    })
  }

  select = data => {
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

  addNewLayerGroup = async () => {
    if (this.groupName.trim() === '') {
      Toast.show('请输入图层组名称')
      return
    }
    if (Object.getOwnPropertyNames(this.state.layerList).length <= 0) {
      Toast.show('请输选择图层')
      return
    }
    let datasets = []
    for(let key in this.state.layerList) {
      let item = this.state.layerList[key]
      datasets.push(item.dataset._SMDatasetId)
    }
    // let layerGroup = await this.map.addLayerGroup(datasets, this.groupName)
    // Toast.show('新建图层组成功')
    Toast.show('新建图层组-待完成')
    setTimeout(() => {
      this.props.navigation.goBack()
    }, 2000)
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

  _renderSetion = ({ section }) => {
    return (
      <DataSetListSection data={section} height={60} onPress={this.showSection} />
    )
  }

  _renderItem = ({ item }) => {
    return (
      <DataSetListItem hidden={!this.state.dataList[item.section].isShow} data={item} height={60} onPress={this.select} />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator />
  }

  _renderSectionSeparatorComponent = ({ section }) => {
    return section.isShow ? <ListSeparator /> : null
  }

  _keyExtractor = (item, index) => (item.name + index)

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
        <SectionList
          renderSectionHeader={this._renderSetion}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          sections={this.state.dataList}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          SectionSeparatorComponent={this._renderSectionSeparatorComponent}
        />
      </Container>
    )
  }
}