/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Container, MTBtn, PopView, Dialog } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import { Toast, scaleSize, StyleUtils } from '../../../../utils'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { color, zIndexLevel } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import DefaultTabBar from './DefaultTabBar'
import { LayerTopBar, DrawerBar, LocationView } from '../../components'
import LayerSelectionAttribute from './LayerSelectionAttribute'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { SMap, Action, GeoStyle } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'

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
    language: string,
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    map: Object,
    selection: Array,
    attributesHistory: Array,
    setCurrentAttribute: () => {},
    setLayerAttributes: () => {},
    setAttributeHistory: () => {},
    clearAttributeHistory: () => {},
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
      canBeUndo: false,
      canBeRedo: false,
      canBeRevert: false,

      isShowSystemFields: true,
    }

    // 选择集中当前选中的属性
    GLOBAL.SelectedSelectionAttribute = selectionAttribute || {
      index: initIndex,
      layerInfo: {},
      data: [],
    }

    this.currentTabRefs = []
    this.init = !!selectionAttribute
    this.backClicked = false
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
    let newState = {}
    // 当数据是一维数组时，则表格只有一条数据，则默认当前index为0
    if (attributes.data.length === 1) {
      // if (attributes.data.length > 0 && !(attributes.data[0] instanceof Array) && this.state.currentIndex !== 0) {
      GLOBAL.SelectedSelectionAttribute = {
        index: 0,
        layerInfo: this.props.selection[this.state.currentTabIndex].layerInfo,
        data: attributes.data[0],
      }
      if (this.state.currentIndex !== 0) newState.currentIndex = 0
    }

    if (JSON.stringify(this.state.attributes) !== JSON.stringify(attributes)) {
      newState.attributes = attributes
    }

    if (Object.keys(newState).length > 0) this.setState(newState)

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

  onGetToolVisible = (toolVisible = {}) => {
    if (
      this.state.canBeUndo !== toolVisible.canBeUndo ||
      this.state.canBeRedo !== toolVisible.canBeRedo ||
      this.state.canBeRevert !== toolVisible.canBeRevert
    ) {
      this.setState({
        ...toolVisible,
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

  /** 删除属性字段 **/
  onAttributeFeildDelete = async fieldInfo => {
    if (!fieldInfo) {
      return
    }
    this.deleteFieldData = fieldInfo
    this.deleteFieldDialog.setDialogVisible(true)
  }
  /** 添加属性字段 **/
  addAttributeField = async fieldInfo => {
    if (this.state.attributes.data.length > 0) {
      if (
        this.state.currentTabIndex >= this.currentTabRefs.length &&
        !this.currentTabRefs[this.state.currentTabIndex]
      )
        return
      let layerPath = this.currentTabRefs[this.state.currentTabIndex].props
        .layerSelection.layerInfo.path
      let result = await SMap.addAttributeFieldInfo(layerPath, true, fieldInfo)
      if (result) {
        Toast.show(
          getLanguage(this.props.language).Prompt.ATTRIBUTE_ADD_SUCCESS,
        )
        this.currentTabRefs[this.state.currentTabIndex].getAttribute(
          {
            type: 'reset',
            currentPage: this.currentTabRefs[this.state.currentTabIndex]
              .currentPage,
            startIndex: 0,
            relativeIndex: 0,
            currentIndex: 0,
          },
          () => {},
        )
      } else {
        Toast.show(getLanguage(this.props.language).Prompt.ATTRIBUTE_ADD_FAILED)
      }
    }
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

    SMap.setLayerEditable(layerPath, false)
    let objs = []
    let geoStyle = new GeoStyle()
    geoStyle.setFillForeColor(0, 255, 0, 0.5)
    geoStyle.setLineWidth(1)
    geoStyle.setLineColor(70, 128, 223)
    geoStyle.setMarkerHeight(5)
    geoStyle.setMarkerWidth(5)
    geoStyle.setMarkerSize(10)
    for (let i = 0; i < this.props.selection.length; i++) {
      if (this.props.selection[i].layerInfo.path === layerPath) {
        objs.push({
          layerPath: layerPath,
          // ids: [selection.data[0].value],
          ids: [
            selection.data[0].name === 'SmID'
              ? selection.data[0].value
              : selection.data[1].value,
          ], // 多条数据有序号时：0为序号，1为SmID；无序号时0为SmID
          style: JSON.stringify(geoStyle),
        })
      } else {
        objs.push({
          layerPath: this.props.selection[i].layerInfo.path,
          ids: [],
        })
      }
    }

    SMap.setAction(Action.PAN)

    SMap.clearSelection().then(() => {
      // SMap.selectObjs(objs).then(data => {
      SMap.setTrackingLayer(objs, true).then(data => {
        // TODO 选中对象跳转到地图
        // this.props.navigation && this.props.navigation.navigate('MapView')
        // NavigationService.navigate('MapView')
        this.props.navigation.goBack()
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

        StyleUtils.setSelectionStyle(
          // this.props.currentLayer.path || objs[0].layerPath,
          layerPath,
        )
        if (data instanceof Array && data.length > 0) {
          SMap.moveToPoint({
            x: data[0].x,
            y: data[0].y,
          })
        }
      })
    })
  }

  drawerOnChange = ({ index }) => {
    if (this.state.currentTabIndex !== index) {
      this.currentTabRefs &&
        this.currentTabRefs[this.state.currentTabIndex] &&
        this.currentTabRefs[this.state.currentTabIndex].clearSelection()
      let newState = {
        currentTabIndex: index,
      }
      let toolVisible = {}
      if (this.currentTabRefs && this.currentTabRefs[index]) {
        let attributes = this.currentTabRefs[index].getAttributes()
        newState.attributes = attributes
        newState.currentIndex = attributes.data.length === 1 ? 0 : -1
        toolVisible = this.currentTabRefs[index].getToolIsViable() || {}
      } else {
        newState.currentIndex = -1
        toolVisible = {
          canBeUndo: false,
          canBeRedo: false,
          canBeRevert: false,
        }
      }
      this.setState(Object.assign(newState, toolVisible))
    }

    let timer = setTimeout(() => {
      this.showDrawer(false)
      clearTimeout(timer)
    }, 1000)
  }

  // 显示/隐藏属性
  showSystemFields = () => {
    this.table && this.table.horizontalScrollToStart()
    this.setState({
      isShowSystemFields: !this.state.isShowSystemFields,
    })
  }

  back = () => {
    if (!this.backClicked) {
      this.backClicked = true
      if (this.locationView && this.locationView.isShow()) {
        this.locationView.show(false)
        this.backClicked = false
        return
      }

      GLOBAL.SelectedSelectionAttribute = null // 清除选择集中当前选中的属性

      NavigationService.goBack()

      GLOBAL.toolBox &&
        GLOBAL.toolBox.showFullMap &&
        GLOBAL.toolBox.showFullMap(true)

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
  }

  setAttributeHistory = type => {
    this.currentTabRefs[this.state.currentTabIndex] &&
      this.currentTabRefs[this.state.currentTabIndex].setAttributeHistory(type)
  }

  //提示是否删除属性字段
  renderDeleteFieldDialog = () => {
    return (
      <Dialog
        ref={ref => (this.deleteFieldDialog = ref)}
        type={'modal'}
        confirmAction={async () => {
          this.deleteFieldDialog.setDialogVisible(false)
          let layerPath = this.currentTabRefs[this.state.currentTabIndex].props
            .layerSelection.layerInfo.path
          let result = await SMap.removeRecordsetFieldInfo(
            layerPath,
            false,
            this.deleteFieldData.name,
          )
          if (result) {
            Toast.show(
              getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_SUCCESS,
            )
            this.props.clearAttributeHistory &&
              this.props.clearAttributeHistory()
            this.currentTabRefs[this.state.currentTabIndex].getAttribute(
              {
                type: 'reset',
                currentPage: this.currentTabRefs[this.state.currentTabIndex]
                  .currentPage,
                startIndex: 0,
                relativeIndex: 0,
                currentIndex: 0,
              },
              () => {},
            )
          } else {
            Toast.show(
              getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_FAILED,
            )
          }
        }}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        opacity={1}
        opacityStyle={[styles.opacityView, { height: scaleSize(250) }]}
        style={[styles.dialogBackground, { height: scaleSize(250) }]}
        cancelAction={() => {
          this.deleteFieldDialog.setDialogVisible(false)
        }}
      >
        <View
          style={{
            paddingTop: scaleSize(30),
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: scaleSize(32),
              color: color.theme_white,
              marginTop: scaleSize(5),
              marginLeft: scaleSize(10),
              marginRight: scaleSize(10),
              textAlign: 'center',
            }}
          >
            {getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_CONFIRM +
              '\n' +
              getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_TIPS}
          </Text>
        </View>
      </Dialog>
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
        // onChangeTab={({ i }) => {
        //   // if (
        //   //   this.state.currentTabIndex < this.currentTabRefs.length &&
        //   //   this.currentTabRefs[this.state.currentTabIndex] &&
        //   //   this.currentTabRefs[this.state.currentTabIndex].selectRow &&
        //   //   typeof this.currentTabRefs[this.state.currentTabIndex].selectRow ===
        //   //     'function'
        //   // ) {
        //   //   this.currentTabRefs[this.state.currentTabIndex].clearSelection()
        //   // }
        //   // if (
        //   //   i < this.currentTabRefs.length &&
        //   //   this.state.currentTabIndex !== i
        //   // ) {
        //   //   this.setState({
        //   //     currentTabIndex: i,
        //   //   })
        //   // }
        //   // GLOBAL.LayerAttributeTabIndex = i
        // }}
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
        onGetToolVisible={this.onGetToolVisible}
        onAttributeFeildDelete={this.onAttributeFeildDelete}
        isShowSystemFields={this.state.isShowSystemFields}
      />
    )
  }

  renderEditControllerView = () => {
    return (
      <View style={[styles.editControllerView, { width: '100%' }]}>
        <MTBtn
          key={'undo'}
          title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_UNDO}
          //{'撤销'}
          style={styles.button}
          textColor={!this.state.canBeUndo && color.contentColorGray}
          image={
            this.state.canBeUndo
              ? getThemeAssets().publicAssets.icon_undo
              : getPublicAssets().attribute.icon_undo_disable
          }
          imageStyle={styles.headerBtn}
          onPress={() => this.setAttributeHistory('undo')}
        />
        <MTBtn
          key={'redo'}
          title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_REDO}
          //{'恢复'}
          style={styles.button}
          image={
            this.state.canBeRedo
              ? getThemeAssets().publicAssets.icon_redo
              : getPublicAssets().attribute.icon_redo_disable
          }
          imageStyle={styles.headerBtn}
          textColor={!this.state.canBeRedo && color.contentColorGray}
          onPress={() => this.setAttributeHistory('redo')}
        />
        <MTBtn
          key={'revert'}
          title={
            getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_REVERT
          }
          //{'还原'}
          style={styles.button}
          textColor={!this.state.canBeRevert && color.contentColorGray}
          image={
            this.state.canBeRevert
              ? getThemeAssets().publicAssets.icon_revert
              : getPublicAssets().attribute.icon_revert_disable
          }
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
          title: getLanguage(this.props.language).Map_Label.ATTRIBUTE,
          navigation: this.props.navigation,
          backAction: this.back,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          headerRight: [
            <MTBtn
              key={'hide'}
              image={
                this.state.isShowSystemFields
                  ? getThemeAssets().attribute.icon_attribute_hide
                  : getThemeAssets().attribute.icon_attribute_show
              }
              imageStyle={[styles.headerBtn, { marginRight: scaleSize(15) }]}
              onPress={this.showSystemFields}
            />,
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
          canAddField={true}
          addFieldAction={this.addAttributeField}
          attributesData={this.state.attributes.head}
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
              language={this.props.language}
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
        <PopView
          ref={ref => (this.popModal = ref)}
          modalVisible={this.state.editControllerVisible}
        >
          {this.renderEditControllerView()}
        </PopView>
        <DrawerBar
          ref={ref => (this.drawer = ref)}
          data={this.props.selection}
          index={this.state.currentTabIndex}
          onChange={this.drawerOnChange}
        />
        {this.renderDeleteFieldDialog()}
      </Container>
    )
  }
}
