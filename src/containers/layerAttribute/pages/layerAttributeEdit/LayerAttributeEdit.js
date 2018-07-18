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
import { LayerAttributeAdd } from '../layerAttributeAdd'
import { QueryParameter, CursorType } from 'imobile_for_javascript'
import styles from './styles'

export default class LayerAttributeEdit extends React.Component {

  props: {
    navigation: Object,
    currentAttribute: Object,
    selection: Object,
    setCurrentAttribute: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    // this.workspace = params.workspace
    // this.map = params.map
    // this.cb = params.cb
    this.state = {
      callBack: params.callBack,
      dataSourceList: [],
      openList: {},
      selection: params.selection,
      attribute: props.currentAttribute,
      tableHead: ['序号', '名称', '类型', '长度', '缺省值', '必填'],
      tableTitle: [],
      tableData: [],
      currentFieldInfo: {},
    }
  }

  componentDidMount() {
    this.getDatasets()
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.currentAttribute) !== JSON.stringify(this.props.currentAttribute)) {
      this.setState({
        attribute: nextProps.currentAttribute,
      })
    }
  }

  getDatasets = (cb = () => {}) => {
    this.container.setLoading(true)
    ;(async function () {
      try {
        let recordset = this.state.selection.recordset
        let dataset = await recordset.getDataset()
        let datasetVector = await dataset.toDatasetVector()
        let fieldInfos = await datasetVector.getFieldInfos()

        let attribute = fieldInfos
        this.setState({
          originData: attribute,
        })
        this.tableEdit.setData(attribute, true)

        cb && cb()

        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
      }
    }).bind(this)()
  }

  refresh = () => {
    this.getDatasets(this.state.callBack)
  }

  add = () => {
    NavigationService.navigate('LayerAttributeAdd', {selection: this.state.selection, callBack: this.refresh})
  }

  edit = () => {
    if (this.state.currentFieldInfo && this.state.currentFieldInfo.isSystemField) {
      Toast.show('系统属性无法编辑')
    } else if (this.state.currentFieldInfo && Object.keys(this.state.currentFieldInfo).length > 0) {
      NavigationService.navigate('LayerAttributeAdd', {
        selection: this.state.selection,
        data: this.state.currentFieldInfo,
        callBack: this.getDatasets,
      })
    } else {
      Toast.show('请选择一个属性')
    }
  }

  delete = () => {
    if (this.state.currentFieldInfo && this.state.currentFieldInfo.isSystemField) {
      Toast.show('系统属性无法删除')
    } else if (this.state.currentFieldInfo && Object.keys(this.state.currentFieldInfo).length > 0) {
      this.deleteAction()
    } else {
      Toast.show('请选择一个属性')
    }
  }

  deleteAction = () => {
    this.container.setLoading(true)
    ;(async function () {
      try {
        let recordset = this.state.selection.recordset
        let dataset = await recordset.getDataset()
        let datasetVector = await dataset.toDatasetVector()
        let result = await datasetVector.removeFieldInfo(this.state.currentFieldInfo.name)

        this.container.setLoading(false)
        if (result) {
          Toast.show('删除成功')
        } else {
          Toast.show('删除失败')
        }
        this.refresh()
      } catch (e) {
        this.container.setLoading(false)
        Toast.show('删除成功')
      }
    }).bind(this)()
  }

  selectRow = data => {

    this.setState({
      currentFieldInfo: data,
    })
  }

  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        initWithLoading
        headerProps={{
          title: '属性表',
          navigation: this.props.navigation,
        }}>
        <LayerAttributeTab type={LayerAttributeTab.Type.EDIT} add={this.add} edit={this.edit} delete={this.delete} />
        <LayerAttributeTable
          ref={ref => this.tableEdit = ref}
          type={LayerAttributeTable.Type.EDIT_ATTRIBUTE}
          data={this.state.attribute}
          tableTitle={this.state.tableTitle}
          tableHead={this.state.tableHead}
          selectRow={this.selectRow}
        />
      </Container>
    )
  }
}