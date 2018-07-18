import * as React from 'react'
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native'
import PropTypes from 'prop-types'

import Carousel from '../../../../third/react-native-looped-carousel/index'

const { width, height } = Dimensions.get('window')

export default class CarouselExample extends React.Component {

  static propTypes = {
    onAnimateNextPage: PropTypes.func,
  }

  constructor(props){
    super(props)

    this.state = {
      size: { width, height: width * 8 / 15 },
    }
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout
    this.setState({ size: { width: layout.width, height: layout.height } })
  }

  _onAnimateNextPage = page => {
    this.props.onAnimateNextPage && this.props.onAnimateNextPage(page)
  }

  render() {
    return (
      <View style={styles.container} onLayout={this._onLayoutDidChange}>
        <Carousel
          delay={4000}
          style={this.state.size}
          autoplay
          pageInfo
          onAnimateNextPage={this._onAnimateNextPage}
        >
          <View style={[{ backgroundColor: '#F5FCFF' }, this.state.size]}><Image resizeMode='stretch' style={styles.scrollImage} source={require('../../../../assets/public/home_scroll1.png')}/></View>
          <View style={[{ backgroundColor: '#F5FCFF' }, this.state.size]}><Image resizeMode='stretch' style={styles.scrollImage} source={require('../../../../assets/public/home_scroll2.png')}/></View>
        </Carousel>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: width * 8 / 15,
    width: width,
    alignSelf: 'center',
  },
  scrollImage: {
    alignSelf: 'center',
  }
})