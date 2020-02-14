/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, InteractionManager, Text } from 'react-native'
import NavigationService from '../../../NavigationService'
import {
  Container,
  MTBtn,
  PopView,
  InfoView,
  Dialog,
} from '../../../../components'
import {
  Toast,
  scaleSize,
  LayerUtils,
  StyleUtils,
  screen,
} from '../../../../utils'
import { ConstInfo, ConstToolType, getHeaderTitle } from '../../../../constants'
import { MapToolbar } from '../../../workspace/components'
import {
  LayerAttributeTable,
  LayerTopBar,
  LocationView,
} from '../../components'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import styles from './styles'
import {
  SMap,
  Action,
  GeoStyle,
  SMediaCollector,
  FieldType,
  DatasetType,
} from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import { color, size } from '../../../../styles'
import constants from '../../../workspace/constants'
//eslint-disable-next-line
import { ActionPopover } from 'teaset'

const SINGLE_ATTRIBUTE = 'singleAttribute'
const PAGE_SIZE = 30
const ROWS_LIMIT = 120
const COL_HEIGHT = scaleSize(80)

let deleteFieldData //删除属性字段

export default class LayerAttribute extends React.Component {
  props: {
    language: string,
    nav: Object,
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    selection: Object,
    map: Object,
    appConfig: Object,
    attributesHistory: Array,
    attributes: Object, // 此时用于3D属性
    // setAttributes: () => {},
    setCurrentAttribute: () => {},
    // getAttributes: () => {},
    setLayerAttributes: () => {},
    setAttributeHistory: () => {},
    clearAttributeHistory: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = (params && params.type) || GLOBAL.Type
    let checkData = this.checkToolIsViable()
    this.state = {
      attributes: {
        head: [],
        data: [],
      },
      showTable: false,
      editControllerVisible: false,
      currentFieldInfo: [],
      relativeIndex: -1, // 当前页面从startIndex开始的被选中的index, 0 -> this.total - 1
      currentIndex: -1,
      startIndex: 0,

      canBeUndo: checkData.canBeUndo,
      canBeRedo: checkData.canBeRedo,
      canBeRevert: checkData.canBeRevert,

      isShowSystemFields: true,
    }

    this.currentPage = 0
    this.total = 0 // 属性总数
    this.canBeRefresh = true // 是否可以刷新
    this.noMore = false // 是否可以加载更多
    this.isLoading = false // 防止同时重复加载多次
    this.filter = '' // 属性查询过滤
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (this.type === 'MAP_3D') {
        this.getMap3DAttribute()
      } else {
        this.setLoading(true, getLanguage(this.props.language).Prompt.LOADING)
        //ConstInfo.LOADING_DATA)
        this.refresh()
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (
      this.type === 'MAP_3D' &&
      this.state.attributes !== prevProps.attributes
    ) {
      this.setState({
        attributes: prevProps.attributes,
      })
      // console.log(prevProps)
    } else if (
      prevProps.currentLayer &&
      JSON.stringify(prevProps.currentLayer) !==
        JSON.stringify(this.props.currentLayer)
    ) {
      this.filter = ''
      // 切换图层，重置属性界面
      this.currentPage = 0
      this.total = 0 // 属性总数
      this.canBeRefresh = false
      this.noMore = false
      this.refresh(null, true)
    } else if (
      JSON.stringify(prevProps.attributesHistory) !==
      JSON.stringify(this.props.attributesHistory)
    ) {
      let checkData = this.checkToolIsViable()
      this.setState({
        ...checkData,
      })
    } else if (GLOBAL.NEEDREFRESHTABLE) {
      GLOBAL.NEEDREFRESHTABLE = false
      let startIndex = this.state.startIndex - PAGE_SIZE
      if (startIndex <= 0) {
        startIndex = 0
        this.canBeRefresh = false
      }
      let currentPage = startIndex / PAGE_SIZE
      // this.noMore = false
      this.getAttribute({
        type: 'reset',
        currentPage: currentPage,
        startIndex: startIndex <= 0 ? 0 : startIndex,
      })
    }
  }

  componentWillUnmount() {
    this.props.setCurrentAttribute({})
  }

  getMap3DAttribute = async (cb = () => {}) => {
    !this.state.showTable &&
      this.setState({
        showTable: true,
        attributes: this.props.attributes,
      })
    cb && cb()
  }

  /** 下拉刷新 **/
  refresh = (cb = () => {}, resetCurrent = false) => {
    if (!this.canBeRefresh) {
      //Toast.show('已经是最新的了')
      this.getAttribute(
        {
          type: 'reset',
          currentPage: 0,
          startIndex: 0,
        },
        cb,
        resetCurrent,
      )
      this.currentPage = 0
      return
    }
    let startIndex = this.state.startIndex - PAGE_SIZE
    if (startIndex <= 0) {
      startIndex = 0
      this.canBeRefresh = false
    }
    let currentPage = startIndex / PAGE_SIZE
    // this.noMore = false
    this.getAttribute(
      {
        type: 'refresh',
        currentPage: currentPage,
        startIndex: startIndex <= 0 ? 0 : startIndex,
      },
      cb,
      resetCurrent,
    )
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
    this.getAttribute(
      {
        type: 'loadMore',
        currentPage: this.currentPage,
      },
      attributes => {
        cb && cb()
        this.isLoading = false
        this.canBeRefresh = this.state.startIndex > 0
        if (!attributes || !attributes.data || attributes.data.length <= 0) {
          this.noMore = true
          Toast.show(ConstInfo.ALL_DATA_ALREADY_LOADED)
          // this.currentPage--
        }
      },
    )
  }

  /**
   * 获取属性
   * @param params 参数
   * @param cb 回调函数
   * @param resetCurrent 是否重置当前选择的对象
   */
  getAttribute = (params = {}, cb = () => {}, resetCurrent = false) => {
    if (!this.props.currentLayer.path || params.currentPage < 0) {
      this.setLoading(false)
      return
    }
    let { currentPage, pageSize, type, ...others } = params
    let result = {},
      attributes = {}
    ;(async function() {
      try {
        let checkData = this.checkToolIsViable()
        result = await LayerUtils.getLayerAttribute(
          JSON.parse(JSON.stringify(this.state.attributes)),
          this.props.currentLayer.path,
          currentPage,
          pageSize !== undefined ? pageSize : PAGE_SIZE,
          {
            filter: this.filter,
          },
          type,
        )

        this.total = result.total || 0
        attributes = result.attributes || []

        // this.noMore =
        //   Math.floor(this.total / PAGE_SIZE) === currentPage ||
        //   attributes.data.length < PAGE_SIZE

        if (attributes.data.length === 1) {
          this.setState({
            showTable: true,
            attributes,
            currentIndex: 0,
            relativeIndex: 0,
            currentFieldInfo: attributes.data[0],
            startIndex: 0,
            ...checkData,
            ...others,
          })
          this.setLoading(false)
        } else {
          let newAttributes = JSON.parse(JSON.stringify(attributes))
          let startIndex =
            others.startIndex >= 0
              ? others.startIndex
              : this.state.startIndex || 0
          // 截取数据，最多显示 ROWS_LIMIT 行
          if (attributes.data.length > ROWS_LIMIT) {
            if (type === 'refresh') {
              newAttributes.data = newAttributes.data.slice(0, ROWS_LIMIT)
              startIndex = result.startIndex
            } else {
              startIndex = result.startIndex + result.resLength - ROWS_LIMIT
              startIndex =
                parseInt((startIndex / PAGE_SIZE).toFixed()) * PAGE_SIZE

              let sliceStartIndex = 0
              if (attributes.data.length >= ROWS_LIMIT) {
                sliceStartIndex =
                  parseInt(
                    (
                      (attributes.data.length - ROWS_LIMIT) /
                      PAGE_SIZE
                    ).toFixed(),
                  ) * PAGE_SIZE
              }
              newAttributes.data = newAttributes.data.slice(
                sliceStartIndex,
                attributes.data.length,
              )
            }
          }

          let currentIndex = resetCurrent
            ? -1
            : others.currentIndex !== undefined
              ? others.currentIndex
              : this.state.currentIndex
          let relativeIndex =
            resetCurrent || currentIndex < 0 ? -1 : currentIndex - startIndex
          // : currentIndex - startIndex - 1
          let prevStartIndex = this.state.startIndex
          this.currentPage = Math.floor(
            (startIndex + newAttributes.data.length - 1) / PAGE_SIZE,
          )
          this.noMore = startIndex + newAttributes.data.length === this.total
          this.setState(
            {
              showTable: true,
              attributes: newAttributes,
              currentIndex,
              relativeIndex,
              currentFieldInfo:
                relativeIndex >= 0 && relativeIndex < newAttributes.data.length
                  ? newAttributes.data[relativeIndex]
                  : this.state.currentFieldInfo,
              startIndex,
              ...checkData,
              // ...others,
            },
            () => {
              setTimeout(() => {
                if (type === 'refresh') {
                  this.table &&
                    this.table.scrollToLocation({
                      animated: false,
                      itemIndex: prevStartIndex - startIndex,
                      sectionIndex: 0,
                      viewPosition: 0,
                      viewOffset: COL_HEIGHT,
                    })
                } else if (type === 'loadMore') {
                  this.table &&
                    this.table.scrollToLocation({
                      animated: false,
                      itemIndex: newAttributes.data.length - result.resLength,
                      sectionIndex: 0,
                      viewPosition: 1,
                    })
                }
                this.setLoading(false)
                cb && cb(attributes)
              }, 0)
            },
          )
        }
      } catch (e) {
        this.isLoading = false
        this.setLoading(false)
        cb && cb(attributes)
      }
    }.bind(this)())
  }

  /**
   * 定位到首位
   */
  locateToTop = () => {
    this.setLoading(true, getLanguage(global.language).Prompt.LOCATING)
    //ConstInfo.LOCATING)
    this.currentPage = 0
    if (this.state.startIndex === 0) {
      this.setState(
        {
          relativeIndex: 0,
          currentIndex: 0,
        },
        () => {
          this.table.setSelected(0, false)
          this.locationView && this.locationView.show(false)
          this.table &&
            this.table.scrollToLocation({
              animated: false,
              itemIndex: 0,
              sectionIndex: 0,
              viewPosition: 0,
            })
          this.setLoading(false)
        },
      )
    } else {
      this.getAttribute(
        {
          type: 'reset',
          currentPage: this.currentPage,
          startIndex: 0,
          relativeIndex: 0,
          currentIndex: 0,
        },
        () => {
          // 等表格中的数据变化
          setTimeout(() => {
            let item = this.table.setSelected(0, false)
            this.setState({
              currentFieldInfo: item.data,
            })
            this.locationView && this.locationView.show(false)
            this.canBeRefresh = false
            this.table &&
              this.table.scrollToLocation({
                animated: false,
                itemIndex: 0,
                sectionIndex: 0,
                viewPosition: 0,
              })
            this.setLoading(false)
          }, 0)
        },
      )
    }
  }

  /**
   * 定位到末尾
   */
  locateToBottom = () => {
    if (this.total <= 0) return
    this.setLoading(true, getLanguage(global.language).Prompt.LOCATING)
    //ConstInfo.LOCATING)
    this.currentPage =
      this.total > 0 ? Math.floor((this.total - 1) / PAGE_SIZE) : 0
    let remainder = this.total > 0 ? (this.total - 1) % PAGE_SIZE : 0

    let startIndex = this.currentPage * PAGE_SIZE
    if (startIndex !== 0) {
      this.canBeRefresh = true
    }
    this.noMore = true

    this.getAttribute(
      {
        type: 'reset',
        currentPage: this.currentPage,
        startIndex: startIndex,
        relativeIndex: remainder,
        currentIndex: this.total - 1,
      },
      () => {
        // 等表格中的数据变化
        setTimeout(() => {
          if (this.table) {
            let item = this.table.setSelected(remainder, false)
            this.setState({
              currentFieldInfo: item.data,
            })
            this.table &&
              this.table.scrollToLocation({
                animated: false,
                itemIndex: remainder,
                sectionIndex: 0,
                viewOffset: 0,
                viewPosition: 1,
              })
          }
          this.setLoading(false)
        }, 100)
      },
    )
    this.locationView && this.locationView.show(false)
  }

  /**
   * 定位到指定位置（相对/绝对 位置）
   * @param data {value, inputValue}
   */
  locateToPosition = (data = {}) => {
    let viewPosition = 0,
      relativeIndex,
      currentIndex,
      startIndex = this.state.startIndex,
      isInViewableData = false
    if (data.type === 'relative') {
      // 相对定位
      currentIndex = this.state.currentIndex + data.index
      if (currentIndex < 0 || currentIndex >= this.total) {
        Toast.show(getLanguage(global.language).Prompt.INDEX_OUT_OF_BOUNDS)
        //'位置越界')
        return
      }
      this.currentPage = Math.floor(currentIndex / PAGE_SIZE)

      if (
        currentIndex >= this.state.startIndex &&
        currentIndex < this.state.startIndex + this.state.attributes.data.length
      ) {
        // 定位在当前显示数据范围内
        relativeIndex = this.state.relativeIndex + data.index
        isInViewableData = true
      } else {
        // 定位在当前显示数据范围外
        startIndex = this.currentPage * PAGE_SIZE
        relativeIndex = currentIndex - startIndex
      }
    } else if (data.type === 'absolute') {
      // 绝对定位
      if (data.index <= 0 || data.index > this.total) {
        Toast.show(getLanguage(global.language).Prompt.INDEX_OUT_OF_BOUNDS)
        //'位置越界')
        return
      }
      this.currentPage = Math.floor((data.index - 1) / PAGE_SIZE)
      if (
        data.index >= this.state.startIndex + 1 &&
        data.index < this.state.startIndex + this.state.attributes.data.length
      ) {
        // 定位在当前显示数据范围内
        relativeIndex = data.index - 1 - this.state.startIndex
        isInViewableData = true
      } else {
        // 定位在当前显示数据范围外
        startIndex = this.currentPage * PAGE_SIZE
        relativeIndex = data.index - 1 - startIndex
      }
      currentIndex = data.index - 1
    }

    this.setLoading(true, getLanguage(global.language).Prompt.LOCATING)
    //ConstInfo.LOCATING)
    if (startIndex !== 0) {
      this.canBeRefresh = true
    }

    if (isInViewableData) {
      let item = this.table.setSelected(relativeIndex, false)
      this.setState(
        {
          currentFieldInfo: item.data,
          startIndex: startIndex,
          relativeIndex: relativeIndex,
          currentIndex,
        },
        () => {
          this.table &&
            this.table.scrollToLocation({
              animated: false,
              itemIndex: relativeIndex,
              sectionIndex: 0,
              viewPosition: viewPosition,
              viewOffset: viewPosition === 1 ? 0 : undefined, // 滚动显示在底部，不需要设置offset
            })
        },
      )
      this.setLoading(false)
    } else {
      this.getAttribute(
        {
          type: 'reset',
          currentPage: this.currentPage,
          startIndex: startIndex,
          relativeIndex: relativeIndex,
          currentIndex,
        },
        () => {
          if (this.table) {
            setTimeout(() => {
              // 避免 Android 更新数据后无法滚动
              let item = this.table.setSelected(relativeIndex, false)
              this.setState(
                {
                  currentFieldInfo: item.data,
                },
                () => {
                  this.table &&
                    this.table.scrollToLocation({
                      animated: false,
                      itemIndex: relativeIndex,
                      sectionIndex: 0,
                      viewPosition: viewPosition,
                      viewOffset: viewPosition === 1 ? 0 : undefined, // 滚动显示在底部，不需要设置offset
                    })
                },
              )
            }, 0)
          }
          this.setLoading(false)
        },
      )
    }
  }

  selectRow = ({ data, index }) => {
    if (!data || index < 0 || this.state.attributes.data.length === 1) return

    if (this.state.relativeIndex !== index) {
      this.setState({
        currentFieldInfo: data,
        relativeIndex: index,
        currentIndex: this.state.startIndex + index,
      })
    } else {
      this.setState({
        currentFieldInfo: [],
        relativeIndex: -1,
        currentIndex: -1,
      })
    }
  }

  //显示详情和删除的弹框
  _showPopover = (pressView, index, fieldInfo) => {
    let items = []

    items = [
      {
        title: getLanguage(global.language).Map_Attribute.DETAIL,
        onPress: () => {
          (async function() {
            NavigationService.navigate('LayerAttributeAdd', {
              defaultParams: { fieldInfo },
              isDetail: true,
            })
          }.bind(this)())
        },
      },
    ]
    if (this.state.attributes.data.length > 1) {
      items.push({
        title: getLanguage(global.language).Map_Attribute.ASCENDING,
        onPress: () => {
          this.canBeRefresh = true
          this.filter = fieldInfo.name + ' ASC'
          this.getAttribute({
            type: 'reset',
            currentPage: 0,
            startIndex: 0,
          })
        },
      })
      items.push({
        title: getLanguage(global.language).Map_Attribute.DESCENDING,
        onPress: () => {
          this.canBeRefresh = true
          this.filter = fieldInfo.name + ' DESC'
          this.getAttribute({
            type: 'reset',
            currentPage: 0,
            startIndex: 0,
          })
        },
      })
    }
    let tempStr = fieldInfo.caption.toLowerCase()
    let isSystemField = tempStr.substring(0, 2) === 'sm'
    if (!fieldInfo.isSystemField && !isSystemField) {
      items.push({
        title: getLanguage(global.language).Profile.DELETE,
        onPress: () => {
          if (!fieldInfo) {
            return
          }
          deleteFieldData = fieldInfo
          this.deleteFieldDialog.setDialogVisible(true)
        },
      })
    }
    if (
      this.state.attributes.data.length > 1 &&
      (fieldInfo.type === FieldType.INT16 ||
        fieldInfo.type === FieldType.INT32 ||
        fieldInfo.type === FieldType.INT64 ||
        fieldInfo.type === FieldType.SINGLE ||
        fieldInfo.type === FieldType.DOUBLE)
    ) {
      items.push({
        title: getLanguage(global.language).Map_Attribute.ATTRIBUTE_STATISTIC,
        onPress: () => {
          NavigationService.navigate('LayerAttributeStatistic', {
            fieldInfo,
            layer: this.props.currentLayer,
          })
        },
      })
    }
    if (pressView) {
      pressView.measure((ox, oy, width, height, px, py) => {
        let screenWidth = screen.getScreenWidth(),
          allWidth = width * items.length
        // let dx = screenWidth - allWidth / 2 + width / 2
        // let x = px > dx ? dx : px
        let option = {}
        if (px > screenWidth - allWidth / 2 + width / 2) {
          option.direction = 'left'
        }
        ActionPopover.show(
          {
            x: px,
            y: py,
            width,
            height,
          },
          items,
          option,
        )
      })
    }
  }
  /** 点击属性字段回调 **/
  onPressHeader = ({ fieldInfo, index, pressView }) => {
    if (GLOBAL.Type === ConstToolType.MAP_3D) {
      return
    }
    this._showPopover(pressView, index, fieldInfo)
  }

  /** 添加属性字段 **/
  addAttributeField = async fieldInfo => {
    let path = this.props.currentLayer.path
    let result = await SMap.addAttributeFieldInfo(path, false, fieldInfo)
    if (result) {
      Toast.show(getLanguage(this.props.language).Prompt.ATTRIBUTE_ADD_SUCCESS)
      this.refresh()
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.ATTRIBUTE_ADD_FAILED)
    }
  }

  /** 关联事件 **/
  relateAction = () => {
    if (this.state.currentFieldInfo.length === 0) return
    SMap.setAction(Action.PAN)
    SMap.setLayerEditable(this.props.currentLayer.path, false)
    let geoStyle = new GeoStyle()
    geoStyle.setFillForeColor(0, 255, 0, 0.5)
    geoStyle.setLineWidth(1)
    geoStyle.setLineColor(70, 128, 223)
    geoStyle.setMarkerHeight(5)
    geoStyle.setMarkerWidth(5)
    geoStyle.setMarkerSize(10)
    SMap.setTrackingLayer(
      [
        {
          layerPath: this.props.currentLayer.path,
          ids: [this.state.currentFieldInfo[0].value],
          style: JSON.stringify(geoStyle),
        },
      ],
      true,
    ).then(data => {
      this.props.navigation &&
        this.props.navigation.navigate('MapView', {
          hideMapController: true,
        })
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.ATTRIBUTE_RELATE, {
          isFullScreen: false,
          height: 0,
        })
      GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
      if (GLOBAL.Type === constants.MAP_AR && GLOBAL.showAIDetect) {
        GLOBAL.toolBox && GLOBAL.toolBox.switchAr()
      }

      StyleUtils.setSelectionStyle(this.props.currentLayer.path)
      if (data instanceof Array && data.length > 0) {
        SMap.moveToPoint({
          x: data[0].x,
          y: data[0].y,
        })
      }
    })
    // SMap.selectObj(this.props.currentLayer.path, [
    //   this.state.currentFieldInfo[0].value,
    // ]).then(data => {
    //   this.props.navigation && this.props.navigation.navigate('MapView')
    //   GLOBAL.toolBox &&
    //     GLOBAL.toolBox.setVisible(true, ConstToolType.ATTRIBUTE_RELATE, {
    //       isFullScreen: false,
    //       height: 0,
    //     })
    //   GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
    //
    //   StyleUtils.setSelectionStyle(this.props.currentLayer.path)
    //   if (data instanceof Array && data.length > 0) {
    //     SMap.moveToPoint({
    //       x: data[0].x,
    //       y: data[0].y,
    //     })
    //   }
    // })
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
      let isSingleData = this.state.attributes.data.length === 1
      // 单个对象属性 在 隐藏系统字段下，要重新计算index
      if (isSingleData && !this.state.isShowSystemFields) {
        for (let index in this.state.attributes.data[0]) {
          if (this.state.attributes.data[0][index].name === data.rowData.name) {
            data.index = index
          }
        }
      }
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
                smID: isSingleData
                  ? this.state.attributes.data[0][0].value
                  : data.rowData[1].value,
              },
            ],
            prevData: [
              {
                name: isSingleData ? data.rowData.name : data.cellData.name,
                value: isSingleData ? data.rowData.value : data.cellData.value,
                index: data.index,
                columnIndex: data.columnIndex,
                smID: isSingleData
                  ? this.state.attributes.data[0][0].value
                  : data.rowData[1].value,
              },
            ],
            params: {
              // index: int,      // 当前对象所在记录集中的位置
              filter: `SmID=${
                isSingleData
                  ? this.state.attributes.data[0][0].value
                  : data.rowData[1].value // 0为序号
              }`, // 过滤条件
              cursorType: 2, // 2: DYNAMIC, 3: STATIC
            },
          },
        ])
        .then(result => {
          // if (!isSingleData && result) {
          if (result) {
            // 成功修改属性后，更新数据
            let attributes = JSON.parse(JSON.stringify(this.state.attributes))
            // 如果有序号，column.index要 -1
            // let column = this.state.attributes.data.length > 1 ? (data.columnIndex - 1) : data.columnIndex
            if (this.state.attributes.data.length > 1) {
              attributes.data[data.index][data.columnIndex - 1].value =
                data.value
            } else {
              // 单条数据修改属性
              attributes.data[0][data.index].value = data.value
            }

            let checkData = this.checkToolIsViable()
            this.setState({
              attributes,
              ...checkData,
            })
          } else {
            Toast.show(
              global.language === 'CN'
                ? '数据类型不合法,设置失败'
                : 'Invalid data type. Failed to set',
            )
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
      canBeUndo: LayerUtils.canBeUndo(historyObj),
      canBeRedo: LayerUtils.canBeRedo(historyObj),
      canBeRevert: LayerUtils.canBeRevert(historyObj),
    }
  }

  setAttributeHistory = async type => {
    if (!type) return
    switch (type) {
      case 'undo':
        if (!this.state.canBeUndo) {
          // Toast.show('已经无法回撤')
          // this.setLoading(false)
          return
        }
        break
      case 'redo':
        if (!this.state.canBeRedo) {
          // Toast.show('已经无法恢复')
          // this.setLoading(false)
          return
        }
        break
      case 'revert':
        if (!this.state.canBeRevert) {
          // Toast.show('已经无法还原')
          // this.setLoading(false)
          return
        }
        break
    }
    this.setLoading(true, getLanguage(global.language).Prompt.LOADING)
    //'修改中')
    try {
      this.props.setAttributeHistory &&
        (await this.props
          .setAttributeHistory({
            mapName: this.props.map.currentMap.name,
            layerPath: this.props.currentLayer.path,
            type,
          })
          .then(({ msg, result, data }) => {
            if (!msg === '成功') Toast.show(msg)
            if (result) {
              let attributes = JSON.parse(JSON.stringify(this.state.attributes))

              // if (data.length === 1) {
              //   let fieldInfo = data[0].fieldInfo
              //   if (this.state.attributes.data.length > 1) {
              //     if (
              //       attributes.data[fieldInfo[0].index][
              //         fieldInfo[0].columnIndex - 1
              //       ].name === fieldInfo[0].name &&
              //       attributes.data[fieldInfo[0].index][
              //         fieldInfo[0].columnIndex - 1
              //       ].value === fieldInfo[0].value
              //     ) {
              //       this.setAttributeHistory(type)
              //       return
              //     }
              //   } else {
              //     if (
              //       attributes.data[0][fieldInfo[0].index].name ===
              //         fieldInfo[0].name &&
              //       attributes.data[0][fieldInfo[0].index].value ===
              //         fieldInfo[0].value
              //     ) {
              //       this.setAttributeHistory(type)
              //       return
              //     }
              //   }
              // }

              for (let i = 0; i < data.length; i++) {
                let fieldInfo = data[i].fieldInfo
                for (let j = 0; j < fieldInfo.length; j++) {
                  if (this.state.attributes.data.length > 1) {
                    if (
                      attributes.data[0][0].value <= fieldInfo[j].smID &&
                      attributes.data[attributes.data.length - 1][0].value >=
                        fieldInfo[j].smID
                    ) {
                      for (let _data of attributes.data) {
                        if (_data[0].value === fieldInfo[j].smID) {
                          _data[fieldInfo[j].columnIndex - 1].value =
                            fieldInfo[j].value
                          continue
                        }
                      }
                    }
                  } else {
                    if (
                      attributes.data[0][fieldInfo[j].index].name ===
                        fieldInfo[j].name &&
                      attributes.data[0][fieldInfo[j].index].value !==
                        fieldInfo[j].value
                    ) {
                      attributes.data[0][fieldInfo[j].index].value =
                        fieldInfo[j].value
                    }
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
                  setTimeout(() => {
                    this.setLoading(false)
                    if (
                      this.state.attributes.data.length > 1 &&
                      data.length === 1
                    ) {
                      this.locateToPosition({
                        type: 'absolute',
                        index: data[0].fieldInfo[0].index + 1,
                      })
                    }
                  }, 0)
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

  goToSearch = () => {
    NavigationService.navigate('LayerAttributeSearch', {
      layerPath: this.props.currentLayer.path,
    })
  }

  showSystemFields = () => {
    this.table && this.table.horizontalScrollToStart()
    this.setState({
      isShowSystemFields: !this.state.isShowSystemFields,
    })
  }

  //提示是否删除属性字段
  renderDeleteFieldDialog = () => {
    return (
      <Dialog
        ref={ref => (this.deleteFieldDialog = ref)}
        type={'modal'}
        confirmAction={async () => {
          this.deleteFieldDialog.setDialogVisible(false)
          let layerPath = this.props.currentLayer.path
          if (this.filter.split(' ').indexOf(deleteFieldData.name) >= 0) {
            this.filter = ''
          }
          let result = await SMap.removeRecordsetFieldInfo(
            layerPath,
            false,
            deleteFieldData.name,
          )
          if (
            this.filter &&
            this.filter.split(' ').indexOf(deleteFieldData.name) >= 0
          ) {
            this.filter = ''
          }
          if (result) {
            Toast.show(
              getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_SUCCESS,
            )
            this.props.clearAttributeHistory &&
              this.props.clearAttributeHistory()
            this.canBeRefresh = false
            this.refresh()
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
            paddingHorizontal: scaleSize(10),
          }}
        >
          <Text
            style={{
              fontSize: size.fontSize.fontSizeLg,
              color: color.theme_white,
              marginTop: scaleSize(5),
              marginLeft: scaleSize(10),
              marginRight: scaleSize(10),
              textAlign: 'center',
            }}
          >
            {getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_CONFIRM +
              '\n\n' +
              getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_TIPS}
          </Text>
        </View>
      </Dialog>
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        appConfig={this.props.appConfig}
        initIndex={2}
        type={this.type}
      />
    )
  }

  renderMapLayerAttribute = () => {
    // if (
    //   !this.state.attributes ||
    //   (!this.state.attributes.data && this.state.attributes.data.length === 0)
    // )
    //   return null

    let buttonNameFilter = ['MediaFilePaths'], // 属性表cell显示 查看 按钮
      buttonTitles = [getLanguage(global.language).Map_Tools.VIEW]
    let buttonActions = [
      async data => {
        let layerName = this.props.currentLayer.name,
          geoID = data.rowData[0].value
        let info = await SMediaCollector.getMediaInfo(layerName, geoID)
        Object.assign(info, { addToMap: this.props.currentLayer.isVisible })
        NavigationService.navigate('MediaEdit', {
          info,
          cb: mData => {
            let _data = this.state.attributes.data[data.rowIndex]
            for (let j = 0; j < mData.length; j++) {
              if (mData[j].name !== 'mediaName') continue
              for (let i = 0; i < _data.length; i++) {
                if (_data[i].name !== 'MediaName') continue
                if (_data[i].value === mData[j].value) break
                let isSingle = this.state.attributes.data.length === 1
                let params = {}
                if (isSingle) {
                  params = {
                    cellData: _data[i].value,
                    columnIndex: 1,
                    rowData: data.rowData[i],
                    index: i,
                    value: mData[j].value,
                  }
                } else {
                  params = {
                    cellData: _data[i],
                    columnIndex: i + 1,
                    rowData: data.rowData,
                    index: data.rowIndex,
                    value: mData[j].value,
                  }
                }
                this.changeAction(params)
              }
            }
          },
        })
      },
    ]
    return (
      <LayerAttributeTable
        ref={ref => (this.table = ref)}
        data={
          this.state.attributes.data.length === 1
            ? this.state.attributes.data[0]
            : this.state.attributes.data
        }
        tableHead={
          this.state.attributes.data.length === 1
            ? [
              getLanguage(this.props.language).Map_Label.NAME,
              getLanguage(this.props.language).Map_Label.ATTRIBUTE,
              //'名称'
              //'属性值'
            ]
            : this.state.attributes.head
        }
        widthArr={this.state.attributes.data.length === 1 && [100, 100]}
        type={
          this.state.attributes.data.length === 1
            ? LayerAttributeTable.Type.SINGLE_DATA
            : LayerAttributeTable.Type.MULTI_DATA
        }
        // indexColumn={this.state.attributes.data.length > 1 ? 0 : -1}
        indexColumn={0}
        hasIndex={this.state.attributes.data.length > 1}
        startIndex={
          this.state.attributes.data.length === 1
            ? -1
            : this.state.startIndex + 1
        }
        hasInputText={this.state.attributes.data.length > 1}
        selectRow={this.selectRow}
        refresh={cb => this.refresh(cb)}
        loadMore={cb => this.loadMore(cb)}
        changeAction={this.changeAction}
        buttonNameFilter={buttonNameFilter}
        buttonActions={buttonActions}
        buttonTitles={buttonTitles}
        isShowSystemFields={this.state.isShowSystemFields}
        onPressHeader={this.onPressHeader}
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
          textColor={!this.state.canBeRedo && color.contentColorGray}
          image={
            this.state.canBeRedo
              ? getThemeAssets().publicAssets.icon_redo
              : getPublicAssets().attribute.icon_redo_disable
          }
          imageStyle={styles.headerBtn}
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

  renderInfoView = ({ image, title }) => {
    return (
      <InfoView
        image={image || getPublicAssets().attribute.info_no_attribute}
        title={title}
      />
    )
  }

  // renderContent = () => {
  //   if (!this.state.showTable) return null
  //   return (
  //     <View>
  //       <LayerTopBar
  //         canRelated={this.state.relativeIndex >= 0}
  //         locateAction={this.showLocationView}
  //         relateAction={this.relateAction}
  //       />
  //       <View
  //         style={{
  //           flex: 1,
  //           flexDirection: 'column',
  //           justifyContent: 'flex-start',
  //         }}
  //       >
  //         {this.renderMapLayerAttribute()}
  //         {this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()}
  //         <LocationView
  //           ref={ref => (this.locationView = ref)}
  //           style={styles.locationView}
  //           relativeIndex={
  //             this.currentPage * PAGE_SIZE + this.state.relativeIndex
  //           }
  //           locateToTop={this.locateToTop}
  //           locateToBottom={this.locateToBottom}
  //           locateToPosition={this.locateToPosition}
  //         />
  //       </View>
  //     </View>
  //   )
  // }

  render() {
    let showContent =
      this.state.showTable &&
      this.state.attributes &&
      this.state.attributes.head &&
      this.state.attributes.head.length > 0

    let headerRight = []
    if (this.type !== 'MAP_3D') {
      headerRight = [
        <MTBtn
          key={'attribute'}
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
      ]
    }

    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getHeaderTitle(this.type),
          navigation: this.props.navigation,
          // backAction: this.back,
          // backImg: require('../../../../assets/mapTools/icon_close.png'),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          withoutBack: true,
          headerRight,
        }}
        // bottomBar={this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()}
        style={styles.container}
      >
        {this.type !== 'MAP_3D' && (
          <LayerTopBar
            canLocated={this.state.attributes.data.length > 1}
            canRelated={this.state.currentIndex >= 0}
            canAddField={
              this.props.currentLayer.name !== undefined &&
              this.props.currentLayer.name !== '' &&
              this.props.currentLayer.type !== DatasetType.IMAGE &&
              this.props.currentLayer.type !== DatasetType.MBImage // 影像图层不能添加属性
            }
            locateAction={this.showLocationView}
            relateAction={this.relateAction}
            addFieldAction={this.addAttributeField}
            attributesData={this.state.attributes.head}
          />
        )}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            backgroundColor: color.contentWhite,
          }}
        >
          {showContent
            ? this.renderMapLayerAttribute()
            : this.renderInfoView({
              title: getLanguage(this.props.language).Prompt.NO_ATTRIBUTES,
              //'暂无属性',
            })}
          {this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()}
          <LocationView
            ref={ref => (this.locationView = ref)}
            style={styles.locationView}
            currentIndex={this.state.currentIndex}
            locateToTop={this.locateToTop}
            locateToBottom={this.locateToBottom}
            locateToPosition={this.locateToPosition}
          />
        </View>
        <PopView
          ref={ref => (this.popModal = ref)}
          modalVisible={this.state.editControllerVisible}
        >
          {this.renderEditControllerView()}
        </PopView>
        {this.renderDeleteFieldDialog()}
      </Container>
    )
  }
}
