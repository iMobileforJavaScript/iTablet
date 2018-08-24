/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native'
import { scaleSize } from '../../../../../utils'
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component'

import styles from './styles'

const COL_HEIGHT = scaleSize(80)

export default class ThemeTable extends React.Component {

  props: {
    mapChange: () => {},
    showSaveDialog: () => {},
    add: () => {},
    edit: () => {},
    selectRow: () => {},
    updageValue: () => {},
    setItemVisible: () => {},
    changeStyle: () => {},

    selectable: boolean,

    tableHead: Array,
    tableTitle: Array,
    tableData: any,
    widthArr: Array,
    flexArr: Array,
    colHeight: number,
    type: string,
    data: Object,
  }

  static defaultProps = {
    type: 'ATTRIBUTE',
    tableHead: ['可见', '风格', '段值', '标题'],
    tableTitle: [],
    tableData: [],
    widthArr: [40, 200, 100, 100, 100, 80],
    flexArr: [1, 2, 1, 2],
    selectable: true,
  }

  constructor(props) {
    super(props)
    let {dataList, colHeight} = this.dealData(props.data)
    this.state = {
      colHeight: colHeight,
      widthArr: props.widthArr,
      modifiedData: {},
      tableTitle: props.tableTitle,
      tableHead: props.tableHead,
      tableData: dataList,
      currentSelect: -1,
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
  //     let {dataList, colHeight} = this.dealData(nextProps.data)
  //     this.setState({
  //       colHeight: colHeight,
  //       tableData: dataList,
  //     })
  //   }
  // }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      let {dataList, colHeight} = this.dealData(this.props.data)
      this.setState({
        colHeight: colHeight,
        tableData: dataList,
      })
    }
  }

  /**
   * 数据中如果有key = 'data'，则不显示在列表中。作为整行的数据
   * @param data
   * @param height
   * @returns {{dataList: Array, colHeight: Array}}
   */
  dealData = (data, height = COL_HEIGHT) => {
    let dataList = [], colHeight = []

    data.forEach((item, rowIndex) => {
      let arr = []
      Object.keys(item).forEach((key, index) => {
        if (key === 'data') return
        arr.push({
          key: key,
          rowIndex: rowIndex,
          index: index,
          value: item[key],
          rowData: item,
        })
      })
      dataList.push(arr)
    })


    for (let i = 0; i < dataList.length; i++) {
      colHeight[i] = height
    }
    return {dataList, colHeight}
  }

  add = () => {
    if (typeof this.props.add === 'function') {
      this.props.add()
    }
  }

  edit = () => {
    if (typeof this.props.edit === 'function') {
      this.props.edit()
    }
  }

  getModifiedData = () => {
    return this.state.tableData
    // return this.state.modifiedData
  }

  setData = data => {
    let {titleList, dataList, colHeight} = this.dealData(this.props.tableTitle, data)
    this.setState({
      titleData: titleList,
      tableData: dataList,
      colHeight: colHeight,
    })
  }

  reset = oldData => {
    let data = this.dealData(this.props.tableTitle, oldData)
    this.setState({
      tableData: data.dataList,
    })
  }

  modified = (item, value, index) => {
    let newTableData = JSON.parse(JSON.stringify(this.state.tableData))
    newTableData[item.rowIndex][index].value = value
    let modified = this.state.modifiedData
    modified[item.rowIndex] = newTableData[item.rowIndex]
    this.setState({
      tableData: newTableData,
      modifiedData: modified,
    })
  }

  selectRow = (index, data) => {
    if (this.props.selectable && this.state.currentSelect !== index) {
      this.setState({
        currentSelect: index,
      })
      this.props.selectRow && this.props.selectRow(data)
    }
  }

  changeStyle = (item, index, cellIndex) => {
    let data = item.rowData.data
    data.color = item.value
    this.props.changeStyle && this.props.changeStyle(data, index, cellIndex)
  }

  renderInput = (item, index) => {
    return (
      <TextInput
        accessible={true}
        accessibilityLabel={item.key}
        // keyboardType={item.type === 'Number' ? 'numeric' : 'default'}
        defaultValue={item.value + ''}
        value={item.value + ''}
        underlineColorAndroid={'transparent'}
        style={styles.textInput}
        onChangeText={text => {
          this.modified(item, text, index)
        }}
      />
    )
  }

  renderVisibleIcon = (item, index) => {
    let image = item.value
      ? require('../../../../../assets/map/icon_visible_selected.png')
      : require('../../../../../assets/map/icon_visible.png')
    return (
      <TouchableOpacity onPress={() => this.modified(item, !item.value, index)} style={styles.imageView}>
        <Image resizeMode={'contain'} style={styles.image} source={image}/>
      </TouchableOpacity>
    )
  }

  renderStyleView = (item, index, cellIndex) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.chooseColorContainer}
        accessible={true}
        accessibilityLabel={item.key}
        onPress={() => this.changeStyle(item, index, cellIndex)}
      >
        <View style={[styles.subChooseColorContainer, {backgroundColor: item.value}]}/>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>
        <View style={styles.container}>
          <Table borderStyle={{ borderColor: '#C1C0B9', flex: 1, backgroundColor: 'blue' }}>
            <Row
              flexArr={this.props.flexArr}
              // widthArr={this.state.widthArr}
              data={this.state.tableHead}
              style={styles.head}
              textStyle={styles.headerText}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
              {
                this.state.tableData.map((rowData, index) => {
                  return (
                    <TouchableOpacity activeOpacity={0.8} key={index} onPress={() => this.selectRow(index, rowData)}>
                      <TableWrapper key={index} style={[styles.row, this.state.currentSelect === index && styles.selectRow]}>
                        {
                          rowData.map((cellData, cellIndex) => {
                            let cell
                            if (cellIndex === 1) {
                              cell = this.renderStyleView(cellData, index, cellIndex)
                            } else if (cellIndex === 2 || cellIndex === 3) {
                              cell = this.renderInput(cellData, cellIndex)
                            }
                            return (
                              <Cell
                                flex={this.props.flexArr[cellIndex]}
                                key={cellIndex}
                                data={cellIndex === 0 ? this.renderVisibleIcon(cellData, cellIndex) : cell}
                                textStyle={styles.text}/>
                            )
                          })
                        }
                      </TableWrapper>
                    </TouchableOpacity>
                  )
                })
              }
            </Table>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    )
  }
}