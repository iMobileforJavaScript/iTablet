/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container } from '../../../../components'
import { Toast } from '../../../../utils'
import { LayerAttributeTab, LayerAttributeTable } from '../../components'
import { FieldType } from 'imobile_for_reactnative'

export default class LayerAttributeEdit extends React.Component {
  props: {
    navigation: Object,
    currentAttribute: Object,
    setCurrentAttribute: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      callBack: params.callBack,
      dataSourceList: [],
      openList: {},
      dataset: params.dataset,
      // attribute: props.currentAttribute,
      attribute: {},
      tableHead: ['名称', '别名', '类型', '长度', '缺省值', '必填'],
      tableTitle: [],
      tableData: [],
      currentFieldInfo: {},
    }
  }

  componentDidMount() {
    this.getDatasets()
  }

  // componentDidUpdate(prevProps) {
  //   if (JSON.stringify(prevProps.currentAttribute) !== JSON.stringify(this.props.currentAttribute)) {
  //     this.setState({
  //       attribute: this.props.currentAttribute,
  //     })
  //   }
  // }

  getDatasets = (cb = () => {}) => {
    this.container.setLoading(true)
    ;(async function() {
      try {
        let datasetVector = await this.state.dataset.toDatasetVector()
        let fieldInfos = await datasetVector.getFieldInfos()

        let attribute = []
        for (let i = 0; i < fieldInfos.length; i++) {
          let item = fieldInfos[i]
          let itemArr = []
          itemArr.push({
            name: 'name',
            value: item.fieldInfo['name'],
            data: item,
          })
          itemArr.push({
            name: 'caption',
            value: item.fieldInfo['caption'],
            data: item,
          })
          itemArr.push({
            name: 'type',
            value: this.checkType(item.fieldInfo['type']),
            data: item,
          })
          itemArr.push({
            name: 'length',
            value: item.fieldInfo['length'],
            data: item,
          })
          itemArr.push({
            name: 'defaultValue',
            value: item.fieldInfo['defaultValue'],
            data: item,
          })
          itemArr.push({
            name: 'isRequired',
            value: item.fieldInfo['isRequired'] ? '是' : '否',
            data: item,
          })
          attribute.push(itemArr)
        }
        this.setState({
          attribute: attribute,
        })
        // this.tableEdit.setData(attribute, true)

        cb && cb()

        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
      }
    }.bind(this)())
  }

  checkType = data => {
    let type = ''
    switch (data) {
      case FieldType.WTEXT:
      case FieldType.CHAR:
      case FieldType.TEXT:
        type = '文本'
        break
      case FieldType.BYTE:
      case FieldType.INT16:
      case FieldType.INT32:
      case FieldType.INT64:
      case FieldType.LONGBINARY:
      case FieldType.SINGLE:
      case FieldType.DOUBLE:
        type = '数值'
        break
      case FieldType.BOOLEAN:
        type = '布尔'
        break
      case FieldType.DATETIME:
        type = '日期'
        break
      default:
        type = '未知属性'
        break
    }
    return type
  }

  refresh = () => {
    this.getDatasets(this.state.callBack)
  }

  add = () => {
    // NavigationService.navigate('LayerAttributeAdd', {selection: this.state.selection, callBack: this.refresh})
    NavigationService.navigate('LayerAttributeAdd', {
      dataset: this.state.dataset,
      callBack: this.refresh,
    })
  }

  edit = () => {
    if (
      this.state.currentFieldInfo &&
      this.state.currentFieldInfo.isSystemField
    ) {
      Toast.show('系统属性无法编辑')
    } else if (
      this.state.currentFieldInfo &&
      Object.keys(this.state.currentFieldInfo).length > 0
    ) {
      NavigationService.navigate('LayerAttributeAdd', {
        // selection: this.state.selection,
        dataset: this.state.dataset,
        data: this.state.currentFieldInfo,
        callBack: this.refresh,
      })
    } else {
      Toast.show('请选择一个属性')
    }
  }

  delete = () => {
    if (
      this.state.currentFieldInfo &&
      this.state.currentFieldInfo.isSystemField
    ) {
      Toast.show('系统属性无法删除')
    } else if (
      this.state.currentFieldInfo &&
      Object.keys(this.state.currentFieldInfo).length > 0
    ) {
      this.deleteAction()
    } else {
      Toast.show('请选择一个属性')
    }
  }

  deleteAction = () => {
    this.container.setLoading(true)
    ;(async function() {
      try {
        // let recordset = this.state.selection.recordset
        // let recordset = this.state.recordset
        // let dataset = await recordset.getDataset()
        let datasetVector = await this.state.dataset.toDatasetVector()
        let result = await datasetVector.removeFieldInfo(
          this.state.currentFieldInfo.name,
        )

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
    }.bind(this)())
  }

  selectRow = data => {
    if (!data[0] || !data[0].data || !data[0].data.fieldInfo) return
    this.setState({
      currentFieldInfo: data[0].data.fieldInfo,
    })
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        initWithLoading
        headerProps={{
          title: '属性',
          navigation: this.props.navigation,
        }}
      >
        <LayerAttributeTab
          type={LayerAttributeTab.Type.EDIT}
          btns={['add', 'edit', 'delete']}
          add={this.add}
          edit={this.edit}
          delete={this.delete}
        />
        {this.state.tableHead.length > 0 ? (
          <LayerAttributeTable
            ref={ref => (this.tableEdit = ref)}
            type={LayerAttributeTable.Type.EDIT_ATTRIBUTE}
            data={this.state.attribute}
            tableTitle={this.state.tableTitle}
            tableHead={this.state.tableHead}
            selectRow={this.selectRow}
          />
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </Container>
    )
  }
}
