import * as React from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { PopBtnList } from '../../components'
import PropTypes from 'prop-types'
import styles from './styles'

export default class DataSetListSection extends React.Component {

  static propTypes = {
    onPress: PropTypes.func,
    data: PropTypes.object,
    height: PropTypes.number,
    isShow: PropTypes.bool,
    options: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      rowShow: false,
    }
  }

  action = () => {
    this.props.onPress && this.props.onPress(this.props.data)
  }

  _pop_row=()=>{
    this.setState(oldstate=>{
      let oldshow = oldstate.rowShow
      return({rowShow:!oldshow})
    })
  }

  renderArrow = () => {
    let image = this.props.data.isShow
      ? require('../../assets/map/icon-arrow-up.png')
      : require('../../assets/map/icon-arrow-down.png')
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.imageView}
        onPress={this.action}
      >
        <Image style={styles.image} source={image} />
      </TouchableOpacity>
    )
  }

  _renderAdditionView = () => {
    let options = this.props.data.option || this.props.options
    return (
      <PopBtnList data={options} />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.topContainer, this.props.height && {height: this.props.height}]}
          onPress={this._pop_row}
        >
          {this.renderArrow()}
          <Text style={styles.title}>{this.props.data.key}</Text>
        </TouchableOpacity>
        {(this.props.data.option || this.props.options) && this.state.rowShow && this._renderAdditionView()}
      </View>
    )
  }
}