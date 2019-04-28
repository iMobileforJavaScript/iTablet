import React, { Component } from 'react'
import {
  Image,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native'
import { Container } from '../../../../../components'
import styles, { textHeight } from './Styles'
import NavigationService from '../../../../NavigationService'
import { FetchUtils, scaleSize } from '../../../../../utils'
import Toast from '../../../../../utils/Toast'
import color from '../../../../../styles/color'
import { getLanguage } from '../../../../../language'
export default class MyOnlineMap extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.state = {
      scenes: this.props.navigation.getParam('scenes', []),
      mapInfos: this.props.navigation.getParam('mapInfos', []),
      progressWidth: this.screenWidth * 0.6,
      isLoadingProgressView: true,
    }
  }
  componentDidMount() {
    this._loadOnlineData()
  }
  componentWillUnmount() {
    this._clearInterval()
  }
  _showInfo = info => {
    Toast.show(info, {
      duration: 3500,
      position: 100,
      shadow: true,
      animation: true,
      delay: 0,
    })
  }
  _clearInterval = () => {
    if (this.objProgressWidth !== undefined) {
      clearInterval(this.objProgressWidth)
      this.setState({ progressWidth: this.screenWidth })
    }
  }
  _showLoadProgressView = () => {
    this.objProgressWidth = setInterval(() => {
      let prevProgressWidth = this.state.progressWidth
      let currentPorWidth
      if (prevProgressWidth >= this.screenWidth - 200) {
        currentPorWidth = prevProgressWidth + 1
        if (currentPorWidth >= this.screenWidth - 50) {
          currentPorWidth = this.screenWidth - 50
          return
        }
      } else {
        currentPorWidth = prevProgressWidth * 1.01
      }
      this.setState({ progressWidth: currentPorWidth })
    }, 100)
  }
  _loadOnlineData = async () => {
    try {
      let uri = this.props.navigation.getParam('uri', 'null')
      if (uri === undefined || uri === null || uri === 'null') {
        this.setState({ isLoadingProgressView: false })
        return
      }
      this._showLoadProgressView()
      let objDataJson = await FetchUtils.getObjJson(uri)
      let arrDataItemServices = objDataJson.dataItemServices
      if (arrDataItemServices === undefined) {
        this._showInfo('资源不存在或无权访问')
      } else {
        let length = arrDataItemServices.length
        let restUrl
        for (let i = 0; i < length; i++) {
          let dataItemServices = arrDataItemServices[i]
          if (dataItemServices.serviceType === 'RESTMAP') {
            restUrl = dataItemServices.address
            break
          }
        }
        if (restUrl === undefined || restUrl === '') {
          this._showInfo('数据没有发布服务')
        } else {
          let subUrl = restUrl.substring(5, restUrl.length)
          restUrl = 'http' + subUrl + '/maps.json'
          let arrMapJson = await FetchUtils.getObjJson(restUrl)
          if (arrMapJson.errorMsg !== undefined) {
            this._showInfo('数据没有公开已有服务，无权限浏览')
          } else {
            let arrMapInfos = []
            for (let j = 0; j < arrMapJson.length; j++) {
              let objMapJson = arrMapJson[j]
              let mapTitle = objMapJson.name
              let mapUrl = objMapJson.path
              let mapThumbnail = mapUrl + '/entireImage.png?'
              let objMapInfo = {
                mapTitle: mapTitle,
                mapUrl: mapUrl,
                mapThumbnail: mapThumbnail,
              }
              arrMapInfos.push(objMapInfo)
            }
            if (arrMapInfos.length > 0) {
              this.setState({ mapInfos: arrMapInfos })
            } else {
              this._showInfo('数据没有服务')
            }
          }
        }
      }
    } catch (e) {
      Toast.show('网络错误')
    } finally {
      this.setState({ isLoadingProgressView: false })
      this._clearInterval()
    }
  }
  _selectImage = info => {
    return (
      <Image
        resizeMode={'stretch'}
        style={styles.imageStyle}
        source={{
          uri: info.item.mapThumbnail,
          headers: {
            // Cookie: 'JSESSIONID=' + this.state.cookie,
            // 'Cache-Control': 'no-cache',
          },
        }}
      />
    )
  }

  _renderItem = info => {
    let mapTitle = info.item.mapTitle
    if (mapTitle !== undefined) {
      return (
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate('ScanOnlineMap', {
              mapTitle: mapTitle,
              mapUrl: info.item.mapUrl,
              cookie: this.cookie,
            })
          }}
        >
          <View style={styles.itemViewStyle}>
            {this._selectImage(info)}
            <View style={{ flex: 1 }}>
              <Text style={[styles.restTitleTextStyle]} numberOfLines={2}>
                {mapTitle}
              </Text>
              <View style={{ flex: 1 }} />
              <Text
                numberOfLines={1}
                style={[
                  styles.restTitleTextStyle,
                  {
                    fontSize: 12,
                    lineHeight: textHeight,
                    textAlign: 'right',
                  },
                ]}
              >
                {getLanguage(global.language).Profile.BROWSE_MAP}
                {/* 浏览地图 */}
              </Text>
            </View>
          </View>
          <View style={styles.separateViewStyle} />
        </TouchableOpacity>
      )
    }
    return <View />
  }

  _keyExtractor = (item, index) => {
    return index * index + ''
  }

  _renderSectionHeader = section => {
    let title = section.section.title
    if (title !== undefined) {
      let lineHeight = scaleSize(80)
      return (
        <Text
          style={[
            styles.titleTextStyle,
            {
              fontWeight: 'bold',
              lineHeight: lineHeight,
              backgroundColor: color.itemColorGray,
              color: color.fontColorWhite,
            },
          ]}
        >
          {title}
        </Text>
      )
    }
    return <View />
  }

  _initSectionsData = () => {
    let sectionsData = []
    if (this.state.scenes.length > 0) {
      if (this.state.mapInfos.length > 0) {
        sectionsData = [
          {
            title: getLanguage(global.language).Profile.MAP_2D,
            //'二维地图',
            data: this.state.mapInfos,
          },

          {
            title: getLanguage(global.language).Profile.MAP_2D,
            //'三维场景',
            data: this.state.scenes,
          },
        ]
      } else {
        sectionsData = [
          {
            title: getLanguage(global.language).Profile.MAP_2D,
            //'三维场景',
            data: this.state.scenes,
          },
        ]
      }
    } else {
      if (this.state.mapInfos.length > 0) {
        sectionsData = [
          {
            title: getLanguage(global.language).Profile.MAP_2D,
            //'二维地图',
            data: this.state.mapInfos,
          },
        ]
      }
    }
    return sectionsData
  }
  _renderLoading = () => {
    if (this.state.isLoadingProgressView) {
      return (
        <View style={styles.noDataViewStyle}>
          <View
            style={{
              height: 2,
              width: this.state.progressWidth,
              backgroundColor: '#1c84c0',
            }}
          />
        </View>
      )
    } else {
      let arrSectionsData = this._initSectionsData()
      return (
        <SectionList
          style={styles.haveDataViewStyle}
          sections={arrSectionsData}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
        />
      )
    }
  }
  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.MAP_ONLINE,
          //'在线地图',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this._renderLoading()}
      </Container>
    )
  }
}
