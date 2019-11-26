import React from 'react'
import { MenuDialog } from '../../../../../components'
import ToolbarModule from '../modules/ToolbarModule'

export default class ToolbarMenuDialog extends React.Component {
  props: {
    type: string,
    themeType: string,
    language: string,
    selectKey: string,
    device: Object,
    mapLegend: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.getData(),
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.type !== nextProps.type ||
      JSON.stringify(this.state.data) !== JSON.stringify(nextState.data)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate() {
    let data = this.getData()
    if (JSON.stringify(data) !== JSON.stringify(this.state.data)) {
      this.setState({
        data: data,
      })
    }
  }

  getData = () => {
    let list = ToolbarModule.getMenuDialogData(
      this.props.type,
      this.props.themeType,
    )
    return list
  }

  render() {
    return (
      <MenuDialog
        ref={ref => (this.menuDialog = ref)}
        data={this.state.data}
        selectKey={this.props.selectKey}
        autoSelect={true}
        device={this.props.device}
        onSelect={item => {
          this.setState({
            selectKey: item.selectKey,
            selectName: item.selectName || item.key,
          })
        }}
      />
    )
  }
}
