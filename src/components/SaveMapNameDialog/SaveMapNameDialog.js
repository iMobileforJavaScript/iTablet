/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, TextInput } from 'react-native'
import { Dialog } from '../../components'
import styles from './styles'
import { ConstPath } from '../../constants'

export default class SaveMapNameDialog extends PureComponent {
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
      path: props.path || ConstPath.LocalDataPath,
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (JSON.stringify(nextProps.mapName) !== JSON.stringify(this.props.mapName)) {
  //     this.setState({
  //       mapName: nextProps.mapName,
  //     })
  //   } else if (JSON.stringify(nextProps.wsName) !== JSON.stringify(this.props.wsName)) {
  //     this.setState({
  //       wsName: nextProps.wsName,
  //     })
  //   } else if (JSON.stringify(nextProps.path) !== JSON.stringify(this.props.path)) {
  //     this.setState({
  //       path: nextProps.path,
  //     })
  //   }
  // }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.mapName) !== JSON.stringify(this.props.mapName)
    ) {
      this.setState({
        mapName: this.props.mapName,
      })
    } else if (
      JSON.stringify(prevProps.wsName) !== JSON.stringify(this.props.wsName)
    ) {
      this.setState({
        wsName: this.props.wsName,
      })
    } else if (
      JSON.stringify(prevProps.path) !== JSON.stringify(this.props.path)
    ) {
      this.setState({
        path: this.props.path,
      })
    }
  }

  //控制Modal框是否可以展示
  setDialogVisible(visible) {
    this.dialog && this.dialog.setDialogVisible(visible)
  }

  confirm = () => {
    this.props.confirmAction &&
      this.props.confirmAction({
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
        {title ? <Text style={styles.title}>{title}</Text> : <View />}
        <TextInput
          underlineColorAndroid={'transparent'}
          accessible={true}
          accessibilityLabel={placeholder}
          defaultValue={value}
          // editable={!!value}
          placeholder={placeholder}
          style={styles.textInputStyle}
        />
      </View>
    )
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        style={{ marginVertical: 15 }}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
      >
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
            value={this.state.mapName}
            // editable={!!value}
            placeholder={'请输入地图名称'}
            maxLength={20}
            style={styles.textInputStyle}
          />
        </View>
      </Dialog>
    )
  }
}
