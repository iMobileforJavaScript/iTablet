/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Button } from '../../../../components'
import { scaleSize } from '../../../../utils'
import { color, zIndexLevel, size } from '../../../../styles'

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
    backgroundColor: 'transparent',
  },
  topContainer: {
    flexDirection: 'column',
    backgroundColor: color.contentColorWhite,
  },
  item: {
    flex: 1,
    backgroundColor: color.contentColorWhite,
    height: scaleSize(80),
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    // flex: 1,
    // marginHorizontal: scaleSize(16),
    height: 1,
    backgroundColor: color.separateColorGray,
  },
  title: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: size.fontSize.fontSizeSm,
    color: color.bgG,
  },
  btnTitle: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: size.fontSize.fontSizeXl,
    color: color.contentColorBlack,
  },
})

export default class SaveView extends React.Component {
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
      title: '是否保存当前地图？',
    }
    this.cb = () => {}
  }

  setTitle = title => {
    this.setState({ title: title })
  }

  save = () => {
    (async function() {
      this.props.save && (await this.props.save())
      this.setVisible(false)

      this.cb && typeof this.cb === 'function' && this.cb()
      this.cb = null
    }.bind(this)())
  }

  notSave = () => {
    (async function() {
      this.props.notSave && this.props.notSave()
      this.setVisible(false)

      this.cb && typeof this.cb === 'function' && this.cb()
      this.cb = null
    }.bind(this)())
  }

  cancel = () => {
    this.props.cancel && this.props.cancel()
    this.setVisible(false)
    this.cb = null
  }

  setVisible = (visible, setLoading, cb) => {
    if (this.state.visible === visible) return
    if (setLoading && typeof setLoading === 'function') {
      this._setLoading = setLoading
    }
    this.setState({
      visible,
    })
    this.cb = cb || this.cb
  }

  setLoading = (loading = false, info, extra) => {
    this._setLoading && this._setLoading(loading, info, extra)
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
            this.cb = null
          }
        }}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={this.cancel}
        >
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <View style={styles.item}>
                <Text style={styles.title}>{this.state.title}</Text>
              </View>
              <View style={styles.separator} />
              <Button
                style={styles.item}
                titleStyle={styles.btnTitle}
                title="保存"
                onPress={this.save}
                activeOpacity={0.5}
              />
              <View style={styles.separator} />
              <Button
                style={[styles.item, { marginTop: 1 }]}
                titleStyle={styles.btnTitle}
                title="不保存"
                onPress={this.notSave}
                activeOpacity={0.5}
              />
              <View style={styles.separator} />
              <Button
                style={[styles.item, { marginTop: 1 }]}
                titleStyle={styles.btnTitle}
                title="取消"
                onPress={this.cancel}
                activeOpacity={0.5}
              />
            </View>
            {/*<Button*/}
            {/*style={[styles.item, { marginTop: scaleSize(15) }]}*/}
            {/*titleStyle={styles.btnTitle}*/}
            {/*title="取消"*/}
            {/*onPress={this.cancel}*/}
            {/*activeOpacity={0.5}*/}
            {/*/>*/}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
