import React from 'react'
import { connect } from 'react-redux'
import { Image, StyleSheet, View, Text } from 'react-native'
import { color } from '../../styles'
import { scaleSize, setSpText } from '../../utils'

import { getThemeAssets } from '../../assets'

class TabItem extends React.Component {
  props: {
    data: Object,
    user: Object,
    currentUser: Object,
  }

  static defaultProps = {
    data: {},
    currentUser: {},
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.labelView}>
        <Image
          resizeMode="contain"
          source={
            this.props.data.focused
              ? getThemeAssets().tabBar.tab_friend_selected
              : getThemeAssets().tabBar.tab_friend
          }
          style={styles.icon}
        />
        <Text style={styles.tabText}>
          {'好友' + this.props.currentUser.userName}
        </Text>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.toJS(),
    currentUser: state.user.toJS().currentUser,
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabItem)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabText: {
    color: color.fontColorWhite,
    fontSize: setSpText(20),
    // paddingTop:Platform.OS === 'android' ?  scaleSize(3) : 0,
  },
  selectedTabText: {
    color: color.blue2,
    fontSize: setSpText(20),
    // paddingTop:Platform.OS === 'android' ?  scaleSize(3) : 0,
  },
  icon: {
    width: scaleSize(60),
    height: scaleSize(60),
    // backgroundColor: "pink"
  },
  labelView: {
    // marginTop: Platform.OS === 'android' ? scaleSize(2) : 0,
    // backgroundColor: "red",
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
