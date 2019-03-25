/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View } from 'react-native'
import { CollectionToolbar } from '../../components'
import constants from '../../constants'
import ToolbarList from '../../components/ToolbarList'

const COLLECTION_LEFT = 'COLLECTION_LEFT'
const COLLECTION_RIGHT = 'COLLECTION_RIGHT'
const NETWORK = 'NETWORK'
const EDIT = 'EDIT'

export { COLLECTION_LEFT, COLLECTION_RIGHT, NETWORK, EDIT }

export default class LeftToolbar extends React.Component {
  props: {
    style?: any,
    hide?: boolean,
    direction?: string,
    separator?: number,
    type: string,
    mapControl: any,
    mapView: any,
    workspace: any,
    map: any,
    editLayer: any,
    selection: any,
    setLoading: () => {},
    data?: Array,
  }

  static defaultProps = {
    type: COLLECTION_LEFT,
    hide: false,
    direction: 'column',
    separator: 20,
    data: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      type: props.type,
    }
  }

  renderToolbar = type => {
    let toolbar = <View />

    if (this.props.data && this.props.data.length > 0) {
      return (
        <ToolbarList
          style={this.props.style}
          separator={this.props.separator}
          data={this.props.data}
        />
      )
    }

    switch (type) {
      case constants.POINT_GPS:
      case constants.POINT_HAND:
      case constants.LINE_GPS_PATH:
      case constants.LINE_GPS_POINT:
      case constants.LINE_HAND_PATH:
      case constants.LINE_HAND_POINT:
      case constants.REGION_GPS_PATH:
      case constants.REGION_GPS_POINT:
      case constants.REGION_HAND_PATH:
      case constants.REGION_HAND_POINT:
        toolbar = (
          <CollectionToolbar
            ref={ref => (this.collectionBar = ref)}
            style={this.props.style}
            separator={this.props.separator}
            type={type}
            editLayer={this.props.editLayer}
            selection={this.props.selection}
            mapView={this.props.mapView}
            mapControl={this.props.mapControl}
            workspace={this.props.workspace}
            map={this.props.map}
            analyst={this._analyst}
            // showSetting={this.props.showSetting}
            // chooseLayer={this.props.chooseLayer}
            // POP_List={this.props.POP_List}
            setLoading={this.props.setLoading}
            // setSelection={this.props.setSelection}
            // columns={this.props.columns}
          />
        )
    }
    return toolbar
  }

  render() {
    if (this.props.hide) {
      return null
    }
    return this.renderToolbar(this.state.type)
  }
}
