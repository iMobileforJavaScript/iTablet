import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Container, Input } from '../../../../components'
import { SMap, EngineType, DatasetType } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import { getLanguage } from '../../../../language'
import { scaleSize, Toast } from '../../../../utils'
import { color } from '../../../../styles'
const closeImg = require('../../../../assets/mapTools/icon_close_black.png')
const addImg = require('../../../../assets/mapTool/icon_plus.png')
const pointImg = require('../../../../assets/mapToolbar/dataset_type_point_black.png')
const lineImg = require('../../../../assets/mapToolbar/dataset_type_line_black.png')
const regionImg = require('../../../../assets/mapToolbar/dataset_type_region_black.png')
const textImg = require('../../../../assets/mapToolbar/dataset_type_text_black.png')
const CADImg = require('../../../../assets/mapToolbar/dataset_type_cad_black.png')

class NewDataset extends Component {
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
      datasets: [
        {
          datasetName: undefined,
          datasetType: undefined,
        },
      ],
    }
  }

  _addDataset = () => {
    let data = {
      datasetName: undefined,
      datasetType: undefined,
    }
    let datasets = Object.assign([], this.state.datasets)
    datasets.push(data)
    this.setState({ datasets })
  }

  _deleteDataset = index => {
    let datasets = this.state.datasets
    datasets.splice(index, 1)
    if (datasets.length === 0) {
      this.setState({ datasets: [] })
    } else {
      this.setState({ datasets })
    }
  }

  _clearDatasets = () => {
    let datasets = [
      {
        datasetName: undefined,
        datasetType: undefined,
      },
    ]
    this.setState({ datasets })
  }

  _createDatasets = async () => {
    if (this.state.datasets.length === 0) {
      Toast.show('请添加数据集')
    } else {
      let newDatasets = this.state.datasets
      for (let i = 0; i < newDatasets.length; i++) {
        if (!newDatasets[i].datasetName) {
          Toast.show('请填写数据集名称')
          return
        } else {
          //if(!name) {
          //   Toast.show('名称不符合规则')
          //   return
          // }
        }
        if (!newDatasets[i].datasetType) {
          Toast.show('请选择数据集类型')
          return
        }
      }
      let homePath = await FileTools.appendingHomeDirectory()
      let datasourceParams = {}
      datasourceParams.server = homePath + this.state.data.path
      datasourceParams.engineType = EngineType.UDB
      datasourceParams.alias = this.state.title
      await SMap.openDatasource(datasourceParams)
      for (let i = 0; i < newDatasets.length; i++) {
        await SMap.createDataset(
          this.state.title,
          newDatasets[i].datasetName,
          newDatasets[i].datasetType,
        )
      }
      SMap.closeDatasource(this.state.title)
      Toast.show('创建完成')
      this._clearDatasets()
    }
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemStyle}>
        {this._renderItemHead(index)}
        <View style={styles.longSeperator}></View>
        {this._renderItemBody(item)}
      </View>
    )
  }

  _renderItemHead = index => {
    return (
      <View style={styles.itemHeadStyle}>
        <Text style={styles.text}>{index + 1}</Text>
        <TouchableOpacity
          onPress={() => {
            this._deleteDataset(index)
          }}
        >
          <Image source={closeImg} style={styles.imgStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  _renderItemBody = item => {
    return (
      <View style={styles.itemBodyStyle}>
        <View style={styles.datasetNameStyle}>
          <Text style={styles.textStyle}>{'数据集名称'}</Text>
          <Input
            style={styles.textInputStyle}
            value={item.datasetName || ''}
            onChangeText={text => {
              item.datasetName = text
            }}
          />
        </View>
        <View style={styles.longSeperator}></View>
        <View>
          <Text style={styles.textStyle}>{'数据集类型'}</Text>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {this._renderDatasetType(item, DatasetType.POINT)}
            {this._renderDatasetType(item, DatasetType.LINE)}
            {this._renderDatasetType(item, DatasetType.REGION)}
            {this._renderDatasetType(item, DatasetType.TEXT)}
            {this._renderDatasetType(item, DatasetType.CAD)}
          </View>
        </View>
      </View>
    )
  }

  _renderDatasetType = (item, type) => {
    let text
    let img
    if (type === DatasetType.POINT) {
      text = '点'
      img = pointImg
    } else if (type === DatasetType.LINE) {
      text = '线'
      img = lineImg
    } else if (type === DatasetType.REGION) {
      text = '面'
      img = regionImg
    } else if (type === DatasetType.TEXT) {
      text = '文本'
      img = textImg
    } else if (type === DatasetType.CAD) {
      text = 'CAD'
      img = CADImg
    }
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.datasetTypeStyle,
            item.datasetType === type ? { backgroundColor: '#4680DF' } : {},
          ]}
          onPress={() => {
            item.datasetType = type
            let datasets = Object.assign([], this.state.datasets)
            this.setState({ datasets })
          }}
        >
          <Image source={img} style={styles.imgStyle} />
          <Text style={styles.textStyle}>{text}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderAddDataset = () => {
    return (
      <View>
        <TouchableOpacity onPress={this._addDataset}>
          <View style={styles.addStyle}>
            <Image style={styles.imgStyle} source={addImg} />
            <Text style={[styles.textStyle, { color: '#4680DF' }]}>
              {'添加数据集'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _renderScroll = () => {
    return (
      <ScrollView>
        <View style={styles.scrollViewStyle}>
          <FlatList
            data={this.state.datasets}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this._renderItem}
          />
          {this._renderAddDataset()}
        </View>
      </ScrollView>
    )
  }

  _renderBottom = () => {
    return (
      <View style={styles.bottomStyle}>
        <TouchableOpacity onPress={this._clearDatasets}>
          <Text style={[styles.textStyle, { padding: scaleSize(10) }]}>
            {'清空'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._createDatasets}>
          <Text style={[styles.textStyle, { padding: scaleSize(10) }]}>
            {'创建'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={{
          backgroundColor: color.contentColorWhite,
          alignItems: 'center',
        }}
        headerProps={{
          title: getLanguage(global.language).Profile.NEW_DATASET,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this._renderScroll()}
        {this._renderBottom()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    alignItems: 'center',
    marginBottom: scaleSize(80),
  },
  bottomStyle: {
    backgroundColor: color.contentColorWhite,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleSize(30),
    position: 'absolute',
    bottom: 0,
    height: scaleSize(80),
    width: '100%',
  },
  itemStyle: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: scaleSize(50),
    borderRadius: scaleSize(10),
  },
  itemHeadStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleSize(20),
  },
  itemBodyStyle: {
    marginHorizontal: scaleSize(20),
  },
  datasetNameStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datasetTypeStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.contentColorWhite,
    borderRadius: scaleSize(5),
    marginVertical: scaleSize(10),
  },
  addStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  longSeperator: {
    height: scaleSize(1),
    marginVertical: scaleSize(10),
    backgroundColor: color.contentColorWhite,
  },
  textStyle: {
    fontSize: scaleSize(24),
  },
  textInputStyle: {
    width: '70%',
    // height: scaleSize(80),
    fontSize: scaleSize(24),
    // borderBottomColor: color.borderLight,
    color: 'black',
    borderBottomWidth: 1,
    // marginTop: 10,
  },
  imgStyle: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
})

export default NewDataset
