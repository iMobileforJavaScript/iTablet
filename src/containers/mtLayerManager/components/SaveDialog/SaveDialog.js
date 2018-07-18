/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, TextInput } from 'react-native'
import { Dialog } from '../../../../components'
import styles from './styles'

export default class SaveDialog extends PureComponent {

  props: {
    confirmAction: () => {},
    cancelAction: () => {},
    mapName: string,
    wsName: string,
    path: string,
    showWsName: boolean,
  }

  static defaultProps = {
    showWsName: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      mapName: props.mapName || '',
      wsName: props.wsName || '',
      path: props.path || '',
    }
  }

  //控制Modal框是否可以展示
  setDialogVisible(visible) {
    this.dialog && this.dialog.setDialogVisible(visible)
  }
  
  confirm = () => {
    this.props.confirmAction && this.props.confirmAction({
      mapName: this.state.mapName,
      wsName: this.state.wsName,
      path: this.state.path,
    })
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
          underlineColorAndroid={'transparent'}
          accessible={true}
          accessibilityLabel={placeholder}
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
        cancelAction={this.cancel}>
        <View style={styles.item}>
          <Text style={styles.title}>地图名称</Text>
          <TextInput
            underlineColorAndroid={'transparent'}
            accessible={true}
            accessibilityLabel={'地图名称'}
            onChangeText={text => {
              this.setState({
                mapName: text,
              })
            }}
            defaultValue={this.state.mapName}
            // editable={!!value}
            placeholder={'请输入地图名称'}
            style={styles.textInputStyle} />
        </View>
        <View style={styles.separator} />
        {
          this.props.showWsName && <View style={styles.item}>
            <Text style={styles.title}>工作空间名称</Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              accessible={true}
              accessibilityLabel={'工作空间名称'}
              onChangeText={text => {
                this.setState({
                  wsName: text,
                })
              }}
              defaultValue={this.state.wsName}
              // editable={!!value}
              placeholder={'请输入工作空间名称'}
              style={styles.textInputStyle} />
          </View>
        }
        <View style={styles.separator} />
        <View style={styles.item}>
          <Text style={styles.title}>储存路径</Text>
          <TextInput
            underlineColorAndroid={'transparent'}
            accessible={true}
            accessibilityLabel={'储存路径'}
            onChangeText={text => {
              this.setState({
                path: text,
              })
            }}
            defaultValue={this.state.path}
            // editable={!!value}
            placeholder={'请输入储存路径'}
            style={styles.textInputStyle} />
        </View>
      </Dialog>
    )
  }

}
