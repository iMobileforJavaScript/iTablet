/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import React, { Component } from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
import Cell from './Cell'

const ROW_HEIGHT = scaleSize(80)
const CELL_WIDTH = 100

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    height: ROW_HEIGHT,
    backgroundColor: color.white,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    //borderBottomColor: color.bgG,
  },
  cell: {
    height: ROW_HEIGHT,
    backgroundColor: 'transparent',
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCell: {
    height: ROW_HEIGHT,
    backgroundColor: color.selected,
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexCell: {
    height: ROW_HEIGHT,
    backgroundColor: color.itemColorGray,
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: color.themeText2,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  selectedCellText: {
    color: color.white,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  indexCellText: {
    color: color.fontColorWhite,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})

export default class Row extends Component {
  props: {
    data: any,
    index: number,
    buttonIndexes?: Array, // Cell 为button的列的index
    buttonActions?: Array, // Cell 为button的列的点击事件
    buttonTitles?: Array, // Cell 为button列对应的title, buttonTitles必须不为空，buttonIndexes才生效
    selected?: boolean,
    hasInputText?: boolean,
    renderCell?: () => {},
    style?: Object,
    cellStyle?: Object,
    disableCellStyle?: Object, // 不可编辑Cell的样式
    cellTextStyle?: Object,
    selectedCellStyle?: Object, // 被选中行的样式
    selectedCellTextStyle?: Object, // 被选中行字体的样式
    cellWidthArr?: Array, // cell的宽度数组
    indexColumn?: number, // 每一行index所在的列，indexColumn >= 0 则所在列为Text
    indexCellStyle?: any, // 每一行index所在的列，indexColumn >= 0 则所在列样式
    indexCellTextStyle?: any, // 每一行index所在的列，indexColumn >= 0 则所在列文字样式
    onPress?: () => {},
    onFocus?: () => {},
    separatorColor?: string,
    onChangeEnd?: () => {},
    isShowSystemFields?: boolean,
  }

  static defaultProps = {
    separatorColor: color.separateColorGray,
    indexColumn: -1,
    hasInputText: true,
    isShowSystemFields: true,
    selected: false,
    buttonIndexes: [],
    buttonActions: [],
    buttonTitles: [],
  }

  shouldComponentUpdate(nextProps) {
    if (
      this.props.isShowSystemFields !== nextProps.isShowSystemFields ||
      JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data) ||
      this.props.selected !== nextProps.selected
    ) {
      return true
    }
    return false
  }

  _onFocus = evt => {
    this.props.onFocus && this.props.onFocus(evt)
  }
  _action = (iTemView, columnIndex) => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      return this.props.onPress({
        data: this.props.data,
        index: this.props.index,
        columnIndex: columnIndex,
        pressView: iTemView,
      })
    }
  }

  changeEnd = data => {
    if (
      this.props.onChangeEnd &&
      typeof this.props.onChangeEnd === 'function'
    ) {
      this.props.onChangeEnd({
        rowData: this.props.data,
        index: this.props.index,
        columnIndex: data.index,
        cellData: data.data,
        value: data.value,
      })
    }
  }

  _renderCell = (item, index) => {
    let isButton = false, // 属性表cell显示 查看 按钮
      buttonTitle = '',
      buttonAction = () => {}
    if (
      this.props.buttonTitles.length === this.props.buttonIndexes.length &&
      this.props.buttonIndexes.indexOf(index) >= 0 &&
      this.props.buttonTitles.length > 0
    ) {
      isButton = true
      buttonTitle = this.props.buttonTitles[index] || this.props.buttonTitles[0]
      buttonAction =
        this.props.buttonActions[index] || this.props.buttonActions[0]
    }

    let width
    if (this.props.cellWidthArr && this.props.cellWidthArr.length > index) {
      width = this.props.cellWidthArr[index]
    } else if (this.props.data instanceof Array && this.props.data.length > 4) {
      width = CELL_WIDTH
    }
    if (this.props.renderCell && typeof this.props.renderCell === 'function') {
      return this.props.renderCell({ item, index })
    }
    // let isLastCell = isSingleData
    //   ? index === 1
    //   : this.props.data.length - 1 === index
    let isSingleData =
      // typeof item !== 'object' ||
      item === null || item === undefined || item.fieldInfo === undefined
    // let value = isSingleData ? item : item.value
    let value = item instanceof Object ? item.value : item
    let editable, isRequired, defaultValue
    if (isSingleData) {
      // 单个属性，第一列为名称
      if (index === 0) {
        editable = false
      } else {
        let isHead = this.props.data.fieldInfo === undefined
        editable = !isHead && !this.props.data.fieldInfo.isSystemField
        isRequired = !isHead && this.props.data.fieldInfo.isRequired
        defaultValue =
          !isHead && this.props.data.fieldInfo.defaultValue !== undefined
            ? this.props.data.fieldInfo.defaultValue
            : ''
      }
    } else {
      editable = item.fieldInfo && !item.fieldInfo.isSystemField
      isRequired = item.fieldInfo && item.fieldInfo.isRequired
      defaultValue =
        item.fieldInfo && item.fieldInfo.defaultValue !== undefined
          ? item.fieldInfo.defaultValue
          : ''
    }

    let cellStyle = [
        styles.cell,
        this.props.cellStyle,
        !editable && this.props.disableCellStyle,
      ],
      textStyle = [styles.cellText, this.props.cellTextStyle]
    if (this.props.selected) {
      cellStyle = [styles.selectedCell, this.props.selectedCellStyle]
      textStyle = [styles.selectedCellText, this.props.selectedCellTextStyle]
    }
    if (isButton) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          key={index}
          style={[
            cellStyle,
            width ? { width } : { flex: 1 },
            {
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderColor: this.props.separatorColor,
            },
            // { width },
          ]}
          onPress={() =>
            buttonAction({
              data: this.props.data,
              index: this.props.index,
              columnIndex: index,
            })
          }
        >
          <Text
            style={[
              textStyle,
              width && { width: width - 4 },
              { color: color.USUAL_BLUE },
            ]}
          >
            {buttonTitle}
          </Text>
        </TouchableOpacity>
      )
    } else if (
      (this.props.indexColumn >= 0 && this.props.indexColumn === index) ||
      !this.props.hasInputText
    ) {
      if (!this.props.selected) {
        if (this.props.indexCellStyle) {
          cellStyle = [styles.cell, this.props.indexCellStyle]
        }
        if (this.props.indexCellTextStyle) {
          textStyle = [styles.cellText, this.props.indexCellTextStyle]
        }
      }
      let iTemView
      return (
        <TouchableOpacity
          ref={ref => (iTemView = ref)}
          activeOpacity={1}
          key={index}
          style={[
            cellStyle,
            width ? { width } : { flex: 1 },
            {
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderColor: this.props.separatorColor,
            },
            // { width },
          ]}
          onPress={() => this._action(iTemView, index)}
        >
          <Text style={[textStyle, width && { width: width - 4 }]}>
            {value + ''}
          </Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <Cell
          key={index}
          index={index}
          style={[
            !editable && { backgroundColor: color.bgW },
            cellStyle,
            this.props.cellStyle,
            width ? { width } : { flex: 1 },
            {
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderColor: this.props.separatorColor,
            },
            // { width },
          ]}
          textStyle={[
            textStyle,
            this.props.selected && styles.selectedCellText,
          ]}
          value={value}
          data={this.props.data instanceof Array ? item : this.props.data}
          editable={editable}
          overlayStyle={editable && styles.selectedOverlay}
          isRequired={isRequired}
          defaultValue={defaultValue}
          keyboardType={typeof value === 'number' ? 'decimal-pad' : 'default'}
          changeEnd={this.changeEnd}
          onPress={() => this._action(null, index)}
          onFocus={this._onFocus}
        />
      )
    }
  }

  _renderCells = () => {
    if (this.props.data <= 0 || !this.props.data) return null
    let cells = []
    if (this.props.data instanceof Array) {
      this.props.data.forEach((item, index) => {
        if (
          this.props.isShowSystemFields ||
          typeof item === 'string' ||
          typeof item === 'number' ||
          (item.fieldInfo &&
            !(item.fieldInfo && item.fieldInfo.isSystemField)) ||
          (item.isSystemField !== undefined && !item.isSystemField)
        ) {
          cells.push(this._renderCell(item, index))
        }
      })
    } else if (this.props.data instanceof Object) {
      if (
        this.props.isShowSystemFields ||
        !this.props.data.fieldInfo.isSystemField
      ) {
        cells.push(this._renderCell(this.props.data['name'], 0))
        cells.push(this._renderCell(this.props.data['value'], 1))
      }
    }
    return cells
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.rowContainer, this.props.style]}
      >
        {this._renderCells()}
      </TouchableOpacity>
    )
  }
}
