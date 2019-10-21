/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import {
  Image,
  TouchableOpacity,
  SectionList,
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import color from '../../../../styles/color'
import { getLanguage } from '../../../../language'
import { getThemeAssets } from '../../../../assets'

export default class SimpleSelectList extends React.Component {
  props: {
    data: Object,
    language: String,
    dataChange: () => {},
    showFullMap: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data || [],
      networkDataset: null,
      networkModel: null,
    }
  }

  // componentDidMount(): void {
  //   if(this.state.data.length === 0){
  //     //getDatas
  //   }
  // }

  headerAction = ({ section }) => {
    let data = [...this.state.data]
    let changed = false
    for (let i = 0; i < data.length; i++) {
      if (data[i].title === section.title) {
        data[i].visible = !data[i].visible
        changed = true
        break
      }
    }
    if (!changed) {
      data.map((item, index) => {
        if (item.data) {
          item.data.map((p, k) => {
            if (p.title === section.title && !changed) {
              data[index].data[k].visible = !data[index].data[k].visible
              changed = true
            }
          })
        }
      })
    }
    this.setState({
      data,
    })
  }
  itemAction = ({ index, section }) => {
    let data = [...this.state.data]
    let changed = false
    let networkDataset = this.state.networkDataset
    let networkModel = this.state.networkModel
    for (let i = 0; i < data.length; i++) {
      if (data[i].title === section.title) {
        data[i].data[index].checked = !data[i].data[index].checked
        networkModel = data[i].data[index]
        changed = true
      }
    }
    if (!changed) {
      data.map((item, pos) => {
        if (item.data) {
          item.data.map((p, k) => {
            if (p.title === section.title && !changed) {
              networkDataset = {
                datasourceAlias: section.title,
                datasetName: p.data[k].name,
              }
              data[pos].data[k].data[index].checked = !data[pos].data[k].data[
                index
              ].checked
              changed = true
            }
          })
        }
      })
    }
    this.setState({
      data,
      networkDataset,
      networkModel,
    })
  }
  renderLine = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 1,
          marginHorizontal: 10,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }
  renderHeader = ({ section }) => {
    let image = section.visible
      ? getThemeAssets().publicAssets.icon_arrow_down
      : getThemeAssets().publicAssets.icon_arrow_right_2
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={() => this.headerAction({ section })}
          style={[styles.row, { marginLeft: scaleSize(15) }]}
        >
          <Image
            style={styles.arrowImg}
            source={image}
            resizeMode={'contain'}
          />
          <Text style={styles.itemName}>{section.title}</Text>
        </TouchableOpacity>
        {this.renderLine()}
      </View>
    )
  }
  renderheaderComponent = () => {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          {
            getLanguage(this.props.language).Prompt
              .SELECT_DATASOURCE_FOR_NAVIGATION
          }
        </Text>
      </View>
    )
  }
  renderItem = ({ item, index, section }) => {
    if (!section.visible) return null
    const src = item.checked
      ? require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
    if (item.data) {
      let image = item.visible
        ? getThemeAssets().publicAssets.icon_arrow_down
        : getThemeAssets().publicAssets.icon_arrow_right_2
      return (
        <View>
          <View style={styles.wrapper}>
            <TouchableOpacity
              onPress={() => this.headerAction({ section: item })}
              style={[styles.row, { marginLeft: scaleSize(30) }]}
            >
              <Image
                style={styles.arrowImg}
                source={image}
                resizeMode={'contain'}
              />
              {item.image && (
                <Image
                  style={styles.icon}
                  source={item.image}
                  resizeMode={'contain'}
                />
              )}
              <Text style={styles.itemName}>{item.title}</Text>
            </TouchableOpacity>
            {this.renderLine()}
          </View>
          {item.visible &&
            item.data.map((curItem, index) => {
              let checked = curItem.checked
                ? require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')
                : require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
              return (
                <View style={styles.wrapper} key={curItem.name + index}>
                  <TouchableOpacity
                    onPress={() => this.itemAction({ index, section: item })}
                    style={[styles.row, { marginLeft: scaleSize(45) }]}
                  >
                    <Image
                      style={styles.icon}
                      source={checked}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.itemName}>{curItem.name}</Text>
                  </TouchableOpacity>
                  {this.renderLine()}
                </View>
              )
            })}
        </View>
      )
    }
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={() => this.itemAction({ index, section })}
          style={styles.row}
        >
          <Image style={styles.icon} source={src} resizeMode={'contain'} />
          {section.image && (
            <Image
              style={styles.icon}
              source={section.image}
              resizeMode={'contain'}
            />
          )}
          <Text style={styles.itemName}>{item.name}</Text>
        </TouchableOpacity>
        {this.renderLine()}
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <SectionList
          style={{
            maxHeight: scaleSize(500),
          }}
          keyExtractor={(item, index) => item.toString() + index}
          sections={this.state.data}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderHeader}
          ListHeaderComponent={this.renderheaderComponent}
        />
        <TouchableOpacity
          style={styles.confirm}
          onPress={() => {
            this.props.dataChange && this.props.dataChange(this.state.data)
          }}
        >
          <Text style={styles.confirmText}>
            {getLanguage(this.props.language).Map_Settings.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: scaleSize(600),
  },
  wrapper: {
    height: scaleSize(60),
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: color.white,
  },
  icon: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scaleSize(25),
  },
  title: {
    marginLeft: scaleSize(20),
    fontSize: setSpText(16),
    color: color.gray,
  },
  itemName: {
    fontSize: setSpText(16),
    marginLeft: scaleSize(20),
  },
  confirm: {
    position: 'absolute',
    bottom: scaleSize(10),
    height: scaleSize(60),
    left: '5%',
    width: '90%',
    borderRadius: scaleSize(30),
    backgroundColor: color.blue1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: setSpText(18),
    color: color.white,
  },
  arrowImg: {
    height: scaleSize(30),
    width: scaleSize(30),
  },
})
