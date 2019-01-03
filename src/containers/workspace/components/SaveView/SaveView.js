/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Button } from '../../../../components'
import { scaleSize } from '../../../../utils'
import { color, size, zIndexLevel } from '../../../../styles'

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: zIndexLevel.FOUR,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(80, 80, 80, 1)',
  },
  item: {
    flex: 1,
    backgroundColor: color.subTheme,
    height: scaleSize(60),
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.themeText,
  },
})

export default class MT_layerManager extends React.Component {
  props: {
    save?: () => {},
    notSave?: () => {},
    cancel?: () => {},
    backHide?: boolean,
    animated?: boolean,
  }

  static defaultProps = {
    animated: 'fade',
    backHide: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  save = () => {
    this.props.save && this.props.save()
    this.setVisible(false)
  }

  notSave = () => {
    this.props.notSave && this.props.notSave()
    this.setVisible(false)
  }

  cancel = () => {
    this.props.cancel && this.props.cancel()
    this.setVisible(false)
  }

  setVisible = visible => {
    if (this.state.visible === visible) return
    this.setState({
      visible,
    })
  }

  getVisible = () => {
    return this.state.visible
  }

  render() {
    let animationType = this.props.animated ? 'fade' : 'none'
    return (
      <Modal
        animationType={animationType}
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          //点击物理按键需要隐藏对话框
          if (this.props.backHide) {
            this.setVisible(false)
          }
        }}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={this.cancel}
        >
          <View style={styles.container}>
            <View style={styles.item}>
              <Text style={styles.title}>是否保存当前地图？</Text>
            </View>
            <Button
              style={styles.item}
              titleStyle={styles.title}
              title="保存"
              onPress={this.save}
              activeOpacity={0.5}
            />
            <Button
              style={[styles.item, { marginTop: scaleSize(1) }]}
              titleStyle={styles.title}
              title="不保存"
              onPress={this.notSave}
              activeOpacity={0.5}
            />
            <Button
              style={[styles.item, { marginTop: scaleSize(10) }]}
              titleStyle={styles.title}
              title="取消"
              onPress={this.cancel}
              activeOpacity={0.5}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
