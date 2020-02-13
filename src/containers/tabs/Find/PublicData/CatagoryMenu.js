import React from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native'
import { scaleSize } from '../../../../utils'
import { getThemeAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'
import DropdownView from './DropdownView'
import styles from './styles'

export default class CatagoryMenu extends React.Component {
  props: {
    onPress: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      data: this.getData(),
    }
    this.pages = [] //页面层级
    this.height = new Animated.Value(0)
  }

  getData = () => [
    {
      key: getLanguage(global.language).Find.ONLINE_WORKSPACE,
      value: 'workspace',
    },
    {
      key: getLanguage(global.language).Find.ONLINE_DATASOURCE,
      value: 'udb',
    },
    {
      key: getLanguage(global.language).Find.ONLINE_MAP_RESOURCE,
      value: 'resource',
      child: [
        {
          key: getLanguage(global.language).Find.ONLINE_COLORSCHEME,
          value: 'color',
        },
        {
          key: getLanguage(global.language).Find.ONLINE_SYMBOL,
          value: 'symbol',
        },
      ],
    },
  ]

  setVisible = visible => {
    if (this.state.visible !== visible) {
      this.setState({ visible: visible })
      this.changeHeight()
    }
  }

  changeHeight = () => {
    let items = this.state.data.length
    let heigth = scaleSize(40) + scaleSize(90) * items
    Animated.timing(this.height, {
      toValue: heigth,
      duration: 500,
    }).start()
  }

  renderBtns = () => {
    return (
      <View style={styles.listBottonViewStyle}>
        {this.pages.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              this.pages = this.pages.slice(0, this.pages.length - 1)
              let data = this.getData()
              for (let i = 0; i < this.pages.length; i++) {
                data = data[this.pages[i]]
              }
              this.setState(
                {
                  data: data,
                },
                () => {
                  this.changeHeight()
                },
              )
            }}
          >
            <Text style={styles.textStyle}>
              {getLanguage(global.language).Find.BACK}
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    )
  }

  renderItem = ({ index, item }) => {
    return (
      <View style={styles.ListItemContainerStyle}>
        <TouchableOpacity
          style={styles.ListItemViewStyle}
          onPress={() => {
            this.props.onPress(item)
          }}
        >
          <Text style={styles.textStyle}>{item.key}</Text>
          {item.child && (
            <TouchableOpacity
              style={styles.ListItemMoreViewStyle}
              onPress={() => {
                this.pages.push(index)
                this.setState(
                  {
                    data: this.getData()[index].child,
                  },
                  () => {
                    this.changeHeight()
                  },
                )
              }}
            >
              <Image
                source={getThemeAssets().publicAssets.icon_arrow_right}
                style={styles.ListItemMoreImgViewStyle}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {this.state.data.length !== index + 1 && (
          <View style={styles.seperator} />
        )}
      </View>
    )
  }

  renderList = () => {
    return (
      <Animated.View
        style={[styles.listContainerStyle, { height: this.height }]}
      >
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        {this.renderBtns()}
      </Animated.View>
    )
  }

  render() {
    return (
      <DropdownView visible={this.state.visible} backgrourdColor={'#EEEEEE'}>
        {this.renderList()}
      </DropdownView>
    )
  }
}
