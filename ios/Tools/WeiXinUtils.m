//
//  WeiXinUtils.m
//  iTablet
//
//  Created by zhouyuming on 2019/3/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "WeiXinUtils.h"

@implementation WeiXinUtils

+(void) registerApp{
  //向微信注册
  [WXApi registerApp:@"wx06e9572a1d069aaa"];
}

+ (void) sendTextContent:(NSString*)textContent
{
  SendMessageToWXReq* req = [[SendMessageToWXReq alloc] init];
  req.bText = YES;
  req.text=textContent;
  req.scene = WXSceneSession;
  
  [WXApi sendReq:req];
}

+ (void)sendFileContent:(NSString*)title filePath:(NSString*)filePath
{
  WXMediaMessage *message = [WXMediaMessage message];
  //    message.title = @"ML.pdf";
  message.title = title;
  message.description = @"Pro CoreData";
  //默认设置APP图标
  [message setThumbImage:[UIImage imageNamed:[[NSBundle mainBundle] pathForResource:@"icon" ofType:@"png"]]];
  WXFileObject *ext = [WXFileObject object];
  ext.fileExtension = @"zip";
  ext.fileData = [NSData dataWithContentsOfFile:filePath];
  BOOL b =[[NSFileManager defaultManager] fileExistsAtPath:filePath isDirectory:nil];
  message.mediaObject = ext;
  
  SendMessageToWXReq* req = [[SendMessageToWXReq alloc] init];
  req.bText = NO;
  req.message = message;
  req.scene = WXSceneSession;
  
  [WXApi sendReq:req];
}



@end
