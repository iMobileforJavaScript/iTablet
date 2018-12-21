import React, { Component } from 'react'
import {
  Image,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native'
import { Container } from '../../../../../components'
import styles, { textHeight } from './Styles'
import NavigationService from '../../../../NavigationService'
import { FetchUtils } from '../../../../../utils'
import Toast from '../../../../../utils/Toast'
import { SOnlineService } from 'imobile_for_reactnative'
export default class MyOnlineMap extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      scenes: this.props.navigation.getParam('scenes', []),
      mapInfos: this.props.navigation.getParam('mapInfos', []),
    }
  }
  componentDidMount() {
    this._loadOnlineData()
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
  _loadOnlineData = async () => {
    try {
      this.cookie = await SOnlineService.getAndroidSessionID()
      let uri = this.props.navigation.getParam('uri', 'null')
      if (uri === undefined || uri === null || uri === 'null') {
        this._initSectionsData()
        return
      }
      if (this.containerRef !== undefined) {
        this.containerRef.setLoading(true, 'Loading...')
      }
      let objDataJson = await FetchUtils.getObjJson(uri)
      let arrDataItemServices = objDataJson.dataItemServices
      let length = arrDataItemServices.length
      let restUrl
      for (let i = 0; i < length; i++) {
        let dataItemServices = arrDataItemServices[i]
        if (dataItemServices.serviceType === 'RESTMAP') {
          restUrl = dataItemServices.address
          break
        }
      }
      if (restUrl === undefined) {
        this._showInfo('数据没有发布服务')
      } else {
        restUrl = 'http' + restUrl.substring(5, restUrl.length) + '/maps.json'
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
    } catch (e) {
      Toast.show('网络错误')
    } finally {
      if (this.containerRef !== undefined) {
        this.containerRef.setLoading(false)
      }
    }
  }
  _selectImage = info => {
    if (Platform.OS === 'ios') {
      return (
        <Image
          resizeMode={'stretch'}
          style={styles.imageStyle}
          source={{ uri: info.item.mapThumbnail }}
        />
      )
    } else {
      return (
        <Image
          resizeMode={'stretch'}
          style={styles.imageStyle}
          source={{
            uri: info.item.mapThumbnail,
            headers: {
              Cookie: 'JSESSIONID=' + this.state.cookie,
            },
          }}
        />
      )
    }
  }

  _renderItem = info => {
    let mapTitle = info.item.mapTitle
    if (mapTitle !== undefined) {
      if (this.cookie === undefined) {
        this.cookie = ''
      }
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
            <View>
              <Text style={[styles.restTitleTextStyle]} numberOfLines={2}>
                {mapTitle}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.restTitleTextStyle,
                  {
                    fontSize: 12,
                    lineHeight: textHeight,
                    textAlign: 'right',
                    paddingRight: 25,
                  },
                ]}
              >
                浏览地图
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
      return <Text style={styles.titleTextStyle}>{title}</Text>
    }
    return <View />
  }

  _initSectionsData = () => {
    let sectionsData = []
    if (this.state.scenes.length > 0) {
      if (this.state.mapInfos.length > 0) {
        sectionsData = [
          { title: '二维地图', data: this.state.mapInfos },
          { title: '三维场景', data: this.state.scenes },
        ]
      } else {
        sectionsData = [{ title: '三维场景', data: this.state.scenes }]
      }
    } else {
      if (this.state.mapInfos.length > 0) {
        sectionsData = [{ title: '二维地图', data: this.state.mapInfos }]
      }
    }
    return sectionsData
  }

  render() {
    let arrSectionsData = this._initSectionsData()
    return (
      <Container
        ref={ref => (this.containerRef = ref)}
        headerProps={{
          title: '在线地图',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <SectionList
          style={styles.haveDataViewStyle}
          sections={arrSectionsData}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
        />
      </Container>
    )
  }
}
