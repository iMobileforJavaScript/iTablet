/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { ConstInfo } from '../../../../constants'
import { Toast } from '../../../../utils'
import { LayerUtil } from '../../utils'
import { LayerAttributeTable } from '../../components'

const PAGE_SIZE = 20

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
    this.state = {
      attributes: {
        head: [],
        data: [],
      },
      // tableTitle: [],
      tableHead: [],
      startIndex: 0,
      currentIndex: -1,
    }

    this.total = 0
    this.currentFieldInfo = []
    this.currentFieldIndex = -1
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

  componentDidUpdate(prevProps) {
    if (
      prevProps.layerSelection &&
      JSON.stringify(prevProps.layerSelection) !==
        JSON.stringify(this.props.layerSelection)
    ) {
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
          currentIndex: -1,
          startIndex: 0,
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

        if (
          // attributes.data.length === this.state.attributes.data.length &&
          // JSON.stringify(attributes.data) === JSON.stringify(this.state.attributes.data) ||
          Math.floor(this.total / PAGE_SIZE) === currentPage ||
          attributes.data.length < PAGE_SIZE
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
            startIndex: -1,
            ...others,
          })
        } else {
          this.setState({
            showTable: true,
            attributes,
            currentIndex: currentIndex,
            currentFieldInfo: attributes.data[currentIndex],
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
    this.currentPage = 0
    if (this.state.startIndex === 0) {
      this.setState(
        {
          currentIndex: 0,
          currentFieldInfo: this.state.attributes.data[0],
        },
        () => {
          let item = this.table.setSelected(0)
          cb &&
            cb({
              currentIndex:
                this.currentPage * PAGE_SIZE + this.state.currentIndex,
              currentFieldInfo: item.data,
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
          currentIndex: 0,
        },
        () => {
          let item = this.table.setSelected(0)
          this.setState({
            currentFieldInfo: item.data,
          })
          cb &&
            cb({
              currentIndex:
                this.currentPage * PAGE_SIZE + this.state.currentIndex,
              currentFieldInfo: item.data,
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
    if (this.total <= 0) return
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
        currentIndex: remainder,
      },
      () => {
        if (this.table) {
          let item = this.table.setSelected(remainder)
          this.setState({
            currentFieldInfo: item.data,
          })
          cb &&
            cb({
              currentIndex:
                this.currentPage * PAGE_SIZE + this.state.currentIndex,
              currentFieldInfo: item.data,
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
    let remainder = 0,
      viewPosition = 0.3
    if (data.type === 'relative') {
      let currentIndex =
        (this.state.currentIndex <= 0 ? 0 : this.state.currentIndex) +
        data.index
      if (currentIndex < 0) {
        Toast.show('位置越界')
        return
      }
      this.currentPage = Math.floor(currentIndex / PAGE_SIZE)
      remainder = currentIndex % PAGE_SIZE
    } else if (data.type === 'absolute') {
      this.currentPage = Math.floor(data.index / PAGE_SIZE)
      remainder = (data.index % PAGE_SIZE) - 1
    }

    if (this.currentPage > 0) {
      this.canBeRefresh = true
    }

    if (remainder <= PAGE_SIZE / 4) {
      viewPosition = 0
    } else if (remainder > (PAGE_SIZE * 3) / 4) {
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
        currentIndex: remainder,
      },
      () => {
        if (this.table) {
          let item = this.table.setSelected(remainder)
          this.setState({
            currentFieldInfo: item.data,
          })
          cb &&
            cb({
              currentIndex:
                this.currentPage * PAGE_SIZE + this.state.currentIndex,
              currentFieldInfo: item.data,
            })
          this.table &&
            this.table.scrollToLocation({
              animated: true,
              itemIndex: remainder,
              sectionIndex: 0,
              viewPosition: viewPosition,
              viewOffset: viewPosition === 1 ? 0 : undefined, // 滚动显示在底部，不需要设置offset
            })
        }
      },
    )
  }

  selectRow = ({ data, index = -1 }) => {
    // if (!data || index < 0) return
    this.currentFieldInfo = data || []
    this.currentFieldIndex = index >= 0 ? index : -1
    if (
      this.props.selectAction &&
      typeof this.props.selectAction === 'function'
    ) {
      this.props.selectAction({
        index,
        data,
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
        data: this.currentFieldInfo,
        index: this.currentFieldIndex,
      }
    }
  }

  /** 清除表格选中状态 **/
  clearSelection = () => {
    if (this.table) {
      this.table.clearSelected()
      this.currentFieldInfo = []
      this.currentFieldIndex = -1
      if (
        this.props.selectAction &&
        typeof this.props.selectAction === 'function'
      ) {
        this.props.selectAction({
          index: this.currentFieldIndex,
          data: this.currentFieldInfo,
        })
      }
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
                  ? this.state.attributes[0][0].value
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
            attributes[data.index][data.columnIndex].value = data.value
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
            layerPath: this.props.layerSelection.layerInfo.path,
            type,
          })
          .then(({ msg, result, data }) => {
            Toast.show(msg)
            if (result) {
              let attributes = JSON.parse(JSON.stringify(this.state.attributes))

              if (data.length === 1) {
                let fieldInfo = data[0].fieldInfo
                if (
                  attributes[fieldInfo[0].index][fieldInfo[0].columnIndex]
                    .name === fieldInfo[0].name &&
                  attributes[fieldInfo[0].index][fieldInfo[0].columnIndex]
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
                    attributes[fieldInfo[j].index][fieldInfo[j].columnIndex]
                      .name === fieldInfo[j].name
                  ) {
                    attributes[fieldInfo[j].index][
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
            : ['名称', '属性值']
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
