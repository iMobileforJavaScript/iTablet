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
import { CursorType } from 'imobile_for_reactnative'

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
      dataset: params.dataset,
      attribute: {},
      tableTitle: [],
      // tableHead: ['名称', '属性值'],
      tableHead: [],
      tableData: [],
    }

    this.currentFieldInfo = []
    this.currentFieldIndex = -1
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

  componentWillUnmount() {
    this.props.setCurrentAttribute({})
  }

  getDatasets = () => {
    this.container.setLoading(true)
    ;(async function () {
      try {
        let recordset = await (await this.state.dataset.toDatasetVector()).getRecordset(false, CursorType.DYNAMIC)

        // let recordset = this.state.recordset
        let records = await recordset.getFieldInfosArray()
        let attribute = []
        if (records && records.length > 0) {
          attribute = records[0]
          this.props.setCurrentAttribute(attribute)
          let tableHead = []
          records[0].forEach(item => {
            tableHead.push(item.fieldInfo.caption)
          })
          this.setState({
            attribute: records,
            // attribute: attribute,
            tableHead: tableHead,
          })
        }
        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
      }
    }).bind(this)()
  }

  add = () => {
    Toast.show("待做")
  }

  edit = () => {
    if (this.currentFieldInfo.length > 0) {
      let smID = -1
      for (let i = 0; i < this.currentFieldInfo.length; i++) {
        if (this.currentFieldInfo[i].name === 'SMID') {
          smID = this.currentFieldInfo[i].value
          break
        }
      }
      smID >= 0 && NavigationService.navigate('LayerAttributeObj', {dataset: this.state.dataset, filter: 'SmID=' + smID, index: this.currentFieldIndex, callBack: this.getDatasets})
    } else {
      Toast.show('请选择一个属性')
    }
  }

  selectRow = (data, index) => {
    if (!data || index < 0) return
    this.currentFieldInfo = data
    this.currentFieldIndex = index
  }

  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        headerProps={{
          title: '属性表',
          navigation: this.props.navigation,
        }}>
        <LayerAttributeTab
          edit={this.edit}
          btns={['edit']}
          startAudio={() => {
            GLOBAL.AudioBottomDialog.setVisible(true)
          }}
        />
        {
          this.state.tableHead.length > 0
            ? <LayerAttributeTable
              ref={ref => this.table = ref}
              data={this.state.attribute}
              type={LayerAttributeTable.Type.EDIT_ATTRIBUTE}
              tableTitle={this.state.tableTitle}
              tableHead={this.state.tableHead}
              selectRow={this.selectRow}
            />
            : <View style={{flex: 1}} />
        }
      </Container>
    )
  }
}