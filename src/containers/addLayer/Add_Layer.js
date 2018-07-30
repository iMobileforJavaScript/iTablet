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
import NavigationService from '../NavigationService'
import styles from './styles'
import { Action ,DatasetVectorInfo} from 'imobile_for_javascript'

export default class Add_Layer extends React.Component {

  props: {
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    const { nav } = this.props
    this.routes = nav.routes
    this.workspace = params.workspace
    this.map = params.map
    this.dataset = params.dataset
    this.mapControl = params.mapControl
    this.datasource=params.datasource
    this.type=params.type
  state = {
    InputText: '',
  }
  }
  _test_change = text => {
    this.setState({ InputText: text })

  }


  _OK = async () => {
    // Toast.show('待完善')\
    if (this.state.InputText === '') {
      Toast.show('请输入图层名称')
    }
    else {
      let key=''
      for (let index = 0; index < this.routes.length; index++) {
        if (this.routes[index].routeName === 'MapView') {
            key=this.routes[index+1].key
        }
      }
      await this._addlayer(key)
    }
  }

  _addlayer = async (key) => {

  let DatasetVectorInfomodule = new DatasetVectorInfo()
  try {
    let layers = await this.map.getLayers()
    let count = await layers.getCount()
    for (let index = 0; index < count; index++) {
      let name = await (await layers.get(index)).getCaption()
      if (this.state.InputText === name) {
        Toast.show('此图层已存在,请重新输入')
        return
      }
    }
    let datasets = await this.datasource.getDatasets()
    let datasetname = await datasets.getAvailableDatasetName(this.state.InputText)
    let DatasetVectorInfo = await DatasetVectorInfomodule.createObjByNameType(datasetname, this.type)
    debugger
    let dataset = await datasets.create(DatasetVectorInfo)  // 死了  
    await this.map.addDataset(dataset, true)
    let num = await layers.getCount()
    await (await layers.get(0)).setCaption(this.state.InputText)
    await this.mapControl.setAction(Action.SELECT)
    await this.map.refresh()
    Toast.show('新建图层成功')
    setTimeout(() => {
      this.props.navigation.goBack(key)
    }, 2000)
  } catch (error) {
    return error
  }
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
          <BtnTwo text='确定' btnClick={this._OK} />
        </View>
      </Container>
    )
  }
}
