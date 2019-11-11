import React from 'react'
import { connect } from 'react-redux'
import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { color } from '../../styles'
import { scaleSize, setSpText } from '../../utils'
import { getLanguage } from '../../language/index'

class TabItem extends React.Component {
  props: {
    item: Object,
    language: String,
    selected: boolean,
    onPress: () => {},
    renderExtra: () => {},
  }

  constructor(props) {
    super(props)
  }

  gettitle = () => {
    let t = ''
    switch (this.props.item.key) {
      case 'Home':
        t = getLanguage(this.props.language).Navigator_Label.HOME
        break
      case 'Friend':
        t = getLanguage(this.props.language).Navigator_Label.FRIENDS
        break
      case 'Find':
        t = getLanguage(this.props.language).Navigator_Label.EXPLORE
        break
      case 'Mine':
        t = getLanguage(this.props.language).Navigator_Label.PROFILE
        break
    }
    return t
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.props.onPress}
        style={styles.touchView}
      >
        <View style={styles.labelView}>
          <Image
            resizeMode="contain"
            source={
              this.props.selected
                ? this.props.item.selectedImage
                : this.props.item.image
            }
            style={styles.icon}
          />
          <Text style={styles.tabText}>{this.gettitle()}</Text>
          {this.props.renderExtra && this.props.renderExtra()}
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.toJS(),
    language: state.setting.toJS().language,
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabItem)

const styles = StyleSheet.create({
  tabText: {
    color: color.itemColorGray,
    fontSize: setSpText(20),
  },
  icon: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  touchView: {
    alignItems: 'center',
  },
  labelView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
