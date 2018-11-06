import * as React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'

import Swiper from 'react-native-swiper' // eslint-disable-line

const { width } = Dimensions.get('window')

export default class HomeSwiper extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    activeOpacity: PropTypes.number,
  }

  static defaultProps = {
    data: [],
    activeOpacity: 1,
  }

  constructor(props) {
    super(props)

    this.state = {
      size: { width, height: (width * 8) / 15 },
    }
  }

  getData = () => {
    let datas = []
    if (this.props.data.length > 0) {
      this.props.data.forEach(({ obj, index }) => {
        datas.push(
          <TouchableOpacity
            key={'home_swiper_' + index}
            activeOpacity={this.props.activeOpacity}
            style={styles.ImageContainaer}
          >
            <Image
              resizeMode="stretch"
              style={styles.scrollImage}
              source={{ uri: obj.uri }}
            />
          </TouchableOpacity>,
        )
      })
    } else {
      datas = [
        <TouchableOpacity
          key={'home_swiper_0'}
          activeOpacity={this.props.activeOpacity}
          style={styles.ImageContainaer}
        >
          <Image
            resizeMode="stretch"
            style={styles.scrollImage}
            source={require('../../../../assets/home/home_scroll1.jpg')}
          />
        </TouchableOpacity>,
        <TouchableOpacity
          key={'home_swiper_1'}
          activeOpacity={this.props.activeOpacity}
          style={styles.ImageContainaer}
        >
          <Image
            resizeMode="stretch"
            style={styles.scrollImage}
            source={require('../../../../assets/home/home_scroll2.jpg')}
          />
        </TouchableOpacity>,
      ]
    }
    return datas
  }

  render() {
    return (
      <View style={styles.container}>
        <Swiper
          autoplay
          autoplayTimeout={10}
          // onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          paginationStyle={styles.paginationStyle}
          loop
        >
          {this.getData()}
        </Swiper>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: (width * 8) / 15,
    width: '100%',
  },
  ImageContainaer: {
    width: '100%',
    flex: 1,
    alignSelf: 'center',
  },
  scrollImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: 'white',
    width: 5,
    height: 5,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  paginationStyle: {
    // bottom: -23,
    // left: null,
    // right: 10,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
})
