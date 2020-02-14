/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SectionList,
  Dimensions,
  Platform,
  Keyboard,
} from 'react-native'
import { scaleSize, dataUtil } from '../../../../utils'
import { IndicatorLoading } from '../../../../components'
import { color } from '../../../../styles'
import Row from './Row'

import styles from './styles'
import { getLanguage } from '../../../../language'

const COL_HEIGHT = scaleSize(80)

export default class LayerAttributeTable extends React.Component {
  props: {
    refresh?: () => {},
    loadMore?: () => {},
    selectRow?: () => {},
    changeAction?: () => {}, // 修改表格中的值的回调
    onPressHeader?: () => {}, // 点击属性字段的回调
    onViewableItemsChanged?: () => {},
    buttonNameFilter?: Array, // Cell 为button的列的filter
    buttonActions?: Array, // Cell 为button的列的点击事件
    buttonTitles?: Array, // Cell 为button列对应的title, buttonTitles必须不为空，buttonIndexes才生效

    selectable: boolean,
    stickySectionHeadersEnabled?: boolean,
    multiSelect: boolean, // 是否多选
    indexColumn?: number, // 每一行index所在的列，indexColumn >= 0 则所在列为Text

    tableHead: Array,
    tableTitle: Array,
    tableData: any,
    indexCellStyle: any,
    indexCellTextStyle: any,
    widthArr: Array,
    colHeight: number,
    type: string,
    data: Array,
    hasIndex?: boolean,
    startIndex?: number,
    isShowSystemFields?: boolean,
  }

  static defaultProps = {
    type: 'ATTRIBUTE',
    tableHead: [],
    tableTitle: [],
    tableData: [],
    widthArr: [40, 200, 200, 100, 100, 100, 80],
    selectable: true,
    multiSelect: false,
    hasIndex: false,
    startIndex: -1,
    refreshing: false,
    stickySectionHeadersEnabled: true,
    indexColumn: -1,
  }

  constructor(props) {
    super(props)
    // let { dataList, colHeight } = this.dealData(props.tableTitle, props.data)
    const titles =
      props.tableTitle.length > 0 ? props.tableTitle : this.getTitle(props.data)

    const isMultiData =
      this.props.data instanceof Array &&
      (this.props.data.length === 0 ||
        (this.props.data.length > 1 && this.props.data[0] instanceof Array))

    this.state = {
      colHeight: COL_HEIGHT,
      widthArr: props.widthArr,
      tableTitle: titles,
      // tableData: props.tableData,
      tableHead: props.tableHead,
      // tableTitle: titleList,
      // tableData: dataList,
      tableData: [
        {
          title: titles,
          data:
            props.data instanceof Array ? dataUtil.cloneObj(props.data) : [],
        },
      ],
      selected: (new Map(): Map<string, boolean>),
      currentSelect: -1,
      refreshing: false,
      loading: false,

      isMultiData,
    }
    this.canBeLoadMore = true // 控制是否可以加载更多
    this.isScrolling = false // 防止连续定位滚动
    this.itemClickPosition = 0 //当前item点击位置 IOS
    // this.viewabilityConfig = {
    //   waitForInteraction: true,
    //   viewAreaCoveragePercentThreshold: 95,
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      nextProps.isShowSystemFields !== this.props.isShowSystemFields ||
      JSON.stringify(nextProps.tableTitle) !==
        JSON.stringify(this.props.tableTitle) ||
      JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data) ||
      JSON.stringify(nextProps.tableHead) !==
        JSON.stringify(this.props.tableHead) ||
      JSON.stringify([...this.state.selected]) !==
        JSON.stringify([...nextState.selected])
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    const isMultiData =
      this.props.data instanceof Array &&
      (this.props.data.length === 0 ||
        (this.props.data.length > 1 && this.props.data[0] instanceof Array))
    if (
      JSON.stringify(prevProps.tableTitle) !==
        JSON.stringify(this.props.tableTitle) ||
      JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data) ||
      (!isMultiData &&
        this.props.isShowSystemFields !== prevProps.isShowSystemFields) ||
      JSON.stringify(this.state.tableHead) !==
        JSON.stringify(this.props.tableHead)
    ) {
      let data = []
      const titles = this.getTitle(data)

      if (!isMultiData && !this.props.isShowSystemFields) {
        this.props.data.forEach(item => {
          if (item.fieldInfo && !item.fieldInfo.isSystemField) {
            data.push(item)
          }
        })
      } else {
        data = this.props.data
      }

      this.setState({
        colHeight: COL_HEIGHT,
        widthArr: this.props.widthArr,
        tableData: [
          {
            title: titles,
            data,
          },
        ],
        tableHead: this.props.tableHead,
        isMultiData,
      })
      if (prevProps.data && this.props.data.length < prevProps.data.length) {
        this.table &&
          this.table.scrollToLocation({
            animated: false,
            itemIndex: 0,
            sectionIndex: 0,
            viewOffset: COL_HEIGHT,
          })
      }
    }
  }

  //IOS avoidingView无效 手动滚动过去
  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.keyBoardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      )
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      this.keyBoardDidShowListener.remove()
    }
  }
  _keyboardDidShow = e => {
    let { screenY, height } = e.startCoordinates
    if (screenY - this.itemClickPosition < height) {
      this.table &&
        this.table.scrollToLocation({
          itemIndex: this.scrollIndex,
          viewPosition: 1,
          viewOffset: -height,
        })
    }
  }
  horizontalScrollToStart = () => {
    this.horizontalTable &&
      this.horizontalTable.scrollTo({ x: 0, animated: false })
  }

  scrollToLocation = params => {
    if (!params) return
    // 防止2秒内连续定位滚动
    if (this.table && !this.isScrolling) {
      this.isScrolling = true
      this.table.scrollToLocation({
        animated: params.animated || false,
        itemIndex: params.itemIndex || 0,
        sectionIndex: params.sectionIndex || 0,
        viewOffset:
          params.viewOffset !== undefined ? params.viewOffset : COL_HEIGHT,
        viewPosition: params.viewPosition || 0,
      })
      let timer = setTimeout(() => {
        this.isScrolling = false
        clearTimeout(timer)
      }, 2000)
    }
  }

  getSelected = () => {
    return this.state.selected
  }

  clearSelected = () => {
    let _selected = new Map(this.state.selected)
    _selected.clear()
    this.setState({
      selected: _selected,
    })
  }

  getTitle = () => {
    // let titleList = []
    // if (data instanceof Array && data.length > 1 && data[0] instanceof Array) {
    //   data[0].forEach(item => {
    //     titleList.push(item.name)
    //   })
    // } else {
    let titleList = this.props.tableHead
    // }

    return titleList
  }

  refresh = () => {
    if (this.props.refresh && typeof this.props.refresh === 'function') {
      this.setState({
        refreshing: true,
      })
      this.props.refresh(() => {
        this.setState({
          refreshing: false,
        })
      })
    }
  }

  loadMore = () => {
    if (
      this.canBeLoadMore &&
      this.props.loadMore &&
      typeof this.props.loadMore === 'function' &&
      !this.state.loading
    ) {
      this.setState(
        {
          loading: true,
        },
        () => {
          // if (this.state.tableData[0].data && this.state.tableData[0].data.length > 0) {
          //   this.table && this.table.scrollToLocation({
          //     viewPosition: 1,
          //     sectionIndex: 0,
          //     itemIndex: this.state.tableData[0].data.length - 1,
          //     viewOffset: COL_HEIGHT,
          //   })
          // }
        },
      )
      this.props.loadMore(() => {
        this.canBeLoadMore = false
        this.setState({
          loading: false,
        })
      })
    }
  }

  /**
   * 设置/取消 选择行
   * index:    行序号
   * isToggle: 若行已被选中，是否取消被选择状态
   **/
  setSelected = (index, isToggle = true) => {
    if (index === undefined || isNaN(index) || index < 0) return
    if (
      isToggle ||
      !this.state.selected.get(this.state.tableData[0].data[index][0].value)
    ) {
      this.setState(state => {
        // copy the map rather than modifying state.
        const selected = new Map(state.selected)
        const target = selected.get(
          this.state.tableData[0].data[index][0].value,
        )
        if (!this.props.multiSelect && !target) {
          // 多选或者点击已选行
          selected.clear()
        }

        selected.set(this.state.tableData[0].data[index][0].value, !target) // toggle
        return { selected }
      })
    }

    return {
      data: this.state.tableData[0].data[index],
      index,
    }
  }

  onPressRow = item => {
    if (item.data instanceof Array) {
      // 多属性选中变颜色
      this.setState(state => {
        // copy the map rather than modifying state.
        const selected = new Map(state.selected)
        const target = selected.get(item.data[0].value)
        if (!this.props.multiSelect && !target) {
          // 多选或者点击已选行
          selected.clear()
        }

        let data = item.data[0]
        if (
          data.name === getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO
        ) {
          data = item.data[1]
        }

        selected.set(data.value, !target) // toggle
        return { selected }
      })
    } else {
      if (
        this.props.onPressHeader &&
        typeof this.props.onPressHeader === 'function'
      ) {
        // this.props.onPressHeader({fieldInfo:item.data.fieldInfo,index:item.index,pressView:item.iTemView})
        this.props.onPressHeader({
          fieldInfo: item.data.fieldInfo,
          index: item.columnIndex,
          pressView: item.pressView,
        })
      }
    }

    if (this.props.selectRow && typeof this.props.selectRow === 'function') {
      this.props.selectRow(item)
    }
  }
  onPressHeader = item => {
    if (
      this.props.onPressHeader &&
      typeof this.props.onPressHeader === 'function' &&
      item.columnIndex !== 0 &&
      item.data &&
      item.data[0] !== getLanguage(global.language).Map_Label.NAME
    ) {
      this.props.onPressHeader({
        fieldInfo: item.data[item.columnIndex].fieldInfo,
        index: item.columnIndex,
        pressView: item.pressView,
      })
    }
  }

  onChangeEnd = data => {
    if (
      this.props.changeAction &&
      typeof this.props.changeAction === 'function'
    ) {
      this.props.changeAction(data)
    }
  }

  _renderSingleDataItem = ({ item, index }) => {
    return (
      <Row
        data={item}
        index={index}
        onPress={this.onPressRow}
        onChangeEnd={this.onChangeEnd}
        isShowSystemFields={this.props.isShowSystemFields}
      />
    )
  }

  _renderItem = ({ item, index }) => {
    let indexCellStyle = styles.cell,
      indexCellTextStyle = styles.cellText
    if (item instanceof Array && this.props.indexColumn >= 0) {
      indexCellStyle = styles.indexCell
      indexCellTextStyle = styles.indexCellText
    }
    let data = JSON.parse(JSON.stringify(item))
    if (
      this.props.startIndex >= 0 &&
      data.length > 0 &&
      data[0].name !== getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO
    ) {
      data.unshift({
        name: getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO,
        value: this.props.startIndex + index,
        fieldInfo: {},
      })
    }

    let buttonActions = [],
      buttonIndexes = [],
      buttonTitles = []

    if (this.props.type === 'MULTI_DATA' && this.state.isMultiData) {
      buttonTitles = this.props.buttonTitles
      if (
        this.props.buttonNameFilter &&
        this.props.buttonNameFilter instanceof Array
      ) {
        for (let index1 in item) {
          for (let filter of this.props.buttonNameFilter) {
            if (item[index1].name === filter) {
              buttonIndexes.push(parseInt(index1) + 1)
              break
            }
          }
        }
      }
      this.props.buttonActions &&
        this.props.buttonActions instanceof Array &&
        this.props.buttonActions.forEach(action => {
          buttonActions.push(row => {
            if (typeof action === 'function') {
              if (item && item instanceof Array) {
                action({
                  rowData: row.data,
                  rowIndex: index,
                  cellData: row.data[row.columnIndex],
                  cellIndex: row.columnIndex,
                })
              } else {
                action({
                  rowData: this.props.data,
                  rowIndex: 0,
                  cellData: item,
                  cellIndex: index,
                })
              }
            }
          })
        })
    } else {
      if (
        this.props.buttonNameFilter &&
        this.props.buttonNameFilter instanceof Array
      ) {
        for (let filter of this.props.buttonNameFilter) {
          if (item.name === filter) {
            buttonTitles = this.props.buttonTitles || []
            buttonIndexes = [1]
            this.props.buttonActions &&
              this.props.buttonActions instanceof Array &&
              this.props.buttonActions.forEach(action => {
                buttonActions.push(row => {
                  if (typeof action === 'function') {
                    if (item && item instanceof Array) {
                      action({
                        rowData: item,
                        rowIndex: index,
                        cellData: row.data,
                        cellIndex: row.index,
                      })
                    } else {
                      action({
                        rowData: this.props.data,
                        rowIndex: 0,
                        cellData: item,
                        cellIndex: index,
                      })
                    }
                  }
                })
              })
            break
          }
        }
      }
      buttonTitles = this.props.buttonTitles || []
    }

    return (
      <Row
        data={data}
        selected={item[0] ? !!this.state.selected.get(item[0].value) : false}
        index={index}
        disableCellStyle={styles.disableCellStyle}
        // cellTextStyle={cellTextStyle}
        indexColumn={this.props.indexColumn}
        indexCellStyle={[indexCellStyle, this.props.indexCellStyle]}
        indexCellTextStyle={[indexCellTextStyle, this.props.indexCellTextStyle]}
        // onPress={() => this.onPressRow({ data: item, index })}
        onPress={this.onPressRow}
        onFocus={evt => {
          this.itemClickPosition = evt.nativeEvent.pageY
          this.scrollIndex = index
        }}
        onChangeEnd={this.onChangeEnd}
        buttonIndexes={buttonIndexes}
        buttonActions={buttonActions}
        buttonTitles={buttonTitles}
        isShowSystemFields={this.props.isShowSystemFields}
      />
    )
  }

  _keyExtractor = (item, index) => {
    if (index === null) {
      return null
    }
    return index.toString()
  }

  _renderSectionHeader = ({ section }) => {
    let titles = section.title
    if (
      this.props.startIndex >= 0 &&
      titles.length > 0 &&
      titles[0].value !==
        getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO
    ) {
      titles.unshift({
        isSystemField: false,
        value: getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO,
      })
    }
    return (
      <Row
        style={{ backgroundColor: color.itemColorGray }}
        cellTextStyle={{ color: color.fontColorWhite }}
        data={titles}
        hasInputText={false}
        onPress={this.onPressHeader}
        isShowSystemFields={this.props.isShowSystemFields}
      />
    )
  }

  _onViewableItemsChanged = changed => {
    if (
      this.props.onViewableItemsChanged &&
      typeof this.props.onViewableItemsChanged === 'function'
    ) {
      this.props.onViewableItemsChanged(changed)
    }
  }

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: scaleSize(80) * index,
      index,
    }
  }

  renderMultiDataTable = () => {
    return (
      <ScrollView
        ref={ref => (this.horizontalTable = ref)}
        style={{ flex: 1 }}
        horizontal={true}
      >
        <SectionList
          ref={ref => (this.table = ref)}
          refreshing={this.state.refreshing}
          style={styles.container}
          sections={this.state.tableData}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
          onRefresh={this.refresh}
          onEndReachedThreshold={1}
          onEndReached={this.loadMore}
          initialNumToRender={20}
          getItemLayout={this.getItemLayout}
          extraData={this.state}
          stickySectionHeadersEnabled={this.props.stickySectionHeadersEnabled}
          renderSectionFooter={this.renderFooter}
          onScroll={() => (this.canBeLoadMore = true)}
          // removeClippedSubviews={true} // ios使用后，底部有一行被透明行覆盖，无法选中
          onViewableItemsChanged={this._onViewableItemsChanged}
          // viewabilityConfig={this.viewabilityConfig}
        />
      </ScrollView>
    )
  }

  renderSingleDataTable = () => {
    return (
      <SectionList
        ref={ref => (this.table = ref)}
        refreshing={this.state.refreshing}
        style={styles.container}
        sections={this.state.tableData}
        // renderItem={this._renderSingleDataItem}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        renderSectionHeader={this._renderSectionHeader}
        // onRefresh={this.refresh}
        // onEndReachedThreshold={0.5}
        // onEndReached={this.loadMore}
        extraData={this.state}
        initialNumToRender={20}
        getItemLayout={this.getItemLayout}
        stickySectionHeadersEnabled={this.props.stickySectionHeadersEnabled}
      />
    )
  }

  renderFooter = () => {
    if (!this.state.loading) return <View />
    return (
      <View
        style={{
          width: Dimensions.get('window').width,
          height: COL_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IndicatorLoading
          title={getLanguage(global.language).Prompt.LOADING}
          //{'加载中'}
        />
      </View>
    )
  }

  render() {
    // if (
    //   !this.state.isMultiData &&
    //   Object.keys(this.state.tableData[0].data).length === 0
    // ) {
    //   return null
    // }
    if (Platform.OS === 'android') {
      return (
        <KeyboardAvoidingView
          // behavior={this.state.behavior}
          behavior="padding"
          enabled
          style={styles.container}
        >
          {/*<View style={styles.container}>*/}
          {this.props.type === 'MULTI_DATA' && this.state.isMultiData
            ? this.renderMultiDataTable()
            : this.renderSingleDataTable()}
          {/*{this.state.loading && this.renderFooter()}*/}
          {/*</View>*/}
        </KeyboardAvoidingView>
      )
    } else {
      return (
        <View style={styles.container}>
          {this.props.type === 'MULTI_DATA' && this.state.isMultiData
            ? this.renderMultiDataTable()
            : this.renderSingleDataTable()}
        </View>
      )
    }
  }
}

LayerAttributeTable.Type = {
  ATTRIBUTE: 'ATTRIBUTE',
  EDIT_ATTRIBUTE: 'EDIT_ATTRIBUTE',
  SINGLE_DATA: 'SINGLE_DATA', // 单个对象的属性，两列：'名称', '属性值'
  MULTI_DATA: 'MULTI_DATA', // 多个对象的属性，多列
}
