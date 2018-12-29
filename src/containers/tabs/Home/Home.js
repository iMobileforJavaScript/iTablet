import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Container } from '../../../components'
import { ModuleList } from './components'
import styles from './styles'
import { FileTools } from '../../../native'
import { ConstPath } from '../../../constants'
import { Toast } from '../../../utils'
// import Orientation from '../../../constants/Orientation'
export default class Home extends Component {
  props: {
    nav: Object,
    latestMap: Array,
    currentUser: Object,
    setShow: () => {},
    device: Object,
    // map3DleadWorkspace: () => {},
    improtSceneWorkspace: () => {},
  }

  constructor(props) {
    super(props)
  }

  headRender() {
    let userImg = require('../../../assets/home/icon_mine_select.png')
    let moreImg = require('../../../assets/home/icon_else_selected.png')
    const title = 'SuperMap iTablet'
    return (
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.userView}
          onPress={async () => {
            try {
              Toast.show('准备导入')
              let userName = this.props.currentUser
                ? this.props.currentUser
                : ' Customer'
              // let path=await FileTools.appendingHomeDirectory(
              //   ConstPath.UserPath +
              //     userName +
              //     '/' +
              //     ConstPath.RelativePath.DownLoad+"OlympicGreen_ios.zip"
              // )
              // let targePath=await FileTools.appendingHomeDirectory(
              //   ConstPath.UserPath +
              //     userName +
              //     '/' +
              //     ConstPath.RelativePath.DownLoad
              // )
              //  Toast.show("开始解压")
              // FileTools.unZipFile(path,targePath)
              let filepath = await FileTools.appendingHomeDirectory(
                ConstPath.UserPath +
                  userName +
                  '/' +
                  ConstPath.RelativePath.Temp +
                  'OlympicGreen_ios/OlympicGreen_ios.sxwu',
              )
              Toast.show('开始导入')
              this.props.improtSceneWorkspace({
                server: filepath,
              })
            } catch (error) {
              // console.warn(error)
              //  Toast.show(error)
            }
          }}
        >
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
    return (
      <Container
        ref={ref => (this.container = ref)}
        scrollable={true}
        withoutHeader
        style={styles.container}
      >
        {this.headRender()}
        <ModuleList
          currentUser={this.props.currentUser}
          styles={styles.modulelist}
          device={this.props.device}
        />
      </Container>
    )
  }
}
