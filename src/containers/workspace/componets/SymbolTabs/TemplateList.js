import * as React from 'react'
import { StyleSheet } from 'react-native'
import { TreeList } from '../../../../components'
import { Toast } from '../../../../utils'
// import { ConstToolType } from '../../../../constants'
//
// import { ThemeType } from 'imobile_for_reactnative'

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
    // this.getData()
  }

  // getData = () => {
  //   // 防止读取数据卡屏，先滑动，再加载
  //   setTimeout(() => {
  //     this.props.getSymbolTemplates()
  //   }, 300)
  // }

  action = ({ data }) => {
    Toast.show('当前选择为:' + data.$.code + ' ' + data.$.name)
    // this.props.setCurrentTemplateInfo(data)

    // 找到对应的图层
    // let layer, type, toolbarType
    // for (let i = 0; i < this.props.layers.length; i++) {
    //   let _layer = this.props.layers[i]
    //   if (_layer.datasetName === data.$.datasetName) {
    //     if (_layer.themeType === ThemeType.UNIQUE || _layer.themeType === 0) {
    //       layer = _layer
    //       type = data.$.type
    //       break
    //     }
    //   }
    // }
    // 设置对应图层为可编辑
    // if (layer) {
    //   switch (type) {
    //     case 'Region':
    //       // actionType = Action.CREATEPOLYGON
    //       // toolbarType = ConstToolType.MAP_COLLECTION_CONTROL_REGION
    //       toolbarType = ConstToolType.MAP_COLLECTION_REGION
    //       break
    //     case 'Line':
    //       // actionType = Action.CREATEPOLYLINE
    //       // toolbarType = ConstToolType.MAP_COLLECTION_CONTROL_LINE
    //       toolbarType = ConstToolType.MAP_COLLECTION_LINE
    //       break
    //     case 'Point':
    //       // actionType = Action.CREATEPOINT
    //       // toolbarType = ConstToolType.MAP_COLLECTION_CONTROL_POINT
    //       toolbarType = ConstToolType.MAP_COLLECTION_POINT
    //       break
    //     // default:
    //     //   actionType = Action.PAN
    //   }
    //   this.props.showToolbar(true, toolbarType, {
    //     isFullScreen: false,
    //     height: ConstToolType.HEIGHT[0],
    //   })
    //   // this.props.setEditLayer(layer, () => {
    //   //   SMap.setAction(actionType)
    //   // })
    //   let tempSymbol = Object.assign({}, data, { layerPath: layer.path })
    // this.props.setCurrentTemplateInfo(tempSymbol)

    this.props.setCurrentTemplateList(data)
    this.props.goToPage && this.props.goToPage(1)
    // }
  }

  render() {
    return (
      <TreeList
        style={[styles.container, this.props.style]}
        data={this.props.template.template.symbols}
        onPress={this.action}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
  },
})
