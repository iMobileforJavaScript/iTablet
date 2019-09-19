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
    confirmBtnDisable?: boolean,
    cancelBtnDisable?: boolean,
    cancelBtnStyle?: string,
    confirmBtnStyle?: string,
    confirmAction: () => {},
    cancelAction?: () => {},
    confirmTitleStyle?: StyleSheet,
    cancelTitleStyle?: StyleSheet,
    showBtns?: boolean,
    defaultVisible?: boolean,
    header?: any,
    opacity: any,
    opacityStyle: Object,
    onlyOneBtn: boolean,
    disableBackTouch: boolean,
  }

  static defaultProps = {
    type: 'non_modal',
    activeOpacity: 0.8,
    cancelBtnTitle: '取消',
    confirmBtnTitle: '确定',
    showBtns: true,
    confirmBtnVisible: true,
    cancelBtnVisible: true,
    confirmBtnDisable: false,
    cancelBtnDisable: false,
    onlyOneBtn: false,
    defaultVisible: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: this.props.defaultVisible || false,
      confirmPress: false,
      cancelPress: false,
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
  //     JSON.stringify(nextState) !== JSON.stringify(this.state)
  //   ) {
  //     return true
  //   }
  //   return false
  // }

  //控制Modal框是否可以展示
  setDialogVisible(visible) {
    visible !== this.state.visible && this.setState({ visible: visible })
  }

  getState = () => {
    return this.state
  }

  confirm = () => {
    if (this.props.confirmBtnDisable) return
    this.props.confirmAction && this.props.confirmAction()
  }

  cancel = () => {
    if (this.props.cancelBtnDisable) return
    this.props.cancelAction && this.props.cancelAction()

    this.setDialogVisible(false)
  }

  renderBtns = () => {
    let confirmPressColor = this.state.confirmPress ? { color: '#4680DF' } : {}
    let cancelPressColor = this.state.cancelPress ? { color: '#4680DF' } : {}
    if (!this.props.showBtns) return null
    return (
      <View style={this.props.onlyOneBtn ? styles.oneBtn : styles.btns}>
        {this.props.cancelBtnVisible && (
          <TouchableOpacity
            activeOpacity={this.props.activeOpacity}
            style={[styles.btnStyle, this.props.cancelBtnStyle]}
            onPress={this.cancel}
            onPressIn={() => {
              this.setState({
                cancelPress: true,
              })
            }}
            onPressOut={() => {
              this.setState({
                cancelPress: false,
              })
            }}
          >
            <Text
              style={[
                this.props.cancelBtnDisable
                  ? styles.btnDisableTitle
                  : styles.btnTitle,
                cancelPressColor,
                this.props.cancelTitleStyle,
              ]}
            >
              {this.props.cancelBtnTitle}
            </Text>
          </TouchableOpacity>
        )}
        {this.props.cancelBtnVisible && this.props.confirmBtnVisible && (
          <View style={styles.separateLine} />
        )}
        {this.props.confirmBtnVisible && (
          <TouchableOpacity
            activeOpacity={this.props.activeOpacity}
            style={[styles.btnStyle, this.props.confirmBtnStyle]}
            onPress={this.confirm}
            onPressIn={() => {
              !this.props.confirmBtnDisable &&
                this.setState({
                  confirmPress: true,
                })
            }}
            onPressOut={() => {
              !this.props.confirmBtnDisable &&
                this.setState({
                  confirmPress: false,
                })
            }}
          >
            <Text
              style={[
                this.props.confirmBtnDisable
                  ? styles.btnDisableTitle
                  : styles.btnTitle,
                confirmPressColor,
                this.props.confirmTitleStyle,
              ]}
            >
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
        <View
          disabled={
            this.props.disableBackTouch === undefined
              ? false
              : this.props.disableBackTouch
          }
          //onPress={this.cancel}
          style={[styles.container, this.props.backgroundStyle]}
        >
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
            <View style={styles.childrenContainer}>{this.props.children}</View>
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
            <View style={styles.childrenContainer}>{this.props.children}</View>
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
