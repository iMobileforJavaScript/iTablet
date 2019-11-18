import React from 'react'
import { color } from '../../../../../styles'
import { setSpText } from '../../../../../utils'
import { ToolbarType } from '../../../../../constants'
import ToolbarModule from '../modules/ToolbarModule'
import { MTBtn, ColorBtn, TableList } from '../../../../../components'

export default class ToolbarTableList extends React.Component {
  props: {
    type: string,
    containerType: string,
    language: string,
    column?: number,
    device: Object,
    data: Array,
    getMenuAlertDialogRef: () => {},
  }

  itemAction = async item => {
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.tableAction
    ) {
      ToolbarModule.getData().actions.tableAction(item)
    } else if (item.action) {
      item.action(item)
    }
  }

  _renderColorItem = ({ item, rowIndex, cellIndex }) => {
    return (
      <ColorBtn
        key={rowIndex + '-' + cellIndex}
        background={item.background}
        onPress={() => {
          this.itemAction(item)
        }}
        device={this.props.device}
        numColumns={this.props.column}
      />
    )
  }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    let column = this.props.column
    return (
      <MTBtn
        style={{ width: this.props.device.width / column }}
        key={rowIndex + '-' + cellIndex}
        title={item.title}
        textColor={item.disable ? '#A0A0A0' : color.font_color_white}
        textStyle={{ fontSize: setSpText(20) }}
        // size={MTBtn.Size.NORMAL}
        image={item.image}
        background={item.background}
        onPress={() => {
          !item.disable && this.itemAction(item)
        }}
      />
    )
  }

  render() {
    return (
      <TableList
        data={this.props.data}
        numColumns={this.props.column}
        type={this.props.containerType}
        renderCell={
          this.props.containerType === '' ||
          this.props.containerType === ToolbarType.table ||
          this.props.containerType === ToolbarType.scrollTable
            ? this._renderItem
            : this._renderColorItem
        }
        device={this.props.device}
      />
    )
  }
}
