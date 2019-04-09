/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { SectionList } from 'react-native'
import { Toast } from '../../utils'
import { DatasetType } from 'imobile_for_reactnative'
import {
  Container,
  ListSeparator,
  TextBtn,
  DataSetListSection,
  DataSetListItem,
} from '../../components'

import styles from './styles'

export default class AddDataset extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.map = params.map
    this.layerList = params.layerList || []
    this.cb = params.cb
    this.state = {
      dataSourceList: [],
      openList: {},
    }
  }

  componentDidMount() {
    this.getDatasets()
  }

  checkContainsDataset = async dsName => {
    return new Promise(async (resolve, reject) => {
      try {
        let isExist = false
        for (let i = 0; i < this.layerList.length; i++) {
          let ds = await this.layerList[i].layer.getDataset()
          if (!ds) continue
          let name = await ds.getName()
          if (name === dsName) {
            isExist = true
            break
          }
          if ((await ds.getType()) === DatasetType.Network) {
            let dv = await ds.toDatasetVector()
            let subDataset = await dv.getChildDataset()
            if (subDataset && (await subDataset.getName()) === dsName) {
              isExist = true
              break
            }
          }
        }
        resolve(isExist)
      } catch (e) {
        reject(e)
      }
    })
  }

  getDatasets = async () => {
    let list = []
    let count = await this.workspace.getDatasourcesCount()
    for (let i = 0; i < count; i++) {
      let dataSetList = []
      let dataSource = await this.workspace.getDatasource(i)
      let name = await dataSource.getAlias()
      let count = await dataSource.getDatasetCount()
      for (let j = 0; j < count; j++) {
        let dataset = await dataSource.getDataset(j)
        let dsType = await dataset.getType()
        if (dsType === DatasetType.TABULAR) continue
        let dsName = await dataset.getName()
        // let isAdd = await this.map.containsCaption(dsName, name)
        let isAdd = await this.checkContainsDataset(dsName)
        // let isAdd = false

        dataSetList.push({
          name: dsName,
          type: dsType,
          isAdd: isAdd,
          dataset: dataset,
          section: i,
          key: i + '-' + dsName,
        })

        if (dsType === DatasetType.Network) {
          let dv = await dataset.toDatasetVector()
          let subDataset = await dv.getChildDataset()
          let subDatasetName = await subDataset.getName()
          let subDatasetType = await subDataset.getType()
          let subDatasetIsAdd = await this.checkContainsDataset(subDatasetName)
          if (subDataset) {
            dataSetList.push({
              name: subDatasetName,
              type: subDatasetType,
              isAdd: subDatasetIsAdd,
              dataset: subDataset,
              section: i,
              key: 'sub-' + i + '-' + subDatasetName,
            })
          }
        }
      }

      list.push({
        key: name,
        isShow: true,
        data: dataSetList,
        index: i,
      })
    }
    this.setState(
      {
        dataSourceList: list,
      },
      () => {
        this.container.setLoading(false)
      },
    )
  }

  showSection = (section, isShow?: boolean) => {
    let newData = this.state.dataSourceList
    if (isShow === undefined) {
      section.isShow = !section.isShow
    } else {
      section.isShow = isShow
    }
    newData[section.index] = section
    this.setState({
      dataSourceList: newData.concat(),
    })
  }

  select = data => {
    let newList = this.state.openList
    if (newList[data.section + '-' + data.name]) {
      delete newList[data.section + '-' + data.name]
    } else {
      newList[data.section + '-' + data.name] = data
    }
    this.setState({
      openList: newList,
    })
  }

  /**
   * 添加数据集
   * @returns {Promise.<void>}
   */
  addDatasets = async () => {
    if (Object.getOwnPropertyNames(this.state.openList).length <= 0) return
    let showEntireMap = false
    for (let key in this.state.openList) {
      let item = this.state.openList[key]
      await this.map.addLayer(item.dataset, true)
      if (item.type === DatasetType.IMAGE || item.type === DatasetType.GRID) {
        showEntireMap = true
      }
    }
    Toast.show('添加图层成功')
    this.map && (await this.map.refresh())
    showEntireMap && this.map && (await this.map.viewEntire())
    this.props.navigation.goBack()
    this.cb && this.cb()
  }

  _renderSection = ({ section }) => {
    return (
      <DataSetListSection
        data={section}
        height={60}
        onPress={this.showSection}
      />
    )
  }

  _renderItem = ({ item }) => {
    return (
      <DataSetListItem
        subTitle={'已添加'}
        radio={true}
        hidden={!this.state.dataSourceList[item.section].isShow}
        data={item}
        height={60}
        onPress={this.select}
      />
    )
  }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.isShow ? <ListSeparator /> : null
  }

  // _renderSectionSeparatorComponent = ({ section }) => {
  //   return section.isShow ? <ListSeparator height={scaleSize(20)} /> : null
  // }

  _keyExtractor = item => item.key + item.index

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        initWithLoading
        headerProps={{
          title: '添加图层',
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText="添加"
              textStyle={styles.headerBtnTitle}
              btnClick={this.addDatasets}
            />
          ),
        }}
      >
        <SectionList
          renderSectionHeader={this._renderSection}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          sections={this.state.dataSourceList}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          // SectionSeparatorComponent={this._renderSectionSeparatorComponent}
        />
      </Container>
    )
  }
}
