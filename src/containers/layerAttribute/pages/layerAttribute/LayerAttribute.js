/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container, Button } from '../../../../components'
import { Toast } from '../../../../utils'
import { LayerAttributeTab, LayerAttributeTable } from '../../components'

import styles from './styles'

export default class LayerAttribute extends React.Component {

  props: {
    navigation: Object,
    currentAttribute: Object,
    setCurrentAttribute: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      dataSourceList: [],
      openList: {},
      recordset: params.recordset,
      attribute: {},
      tableTitle: [],
      // tableHead: ['名称', '属性值'],
      tableHead: [],
      tableData: [],
    }
  }

  componentDidMount() {
    this.getDatasets()
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.currentAttribute) !== JSON.stringify(this.props.currentAttribute)) {
      this.setState({
        attribute: this.props.currentAttribute,
      })
    }
  }

  componentWillUnmount() {
    this.props.setCurrentAttribute({})
  }

  getDatasets = () => {
    this.container.setLoading(true)
    ;(async function () {
      try {
        let recordset = this.state.recordset
        let records = await recordset.getFieldInfosArray()
        let attribute = []
        if (records && records.length > 0) {
          attribute = records[0]
          this.props.setCurrentAttribute(attribute)
          // let tableHead = Object.keys(records[0])
          this.setState({
            attribute: attribute,
            // tableHead: tableHead,
          })

          this.table.setData(attribute, true)
        }
        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
      }
    }).bind(this)()
  }

  confirm = () => {
    this.container.setLoading(true, '数据编辑中')
    ;(async function() {
      let modifiedData = this.table.getModifiedData()
      let obj = {}
      let keys = Object.keys(modifiedData)
      keys.forEach(key => {
        obj[key] =  modifiedData[key].data.value
      })
      let recordset = this.state.recordset
      let { result, editResult, updateResult } = await recordset.setFieldValuesByNames(obj)

      this.container.setLoading(false)

      if (!result) {
        Toast.show("尚未更改属性")
      } else if (!editResult) {
        Toast.show("编辑失败")
      } else if (!updateResult) {
        Toast.show("更新失败")
      } else{
        Toast.show("编辑成功")
      }
    }.bind(this)())
  }

  add = () => {
    Toast.show("待做")
  }

  edit = async () => {
    let dataset = await this.state.recordset.getDataset()
    NavigationService.navigate('LayerAttributeEdit', {dataset: dataset, callBack: this.getDatasets})
  }

  reset = () => {
    this.table && this.table.reset(this.props.currentAttribute)
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
        <Button title={'确定'} onPress={this.confirm}/>
        <Button type={Button.Type.GRAY} title={'重置'} onPress={this.reset}/>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        // initWithLoading
        headerProps={{
          title: '对象属性',
          navigation: this.props.navigation,
        }}>
        <LayerAttributeTab
          add={this.add}
          edit={this.edit}
          startAudio={() => {
            GLOBAL.AudioBottomDialog.setVisible(true)
          }}
        />
        {
          // this.state.tableHead.length > 0 &&
          <LayerAttributeTable
            ref={ref => this.table = ref}
            data={this.state.attribute}
            // tableData={this.state.tableData}
            tableTitle={this.state.tableTitle}
            // colHeight={this.state.colHeight}
            tableHead={['名称', '属性值']}
            // tableHead={this.state.tableHead}
          />
        }
        {this.renderBtns()}
      </Container>
    )
  }
}