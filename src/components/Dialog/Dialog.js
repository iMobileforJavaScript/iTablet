/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

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
    confirmBtnVisible: boolean,
    cancelBtnVisible: boolean,
    cancelBtnStyle?: string,
    confirmBtnStyle?: string,
    confirmAction: () => {},
    cancelAction?: () => {},
    confirmTitleStyle?: StyleSheet,
    cancelTitleStyle?: StyleSheet,
    showBtns?: boolean,
    header?: any,
    opacity: any,
    opacityStyle: Object,
    onlyOneBtn: boolean,
  }

  static defaultProps = {
    type: 'non_modal',
    activeOpacity: 0.8,
    cancelBtnTitle: '取消',
    confirmBtnTitle: '确定',
    showBtns: true,
    confirmBtnVisible: true,
    cancelBtnVisible: true,
    onlyOneBtn: false,
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

  getState = () => {
    return this.state
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
      <View style={this.props.onlyOneBtn ? styles.oneBtn : styles.btns}>
        {this.props.cancelBtnVisible && (
          <TouchableOpacity
            activeOpacity={this.props.activeOpacity}
            style={[styles.btnStyle, this.props.cancelBtnStyle]}
            onPress={this.cancel}
          >
            <Text style={[styles.btnTitle, this.props.cancelTitleStyle]}>
              {this.props.cancelBtnTitle}
            </Text>
          </TouchableOpacity>
        )}
        {this.props.confirmBtnVisible && (
          <TouchableOpacity
            activeOpacity={this.props.activeOpacity}
            style={[styles.btnStyle, this.props.confirmBtnStyle]}
            onPress={this.confirm}
          >
            <Text style={[styles.btnTitle, this.props.confirmTitleStyle]}>
              {this.props.confirmBtnTitle}
            </Text>
          </TouchableOpacity>
        )}
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
          {this.props.opacity ? (
            <View
              style={[
                styles.opacityView,
                this.props.opacityStyle,
                { opacity: this.props.opacity },
              ]}
            />
          ) : (
            <View />
          )}
          <KeyboardAvoidingView
            style={[styles.dialogStyle, this.props.style]}
            contentContainerStyle={[styles.dialogStyle, this.props.style]}
            behavior={Platform.OS === 'ios' && 'position'}
          >
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
          </KeyboardAvoidingView>
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
          <KeyboardAvoidingView
            style={[styles.dialogStyle, this.props.style]}
            contentContainerStyle={[styles.dialogStyle, this.props.style]}
            behavior={Platform.OS === 'ios' && 'position'}
          >
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
          </KeyboardAvoidingView>
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
