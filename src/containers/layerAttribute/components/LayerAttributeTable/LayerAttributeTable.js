/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { scaleSize, dataUtil } from '../../../../utils'
import { color } from '../../../../styles'
import { Table, TableWrapper, Row, Rows, Col, Cell } from 'react-native-table-component'
import { FieldType } from 'imobile_for_javascript'

import styles from './styles'

const COL_HEIGHT = scaleSize(80)

export default class LayerAttributeTable extends React.Component {

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
    colHeight: number,
    type: string,
    data: Object,
  }

  static defaultProps = {
    type: 'ATTRIBUTE',
    tableHead: [],
    tableTitle: [],
    tableData: [],
    widthArr: [40, 200, 100, 100, 100, 80],
    selectable: true,
  }

  constructor(props) {
    super(props)
    let {titleList, dataList, colHeight} = this.dealData(props.tableTitle, props.data)
    this.state = {
      colHeight: colHeight,
      widthArr: props.widthArr,
      modifiedData: {},
      tableTitle: props.tableTitle,
      // tableData: props.tableData,
      tableHead: props.tableHead,
      // tableTitle: titleList,
      tableData: dataList,
      currentSelect: -1,
    }
  }

  dealData = (title = [], data, height = COL_HEIGHT) => {
    let titleList = title, dataList = data, colHeight = []

    if (data instanceof Object) {
      titleList = []
      dataList = []
      Object.keys(data).forEach((key, index) => {
        titleList.push(key)
        dataList.push([
          key,
          {
            index: 1,
            key: key,
            data: data[key],
            type: dataUtil.getType(data[key].value),
          },
        ])
        colHeight.push(height)
      })
      return {titleList, dataList, colHeight}
    }

    for (let i = 0; i < dataList.length; i++) {
      colHeight[i] = height
    }
    return {titleList, dataList, colHeight}
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
    newTableData[index][item.index].data.value = value
    let modified = this.state.modifiedData
    modified[item.key] = item
    this.setState({
      tableData: newTableData,
      modifiedData: modified,
    })
  }

  dealEditCellData = (obj, index) => {
    if (Object.keys(obj).length <= 0) return
    let arr = []
    arr.push(index + 1)
    arr.push(obj.name)
    arr.push(obj.type)
    arr.push(obj.maxLength)
    arr.push(obj.defaultValue)
    arr.push(obj.isRequired ? '是' : '否')
    return arr
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
        keyboardType={item.type === 'Number' ? 'numeric' : 'default'}
        defaultValue={item.data.value + ''}
        value={item.data.value + ''}
        underlineColorAndroid={'transparent'}
        style={styles.textInput}
        onChangeText={text => {
          this.modified(item, text, index)
        }}
      />
    )
  }

  renderRow = (rowData, index) => {
    return (
      <Row
        flexArr={[1, 1]}
        // widthArr={this.state.widthArr}
        key={index}
        data={rowData}
        style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
        textStyle={styles.text}
      />
    )
  }

  renderColTable = () => {
    if (this.state.tableTitle && this.state.tableTitle.length > 0) {
      return (
        <TableWrapper style={styles.wrapper}>
          <Col
            data={this.state.tableTitle} style={styles.title} heightArr={this.state.colHeight}
            textStyle={styles.text}/>
          {/*<Rows data={this.state.tableData} flexArr={[1, 1]} style={styles.row} textStyle={styles.text}/>*/}
        </TableWrapper>
      )
    } else {
      return (
        <Rows data={this.state.tableData} style={styles.row} textStyle={styles.text}/>
      )
    }
  }

  renderNormalTable = () => {
    return (
      <View style={{ flex: 1 }}>
        <Table borderStyle={{ borderColor: '#C1C0B9', flex: 1, backgroundColor: 'blue' }}>
          <Row
            flexArr={[1, 1]}
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
                        let isSystemField = cellData.data && cellData.data.fieldInfo && cellData.data.fieldInfo.isSystemField
                        return (
                          <Cell
                            key={cellIndex}
                            data={
                              cellIndex === 0
                                ? cellData
                                : isSystemField
                                  ? (cellData.data.value === undefined ? '' : cellData.data.value)
                                  : this.renderInput(cellData, index)}
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
    )
  }

  renderScrollTable = () => {

    return (
      <ScrollView style={{ flex: 1 }} horizontal={true}>
        <View>
          <Table borderStyle={{ borderColor: '#C1C0B9', flex: 1 }}>
            <Row
              // flexArr={[1, 1]}
              data={this.state.tableHead}
              widthArr={this.state.widthArr}
              style={styles.head}
              textStyle={styles.headerText}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>

            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
              {
                this.state.tableData.map((rowData, index) => {
                  let data = rowData && rowData[1].data && rowData[1].data.fieldInfo || {}
                  let arr = this.dealEditCellData(data, index)
                  return (
                    <TouchableOpacity activeOpacity={0.8} key={index} onPress={() => this.selectRow(index, data)}>
                      <TableWrapper
                        key={index}
                        style={[
                          styles.row,
                          index % 2 === 1 && {backgroundColor: color.grayLight},
                          this.state.currentSelect === index && styles.selectRow,
                        ]}>
                        {
                          arr.map((cellData, cellIndex) => {
                            if (cellIndex === 2) {
                              let type = ''

                              switch (cellData) {
                                case FieldType.WTEXT:
                                case FieldType.CHAR:
                                case FieldType.TEXT:
                                  type = '文本'
                                  break
                                case FieldType.BYTE:
                                case FieldType.INT16:
                                case FieldType.INT32:
                                case FieldType.INT64:
                                case FieldType.LONGBINARY:
                                case FieldType.SINGLE:
                                case FieldType.DOUBLE:
                                  type = '数值'
                                  break
                                case FieldType.BOOLEAN:
                                  type = '布尔'
                                  break
                                case FieldType.DATETIME:
                                  type = '日期'
                                  break
                                default:
                                  type = '未知属性'
                                  break
                              }
                              cellData = type
                            }
                            return (
                              <Cell
                                width={this.state.widthArr[cellIndex]}
                                key={cellIndex}
                                data={cellData}
                                textStyle={[styles.text, this.state.currentSelect === index && styles.selectText]}/>
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
      </ScrollView>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>
        <View style={styles.container}>

          {
            this.props.type === 'EDIT_ATTRIBUTE'
              ? this.renderScrollTable()
              : this.renderNormalTable()
          }
          {/*{this.renderScrollTable()}*/}
          {/*{this.renderNormalTable()}*/}

        </View>
      </KeyboardAvoidingView>
    )
  }
}

LayerAttributeTable.Type = {
  ATTRIBUTE: 'ATTRIBUTE',
  EDIT_ATTRIBUTE: 'EDIT_ATTRIBUTE',
}