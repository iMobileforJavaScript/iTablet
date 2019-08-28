/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { Text, ScrollView, StyleSheet } from 'react-native'
import Dialog from './Dialog'
import { scaleSize } from '../../utils'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 1000,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    height: scaleSize(200),
    backgroundColor: 'white',
  },
})
export default class BottomDialog extends PureComponent {
  props: {
    confirmAction: () => {},
    cancelAction: () => {},
    workspace: boolean,
    placeholder: string,
    title: string,
    textStyle: string,
  }

  static defaultProps = {
    label: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      value: '',
    }
  }

  setVisible(visible) {
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
        ref={ref => (this.dialog = ref)}
        title={this.props.title}
        style={{ height: scaleSize(240) }}
        opacityStyle={{ height: scaleSize(240) }}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={'保存'}
        cancelBtnTitle={'清除'}
        type={Dialog.Type.MODAL}
      >
        <ScrollView style={styles.content}>
          <Text style={[styles.title, this.props.textStyle]}>
            {this.state.autioText}
          </Text>
        </ScrollView>
      </Dialog>
    )
  }
}
