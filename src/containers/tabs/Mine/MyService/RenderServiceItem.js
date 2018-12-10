import React, { PureComponent } from 'react'
import { Image, Text, View, TouchableOpacity, Platform } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Utility, SOnlineService } from 'imobile_for_reactnative'
import styles, { textHeight } from './Styles'
import { ConstPath } from '../../../../constants'
import { Toast } from '../../../../utils'
import { color } from '../../../../styles'
let publishMap = []

export default class RenderServiceItem extends PureComponent {
  props: {
    imageUrl: string,
    mapName: string,
    sharedMapUrl: string,
    serviceNameAndFileName: Object,
    mapTileAndRestTitle: Object,
    isDownloading: boolean,
    index: number,
    itemOnPressCallBack: () => {},
    isScenes: boolean,
  }

  defaultProps: {
    imageUrl: 'none',
    mapName: '地图名称',
    downloadDataUrl: 'none',
    sharedMapUrl: 'none',
  }

  constructor(props) {
    super(props)
    this.state = {
      progress: '',
      isDownloading: this.props.isDownloading,
      disabled: false,
    }
    this.filePath = ''
    this.fileName = 'error.zip'
  }

  getDownloadFilePath = () => {
    return this.filePath
  }

  getDownloadFileName = () => {
    return this.fileName
  }

  setDownloadProgress = progress => {
    if (progress === '下载完成' || progress === '下载失败') {
      this.setState({ progress: progress, disabled: false })
    } else {
      this.setState({ progress: progress, disabled: true })
    }
  }

  _downloadMapFile = async mapTitle => {
    let restTitle = this.props.mapTileAndRestTitle[mapTitle]
    let onlineFileName = this.props.serviceNameAndFileName[
      restTitle
    ] /* 在线文件名为: xxx.zip**/
    if (onlineFileName !== undefined) {
      let savePath = await Utility.appendingHomeDirectory(
        ConstPath.UserPath + 'tmp/' + onlineFileName,
      )
      let isFileExist = await Utility.fileIsExist(savePath)
      if (isFileExist) {
        this.setState({ progress: '下载完成' })
        return
      }
      /** 回调到MyService*/
      this.props.itemOnPressCallBack &&
        this.props.itemOnPressCallBack(this.props.index)

      let fileName = onlineFileName.substring(0, onlineFileName.length - 4)
      SOnlineService.downloadFile(savePath, fileName)
      this.filePath = savePath
      this.fileName = fileName
      this.setState({ disabled: false })
    } else {
      this.setState({ disabled: false, progress: '下载失败' })
    }
  }

  _navigator = async (mapUrl, restTitle) => {
    if (mapUrl === 'null') {
      Toast.show('无法浏览地图')
      return
    }
    // if (Platform.OS === 'ios') {
    //
    // }
    if (publishMap.indexOf(restTitle) === -1) {
      let publish = await SOnlineService.changeServiceVisibility(
        restTitle,
        true,
      )
      if (typeof publish === 'boolean' && publish === true) {
        publishMap.push(restTitle)
      }
    }
    if (!this.props.isScenes) {
      NavigationService.navigate('MapView', {
        wsData: {
          DSParams: {
            server: mapUrl,
            engineType: 225,
            driver: 'REST',
            alias: mapUrl,
          },
          layerIndex: 0,
          type: 'Datasource',
        },
        mapName: this.props.mapName,
        isExample: true,
      })
    } else {
      Toast.show('无法浏览地图')
    }
  }
  /*
   uri: this.props.imageUrl,
          method: 'GET',
          headers:{
            'Host':'www.supermapol.com',
            'Cookie':'JSESSIONID='+sessionId,
          },
          credentials:'include',
          cache: 'force-cache'
  */
  _loadImage = () => {
    // console.log(
    //   '++++mapName' + this.props.mapName + '  url' + this.props.imageUrl,
    // )
    if (this.props.imageUrl === 'null') {
      return require('../../../../assets/home/icon-map-share.png')
    } else {
      if (Platform.OS === 'ios') {
        return {
          uri: this.props.imageUrl,
        }
      } else {
        // let sessionId = SOnlineService.getAndroidSessionID()
        return {
          uri: this.props.imageUrl,
        }
      }
    }
  }

  _onLoadStart = () => {
    // let imagePath =await SOnlineService.cacheImage(this.props.imageUrl,this.props.index)
  }
  render() {
    let mapUrl = this.props.sharedMapUrl
    let mapTitle = this.props.mapName
    let restTitle = this.props.mapTileAndRestTitle[mapTitle]
    let imagePicture = this._loadImage()
    return (
      <View style={{ flex: 1, backgroundColor: color.border }}>
        <View style={styles.itemTopContainer}>
          <TouchableOpacity
            style={styles.itemTopInternalImageStyle}
            onPress={() => {
              this._navigator(mapUrl, restTitle)
            }}
          >
            <Image
              style={styles.itemTopInternalImageStyle}
              source={imagePicture}
              /* onLoadStart={this._onLoadStart}*/
            />
          </TouchableOpacity>

          <View style={styles.itemTopInternalRightContainerStyle}>
            <Text
              style={[
                styles.textStyle,
                styles.fontLargeStyle,
                { lineHeight: 25 },
              ]}
            >
              {this.props.mapName}
            </Text>
            <View style={[styles.itemTopInternalRightBottomViewStyle]}>
              <TouchableOpacity
                style={styles.itemTopInternalRightBottomBottomViewStyle}
                onPress={() => {
                  this._navigator(mapUrl, restTitle)
                }}
              >
                <Text style={styles.textStyle}>浏览地图</Text>
              </TouchableOpacity>

              <View style={styles.itemTopInternalRightBottomBottomViewStyle}>
                <TouchableOpacity
                  /*disabled={this.state.disabled}*/
                  style={{ width: 80, height: textHeight }}
                  onPress={() => {
                    if (this.state.disabled) {
                      Toast.show('当前地图正在下载...')
                    } else {
                      if (this.props.isDownloading) {
                        this._downloadMapFile(mapTitle)
                      } else {
                        Toast.show('有地图正在下载...')
                      }
                    }
                  }}
                >
                  <Text style={styles.textStyle}>下载地图</Text>
                </TouchableOpacity>
                <Text style={[{ flex: 1 }, styles.textStyle]}>
                  {this.state.progress}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.itemBottomContainerStyle} />
      </View>
    )
  }
}
