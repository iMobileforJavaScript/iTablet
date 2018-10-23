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
    btns: PropTypes.array,
  }

  static defaultProps = {
    type: 'ATTRIBUTE',
    btns: [],
  }

  add = () => {
    if (typeof this.props.add === 'function') {
      this.props.add()
    }
  }

  startAudio = () => {
    if (typeof this.props.startAudio === 'function') {
      this.props.startAudio()
    }
  }

  edit = () => {
    if (typeof this.props.edit === 'function') {
      this.props.edit()
    }
  }

  delete = () => {
    if (typeof this.props.delete === 'function') {
      this.props.delete()
    }
  }

  renderAttribute() {
    return (
      <View style={styles.container}>
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          title="添加图片或视频"
          image={require('../../../../assets/mapTools/icon_add_selected.png')}
          onPress={this.add}
        />
        <ListSeparator mode={ListSeparator.mode.VERTICAL} />
        {/*<BtnOne*/}
        {/*size={BtnOne.SIZE.SMALL}*/}
        {/*title='输入语音'*/}
        {/*image={require('../../../../assets/map/icon-save.png')}*/}
        {/*onPress={this.startAudio}*/}
        {/*/>*/}
        {/*<ListSeparator mode={ListSeparator.mode.VERTICAL}/>*/}
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          title="编辑"
          image={require('../../../../assets/mapTools/icon_edit_selected.png')}
          onPress={this.edit}
        />
      </View>
    )
  }

  addBtn = type => {
    if (typeof type !== 'string') {
      return type
    }
    switch (type) {
      case 'add':
        return (
          <BtnOne
            key={type}
            style={styles.btn}
            size={BtnOne.SIZE.SMALL}
            title="添加"
            image={require('../../../../assets/mapTools/icon_add_selected.png')}
            onPress={this.add}
          />
        )
      case 'edit':
        return (
          <BtnOne
            key={type}
            style={styles.btn}
            size={BtnOne.SIZE.SMALL}
            title="编辑"
            image={require('../../../../assets/mapTools/icon_edit_selected.png')}
            onPress={this.edit}
          />
        )
      case 'delete':
        return (
          <BtnOne
            key={type}
            style={styles.btn}
            size={BtnOne.SIZE.SMALL}
            title="删除"
            image={require('../../../../assets/mapTools/icon_delete_selected.png')}
            onPress={this.delete}
          />
        )
      case 'addImageVideo':
        return (
          <BtnOne
            key={type}
            style={styles.btn}
            size={BtnOne.SIZE.SMALL}
            title="添加图片或视频"
            image={require('../../../../assets/mapTools/icon_add_selected.png')}
            onPress={this.add}
          />
        )
    }
  }

  renderEdit() {
    return (
      <View style={styles.container}>
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          title="添加"
          image={require('../../../../assets/map/icon-add-datasets.png')}
          onPress={this.add}
        />
        <ListSeparator mode={ListSeparator.mode.VERTICAL} />
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          title="编辑"
          image={require('../../../../assets/map/icon-save-color.png')}
          onPress={this.edit}
        />
        <ListSeparator mode={ListSeparator.mode.VERTICAL} />
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          title="删除"
          image={require('../../../../assets/map/icon-save-color.png')}
          onPress={this.delete}
        />
      </View>
    )
  }

  render() {
    let btns = []
    for (let i = 0; i < this.props.btns.length; i++) {
      btns.push(this.addBtn(this.props.btns[i]))
    }

    return <View style={styles.container}>{btns}</View>

    // if (this.props.type === 'EDIT') {
    //   return this.renderEdit()
    // } else {
    //   return this.renderAttribute()
    // }
  }
}

LayerAttributeTab.Type = {
  EDIT: 'EDIT',
  ATTRIBUTE: 'ATTRIBUTE',
}
