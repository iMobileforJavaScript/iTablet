import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text, TextInput } from 'react-native'
import { Container, Button } from '../../../../components'
// import { MineItem} from '../../../../../src/containers/Tabs/Mine/component'
// import { MineItem} from '../../../Tabs/Mine/component'
import { MineItem } from '../../../tabs/Mine/component'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'
import { SMap } from 'imobile_for_reactnative'
import { scaleSize, Toast } from '../../../../utils'

export default class SuggestionFeedback extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)

    let problemItems = []
    problemItems.push({
      title: getLanguage(global.language).Profile.SUGGESTION_FUNCTION_ABNORMAL,
      checked: false,
    })
    problemItems.push({
      title: getLanguage(global.language).Profile.SUGGESTION_PRODUCT_ADVICE,
      checked: false,
    })
    problemItems.push({
      title: getLanguage(global.language).Profile.SUGGESTION_OTHER_PROBLEMS,
      checked: false,
    })
    this.state = {
      problemItems: problemItems,
      selectProblemItems: [],
      problemsDetail: '',
      contactWay: '',
    }
  }

  //显示想要反馈的问题点
  renderSuggestionItems() {
    let itemViews = []
    for (let i = 0; i < this.state.problemItems.length; i++) {
      let item = this.state.problemItems[i]
      itemViews.push(this.renderSelectItemView(item))
    }
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.item}>
          <Text style={styles.title}>
            {getLanguage(global.language).Profile.SUGGESTION_SELECT_PROBLEMS}
          </Text>
        </View>
        <View style={styles.separateLine} />
        {itemViews}
      </View>
    )
  }

  renderSelectItemView = item => {
    return (
      // <View></View>
      <View style={{ backgroundColor: color.white }}>
        <MineItem
          item={item}
          // image={img}
          text={item.title}
          // text={'item.title'}
          disableTouch={false}
          showRight={false}
          showCheck={true}
          contentStyle={{ paddingLeft: scaleSize(10) }}
          imageStyle={{ width: 0, marginRight: scaleSize(10) }}
          textStyle={{ fontSize: scaleSize(22), color: color.black }}
          onPressCheck={item => {
            let selectProblemItems = this.state.selectProblemItems
            if (item.checked) {
              selectProblemItems.push(item)
            } else {
              for (let i = 0; i < selectProblemItems.length; i++) {
                if (selectProblemItems[i].title === item.title) {
                  selectProblemItems.splice(i, 1)
                }
              }
            }
            this.setState({ selectProblemItems: selectProblemItems })
          }}
        />
      </View>
    )
  }

  //详细问题和意见
  renderSuggestionDetail() {
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.item}>
          <Text style={styles.title}>
            {getLanguage(global.language).Profile.SUGGESTION_PROBLEMS_DETAIL}
          </Text>
        </View>
        <View style={styles.separateLine} />
        <TextInput
          style={styles.input}
          placeholder={
            getLanguage(global.language).Profile.SUGGESTION_PROBLEMS_DESCRIPTION
          }
          placeholderTextTextColor={color.gray2}
          onChangeText={text => {
            this.setState({
              problemsDetail: text,
            })
          }}
        />
      </View>
    )
  }

  //联系方式
  renderContactWay() {
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.item}>
          <Text style={styles.title}>
            {getLanguage(global.language).Profile.SUGGESTION_CONTACT_WAY}
          </Text>
        </View>
        <View style={styles.separateLine} />
        <TextInput
          style={{
            width: '100%',
            height: scaleSize(90),
            fontSize: scaleSize(22),
            padding: scaleSize(15),
            backgroundColor: color.white,
          }}
          placeholder={
            getLanguage(global.language).Profile.SUGGESTION_CONTACT_WAY_INPUT
          }
          placeholderTextTextColor={color.gray2}
          onChangeText={text => {
            this.setState({
              contactWay: text,
            })
          }}
        />
      </View>
    )
  }

  //提交按钮
  renderButton() {
    return (
      <View style={{ alignItems: 'center' }}>
        <Button
          title={getLanguage(global.language).Profile.SUGGESTION_SUBMIT}
          type="BLUE"
          style={{
            width: '94%',
            height: scaleSize(60),
            marginTop: scaleSize(60),
          }}
          titleStyle={{ fontSize: scaleSize(24) }}
          onPress={this.submit}
        />
      </View>
    )
  }

  submit = async () => {
    GLOBAL.Loading.setLoading(
      true,
      getLanguage(global.language).Profile.SUGGESTION_SUBMIT,
    )
    let result = this.checkSuggestionInfo()
    if (!result.isCanSubmit) {
      Toast.show(result.msg)
      GLOBAL.Loading.setLoading(false)
      return
    }

    let suggest = {}
    let problemItems = []
    for (let i = 0; i < this.state.selectProblemItems.length; i++) {
      let item = this.state.selectProblemItems[i]
      problemItems.push({ problemTitle: item.title })
    }

    suggest.problemItems = problemItems
    suggest.problemsDetail = this.state.problemsDetail
    suggest.contactWay = this.state.contactWay

    let submitResult = await SMap.suggestionFeedback(suggest)
    if (submitResult) {
      Toast.show(getLanguage(global.language).Profile.SUGGESTION_SUBMIT_SUCCEED)
    } else {
      Toast.show(getLanguage(global.language).Profile.SUGGESTION_SUBMIT_FAILED)
    }
    GLOBAL.Loading.setLoading(false)
  }

  //检测是否输入完成
  checkSuggestionInfo() {
    let result = { isCanSubmit: false, msg: '' }
    if (this.state.selectProblemItems.length === 0) {
      result.msg = getLanguage(
        global.language,
      ).Profile.SUGGESTION_SELECT_PROBLEMS
    } else if (this.state.problemsDetail === '') {
      result.msg = getLanguage(
        global.language,
      ).Profile.SUGGESTION_PROBLEMS_DETAIL
    } else if (this.state.contactWay === '') {
      result.msg = getLanguage(
        global.language,
      ).Profile.SUGGESTION_CONTACT_WAY_INPUT
    } else {
      result.isCanSubmit = true
    }
    return result
  }

  renderContent() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
        <View style={{ flex: 1, backgroundColor: color.background }}>
          <View style={{ height: 10 }} />
          {this.renderSuggestionItems()}
          <View style={{ height: 10 }} />
          {this.renderSuggestionDetail()}
          <View style={{ height: 10 }} />
          {this.renderContactWay()}
          <View style={{ height: 10 }} />
          {this.renderButton()}
        </View>
      </ScrollView>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile
            .SETTING_SUGGESTION_FEEDBACK,
          //'意见反馈',
          navigation: this.props.navigation,
        }}
      >
        {this.renderContent()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgW,
  },

  item: {
    width: '100%',
    height: scaleSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  title: {
    fontSize: scaleSize(18),
    color: color.gray,
    marginLeft: 15,
  },
  subTitle: {
    fontSize: scaleSize(20),
    marginLeft: 15,
  },
  separateLine: {
    width: '100%',
    height: scaleSize(1),
    backgroundColor: color.item_separate_white,
  },
  input: {
    width: '100%',
    height: scaleSize(120),
    fontSize: scaleSize(22),
    padding: scaleSize(15),

    // textAlignVertical: 'center',

    backgroundColor: color.white,
  },
})
