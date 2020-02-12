import React from 'react'
import { connect } from 'react-redux'
import { Image, StyleSheet, View, Text } from 'react-native'
import { color } from '../../styles'
import { scaleSize, setSpText } from '../../utils'
import { getLanguage } from '../../language/index'

class TabItem extends React.Component {
  props: {
    data: Object,
    title: String,
    language: String,
    selectedImage: Object,
    image: Object,
    onPress: () => {},
    renderExtra: () => {},
  }

  constructor(props) {
    super(props)
  }

  getTitle = () => {
    let t = ''
    switch (this.props.title) {
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
      <View style={styles.labelView}>
        <Image
          resizeMode="contain"
          source={
            this.props.data.focused
              ? this.props.selectedImage
              : this.props.image
          }
          style={styles.icon}
        />
        <Text style={styles.tabText}>{this.getTitle()}</Text>
        {this.props.renderExtra && this.props.renderExtra()}
      </View>
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
