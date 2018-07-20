import * as React from 'react'
import { SectionList } from 'react-native'
import { Container, ListSeparator } from '../../components'
import { DataManagerTab, DataSetListSection, DataSetListItem } from './components'
import NavigationService from '../NavigationService'
import { Action } from 'imobile_for_javascript'

// import styles from './styles'

export default class MTDataManagement extends React.Component {
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
      dataSourceList: [],
      openList: {},
    }
  }

  componentDidMount() {
    this.getDatasets()
  }

  getDatasets = async () => {
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
      await this.mapControl.setAction(Action.PAN)
      this.setState({
        dataSourceList: list,
      }, () => {
        this.container.setLoading(false)
      })
    } catch (e) {

    }
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
      delete(newList[data.section + '-' + data.name])
    } else {
      newList[data.section + '-' + data.name] = data
    }
    this.setState({
      openList: newList,
    })
  }

  _dSource = () => {
    NavigationService.navigate('NewDSource', {ws: this.workspace, map: this.map})
  }

  _dSet = () => {
    NavigationService.navigate('NewDSet', {ws: this.workspace, map: this.map})
  }

  _renderSetion = ({ section }) => {
    return (
      <DataSetListSection data={section} height={60} onPress={this.showSection} />
    )
  }

  _renderItem = ({ item }) => {
    return (
      <DataSetListItem hidden={!this.state.dataSourceList[item.section].isShow} data={item} height={60} onPress={this.select} />
    )
  }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.isShow ? <ListSeparator /> : null
  }

  // _renderSectionSeparatorComponent = ({ section }) => {
  //   return section.isShow ? <ListSeparator height={scaleSize(20)} /> : null
  // }

  _keyExtractor = item => (item.key + item.index)

  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        initWithLoading
        headerProps={{
          title: '数据管理',
          navigation: this.props.navigation,
        }}>
        <DataManagerTab dSource={this._dSource} dSet={this._dSet}/>
        <SectionList
          renderSectionHeader={this._renderSetion}
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