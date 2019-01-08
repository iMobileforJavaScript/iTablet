import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Container } from '../../../components'
import { ModuleList } from './components'
import styles from './styles'
import { scaleSize } from '../../../utils'
// import {FileTools } from '../../../native'
// import { Toast } from '../../../utils'
// import {ConstPath } from '../../../constants'
// import Orientation from '../../../constants/Orientation'
export default class Home extends Component {
  props: {
    nav: Object,
    latestMap: Object,
    currentUser: Object,
    setShow: () => {},
    device: Object,
    // map3DleadWorkspace: () => {},
    importSceneWorkspace: () => {},
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
    let userImg = require('../../../assets/home/icon_mine_select.png')
    let moreImg = require('../../../assets/home/icon_else_selected.png')
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: 'SuperMap iTablet',
          headerLeft: (
            <TouchableOpacity
              style={styles.userView}
              onPress={async () => {
                // try {
                //   Toast.show('准备导入')
                // let userName = 'Customer'
                // let filepath = await FileTools.appendingHomeDirectory(
                //     ConstPath.UserPath +
                //       userName +
                //       '/' +
                //       ConstPath.RelativePath.Temp +
                //       'OlympicGreen_android/OlympicGreen_android.sxwu',
                //   )
                //   Toast.show('开始导入')
                //   this.props.importSceneWorkspace({
                //     server: filepath,
                //   })
                // } catch (error) {
                // console.warn(error)
                //  Toast.show(error)
                // }
              }}
            >
              <Image source={userImg} style={styles.userImg} />
            </TouchableOpacity>
          ),
          headerRight: (
            <TouchableOpacity style={styles.moreImg}>
              <Image
                resizeMode={'contain'}
                source={moreImg}
                style={styles.moreImg}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            height: scaleSize(80),
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
            currentUser={this.props.currentUser}
            styles={styles.modulelist}
            device={this.props.device}
          />
        </View>
      </Container>
    )
  }
}
