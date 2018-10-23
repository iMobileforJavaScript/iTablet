/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, FlatList } from 'react-native'
import { MTBtn } from '../../../../components'
import styles from './styles'

const COLLECTION = 'COLLECTION'
const NETWORK = 'NETWORK'
const EDIT = 'EDIT'

export { COLLECTION, NETWORK, EDIT }

export default class RightToolbar extends React.Component {
  props: {
    style?: any,
    hide?: boolean,
    direction?: string,
    separator?: number,
    type: string,
    mapControl: any,
    mapView: any,
    workspace: any,
    map: any,
    editLayer: any,
    selection: any,
    setLoading: () => {},
    data?: Array,
  }

  static defaultProps = {
    type: COLLECTION,
    hide: false,
    direction: 'column',
    separator: 20,
  }

  constructor(props) {
    super(props)
    let data = props.data || this.getData(props.type)
    this.state = {
      type: props.type,
      data: data,
    }
  }

  changeLayer = () => {}

  showTool = () => {}

  save = () => {}

  publish = () => {}

  getData = type => {
    let data
    switch (type) {
      case COLLECTION:
        data = [
          {
            key: '底图',
            title: '底图',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/mapTools/icon_location.png'),
            selectedImage: require('../../../../assets/mapTools/icon_location_selected.png'),
          },
          {
            key: '工具',
            title: '工具',
            action: this.showTool,
            size: 'large',
            image: require('../../../../assets/mapTools/icon_undo.png'),
            selectedImage: require('../../../../assets/mapTools/icon_undo_selected.png'),
            selectMode: 'flash',
          },
          {
            key: '保存',
            title: '保存',
            action: this.save,
            size: 'large',
            image: require('../../../../assets/mapTools/icon_redo.png'),
            selectedImage: require('../../../../assets/mapTools/icon_redo_selected.png'),
            selectMode: 'flash',
          },
          {
            key: '分享',
            title: '分享',
            action: this.publish,
            size: 'large',
            image: require('../../../../assets/mapTools/icon_redo.png'),
            selectedImage: require('../../../../assets/mapTools/icon_redo_selected.png'),
            selectMode: 'flash',
          },
        ]
    }
    return data
  }

  _renderItem = ({ item, index }) => {
    return (
      <MTBtn
        key={index}
        title={item.title}
        textColor={'black'}
        size={MTBtn.Size.NORMAL}
        image={item.image}
        onPress={item.action}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <View style={styles.separator} />
  }

  _keyExtractor = item => item.key

  render() {
    if (this.props.hide) {
      return null
    }
    return (
      <FlatList
        style={[styles.container, this.props.style]}
        data={this.state.data}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        keyExtractor={this._keyExtractor}
      />
    )
  }
}
