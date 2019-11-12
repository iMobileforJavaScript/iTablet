/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Text,
  TouchableOpacity,
  Easing,
  Image,
} from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color } from '../../styles'
import { getPublicAssets } from '../../assets'

const ROW_HEIGHT = scaleSize(40)
export default class TreeListItem extends React.Component {
  props: {
    key: string,
    data: Object,
    index: number,
    textSize?: number,
    textColor?: string,
    children: Object,
    separator?: boolean,
    separatorStyle?: Object,
    // childrenData: Array,
    style: Object,
    childrenStyle: Object,
    iconStyle: Object,
    keyExtractor?: () => {},
    onPress?: () => {},
    renderChild: () => {},
    defaultShowChildren: boolean,
  }

  static defaultProps = {
    defaultShowChildren: false,
    separator: false,
    textColor: 'white',
  }

  constructor(props) {
    super(props)
    this.state = {
      // height: new Animated.Value(0),
      imgRotate: new Animated.Value(props.defaultShowChildren ? 0 : -0.5),
      isVisible: props.defaultShowChildren,
    }
  }

  renderIcon = () => {
    const arrowImg = require('../../assets/mapEdit/icon-arrow-down.png')
    if (this.props.data.childGroups && this.props.data.childGroups.length > 0) {
      return (
        <TouchableOpacity
          style={[styles.btn]}
          onPress={() => this.showChild(!this.state.isVisible)}
        >
          <Animated.Image
            resizeMode={'contain'}
            style={[
              styles.arrowImg,
              {
                transform: [
                  {
                    rotate: this.state.imgRotate.interpolate({
                      inputRange: [-1, 1],
                      outputRange: ['-180deg', '180deg'],
                    }),
                  },
                ],
              },
            ]}
            source={arrowImg}
          />
        </TouchableOpacity>
      )
    } else {
      return (
        <Image
          style={styles.circleImg}
          source={getPublicAssets().common.icon_circle_dot}
        />
      )
    }
  }

  renderContent = () => {
    if (this.props.children) {
      return this.props.children
    }
    let icon
    if (this.props.data.$ && this.props.data.$.type) {
      switch (this.props.data.$.type) {
        case 'Region':
          icon = require('../../assets/map/icon-shallow-polygon_black.png')
          break
        case 'Line':
          icon = require('../../assets/map/icon-shallow-line_black.png')
          break
        case 'Point':
          icon = require('../../assets/map/icon-shallow-dot_black.png')
          break
      }
    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.row, this.props.style]}
        onPress={() =>
          this._onPress({
            data: this.props.data,
            index: this.props.index,
          })
        }
      >
        {this.renderIcon()}
        {icon && (
          <Image
            resizeMode={'contain'}
            source={icon}
            style={[styles.icon, this.props.iconStyle]}
          />
        )}
        <Text
          style={[
            styles.title,
            icon && { marginLeft: scaleSize(20) },
            this.props.textColor && { color: this.props.textColor },
            this.props.textSize && { color: this.props.textSize },
          ]}
        >
          {this.props.data.name ||
            this.props.data.$.code + ' ' + this.props.data.$.name}
        </Text>
      </TouchableOpacity>
    )
  }

  renderChildGroups = () => {
    let childGroups =
      this.props.data.childGroups || this.props.data.feature || []
    if (!childGroups || childGroups.length === 0 || !this.state.isVisible)
      return null
    let children = []
    for (let i = 0; i < childGroups.length; i++) {
      let data = childGroups[i]
      if (this.props.renderChild) {
        children.push(this.props.renderChild({ data, index: i }))
      } else {
        children.push(
          <TreeListItem
            key={data.key || data.path || (data.$ && data.$.name) || i}
            data={data}
            style={this.props.style}
            iconStyle={this.props.iconStyle}
            // childrenData={this.props.data.childGroups[i].childGroups}
            keyExtractor={this._keyExtractor}
            onPress={() => this._onPress({ data, index: i })}
          />,
        )
      }
    }
    return (
      <Animated.View style={[styles.children, this.props.childrenStyle]}>
        {children}
        {this.props.separator && (
          <View style={[styles.separator, this.props.separatorStyle]} />
        )}
      </Animated.View>
    )
  }

  showChild = isVisible => {
    if (this.state.isVisible === isVisible) return
    isVisible = isVisible === undefined ? !this.state.isVisible : isVisible
    Animated.timing(this.state.imgRotate, {
      toValue: isVisible ? 0 : -0.5,
      duration: 200,
      easing: Easing.out(Easing.quad), // 一个用于定义曲线的渐变函数
      delay: 0, // 在一段时间之后开始动画（单位是毫秒），默认为0。
    }).start()
    this.setState({
      isVisible: isVisible,
    })
  }

  _onPress = ({ data, index }) => {
    if (this.props.onPress) {
      this.props.onPress({ data, index })
    }
  }

  _keyExtractor = () => {
    if (this.props.key) {
      return this.props.key
    } else if (this.props.keyExtractor) {
      return this.props.keyExtractor(this.props.data)
    }
  }

  render() {
    return (
      <View key={this._keyExtractor} style={[styles.item]}>
        {this.renderContent()}
        {this.renderChildGroups()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: ROW_HEIGHT,
    justifyContent: 'flex-start',
  },
  children: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: scaleSize(30),
  },
  btn: {
    paddingVertical: scaleSize(20),
    width: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    // fontSize: size.fontSize.fontSizeSm,
    fontSize: setSpText(20),
    backgroundColor: 'transparent',
  },
  arrowImg: {
    marginRight: scaleSize(20),
    height: scaleSize(20),
    width: scaleSize(20),
  },
  circleImg: {
    marginRight: scaleSize(24),
    height: scaleSize(12),
    width: scaleSize(12),
  },
  icon: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: color.bgG,
  },
})
