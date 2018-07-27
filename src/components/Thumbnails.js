import * as React from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native'
import { scaleSize } from '../utils'
import { size } from '../styles'
const SCREEN_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = SCREEN_WIDTH * 0.5 - 10
const IMAGE_WIDTH = ITEM_WIDTH - 20
const imageBrokenPath = require('../assets/public/mapImage0.png')

export default class Thumbnails extends React.Component {
  
  props: {
    src: any,
    title: string,
    btnClick: () => {},
  }
  
  constructor(props){
    super(props)
  }

  render() {
    let image
    if (this.props.src && typeof this.props.src === 'string') {
      image = {uri: this.props.src}
    } else if (this.props.src) {
      image = this.props.src
    } else {
      image = imageBrokenPath
    }
    
    return (
      <View style={styles.container}>
        <TouchableOpacity accessible={true} accessibilityLabel={this.props.title ? this.props.title : '默认标题'} activeOpacity={0.8} style={styles.subContainer} onPress={this.props.btnClick} underlayColor={'rgba(34,26,38,0.1)'}>
          <Image style={styles.image} source={image}/>
          <View style={styles.textView}>
            <Text style={styles.title}>{this.props.title ? this.props.title : '默认标题'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // height: ITEM_WIDTH * 0.7,
    width: ITEM_WIDTH,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleSize(15),
  },
  subContainer: {
    flexDirection: 'column',
    // alignItems: 'space-between',
    justifyContent: 'space-between',
    // height: IMAGE_WIDTH * 0.8,
    width: IMAGE_WIDTH,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  image: {
    height: IMAGE_WIDTH * 0.6,
    width: IMAGE_WIDTH,
    // borderTopLeftRadius: 4,
    // borderTopRightRadius: 4,
    // borderColor: 'rgba(59,55,56,0.3)',
    // borderWidth: 1,
    alignSelf: 'center',
    // marginTop: 3,
  },
  textView: {
    height: scaleSize(40),
    justifyContent: 'center',
    marginLeft: scaleSize(20),
  },
  title: {
    fontSize: size.fontSize.fontSizeSm,
    textAlign:'center',
  },
})