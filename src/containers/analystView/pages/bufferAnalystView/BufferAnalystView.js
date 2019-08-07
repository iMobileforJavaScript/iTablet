import React, { Component } from 'react'
import { InteractionManager } from 'react-native'
import { Container } from '../../../../components'
// import { ConstInfo } from '../../../../constants'
import { MapToolbar } from '../../../workspace/components'
import constants from '../../../workspace/constants'
import styles from './styles'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'
// import ScrollableTabView, {
//   DefaultTabBar,
// } from 'react-native-scrollable-tab-view'
import { SAnalyst, SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'
// import TabNavigationService from '../../../TabNavigationService'

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
    language: String,
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.cb = params && params.cb
    this.type = (params && params.type) || 'single' // single | multiple
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

  analyst = () => {
    if (!this.state.canBeAnalyst) return
    // if (!this.currentTab && this.singleBuffer)
    //   this.currentTab = this.singleBuffer
    if (this.currentTab) {
      Toast.show(getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_START)
      InteractionManager.runAfterInteractions(async () => {
        try {
          this.setLoading(
            true,
            getLanguage(this.props.language).Analyst_Prompt.ANALYSING,
          )
          // if (this.currentTabIndex === 0) {
          if (this.type === 'single') {
            let {
              sourceData,
              resultData,
              bufferParameter,
              isUnion,
              isAttributeRetained,
              optionParameter,
            } = await this.currentTab.getAnalystParams()
            SAnalyst.createBuffer(
              sourceData,
              resultData,
              bufferParameter,
              isUnion,
              isAttributeRetained,
              optionParameter,
            ).then(
              async res => {
                this.setLoading(false)

                Toast.show(
                  res.result
                    ? getLanguage(this.props.language).Analyst_Prompt
                      .ANALYSIS_SUCCESS
                    : getLanguage(this.props.language).Analyst_Prompt
                      .ANALYSIS_FAIL,
                  // : res.errorMsg || getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_FAIL,
                )

                if (res.result) {
                  let layers = await this.props.getLayers()
                  layers.length > 0 &&
                    (await SMap.setLayerFullView(layers[0].path))
                  GLOBAL.ToolBar && GLOBAL.ToolBar.setVisible(false)
                  NavigationService.goBack()
                  // NavigationService.goBack('AnalystListEntry')
                  // if (optionParameter.showResult) {
                  //   TabNavigationService.navigate('MapAnalystView')
                  // }
                  this.cb && this.cb()
                }
              },
              () => {
                this.setLoading(false)
                // Toast.show(res && res.errorMsg)
                Toast.show(
                  getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_FAIL,
                )
              },
            )
          } else {
            // let { sourceData, resultData, bufferRadiuses, bufferRadiusUnit, semicircleSegments, isUnion, isAttributeRetained, isRing, optionParameter } = this.currentTab.getAnalystParams()
            let params = await this.currentTab.getAnalystParams()
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
                this.setLoading(false)

                Toast.show(
                  res.result
                    ? getLanguage(this.props.language).Analyst_Prompt
                      .ANALYSIS_SUCCESS
                    : getLanguage(this.props.language).Analyst_Prompt
                      .ANALYSIS_FAIL,
                  // : res.errorMsg || getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_FAIL,
                )
                if (res.result) {
                  let layers = await this.props.getLayers()
                  layers.length > 0 &&
                    (await SMap.setLayerFullView(layers[0].path))
                  GLOBAL.ToolBar && GLOBAL.ToolBar.setVisible(false)
                  NavigationService.goBack()
                  // NavigationService.goBack('AnalystListEntry')
                  // if (
                  //   params.optionParameter &&
                  //   params.optionParameter.showResult
                  // ) {
                  //   TabNavigationService.navigate('MapView')
                  // }
                  this.cb && this.cb()
                }
              },
              () => {
                this.setLoading(false)
                // Toast.show(res && res.errorMsg)
                Toast.show(
                  getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_FAIL,
                )
              },
            )
          }
        } catch (e) {
          this.setLoading(false)
        }
      })
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
          title:
            this.type === 'single'
              ? getLanguage(this.props.language).Analyst_Modules
                .BUFFER_ANALYST_SINGLE
              : getLanguage(this.props.language).Analyst_Modules
                .BUFFER_ANALYST_MULTIPLE,
          navigation: this.props.navigation,
          backAction: this.back,
          // headerRight: (
          //   <TextBtn
          //     btnText={getLanguage(this.props.language).Analyst_Labels.ANALYST}
          //     textStyle={
          //       this.state.canBeAnalyst
          //         ? styles.headerBtnTitle
          //         : styles.headerBtnTitleDisable
          //     }
          //     btnClick={this.analyst}
          //   />
          // ),
        }}
      >
        <BufferAnalystViewTab
          ref={ref => (this.currentTab = ref)}
          // tabLabel={
          //   getLanguage(this.props.language).Analyst_Labels.MULTI_BUFFER_ZONE
          // }
          type={this.type}
          currentUser={this.props.currentUser}
          language={this.props.language}
          checkData={result => {
            this.checkData(result)
          }}
          analyst={this.analyst}
          canBeAnalyst={this.state.canBeAnalyst}
        />
        {/*<ScrollableTabView*/}
        {/*renderTabBar={() => <DefaultTabBar style={styles.tabView} />}*/}
        {/*initialPage={0}*/}
        {/*tabBarUnderlineStyle={{*/}
        {/*backgroundColor: 'rgba(70,128,223,1.0)',*/}
        {/*height: 2,*/}
        {/*width: 20,*/}
        {/*marginLeft: Dimensions.get('window').width / 4 - 10,*/}
        {/*}}*/}
        {/*tabBarBackgroundColor="white"*/}
        {/*tabBarActiveTextColor="rgba(70,128,223,1.0)"*/}
        {/*tabBarInactiveTextColor="black"*/}
        {/*tabBarTextStyle={{*/}
        {/*fontSize: scaleSize(25),*/}
        {/*textAlign: 'center',*/}
        {/*marginTop: 10,*/}
        {/*}}*/}
        {/*onChangeTab={({ i }) => {*/}
        {/*this.currentTabIndex = i*/}
        {/*switch (i) {*/}
        {/*case 0:*/}
        {/*this.currentTab = this.singleBuffer*/}
        {/*break*/}
        {/*case 1:*/}
        {/*this.currentTab = this.multiBuffer*/}
        {/*break*/}
        {/*}*/}
        {/*}}*/}
        {/*>*/}
        {/*<BufferAnalystViewTab*/}
        {/*ref={ref => (this.singleBuffer = ref)}*/}
        {/*tabLabel={*/}
        {/*getLanguage(this.props.language).Analyst_Labels.BUFFER_ZONE*/}
        {/*}*/}
        {/*type="single"*/}
        {/*currentUser={this.props.currentUser}*/}
        {/*language={this.props.language}*/}
        {/*checkData={result => {*/}
        {/*if (this.currentTabIndex === 0) {*/}
        {/*this.checkData(result)*/}
        {/*}*/}
        {/*}}*/}
        {/*/>*/}
        {/*<BufferAnalystViewTab*/}
        {/*ref={ref => (this.multiBuffer = ref)}*/}
        {/*tabLabel={*/}
        {/*getLanguage(this.props.language).Analyst_Labels.MULTI_BUFFER_ZONE*/}
        {/*}*/}
        {/*type="multiple"*/}
        {/*currentUser={this.props.currentUser}*/}
        {/*language={this.props.language}*/}
        {/*checkData={result => {*/}
        {/*if (this.currentTabIndex === 1) {*/}
        {/*this.checkData(result)*/}
        {/*}*/}
        {/*}}*/}
        {/*/>*/}
        {/*</ScrollableTabView>*/}
      </Container>
    )
  }
}
