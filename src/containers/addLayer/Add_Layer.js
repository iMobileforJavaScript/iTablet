/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View } from 'react-native'
import BorderInput from '../../containers/register&getBack/border_input'
import { Container, BtnTwo } from '../../components'
import { Toast } from '../../utils'

import styles from './styles'

export default class Add_Layer extends React.Component {

  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { state } = this.props.navigation
    this.workspace = state.params.workspace
    this.map = state.params.map
    switch (state.params.type) {
      case 'point':
        this.type = 1
        break
      case 'line':
        this.type = 3
        break
      case 'area':
        this.type = 5
        break
      case 'text':
        this.type = 7
        break
    }
  }

  state = {
    InputText: '',
  }

  _test_change = text => {
    this.setState({ InputText: text })
  }

  _addlayer = async () => {
    // let name = this.state.InputText
    // let type = this.type
    // let dataSources = await this.workspace.getDatasources()
    // let dataSource = await dataSources.get(0)
    // let dsVector = await dataSource.createDatasetVector(name,type,0)
    // await this.map.addLayer(dsVector,true)
    // await this.map.refresh()

    Toast.show('功能待完善')
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: '新建图层',
          navigation: this.props.navigation,
        }}>
        <View style={styles.sup}>
          <BorderInput placeholder='请输入图层名称' textChange={this._test_change} />
        </View>
        <View style={styles.sup}>
          <BtnTwo text='确定' btnClick={this._addlayer} />
        </View>
      </Container>
    )
  }
}