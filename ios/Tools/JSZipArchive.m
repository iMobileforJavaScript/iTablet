//
//  JSZipArchive.m
//  iTablet
//
//  Created by Yang Shang Long on 2018/9/21.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JSZipArchive.h"

@implementation JSZipArchive
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(unZipFile, unZipFileByPath:(NSString *)archivePath targetPath:(NSString *)targetPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL isZip = NO;

    ZipArchive *za = [[ZipArchive alloc] init];
    BOOL isOpen = [za UnzipOpenFile: archivePath];
    if (isOpen){
      isZip = [za UnzipFileTo: targetPath overWrite: YES];
      [za UnzipCloseFile];
    }
    
    resolve([NSNumber numberWithBool:isZip]);
  } @catch (NSException *exception) {
    reject(@"unZipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(deleteFile, deleteFileByPath:(NSString *)Path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = NO;
    if([[NSFileManager defaultManager] fileExistsAtPath:Path isDirectory:nil]){
      result = [[NSFileManager defaultManager] removeItemAtPath:Path error:nil];
    }
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"unZipFile", exception.reason, nil);
  }
}

@end
