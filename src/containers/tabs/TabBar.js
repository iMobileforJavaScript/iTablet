import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { ListSeparator } from '../../components'
import PropTypes from 'prop-types'
import { getThemeAssets } from '../../assets'
import { connect } from 'react-redux'
import TabItem from './TabItem'
import InformSpot from './Friend/InformSpot'
import { UserType } from '../../constants'

class Tabbar extends React.Component {
  static propTypes = {
    language: PropTypes.string,
    user: PropTypes.object,
    type: PropTypes.string,
    navigation: PropTypes.object,
    POP_List: PropTypes.func,
    layerManager: PropTypes.func,
    style: PropTypes.any,
  }

  constructor(props) {
    super(props)
  }

  getTabData = () => {
    let list = []
    if (
      UserType.isProbationUser(this.props.user.currentUser) ||
      UserType.isOnlineUser(this.props.user.currentUser)
    ) {
      list = [
        {
          key: 'Home',
          image: getThemeAssets().tabBar.tab_home,
          selectedImage: getThemeAssets().tabBar.tab_home_selected,
          btnClick: () => {
            this.props.navigation && this.props.navigation.navigate('Home')
          },
        },
        // {
        //   key: 'Friend',
        //   image: getThemeAssets().tabBar.tab_friend,
        //   selectedImage: getThemeAssets().tabBar.tab_friend_selected,
        //   btnClick: () => {
        //     this.props.navigation && this.props.navigation.navigate('Friend')
        //   },
        // },
        // {
        //   key: 'Find',
        //   image: getThemeAssets().tabBar.tab_discover,
        //   selectedImage: getThemeAssets().tabBar.tab_discover_selected,
        //   btnClick: () => {
        //     this.props.navigation && this.props.navigation.navigate('Find')
        //   },
        // },
        {
          key: 'Mine',
          image: getThemeAssets().tabBar.tab_mine,
          selectedImage: getThemeAssets().tabBar.tab_mine_selected,
          btnClick: () => {
            this.props.navigation && this.props.navigation.navigate('Mine')
          },
        },
      ]
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      list = [
        {
          key: 'Home',
          image: getThemeAssets().tabBar.tab_home,
          selectedImage: getThemeAssets().tabBar.tab_home_selected,
          btnClick: () => {
            this.props.navigation && this.props.navigation.navigate('Home')
          },
        },
        // {
        //   key: 'Find',
        //   image: getThemeAssets().tabBar.tab_discover,
        //   selectedImage: getThemeAssets().tabBar.tab_discover_selected,
        //   btnClick: () => {
        //     this.props.navigation && this.props.navigation.navigate('Find')
        //   },
        // },
        {
          key: 'Mine',
          image: getThemeAssets().tabBar.tab_mine,
          selectedImage: getThemeAssets().tabBar.tab_mine_selected,
          btnClick: () => {
            this.props.navigation && this.props.navigation.navigate('Mine')
          },
        },
      ]
    }

    return list
  }

  _renderItem = ({ item }, key) => {
    let NavIndex = this.props.navigation.state.index
    let routeKey = this.props.navigation.state.routes[NavIndex].key
    return (
      <TabItem
        key={key}
        item={item}
        selected={routeKey === item.key}
        onPress={() => {
          item.btnClick && item.btnClick()
        }}
        renderExtra={() => {
          if (item.key === 'Friend') {
            return <InformSpot />
          }
        }}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator mode={ListSeparator.mode.VERTICAL} />
  }

  _keyExtractor = item => item.key

  renderItems = data => {
    let toolbar = []
    let key = 0
    data.forEach((item, index) => {
      toolbar.push(this._renderItem({ item, index }, key++))
    })
    return toolbar
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.renderItems(this.getTabData())}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.toJS(),
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tabbar)

const styles = StyleSheet.create({
  container: {
    height: scaleSize(96),
    width: '100%',
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
