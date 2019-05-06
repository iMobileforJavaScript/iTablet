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
import { CursorType } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language/index'
import styles from './styles'

export default class LayerAttributeObj extends React.Component {
  props: {
    navigation: Object,
    currentAttribute: Object,
    setCurrentAttribute: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params.callBack
    this.index = params.index || -1
    this.recordset = params.recordset
    this.state = {
      dataSourceList: [],
      openList: {},
      dataset: params.dataset,
      filter: params.filter,
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
    if (
      JSON.stringify(prevProps.currentAttribute) !==
      JSON.stringify(this.props.currentAttribute)
    ) {
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
    ;(async function() {
      try {
        let dv = await this.state.dataset.toDatasetVector()
        let result = await dv.query({
          attributeFilter: this.state.filter,
          cursorType: CursorType.DYNAMIC,
        })

        if (
          result &&
          result.geo &&
          result.geo.features &&
          result.geo.features[0]
        ) {
          let attribute = [],
            properties = result.geo.features[0].properties
          Object.keys(properties).forEach(key => {
            attribute.push({
              name: key,
              value: properties[key],
            })
          })
          this.setState({
            attribute: attribute,
          })
        }
        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
      }
    }.bind(this)())
  }

  confirm = () => {
    if (this.index < 0 && !this.recordset) return
    this.container.setLoading(true, '数据编辑中')
    ;(async function() {
      try {
        let modifiedData = this.table.getModifiedData()
        let obj = {}
        let keys = Object.keys(modifiedData)
        if (keys.length <= 0) {
          this.container.setLoading(false)
          Toast.show('尚未更改属性')
          return
        }
        keys.forEach(key => {
          obj[key] = modifiedData[key].data.value
        })
        let resp
        if (this.recordset) {
          resp = await this.recordset.setFieldValuesByNames(obj)
        } else {
          resp = await (await this.state.dataset.toDatasetVector()).setFieldValuesByNames(
            obj,
            this.index,
          )
        }

        this.container.setLoading(false)

        if (!resp.result) {
          Toast.show('尚未更改属性')
        } else if (!resp.editResult) {
          Toast.show('编辑失败')
        } else if (!resp.updateResult) {
          Toast.show('更新失败')
        } else {
          Toast.show('编辑成功')
          this.cb && this.cb()
        }
      } catch (e) {
        this.container.setLoading(false)
      }
    }.bind(this)())
  }

  add = () => {
    Toast.show('待做')
  }

  edit = async () => {
    NavigationService.navigate('LayerAttributeEdit', {
      dataset: this.state.dataset,
      callBack: this.getDatasets,
    })
  }

  reset = () => {
    this.table && this.table.reset(this.props.currentAttribute)
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
        <Button title={'确定'} onPress={this.confirm} />
        <Button type={Button.Type.GRAY} title={'重置'} onPress={this.reset} />
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        // initWithLoading
        headerProps={{
          title: '对象属性',
          navigation: this.props.navigation,
        }}
      >
        <LayerAttributeTab
          // add={this.add}
          edit={this.edit}
          btns={['edit']}
          startAudio={() => {
            GLOBAL.AudioBottomDialog.setVisible(true)
          }}
        />
        {
          <LayerAttributeTable
            ref={ref => (this.table = ref)}
            data={this.state.attribute}
            hasIndex={false}
            tableTitle={this.state.tableTitle}
            // colHeight={this.state.colHeight}
            widthArr={[100, 100]}
            tableHead={[
              getLanguage(global.language).Map_Label.NAME,
              getLanguage(global.language).Map_Label.ATTRIBUTE,
              //'名称'
              //'属性值'
            ]}
            // tableHead={this.state.tableHead}
          />
        }
        {this.renderBtns()}
      </Container>
    )
  }
}
