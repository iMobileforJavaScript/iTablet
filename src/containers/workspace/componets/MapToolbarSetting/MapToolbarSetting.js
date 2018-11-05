import React, { Component } from 'react'
import { Container } from '../../../../components'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SectionList,
} from 'react-native'

export default class MapToolbarSetting extends Component {
  render() {
    return (
      <Container
        headerProps={{
          title: '地图制作',
          headerStyle: { backgroundColor: 'black' },
        }}
      >
        <View style={styles.container}>
          <SectionList
            sections={[
              {
                title: '基本设置',
                data: [
                  '地图名称',
                  '旋转角度',
                  '颜色模式',
                  '背景颜色',
                  '文本反走样',
                  '线型反走样',
                  '固定符号角度',
                  '固定文本角度',
                  '固定文本方向',
                  '显示压盖对象',
                  '显示专题图图例',
                  '显示状态栏',
                  '显示导航栏',
                ],
              },
              {
                title: '范围设置',
                data: [
                  '中心点',
                  '比例尺',
                  '固定比例尺级别',
                  '当前窗口四至范围',
                ],
              },
              { title: '坐标系设置', data: ['投影设置', '投影转换'] },
              { title: '工具设置', data: ['轨迹设置', '选择设置'] },
            ]}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={this._onPressButton}>
                <Text style={styles.item}>{item}</Text>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            keyExtractor={(item, index) => index}
          />
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  sectionHeader: {
    fontSize: 23,
    fontWeight: 'bold',
    backgroundColor: '#161616',
    color: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    paddingLeft: 20,
    height: 44,
    backgroundColor: '#161616',
    color: 'white',
  },
})
