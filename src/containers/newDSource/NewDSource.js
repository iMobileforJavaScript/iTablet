/*
 Copyright © SuperMap. All rights reserved.
 Author: yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, TextInput, Text } from 'react-native'
import { BtnTwo, Container, Dialog } from '../../components'
import { constUtil, Toast } from '../../utils'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import { EngineType, Workspace } from 'imobile_for_reactnative'
import NavigationService from '../NavigationService'

import styles from './styles'

export default class NewDSource extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.workspacekey = params.workspace
    this.map = params.map
    this.cb = params.cb
    this.defaultpath = ''
    this.state = {
      name: '',
      path: '',
      engineType: EngineType.UDB,
    }
  }

  componentDidMount() {
    (async function() {
      if (!this.workspace) {
        const workspaceModule = new Workspace()
        this.workspace = await workspaceModule.createObj()
      }
      this.defaultpath =
        (await FileTools.appendingHomeDirectory()) + ConstPath.LocalDataPath
      let connInfo = await this.workspace.getConnectionInfo()
      let server = await connInfo.getServer()
      let path = server.substr(0, server.lastIndexOf('/'))
      let isExist = await FileTools.fileIsExist(path)
      this.setState({
        path: isExist ? path : this.defaultpath,
      })
    }.bind(this)())
  }

  checkNewDatasource = () => {
    if (!this.workspace) return
    if (!this.state.name) {
      Toast.show('请输入数据源名称')
      return
    }
    (async function() {
      let strlength = this.state.path.length
      if (
        this.state.path.substring(0, 38) !== this.defaultpath &&
        strlength < 38
      ) {
        Toast.show('此存储路径不符合标准')
        return
      }
      let filePath = this.state.path + '/' + this.state.name + '.udb'
      let isExist = await FileTools.fileIsExist(filePath)
      if (isExist) {
        this.dialog.setDialogVisible(true)
      } else {
        await this.createDatasource()
      }
    }.bind(this)())
  }

  createDatasource = () => {
    (async function() {
      try {
        let filePath = this.state.path + '/' + this.state.name + '.udb'
        let datasource = await this.workspace.createDatasource(
          filePath,
          this.state.engineType,
        )
        if (datasource) {
          this.cb && this.cb()
          this.dialog.setDialogVisible(false)
          Toast.show('新建数据源成功')
          NavigationService.goBack()
        } else {
          this.dialog.setDialogVisible(false)
          Toast.show('新建数据源失败')
        }
      } catch (e) {
        this.dialog.setDialogVisible(false)
        Toast.show('新建数据源失败')
      }
    }.bind(this)())
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: '新建数据源',
          navigation: this.props.navigation,
          headerRight: [],
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.text}>数据源名称</Text>
        </View>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          accessible={true}
          accessibilityLabel={'请输入数据源名称'}
          placeholder="请输入数据源名称"
          placeholderTextColor={constUtil.USUAL_SEPARATORCOLOR}
          onChangeText={text1 => {
            this.setState({ name: text1 })
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>存储路径</Text>
        </View>
        <TextInput
          style={styles.input}
          accessible={true}
          accessibilityLabel={'请输入存储路径'}
          underlineColorAndroid="transparent"
          placeholder="请输入存储路径（不填写则使用默认路径）"
          placeholderTextColor={constUtil.USUAL_SEPARATORCOLOR}
          value={this.state.path}
          onChangeText={text2 => {
            this.setState({ path: text2 })
          }}
        />
        <BtnTwo
          style={styles.btn}
          text="确定"
          btnClick={this.checkNewDatasource}
        />

        <Dialog
          ref={ref => (this.dialog = ref)}
          type={Dialog.Type.MODAL}
          title={'提示'}
          info={'文件已存在，是否要覆盖?'}
          confirmAction={this.createDatasource}
        />
      </Container>
    )
  }
}
