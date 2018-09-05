import * as React from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Image,} from 'react-native'
import { scaleSize } from '../utils'
import { size } from '../styles'
import { Progress} from '../components'
const SCREEN_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = SCREEN_WIDTH * 0.5 - 10
const IMAGE_WIDTH = ITEM_WIDTH - 20
const imageBrokenPath = require('../assets/public/default-map.png')
export default class Thumbnails extends React.Component {

  props: {
    src: any,
    imageStyle: any,
    title: string,
    resizeMode: string,
    btnClick: () => {},
    progress:any,
    processcb:any,
  }

  static defaultProps: {
    resizeMode: 'stretch',
  }

  constructor(props) {
    super(props)
    this.state={
      opacity:1
    }
    
  }
  updateprogress=(data)=>{
    if(data===99){
      data++
      this.setState({opacity:0})
    }
    this.mProgress.progress=data/100
    console.log(this.mProgress.progress)
      
  }
  render() {
    let image
    if (this.props.src && typeof this.props.src === 'string') {
      image = { uri: this.props.src }
    } else if (this.props.src) {
      image = this.props.src
    } else {
      image = imageBrokenPath
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity accessible={true} accessibilityLabel={this.props.title ? this.props.title : '默认标题'} activeOpacity={0.8} style={styles.subContainer} onPress={this.props.btnClick} underlayColor={'rgba(34,26,38,0.1)'}>
          <Progress ref={ref=>this.mProgress=ref} style={[styles.animatedView,{opacity:this.state.opacity}]} progressAniDuration={5} progressColor={"#1296db"} ></Progress>
          <Image resizeMode={this.props.resizeMode} style={[styles.image, this.props.imageStyle]} source={image} />
          <View style={styles.textView}>
            <Text numberOfLines={1} style={styles.title}>{this.props.title ? this.props.title : '默认标题'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleSize(15),
  },
  subContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: IMAGE_WIDTH,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  image: {
    height: IMAGE_WIDTH * 0.6,
    width: IMAGE_WIDTH,
    alignSelf: 'center',
  },
  textView: {
    height: scaleSize(40),
    justifyContent: 'center',
    marginLeft: scaleSize(20),
  },
  title: {
    fontSize: size.fontSize.fontSizeSm,
    textAlign: 'center',
  },
  animatedView:{
    position:'absolute',
    top:IMAGE_WIDTH * 0.6-scaleSize(8),
    left:0,
    zIndex:1,
  }
})