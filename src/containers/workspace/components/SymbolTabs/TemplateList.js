import * as React from 'react'
import { StyleSheet } from 'react-native'
import { TreeList } from '../../../../components'
import { Toast } from '../../../../utils'
import { color } from '../../../../styles'
// import { ConstToolType } from '../../../../constants'

import { ThemeType } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language/index'
export default class TemplateList extends React.Component {
  props: {
    user: Object,
    template: Object,
    layers: Object,
    style?: Object,
    showToolbar: () => {},
    setCurrentTemplateInfo: () => {},
    setEditLayer: () => {},
    // getSymbolTemplates: () => {},
    setCurrentTemplateList: () => {},
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

  componentDidMount() {
    this.getData()
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
            list[i].id = list[i].$.code
            list[i].childGroups = []
            if (list[i].feature && list[i].feature.length > 0)
              list[i].childGroups = dealData(list[i].feature)
          }
          mList.push(list[i])
        }
        return mList
      }
      let data = dealData(this.props.template.template.symbols)
      this.setState({
        data,
      })
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
    // this.props.setCurrentTemplateInfo(data)

    // 找到对应的图层
    let layer
    for (let i = 0; i < this.props.layers.length; i++) {
      let _layer = this.props.layers[i]
      if (_layer.datasetName === data.$.datasetName) {
        if (_layer.themeType === ThemeType.UNIQUE || _layer.themeType === 0) {
          layer = _layer
          // type = data.$.type
          break
        }
      }
    }
    // 设置对应图层为可编辑
    // if (layer) {
    // switch (type) {
    //   case 'Region':
    //     toolbarType = ConstToolType.MAP_COLLECTION_REGION
    //     break
    //   case 'Line':
    //     toolbarType = ConstToolType.MAP_COLLECTION_LINE
    //     break
    //   case 'Point':
    //     toolbarType = ConstToolType.MAP_COLLECTION_POINT
    //     break
    //   // default:
    //   //   actionType = Action.PAN
    // }
    // this.props.showToolbar(true, toolbarType, {
    //   isFullScreen: false,
    //   height: ConstToolType.HEIGHT[0],
    // })
    // this.props.showToolbar(true, toolbarType, {
    //   isFullScreen: false,
    //   height: ConstToolType.HEIGHT[0],
    //   cb: () => {
    //     this.props.setCurrentTemplateList(data)
    //     let tempSymbol = Object.assign(
    //       {},
    //       data.$,
    //       { field: data.fields[0].field },
    //       { layerPath: layer.path },
    //     )
    //     this.props.setCurrentTemplateInfo(tempSymbol)
    //   },
    // })
    // this.props.setEditLayer(layer, () => {
    //   SMap.setAction(actionType)
    // })

    this.props.setCurrentTemplateList(data)
    let tempSymbol = Object.assign(
      {},
      data.$,
      { field: data.fields[0].field },
      { layerPath: (layer && layer.path) || '' },
    )
    this.props.setCurrentTemplateInfo(
      tempSymbol,
      () => this.props.goToPage && this.props.goToPage(1),
    )

    // let tempSymbol = Object.assign({}, data, { layerPath: layer.path })
    // this.props.setCurrentTemplateInfo(tempSymbol)

    // }
  }

  render() {
    return (
      <TreeList
        style={[styles.container, this.props.style]}
        itemTextColor={color.themeText2}
        itemTextSize={color.themeText2}
        separator={true}
        // data={this.props.template.template.symbols}
        data={this.state.data}
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
