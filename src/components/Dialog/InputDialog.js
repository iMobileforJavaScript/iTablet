/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, TextInput } from 'react-native'
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
    inputSelection: Object,
  }

  static defaultProps = {
    label: '',
    value: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
    }
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.value) !== JSON.stringify(this.props.value)) {
      this.setState({
        value: this.props.value,
      })
    }
  }

  setDialogVisible(visible) {
    this.dialog && this.dialog.setDialogVisible(visible)
  }

  confirm = () => {
    this.props.confirmAction && this.props.confirmAction(this.state.value)
  }

  cancel = () => {
    this.props.cancelAction && this.props.cancelAction()
  }

  render() {
    return (
      <Dialog
        ref={ref => this.dialog = ref}
        title={this.props.title}
        style={{marginVertical: 15}}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={'是'}
        cancelBtnTitle={'否'}
        type={Dialog.Type.MODAL}
      >
        <View style={styles.inputDialogContainer}>
          {this.props.label ? <Text style={styles.label}>{this.props.label}</Text> : null}
          <TextInput
            accessible={true}
            accessibilityLabel={this.props.placeholder ? this.props.placeholder : '输入框'}
            style={styles.input}
            placeholder={this.props.placeholder}
            underlineColorAndroid='transparent'
            placeholderTextColor={color.USUAL_SEPARATORCOLOR}
            value={this.state.value + ''}
            onChangeText={text => {
              this.setState({
                value: text,
              })
            }}
            selection={this.props.inputSelection || {
              start: this.state.value.length - 1,
              end: this.state.value.length - 1,
            }}
          />
        </View>
      </Dialog>
    )
  }

}
