/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'

import styles from './styles'

export default class Dialog extends PureComponent {
  props: {
    type?: string,
    style?: StyleSheet,
    titleStyle?: StyleSheet,
    infoStyle?: StyleSheet,
    backgroundStyle?: StyleSheet,
    children: any,
    title?: string,
    info?: string,
    backHide?: boolean,
    activeOpacity?: number,
    cancelBtnTitle?: string,
    confirmBtnTitle?: string,
    cancelBtnStyle?: string,
    confirmBtnStyle?: string,
    confirmAction: () => {},
    cancelAction?: () => {},
    confirmTitleStyle?: StyleSheet,
    cancelTitleStyle?: StyleSheet,
    showBtns?: boolean,
    header?: any,
  }

  static defaultProps = {
    type: 'non_modal',
    activeOpacity: 0.8,
    cancelBtnTitle: '取消',
    confirmBtnTitle: '确定',
    showBtns: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  //控制Modal框是否可以展示
  setDialogVisible(visible) {
    visible !== this.state.visible && this.setState({ visible: visible })
  }

  confirm = () => {
    this.props.confirmAction && this.props.confirmAction()
  }

  cancel = () => {
    this.props.cancelAction && this.props.cancelAction()

    this.setDialogVisible(false)
  }

  renderBtns = () => {
    if (!this.props.showBtns) return null
    return (
      <View style={styles.btns}>
        <TouchableOpacity
          activeOpacity={this.props.activeOpacity}
          style={[styles.confirmBtnStyle, this.props.style]}
          onPress={this.confirm}
        >
          <Text style={[styles.btnTitle, this.props.confirmTitleStyle]}>
            {this.props.confirmBtnTitle}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={this.props.activeOpacity}
          style={[styles.cancelBtnStyle, this.props.style]}
          onPress={this.cancel}
        >
          <Text style={[styles.btnTitle, this.props.cancelTitleStyle]}>
            {this.props.cancelBtnTitle}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderModal = () => {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          //点击物理按键需要隐藏对话框
          if (this.props.backHide) {
            this.setDialogVisible(false)
          }
        }}
      >
        <View style={[styles.container, this.props.backgroundStyle]}>
          {this.props.header}
          <View style={[styles.dialogStyle, this.props.style]}>
            {this.props.title && (
              <Text style={[styles.title, this.props.titleStyle]}>
                {this.props.title}
              </Text>
            )}
            {this.props.info && (
              <Text style={[styles.info, this.props.infoStyle]}>
                {this.props.info}
              </Text>
            )}
            {this.props.children}
            {this.renderBtns()}
          </View>
        </View>
      </Modal>
    )
  }

  renderNonModal = () => {
    if (this.state.visible) {
      return (
        <View
          // activeOpacity={1}
          // onPress={this.cancel}
          style={[styles.nonModalContainer, this.props.backgroundStyle]}
        >
          {this.props.header}
          <View style={[styles.dialogStyle, this.props.style]}>
            {this.props.title && (
              <Text style={[styles.title, this.props.titleStyle]}>
                {this.props.title}
              </Text>
            )}
            {this.props.info && (
              <Text style={[styles.info, this.props.infoStyle]}>
                {this.props.info}
              </Text>
            )}
            {this.props.children}
            {this.renderBtns()}
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  render() {
    if (this.props.type === 'modal') {
      return this.renderModal()
    } else {
      return this.renderNonModal()
    }
  }
}

Dialog.Type = {
  MODAL: 'modal',
  NON_MODAL: 'non_modal',
}
