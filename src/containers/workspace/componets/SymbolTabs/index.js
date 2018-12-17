import { connect } from 'react-redux'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import DefaultTabBar from './DefaultTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import GroupTab from './GroupTab'
import SymbolTab from './SymbolTab'
import { setCurrentSymbol, setCurrentSymbols } from '../../../../models/symbol'
import {
  setCurrentTemplateInfo,
  getSymbolTemplates,
} from '../../../../models/map'
import { setEditLayer } from '../../../../models/layers'
import Temple from './Temple'

const mapStateToProps = state => ({
  symbol: state.symbol.toJS(),
  user: state.user.toJS(),
  map: state.map.toJS(),
  layers: state.layers.toJS().layers,
  currentMap: state.map.toJS().currentMap,
})

const mapDispatchToProps = {
  setCurrentSymbol,
  setCurrentSymbols,
  setCurrentTemplateInfo,
  setEditLayer,
  getSymbolTemplates,
}

class SymbolTabs extends React.Component {
  props: {
    style: Object,
    symbol: Object,
    layers: Object,
    map: Object,
    user: Object,
    setCurrentSymbol: () => {},
    setCurrentSymbols: () => {},
    showToolbar: () => {},
    showBox: () => {},
    setCurrentTemplateInfo: () => {},
    setEditLayer: () => {},
    getSymbolTemplates: () => {},
  }

  static defaultProps = {
    type: 'Normal', // Normal | Template
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  goToPage = index => {
    this.scrollTab.goToPage(index)
  }

  renderTabs = () => {
    return (
      <ScrollableTabView
        ref={ref => (this.scrollTab = ref)}
        style={[styles.container, this.props.style]}
        renderTabBar={() => (
          <DefaultTabBar
            activeBackgroundColor={color.theme}
            activeTextColor={'white'}
            inactiveTextColor={'white'}
            textStyle={{
              fontSize: size.fontSize.fontSizeSm,
              backgroundColor: 'transparent',
            }}
            tabStyle={{
              backgroundColor: color.subTheme,
            }}
          />
        )}
        tabBarUnderlineStyle={{
          height: 0,
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

  render() {
    if (this.props.map.template && this.props.map.template.path) {
      return (
        <Temple
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          template={this.props.map.template}
          layers={this.props.layers}
          setCurrentTemplateInfo={this.props.setCurrentTemplateInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolTemplates={this.props.getSymbolTemplates}
        />
      )
    } else {
      return this.renderTabs()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    // backgroundColor: color.subTheme,
  },
  temple: {
    paddingHorizontal: scaleSize(30),
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SymbolTabs)
