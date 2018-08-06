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

export default class LayerAttributeTab extends React.Component {

  static propTypes = {
    mapChange: PropTypes.func,
    showSaveDialog: PropTypes.func,
    add: PropTypes.func,
    edit: PropTypes.func,
    startAudio: PropTypes.func,
    delete: PropTypes.func,
    type: PropTypes.string,
  }

  static defaultProps = {
    type: 'ATTRIBUTE',
  }

  add = () => {
    if(typeof this.props.add === 'function'){
      this.props.add()
    }
  }

  startAudio = () => {
    if(typeof this.props.startAudio === 'function'){
      this.props.startAudio()
    }
  }

  edit = () => {
    if(typeof this.props.edit === 'function'){
      this.props.edit()
    }
  }

  delete = () => {
    if(typeof this.props.delete === 'function'){
      this.props.delete()
    }
  }

  renderAttribute() {
    return (
      <View style={styles.container}>
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          BtnText='添加图片或视频'
          BtnImageSrc={require('../../../../assets/map/icon-add-datasets.png')}
          BtnClick={this.add}
        />
        <ListSeparator mode={ListSeparator.mode.VERTICAL}/>
        {/*<BtnOne*/}
        {/*size={BtnOne.SIZE.SMALL}*/}
        {/*BtnText='输入语音'*/}
        {/*BtnImageSrc={require('../../../../assets/map/icon-save.png')}*/}
        {/*BtnClick={this.startAudio}*/}
        {/*/>*/}
        {/*<ListSeparator mode={ListSeparator.mode.VERTICAL}/>*/}
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          BtnText='编辑'
          BtnImageSrc={require('../../../../assets/map/icon-save.png')}
          BtnClick={this.edit}
        />
      </View>
    )
  }

  renderEdit() {
    return (
      <View style={styles.container}>
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          BtnText='添加'
          BtnImageSrc={require('../../../../assets/map/icon-add-datasets.png')}
          BtnClick={this.add}
        />
        <ListSeparator mode={ListSeparator.mode.VERTICAL} />
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          BtnText='编辑'
          BtnImageSrc={require('../../../../assets/map/icon-save.png')}
          BtnClick={this.edit}
        />
        <ListSeparator mode={ListSeparator.mode.VERTICAL} />
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          BtnText='删除'
          BtnImageSrc={require('../../../../assets/map/icon-save.png')}
          BtnClick={this.delete}
        />
      </View>
    )
  }

  render() {
    if (this.props.type === 'EDIT') {
      return this.renderEdit()
    } else {
      return this.renderAttribute()
    }
  }
}

LayerAttributeTab.Type = {
  EDIT: 'EDIT',
  ATTRIBUTE: 'ATTRIBUTE',
}