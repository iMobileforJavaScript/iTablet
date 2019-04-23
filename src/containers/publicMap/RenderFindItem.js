/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import styles from './Styles'
import { Toast } from '../../utils'
import NavigationService from '../NavigationService'
import RNFS from 'react-native-fs'
import { FileTools } from '../../native'
import ConstPath from '../../constants/ConstPath'
import { color } from '../../styles'
import UserType from '../../constants/UserType'
import { getLanguage } from '../../language'

export default class RenderFindItem extends Component {
  props: {
    data: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.path = undefined
    this.exist = false
    this.downloading = false
    this.downloadingPath = false
    this.titleName
    this.state = {
      progress: getLanguage(global.language).Prompt.DOWNLOAD,
      // '下载',
      isDownloading: false,
    }

    this.unZipFile = this.unZipFile.bind(this)
  }

  async componentDidMount() {
    this.path =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      this.props.data.fileName

    this.downloadingPath =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      this.props.data.MD5

    this.exist = false
    let exist = await FileTools.fileIsExist(this.downloadingPath + '_')
    if (exist) {
      this.exist = true
      this.setState({
        progress: getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY,
        //'下载完成',
        isDownloading: false,
      })
    }

    //检测是否下载完成
    exist = await FileTools.fileIsExist(this.downloadingPath)
    if (exist) {
      this.downloading = true
      let timer = setInterval(async () => {
        exist = await FileTools.fileIsExist(this.downloadingPath + '_')
        if (exist) {
          clearInterval(timer)
          this.exist = true
          this.setState({
            progress: getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY,
            //'下载完成',
            isDownloading: false,
          })
        } else {
          let result = await RNFS.readFile(this.downloadingPath)
          this.setState({
            progress: result,
            //'下载完成',
            isDownloading: true,
          })
        }
      }, 2000)
      this.setState({
        progress: getLanguage(global.language).Prompt.DOWNLOADING,
        //'下载完成',
        isDownloading: true,
      })
    }

    this.titleName = ''
    if (this.props.data.fileName) {
      let index = this.props.data.fileName.lastIndexOf('.')
      this.titleName =
        index === -1
          ? this.props.data.fileName
          : this.props.data.fileName.substring(0, index)
    }
  }
  _navigator = uri => {
    NavigationService.navigate('MyOnlineMap', {
      uri: uri,
    })
  }
  _nextView = async () => {
    if (this.props.data.type === 'WORKSPACE') {
      if (this.props.data.serviceStatus === 'UNPUBLISHED') {
        let dataId = this.props.data.id
        let dataUrl = 'https://www.supermapol.com/web/datas/' + dataId + '.json'
        this._navigator(dataUrl)
      } else {
        Toast.show('服务没有公开，无权限浏览')
      }
    } else {
      let info = this.props.data.type + '数据无法浏览'
      Toast.show(info)
    }
  }
  _downloadFile = async () => {
    if (this.exist) {
      await this.unZipFile()
      Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY)
      return
    }
    if (
      this.props.user &&
      this.props.user.currentUser &&
      (this.props.user.currentUser.userType === UserType.PROBATION_USER ||
        (this.props.user.currentUser.userName &&
          this.props.user.currentUser.userName !== ''))
    ) {
      if (this.state.isDownloading) {
        Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
        //'正在下载...')
        return
      }
      this.setState({
        progress: getLanguage(global.language).Prompt.DOWNLOADING,
        isDownloading: true,
      })
      RNFS.writeFile(this.downloadingPath, '0%', 'utf8')

      let dataId = this.props.data.id
      let dataUrl =
        'https://www.supermapol.com/web/datas/' + dataId + '/download'
      const downloadOptions = {
        fromUrl: dataUrl,
        toFile: this.path,
        background: true,
        progress: res => {
          let value = ~~res.progress.toFixed(0)
          let progress = value + '%'
          if (this.state.progress !== progress) {
            this.setState({ progress })
          }
          RNFS.writeFile(this.downloadingPath, progress, 'utf8')
        },
      }
      try {
        const ret = RNFS.downloadFile(downloadOptions)
        ret.promise
          .then(async () => {
            this.setState({
              progress: getLanguage(global.language).Prompt
                .DOWNLOAD_SUCCESSFULLY,
              //'下载完成',
              isDownloading: false,
            })
            let result = await this.unZipFile()
            if (result === false) {
              Toast.show('网络数据已损坏，无法正常使用')
            } else {
              this.exist = true
            }
            FileTools.deleteFile(this.downloadingPath)
            RNFS.writeFile(this.downloadingPath + '_', '100%', 'utf8')
          })
          .catch(() => {
            Toast.show('下载失败')
            FileTools.deleteFile(this.path)
            this.setState({ progress: '下载', isDownloading: false })
          })
      } catch (e) {
        Toast.show('网络错误')
        FileTools.deleteFile(this.path)
        this.setState({ progress: '下载', isDownloading: false })
      }
    } else {
      Toast.show('登录后可下载')
    }
  }

  async unZipFile() {
    let appHome = await FileTools.appendingHomeDirectory()
    let userName =
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? 'Customer'
        : this.props.user.currentUser.userName
    let fileDir =
      appHome +
      ConstPath.UserPath +
      userName +
      '/' +
      ConstPath.RelativePath.ExternalData +
      this.titleName
    let exists = await RNFS.exists(fileDir)
    if (!exists) {
      await RNFS.mkdir(fileDir)
    }
    let result = await FileTools.unZipFile(this.path, fileDir)
    if (!result) {
      FileTools.deleteFile(this.path)
    }
    return result
  }
  render() {
    let date = new Date(this.props.data.lastModfiedTime)
    let year = date.getFullYear() + '/'
    let month = date.getMonth() + 1 + '/'
    let day = date.getDate() + ''
    let hour = date.getHours() + ':'
    if (hour.length < 3) {
      hour = '0' + hour
    }
    let minute = date.getMinutes() + ''
    if (minute.length < 2) {
      minute = '0' + minute
    }
    let time = year + month + day + ' ' + hour + minute
    let size =
      this.props.data.size / 1024 / 1024 > 0.1
        ? (this.props.data.size / 1024 / 1024).toFixed(2) + 'MB'
        : (this.props.data.size / 1024).toFixed(2) + 'K'
    let fontColor = color.fontColorGray
    let titleFontColor = color.fontColorBlack
    return (
      <View>
        <View style={styles.itemViewStyle}>
          <TouchableOpacity
            onPress={() => {
              this._nextView()
            }}
          >
            <Image
              resizeMode={'stretch'}
              style={styles.imageStyle}
              source={{ uri: this.props.data.thumbnail }}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={[styles.restTitleTextStyle, { color: titleFontColor }]}
              numberOfLines={2}
            >
              {this.titleName}
            </Text>
            <View style={styles.viewStyle2}>
              <Image
                style={[styles.imageStyle2, { tintColor: fontColor }]}
                resizeMode={'contain'}
                source={require('../../assets/tabBar/tab_user.png')}
              />
              <Text
                style={[styles.textStyle2, { color: fontColor }]}
                numberOfLines={1}
              >
                {this.props.data.nickname}
              </Text>
            </View>
            <View style={[styles.viewStyle2, { marginTop: 5 }]}>
              <Image
                style={[styles.imageStyle2, { tintColor: fontColor }]}
                resizeMode={'contain'}
                source={require('../../assets/tabBar/find_time.png')}
              />
              <Text
                style={[styles.textStyle2, { color: fontColor }]}
                numberOfLines={1}
              >
                {time}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: 100,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ fontSize: 12, textAlign: 'center', color: fontColor }}
              numberOfLines={1}
            >
              {size}
            </Text>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this._downloadFile()
              }}
            >
              <Image
                style={{ width: 35, height: 35, tintColor: fontColor }}
                source={require('../../assets/tabBar/find_download.png')}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 12,
                textAlign: 'center',
                width: 125,
                color: fontColor,
              }}
              numberOfLines={1}
            >
              {this.state.progress}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.separateViewStyle,
            {
              backgroundColor: color.separateColorGray,
            },
          ]}
        />
      </View>
    )
  }
}
