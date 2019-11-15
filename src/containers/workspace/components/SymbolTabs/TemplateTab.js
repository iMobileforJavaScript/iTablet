import * as React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { color, size } from '../../../../styles'
import { TableList } from '../../../../components'
import { scaleSize, Toast } from '../../../../utils'
import { ToolbarType } from '../../../../constants'
import { ThemeType, SMCollectorType } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import { collectionModule } from '../ToolBar/modules'

export default class TemplateTab extends React.Component {
  props: {
    data: Array,
    user: Object,
    layers: Object,
    setCurrentTemplateInfo: () => {},
    showToolbar: () => {},
    device: Object,
  }

  constructor(props) {
    super(props)
    // this.state = {
    //   data: props.data,
    // }
  }

  componentDidMount() {}

  action = ({ item }) => {
    Toast.show(
      //'当前选择为:'
      getLanguage(global.language).Prompt.THE_CURRENT_SELECTION +
        item.code +
        ' ' +
        item.name,
    )

    // 找到对应的图层
    let layer, type, toolbarType
    for (let i = 0; i < this.props.layers.length; i++) {
      let _layer = this.props.layers[i]
      if (_layer.datasetName === item.datasetName) {
        if (_layer.themeType === ThemeType.UNIQUE || _layer.themeType === 0) {
          layer = _layer
          type = item.type
          break
        }
      }
    }
    // 设置对应图层为可编辑
    if (layer) {
      switch (type) {
        case 'Region':
          // toolbarType = ConstToolType.MAP_COLLECTION_REGION
          toolbarType = SMCollectorType.REGION_HAND_POINT
          break
        case 'Line':
          // toolbarType = ConstToolType.MAP_COLLECTION_LINE
          toolbarType = SMCollectorType.LINE_HAND_POINT
          break
        case 'Point':
          // toolbarType = ConstToolType.MAP_COLLECTION_POINT
          toolbarType = SMCollectorType.POINT_HAND
          break
      }
      let tempSymbol = Object.assign({}, item, { layerPath: layer.path })
      this.props.setCurrentTemplateInfo(tempSymbol)
      // CollectionData.showCollection(toolbarType)
      collectionModule().actions.showCollection(toolbarType)
      // this.props.showToolbar(true, toolbarType, {
      //   isFullScreen: false,
      //   height: ConstToolType.HEIGHT[0],
      //   cb: () => {
      //     let tempSymbol = Object.assign({}, item, { layerPath: layer.path })
      //     this.props.setCurrentTemplateInfo(tempSymbol)
      //   },
      // })
    }
  }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    let icon
    switch (item.type) {
      case 'Region':
        icon = require('../../../../assets/map/icon-shallow-polygon_black.png')
        break
      case 'Line':
        icon = require('../../../../assets/map/icon-shallow-line_black.png')
        break
      case 'Point':
        icon = require('../../../../assets/map/icon-shallow-dot_black.png')
        break
    }
    return (
      <TouchableOpacity
        style={styles.listItem}
        key={item.code}
        onPress={() => this.action({ item, rowIndex, cellIndex })}
      >
        <Image source={icon} style={styles.listItemImg} />
        <View style={styles.listItemContent}>
          <Text
            style={styles.listItemName}
            numberOfLines={2}
            ellipsizeMode={'tail'}
          >
            {item.name}
          </Text>
          <Text
            style={styles.listItemSubTitle}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {item.code}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  _keyExtractor = (item, index) => index + '-' + item.title

  render() {
    return (
      <TableList
        style={styles.container}
        data={this.props.data}
        type={ToolbarType.scrollTable}
        numColumns={3}
        renderCell={this._renderItem}
        device={this.props.device}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgW,
  },
  listItem: {
    height: scaleSize(64),
    // width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.bgW,
    paddingHorizontal: scaleSize(30),
    flexDirection: 'row',
  },
  listItemImg: {
    height: scaleSize(64),
    width: scaleSize(64),
  },
  listItemContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  listItemName: {
    minHeight: scaleSize(32),
    width: scaleSize(160),
    color: color.font_color_white,
    fontSize: size.fontSize.fontSizeSm,
  },
  listItemSubTitle: {
    height: scaleSize(32),
    width: scaleSize(160),
    color: color.themeText2,
    fontSize: size.fontSize.fontSizeSm,
  },
})
