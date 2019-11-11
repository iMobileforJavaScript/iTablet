import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize, screen } from '../../../../utils'
import { ImageButton } from '../../../../components'
import { getPublicAssets } from '../../../../assets'

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(30),
    paddingLeft: scaleSize(10),
    paddingRight: scaleSize(5),
    height: scaleSize(80),
  },

  titleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },

  rightView: {
    minWidth: scaleSize(120),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  contentText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    textAlign: 'right',
    backgroundColor: 'transparent',
  },
  plusBtnView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(80),
  },
  plusImgView: {
    height: scaleSize(80),
    width: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusImg: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  plusImg2: {
    height: scaleSize(30),
    width: scaleSize(30),
  },
})

export default class WeightItem extends PureComponent {
  props: {
    style?: any,
    data: Array,
    edit: () => {},
    remove: () => {},
  }

  edit = () => {
    if (this.props.edit && typeof this.props.edit === 'function') {
      this.props.edit(this.props.data)
    }
  }

  remove = () => {
    if (this.props.remove && typeof this.props.remove === 'function') {
      this.props.remove(this.props.data)
    }
  }

  renderRight = () => {
    return (
      <View style={styles.rightView}>
        <Text
          style={[
            styles.contentText,
            { maxWidth: screen.getScreenWidth() / 3 },
          ]}
        >
          {this.props.data[1].key}
        </Text>
        <ImageButton
          iconBtnStyle={styles.plusImgView}
          iconStyle={styles.plusImg}
          icon={require('../../../../assets/layerToolbar/layer_rename.png')}
          onPress={this.edit}
        />
        <ImageButton
          iconBtnStyle={styles.plusImgView}
          iconStyle={styles.plusImg2}
          icon={getPublicAssets().common.icon_delete_black}
          onPress={this.remove}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.itemContainer, this.props.style]}>
        <View style={styles.titleView}>
          <Text style={styles.title}>{this.props.data[0].key}</Text>
        </View>
        {this.renderRight()}
      </View>
    )
  }
}
