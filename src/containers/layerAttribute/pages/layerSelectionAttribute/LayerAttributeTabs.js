/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Container, MTBtn } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import { setSpText } from '../../../../utils'
import { getThemeAssets } from '../../../../assets'
import { color, zIndexLevel } from '../../../../styles'
import NavigationService from '../../../NavigationService'
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
  drawerOverlay: {
    backgroundColor: color.modalBgColor,
    position: 'absolute',
    zIndex: zIndexLevel.TWO,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
    let { params } = props.navigation.state
    this.state = {
      currentIndex:
        this.props.selection.length > 0 &&
        this.props.selection[0].ids.length === 1
          ? 0
          : -1,
      currentFieldInfo: [],
      currentTabIndex: 0,
      isShowDrawer: false,
      initialPage: params && params.initialPage >= 0 ? params.initialPage : 0,
    }

    // this.currentFieldInfo = []
    // this.currentFieldIndex = -1
    // this.isShowDrawer = false
    this.currentTabRefs = []
    // this.currentTabIndex = 0
  }

  showDrawer = isShow => {
    if (!this.drawer) return
    if (isShow !== undefined && isShow !== this.state.isShowDrawer) {
      this.setState(
        {
          isShowDrawer: isShow,
        },
        () => this.drawer.showBar(isShow),
      )
    } else if (isShow === undefined) {
      this.setState(
        {
          isShowDrawer: !this.state.isShowDrawer,
        },
        () => this.drawer.showBar(this.state.isShowDrawer),
      )
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
    } else {
      this.setState({
        currentIndex: -1,
        currentFieldInfo: [],
      })
    }
  }

  editUndo = () => {
    // TODO 属性编辑回退
  }

  goToSearch = () => {
    NavigationService.navigate('LayerAttributeSearch', {
      layerPath: this.props.selection[this.state.currentTabIndex].layerInfo
        .path,
      isSelection: true,
    })
  }

  /** 关联事件 **/
  relateAction = () => {
    if (
      this.state.currentTabIndex >= this.currentTabRefs.length &&
      !this.currentTabRefs[this.state.currentTabIndex]
    )
      return
    let layerPath = this.currentTabRefs[this.state.currentTabIndex].props
        .layerSelection.layerInfo.path,
      selection = this.currentTabRefs[this.state.currentTabIndex].getSelection()

    let objs = []
    for (let i = 0; i < this.props.selection.length; i++) {
      if (this.props.selection[i].layerInfo.name === layerPath) {
        objs.push({
          layerPath: layerPath,
          ids: [selection.data[0].value],
        })
      } else {
        objs.push({
          layerPath: this.props.selection[i].layerInfo.name,
          ids: [],
        })
      }
    }

    SMap.setAction(Action.PAN)
    // SMap.selectObj(layerPath, [selection.data[0].value]).then(() => {
    SMap.selectObjs(objs).then(() => {
      // TODO 选中对象跳转到地图
      // this.props.navigation && this.props.navigation.navigate('MapView')
      NavigationService.navigate('MapView')
      // NavigationService.goBack()
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

  drawerOnChange = ({ index }) => {
    // this.scrollTab && this.scrollTab.goToPage(index)
    this.state.currentTabIndex !== index &&
      this.setState({
        currentTabIndex: index,
      })
    let timer = setTimeout(() => {
      this.showDrawer(false)
      clearTimeout(timer)
    }, 1000)
  }

  back = () => {
    NavigationService.goBack()

    GLOBAL.toolBox.showFullMap && GLOBAL.toolBox.showFullMap(true)
    GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE

    GLOBAL.toolBox.setVisible(
      true,
      ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE,
      {
        containerType: 'table',
        column: 3,
        isFullScreen: false,
        height: ConstToolType.HEIGHT[0],
        cb: () => {
          switch (GLOBAL.currentToolbarType) {
            case ConstToolType.MAP_TOOL_POINT_SELECT:
              SMap.setAction(Action.SELECT)
              break
            case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
              SMap.selectByRectangle()
              break
          }
        },
      },
    )
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
        initialPage={this.state.initialPage}
        page={this.state.currentTabIndex}
        tabBarPosition={'bottom'}
        onChangeTab={({ i }) => {
          if (
            this.state.currentTabIndex < this.currentTabRefs.length &&
            this.currentTabRefs[this.state.currentTabIndex] &&
            this.currentTabRefs[this.state.currentTabIndex].selectRow &&
            typeof this.currentTabRefs[this.state.currentTabIndex].selectRow ===
              'function'
          ) {
            this.currentTabRefs[this.state.currentTabIndex].clearSelection()
          }
          if (
            i < this.currentTabRefs.length &&
            this.state.currentTabIndex !== i
          ) {
            this.setState({
              currentTabIndex: i,
            })
          }
          GLOBAL.LayerAttributeTabIndex = i
        }}
        locked
        scrollWithoutAnimation
        // renderTabBar={() => (
        //   <View/>
        // )}
        renderTabBar={() => (
          <DefaultTabBar
            style={{ height: 0 }}
            activeBackgroundColor={color.bgW}
            activeTextColor={color.themeText2}
            inactiveTextColor={'white'}
            textStyle={{
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
          this.currentTabRefs[index] = ref
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
          backAction: this.back,
          headerRight: [
            <MTBtn
              key={'undo'}
              image={getThemeAssets().attribute.icon_undo}
              imageStyle={styles.headerBtn}
              onPress={this.editUndo}
            />,
            <MTBtn
              key={'search'}
              image={getThemeAssets().publicAssets.iconSearch}
              imageStyle={styles.headerBtn}
              onPress={this.goToSearch}
            />,
          ],
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
        {this.state.isShowDrawer && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.drawerOverlay}
            onPress={() => this.showDrawer(false)}
          />
        )}
        <DrawerBar
          ref={ref => (this.drawer = ref)}
          data={this.props.selection}
          index={this.state.currentTabIndex}
          onChange={this.drawerOnChange}
        />
      </Container>
    )
  }
}
