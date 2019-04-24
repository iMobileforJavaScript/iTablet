import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import { Container, TextBtn } from '../../../../components'
import { ConstInfo, ConstAnalyst } from '../../../../constants'
import { MapToolbar } from '../../../workspace/components'
import constants from '../../../workspace/constants'
import styles from './styles'
import { scaleSize, Toast } from '../../../../utils'
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view'
import { SAnalyst } from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'

import BufferAnalystViewTab from './BufferAnalystViewTab'

export default class BufferAnalystView extends Component {
  props: {
    navigation: Object,
    data: Array,
    setSettingData: () => {},
    getLayers: () => {},
    settingData: any,
    device: Object,
    currentUser: Object,
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.cb = params && params.cb
    this.state = {
      canBeAnalyst: false,
    }
    this.currentTabIndex = 0
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  checkData = result => {
    if (result !== this.state.canBeAnalyst) {
      this.setState({
        canBeAnalyst: result,
      })
    }
  }

  analyst = async () => {
    if (!this.state.canBeAnalyst) return
    if (!this.currentTab && this.singleBuffer)
      this.currentTab = this.singleBuffer
    if (this.currentTab) {
      Toast.show(ConstInfo.ANALYST_START)
      // this.setLoading(ConstInfo.ANALYST_START)
      if (this.currentTabIndex === 0) {
        let {
          sourceData,
          resultData,
          bufferParameter,
          isUnion,
          isAttributeRetained,
          optionParameter,
        } = this.currentTab.getAnalystParams()
        SAnalyst.createBuffer(
          sourceData,
          resultData,
          bufferParameter,
          isUnion,
          isAttributeRetained,
          optionParameter,
        ).then(
          res => {
            Toast.show(
              res.result
                ? ConstInfo.ANALYST_SUCCESS
                : res.errorMsg || ConstInfo.ANALYST_FAIL,
            )

            if (res.result) {
              NavigationService.goBack()
              if (optionParameter.showResult) {
                this.cb && this.cb()
              }
            }
          },
          res => {
            Toast.show(res && res.errorMsg)
          },
        )
      } else {
        // let { sourceData, resultData, bufferRadiuses, bufferRadiusUnit, semicircleSegments, isUnion, isAttributeRetained, isRing, optionParameter } = this.currentTab.getAnalystParams()
        let params = this.currentTab.getAnalystParams()
        SAnalyst.createMultiBuffer(
          params.sourceData,
          params.resultData,
          params.bufferRadiuses,
          params.bufferRadiusUnit,
          params.semicircleSegments,
          params.isUnion,
          params.isAttributeRetained,
          params.isRing,
          params.optionParameter,
        ).then(
          async res => {
            Toast.show(
              res.result
                ? ConstInfo.ANALYST_SUCCESS
                : res.errorMsg || ConstInfo.ANALYST_FAIL,
            )

            if (res.result) {
              await this.props.getLayers()
              NavigationService.goBack()
              if (params.optionParameter.showResult) {
                this.cb && this.cb()
              }
            }
          },
          res => {
            Toast.show(res && res.errorMsg)
          },
        )
      }
    }
  }

  back = () => {
    NavigationService.goBack()
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
          title: ConstAnalyst.BUFFER_ANALYST_2,
          navigation: this.props.navigation,
          backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={'分析'}
              textStyle={
                this.state.canBeAnalyst
                  ? styles.headerBtnTitle
                  : styles.headerBtnTitleDisable
              }
              btnClick={this.analyst}
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
          onChangeTab={({ i }) => {
            this.currentTabIndex = i
            switch (i) {
              case 0:
                this.currentTab = this.singleBuffer
                break
              case 1:
                this.currentTab = this.multiBuffer
                break
            }
          }}
        >
          <BufferAnalystViewTab
            ref={ref => (this.singleBuffer = ref)}
            tabLabel="缓冲区"
            type="single"
            currentUser={this.props.currentUser}
            checkData={result => {
              if (this.currentTabIndex === 0) {
                this.checkData(result)
              }
            }}
          />
          <BufferAnalystViewTab
            ref={ref => (this.multiBuffer = ref)}
            tabLabel="多重缓冲区"
            type="multiple"
            currentUser={this.props.currentUser}
            checkData={result => {
              if (this.currentTabIndex === 1) {
                this.checkData(result)
              }
            }}
          />
        </ScrollableTabView>
      </Container>
    )
  }
}
