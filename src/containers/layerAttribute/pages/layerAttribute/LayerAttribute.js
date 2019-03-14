/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, Text, Platform, BackHandler } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container, MTBtn, PopModal } from '../../../../components'
import { Toast, scaleSize } from '../../../../utils'
import { ConstInfo, MAP_MODULE, ConstToolType } from '../../../../constants'
import { MapToolbar } from '../../../workspace/components'
import constants from '../../../workspace/constants'
import {
  LayerAttributeTable,
  LayerTopBar,
  LocationView,
} from '../../components'
import { LayerUtil } from '../../utils'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import styles from './styles'
import { SMap, Action } from 'imobile_for_reactnative'
const SINGLE_ATTRIBUTE = 'singleAttribute'
export default class LayerAttribute extends React.Component {
  props: {
    nav: Object,
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    selection: Object,
    map: Object,
    attributesHistory: Array,
    // attributes: Object,
    // setAttributes: () => {},
    setCurrentAttribute: () => {},
    // getAttributes: () => {},
    setLayerAttributes: () => {},
    setAttributeHistory: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params && params.type
    this.state = {
      attributes: {
        head: [],
        data: [],
      },
      showTable: false,
      editControllerVisible: false,
      currentIndex: -1,

      canBeUndo: false,
      canBeRedo: false,
      canBeRevert: false,
    }

    this.currentPage = 0
    this.pageSize = 20
    this.isInit = true
    this.noMore = false
    this.isLoading = false // 防止同时重复加载多次
  }

  componentDidMount() {
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', this.back)
    this.setLoading(true, ConstInfo.LOADING_DATA)
    this.refresh()
  }

  componentDidUpdate(prevProps) {
    // let mapTabs = this.props.nav.routes[this.props.nav.index]
    if (
      JSON.stringify(prevProps.currentLayer) !==
      JSON.stringify(this.props.currentLayer)
      // || (mapTabs.routes &&
      //   mapTabs.routes[mapTabs.index].key === 'LayerAttribute' &&
      //   JSON.stringify(this.props.nav) !== JSON.stringify(prevProps.nav))
    ) {
      this.refresh(null, true)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.back)
    }
    this.props.setCurrentAttribute({})
  }

  /** 下拉刷新 **/
  refresh = (cb = () => {}, resetCurrent = false) => {
    this.currentPage = 0
    this.noMore = false
    this.getAttribute(cb, resetCurrent)
  }

  /** 加载更多 **/
  loadMore = (cb = () => {}) => {
    if (this.isLoading) return
    if (this.noMore) {
      cb && cb()
      return
    }
    this.isLoading = true
    this.currentPage += 1
    this.getAttribute(attributes => {
      cb && cb()
      this.isLoading = false
      if (!attributes || !attributes.data || attributes.data.length <= 0) {
        this.noMore = true
        Toast.show(ConstInfo.ALL_DATA_ALREADY_LOADED)
        // this.currentPage--
      }
    })
  }

  /**
   * 获取属性
   * @param cb 回调函数
   * @param resetCurrent 是否重置当前选择的对象
   */
  getAttribute = (cb = () => {}, resetCurrent = false) => {
    if (!this.props.currentLayer.path) return
    let attributes = {}
    ;(async function() {
      try {
        // attributes = await SMap.getLayerAttribute({
        //   path: this.props.currentLayer.path,
        //   page: this.currentPage,
        //   size: this.pageSize,
        // })
        attributes = await LayerUtil.getLayerAttribute(
          JSON.parse(JSON.stringify(this.state.attributes)),
          this.props.currentLayer.path,
          this.currentPage,
          this.pageSize,
        )
        if (
          attributes.data.length === this.state.attributes.data.length ||
          attributes.data.length < 20
        ) {
          this.noMore = true
        }
        let currentIndex =
          attributes.data.length === 1
            ? 0
            : resetCurrent
              ? -1
              : this.state.currentIndex
        if (attributes.data.length === 1) {
          this.setState({
            showTable: true,
            attributes,
            currentIndex: currentIndex,
            currentFieldInfo: attributes.data[0],
          })
        } else {
          this.setState({
            showTable: true,
            attributes,
            currentIndex: currentIndex,
          })
        }
        this.setState({
          showTable: true,
          attributes,
          currentIndex: currentIndex,
        })
        this.setLoading(false)
        cb && cb(attributes)
      } catch (e) {
        this.isLoading = false
        this.setLoading(false)
        cb && cb(attributes)
      }
    }.bind(this)())
  }

  selectRow = ({ data, index }) => {
    if (!data || index < 0) return

    if (this.state.currentIndex !== index) {
      this.setState({
        currentFieldInfo: data,
        currentIndex: index,
      })
    } else {
      this.setState({
        currentFieldInfo: [],
        currentIndex: -1,
      })
    }
  }

  /** 属性定位 **/
  locateAction = () => {}

  /** 关联事件 **/
  relateAction = () => {
    SMap.setAction(Action.PAN)
    SMap.selectObj(this.props.currentLayer.path, [
      this.state.currentFieldInfo[0].value,
    ]).then(() => {
      this.props.navigation && this.props.navigation.navigate('MapView')
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.ATTRIBUTE_RELATE, {
          isFullScreen: false,
          height: 0,
        })
      GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
    })
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setSaveViewVisible = visible => {
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, this.setLoading)
  }

  /** 修改表格中的值的回调 **/
  changeAction = data => {
    if (
      this.props.setLayerAttributes &&
      typeof this.props.setLayerAttributes === 'function'
    ) {
      // 单个对象属性和多个对象属性数据有区别，单个属性cellData是值
      let isSingleData = typeof data.cellData !== 'object'
      this.props
        .setLayerAttributes([
          {
            mapName: this.props.map.currentMap.name,
            layerPath: this.props.currentLayer.path,
            fieldInfo: [
              {
                name: isSingleData ? data.rowData.name : data.cellData.name,
                value: data.value,
                index: data.index,
                columnIndex: data.columnIndex,
              },
            ],
            prevData: [
              {
                name: isSingleData ? data.rowData.name : data.cellData.name,
                value: isSingleData ? data.rowData.value : data.cellData.value,
                index: data.index,
                columnIndex: data.columnIndex,
              },
            ],
            params: {
              // index: int,      // 当前对象所在记录集中的位置
              filter: `SmID=${
                isSingleData
                  ? this.state.attributes.data[0][0].value
                  : data.rowData[0].value
              }`, // 过滤条件
              cursorType: 2, // 2: DYNAMIC, 3: STATIC
            },
          },
        ])
        .then(result => {
          if (!isSingleData && result) {
            // 成功修改属性后，更新数据
            let attributes = JSON.parse(JSON.stringify(this.state.attributes))
            attributes.data[data.index][data.columnIndex].value = data.value
            let checkData = this.checkToolIsViable()
            this.setState({
              attributes,
              ...checkData,
            })
          }
        })
    }
  }

  /** 检测撤销/恢复/还原是否可用 **/
  checkToolIsViable = () => {
    let historyObj
    for (let i = 0; i < this.props.attributesHistory.length; i++) {
      if (
        this.props.attributesHistory[i].mapName ===
        this.props.map.currentMap.name
      ) {
        let layerHistory = this.props.attributesHistory[i].layers
        for (let j = 0; j < layerHistory.length; j++) {
          if (layerHistory[j].layerPath === this.props.currentLayer.path) {
            historyObj = layerHistory[j]
            break
          }
        }
        break
      }
    }

    return {
      canBeUndo:
        historyObj &&
        historyObj.history.length > 0 &&
        historyObj.currentIndex < historyObj.history.length - 1,
      canBeRedo:
        historyObj &&
        historyObj.history.length > 0 &&
        historyObj.currentIndex > 0,
      canBeRevert:
        historyObj &&
        historyObj.history.length > 0 &&
        historyObj.currentIndex < historyObj.history.length - 1 &&
        !(historyObj.history[historyObj.currentIndex + 1] instanceof Array),
    }
  }

  setAttributeHistory = async type => {
    if (!type) return
    switch (type) {
      case 'undo':
        if (!this.state.canBeUndo) {
          Toast.show('已经无法回撤')
          return
        }
        break
      case 'redo':
        if (!this.state.canBeRedo) {
          Toast.show('已经无法恢复')
          return
        }
        break
      case 'revert':
        if (!this.state.canBeRevert) {
          Toast.show('已经无法还原')
          return
        }
        break
    }
    this.setLoading(true, '修改中')
    try {
      this.props.setAttributeHistory &&
        (await this.props
          .setAttributeHistory({
            mapName: this.props.map.currentMap.name,
            layerPath: this.props.currentLayer.path,
            type,
          })
          .then(({ msg, result, data }) => {
            Toast.show(msg)
            if (result) {
              let attributes = JSON.parse(JSON.stringify(this.state.attributes))

              if (data.length === 1) {
                let fieldInfo = data[0].fieldInfo
                if (
                  attributes.data[fieldInfo[0].index][fieldInfo[0].columnIndex]
                    .name === fieldInfo[0].name &&
                  attributes.data[fieldInfo[0].index][fieldInfo[0].columnIndex]
                    .value === fieldInfo[0].value
                ) {
                  this.setAttributeHistory(type)
                  return
                }
              }

              for (let i = 0; i < data.length; i++) {
                let fieldInfo = data[i].fieldInfo
                for (let j = 0; j < fieldInfo.length; j++) {
                  if (
                    attributes.data[fieldInfo[j].index][
                      fieldInfo[j].columnIndex
                    ].name === fieldInfo[j].name
                  ) {
                    attributes.data[fieldInfo[j].index][
                      fieldInfo[j].columnIndex
                    ].value = fieldInfo[j].value
                  }
                }
              }
              let checkData = this.checkToolIsViable()
              this.setState(
                {
                  attributes,
                  ...checkData,
                },
                () => {
                  this.setLoading(false)
                },
              )
            } else {
              this.setLoading(false)
            }
          }))
    } catch (e) {
      this.setLoading(false)
    }
  }

  showUndoView = () => {
    this.popModal && this.popModal.setVisible(true)
  }

  showLocationView = () => {
    this.locationView && this.locationView.show(true)
  }

  locateToTop = () => {}

  locateToBottom = () => {}

  goToSearch = () => {
    NavigationService.navigate('LayerAttributeSearch', {
      layerPath: this.props.currentLayer.path,
    })
  }

  back = () => {
    if (this.type === 'MAP_3D') {
      this.props.navigation.navigate('Map3D')
    } else {
      this.props.navigation.navigate('MapView')
    }
    return true
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        initIndex={2}
        type={this.type}
      />
    )
  }

  renderMapLayerAttribute = () => {
    if (
      !this.state.attributes ||
      (!this.state.attributes.data && this.state.attributes.data.length === 0)
    )
      return null
    return (
      <LayerAttributeTable
        ref={ref => (this.table = ref)}
        data={
          this.state.attributes.data.length > 1
            ? this.state.attributes.data
            : this.state.attributes.data[0]
        }
        tableHead={
          this.state.attributes.data.length > 1
            ? this.state.attributes.head
            : ['名称', '属性值']
        }
        widthArr={this.state.attributes.data.length === 1 && [100, 100]}
        type={
          this.state.attributes.data.length > 1
            ? LayerAttributeTable.Type.MULTI_DATA
            : LayerAttributeTable.Type.SINGLE_DATA
        }
        // indexColumn={this.state.attributes.data.length > 1 ? 0 : -1}
        indexColumn={0}
        hasIndex={this.state.attributes.data.length > 1}
        hasInputText={this.state.attributes.data.length > 1}
        selectRow={this.selectRow}
        refresh={cb => this.refresh(cb)}
        loadMore={cb => this.loadMore(cb)}
        changeAction={this.changeAction}
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
    let title = ''
    switch (GLOBAL.Type) {
      case constants.COLLECTION:
        title = MAP_MODULE.MAP_COLLECTION
        break
      case constants.MAP_EDIT:
        title = MAP_MODULE.MAP_EDIT
        break
      case constants.MAP_3D:
        title = MAP_MODULE.MAP_3D
        break
      case constants.MAP_THEME:
        title = MAP_MODULE.MAP_THEME
        break
      case constants.MAP_PLOTTING:
        title = MAP_MODULE.MAP_PLOTTING
        break
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: title,
          navigation: this.props.navigation,
          // backAction: this.back,
          // backImg: require('../../../../assets/mapTools/icon_close.png'),
          withoutBack: true,
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
        // bottomBar={this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()}
        style={styles.container}
      >
        <LayerTopBar
          canRelated={this.state.currentIndex >= 0}
          locateAction={this.showLocationView}
          relateAction={this.relateAction}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          {this.state.showTable &&
          this.state.attributes &&
          this.state.attributes.head ? (
              this.state.attributes.head.length > 0 ? (
                this.renderMapLayerAttribute()
              ) : (
                <View style={styles.infoView}>
                  <Text style={styles.info}>请选择图层对象</Text>
                </View>
              )
            ) : (
              <View style={styles.infoView}>
                <Text style={styles.info}>
                  {this.props.currentLayer.path ? '请选择图层' : '该图层属性为空'}
                </Text>
              </View>
            )}
          {this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()}
          <LocationView
            ref={ref => (this.locationView = ref)}
            style={styles.locationView}
            currentIndex={this.state.currentIndex}
            locateToTop={this.locateToTop}
            locateToBottom={this.locateToBottom}
          />
        </View>
        <PopModal
          ref={ref => (this.popModal = ref)}
          modalVisible={this.state.editControllerVisible}
        >
          {this.renderEditControllerView()}
        </PopModal>
      </Container>
    )
  }
}
