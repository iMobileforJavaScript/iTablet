import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { color, size } from '../../../../styles'
import DefaultTabBar from './DefaultTabBar'
// eslint-disable-next-line
import ScrollableTabView from 'react-native-scrollable-tab-view'
import GroupTab from './GroupTab'
import TemplateTab from './TemplateTab'

export default class SymbolTabs extends React.Component {
  props: {
    style: Object,
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
    this.currentTab = 0
  }

  render() {
    return (
      <ScrollableTabView
        style={[styles.container, this.props.style]}
        renderTabBar={() => (
          <DefaultTabBar
            // backgroundColor={color.theme}
            activeBackgroundColor={color.blackBg}
            activeTextColor={'white'}
            inactiveTextColor={'white'}
            textStyle={{
              fontSize: size.fontSize.fontSizeSm,
              backgroundColor: 'transparent',
            }}
            tabStyle={{
              backgroundColor: color.theme,
            }}
          />
        )}
        onChangeTab={({ i }) => {
          this.currentTab = i
        }}
        tabBarUnderlineStyle={{
          height: 0,
          // zIndex: -1,
          // backgroundColor: '#rgba(0, 0, 0, 0.3)',
        }}
      >
        <View tabLabel="最近" />
        <View tabLabel="符号" />
        <GroupTab tabLabel="分组" />
        <TemplateTab tabLabel="模板" />
      </ScrollableTabView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    // backgroundColor: color.blackBg,
  },
})
