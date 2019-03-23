//
//  WeiXinUtils.h
//  iTablet
//
//  Created by zhouyuming on 2019/3/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WXApi.h"

@interface WeiXinUtils : NSObject

+(void) registerApp;

//发送文本信息
+ (void) sendTextContent:(NSString*)textContent;

//发送文件消息
+ (void)sendFileContent:(NSString*)title filePath:(NSString*)filePath;

@end