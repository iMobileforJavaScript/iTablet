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
import { MapToolbar } from '../../../workspace/componets'
import { LayerAttributeTable } from '../../components'
import { SMap } from 'imobile_for_reactnative'

const SINGLE_ATTRIBUTE = 'singleAttribute'

export default class LayerAttribute extends React.Component {
  props: {
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    selection: Object,
    setCurrentAttribute: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params && params.type
    this.state = {
      dataSourceList: [],
      openList: {},
      // dataset: params.dataset,
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
    this.getAttribute()
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.currentLayer) !==
      JSON.stringify(this.props.currentLayer)
    ) {
      this.getAttribute()
    } else if (
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

  getAttribute = () => {
    if (!this.props.currentLayer.path) return
    this.container.setLoading(true)
    ;(async function() {
      try {
        let attribute = await SMap.getLayerAttribute(
          this.props.currentLayer.path,
        )
        if (attribute && attribute.length > 0) {
          this.props.setCurrentAttribute(attribute[0])
          let tableHead = []
          attribute[0].forEach(item => {
            if (item.fieldInfo.caption.toString().toLowerCase() === 'smid') {
              tableHead.unshift(item.fieldInfo.caption)
            } else {
              tableHead.push(item.fieldInfo.caption)
            }
          })
          this.setState({
            attribute: attribute,
            // attribute: attribute,
            tableHead: tableHead,
          })
        }
        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
      }
    }.bind(this)())
  }

  add = () => {
    Toast.show('待做')
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
      smID >= 0 &&
        NavigationService.navigate('LayerAttributeObj', {
          dataset: this.state.dataset,
          filter: 'SmID=' + smID,
          index: this.currentFieldIndex,
          callBack: this.getDatasets,
        })
    } else {
      Toast.show('请选择一个属性')
    }
  }

  selectRow = (data, index) => {
    if (!data || index < 0) return
    this.currentFieldInfo = data
    this.currentFieldIndex = index
  }

  renderToolBar = () => {
    return <MapToolbar navigation={this.props.navigation} initIndex={2} />
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '属性表',
          navigation: this.props.navigation,
        }}
        bottomBar={this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()}
      >
        {/*<LayerAttributeTab*/}
        {/*edit={this.edit}*/}
        {/*btns={['edit']}*/}
        {/*startAudio={() => {*/}
        {/*GLOBAL.AudioBottomDialog.setVisible(true)*/}
        {/*}}*/}
        {/*/>*/}
        {this.state.tableHead.length > 0 ? (
          <LayerAttributeTable
            ref={ref => (this.table = ref)}
            data={this.state.attribute}
            type={LayerAttributeTable.Type.EDIT_ATTRIBUTE}
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
