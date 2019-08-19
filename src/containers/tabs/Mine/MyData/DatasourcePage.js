import React, { Component } from 'react'
import { ScrollView, FlatList, Image, TouchableOpacity } from 'react-native'
import { Container } from '../../../../components'
import { SMap, EngineType, DatasetType } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import TouchableItemView from '../../Friend/TouchableItemView'
import { Toast, scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import MyDataPopupModal from './MyDataPopupModal'
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
  }

  componentDidMount() {
    this._openDatasource().then(this._getDatasets)
  }

  componentWillUnmount() {
    SMap.closeDatasource(this.state.title)
    this.container && this.container.setLoading(false)
  }

  _openDatasource = async () => {
    try {
      let homePath = await FileTools.appendingHomeDirectory()
      let datasourceParams = {}
      datasourceParams.server = homePath + this.state.data.path
      datasourceParams.engineType = EngineType.UDB
      datasourceParams.alias = this.state.title
      await SMap.openDatasource2(datasourceParams)
    } catch (error) {
      Toast.show(getLanguage(global.language).Profile.OPEN_DATASROUCE_FAILED)
    }
  }

  _getDatasets = async () => {
    try {
      this.container.setLoading(
        true,
        getLanguage(global.language).Prompt.LOADING,
      )
      let datasets = []
      datasets = await SMap.getDatasetsByDatasource({ alias: this.state.title })
      this.setState({ datasets: datasets.list })
      setTimeout(() => {
        this.container && this.container.setLoading(false)
      }, 1000)
    } catch (error) {
      setTimeout(() => {
        this.container && this.container.setLoading(false)
        Toast.show(getLanguage(global.language).Profile.OPEN_DATASROUCE_FAILED)
      }, 1000)
    }
  }

  _deleteDataset = async () => {
    try {
      let datasetName = this.itemInfo.datasetName
      await SMap.deleteDataset(this.state.title, datasetName)
      this._getDatasets()
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
    }
  }

  _renderDatasetPopupModal = () => {
    let data
    data = [
      {
        title: getLanguage(global.language).Profile.DELETE_DATASET,
        action: () => {
          this._deleteDataset()
        },
      },
    ]
    return (
      <MyDataPopupModal
        ref={ref => (this.DatasetPopup = ref)}
        data={data}
        onCloseModal={() => {
          this.DatasetPopup.setVisible(false)
        }}
      />
    )
  }

  _renderRight = ({ param }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.itemInfo = param
          this.DatasetPopup.setVisible(true)
        }}
      >
        <Image
          style={{
            flex: 1,
            height: scaleSize(40),
            width: scaleSize(40),
            marginRight: scaleSize(20),
          }}
          source={require('../../../../assets/Mine/icon_more_gray.png')}
        />
      </TouchableOpacity>
    )
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
        renderRight={this._renderRight}
        param={item}
        item={{
          image: img,
          text: item.datasetName,
        }}
        onPress={() => {
          // this.itemInfo = item
          // this.DatasetPopup.setVisible(true)
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
        {this._renderDatasetPopupModal()}
      </Container>
    )
  }
}

export default DatasourcePage
