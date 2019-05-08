import React from 'react'
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native'
import { scaleSize } from '../../utils'
import { size, color } from '../../styles'

const ITEM_HEIGHT = scaleSize(80)
const VIEW_WIDTH = scaleSize(360)

export default class MenuItem extends React.PureComponent {
  props: {
    data: Object,
    onPress?: () => {}, // 选中item的回调
    index: number,
    rowHeight: number,
    highLight?: boolean,
    style?: Object,
  }

  static defaultProps = {
    highLight: false,
    rowHeight: ITEM_HEIGHT,
  }

  itemAction = () => {
    this.props.onPress &&
      this.props.onPress({
        data: this.props.data,
        index: this.props.index,
      })
  }

  render() {
    return (
      <TouchableOpacity
        key={this.props.data.key}
        activeOpacity={0.8}
        underlayColor="#4680DF"
        style={[
          styles.item,
          { height: this.props.rowHeight, width: '100%' },
          this.props.style,
        ]}
        onPress={() => {
          if (this.props.data && this.props.data.key) {
            this.list &&
              this.list.scrollToIndex({
                index: this.props.index,
                viewPosition: 0.5,
              })
            this.itemAction()
          }
        }}
      >
        {this.props.data.icon && (
          <View style={styles.iconView}>
            <Image
              resizeMode={'contain'}
              style={styles.icon}
              source={
                this.props.highLight && this.props.data.highLightIcon
                  ? this.props.data.highLightIcon
                  : this.props.data.icon
              }
            />
          </View>
        )}
        <Text style={this.props.highLight ? styles.textHighLight : styles.text}>
          {this.props.data.key}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'column',
    backgroundColor: color.bgW,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedView: {
    position: 'absolute',
    height: ITEM_HEIGHT,
    backgroundColor: '#4680DF',
    width: VIEW_WIDTH,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    backgroundColor: 'transparent',
    width: '100%',
  },
  text: {
    color: color.font_color_white,
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  textHighLight: {
    color: color.content_white,
    fontWeight: 'bold',
    fontSize: size.fontSize.fontSizeXl,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  iconView: {
    height: scaleSize(60),
    width: scaleSize(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
})
