/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView } from 'react-native'
import Dialog from './Dialog'
import { color } from '../../styles'
import styles from './styles'
import { scaleSize, dataUtil } from '../../utils'

export default class InputDialog extends PureComponent {
  props: {
    confirmAction: () => {},
    cancelAction: () => {},
    workspace: boolean,
    placeholder: string,
    title: string,
    label: string,
    value: string,
    defaultValue: string,
    keyboardAppearance: string,
    returnKeyType: string,
    confirmBtnTitle: string,
    cancelBtnTitle: string,
  }

  static defaultProps = {
    label: '',
    value: '',
    keyboardAppearance: 'dark',
    returnKeyType: 'done',
    placeholder: '',
    confirmBtnTitle: '是',
    cancelBtnTitle: '否',
  }

  constructor(props) {
    super(props)
    let { result, error } = dataUtil.isLegalName(props.value, GLOBAL.language)
    this.state = {
      value: props.value,
      placeholder: props.placeholder,
      isLegalName: result,
      errorInfo: error,
    }
    this.params = {} // 临时数据
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.value) !== JSON.stringify(this.props.value) ||
      prevProps.placeholder !== this.props.placeholder
    ) {
      this.setState({
        value: this.props.value,
        placeholder: this.props.placeholder,
      })
    }
  }

  setDialogVisible(visible, params = {}) {
    this.dialog && this.dialog.setDialogVisible(visible, params)
    if (!visible) {
      this.params = {}
      if (this.state.value !== '' || this.state.placeholder !== '') {
        this.setState({
          value: '',
          placeholder: '',
        })
      }
    } else {
      this.params = params
      if (params.value !== undefined || params.placeholder !== undefined) {
        this.setState({
          value: params.value || '',
          placeholder: params.placeholder || '',
        })
      }
    }
  }

  confirm = () => {
    if (!this.state.isLegalName) return
    if (this.params.confirmAction) {
      this.params.confirmAction(this.state.value)
    } else if (this.props.confirmAction) {
      this.props.confirmAction(this.state.value)
    }
  }

  cancel = () => {
    if (this.params.cancelAction) {
      this.params.cancelAction()
    } else if (this.props.cancelAction) {
      this.props.cancelAction()
    }

    this.setDialogVisible(false)
  }

  renderInput = () => {
    return (
      <View style={styles.inputDialogContainer}>
        {this.props.label ? (
          <Text style={styles.label}>{this.props.label}</Text>
        ) : null}
        <TextInput
          accessible={true}
          accessibilityLabel={
            this.props.placeholder ? this.props.placeholder : '输入框'
          }
          style={styles.input}
          placeholder={this.state.placeholder}
          underlineColorAndroid="transparent"
          placeholderTextColor={color.themePlaceHolder}
          value={this.state.value + ''}
          onChangeText={text => {
            let { result, error } = dataUtil.isLegalName(text, GLOBAL.language)
            this.setState({
              isLegalName: result,
              errorInfo: error,
              value: text,
            })
          }}
          keyboardAppearance={this.props.keyboardAppearance}
          returnKeyType={this.props.returnKeyType}
        />
      </View>
    )
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        title={this.props.title}
        style={{ height: scaleSize(250) }}
        opacityStyle={{ height: scaleSize(250) }}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={this.props.confirmBtnTitle}
        cancelBtnTitle={this.props.cancelBtnTitle}
        confirmBtnDisable={!this.state.isLegalName}
      >
        <KeyboardAvoidingView behavior="padding" enabled>
          {this.renderInput()}
          {!this.state.isLegalName && this.state.errorInfo && (
            <View style={styles.errorView}>
              <Text numberOfLines={2} style={styles.errorInfo}>
                {this.state.errorInfo}
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </Dialog>
    )
  }
}
