/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { scaleSize, dataUtil } from '../../../../../utils'
import { color } from '../../../../../styles'
import { Table, TableWrapper, Row, Rows, Col, Cell } from 'react-native-table-component'
import { FieldType } from 'imobile_for_javascript'

import styles from './styles'

const COL_HEIGHT = scaleSize(80)

export default class ThemeTable extends React.Component {

  props: {
    mapChange: () => {},
    showSaveDialog: () => {},
    add: () => {},
    edit: () => {},
    selectRow: () => {},

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

  dealData = (data, height = COL_HEIGHT) => {
    let dataList = [], colHeight = []

    // if (data instanceof Object) {
    //   dataList = []
    //   Object.keys(data).forEach((item, index) => {
    //     dataList.push([
    //       key,
    //       {
    //         index: index,
    //         key: key,
    //         data: data[key],
    //         type: dataUtil.getType(data[key].value),
    //       },
    //     ])
    //     colHeight.push(height)
    //   })
    //   return {dataList, colHeight}
    // }
    
    data.forEach(item => {
      let arr = []
      Object.keys(item).forEach((key, index) => {
        arr.push({
          key: key,
          index: index,
          value: item[key],
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
    return this.state.modifiedData
  }

  setData = data => {
    // this.originData = changeOrigin ? { ...data } : {}
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
    // item.data.value = value
    let newTableData = this.state.tableData
    newTableData[index][item.index].value = value
    let modified = this.state.modifiedData
    modified[item.key] = item
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
                    <TableWrapper key={index} style={styles.row}>
                      {
                        rowData.map((cellData, cellIndex) => {
                          return (
                            <Cell
                              flex={this.props.flexArr[cellIndex]}
                              key={cellIndex}
                              data={
                                cellIndex.value
                                // cellIndex === 0 || cellIndex === 1
                                //   ? cellData
                                //   : this.renderInput(cellData, index)
                              }
                              textStyle={styles.text}/>
                          )
                        })
                      }
                    </TableWrapper>
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