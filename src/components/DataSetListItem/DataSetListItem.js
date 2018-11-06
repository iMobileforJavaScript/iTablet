import * as React from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { PopBtnList } from '../../components'
import { DatasetType } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import styles from './styles'

export default class DataSetListItem extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    data: PropTypes.object,
    height: PropTypes.number,
    hidden: PropTypes.bool,
    radio: PropTypes.bool,
    options: PropTypes.array,
    subTitle: PropTypes.string,
  }

  static defaultProps = {
    data: {},
    hidden: true,
    radio: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: false,
      rowShow: false,
    }
  }

  action = () => {
    if ((this.props.data && this.props.data.options) || this.props.options) {
      this._pop_row()
    } else {
      this.setSelected(!this.state.selected, this.props.onPress)
    }
  }

  _pop_row = () => {
    this.setState(oldstate => {
      let oldshow = oldstate.rowShow
      return { rowShow: !oldshow }
    })
  }

  setSelected = (isSelect, cb?: () => {}) => {
    let select = isSelect
    if (isSelect === null) {
      select = !this.state.selected
    }
    this.setState(
      {
        selected: select,
      },
      () => {
        cb && cb(this.props.data)
      },
    )
  }

  getImage = () => {
    let image
    switch (this.props.data.type) {
      case DatasetType.LINE:
        image = require('../../assets/map/icon-line.png')
        break
      case DatasetType.POINT:
        image = require('../../assets/map/icon-dot.png')
        break
      case DatasetType.REGION:
        image = require('../../assets/map/icon-polygon.png')
        break
      case DatasetType.IMAGE:
        image = require('../../assets/map/icon-surface.png')
        break
      case DatasetType.CAD:
        image = require('../../assets/map/icon-cad.png')
        break
      case DatasetType.TEXT:
        image = require('../../assets/map/icon-text.png')
        break
      case DatasetType.Network:
        image = require('../../assets/map/icon-network.png')
        break
      default:
        image = require('../../assets/map/icon-surface.png')
        break
    }
    return image
  }

  renderRadioBtn = () => {
    let viewStyle = styles.radioView,
      dotStyle = styles.radioSelected
    // if (this.props.data.isAdd) {
    //   viewStyle = styles.radioViewGray
    //   dotStyle = styles.radioSelectedGray
    // }
    return (
      <View style={viewStyle}>
        {// (this.state.selected || this.props.data.isAdd) && <View style={dotStyle} />
          this.state.selected && <View style={dotStyle} />}
      </View>
    )
  }

  _renderAdditionView = () => {
    let options = this.props.data.option || this.props.options
    return <PopBtnList data={options} />
  }

  render() {
    return this.props.hidden ? (
      <View />
    ) : (
      <View style={styles.container}>
        <TouchableOpacity
          disable={this.props.data.isAdd}
          activeOpacity={0.8}
          style={[
            styles.topContainer,
            this.props.height && { height: this.props.height },
          ]}
          onPress={this.action}
        >
          {this.props.radio && this.renderRadioBtn()}
          <View style={styles.contentView}>
            <View style={styles.imageView}>
              <Image
                style={
                  this.props.data.type === DatasetType.POINT
                    ? styles.imageSmall
                    : styles.image
                }
                source={this.getImage()}
              />
            </View>
            <Text style={styles.title}>{this.props.data.name}</Text>
          </View>
          {this.props.subTitle &&
            this.props.data.isAdd && (
            <Text style={[styles.title, styles.textMarginRight]}>
              {this.props.subTitle}
            </Text>
          )}
        </TouchableOpacity>
        {(this.props.data.option || this.props.options) &&
          this.state.rowShow &&
          this._renderAdditionView()}
      </View>
    )
  }
}
