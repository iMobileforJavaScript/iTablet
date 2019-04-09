/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Container, MTBtn, PopModal } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import { scaleSize } from '../../../../utils'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { color, zIndexLevel } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import DefaultTabBar from './DefaultTabBar'
import { LayerTopBar, DrawerBar, LocationView } from '../../components'
import LayerSelectionAttribute from './LayerSelectionAttribute'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { Utils } from '../../../workspace/util'
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
  editControllerView: {
    flexDirection: 'row',
    height: scaleSize(100),
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: color.contentColorWhite,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtn: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  locationView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.bgW,
  },
})

export default class LayerAttributeTabs extends React.Component {
  props: {
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    map: Object,
    selection: Array,
    attributesHistory: Array,
    setCurrentAttribute: () => {},
    setLayerAttributes: () => {},
    setAttributeHistory: () => {},
  }

  constructor(props) {
    super(props)
    let { params } = props.navigation.state
    let initTabIndex = 0
    let initIndex =
      props.selection.length > 0 && props.selection[0].ids.length === 1 ? 0 : -1
    let initFieldInfo = []

    this.preAction = params && params.preAction
    // 初始化选择的图层和属性（关联后返回属性界面，找到对应的图层属性）
    const selectionAttribute = params && params.selectionAttribute
    if (
      props.selection &&
      props.selection.length > 0 &&
      selectionAttribute &&
      selectionAttribute.layerInfo &&
      selectionAttribute.layerInfo.name
    ) {
      for (let i = 0; i < props.selection.length; i++) {
        if (
          selectionAttribute.layerInfo.name ===
          props.selection[i].layerInfo.name
        ) {
          initFieldInfo = selectionAttribute.data || []
          initIndex =
            selectionAttribute.index >= 0 ? selectionAttribute.index : -1
          initTabIndex = i
          break
        }
      }
    }

    this.state = {
      isShowView: false,
      currentIndex: initIndex,
      currentFieldInfo: initFieldInfo,
      currentTabIndex: initTabIndex,
      isShowDrawer: false,
      initialPage: initTabIndex,
      attributes: {
        head: [],
        data: [],
      },
    }

    // 选择集中当前选中的属性
    GLOBAL.SelectedSelectionAttribute = selectionAttribute || {
      index: initIndex,
      layerInfo: {},
      data: [],
    }

    this.currentTabRefs = []
    this.init = !!selectionAttribute
  }

  componentDidMount() {
    (async function() {
      if (this.preAction && typeof this.preAction === 'function') {
        await this.preAction()
      }
      this.setState({
        isShowView: true,
      })
    }.bind(this)())
  }

  showDrawer = isShow => {
    this.locationView && this.locationView.show(false)
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

  selectAction = ({ data, index, layerInfo }) => {
    if (this.props.selection.length > 0 && index !== this.state.currentIndex) {
      GLOBAL.SelectedSelectionAttribute = {
        index,
        layerInfo,
        data,
      }
      this.setState({
        currentIndex: index,
        currentFieldInfo: data,
      })
    } else {
      GLOBAL.SelectedSelectionAttribute = {
        index: -1,
        layerInfo: {},
        data: [],
      }
      this.setState({
        currentIndex: -1,
        currentFieldInfo: [],
      })
    }
  }

  showUndoView = () => {
    this.popModal && this.popModal.setVisible(true)
  }

  goToSearch = () => {
    NavigationService.navigate('LayerAttributeSearch', {
      layerPath: this.props.selection[this.state.currentTabIndex].layerInfo
        .path,
      isSelection: true,
    })
  }

  onGetAttribute = attributes => {
    // 当数据只有一条时，则默认当前index为0
    if (attributes.data.length === 1 && this.state.currentIndex !== 0) {
      this.setState({
        currentIndex: 0,
        attributes,
      })
    } else if (
      JSON.stringify(this.state.attributes) !== JSON.stringify(attributes)
    ) {
      this.setState({
        attributes,
      })
    }

    // 初始化第一次进入，多行属性界面，跳转到初始化行
    if (
      this.init &&
      this.props.selection.length > 0 &&
      this.props.selection[this.state.currentTabIndex].ids.length > 1 &&
      this.state.currentIndex >= 0
    ) {
      this.init = false
      this.locateToPosition({
        type: 'absolute',
        index: this.state.currentIndex + 1, // currentIndex从0开始，表格序号从1开始
      })
    }
  }

  showLocationView = () => {
    this.locationView && this.locationView.show(true)
  }

  /**
   * 定位到首位
   */
  locateToTop = () => {
    this.currentTabRefs[this.state.currentTabIndex] &&
      this.currentTabRefs[this.state.currentTabIndex].locateToTop(
        ({ currentIndex, currentFieldInfo, layerInfo }) => {
          this.setState({
            currentIndex,
            currentFieldInfo,
          })
          GLOBAL.SelectedSelectionAttribute = {
            index: currentIndex,
            layerInfo,
            data: currentFieldInfo,
          }
          this.locationView && this.locationView.show(false)
        },
      )
  }

  /**
   * 定位到末尾
   */
  locateToBottom = () => {
    this.currentTabRefs[this.state.currentTabIndex] &&
      this.currentTabRefs[this.state.currentTabIndex].locateToBottom(
        ({ currentIndex, currentFieldInfo, layerInfo }) => {
          this.setState({
            currentIndex,
            currentFieldInfo,
          })
          GLOBAL.SelectedSelectionAttribute = {
            index: currentIndex,
            layerInfo,
            data: currentFieldInfo,
          }
          this.locationView && this.locationView.show(false)
        },
      )
  }

  /**
   * 定位到指定位置（相对/绝对 位置）
   * @param data {value, inputValue}
   */
  locateToPosition = (data = {}) => {
    this.currentTabRefs[this.state.currentTabIndex] &&
      this.currentTabRefs[this.state.currentTabIndex].locateToPosition(
        data,
        ({ currentIndex, currentFieldInfo, layerInfo }) => {
          this.setState({
            currentIndex,
            currentFieldInfo,
          })
          GLOBAL.SelectedSelectionAttribute = {
            index: currentIndex,
            layerInfo,
            data: currentFieldInfo,
          }
          this.locationView && this.locationView.show(false)
        },
      )
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

    if (!selection || !selection.data) return

    let objs = []
    for (let i = 0; i < this.props.selection.length; i++) {
      if (this.props.selection[i].layerInfo.name === layerPath) {
        objs.push({
          layerPath: layerPath,
          // ids: [selection.data[0].value],
          ids: [
            selection.data[0].name === 'SmID'
              ? selection.data[0].value
              : selection.data[1].value,
          ], // 多条数据有序号时：0为序号，1为SmID；无序号时0为SmID
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
    SMap.selectObjs(objs).then(data => {
      // TODO 选中对象跳转到地图
      // this.props.navigation && this.props.navigation.navigate('MapView')
      // NavigationService.navigate('MapView')
      NavigationService.goBack()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(
          true,
          ConstToolType.ATTRIBUTE_SELECTION_RELATE,
          {
            isFullScreen: false,
            height: 0,
          },
        )
      GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()

      Utils.setSelectionStyle(this.props.currentLayer.path)
      if (data instanceof Array && data.length > 0) {
        SMap.moveToPoint({
          x: data[0].x,
          y: data[0].y,
        })
      }
    })
  }

  drawerOnChange = ({ index }) => {
    // this.scrollTab && this.scrollTab.goToPage(index)

    if (this.state.currentTabIndex !== index) {
      this.currentTabRefs &&
        this.currentTabRefs[this.state.currentTabIndex].clearSelection()
      let newState = {
        currentTabIndex: index,
      }
      if (this.currentTabRefs[index]) {
        let attributes = this.currentTabRefs[index].getAttributes()
        newState.attributes = attributes
        newState.attributes =
          attributes.data.length === 1 && this.state.currentIndex !== 0 ? 0 : -1
      }

      this.setState(newState)
    }

    let timer = setTimeout(() => {
      this.showDrawer(false)
      clearTimeout(timer)
    }, 1000)
  }

  back = () => {
    if (this.locationView && this.locationView.isShow()) {
      this.locationView.show(false)
      return
    }

    GLOBAL.SelectedSelectionAttribute = null // 清除选择集中当前选中的属性

    NavigationService.goBack()

    GLOBAL.toolBox &&
      GLOBAL.toolBox.showFullMap &&
      GLOBAL.toolBox.showFullMap(true)
    GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE

    GLOBAL.toolBox &&
      GLOBAL.toolBox.setVisible(
        true,
        ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE,
        {
          containerType: 'table',
          column: 3,
          isFullScreen: false,
          height: ConstToolType.HEIGHT[0],
          // cb: () => {
          //   switch (GLOBAL.currentToolbarType) {
          //     case ConstToolType.MAP_TOOL_POINT_SELECT:
          //       SMap.setAction(Action.SELECT)
          //       break
          //     case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
          //       // SMap.selectByRectangle()
          //       SMap.setAction(Action.SELECT_BY_RECTANGLE)
          //       break
          //   }
          // },
        },
      )
  }

  setAttributeHistory = type => {
    this.currentTabRefs[this.state.currentTabIndex] &&
      this.currentTabRefs[this.state.currentTabIndex].setAttributeHistory(type)
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
          // if (
          //   i < this.currentTabRefs.length &&
          //   this.state.currentTabIndex !== i
          // ) {
          //   this.setState({
          //     currentTabIndex: i,
          //   })
          // }
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
              fontSize: 0,
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
        attributesHistory={this.props.attributesHistory}
        setLoading={this.setLoading}
        setCurrentAttribute={this.props.setCurrentAttribute}
        setLayerAttributes={this.props.setLayerAttributes}
        setAttributeHistory={this.props.setAttributeHistory}
        selectAction={this.selectAction}
        onGetAttribute={this.onGetAttribute}
      />
    )
  }

  renderEditControllerView = () => {
    return (
      <View style={[styles.editControllerView, { width: '100%' }]}>
        <MTBtn
          key={'undo'}
          title={'撤销'}
          style={styles.button}
          image={getThemeAssets().publicAssets.icon_undo}
          imageStyle={styles.headerBtn}
          onPress={() => this.setAttributeHistory('undo')}
        />
        <MTBtn
          key={'redo'}
          title={'恢复'}
          style={styles.button}
          image={getThemeAssets().publicAssets.icon_redo}
          imageStyle={styles.headerBtn}
          onPress={() => this.setAttributeHistory('redo')}
        />
        <MTBtn
          key={'revert'}
          title={'还原'}
          style={styles.button}
          image={getThemeAssets().publicAssets.icon_revert}
          imageStyle={styles.headerBtn}
          onPress={() => this.setAttributeHistory('revert')}
        />
        <View style={styles.button} />
      </View>
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
              image={getPublicAssets().common.icon_undo}
              imageStyle={[styles.headerBtn, { marginRight: scaleSize(15) }]}
              onPress={this.showUndoView}
            />,
            <MTBtn
              key={'search'}
              image={getPublicAssets().common.icon_search}
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
          canLocated={this.state.attributes.data.length > 1}
          canRelated={this.state.currentIndex >= 0}
          relateAction={this.relateAction}
          locateAction={this.showLocationView}
        />
        {this.state.isShowView && (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
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
            <LocationView
              ref={ref => (this.locationView = ref)}
              style={styles.locationView}
              currentIndex={
                // this.currentPage * PAGE_SIZE + this.state.currentIndex
                this.state.currentIndex
              }
              locateToTop={this.locateToTop}
              locateToBottom={this.locateToBottom}
              locateToPosition={this.locateToPosition}
            />
          </View>
        )}
        {this.state.isShowDrawer && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.drawerOverlay}
            onPress={() => this.showDrawer(false)}
          />
        )}
        <PopModal
          ref={ref => (this.popModal = ref)}
          modalVisible={this.state.editControllerVisible}
        >
          {this.renderEditControllerView()}
        </PopModal>
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
