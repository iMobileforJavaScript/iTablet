import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import { Container, TextBtn } from '../../../../components'
import { MAP_MODULE } from '../../../../constants/ConstModule'
import { MapToolbar } from '../../../workspace/components'
import constants from '../../../workspace/constants'
import styles from './styles'
import { scaleSize } from '../../../../utils'
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view'

import BufferAnalystViewTab from './BufferAnalystViewTab'

export default class BufferAnalystView extends Component {
  props: {
    navigation: Object,
    data: Array,
    setSettingData: () => {},
    settingData: any,
    device: Object,
    currentUser: Object,
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        type={constants.MAP_ANALYST}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: MAP_MODULE.MAP_ANALYST,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={'分析'}
              textStyle={styles.headerBtnTitle}
              btnClick={this.headerBtnAction}
            />
          ),
        }}
      >
        <ScrollableTabView
          renderTabBar={() => <DefaultTabBar style={styles.tabView} />}
          initialPage={0}
          tabBarUnderlineStyle={{
            backgroundColor: 'rgba(70,128,223,1.0)',
            height: 2,
            width: 20,
            marginLeft: Dimensions.get('window').width / 4 - 10,
          }}
          tabBarBackgroundColor="white"
          tabBarActiveTextColor="rgba(70,128,223,1.0)"
          tabBarInactiveTextColor="black"
          tabBarTextStyle={{
            fontSize: scaleSize(25),
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          <BufferAnalystViewTab
            tabLabel="缓冲区"
            currentUser={this.props.currentUser}
          />
          <BufferAnalystViewTab
            tabLabel="多重缓冲区"
            currentUser={this.props.currentUser}
          />
        </ScrollableTabView>
      </Container>
    )
  }
}
