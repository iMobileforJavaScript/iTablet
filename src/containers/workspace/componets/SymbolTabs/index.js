import { connect } from 'react-redux'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import DefaultTabBar from './DefaultTabBar'
// eslint-disable-next-line
import ScrollableTabView from 'react-native-scrollable-tab-view'
import GroupTab from './GroupTab'
// import TemplateTab from './TemplateTab'
import SymbolTab from './SymbolTab'
import { setCurrentSymbol, setCurrentSymbols } from '../../../../models/symbol'

const mapStateToProps = state => ({
  symbol: state.symbol.toJS(),
})

const mapDispatchToProps = {
  setCurrentSymbol,
  setCurrentSymbols,
}

class SymbolTabs extends React.Component {
  props: {
    style: Object,
    symbol: Object,
    setCurrentSymbol: () => {},
    setCurrentSymbols: () => {},
    showToolbar: () => {},
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
    this.currentTab = 0
  }

  goToPage = index => {
    this.scrollTab.goToPage(index)
  }

  render() {
    return (
      <ScrollableTabView
        ref={ref => (this.scrollTab = ref)}
        style={[styles.container, this.props.style]}
        // page={this.currentTab}
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
        <SymbolTab
          tabLabel="最近"
          data={this.props.symbol.latestSymbols}
          setCurrentSymbol={this.props.setCurrentSymbol}
          showToolbar={this.props.showToolbar}
        />
        <SymbolTab
          tabLabel="符号"
          data={this.props.symbol.currentSymbols}
          setCurrentSymbol={this.props.setCurrentSymbol}
          showToolbar={this.props.showToolbar}
        />
        <GroupTab
          tabLabel="分组"
          goToPage={this.goToPage}
          setCurrentSymbols={this.props.setCurrentSymbols}
        />
        {/*<TemplateTab tabLabel="模板" />*/}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SymbolTabs)
