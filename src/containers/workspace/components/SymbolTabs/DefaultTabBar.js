import * as React from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native'
// import TouchableItem from 'react-navigation/src/views/TouchableItem'
import { TouchableItem } from '../../../../components'

export default class DefaultTabBar extends React.Component {
  props: {
    goToPage: () => {},
    activeTab: number,
    tabs: Array,
    backgroundColor: string,
    activeBackgroundColor: string,
    activeTextColor: string,
    inactiveTextColor: string,
    style: any,
    textStyle: any,
    tabStyle: any,
    renderTab: () => {},
    underlineStyle: any,
    containerWidth: number,
    scrollValue: Object,
  }

  static defaultProps = {
    activeBackgroundColor: '#2F2F31',
    activeTextColor: 'navy',
    inactiveTextColor: 'black',
    backgroundColor: null,
  }

  renderTab = (name, page, isTabActive, onPressHandler) => {
    const {
      activeTextColor,
      inactiveTextColor,
      textStyle,
      activeBackgroundColor,
    } = this.props
    const textColor = isTabActive ? activeTextColor : inactiveTextColor
    const fontWeight = isTabActive ? 'bold' : 'normal'
    name = name ? name : ''
    return (
      <TouchableItem
        key={name}
        style={[
          styles.tab,
          this.props.tabStyle,
          isTabActive && { backgroundColor: activeBackgroundColor },
        ]}
        onPress={() => onPressHandler(page)}
      >
        <Text style={[{ color: textColor, fontWeight }, textStyle]}>
          {name}
        </Text>
      </TouchableItem>
    )
  }

  render() {
    const containerWidth = this.props.containerWidth
    const numberOfTabs = this.props.tabs.length
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    }

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    })
    return (
      <View
        style={[
          styles.tabs,
          { backgroundColor: this.props.backgroundColor },
          this.props.style,
        ]}
      >
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page
          const renderTab = this.props.renderTab || this.renderTab
          return renderTab(name, page, isTabActive, this.props.goToPage)
        })}
        <Animated.View
          style={[
            tabUnderlineStyle,
            {
              transform: [{ translateX }],
            },
            this.props.underlineStyle,
          ]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
  // tabButtonTitle: {
  //   fontSize: size.fontSize.fontSizeSm,
  //   color: 'white',
  // },
})
