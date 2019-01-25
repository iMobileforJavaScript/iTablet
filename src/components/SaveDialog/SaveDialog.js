/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, TextInput } from 'react-native'
import { Dialog, Header, TextBtn } from '../../components'
import { color } from '../../styles'
import styles from './styles'

export default class SaveDialog extends PureComponent {
  props: {
    confirmAction: () => {},
    cancelAction: () => {},
    mapName: string,
    wsName: string,
    path: string,
    showWsName: boolean,
    showPath: boolean,
    withoutHeader: boolean,
    headerProps?: Object,
    navigation: Object,
  }

  static defaultProps = {
    showWsName: false,
    showPath: false,
    withoutHeader: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      mapName: props.mapName || '',
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.mapName) !== JSON.stringify(this.props.mapName)
    ) {
      this.setState({
        mapName: this.props.mapName,
      })
    }
  }

  renderHeader = () => {
    return (
      <Header
        ref={ref => (this.containerHeader = ref)}
        navigation={this.props.navigation}
        type="fix"
        headerRight={
          <TextBtn
            btnText="保存"
            textStyle={styles.title}
            btnClick={this.confirm}
          />
        }
        backAction={() => this.setDialogVisible(false)}
        {...this.props.headerProps}
      />
    )
  }

  //控制Modal框是否可以展示
  setDialogVisible(visible, name = '') {
    this.dialog && this.dialog.setDialogVisible(visible)
    if (this.state.mapName !== name) {
      this.setState({
        mapName: name,
      })
    }
  }

  getState = () => {
    return this.dialog && this.dialog.getState()
  }

  confirm = () => {
    this.props.confirmAction &&
      this.props.confirmAction({
        mapName: this.state.mapName,
      })
    this.setDialogVisible(false)
  }

  cancel = () => {
    this.props.cancelAction && this.props.cancelAction()
    this.setDialogVisible(false)
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
        style={styles.container}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        header={this.renderHeader()}
        showBtns={false}
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
            placeholderTextColor={color.themeText}
            defaultValue={this.state.mapName}
            value={this.state.mapName}
            // editable={!!value}
            placeholder={'请输入地图名称'}
            keyboardAppearance="dark"
            style={styles.textInputStyle}
          />
        </View>
        {/*<View style={styles.separator} />*/}
        {/*{*/}
        {/*this.props.showWsName && <View style={styles.item}>*/}
        {/*<Text style={styles.title}>工作空间名称</Text>*/}
        {/*<TextInput*/}
        {/*underlineColorAndroid={'transparent'}*/}
        {/*accessible={true}*/}
        {/*accessibilityLabel={'工作空间名称'}*/}
        {/*onChangeText={text => {*/}
        {/*this.setState({*/}
        {/*wsName: text,*/}
        {/*})*/}
        {/*}}*/}
        {/*defaultValue={this.state.wsName}*/}
        {/*// editable={!!value}*/}
        {/*placeholder={'请输入工作空间名称'}*/}
        {/*style={styles.textInputStyle} />*/}
        {/*</View>*/}
        {/*}*/}
        {/*{ this.props.showPath && <View style={styles.separator} />}*/}
        {/*{*/}
        {/*this.props.showPath && <View style={styles.item}>*/}
        {/*<Text style={styles.title}>储存路径</Text>*/}
        {/*<TextInput*/}
        {/*underlineColorAndroid={'transparent'}*/}
        {/*accessible={true}*/}
        {/*accessibilityLabel={'储存路径'}*/}
        {/*onChangeText={text => {*/}
        {/*this.setState({*/}
        {/*path: text,*/}
        {/*})*/}
        {/*}}*/}
        {/*defaultValue={this.state.path}*/}
        {/*// editable={!!value}*/}
        {/*placeholder={'请输入储存路径'}*/}
        {/*style={styles.textInputStyle} />*/}
        {/*</View>*/}
        {/*}*/}
      </Dialog>
    )
  }
}
