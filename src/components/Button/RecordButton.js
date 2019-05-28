import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { scaleSize } from '../../utils/index'
// import { Bar } from 'react-native-progress'

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  imageSm: {
    height: scaleSize(60),
    width: scaleSize(60),
    alignSelf: 'center',
  },
  imageLg: {
    height: scaleSize(80),
    width: scaleSize(80),
    alignSelf: 'center',
  },
  text: {
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

export default class RecordButton extends React.Component {
  props: {
    style: any,
    onPress: () => {},
    image: any,
    title: string,
    imageStyle: any,
    titleStyle: any,
    size: string,
    disable: boolean,
  }

  static defaultProps = {
    size: 'large',
    disable: false,
  }

  action = () => {
    if (this.props.disable) return
    this.props.onPress && this.props.onPress()
  }

  render() {
    // let imgStyle = this.props.size === 'small' ? styles.imageSm : styles.imageLg
    return (
      <TouchableOpacity
        activeOpacity={this.props.disable ? 1 : 0.8}
        disable={this.props.disable}
        accessible={true}
        accessibilityLabel={this.props.title}
        style={[styles.container, this.props.style]}
        onPress={this.action}
      >
        {/*<Bar*/}
        {/*style={styles.progress}*/}
        {/*// indeterminate={true}*/}
        {/*progress={*/}
        {/*this.props.online.share[this.props.online.share.length - 1]*/}
        {/*.progress*/}
        {/*}*/}
        {/*width={scaleSize(60)}*/}
        {/*/>*/}
      </TouchableOpacity>
    )
  }
}
