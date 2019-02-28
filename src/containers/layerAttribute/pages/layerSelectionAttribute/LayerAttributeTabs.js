/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Container } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import { setSpText } from '../../../../utils'
import { color } from '../../../../styles'
import DefaultTabBar from './DefaultTabBar'
import { LayerTopBar, DrawerBar } from '../../components'
import LayerSelectionAttribute from './LayerSelectionAttribute'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { SMap, Action } from 'imobile_for_reactnative'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
})

export default class LayerAttributeTabs extends React.Component {
  props: {
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    map: Object,
    selection: Array,
    setCurrentAttribute: () => {},
    setLayerAttributes: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      currentIndex:
        this.props.selection.length === 1 &&
        this.props.selection[0].ids.length === 1
          ? 0
          : -1,
      currentFieldInfo: [],
    }

    // this.currentFieldInfo = []
    // this.currentFieldIndex = -1
    this.isShowDrawer = false
    this.currentTabRef = null
  }

  showDrawer = () => {
    if (this.drawer) {
      this.drawer.showBar(!this.isShowDrawer)
      this.isShowDrawer = !this.isShowDrawer
    }
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  selectAction = ({ data, index }) => {
    if (this.props.selection.length > 0 && index !== this.state.currentIndex) {
      this.setState({
        currentIndex: index,
        currentFieldInfo: data,
      })
    }
  }

  /** 关联事件 **/
  relateAction = () => {
    if (!this.currentTabRef) return
    let layerPath = this.currentTabRef.props.layerSelection.layerInfo.path,
      selection = this.currentTabRef.getSelection()

    SMap.setAction(Action.PAN)
    SMap.selectObj(layerPath, [selection.data[0].value]).then(() => {
      // this.props.navigation && this.props.navigation.navigate('MapView')
      this.props.navigation && this.props.navigation.goBack()
      GLOBAL.toolBox.setVisible(
        true,
        ConstToolType.ATTRIBUTE_SELECTION_RELATE,
        {
          isFullScreen: false,
          height: 0,
        },
      )
      GLOBAL.toolBox.showFullMap()
    })
  }

  renderTabs = () => {
    let children = []
    for (let i = 0; i < this.props.selection.length; i++) {
      children.push(
        this.renderTable({
          data: this.props.selection[i],
          index: i,
        }),
      )
    }
    return (
      <ScrollableTabView
        ref={ref => (this.scrollTab = ref)}
        style={styles.container}
        initialPage={0}
        tabBarPosition={'bottom'}
        onChangeTab={({ ref }) => {
          this.currentTabRef = ref
        }}
        renderTabBar={() => (
          <DefaultTabBar
            activeBackgroundColor={color.bgW}
            activeTextColor={color.themeText2}
            inactiveTextColor={'white'}
            textStyle={{
              // fontSize: size.fontSize.fontSizeSm,
              fontSize: setSpText(22),
              backgroundColor: 'transparent',
            }}
            tabStyle={{
              backgroundColor: color.subTheme,
            }}
          />
        )}
        tabBarUnderlineStyle={{
          height: 0,
        }}
      >
        {children}
      </ScrollableTabView>
    )
  }

  renderTable = ({ data, index = 0 }) => {
    return (
      <LayerSelectionAttribute
        ref={ref => {
          if (index === 0) {
            this.currentTabRef = ref
          }
        }}
        key={index}
        tabLabel={data.layerInfo.name || ('图层' + index >= 0 ? index + 1 : '')}
        // currentAttribute={this.props.currentAttribute}
        // currentLayer={this.props.currentLayer}
        map={this.props.map}
        layerSelection={data}
        setLoading={this.setLoading}
        setCurrentAttribute={this.props.setCurrentAttribute}
        setLayerAttributes={this.props.setLayerAttributes}
        selectAction={this.selectAction}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '属性',
          navigation: this.props.navigation,
        }}
        style={styles.container}
      >
        <LayerTopBar
          hasTabBtn
          tabsAction={this.showDrawer}
          canRelated={this.state.currentIndex >= 0}
          relateAction={this.relateAction}
        />
        {this.props.selection && this.props.selection.length > 0 ? (
          this.props.selection.length > 1 ? (
            this.renderTabs()
          ) : (
            this.renderTable({
              data: this.props.selection[0],
              index: 0,
            })
          )
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <DrawerBar
          ref={ref => (this.drawer = ref)}
          data={this.props.selection}
        />
      </Container>
    )
  }
}
