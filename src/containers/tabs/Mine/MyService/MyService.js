import React, { Component } from 'react'
import { View, FlatList, Text } from 'react-native'
import Container from '../../../../components/Container'
import RenderServiceItem from './RenderServiceItem'
/**
 * 变量命名规则：私有为_XXX, 若变量为一个对象，则命名为 objXXX,若为一个数组，则命名为 arrXXX,...
 * */
let _strServiceList
let _strDataList
let _objOnlineService
let _objServiceNameAndFileName
let _objMapTitleAndRestTitle
let _arrMaps = []
let _arrPublishMaps = []
export default class MyService extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    if (_strDataList !== undefined && _strServiceList !== undefined) {
      this.state = {
        mapArr: _arrMaps,
      }
    } else {
      this.state = {
        mapArr: [],
      }
    }
    _objOnlineService = this.props.navigation.getParam('objOnlineService', {})
    this.loadOnlineDataAndService(1, 20)
  }

  loadOnlineDataAndService = async (currentPage, pageSize) => {
    if (_strDataList !== undefined && _strServiceList !== undefined) {
      return
    }
    _strDataList = await _objOnlineService.getDataList(currentPage, pageSize)
    _strServiceList = await _objOnlineService.getServiceList(
      currentPage,
      pageSize,
    )
    // 构建{serviceName:fileName}字符串,可通过服务名找到对应的数据名称
    let dataContent = JSON.parse(_strDataList).content
    let serviceNameAndFileName = '{'
    for (let i = 0; i < dataContent.length; i++) {
      let fileName = dataContent[i].fileName
      let dataItemServices = dataContent[i].dataItemServices
      for (let j = 0; j < dataItemServices.length; j++) {
        let serviceName = dataItemServices[j].serviceName
        if (i + 1 === dataContent.length && j + 1 === dataItemServices.length) {
          serviceNameAndFileName =
            serviceNameAndFileName + '"' + serviceName + '":"' + fileName + '"'
        } else {
          serviceNameAndFileName =
            serviceNameAndFileName + '"' + serviceName + '":"' + fileName + '",'
        }
      }
      if (i + 1 === dataContent.length && dataItemServices.length <= 0) {
        serviceNameAndFileName =
          serviceNameAndFileName +
          '"' +
          'dataItemServicesLength' +
          '":"' +
          'undefined' +
          '"'
      }
    }
    serviceNameAndFileName = serviceNameAndFileName + '}'
    _objServiceNameAndFileName = JSON.parse(serviceNameAndFileName)
    let arrPublishMaps = []
    // 1.存入地图数据
    // 2.构建{mapTile:restTile}字符串，可通过地图名称找到对应的服务名称
    let mapTileAndRestTitle = '{'
    let serviceContent = JSON.parse(_strServiceList).content
    for (let i = 0; i < serviceContent.length; i++) {
      let restTile = serviceContent[i].resTitle
      arrPublishMaps.push(restTile)
      let mapInfos = serviceContent[i].mapInfos
      for (let j = 0; j < mapInfos.length; j++) {
        let mapInfo = mapInfos[j]
        _arrMaps.push(mapInfo)

        let mapTitle = mapInfos[j].mapTitle
        if (i + 1 === serviceContent.length && j + 1 === mapInfos.length) {
          mapTileAndRestTitle =
            mapTileAndRestTitle + '"' + mapTitle + '":"' + restTile + '"'
        } else {
          mapTileAndRestTitle =
            mapTileAndRestTitle + '"' + mapTitle + '":"' + restTile + '",'
        }
      }
      if (i + 1 === serviceContent.length && mapInfos.length <= 0) {
        mapTileAndRestTitle =
          mapTileAndRestTitle +
          '"' +
          'mapInfoLength' +
          '":"' +
          'undefined' +
          '"'
      }
    }
    mapTileAndRestTitle = mapTileAndRestTitle + '}'
    _objMapTitleAndRestTitle = JSON.parse(mapTileAndRestTitle)

    this.setState({ mapArr: _arrMaps })
    // this._publishMaps(arrPublishMaps);
  }

  _publishMaps = async arrPublishMaps => {
    for (let i = 0; i < arrPublishMaps.length; i++) {
      let restTitle = arrPublishMaps[i]
      let result = await _objOnlineService.changeServiceVisibility(
        restTitle,
        true,
      )
      if (typeof result === 'boolean' && result === true) {
        _arrPublishMaps.push(restTitle)
      }
    }
  }

  render() {
    if (_strDataList === undefined || _strServiceList === undefined) {
      return (
        <Container
          headerProps={{
            title: '我的服务',
            withoutBack: false,
            navigation: this.props.navigation,
          }}
        >
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ lineHeight: 40, fontSize: 16 }}>数据加载中...</Text>
          </View>
        </Container>
      )
    } else {
      return (
        <Container
          headerProps={{
            title: '我的服务',
            withoutBack: false,
            navigation: this.props.navigation,
          }}
        >
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.mapArr}
              renderItem={({ item }) => (
                <RenderServiceItem
                  mapName={item.mapTitle}
                  imageUrl={item.mapThumbnail}
                  sharedMapUrl={item.mapUrl}
                  objOnlineService={_objOnlineService}
                  serviceNameAndFileName={_objServiceNameAndFileName}
                  mapTileAndRestTitle={_objMapTitleAndRestTitle}
                  isDownloading={false}
                />
              )}
            />
          </View>
        </Container>
      )
    }
  }
}
