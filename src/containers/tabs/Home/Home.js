import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import { Container } from '../../../components'
import { ModuleList } from './components'
import styles from './styles'
import { scaleSize } from '../../../utils'
import Toast from '../../../utils/Toast'
import { SScene } from 'imobile_for_reactnative'
import FileTools from '../../../native/FileTools'
import ConstPath from '../../../constants/ConstPath'
// import Orientation from '../../../constants/Orientation'
export default class Home extends Component {
  props: {
    nav: Object,
    latestMap: Object,
    currentUser: Object,
    setShow: () => {},
    device: Object,
    importSceneWorkspace: () => {},
    importWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isDownloaded: false,
    }
  }
  _onImportWorkspace = async (fileDirPath, item, isExist) => {
    try {
      if (fileDirPath !== undefined) {
        let currentUserName = this.props.currentUser.userName
        let homePath = await FileTools.appendingHomeDirectory()
        let toPath
        let lastIndexOf = fileDirPath.lastIndexOf('/')
        let fileName = fileDirPath.substring(lastIndexOf + 1)
        if (currentUserName === undefined) {
          currentUserName = ''
          toPath =
            homePath +
            ConstPath.CustomerPath +
            ConstPath.RelativePath.ExternalData +
            fileName
        } else {
          toPath =
            homePath +
            ConstPath.UserPath +
            currentUserName +
            '/' +
            ConstPath.RelativePath.ExternalData +
            fileName
        }
        let arrFilePath = await FileTools.getFilterFiles(toPath, {
          smwu: 'smwu',
          sxwu: 'sxwu',
        })
        if (arrFilePath.length === 0) {
          if (isExist) {
            item.action && item.action(this.props.currentUser)
          }
          await FileTools.copyFile(fileDirPath, toPath)
          let arrFilePath = await FileTools.getFilterFiles(fileDirPath, {
            smwu: 'smwu',
            sxwu: 'sxwu',
          })
          let filePath = arrFilePath[0].filePath
          let is3D = await SScene.is3DWorkspace({ server: filePath })
          if (is3D === true) {
            let result = await this.props.importSceneWorkspace({
              server: filePath,
            })
            if (result === true) {
              Toast.show('导入3D成功')
            } else {
              Toast.show('导入3D失败')
            }
          } else {
            let result = await this.props.importWorkspace({
              path: filePath,
            })
            // console.warn(JSON.stringify(result))
            if (result.msg !== undefined) {
              Toast.show('导入失败')
            } else {
              Toast.show('导入成功')
            }
          }
        } else if (isExist === true) {
          item.action && item.action(this.props.currentUser)
        }
      }
    } catch (e) {
      Toast.show('导入失败')
    } finally {
      this.setState({ isDownloaded: true })
    }
  }
  headRender() {
    let userImg = require('../../../assets/home/icon_mine_select.png')
    let moreImg = require('../../../assets/home/icon_else_selected.png')
    const title = 'SuperMap iTablet'
    return (
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.userView}>
          <Image source={userImg} style={styles.userImg} />
        </TouchableOpacity>
        <Text style={styles.headTitle}>{title}</Text>
        <TouchableOpacity style={styles.moreImg}>
          <Image
            resizeMode={'contain'}
            source={moreImg}
            style={styles.moreImg}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>
    )
  }

  render() {
    let userImg = require('../../../assets/home/Frenchgrey/icon_mine_select.png')
    let moreImg = require('../../../assets/home/Frenchgrey/icon_else_selected.png')
    const HEADERHEIGHT = scaleSize(44) + (Platform.OS === 'ios' ? 15 : 0)
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: 'SuperMap iTablet',
          headerLeft: (
            <TouchableOpacity style={styles.userView} onPress={async () => {}}>
              <Image source={userImg} style={styles.userImg} />
            </TouchableOpacity>
          ),
          headerRight: (
            <TouchableOpacity style={{ flex: 1, marginRight: scaleSize(18.5) }}>
              <Image
                resizeMode={'contain'}
                source={moreImg}
                style={styles.moreImg}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            height: HEADERHEIGHT,
          },
        }}
        style={styles.container}
      >
        {/*{this.headRender()}*/}
        <View
          style={{
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ModuleList
            importWorkspace={this._onImportWorkspace}
            currentUser={this.props.currentUser}
            styles={styles.modulelist}
            device={this.props.device}
          />
        </View>
      </Container>
    )
  }
}
