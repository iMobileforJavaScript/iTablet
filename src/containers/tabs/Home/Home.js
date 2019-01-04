import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import { Container } from '../../../components'
import { ModuleList } from './components'
import styles from './styles'
import { scaleSize } from '../../../utils'
// import Orientation from '../../../constants/Orientation'
export default class Home extends Component {
  props: {
    nav: Object,
    latestMap: Array,
    currentUser: Object,
    setShow: () => {},
    device: Object,
    // map3DleadWorkspace: () => {},
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
          onPress={() => {
            // this.props.map3DleadWorkspace({
            //   path:
            //     '/storage/emulated/0/iTablet/Common/OlympicGreen_android.zip',
            // })
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
    let userImg = require('../../../assets/home/icon_mine_select.png')
    let moreImg = require('../../../assets/home/icon_else_selected.png')
    return (
      <Container
        ref={ref => (this.container = ref)}
        scrollable={true}
        headerProps={{
          title: 'SuperMap iTablet',
          headerLeft: (
            <TouchableOpacity
              style={styles.userView}
              onPress={() => {
                // this.props.map3DleadWorkspace({
                //   path:
                //     '/storage/emulated/0/iTablet/Common/OlympicGreen_android.zip',
                // })
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
            height: scaleSize(70) + (Platform.OS === 'ios' ? 20 : 0),
          },
        }}
        style={styles.container}
      >
        {/*{this.headRender()}*/}
        <ModuleList
          currentUser={this.props.currentUser}
          styles={styles.modulelist}
          device={this.props.device}
        />
      </Container>
    )
  }
}
