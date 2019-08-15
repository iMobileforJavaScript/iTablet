import React, { Component } from 'react'
import { ScrollView, FlatList } from 'react-native'
import { Container } from '../../../../components'
import { SMap, EngineType, DatasetType } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import TouchableItemView from '../../Friend/TouchableItemView'
const pointImg = require('../../../../assets/mapToolbar/dataset_type_point_black.png')
const lineImg = require('../../../../assets/mapToolbar/dataset_type_line_black.png')
const regionImg = require('../../../../assets/mapToolbar/dataset_type_region_black.png')
const textImg = require('../../../../assets/mapToolbar/dataset_type_text_black.png')
const CADImg = require('../../../../assets/mapToolbar/dataset_type_cad_black.png')

class DatasourcePage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      title:
        params.data.name &&
        params.data.name.substr(0, params.data.name.lastIndexOf('.')),
      data: params.data,
      datasets: null,
    }
    this._getDatasets()
  }

  componentWillUnmount() {
    SMap.closeDatasource(this.state.title)
  }

  _getDatasets = async () => {
    let homePath = await FileTools.appendingHomeDirectory()
    let datasourceParams = {}
    datasourceParams.server = homePath + this.state.data.path
    datasourceParams.engineType = EngineType.UDB
    datasourceParams.alias = this.state.title
    await SMap.openDatasource(datasourceParams)
    let datasets = []
    datasets = await SMap.getDatasetsByDatasource({ alias: this.state.title })
    this.setState({ datasets: datasets.list })
  }

  _renderItem = ({ item }) => {
    let type = item.datasetType
    let img = undefined
    if (type === DatasetType.POINT) {
      img = pointImg
    } else if (type === DatasetType.LINE) {
      img = lineImg
    } else if (type === DatasetType.REGION) {
      img = regionImg
    } else if (type === DatasetType.TEXT) {
      img = textImg
    } else if (type === DatasetType.CAD) {
      img = CADImg
    }
    return (
      <TouchableItemView
        item={{
          image: img,
          text: item.datasetName,
        }}
        onPress={() => {
          //
        }}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <ScrollView>
          <FlatList
            data={this.state.datasets}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this._renderItem}
          />
        </ScrollView>
      </Container>
    )
  }
}

export default DatasourcePage
