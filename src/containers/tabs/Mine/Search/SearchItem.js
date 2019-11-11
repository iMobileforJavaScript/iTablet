import React, { Component } from 'react'
import { Text } from 'react-native'
import TouchableItemView from '../../Friend/TouchableItemView'
import { scaleSize } from '../../../../utils'

export default class SearchItem extends Component {
  props: {
    item: Object,
    image: Object,
    text: String,
    searchText: String,
    onPress: () => {},
  }

  static defaultProps = {
    disableTouch: false,
    showRight: true,
    showCheck: false,
    disableCheck: false,
  }

  constructor(props) {
    super(props)
  }

  renderText = () => {
    let text = this.props.text
    let keyword = this.props.searchText
    let newText = text.split(keyword)
    let length = newText.length
    return (
      <Text style={{ fontSize: scaleSize(26) }}>
        {newText.map((item, index) => {
          return (
            <Text key={index}>
              {item}
              <Text style={{ backgroundColor: '#4680DF' }}>
                {index === length - 1 ? null : keyword}
              </Text>
            </Text>
          )
        })}
      </Text>
    )
  }

  render() {
    return (
      <TouchableItemView
        image={this.props.image}
        renderUpperText={this.renderText}
        onPress={this.props.onPress}
      />
    )
  }
}
