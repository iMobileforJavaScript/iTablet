/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { View, Text, FlatList, SectionList } from 'react-native'
import { ListSeparator, EmptyView } from '../../../../components'
import { DataSetListItem, DataSetListSection } from '../../componets'
import PropTypes from 'prop-types'
import { DatasetType } from 'imobile_for_javascript'
import styles from './styles'

export default class ChooseLayer extends React.Component {

  static propTypes = {
    workspace: PropTypes.object,
    mapControl: PropTypes.object,
    map: PropTypes.object,
    type: PropTypes.number,
    // getLayer: PropTypes.func,
    getDataset: PropTypes.func,
    setLoading: PropTypes.func,
    alwaysVisible: PropTypes.boolean,
  }

  static defaultProps = {
    // type: DatasetType.REGION,
    alwaysVisible: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      // datasourceList: '',
      isShow: props.alwaysVisible || false,
      showList: false,
      type: props.type,
      headerTitile: '',
      datasourceList: [],
    }
  }

  componentDidMount() {
    // this.getData()
    this.getDatasets()
  }

  // getData = type => {
  //   let t = type || this.state.type
  //   ;(async function () {
  //     let layerNameArr = await this.props.map.getLayersByType(t)
  //     for(let i = 0; i < layerNameArr.length; i++) {
  //       let layer = await this.props.map.getLayer(layerNameArr[i].index)
  //       layerNameArr[i].layer = layer
  //     }
  //     this.setState({
  //       datasourceList: layerNameArr,
  //       showList: true,
  //       type: t,
  //     })
  //   }).bind(this)()
  // }

  isVisible = () => {
    return this.state.isShow
  }

  show = type => {
    let headerTitile = ''
    switch (type) {
      case DatasetType.POINT:
        headerTitile = '点图层选择'
        break
      case DatasetType.LINE:
        headerTitile = '线图层选择'
        break
      case DatasetType.REGION:
        headerTitile = '面图层选择'
        break
      default:
        headerTitile = '图层选择'
        break
    }
    this.setState({
      isShow: true,
      showList: false,
      headerTitile: headerTitile,
    }, () => {
      // this.getData(type)
      this.getDatasets(type)
    })
  }

  close = () => {
    this.setState({
      showList: false,
      isShow: false,
    })
  }

  // _chooseLayer = item =>{
  //   (async function (){
  //     // let layer = await this.props.map.getLayer(item.index)
  //     this.props.getLayer && this.props.getLayer(item)
  //     this.close()
  //   }).bind(this)()
  // }

  setLoading = (loading = false) => {
    this.props.setLoading && this.props.setLoading(loading)
  }

  getDatasets = type => {
    if (!this.state.isShow) return
    this.setLoading(true)
    let t = type || this.state.type
    ;(async function (){
      try {
        let list = []
        let dataSources = await this.props.workspace.getDatasources()
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
            if (t && dsType !== t) continue
            // let isAdd = await this.props.map.containsCaption(dsName, name)
            // let isAdd = await this.map.contains(dsName + "@" + name)
            // let isAdd = false

            dataSetList.push({
              name: dsName,
              layerName: dsName + "@" + name,
              type: dsType,
              // isAdd: isAdd,
              dataset: dataset,
              section: i,
              key: i + '-' + dsName,
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
          datasourceList: list,
          showList: true,
          type: t,
        }, () => {
          this.setLoading(false)
        })
      } catch (e) {
        this.setLoading(false)
      }
    }).bind(this)()
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

  // _renderItem =  ({item}) => {
  //   let key = item.id
  //   return (
  //     <LayerItem key={key} data={item} map={this.props.map} onPress={this._chooseLayer}/>
  //   )
  // }
  //
  // _renderSeparator = ({leadingItem}) => {
  //   return (
  //     <ListSeparator key={'separator_' + leadingItem.id}/>
  //   )
  // }
  //
  // _keyExtractor = (item, index) => (index + '-' + item.name)

  _renderSetion = ({ section }) => {
    return (
      <DataSetListSection data={section} height={60} onPress={this.showSection} />
    )
  }

  _renderItem = ({ item }) => {
    return (
      <DataSetListItem hidden={!this.state.datasourceList[item.section].isShow} data={item} height={60} onPress={this.select} />
    )
  }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.isShow ? <ListSeparator /> : null
  }

  _keyExtractor = item => (item.key + item.index)

  render() {
    if (!this.state.isShow) return null
    return (
      <View style={styles.chooseLayerContainer}>
        {
          this.state.headerTitile ?
            <View style={styles.titleView}>
              <Text style={styles.title}>{this.state.headerTitile}</Text>
            </View> : null
        }
        {/*{*/}
        {/*this.state.showList && (*/}
        {/*this.state.datasourceList.length > 0*/}
        {/*? <FlatList*/}
        {/*keyExtractor={this._keyExtractor}*/}
        {/*data={this.state.datasourceList}*/}
        {/*renderItem={this._renderItem}*/}
        {/*ItemSeparatorComponent={this._renderSeparator}*/}
        {/*/>*/}
        {/*: <EmptyView />*/}
        {/*)*/}
        {/*}*/}
        {
          this.state.showList && this.state.datasourceList.length > 0 &&
          <SectionList
            renderSectionHeader={this._renderSetion}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            sections={this.state.datasourceList}
            ItemSeparatorComponent={this._renderItemSeparatorComponent}
            // SectionSeparatorComponent={this._renderSectionSeparatorComponent}
          />
        }
      </View>
    )
  }
}