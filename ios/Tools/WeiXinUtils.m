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

+ (void)sendFileContent:(NSDictionary*)infoDic
{
  @try {
    WXMediaMessage *message = [WXMediaMessage message];
    if ([infoDic objectForKey:@"title"]) {
      message.title = [infoDic objectForKey:@"title"];
    }
    if ([infoDic objectForKey:@"description"]) {
      message.description = [infoDic objectForKey:@"description"];
    }
    if ([infoDic objectForKey:@"filePath"]) {
      NSString* filePath = [infoDic objectForKey:@"filePath"];
      WXFileObject *ext = [WXFileObject object];
      ext.fileExtension = @"zip";
      ext.fileData = [NSData dataWithContentsOfFile:filePath];
      message.mediaObject = ext;
    }
    SendMessageToWXReq* req = [[SendMessageToWXReq alloc] init];
    req.bText = NO;
    req.message = message;
    req.scene = WXSceneSession;
    
    [WXApi sendReq:req];
  } @catch (NSException *exception) {
    @throw exception;
  }
}



@end
