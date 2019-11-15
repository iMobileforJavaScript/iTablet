import React, { Component } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import { Container } from '../../../../components'
import { SMap, EngineType, DatasetType } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import { Toast, scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import MyDataPopupModal from './MyDataPopupModal'
import { MineItem, BatchHeadBar } from '../component'
import { getThemeAssets } from '../../../../assets'
import styles from './styles'
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
      batchMode: false,
      selectedNum: 0,
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

  _getDatasets = async (showLoading = true) => {
    try {
      showLoading &&
        this.container.setLoading(
          true,
          getLanguage(global.language).Prompt.LOADING,
        )
      let datasets = []
      datasets = await SMap.getDatasetsByDatasource({ alias: this.state.title })
      this.setState({ datasets: datasets.list, selectedNum: 0 })
      setTimeout(() => {
        showLoading && this.container && this.container.setLoading(false)
      }, 1000)
    } catch (error) {
      setTimeout(() => {
        showLoading && this.container && this.container.setLoading(false)
        Toast.show(getLanguage(global.language).Profile.OPEN_DATASROUCE_FAILED)
      }, 1000)
    }
  }

  _deleteDataset = async () => {
    try {
      let datasetName = this.itemInfo.datasetName
      await SMap.deleteDataset(this.state.title, datasetName)
      this._getDatasets(false)
      Toast.show(getLanguage(global.language).Prompt.DELETED_SUCCESS)
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
    }
  }

  _batchDelete = async () => {
    try {
      let deleteArr = this._getSelectedList()
      if (deleteArr.length === 0) {
        Toast.show(getLanguage(global.language).Prompt.SELECT_AT_LEAST_ONE)
        return
      }
      for (let i = 0; i < deleteArr.length; i++) {
        await SMap.deleteDataset(this.state.title, deleteArr[i].datasetName)
      }
      this._getDatasets(false)
      Toast.show(getLanguage(global.language).Prompt.DELETED_SUCCESS)
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
    }
  }

  _renderDatasourcePopupModal = () => {
    let data
    data = [
      {
        title: getLanguage(global.language).Profile.BATCH_OPERATE,
        action: () => {
          this.setState({
            batchMode: !this.state.batchMode,
          })
        },
      },
    ]
    return (
      <MyDataPopupModal
        ref={ref => (this.DatasourcePopup = ref)}
        data={data}
        onCloseModal={() => {
          this.DatasourcePopup.setVisible(false)
        }}
      />
    )
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
      <MineItem
        item={item}
        image={img}
        text={item.datasetName}
        disableTouch={this.state.batchMode}
        showCheck={this.state.batchMode}
        onPress={() => {}}
        onPressMore={() => {
          this.itemInfo = item
          this.DatasetPopup.setVisible(true)
        }}
        onPressCheck={item => {
          let selectedNum = this.state.selectedNum
          if (item.checked) {
            this.setState({ selectedNum: ++selectedNum })
          } else {
            this.setState({ selectedNum: --selectedNum })
          }
        }}
      />
    )
  }

  _selectAll = () => {
    let datasets = this.state.datasets.clone()
    let i = 0
    for (i; i < datasets.length; i++) {
      datasets[i].checked = true
    }
    this.setState({ datasets, selectedNum: i })
  }

  _deselectAll = () => {
    let datasets = this.state.datasets.clone()
    for (let i = 0; i < datasets.length; i++) {
      datasets[i].checked = false
    }
    this.setState({ datasets, selectedNum: 0 })
  }

  _getSelectedList = () => {
    let list = []
    for (let i = 0; i < this.state.datasets.length; i++) {
      if (this.state.datasets[i].checked === true) {
        list.push(this.state.datasets[i])
      }
    }
    return list
  }

  _getTotalItemNumber = () => {
    return this.state.datasets.length
  }

  _renderHeaderRight = () => {
    if (this.state.batchMode) {
      return (
        <TouchableOpacity
          onPress={() => {
            this._deselectAll()
            this.setState({ batchMode: false })
          }}
          style={styles.moreView}
        >
          <Text style={styles.headerRightTextStyle}>
            {getLanguage(global.language).Prompt.COMPLETE}
          </Text>
        </TouchableOpacity>
      )
    }
    let moreImg = require('../../../../assets/home/Frenchgrey/icon_else_selected.png')
    return (
      <TouchableOpacity
        onPress={() => {
          this.DatasourcePopup.setVisible(true)
        }}
        style={styles.moreView}
      >
        <Image resizeMode={'contain'} source={moreImg} style={styles.moreImg} />
      </TouchableOpacity>
    )
  }

  _renderBatchHead = () => {
    return (
      <BatchHeadBar
        select={this.state.selectedNum}
        total={this._getTotalItemNumber()}
        selectAll={this._selectAll}
        deselectAll={this._deselectAll}
      />
    )
  }

  _renderBottom = () => {
    return (
      <View style={styles.bottomStyle}>
        <TouchableOpacity
          style={styles.bottomItemStyle}
          onPress={this._batchDelete}
        >
          <Image
            style={{
              height: scaleSize(50),
              width: scaleSize(50),
              marginRight: scaleSize(20),
            }}
            source={getThemeAssets().attribute.icon_delete}
          />
          <Text style={{ fontSize: scaleSize(20) }}>
            {getLanguage(global.language).Profile.BATCH_DELETE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        style={{
          backgroundColor: '#FBFBFB',
        }}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this._renderHeaderRight(),
        }}
      >
        {this.state.batchMode && this._renderBatchHead()}
        <FlatList
          data={this.state.datasets}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
          forUpdate={this.state.batchMode}
        />
        {this._renderDatasetPopupModal()}
        {this._renderDatasourcePopupModal()}
        {this.state.batchMode && this._renderBottom()}
      </Container>
    )
  }
}

export default DatasourcePage
