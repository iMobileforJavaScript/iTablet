/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { ConstInfo } from '../../../../constants'
import { Toast, LayerUtil } from '../../../../utils'
import { LayerAttributeTable } from '../../components'
import { language,getLanguage } from '../../../../language/index'

const PAGE_SIZE = 30

export default class LayerSelectionAttribute extends React.Component {
  props: {
    navigation: Object,
    // currentAttribute: Object,
    // currentLayer: Object,
    map: Object,
    layerSelection: Object,
    attributesHistory: Array,
    setCurrentAttribute: () => {},
    setLayerAttributes: () => {},
    setLoading: () => {},
    selectAction: () => {},
    setAttributeHistory: () => {},
    onGetAttribute?: () => {},
  }

  constructor(props) {
    super(props)
    let checkData = this.checkToolIsViable()
    this.state = {
      attributes: {
        head: [],
        data: [],
      },
      // tableTitle: [],
      tableHead: [],
      currentFieldInfo: [],
      startIndex: 0,
      relativeIndex: -1, // 当前页面从startIndex开始的被选中的index, 0 -> this.total - 1
      currentIndex: -1,

      canBeUndo: checkData.canBeUndo,
      canBeRedo: checkData.canBeRedo,
      canBeRevert: checkData.canBeRevert,
    }

    this.total = 0
    // this.currentFieldInfo = []
    // this.currentFieldIndex = -1
    this.currentPage = 0
    this.pageSize = 20
    this.isInit = true // 初始化，防止多次加载
    this.noMore = false // 判断是否加载完毕
    this.isLoading = false // 防止同时重复加载多次
  }

  componentDidMount() {
    this.isInit = true
    this.getAttribute()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps.map) !== JSON.stringify(this.props.map) ||
      JSON.stringify(nextProps.layerSelection) !==
        JSON.stringify(this.props.layerSelection) ||
      JSON.stringify(nextProps.attributesHistory) !==
        JSON.stringify(nextProps.attributesHistory)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.layerSelection &&
      JSON.stringify(prevProps.layerSelection) !==
        JSON.stringify(this.props.layerSelection)
    ) {
      let checkData = this.checkToolIsViable()
      // this.isInit = true
      this.currentPage = 0
      this.total = 0 // 属性总数
      this.canBeRefresh = true
      this.noMore = false
      // this.getAttribute()
      this.setState(
        {
          attributes: {
            head: [],
            data: [],
          },
          currentFieldInfo: [],
          relativeIndex: -1,
          currentIndex: -1,
          startIndex: 0,
          ...checkData,
        },
        () => {
          this.refresh(null, true)
        },
      )
    }
  }

  componentWillUnmount() {
    this.props.setCurrentAttribute({})
  }

  setLoading = isLoading => {
    if (this.props.setLoading && typeof this.props.setLoading === 'function') {
      this.props.setLoading(isLoading)
    }
  }

  getAttribute = (params = {}, cb = () => {}, resetCurrent = false) => {
    if (!this.props.layerSelection.layerInfo.path || params.currentPage < 0)
      return
    let { currentPage, pageSize, type, ...others } = params
    ;(async function() {
      try {
        let result = await LayerUtil.getSelectionAttributeByLayer(
          JSON.parse(JSON.stringify(this.state.attributes)),
          this.props.layerSelection.layerInfo.path,
          currentPage,
          pageSize !== undefined ? pageSize : PAGE_SIZE,
          type,
        )

        this.total = result.total || 0
        let attributes = result.attributes || []

        this.noMore =
          Math.floor(this.total / PAGE_SIZE) === currentPage ||
          attributes.data.length < PAGE_SIZE

        if (attributes.data.length === 1) {
          this.setState({
            showTable: true,
            attributes,
            currentIndex: 0,
            relativeIndex: 0,
            currentFieldInfo: attributes.data[0],
            startIndex: 0,
            ...others,
          })
        } else {
          let currentIndex = resetCurrent ? -1 : this.state.currentIndex
          let relativeIndex = resetCurrent ? -1 : this.state.relativeIndex
          this.setState({
            showTable: true,
            attributes,
            currentIndex: currentIndex,
            relativeIndex: relativeIndex,
            currentFieldInfo: attributes.data[relativeIndex],
            ...others,
          })
        }
        this.props.onGetAttribute && this.props.onGetAttribute(attributes)
        cb && cb(attributes)
        this.setLoading(false)
      } catch (e) {
        cb && cb()
        this.isLoading = false
        this.setLoading(false)
      }
    }.bind(this)())
  }

  /** 下拉刷新 **/
  refresh = (cb = () => {}, resetCurrent = false) => {
    if (!this.canBeRefresh) {
      Toast.show('已经是最新的了')
      cb && cb()
      return
    }
    let startIndex = this.state.startIndex - PAGE_SIZE
    if (startIndex <= 0) {
      startIndex = 0
      this.canBeRefresh = false
    }
    let currentPage = startIndex / PAGE_SIZE
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
    // if (
    //   this.isInit ||
    //   this.noMore ||
    //   this.props.layerSelection.ids.length <= 20
    // ) {
    //   cb && cb()
    //   return
    // }
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
      attribute => {
        cb && cb()
        this.isLoading = false
        if (!attribute || !attribute.data || attribute.data.length <= 0) {
          this.noMore = true
          Toast.show(ConstInfo.ALL_DATA_ALREADY_LOADED)
          // this.currentPage--
        }
      },
    )
  }

  /**
   * 定位到首位
   */
  locateToTop = (cb = () => {}) => {
    if (this.state.attributes.data.length === 0 || this.total <= 0) {
      Toast.show(ConstInfo.CANNOT_LOCATION)
      return
    }
    this.currentPage = 0
    if (this.state.startIndex === 0) {
      this.setState(
        {
          relativeIndex: 0,
          currentIndex: 0,
          currentFieldInfo: this.state.attributes.data[0],
        },
        () => {
          let item = this.table.setSelected(0)
          cb &&
            cb({
              currentIndex: 0,
              currentFieldInfo: item.data,
              layerInfo: this.props.layerSelection.layerInfo,
            })
          this.table &&
            this.table.scrollToLocation({
              animated: true,
              itemIndex: 0,
              sectionIndex: 0,
              viewPosition: 0,
            })
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
          let item = this.table.setSelected(0)
          this.setState({
            currentFieldInfo: item.data,
          })
          cb &&
            cb({
              currentIndex: 0,
              currentFieldInfo: item.data,
              layerInfo: this.props.layerSelection.layerInfo,
            })
          this.canBeRefresh = false
          this.table &&
            this.table.scrollToLocation({
              animated: true,
              itemIndex: 0,
              sectionIndex: 0,
              viewPosition: 0,
            })
        },
      )
    }
  }

  /**
   * 定位到末尾
   */
  locateToBottom = (cb = () => {}) => {
    if (this.state.attributes.data.length === 0 || this.total <= 0) {
      Toast.show(ConstInfo.CANNOT_LOCATION)
      return
    }
    this.currentPage = Math.floor(this.total / PAGE_SIZE)
    let remainder = (this.total % PAGE_SIZE) - 1

    let startIndex = this.currentPage * PAGE_SIZE
    if (startIndex !== 0) {
      this.canBeRefresh = true
    }

    this.getAttribute(
      {
        type: 'reset',
        currentPage: this.currentPage,
        startIndex: startIndex,
        relativeIndex: remainder,
        currentIndex: this.total - 1,
      },
      () => {
        if (this.table) {
          let item = this.table.setSelected(remainder)
          this.setState({
            currentFieldInfo: item.data,
          })
          cb &&
            cb({
              currentIndex: this.total - 1,
              currentFieldInfo: item.data,
              layerInfo: this.props.layerSelection.layerInfo,
            })
          this.table &&
            this.table.scrollToLocation({
              animated: true,
              itemIndex: remainder,
              sectionIndex: 0,
              viewOffset: 0,
              viewPosition: 1,
            })
        }
      },
    )
  }

  /**
   * 定位到指定位置（相对/绝对 位置）
   * @param data {value, inputValue}
   */
  locateToPosition = (data = {}, cb = () => {}) => {
    if (this.state.attributes.data.length === 0 || this.total <= 0) {
      Toast.show(ConstInfo.CANNOT_LOCATION)
      return
    }
    let remainder = 0,
      viewPosition = 0.3,
      relativeIndex,
      currentIndex
    if (data.type === 'relative') {
      let relativeIndex =
        (this.state.relativeIndex <= 0 ? 0 : this.state.relativeIndex) +
        this.state.startIndex +
        data.index
      if (relativeIndex < 0 || relativeIndex >= this.total) {
        Toast.show('位置越界')
        return
      }
      currentIndex = this.state.currentIndex + data.index
      this.currentPage = Math.floor(relativeIndex / PAGE_SIZE)
      remainder = relativeIndex % PAGE_SIZE
    } else if (data.type === 'absolute') {
      if (data.index <= 0 || data.index > this.total) {
        Toast.show('位置越界')
        return
      }
      relativeIndex = data.index - 1
      this.currentPage = Math.floor(relativeIndex / PAGE_SIZE)
      remainder = relativeIndex % PAGE_SIZE
      currentIndex = data.index
    }

    // if (this.currentPage > 0) {
    //   this.canBeRefresh = true
    // }

    let restLength = this.total - relativeIndex - 1
    if (remainder <= PAGE_SIZE / 4 && !(restLength < PAGE_SIZE / 4)) {
      viewPosition = 0
    } else if (remainder > (PAGE_SIZE * 3) / 4 || restLength < PAGE_SIZE / 4) {
      viewPosition = 1
    }

    let startIndex = this.currentPage * PAGE_SIZE
    if (startIndex !== 0) {
      this.canBeRefresh = true
    }

    this.getAttribute(
      {
        type: 'reset',
        currentPage: this.currentPage,
        startIndex: startIndex,
        relativeIndex: remainder,
        currentIndex,
      },
      () => {
        if (this.table) {
          let item = this.table.setSelected(remainder)
          this.setState({
            currentFieldInfo: item.data,
          })
          cb &&
            cb({
              currentIndex: this.state.startIndex + remainder,
              currentFieldInfo: item.data,
              layerInfo: this.props.layerSelection.layerInfo,
            })

          // 避免 Android 更新数据后无法滚动
          setTimeout(() => {
            this.table &&
              this.table.scrollToLocation({
                animated: true,
                itemIndex: remainder,
                sectionIndex: 0,
                viewPosition: viewPosition,
                viewOffset: viewPosition === 1 ? 0 : undefined, // 滚动显示在底部，不需要设置offset
              })
          }, 0)
        }
      },
    )
  }

  selectRow = ({ data, index = -1 }) => {
    if (this.state.attributes.data.length === 1) return
    // if (!data || index < 0) return
    // this.currentFieldInfo = data || []
    // this.currentFieldIndex = index >= 0 ? index : -1

    this.setState({
      currentFieldInfo: data || [],
      relativeIndex: index >= 0 ? index : -1,
      currentIndex: this.state.startIndex + index,
    })
    if (
      this.props.selectAction &&
      typeof this.props.selectAction === 'function'
    ) {
      this.props.selectAction({
        index: this.state.startIndex + index,
        data,
        layerInfo: this.props.layerSelection.layerInfo,
      })
    }
  }

  getAttributes = () => {
    return this.state.attributes
  }

  getSelection = () => {
    if (this.state.attributes.data.length === 1) {
      return {
        data: this.state.attributes.data[0],
        index: 0,
      }
    } else {
      return {
        data: this.state.attributes.data[this.state.relativeIndex],
        index: this.state.relativeIndex,
      }
    }
  }

  /** 清除表格选中状态 **/
  clearSelection = () => {
    if (this.table) {
      this.table.clearSelected()
      this.setState({
        currentFieldInfo: [],
        relativeIndex: -1,
        currentIndex: -1,
      })
      // if (
      //   this.props.selectAction &&
      //   typeof this.props.selectAction === 'function'
      // ) {
      //   this.props.selectAction({
      //     index: -1,
      //     data: -1,
      //   })
      // }
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
          if (
            layerHistory[j].layerPath ===
            this.props.layerSelection.layerInfo.path
          ) {
            historyObj = layerHistory[j]
            break
          }
        }
        break
      }
    }

    return {
      canBeUndo: LayerUtil.canBeUndo(historyObj),
      canBeRedo: LayerUtil.canBeRedo(historyObj),
      canBeRevert: LayerUtil.canBeRevert(historyObj),
    }
  }

  /** 修改表格中的值的回调 **/
  changeAction = data => {
    if (
      this.props.setLayerAttributes &&
      typeof this.props.setLayerAttributes === 'function'
    ) {
      // 单个对象属性和多个对象属性数据有区别
      let isSingleData = typeof data.cellData !== 'object'
      this.props
        .setLayerAttributes([
          {
            mapName: this.props.map.currentMap.name,
            layerPath: this.props.layerSelection.layerInfo.path,
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
          // if (!isSingleData && result) {
          //   // 成功修改属性后，更新数据
          //   let attributes = JSON.parse(JSON.stringify(this.state.attributes))
          //   attributes[data.index][data.columnIndex].value = data.value
          //   let checkData = this.checkToolIsViable()
          //   this.setState({
          //     attributes,
          //     ...checkData,
          //   })
          // }
          if (result) {
            // 成功修改属性后，更新数据
            let attributes = JSON.parse(JSON.stringify(this.state.attributes))
            // 如果有序号，column.index要 -1
            // let column = this.state.attributes.data.length > 1 ? (data.columnIndex - 1) : data.columnIndex
            if (this.state.attributes.data.length > 1) {
              attributes.data[data.index][data.columnIndex - 1].value =
                data.value
            } else {
              attributes.data[0][data.index].value = data.value
            }

            let checkData = this.checkToolIsViable()
            this.setState({
              attributes,
              ...checkData,
            })
          }
        })
    }
  }

  setAttributeHistory = async type => {
    if (!type) return
    switch (type) {
      case 'undo':
        if (!this.state.canBeUndo) {
          Toast.show('已经无法回撤')
          this.setLoading(false)
          return
        }
        break
      case 'redo':
        if (!this.state.canBeRedo) {
          Toast.show('已经无法恢复')
          this.setLoading(false)
          return
        }
        break
      case 'revert':
        if (!this.state.canBeRevert) {
          Toast.show('已经无法还原')
          this.setLoading(false)
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
            layerPath: this.props.layerSelection.layerInfo.path,
            type,
          })
          .then(({ msg, result, data }) => {
            Toast.show(msg)
            if (result) {
              let attributes = JSON.parse(JSON.stringify(this.state.attributes))

              if (data.length === 1) {
                let fieldInfo = data[0].fieldInfo
                if (this.state.attributes.data.length > 1) {
                  if (
                    attributes.data[fieldInfo[0].index][
                      fieldInfo[0].columnIndex - 1
                    ].name === fieldInfo[0].name &&
                    attributes.data[fieldInfo[0].index][
                      fieldInfo[0].columnIndex - 1
                    ].value === fieldInfo[0].value
                  ) {
                    this.setAttributeHistory(type)
                    return
                  }
                } else {
                  if (
                    attributes.data[0][fieldInfo[0].index].name ===
                      fieldInfo[0].name &&
                    attributes.data[0][fieldInfo[0].index].value ===
                      fieldInfo[0].value
                  ) {
                    this.setAttributeHistory(type)
                    return
                  }
                }
              }

              for (let i = 0; i < data.length; i++) {
                let fieldInfo = data[i].fieldInfo
                for (let j = 0; j < fieldInfo.length; j++) {
                  if (this.state.attributes.data.length > 1) {
                    if (
                      attributes.data[fieldInfo[j].index][
                        fieldInfo[j].columnIndex - 1
                      ].name === fieldInfo[j].name &&
                      attributes.data[fieldInfo[j].index][
                        fieldInfo[j].columnIndex - 1
                      ].value !== fieldInfo[j].value
                    ) {
                      attributes.data[fieldInfo[j].index][
                        fieldInfo[j].columnIndex - 1
                      ].value = fieldInfo[j].value
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

  renderTable = () => {
    // let data = [],
    //   head = [],
    //   type = LayerAttributeTable.Type.MULTI_DATA
    // // if (!this.state.attributes || this.state.attributes.length === 0) {
    // //   return <View />
    // // }
    // if (this.state.attributes.length > 1) {
    //   data = this.state.attributes
    //   head = this.state.tableHead
    // } else if (this.state.attributes.length === 1) {
    //   data = this.state.attributes[0]
    //   head = ['名称', '属性值']
    //   type = LayerAttributeTable.Type.SINGLE_DATA
    // }

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
            : [
              getLanguage(global.language).Map_Lable.NAME, 
              getLanguage(global.language).Map_Lable.ATTRIBUTE
              //'名称'
              //'属性值'
            ]
        }
        widthArr={this.state.attributes.data.length === 1 && [100, 100]}
        type={
          this.state.attributes.data.length > 1
            ? LayerAttributeTable.Type.MULTI_DATA
            : LayerAttributeTable.Type.SINGLE_DATA
        }
        refresh={cb => this.refresh(cb)}
        loadMore={cb => this.loadMore(cb)}
        hasInputText={this.state.attributes.data.length > 1}
        changeAction={this.changeAction}
        indexColumn={0}
        hasIndex={this.state.attributes.data.length > 1}
        startIndex={
          this.state.attributes.data.length === 1
            ? -1
            : this.state.startIndex + 1
        }
        selectRow={this.selectRow}
      />
    )
  }

  render() {
    // return (
    //   <Container
    //     ref={ref => (this.container = ref)}
    //     headerProps={{
    //       title: '属性',
    //       navigation: this.props.navigation,
    //     }}
    //     style={styles.container}
    //   >
    //     {this.state.attributes && this.state.attributes.length > 0 ? (
    //       this.renderTable()
    //     ) : (
    //       <View style={{ flex: 1 }} />
    //     )}
    //   </Container>
    // )

    return this.renderTable()
  }
}
