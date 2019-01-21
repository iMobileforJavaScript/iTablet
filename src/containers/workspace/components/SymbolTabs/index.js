import { connect } from 'react-redux'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize, setSpText } from '../../../../utils'
import DefaultTabBar from './DefaultTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import GroupTab from './GroupTab'
import SymbolTab from './SymbolTab'
import { setCurrentSymbol, setCurrentSymbols } from '../../../../models/symbol'
import {
  setCurrentTemplateInfo,
  getSymbolTemplates,
  setCurrentTemplateList,
} from '../../../../models/template'
import { setEditLayer } from '../../../../models/layers'
import TemplateList from './TemplateList'
import TemplateTab from './TemplateTab'

const mapStateToProps = state => ({
  symbol: state.symbol.toJS(),
  user: state.user.toJS(),
  map: state.map.toJS(),
  template: state.template.toJS(),
  layers: state.layers.toJS().layers,
  currentMap: state.map.toJS().currentMap,
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setCurrentSymbol,
  setCurrentSymbols,
  setCurrentTemplateInfo,
  setEditLayer,
  getSymbolTemplates,
  setCurrentTemplateList,
}

class SymbolTabs extends React.Component {
  props: {
    style: Object,
    symbol: Object,
    template: Object,
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
    setCurrentTemplateList: () => {},
    device: Object,
  }

  static defaultProps = {
    type: 'Normal', // Normal | TemplateList
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
            activeBackgroundColor={color.bgW}
            activeTextColor={color.themeText2}
            inactiveTextColor={'white'}
            textStyle={{
              // fontSize: size.fontSize.fontSizeSm,
              fontSize: setSpText(22),
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

  renderTempleTab = () => {
    return (
      <ScrollableTabView
        ref={ref => (this.scrollTab = ref)}
        style={[styles.container, this.props.style]}
        renderTabBar={() => (
          <DefaultTabBar
            activeBackgroundColor={color.bgW}
            activeTextColor={color.themeText2}
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
        <TemplateTab
          tabLabel="最近"
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          data={this.props.template.latestTemplateSymbols}
          layers={this.props.layers}
          setCurrentTemplateInfo={this.props.setCurrentTemplateInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolTemplates={this.props.getSymbolTemplates}
          setCurrentSymbol={this.props.setCurrentSymbol}
          device={this.props.device}
        />
        <TemplateTab
          tabLabel="模板"
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          data={this.props.template.currentTemplateList}
          layers={this.props.layers}
          setCurrentTemplateInfo={this.props.setCurrentTemplateInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolTemplates={this.props.getSymbolTemplates}
          setCurrentSymbol={this.props.setCurrentSymbol}
          device={this.props.device}
        />
        <TemplateList
          tabLabel="分组"
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          template={this.props.template}
          layers={this.props.layers}
          setCurrentTemplateInfo={this.props.setCurrentTemplateInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolTemplates={this.props.getSymbolTemplates}
          setCurrentTemplateList={this.props.setCurrentTemplateList}
          goToPage={this.goToPage}
        />
        {/*<TemplateTab tabLabel="模板" />*/}
      </ScrollableTabView>
    )
  }

  render() {
    // if (this.props.template.template && this.props.template.template.path) {
    if (this.props.map.currentMap && this.props.map.currentMap.Template) {
      // return (
      //   <TemplateList
      //     style={styles.temple}
      //     user={this.props.user}
      //     showToolbar={this.props.showToolbar}
      //     template={this.props.template.template}
      //     layers={this.props.layers}
      //     setCurrentTemplateInfo={this.props.setCurrentTemplateInfo}
      //     setEditLayer={this.props.setEditLayer}
      //     getSymbolTemplates={this.props.getSymbolTemplates}
      //     setCurrentSymbol={this.props.setCurrentSymbol}
      //   />
      // )
      return this.renderTempleTab()
    } else {
      return this.renderTabs()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    backgroundColor: color.bgW,
  },
  temple: {
    paddingHorizontal: scaleSize(30),
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SymbolTabs)
