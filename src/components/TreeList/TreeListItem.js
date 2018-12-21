/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
/* eslint-disable */
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
import { scaleSize } from '../../utils'
import { size } from '../../styles'

const ROW_HEIGHT = scaleSize(40)
export default class TreeListItem extends React.Component {
  props: {
    key: string,
    data: Object,
    index: number,
    children: Object,
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
  }

  constructor(props) {
    super(props)
    this.state = {
      // height: new Animated.Value(0),
      imgRotate: new Animated.Value(props.defaultShowChildren ? 0 : -0.5),
      isVisible: props.defaultShowChildren,
    }
  }

  renderContent = () => {
    if (this.props.children) {
      return this.props.children
    }
    const arrowImg = require('../../assets/mapEdit/icon-arrow-down.png')
    let icon
    if (this.props.data.$ && this.props.data.$.type) {
      switch (this.props.data.$.type) {
        case 'Region':
          icon = require('../../assets/map/layertype_georegion.png')
          break
        case 'Line':
          icon = require('../../assets/map/layertype_line.png')
          break
        case 'Point':
          icon = require('../../assets/map/layertype_point.png')
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
        {(this.props.data.childGroups &&
          this.props.data.childGroups.length > 0) ||
        (this.props.data.feature && this.props.data.feature.length > 0) ? (
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
                    // scale, scaleX, scaleY, translateX, translateY, rotate, rotateX, rotateY, rotateZ
                    {
                      rotate: this.state.imgRotate.interpolate({
                        // 旋转，使用插值函数做值映射
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
        ) : (
          <View style={styles.arrowImg} />
        )}
        {icon && (
          <Image
            resizeMode={'contain'}
            source={icon}
            style={[styles.icon, this.props.iconStyle]}
          />
        )}
        <Text style={[styles.title, icon && { marginLeft: scaleSize(20) }]}>
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
    fontSize: size.fontSize.fontSizeSm,
    backgroundColor: 'transparent',
  },
  arrowImg: {
    marginRight: scaleSize(20),
    height: scaleSize(20),
    width: scaleSize(20),
  },
  icon: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
})
