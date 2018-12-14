import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { TreeList } from '../../../../components'
import { Toast } from '../../../../utils'
import { ConstToolType } from '../../../../constants'

import fs from 'react-native-fs'
import xml2js from 'react-native-xml2js'
let parser = new xml2js.Parser()
import { Utility, SMap, Action, ThemeType } from 'imobile_for_reactnative'

export default class Temple extends React.Component {
  props: {
    user: Object,
    template: Object,
    layers: Object,
    style?: Object,
    showBox: () => {},
    showToolbar: () => {},
    setCurrentTemplateInfo: () => {},
    setEditLayer: () => {},
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
    try {
      setTimeout(() => {
        let tempPath = this.props.template.path.substr(0, this.props.template.path.lastIndexOf('/') + 1)
        Utility.getPathListByFilter(tempPath, {
          type: 'xml',
        }).then(xmlList => {
          if (xmlList && xmlList.length > 0) {
            let xmlInfo = xmlList[0]
            Utility.appendingHomeDirectory(xmlInfo.path).then(xmlPath => {
              fs.readFile(xmlPath).then(data => {
                parser.parseString(data, (err, result) => {
                  this.setState({
                    data: result.featureSymbol.template[0].feature,
                    showList: true,
                  })
                })
              })
            })
          }
        })
      }, 300)
    } catch (e) {
      console.warn('e:' + e)
    }
  }

  action = ({data}) => {
    Toast.show('当前选择为:' + data.$.code + " " + data.$.name)
    // this.props.showBox && this.props.showBox(true)
    this.props.setCurrentTemplateInfo(data)

    // 找到对应的图层
    let layer, type, actionType, toolbarType
    for (let i = 0; i < this.props.layers.length; i++) {
      let _layer = this.props.layers[i]
      if (_layer.datasetName === data.$.datasetName) {
        if (_layer.themeType === ThemeType.UNIQUE || _layer.themeType === 0) {
          layer = _layer
          type = data.$.type
          break
        }
      }
    }
    this.showToolbar && this.showToolbar(type)
    // 设置对应图层为可编辑
    if (layer) {
      switch (type) {
        case 'Region':
          actionType = Action.CREATEPOLYGON
          toolbarType = ConstToolType.MAP_COLLECTION_CONTROL_REGION
          break
        case 'Line':
          actionType = Action.CREATEPOLYLINE
          toolbarType = ConstToolType.MAP_COLLECTION_CONTROL_LINE
          break
        case 'Point':
          actionType = Action.CREATEPOINT
          toolbarType = ConstToolType.MAP_COLLECTION_CONTROL_POINT
          break
        default:
          actionType = Action.PAN
      }
      this.props.showToolbar(true, toolbarType, {
        isFullScreen: false,
        height: ConstToolType.HEIGHT[0],
      })
      this.props.setEditLayer(layer, () => {
        SMap.setAction(actionType)
      })
    }
  }

  render() {
    if (!this.state.showList) return <View/>
    return (
      <TreeList
        style={[styles.container, this.props.style]}
        data={this.state.data}
        onPress={this.action}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    // backgroundColor: color.subTheme,
  },
})
