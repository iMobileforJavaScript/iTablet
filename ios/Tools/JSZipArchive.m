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

RCT_REMAP_METHOD(zipFile, zipFileByPath:(NSString *)archivePath targetPath:(NSString *)targetPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    BOOL isDir = NO;
    BOOL exist = [fileManager fileExistsAtPath:archivePath isDirectory:&isDir];
    BOOL result = NO;
    if (exist) {
      if (isDir) {
        result = [SSZipArchive createZipFileAtPath:targetPath withContentsOfDirectory:archivePath];
      } else {
        NSArray* filePaths = [NSArray arrayWithObjects:archivePath, nil];
        result = [SSZipArchive createZipFileAtPath:targetPath withFilesAtPaths:filePaths];
      }
    }
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"zipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(unZipFile, unZipFileByPath:(NSString *)archivePath targetPath:(NSString *)targetPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = NO;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    BOOL isDir = NO;
    BOOL exist = [fileManager fileExistsAtPath:archivePath isDirectory:&isDir];
    
    if (exist){
      result = [SSZipArchive unzipFileAtPath:archivePath toDestination:targetPath];
    }
    
    resolve([NSNumber numberWithBool:result]);
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
