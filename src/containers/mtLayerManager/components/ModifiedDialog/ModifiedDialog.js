/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, TextInput } from 'react-native'
import { Dialog } from '../../../../components'
import styles from './styles'

export default class ModifiedDialog extends PureComponent {

  props: {
    confirmAction: () => {},
    cancelAction: () => {},
    workspace: boolean,
  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  //控制是否可以展示
  setDialogVisible(visible) {
    this.dialog && this.dialog.setDialogVisible(visible)
  }
  
  confirm = () => {
    this.props.confirmAction && this.props.confirmAction()
  }
  
  cancel = () => {
    this.props.cancelAction && this.props.cancelAction()
  }

  renderBtns = (title, placeholder, value) => {
    return (
      <View style={styles.item}>
        {
          title ? <Text style={styles.title}>{title}</Text>
            : <View/>
        }
        <TextInput
          accessible={true}
          accessibilityLabel={placeholder}
          underlineColorAndroid={'transparent'}
          defaultValue={value}
          // editable={!!value}
          placeholder={placeholder}
          style={styles.textInputStyle} />
      </View>
    )
  }

  render() {
    return (
      <Dialog
        ref={ref => this.dialog = ref}
        style={{marginVertical: 15}}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={'是'}
        cancelBtnTitle={'否'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>当前地图已修改，是否保存？</Text>
        </View>
      </Dialog>
    )
  }

}
