import * as React from 'react'
import { StyleSheet } from 'react-native'
import { TreeList } from '../../../../components'
import { Toast } from '../../../../utils'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'
export default class PlotList extends React.Component {
  props: {
    user: Object,
    template: Object,
    layers: Object,
    style?: Object,
    showToolbar: () => {},
    setCurrentPlotInfo: () => {},
    setEditLayer: () => {},
    // getSymbolTemplates: () => {},
    setCurrentTemplateList: () => {},
    setCurrentPlotList: () => {},
    goToPage: () => {},
  }

  static defaultProps = {
    type: 'Normal', // Normal | Template
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      showList: false,
    }
  }

  getData = () => {
    if (
      this.props.template.template.symbols &&
      this.props.template.template.symbols.length > 0
    ) {
      let dealData = function(list) {
        let mList = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].feature && list[i].feature.length > 0) {
            list[i].id = list[i].code
            list[i].childGroups = []
            list[i].childGroups = dealData(list[i].feature)
            mList.push(list[i])
          }
        }
        return mList
      }
      let data = dealData(this.props.template.template.symbols)
      return data
    }
  }

  action = ({ data }) => {
    Toast.show(
      //'当前选择为:'
      getLanguage(global.language).Prompt.THE_CURRENT_SELECTION +
        data.$.code +
        ' ' +
        data.$.name,
    )
    this.props.setCurrentPlotList(data)
    let tempSymbol = Object.assign({}, data.$)
    this.props.setCurrentPlotInfo(
      tempSymbol,
      () => this.props.goToPage && this.props.goToPage(1),
    )
  }

  render() {
    return (
      <TreeList
        style={[styles.container, this.props.style]}
        itemTextColor={color.themeText2}
        itemTextSize={color.themeText2}
        separator={true}
        // data={this.state.data}
        data={this.getData()}
        onPress={this.action}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    backgroundColor: color.bgW,
  },
})
