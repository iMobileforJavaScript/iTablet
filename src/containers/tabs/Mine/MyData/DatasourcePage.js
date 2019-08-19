import React, { Component } from 'react'
import {
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Container, CheckBox } from '../../../../components'
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
      batchDelete: false,
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
      this.setState({ datasets: datasets.list })
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
      if (this.deleteArr.length === 0) {
        Toast.show(getLanguage(global.language).Prompt.SELECT_AT_LEAST_ONE)
        return
      }
      this.setState({ batchDelete: false })
      for (let i = 0; i < this.deleteArr.length; i++) {
        await SMap.deleteDataset(
          this.state.title,
          this.deleteArr[i].datasetName,
        )
      }
      this._getDatasets(false)
      Toast.show(getLanguage(global.language).Prompt.DELETED_SUCCESS)
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
    }
  }

  _onItemCheck = (item, checked) => {
    if (checked) {
      this.deleteArr.push(item)
    } else {
      for (let i = 0; i < this.deleteArr.length; i++) {
        if (this.deleteArr[i].datasetName === item.datasetName) {
          this.deleteArr.splice(i, 1)
          break
        }
      }
    }
  }

  _renderDatasourcePopupModal = () => {
    let data
    data = [
      {
        title: getLanguage(global.language).Profile.BATCH_DELETE,
        action: () => {
          this.deleteArr = []
          this.setState({
            batchDelete: !this.state.batchDelete,
            datasets: Object.assign([], this.state.datasets),
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

  _renderRightSelect = ({ param }) => {
    return (
      <CheckBox
        style={{
          height: scaleSize(30),
          width: scaleSize(30),
          marginRight: scaleSize(30),
        }}
        onChange={checked => {
          this._onItemCheck(param, checked)
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
      <TouchableItemView
        renderRight={
          this.state.batchDelete ? this._renderRightSelect : this._renderRight
        }
        param={item}
        item={{
          image: img,
          text: item.datasetName,
        }}
        onPress={() => {
          // this.itemInfo = item
          // this.DatasetPopup.setVisible(true)
        }}
        seperatorStyle={{ marginLeft: 0 }}
      />
    )
  }

  _renderHeaderRight = () => {
    let moreImg = require('../../../../assets/home/Frenchgrey/icon_else_selected.png')
    if (this.state.batchDelete) {
      return null
    }
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

  _renderBottom = () => {
    return (
      <View style={styles.bottomStyle}>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              batchDelete: !this.state.batchDelete,
              datasets: Object.assign([], this.state.datasets),
            })
          }}
        >
          <Image
            style={{ height: scaleSize(40), width: scaleSize(40) }}
            source={require('../../../../assets/mapTools/icon_cancel_1.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this._batchDelete}>
          <Image
            style={{ height: scaleSize(40), width: scaleSize(40) }}
            source={require('../../../../assets/mapTools/icon_submit_black.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        style={{
          backgroundColor: '#F0F0F0',
        }}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this._renderHeaderRight(),
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
        {this._renderDatasourcePopupModal()}
        {this.state.batchDelete && this._renderBottom()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  bottomStyle: {
    height: scaleSize(80),
    paddingHorizontal: scaleSize(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#A0A0A0',
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  moreView: {
    height: '100%',
    marginRight: 10,
    // width: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImg: {
    flex: 1,
    height: scaleSize(40),
    width: scaleSize(40),
  },
})

export default DatasourcePage
