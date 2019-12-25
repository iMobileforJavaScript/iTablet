/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import {
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { scaleSize, dataUtil } from '../../../../utils'
import { color } from '../../../../styles'
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cell,
} from 'react-native-table-component'
import { getLanguage } from '../../../../language'
// import { SScene } from 'imobile_for_reactnative'
// import NavigationService from '../../../NavigationService'
import styles from './styles'

const COL_HEIGHT = scaleSize(80)

export default class LayerAttributeTable extends React.Component {
  props: {
    add: () => {},
    edit: () => {},
    selectRow: () => {},
    refresh?: () => {},
    loadMore?: () => {},

    selectable: boolean,
    hasIndex: boolean,

    tableHead: Array,
    tableTitle: Array,
    tableData: any,
    widthArr: Array,
    colHeight: number,
    type: string,
    data: Object, // data为数组，横向显示；data为对象，纵向显示
    headStyle?: Object,
    rowStyle?: Object,
    normalRowStyle: Object,
    selectRowStyle?: Object,
    style?: Object,
  }

  static defaultProps = {
    type: 'ATTRIBUTE',
    tableHead: [],
    tableTitle: [],
    tableData: [],
    // widthArr: [40, 200, 200, 100, 100, 100, 80],
    widthArr: [],
    selectable: true,
    hasIndex: false,
  }

  constructor(props) {
    super(props)
    let { dataList, colHeight, widthArr } = this.dealData(
      props.tableTitle,
      props.data,
    )
    let tableHead = this.props.hasIndex
      ? [
        getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO,
        ...props.tableHead,
      ]
      : props.tableHead
    this.state = {
      colHeight: colHeight,
      widthArr: props.widthArr.length > 0 ? props.widthArr : widthArr,
      modifiedData: {},
      tableTitle: props.tableTitle,
      // tableData: props.tableData,
      tableHead: tableHead,
      // tableTitle: titleList,
      tableData: dataList,
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
      let { dataList, colHeight, widthArr } = this.dealData(
        this.props.tableTitle,
        this.props.data,
      )

      this.setState({
        colHeight: colHeight,
        widthArr:
          this.props.widthArr.length > 0 ? this.props.widthArr : widthArr,
        tableData: dataList,
        tableHead: this.props.tableHead,
      })
      this.scrollView &&
        this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
      this.scrollView2 &&
        this.scrollView2.scrollTo({ x: 0, y: 0, animated: false })
    }
  }

  dealData = (title = [], data, height = COL_HEIGHT) => {
    let titleList = title,
      dataList = data,
      colHeight = [],
      widthArr = []
    if (data instanceof Object) {
      titleList = []
      dataList = []
      // Object.keys(data).forEach((key, index) => {
      //   titleList.push(key)
      //   dataList.push([
      //     // key,
      //     data[key].fieldInfo.caption,
      //     {
      //       index: 1,
      //       key: key,
      //       data: data[key],
      //       type: dataUtil.getType(data[key].value),
      //     },
      //   ])
      //   colHeight.push(height)
      // })

      for (let i = 0; i < data.length; i++) {
        let arr = [],
          rowData = {}
        if (this.props.hasIndex) {
          arr.push(i + 1) // 序号
          i === 0 && widthArr.push(100)
        }
        let item = data[i]
        if (item instanceof Array) {
          for (let j = 0; j < item.length; j++) {
            // arr.push(item[j].name)
            arr.push(item[j].value)
            i === 0 && widthArr.push(100)
          }
          // titleList.push(item.name)
          rowData = {
            index: i,
            arr: arr,
            data: item,
          }
          dataList.push(rowData)
        } else {
          dataList.push([
            // key,
            item.name,
            {
              index: 1,
              key: item.name,
              value: item.value,
              data: item,
              type: dataUtil.getType(item.value),
            },
          ])
          titleList.push(item.name)
          // colHeight.push(height)
          // rowData = {
          //   index: i,
          //   arr: arr,
          //   data: item,
          // }
        }

        colHeight.push(height)
      }
      return { titleList, dataList, colHeight, widthArr }
    }

    for (let i = 0; i < dataList.length; i++) {
      colHeight[i] = height
    }
    return { titleList, dataList, colHeight }
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
    let { titleList, dataList, colHeight } = this.dealData(
      this.props.tableTitle,
      data,
    )
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
    arr.push(obj.caption)
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
      this.props.selectRow && this.props.selectRow(data, index)
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
            data={this.state.tableTitle}
            style={styles.title}
            heightArr={this.state.colHeight}
            textStyle={styles.text}
          />
          <Rows
            data={this.state.tableData}
            flexArr={[1, 1]}
            style={styles.row}
            textStyle={styles.text}
          />
        </TableWrapper>
      )
    } else {
      return (
        <Rows
          data={this.state.tableData}
          style={styles.row}
          textStyle={styles.text}
        />
      )
    }
  }

  renderNormalTable = () => {
    return (
      <View style={{ flex: 1 }}>
        <Table borderStyle={styles.border}>
          <Row
            flexArr={[1, 1]}
            // widthArr={this.state.widthArr}
            data={this.state.tableHead}
            style={styles.head}
            textStyle={styles.headerText}
          />
        </Table>
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          style={styles.dataWrapper}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.props.refresh &&
                  this.setState({ refreshing: true }, () => {
                    this.props.refresh(() => {
                      this.setState({ refreshing: false })
                    })
                  })
              }}
            />
          }
        >
          <Table borderStyle={styles.border}>
            {this.state.tableData.map((rowData, index) => {
              let _rowData = rowData.arr ? rowData.arr : rowData
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => {
                    // console.log(index)
                    // SScene.flyToFeatureById(index)
                    // NavigationService.goBack()
                  }}
                >
                  <TableWrapper
                    key={index}
                    style={[styles.row, this.props.normalRowStyle]}
                    borderColor={color.borderLight}
                  >
                    {_rowData.map((cellData, cellIndex) => {
                      // let isSystemField =
                      //   cellIndex !== 0 &&
                      //   cellData.key.toLowerCase().indexOf('id') === 0

                      // data={
                      //   cellIndex === 0
                      //     ? cellData
                      //     : isSystemField
                      //       ? cellData.data.value === undefined
                      //         ? ''
                      //         : cellData
                      //       : this.renderInput(cellData, index)
                      // }
                      let value = cellData
                      if (
                        cellData instanceof Object &&
                        !(cellData instanceof Array)
                      ) {
                        value = cellData.value
                      }

                      return (
                        <Cell
                          key={cellIndex}
                          borderColor={color.borderLight}
                          data={value}
                          textStyle={styles.text}
                        />
                      )
                    })}
                  </TableWrapper>
                </TouchableOpacity>
              )
            })}
          </Table>
        </ScrollView>
      </View>
    )
  }

  renderScrollTable = () => {
    if (
      !this.state.tableData[0] ||
      !this.state.tableData[0].data ||
      !this.state.tableData[0].arr
    ) {
      return null
    }
    return (
      <ScrollView
        ref={ref => (this.scrollView = ref)}
        style={{ flex: 1 }}
        horizontal={true}
      >
        <View>
          <Table borderStyle={styles.border}>
            <Row
              // flexArr={[1, 1]}
              data={this.state.tableHead}
              widthArr={this.state.widthArr}
              style={[styles.head, this.props.headStyle]}
              textStyle={styles.headerText}
            />
          </Table>
          <ScrollView
            ref={ref => (this.scrollView2 = ref)}
            style={styles.dataWrapper}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.props.refresh &&
                    this.setState({ refreshing: true }, () => {
                      this.props.refresh(() => {
                        this.setState({ refreshing: false })
                      })
                    })
                }}
              />
            }
          >
            <Table borderStyle={styles.border}>
              {this.state.tableData.map((rowData, index) => {
                // let data = rowData && rowData[1].data && rowData[1].data.fieldInfo || {}
                let data = rowData.data
                let arr = rowData.arr
                // let arr = this.dealEditCellData(data, index)
                const selectStyle = this.props.rowStyle || styles.row
                const selectRowStyle =
                  this.props.selectRowStyle || styles.selectRow
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={index}
                    onPress={() => this.selectRow(index, data)}
                  >
                    <TableWrapper
                      key={index}
                      borderColor={color.borderLight}
                      style={[
                        selectStyle,
                        // index % 2 === 1 && { backgroundColor: color.grayLight },
                        this.state.currentSelect === index && selectRowStyle,
                      ]}
                    >
                      {arr.map((cellData, cellIndex) => {
                        return (
                          <Cell
                            width={this.state.widthArr[cellIndex]}
                            key={cellIndex}
                            data={cellData}
                            borderColor={color.borderLight}
                            textStyle={[
                              styles.text,
                              this.state.currentSelect === index &&
                                styles.selectText,
                            ]}
                          />
                        )
                      })}
                    </TableWrapper>
                  </TouchableOpacity>
                )
              })}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={this.state.behavior}
        style={styles.container}
      >
        <View style={[styles.container, this.props.style]}>
          {this.state.widthArr.length > 0 ? (
            this.props.type === 'EDIT_ATTRIBUTE' ? (
              this.renderScrollTable()
            ) : (
              this.renderNormalTable()
            )
          ) : (
            <View style={{ flex: 1 }} />
          )}
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
  MAP3D_ATTRIBUTE: 'MAP3D_ATTRIBUTE',
}
