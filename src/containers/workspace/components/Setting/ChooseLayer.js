/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { View, Text, SectionList, FlatList } from 'react-native'
import {
  ListSeparator,
  DataSetListItem,
  DataSetListSection,
  LayerItem,
  EmptyView,
} from '../../../../components'
import PropTypes from 'prop-types'
import { DatasetType } from 'imobile_for_reactnative'
import styles from './styles'

export default class ChooseLayer extends React.Component {
  static propTypes = {
    workspace: PropTypes.object,
    mapControl: PropTypes.object,
    map: PropTypes.object,
    type: PropTypes.number,
    listType: PropTypes.string,
    getDataset: PropTypes.func,
    setLoading: PropTypes.func,
    alwaysVisible: PropTypes.bool,
    headerTitle: PropTypes.string,
  }

  static defaultProps = {
    alwaysVisible: false,
    typeFilter: [],
    listType: 'dataset',
  }

  constructor(props) {
    super(props)
    this.state = {
      isShow: props.alwaysVisible || false,
      showList: false,
      type: props.type,
      headerTitle: props.headerTitle || '',
      datasourceList: [],
    }
  }

  componentDidMount() {
    this.getData()
  }

  isVisible = () => {
    return this.state.isShow
  }

  show = type => {
    let headerTitle = ''
    switch (type) {
      case DatasetType.POINT:
        headerTitle = '点图层选择'
        break
      case DatasetType.LINE:
        headerTitle = '线图层选择'
        break
      case DatasetType.REGION:
        headerTitle = '面图层选择'
        break
      default:
        headerTitle = '图层选择'
        break
    }
    this.setState(
      {
        isShow: true,
        showList: false,
        headerTitle: headerTitle,
      },
      () => {
        this.getData(type)
        // this.getDatasets(type)
      },
    )
  }

  close = () => {
    this.setState({
      showList: false,
      isShow: false,
    })
  }

  setLoading = (loading = false) => {
    this.props.setLoading && this.props.setLoading(loading)
  }

  getData = type => {
    if (this.props.listType === 'layer') {
      this.getLayers(type)
    } else {
      this.getDatasets(type)
    }
  }

  getDatasets = type => {
    if (!this.state.isShow) return
    this.setLoading(true)
    let t = type || this.state.type
    ;(async function() {
      try {
        let list = []
        let count = await this.props.workspace.getDatasourcesCount()
        for (let i = 0; i < count; i++) {
          let dataSetList = []
          // let dataSource = await dataSources.get(i)
          let dataSource = await this.props.workspace.getDatasource(i)
          let name = await dataSource.getAlias()
          let count = await dataSource.getDatasetCount()
          for (let j = 0; j < count; j++) {
            let dataset = await dataSource.getDataset(j)
            let dsType = await dataset.getType()
            if (t && dsType !== t) continue // 过滤数据集类型
            let dsName = await dataset.getName()
            // TODO layerName需要处理
            dataSetList.push({
              name: dsName,
              layerName: dsName + '@' + name,
              type: dsType,
              // isAdd: isAdd,
              dataset: dataset,
              section: i,
              key: i + '-' + dsName,
            })
          }

          dataSetList.length > 0 &&
            list.push({
              key: name,
              isShow: true,
              data: dataSetList,
              index: i,
            })
        }
        this.setState(
          {
            datasourceList: list,
            showList: true,
            type: t,
          },
          () => {
            this.setLoading(false)
          },
        )
      } catch (e) {
        this.setLoading(false)
      }
    }.bind(this)())
  }

  getLayers = type => {
    if (!this.props.map || !this.state.isShow) {
      return
    }
    this.setLoading(true)
    ;(async function() {
      this.itemRefs = []
      // this.map = await this.mapControl.getMap()
      let layerNameArr = await this.props.map.getLayersByType(type)
      for (let i = 0; i < layerNameArr.length; i++) {
        layerNameArr[i].key = layerNameArr[i].name
      }
      this.setState(
        {
          datasourceList: layerNameArr.concat(),
          showList: true,
          type: type,
        },
        () => {
          this.setLoading(false)
        },
      )
    }.bind(this)())
  }

  showSection = (section, isShow?: boolean) => {
    let newData = this.state.datasourceList
    if (isShow === undefined) {
      section.isShow = !section.isShow
    } else {
      section.isShow = isShow
    }
    newData[section.index] = section
    this.setState({
      datasourceList: newData.concat(),
    })
  }

  select = data => {
    this.props.getDataset && this.props.getDataset(data)
    !this.props.alwaysVisible && this.close()
  }

  _renderLayerItem = ({ item }) => {
    return (
      <LayerItem
        key={item.key}
        data={item}
        map={this.map}
        onPress={this.select}
      />
    )
  }

  _renderSeparator = ({ leadingItem }) => {
    return <ListSeparator key={'separator_' + leadingItem.id} />
  }

  _datasetKeyExtractor = (item, index) => index + '-' + item.name

  _renderDatasetSetion = ({ section }) => {
    return (
      <DataSetListSection
        data={section}
        height={60}
        onPress={this.showSection}
      />
    )
  }

  _renderDatasetItem = ({ item }) => {
    return (
      <DataSetListItem
        hidden={!this.state.datasourceList[item.section].isShow}
        data={item}
        height={60}
        onPress={this.select}
      />
    )
  }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.isShow ? <ListSeparator /> : null
  }

  _layerKeyExtractor = item => item.key + item.index

  renderLayerList = () => {
    let list = <View />
    if (this.state.showList) {
      list =
        this.state.datasourceList.length > 0 ? (
          <FlatList
            data={this.state.datasourceList}
            renderItem={this._renderLayerItem}
            keyExtractor={this._layerKeyExtractor}
          />
        ) : (
          <EmptyView />
        )
    }
    return list
  }

  renderDatasetList = () => {
    let list = <View />
    if (this.state.showList && this.state.datasourceList.length > 0) {
      list =
        this.state.datasourceList.length > 0 ? (
          <SectionList
            renderSectionHeader={this._renderDatasetSetion}
            renderItem={this._renderDatasetItem}
            keyExtractor={this._datasetKeyExtractor}
            sections={this.state.datasourceList}
            ItemSeparatorComponent={this._renderItemSeparatorComponent}
            // SectionSeparatorComponent={this._renderSectionSeparatorComponent}
          />
        ) : (
          <EmptyView />
        )
    }
    return list
  }

  render() {
    if (!this.state.isShow) return null
    return (
      <View style={styles.chooseLayerContainer}>
        {this.state.headerTitle ? (
          <View style={styles.titleView}>
            <Text style={styles.title}>{this.state.headerTitle}</Text>
          </View>
        ) : null}
        {this.props.listType === 'layer'
          ? this.renderLayerList()
          : this.renderDatasetList()}
      </View>
    )
  }
}
