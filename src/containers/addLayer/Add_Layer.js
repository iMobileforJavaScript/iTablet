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
import { Action, DatasetVectorInfo } from 'imobile_for_reactnative'

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
    this.datasource = params.datasource
    this.type = params.type
    this.state = {
      InputText: '',
      showloading: false,
    }
  }

  componentDidMount() {
    (async function() {
      try {
        this.container.setLoading(false)
      } catch (error) {
        this.container.setLoading(true)
      }
    }.bind(this)())
  }

  _test_change = text => {
    this.setState({ InputText: text })
  }

  _OK = async () => {
    if (this.state.InputText === '') {
      Toast.show('请输入图层名称')
    } else {
      let key = ''
      for (let index = 0; index < this.routes.length; index++) {
        if (this.routes[index].routeName === 'MapView') {
          key = this.routes[index + 1].key
        }
      }
      await this._addlayer(key)
    }
  }

  _addlayer = async key => {
    let datasetVectorInfoModule = new DatasetVectorInfo()
    let isReadOnly = await this.datasource.isReadOnly()
    if (isReadOnly) {
      Toast.show('此数据源为只可读文件')
      return
    }
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
      let datasetname = await this.datasource.getAvailableDatasetName(
        this.state.InputText,
      )
      let datasetVectorInfo = await datasetVectorInfoModule.createObjByNameType(
        datasetname,
        this.type,
      )
      let datasetVector = await this.datasource.createDatasetVector(
        datasetVectorInfo,
      )
      let datasetVectorname = await datasetVector.getName()
      let dataset = await this.datasource.getDataset(datasetVectorname)
      await this.map.addLayer(dataset, true)
      await (await layers.get(0)).setCaption(this.state.InputText)
      await this.mapControl.setAction(Action.SELECT)
      await this.map.refresh()
      this.container.setLoading(true)
      Toast.show('新建图层成功')
      this.props.navigation.goBack(key)
    } catch (error) {
      Toast.show('新建图层失败')
    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        initWithLoading
        headerProps={{
          title: '新建图层',
          navigation: this.props.navigation,
        }}
      >
        <View style={styles.sup}>
          <BorderInput
            placeholder="请输入图层名称"
            textChange={this._test_change}
          />
        </View>
        <View style={styles.sup}>
          <BtnTwo text="确定" btnClick={this._OK} />
        </View>
      </Container>
    )
  }
}
