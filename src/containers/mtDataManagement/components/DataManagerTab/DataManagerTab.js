/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { BtnOne, ListSeparator } from '../../../../components'

import styles from './styles'

export default class DataManager_tab extends React.Component {
  
  static propTypes = {
    dSource: PropTypes.func,
    dSet: PropTypes.func,
  }

  _new_datasource = ()=>{
    if(typeof this.props.dSource ==='function'){
      this.props.dSource()
    }
  }

  _new_dataset = () => {
    if(typeof this.props.dSet === 'function'){
      this.props.dSet()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <BtnOne BtnText='新建数据源' size={BtnOne.SIZE.SMALL} BtnImageSrc={require('../../../../assets/map/icon-new-datasource.png')} BtnClick={this._new_datasource}/>
        <ListSeparator key={1} mode={ListSeparator.mode.VERTICAL} />
        <BtnOne BtnText='新建数据集' size={BtnOne.SIZE.SMALL} BtnImageSrc={require('../../../../assets/map/icon-new-datasets.png')} BtnClick={this._new_dataset}/>
      </View>
    )
  }
}
