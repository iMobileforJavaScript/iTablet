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
    // inputSelection: Object,
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
    this.state = {
      value: props.value,
      placeholder: props.placeholder,
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

  render() {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        title={this.props.title}
        style={{ marginVertical: 15 }}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={this.props.confirmBtnTitle}
        cancelBtnTitle={this.props.cancelBtnTitle}
        type={Dialog.Type.MODAL}
      >
        <KeyboardAvoidingView behavior="padding" enabled>
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
                this.setState({
                  value: text,
                })
              }}
              // selection={this.props.inputSelection || {
              //   start: this.state.value.length - 1,
              //   end: this.state.value.length - 1,
              // }}
              keyboardAppearance={this.props.keyboardAppearance}
              returnKeyType={this.props.returnKeyType}
            />
          </View>
        </KeyboardAvoidingView>
      </Dialog>
    )
  }
}
