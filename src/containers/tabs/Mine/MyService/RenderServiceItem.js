import React, { PureComponent } from 'react'
import { Image, Text, View, TouchableOpacity, Platform } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Utility, SOnlineService } from 'imobile_for_reactnative'
import styles, { textHeight } from './Styles'
import { ConstPath } from '../../../../constants'
import { Toast } from '../../../../utils'
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
    let onlineFileName = this.props.serviceNameAndFileName[restTitle]
    if (onlineFileName !== undefined) {
      let savePath = await Utility.appendingHomeDirectory(
        ConstPath.UserPath + onlineFileName,
      )
      let isFileExist = await Utility.fileIsExist(savePath)
      if (isFileExist) {
        this.setState({ progress: '下载完成' })
        return
      }
      this.props.itemOnPressCallBack &&
        this.props.itemOnPressCallBack(this.props.index)
      let fileName = onlineFileName.substring(0, onlineFileName.length - 4)
      SOnlineService.downloadFile(savePath, fileName)
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
    if (Platform.OS === 'ios') {
      if (publishMap.indexOf(restTitle) === -1) {
        let publish = await SOnlineService.changeServiceVisibility(
          restTitle,
          true,
        )
        if (typeof publish === 'boolean' && publish === true) {
          publishMap.push(restTitle)
        }
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

  _loadImage = () => {
    if (this.props.imageUrl === 'null') {
      return require('../../../../assets/home/icon-map-share.png')
    } else {
      return { url: this.props.imageUrl }
    }
    if(!this.props.isScenes){
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
    }else{
      Toast.show('无法浏览地图')
    }

  }

  _loadImage = () =>{
    if(this.props.imageUrl === 'null'){
     return require('../../../../assets/home/icon-map-share.png')
    }else{
      return {url: this.props.imageUrl}
    }
  }

  render() {
    let mapUrl = this.props.sharedMapUrl
    let mapTitle = this.props.mapName
    let restTitle = this.props.mapTileAndRestTitle[mapTitle]
    let imagePicture = this._loadImage()
    return (
      <View style={{ flex: 1 }}>
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
