/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Modal, TouchableOpacity } from 'react-native'
import { MTBtn } from '../../../../components'
import { scaleSize } from '../../../../utils'
import styles from './styles'

export default class MoreToolbar extends React.Component {
  props: {
    data?: Array,
    column?: number,
    backHide?: boolean,
  }

  static defaultProps = {
    backHide: true,
    column: 3,
    direction: 'column',
    separator: 20,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      visible: false,
      position: {
        x: 0,
        y: 0,
      },
    }
    this.position = {
      x: 0,
      y: 0,
    }
  }

  showMore = (isShow, e) => {
    this.position = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    }
    this.setState({
      visible: isShow,
      position: {
        x: -1000,
        y: -1000,
      },
    })
  }
  _onLayout = event => {
    //获取根View的宽高，以及左上角的坐标值
    let { x, y, height } = event.nativeEvent.layout
    if (x !== this.position.x || y !== this.position.y) {
      let position = {
        x: scaleSize(80),
        y: this.position.y - height / 2,
      }
      this.setState({
        position: position,
      })
    }
  }

  renderItem = (item, index, isRowFirst = true) => {
    return (
      <MTBtn
        style={!isRowFirst && { marginLeft: scaleSize(10) }}
        key={index}
        title={item.title}
        textColor={'black'}
        size={MTBtn.Size.NORMAL}
        image={item.image}
        onPress={item.action}
      />
    )
  }

  renderTable = () => {
    let rows = [],
      views = []
    this.props.data.forEach((item, index) => {
      let tempIndex = index / this.props.column
      let rowIndex = Math.floor(tempIndex)
      if (rows[rowIndex] === undefined) {
        rows[rowIndex] = []
      }
      rows[rowIndex].push(this.renderItem(item, index, tempIndex % 1 === 0))
    })

    rows.forEach((row, index) => {
      views.push(
        <View style={styles.row} key={index}>
          {row}
        </View>,
      )
    })
    return (
      <View
        style={[
          styles.table,
          { top: this.state.position.y, right: this.state.position.x },
        ]}
        onLayout={this._onLayout}
      >
        {views}
      </View>
    )
  }

  render() {
    if (!this.state.visible) return null
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          //点击物理按键需要隐藏对话框
          if (this.props.backHide) {
            this.setDialogVisible(false)
          }
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={() => {
            this.setState({
              visible: false,
            })
          }}
        >
          {this.renderTable()}
        </TouchableOpacity>
      </Modal>
    )
  }
}
