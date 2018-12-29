/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'
import { Dialog } from '../../../../components/index'
import styles from './styles'

export default class ModifiedDialog extends PureComponent {
  props: {
    confirmAction: () => {},
    cancelAction: () => {},
    info: string,
  }

  constructor(props) {
    super(props)
    this.state = {
      info: props.info,
    }
  }

  //控制是否可以展示
  setDialogVisible(visible, info) {
    if (info) {
      this.setState(
        {
          info: info,
        },
        () => {
          this.dialog && this.dialog.setDialogVisible(visible)
        },
      )
    } else {
      this.dialog && this.dialog.setDialogVisible(visible)
    }
  }

  confirm = () => {
    this.props.confirmAction && this.props.confirmAction()
  }

  cancel = () => {
    this.props.cancelAction && this.props.cancelAction()
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        style={{ marginVertical: 15 }}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={'是'}
        cancelBtnTitle={'否'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{this.state.info}</Text>
        </View>
      </Dialog>
    )
  }
}
