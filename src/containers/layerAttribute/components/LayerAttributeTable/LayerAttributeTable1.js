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
} from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
import Row from './Row'

import styles from './styles'

const COL_HEIGHT = scaleSize(80)

export default class LayerAttributeTable extends React.Component {
  props: {
    refresh?: () => {},
    loadMore?: () => {},
    selectRow?: () => {},
    changeAction?: () => {}, // 修改表格中的值的回调

    selectable: boolean,
    indexColumn?: number, // 每一行index所在的列，indexColumn >= 0 则所在列为Text

    tableHead: Array,
    tableTitle: Array,
    tableData: any,
    indexCellStyle: any,
    indexCellTextStyle: any,
    widthArr: Array,
    colHeight: number,
    type: string,
    data: Object,
    hasIndex?: boolean,
  }

  static defaultProps = {
    type: 'ATTRIBUTE',
    tableHead: [],
    tableTitle: [],
    tableData: [],
    widthArr: [40, 200, 200, 100, 100, 100, 80],
    selectable: true,
    hasIndex: false,
    refreshing: false,
    indexColumn: -1,
  }

  constructor(props) {
    super(props)
    // let { dataList, colHeight } = this.dealData(props.tableTitle, props.data)
    let titles =
      props.tableTitle.length > 0 ? props.tableTitle : this.getTitle(props.data)
    this.state = {
      colHeight: COL_HEIGHT,
      widthArr: props.widthArr,
      modifiedData: {},
      tableTitle: titles,
      // tableData: props.tableData,
      tableHead: props.tableHead,
      // tableTitle: titleList,
      // tableData: dataList,
      tableData: [
        {
          title: titles,
          data: props.data,
        },
      ],
      currentSelect: -1,
      refreshing: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.tableTitle) !==
        JSON.stringify(this.props.tableTitle) ||
      JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)
    ) {
      let titles = this.getTitle(this.props.data)

      this.setState({
        colHeight: COL_HEIGHT,
        widthArr: this.props.widthArr,
        tableData: [
          {
            title: titles,
            data: this.props.data,
          },
        ],
        tableHead: this.props.tableHead,
      })
      if (this.props.data.length < prevProps.data.length) {
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

  getTitle = data => {
    let titleList = []
    if (data instanceof Array && data.length > 1 && data[0] instanceof Array) {
      data[0].forEach(item => {
        titleList.push(item.name)
      })
    } else {
      titleList = this.props.tableHead
    }

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
    if (this.props.loadMore && typeof this.props.loadMore === 'function') {
      this.props.loadMore()
    }
  }

  onPressRow = data => {
    if (this.props.selectRow && typeof this.props.selectRow === 'function') {
      this.props.selectRow(data)
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
        onPress={() => this.onPressRow({ item, index })}
        onChangeEnd={this.onChangeEnd}
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
    return (
      <Row
        data={item}
        index={index}
        indexColumn={this.props.indexColumn}
        indexCellStyle={[indexCellStyle, this.props.indexCellStyle]}
        indexCellTextStyle={[indexCellTextStyle, this.props.indexCellTextStyle]}
        onPress={() => this.onPressRow({ item, index })}
        onChangeEnd={this.onChangeEnd}
      />
    )
  }

  _keyExtractor = (item, index) => {
    return index
  }

  _renderSectionHeader = ({ section }) => {
    return (
      <Row
        style={{ backgroundColor: color.itemColorGray }}
        cellTextStyle={{ color: color.fontColorWhite }}
        data={section.title}
        hasInputText={false}
        onPress={() => {}}
      />
    )
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
      <ScrollView style={{ flex: 1 }} horizontal={true}>
        <SectionList
          ref={ref => (this.table = ref)}
          refreshing={this.state.refreshing}
          style={styles.container}
          sections={this.state.tableData}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
          onRefresh={this.refresh}
          onEndReachedThreshold={0.5}
          onEndReached={this.loadMore}
          initialNumToRender={20}
          getItemLayout={this.getItemLayout}
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
        initialNumToRender={20}
        getItemLayout={this.getItemLayout}
      />
    )
  }

  render() {
    let isMultiData =
      this.state.tableData[0].data instanceof Array &&
      this.state.tableData[0].data.length > 1 &&
      this.state.tableData[0].data[0] instanceof Array
    return (
      <KeyboardAvoidingView
        // behavior={this.state.behavior}
        behavior="padding"
        enabled
        style={styles.container}
      >
        <View style={styles.container}>
          {this.props.type === 'MULTI_DATA' && isMultiData
            ? this.renderMultiDataTable()
            : this.renderSingleDataTable()}
        </View>
      </KeyboardAvoidingView>
    )
  }
}

LayerAttributeTable.Type = {
  ATTRIBUTE: 'ATTRIBUTE',
  EDIT_ATTRIBUTE: 'EDIT_ATTRIBUTE',
  SINGLE_DATA: 'SINGLE_DATA', // 单个对象的属性，两列：'名称', '属性值'
  MULTI_DATA: 'MULTI_DATA', // 多个对象的属性，多列
}
