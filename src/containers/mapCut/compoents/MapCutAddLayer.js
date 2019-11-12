/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { PopView } from '../../../components'
import { color } from '../../../styles'
import MapCutAddLayerListItem from './MapCutAddLayerListItem'
import styles from '../styles'

export default class MapCutAddLayer extends React.Component {
  props: {
    layers: Array,
    confirmTitle: String,
    cancelTitle: String,
    configAction?: () => {},
  }

  static defaultProps = {
    confirmTitle: '确定',
    cancelTitle: '取消',
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedData: (new Map(): Map<string, Object>),
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate =
      JSON.stringify(this.props.layers) !== JSON.stringify(nextProps.layers)
    shouldUpdate =
      shouldUpdate || !this.state.selectedData.compare(nextState.selectedData)
    return shouldUpdate
  }

  showModal = isShow => {
    this.addLayerModal && this.addLayerModal.setVisible(isShow)
  }

  onSelect = item => {
    this.setState(state => {
      const selectedData = new Map().clone(state.selectedData)
      if (selectedData.has(item.name)) {
        selectedData.delete(item.name)
      } else {
        selectedData.set(item.name, item)
      }
      return { selectedData }
    })
  }

  _renderItem = ({ item }) => {
    return (
      <MapCutAddLayerListItem
        data={item}
        onSelect={this.onSelect}
        selected={this.state.selectedData.has(item.name)}
      />
    )
  }

  renderBottom = () => {
    return (
      <View style={[styles.settingBtnView, { width: '100%' }]}>
        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() =>
            this.addLayerModal && this.addLayerModal.setVisible(false)
          }
        >
          <Text style={styles.closeText}>{this.props.cancelTitle}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() => {
            this.addLayerModal && this.addLayerModal.setVisible(false)
            this.props.configAction &&
              this.props.configAction(this.state.selectedData)
            this.setState(state => {
              let selectedData = new Map().clone(state.selectedData)
              selectedData.clear()
              return { selectedData }
            })
          }}
        >
          <Text style={styles.closeText}>{this.props.confirmTitle}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <PopView ref={ref => (this.addLayerModal = ref)}>
        <View style={[styles.popView, { width: '100%' }]}>
          <FlatList
            style={styles.dsList}
            initialNumToRender={20}
            ref={ref => (this.ref = ref)}
            renderItem={this._renderItem}
            data={this.props.layers}
            keyExtractor={item => item.name}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  backgroundColor: color.separateColorGray,
                  flex: 1,
                  height: 1,
                }}
              />
            )}
          />
          {this.renderBottom()}
        </View>
      </PopView>
    )
  }
}
