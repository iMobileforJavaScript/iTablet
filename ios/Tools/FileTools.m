//
//  FileTools.m
//  iTablet
//
//  Created by Yang Shang Long on 2018/9/21.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "FileTools.h"

NSString * const MESSAGE_IMPORTEXTERNALDATA = @"com.supermap.RN.Mapcontrol.message_importexternaldata";
NSString * const MESSAGE_SHARERESULT = @"com.supermap.RN.Mapcontrol.message_shareresult";
static FileTools *filetools = nil;

@implementation FileTools

RCT_EXPORT_MODULE();
- (NSArray<NSString *> *)supportedEvents
{
  return @[
          MESSAGE_IMPORTEXTERNALDATA,
          MESSAGE_SHARERESULT,
           ];
}

+(id)allocWithZone:(NSZone *)zone {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    filetools = [super allocWithZone:zone];
  });
  return filetools;
}

+(NSString *)getFilePath:(NSString *)path{
  NSString *realPath = path;
  NSFileManager *filemanager = [NSFileManager defaultManager];
  BOOL isDir = YES;
  BOOL hasDirInPath = NO;
  NSString *dirpath;
  if([filemanager fileExistsAtPath:realPath isDirectory:&isDir]){
    NSArray *contents = [filemanager contentsOfDirectoryAtPath:realPath error:nil];
    for(NSString * item in contents){
      NSString *curPath = [NSString stringWithFormat:@"%@%@%@",realPath,item,@"/"];
      if([filemanager fileExistsAtPath:curPath isDirectory:&isDir]){
        hasDirInPath = YES;
        dirpath = curPath;
      }
      if([item hasSuffix:@".smwu"]){
        return realPath;
      }
    }
    if(hasDirInPath){
      return [FileTools getFilePath:dirpath];
    }else{
      return realPath;
    }
  }else{
    return realPath;
  }
}

RCT_REMAP_METHOD(getHomeDirectory,getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  NSString* home = [NSHomeDirectory() stringByAppendingString:@"/Documents"];
  if (home) {
    resolve(home);
  }else{
    reject(@"systemUtil",@"get home directory failed",nil);
  }
}

RCT_REMAP_METHOD(getPathListByFilter, path:(NSString*)path filter:(NSDictionary*)filter resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  BOOL flag = YES;
  NSFileManager* fileMgr = [NSFileManager defaultManager];
  NSMutableArray* array = [NSMutableArray array];
  
  if ([fileMgr fileExistsAtPath:path isDirectory:&flag]) {
    NSArray* tempArray = [fileMgr contentsOfDirectoryAtPath:path error:nil];
    
    NSString* filterName = filter[@"name"];
    NSString* filterEx = filter[@"extension"];
    NSString* type = filter[@"type"];
    NSString* excluedFile = filter[@"exclued"];
//    NSString* type = @"Directory";
//    if (filter[@"type"]) {
//      type = [filter[@"type"] isEqualToString:@""] ? @"Directory" : filter[@"type"];
//    }
    for (NSString* fileName in tempArray) {
      
      
      NSString* fullPath = [path stringByAppendingPathComponent:fileName];
      NSString* strModeDate;
      if ([fileMgr fileExistsAtPath:fullPath isDirectory:&flag]) {
        NSError *error = nil;
        NSDictionary *fileAttributes = [fileMgr attributesOfItemAtPath:fullPath error:&error];
        if(fileAttributes != nil){
          NSDate* fileModDate = [fileAttributes objectForKey:NSFileModificationDate];
          strModeDate = [FileTools getLastModifiedTime:fileModDate];
        }
        NSString* tt = [fullPath stringByReplacingOccurrencesOfString:[NSHomeDirectory() stringByAppendingString:@"/Documents"] withString:@""];
        NSString* extension = [tt pathExtension];
        NSString* fileName = [tt lastPathComponent];
        
        //不包含
        if (excluedFile != nil && [fileName.lowercaseString containsString:[excluedFile.lowercaseString.lowercaseString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]]]) continue;
        
        // 匹配后缀
        if (filterEx != nil) {
          NSArray* exArr = [filterEx componentsSeparatedByString:@","];
          BOOL hasFile = NO;
          for (int i = 0; i < exArr.count; i++) {
            NSString* tempEx = [[exArr[i] lowercaseString] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
            if ([tempEx isEqualToString:[extension lowercaseString]]) {
              hasFile = YES;
              break;
            }
          }
          if (!hasFile) continue;
        }
        // 匹配名称
        if (filterName != nil && ![fileName.lowercaseString containsString:[filterName.lowercaseString.lowercaseString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]]]) continue;
        // 匹配类型
        if (type != nil && ([type isEqualToString:@"Directory"] != flag)) continue;
        
        [array addObject:@{@"name":fileName,@"path":tt,@"mtime":strModeDate,@"isDirectory":@(flag)}];
        
//        if(
//           (
//            filterEx != nil && [filterEx containsString:extension] &&
//            (
//             filterName == nil ||
//             [filterName containsString:fileName] ||
//             [filterName isEqualToString:@""]
//             )
//            ) ||
//           (flag && [type isEqualToString:@"Directory"])) {
//          [array addObject:@{@"name":fileName,@"path":tt,@"mtime":strModeDate,@"isDirectory":@(flag)}];
//        }
        
      }
      
    }
  }
  
  resolve(array);
}

#pragma mark 获取nsm（网络模型）文件
RCT_REMAP_METHOD(getNetModel, getNetModelWithPath:(NSString *)path resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try{
    NSMutableArray *array = [[NSMutableArray alloc] init];
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSArray *fileList = [fileManager contentsOfDirectoryAtPath:path error:nil];
    for(NSString *file in fileList){
      BOOL isDir = NO;
      NSString *fileName = [[NSString alloc]initWithFormat:@"%@%@%@",path,@"/",file];
      [fileManager fileExistsAtPath:fileName isDirectory:&isDir];
      if([file hasSuffix:@".snm"] && !isDir){
        NSDictionary *dic = @{
                              @"path":fileName,
                              @"name":file,
                              };
        [array addObject:dic];
      }
    }
    resolve(array);
  }@catch(NSException *exception){
    reject(@"getNetModel", exception.reason, nil);
  }
}

#pragma mark 深度遍历指定目录下的指定后缀的文件
NSMutableArray *array;
RCT_REMAP_METHOD(getPathListByFilterDeep, getPathListByFilterDeepWithPath:(NSString *)path surffix:(NSString *) surffix resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try{
    array = [[NSMutableArray alloc]init];
    [FileTools getFileAtDirectoryWithPath:path Extensions:surffix];
    resolve(array);
    array = nil;
  }@catch(NSException *exception){
    reject(@"getPathListByFilterDeep",exception.reason,nil);
  }
}

+(void)getFileAtDirectoryWithPath:(NSString *)path Extensions:(NSString *) extensions {
  //NSMutableArray *array = [[NSMutableArray alloc]init];
  NSFileManager *filemanager = [NSFileManager defaultManager];
  NSArray *currentFiles = [filemanager contentsOfDirectoryAtPath:path error:nil];
  NSArray *exts = [extensions componentsSeparatedByString:@","];
  
  BOOL isDir;
  
  for(NSString *file in currentFiles){
    isDir = NO;
    NSString *fileName = [[NSString alloc]initWithFormat:@"%@%@%@",path,@"/",file];
    BOOL isDirExist = [filemanager fileExistsAtPath:fileName isDirectory:&isDir];
    
    if(isDir && isDirExist){
      [self getFileAtDirectoryWithPath:fileName Extensions:extensions];
    }else{
      for(int j = 0; j < exts.count; j++){
        if([file hasSuffix:exts[j]]){
          NSString *filePath = [[NSString alloc] initWithFormat:@"%@%@%@",path,@"/",file];
          NSObject *obj = @{@"name":file,@"path":filePath};
          [array addObject:obj];
          continue;
        }
      }
    }
  }
}

RCT_REMAP_METHOD(getMaps, getMapsPath:(NSString*)path filter:(NSDictionary*)filter resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL flag = YES;
    BOOL templateFlag = YES;
    NSFileManager* fileMgr = [NSFileManager defaultManager];
    NSMutableArray* array = [NSMutableArray array];
    
    NSString* templatePath = [NSString stringWithFormat:@"%@/%@", [path stringByDeletingLastPathComponent], @"Template"];
    NSArray* templateArray;
    if ([fileMgr fileExistsAtPath:templatePath isDirectory:&templateFlag]) {
      templateArray = [fileMgr contentsOfDirectoryAtPath:templatePath error:nil];
    }
    
    if ([fileMgr fileExistsAtPath:path isDirectory:&flag]) {
      NSArray* tempArray = [fileMgr contentsOfDirectoryAtPath:path error:nil];
      
      NSString* filterEx = @"xml";
      NSString* filterName = filter[@"name"];
      if (filterName == nil) filterName = @"";
      for (NSString* fileName in tempArray) {
        NSString* fullPath = [path stringByAppendingPathComponent:fileName];
        NSString* strModeDate;
        if ([fileMgr fileExistsAtPath:fullPath isDirectory:&flag]) {
          NSError *error = nil;
          NSDictionary *fileAttributes = [fileMgr attributesOfItemAtPath:fullPath error:&error];
          if(fileAttributes != nil){
            NSDate* fileModDate = [fileAttributes objectForKey:NSFileModificationDate];
            strModeDate = [FileTools getLastModifiedTime:fileModDate];
          }
          NSString* tt = [fullPath stringByReplacingOccurrencesOfString:[NSHomeDirectory() stringByAppendingString:@"/Documents"] withString:@""];
          NSString* extension = [tt pathExtension];
          NSString* fileName = [tt lastPathComponent];
          if([filterEx containsString:extension] && ([fileName containsString:filterName] || [filterName isEqualToString:@""])) {
            BOOL isTemplate = NO;
//            for (NSString* templateFileName in templateArray) {
//              NSString* _fileName = [fileName stringByDeletingPathExtension];
//              NSString* expFileName = [_fileName stringByAppendingPathExtension:@"exp"];
//              NSString* expPath = [NSString stringWithFormat:@"%@/%@", [fullPath stringByDeletingLastPathComponent], expFileName];
//              NSDictionary* expInfo;
//              if ([fileMgr fileExistsAtPath:expPath]) {
//                expInfo = [FileTools readLocalFileWithPath:expPath];
//                NSString* templateName = [expInfo objectForKey:@"Template"];
//
//                if (templateName && [templateFileName isEqualToString:[templateName lastPathComponent]]) {
//                  isTemplate = YES;
//                  break;
//                }
//              }
//            }
            
            NSString* _fileName = [fileName stringByDeletingPathExtension];
            NSString* expFileName = [_fileName stringByAppendingPathExtension:@"exp"];
            NSString* expPath = [NSString stringWithFormat:@"%@/%@", [fullPath stringByDeletingLastPathComponent], expFileName];
            NSDictionary* expInfo;
            
            
            if ([fileMgr fileExistsAtPath:expPath]) {
              expInfo = [FileTools readLocalFileWithPath:expPath];
              NSString* templateRelativePath = [expInfo objectForKey:@"Template"];
              NSString* templateFullPath = [NSString stringWithFormat:@"%@%@%@", [NSHomeDirectory() stringByAppendingString:@"/Documents/"], @"iTablet/User/", templateRelativePath];
              
              if (templateRelativePath && [fileMgr fileExistsAtPath:templateFullPath]) {
                isTemplate = YES;
              }
            }
            
            [array addObject:@{
                               @"name":fileName,
                               @"path":tt,
                               @"mtime":strModeDate,
                               @"isTemplate":@(isTemplate),
                               }];
          }
        }
      }
    }
    
    resolve(array);
  } @catch (NSException *exception) {
    reject(@"getMaps", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(getDirectoryContent, path:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  
  NSMutableArray* array = [NSMutableArray arrayWithCapacity:10];
  NSFileManager* fileMgr = [NSFileManager defaultManager];
  NSArray* tempArray = [fileMgr contentsOfDirectoryAtPath:path error:nil];
  
  for (NSString* fileName in tempArray) {
    
    BOOL flag = YES;
    NSString* fullPath = [path stringByAppendingPathComponent:fileName];
    if ([fileMgr fileExistsAtPath:fullPath isDirectory:&flag]) {
      
      if (!flag) {
        [array addObject:@{@"name":fileName,@"type":@"file"}];
        
      }else{
        [array addObject:@{@"name":fileName,@"type":@"directory"}];
      }
    }
  }
  resolve(array);
}

RCT_REMAP_METHOD(isDirectory,isDirectoryPath:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  BOOL isDir = FALSE;
  BOOL isDirExist = [[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&isDir];
  
  resolve(@(isDirExist&&isDir));
  
}

RCT_REMAP_METHOD(getPathList,getPathListPath:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    NSMutableArray* array = [NSMutableArray arrayWithCapacity:10];
    
    NSFileManager* fileMgr = [NSFileManager defaultManager];
    NSArray* tempArray = [fileMgr contentsOfDirectoryAtPath:path error:nil];
    
    for (NSString* fileName in tempArray) {
      
      BOOL flag = YES;
      
      NSString* fullPath = [path stringByAppendingPathComponent:fileName];
      
      if ([fileMgr fileExistsAtPath:fullPath isDirectory:&flag]) {
        
        NSString* tt = [fullPath stringByReplacingOccurrencesOfString:[NSHomeDirectory() stringByAppendingString:@"/Documents"] withString:@""];
        [array addObject:@{@"name":fileName,@"path":tt,@"isDirectory":@(flag)}];
        //  [array addObject:@{@"name":fileName,@"type":@"directory"}];
      }
      
    }
    
    resolve(array);
  } @catch (NSException *exception) {
    reject(@"getPathList", exception.reason, nil);
  }
  
  
}

RCT_REMAP_METHOD(fileIsExist,fileIsExistPath:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  BOOL b =[[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:nil];
  
  resolve(@(b));
  
}

RCT_REMAP_METHOD(fileIsExistInHomeDirectory,fileIsExistInHomeDirectoryPath:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  NSString* home = NSHomeDirectory();
  BOOL b =[[NSFileManager defaultManager] fileExistsAtPath:[home stringByAppendingFormat:@"/Documents/%@",path] isDirectory:nil];
  //BOOL b = [[NSFileManager defaultManager] createDirectoryAtPath:[home stringByAppendingFormat:@"/Documents/%@",path] withIntermediateDirectories:NO attributes:nil error:nil];
  resolve(@(b));
}

RCT_REMAP_METHOD(writeToFile, writeTo:(NSString *)filePath with:(NSString *) str resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    BOOL fexist = [fileManager fileExistsAtPath:filePath];
    if (!fexist) {
      [fileManager createFileAtPath:filePath contents:nil attributes:nil];
    }
  
    BOOL result = [str writeToFile:filePath atomically:YES encoding:NSUTF8StringEncoding error:nil];
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"writeFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(readFile, readFile:(NSString *)filePath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    BOOL fexist = [fileManager fileExistsAtPath:filePath];
    NSString *readStr;
    if (fexist) {
     readStr = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
    }
    
    resolve(readStr);
  } @catch (NSException *exception) {
    reject(@"writeFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(zipFile, zipFileByPath:(NSString *)archivePath targetPath:(NSString *)targetPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [FileTools zipFile:archivePath targetPath:targetPath];
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"zipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(zipFiles, zipFilesByPaths:(NSArray *)archivePaths targetPath:(NSString *)targetPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [FileTools zipFiles:archivePaths targetPath:targetPath];
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"zipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(unZipFile, unZipFileByPath:(NSString *)archivePath targetPath:(NSString *)targetPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [FileTools unZipFile:archivePath targetPath:targetPath];
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"unZipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(deleteFile, deleteFileByPath:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = NO;
    if (path != nil && ![path isEqualToString:@""]) {
      result = [FileTools deleteFile:path];
    }
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"unZipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(copyFile, copyFileByPath:(NSString *)fromPath targetPath:(NSString *)toPath override:(BOOL)override resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [[NSFileManager defaultManager] fileExistsAtPath:toPath];
    if (override || !result) {
      result = [FileTools copyFile:fromPath targetPath:toPath];
    }
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"unZipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(initUserDefaultData, initUserDefaultDataByUserName:(NSString *)userName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [FileTools initUserDefaultData:userName];
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"unZipFile", exception.reason, nil);
  }
}

RCT_EXPORT_METHOD(getThumbnail:(NSString *)filepath resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    UIImage *shotImage;
    //视频路径URL
    NSURL *fileURL;
    if ([filepath hasPrefix:@"assets-library"]) {
      fileURL = [NSURL URLWithString:filepath];
    } else {
      fileURL = [NSURL fileURLWithPath:filepath];
    }
    
    AVURLAsset *asset = [[AVURLAsset alloc] initWithURL:fileURL options:nil];
    
    AVAssetImageGenerator *gen = [[AVAssetImageGenerator alloc] initWithAsset:asset];
    
    gen.appliesPreferredTrackTransform = YES;
    
    CMTime time = CMTimeMakeWithSeconds(0.0, 600);
    
    NSError *error = nil;
    
    CMTime actualTime;
    
    CGImageRef image = [gen copyCGImageAtTime:time actualTime:&actualTime error:&error];
    
    shotImage = [[UIImage alloc] initWithCGImage:image];
    // save to temp directory
    NSString* tempDirectory = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory,
                                                                   NSUserDomainMask,
                                                                   YES) lastObject];
    
    NSData *data = UIImageJPEGRepresentation(shotImage, 1.0);
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSString *fullPath = [tempDirectory stringByAppendingPathComponent: [NSString stringWithFormat:@"thumb-%@.jpg", [[NSProcessInfo processInfo] globallyUniqueString]]];
    [fileManager createFileAtPath:fullPath contents:data attributes:nil];
    CGImageRelease(image);
    if (resolve)
      resolve(@{ @"path" : fullPath,
                 @"width" : [NSNumber numberWithFloat: shotImage.size.width],
                 @"height" : [NSNumber numberWithFloat: shotImage.size.height] });
  } @catch(NSException *e) {
    reject(e.reason, nil, nil);
  }
}

/****************************************************************************************************************/

+(BOOL)zipFile:(NSString *)archivePath targetPath:(NSString *)targetPath {
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
  return result;
}

+(BOOL)zipFiles:(NSArray *)archivePaths targetPath:(NSString *)targetPath {
  BOOL result = [SSZipArchive createZipFileAtPath:targetPath withFilesAtPaths:archivePaths];
  return result;
}

+(BOOL)unZipFile:(NSString *)archivePath targetPath:(NSString *)targetPath {
  BOOL result = NO;
  NSFileManager *fileManager = [NSFileManager defaultManager];
  BOOL isDir = NO;
  BOOL exist = [fileManager fileExistsAtPath:archivePath isDirectory:&isDir];
  
  if (exist){
    result = [SSZipArchive unzipFileAtPath:archivePath toDestination:targetPath];
  }
  return result;
}

+(BOOL)deleteFile:(NSString *)path {
  BOOL result = NO;
  if([[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:nil]){
    result = [[NSFileManager defaultManager] removeItemAtPath:path error:nil];
  }
  return result;
}

+(BOOL)createFileDirectories:(NSString*)path
{
  
  // 判断存放音频、视频的文件夹是否存在，不存在则创建对应文件夹
  NSString* DOCUMENTS_FOLDER_AUDIO = path;
  NSFileManager *fileManager = [NSFileManager defaultManager];
  
  BOOL isDir = FALSE;
  BOOL isDirExist = [fileManager fileExistsAtPath:DOCUMENTS_FOLDER_AUDIO isDirectory:&isDir];
  if(!(isDirExist && isDir)){
    BOOL bCreateDir = [fileManager createDirectoryAtPath:DOCUMENTS_FOLDER_AUDIO withIntermediateDirectories:YES attributes:nil error:nil];
    
    if(!bCreateDir){
      
      NSLog(@"Create Directory Failed.");
      return NO;
    }else
    {
      //  NSLog(@"%@",DOCUMENTS_FOLDER_AUDIO);
      return YES;
    }
  }
  
  return YES;
}

+(BOOL)copyFile:(NSString *)fromPath targetPath:(NSString *)toPath {
  BOOL result = NO;
  if ([[NSFileManager defaultManager] fileExistsAtPath:fromPath]) {
    result = [[NSFileManager defaultManager] copyItemAtPath:fromPath toPath:toPath error:nil];
  }
  return result;
}

+(BOOL)initUserDefaultData:(NSString *)userName {
  userName = userName == nil || [userName isEqualToString:@""] ? @"Customer" : userName;
  // 初始化用户工作空间
  NSString* srclic = [[NSBundle mainBundle] pathForResource:@"Workspace" ofType:@"zip"];
  NSString* defaultDataPath = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/DefaultData/" ];
  NSString* wsName = @"Workspace.sxwu";
  
  [FileTools createFileDirectories:defaultDataPath];
//  if (srclic) {
//    NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", wsPath, @"Workspace", @".smwu"];
//    if(![[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
//      if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
//        NSLog(@"拷贝数据失败");
//    }
//  }
  
  //if (![[NSFileManager defaultManager] fileExistsAtPath:[NSString stringWithFormat:@"%@%@%@", defaultDataPath, @"Workspace/", wsName] isDirectory:nil])
  {
    if(![FileTools unZipFile:srclic targetPath:defaultDataPath])
      NSLog(@"拷贝数据失败");
  }
  //创建Import文件夹
  NSString *importFilePath = [NSHomeDirectory() stringByAppendingString:@"/Documents/iTablet/Import"];
//  [FileTools deleteFile:importFilePath];
  [FileTools createFileDirectories:importFilePath];
  //创建用户目录
  NSString* commonPath = @"/Documents/iTablet/Common/";
  NSString* CachePath = @"/Documents/iTablet/Cache/";
  
  NSString* dataPath = [NSString stringWithFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/Data/"];
  NSString* externalDataPath = [NSString stringWithFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/ExternalData/"];
  NSString* plottingExtDataPath = [NSString stringWithFormat:@"%@%@", externalDataPath, @"/Plotting/"];
  NSString* collectionExtDataPath = [NSString stringWithFormat:@"%@%@", externalDataPath, @"/Collection/"];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", dataPath]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", commonPath]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", CachePath]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Attribute"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Datasource"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Scene"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Symbol"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Template"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Workspace"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Temp"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Color"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Map"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Media"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Plotting"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Animation"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", externalDataPath]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", plottingExtDataPath]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", collectionExtDataPath]];
//  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", commonPath, @"Images"]];
  
  // 初始化模板数据
  NSString* originPath = [[NSBundle mainBundle] pathForResource:@"Template" ofType:@"zip"];
  NSString* commonZipPath = [NSHomeDirectory() stringByAppendingFormat:@"%@%@", commonPath, @"Template.zip"];
  NSString* templatePath = [NSHomeDirectory() stringByAppendingFormat:@"%@", collectionExtDataPath];
  NSString* templateFilePath = [NSString stringWithFormat:@"%@/%@", collectionExtDataPath, @"地理国情普查"];
  NSString* plotPath = [NSHomeDirectory() stringByAppendingFormat:@"%@", plottingExtDataPath];
  NSString* plotFilePath = [NSString stringWithFormat:@"%@/%@", plottingExtDataPath, @"PlotLibData"];
  NSString* commonPlotZipPath = [NSHomeDirectory() stringByAppendingFormat:@"%@%@", commonPath, @"PlotLibData.zip"];
  NSString* originPlotPath = [[NSBundle mainBundle] pathForResource:@"PlotLibData" ofType:@"zip"];
  
  // 拷贝默认图片并解压
  NSString* imageZipPath = [[NSBundle mainBundle] pathForResource:@"Images" ofType:@"zip"];
  NSString* imagePath = [NSHomeDirectory() stringByAppendingFormat:@"%@%@", commonPath, @"Images"];
  [FileTools unZipFile:imageZipPath targetPath:imagePath];
  
  BOOL isUnZip = NO,isUnZipPlot = NO;
  if (![[NSFileManager defaultManager] fileExistsAtPath:externalDataPath isDirectory:nil] || ![[NSFileManager defaultManager] fileExistsAtPath:templateFilePath isDirectory:nil]) {
    if ([[NSFileManager defaultManager] fileExistsAtPath:commonZipPath isDirectory:nil]) {
      isUnZip = [FileTools unZipFile:commonZipPath targetPath:templatePath];
      NSLog(isUnZip ? @"解压数据成功" : @"解压数据失败");
    } else {
      if ([FileTools copyFile:originPath targetPath:commonZipPath]) {
        isUnZip = [FileTools unZipFile:commonZipPath targetPath:templatePath];
        NSLog(isUnZip ? @"解压数据成功" : @"解压数据失败");
      }
    }
  } else {
    isUnZip = YES;
  }
  externalDataPath=[NSHomeDirectory() stringByAppendingFormat:@"%@", externalDataPath];
  plotFilePath=[NSHomeDirectory() stringByAppendingFormat:@"%@", plotFilePath];
  //修改为每次都解压标绘库,ios解压不会覆盖，所以要先删除之前的文件
  if ([[NSFileManager defaultManager] fileExistsAtPath:commonPlotZipPath isDirectory:nil]) {
    [[NSFileManager defaultManager] removeItemAtPath:commonPlotZipPath error:nil];
  }
  if ([[NSFileManager defaultManager] fileExistsAtPath:plotPath isDirectory:nil]) {
    [[NSFileManager defaultManager] removeItemAtPath:plotPath error:nil];
  }
  
  
//  if (![[NSFileManager defaultManager] fileExistsAtPath:externalDataPath isDirectory:nil] || ![[NSFileManager defaultManager] fileExistsAtPath:plotFilePath isDirectory:nil]) {
//    if ([[NSFileManager defaultManager] fileExistsAtPath:commonPlotZipPath isDirectory:nil]) {
//      isUnZipPlot = [FileTools unZipFile:commonPlotZipPath targetPath:plotPath];
//      NSLog(isUnZip ? @"解压数据成功" : @"解压数据失败");
//    } else {
      if ([FileTools copyFile:originPlotPath targetPath:commonPlotZipPath]) {
        isUnZipPlot = [FileTools unZipFile:commonPlotZipPath targetPath:plotPath];
        NSLog(isUnZip ? @"解压数据成功" : @"解压数据失败");
      }
//    }
    if(isUnZipPlot){
      NSString* fromPath=plotFilePath;
      NSString* toPath=[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Plotting"];
      NSString* targetPlotLibPath=[toPath stringByAppendingString:@"/PlotLibData"];
      if ([[NSFileManager defaultManager] fileExistsAtPath:targetPlotLibPath isDirectory:nil]) {
        [[NSFileManager defaultManager] removeItemAtPath:targetPlotLibPath error:nil];
      }
      [FileUtils copyFiles:fromPath targetDictionary:toPath filterFileSuffix:@"plot" filterFileDicName:@"Symbol" otherFileDicName:@"SymbolIcon" isOnly:YES];

    }
//  } else {
//    isUnZip = YES;
//  }

  NSString* commonCache = [NSHomeDirectory() stringByAppendingFormat:@"%@/%@",CachePath,@"publicMap.txt"];
  if (![[NSFileManager defaultManager] fileExistsAtPath:commonCache isDirectory:nil]) {
    srclic = [[NSBundle mainBundle] pathForResource:@"publicMap" ofType:@"txt"];
    if (srclic) {
      
      if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:commonCache error:nil])
        NSLog(@"拷贝数据失败");
    }
  }
  
  [Environment setLicensePath:[NSHomeDirectory() stringByAppendingFormat:@"/Documents/iTablet/%@/",@"license"]];
  
  NSString *labelUDB = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@%@", dataPath, @"Datasource/Label_",userName,@"#.udb"];
  
  if(![[NSFileManager defaultManager]fileExistsAtPath:labelUDB]){
    Workspace *workspace = [[Workspace alloc] init];
    DatasourceConnectionInfo *info = [[DatasourceConnectionInfo alloc]init];
    info.alias = @"Label";
    info.engineType = ET_UDB;
    info.server = labelUDB;
    Datasources *datasources = workspace.datasources;
    Datasource *datasource = [datasources create:info];
    if (datasource != nil) {
      NSLog(@"数据源创建成功");
    }else{
      NSLog(@"数据源创建失败");
    }
    [workspace dispose];
  }

//   NSString* sceneData = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/Data/Scene/OlympicGreen_ios.zip"];
//   NSString* sceneDir = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/Data/Scene/"];
//   NSString* srcSceneData = [[NSBundle mainBundle] pathForResource:@"OlympicGreen_ios" ofType:@"zip"];
//  if (![[NSFileManager defaultManager] fileExistsAtPath:[NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/Data/Scene/OlympicGreen_ios"] isDirectory:nil]) {
//      if ([FileTools copyFile:srcSceneData targetPath:sceneData]) {
//        isUnZip = [FileTools unZipFile:sceneData targetPath:sceneDir];
//        [FileTools deleteFile:sceneData];
//        NSLog(isUnZip ? @"解压数据成功" : @"解压数据失败");
//      }
//  } else {
//    isUnZip = YES;
//  }
//
//  return isUnZip;
  
  return YES;
}

+(NSString*)getLastModifiedTime:(NSDate*) nsDate{
  NSDateFormatter *fmt = [[NSDateFormatter alloc] init];
  [fmt setDateFormat:@"yyyy/MM/dd hh:mm:ss"];
  NSString *string=[fmt stringFromDate:nsDate];
  return string;
}

RCT_REMAP_METHOD(createDirectory,createDirectoryPath:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  BOOL b = [FileTools createFileDirectories:path];
  
  resolve(@(b));
  
}

+ (NSDictionary *)readLocalFileWithPath:(NSString *)path {
  // 将文件数据化
  NSData *data = [[NSData alloc] initWithContentsOfFile:path];
  // 对数据进行JSON格式化并返回字典形式
  return [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
}

RCT_REMAP_METHOD(getImportState, getImportState:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject){
  @try {
     NSFileManager *filemanager = [NSFileManager defaultManager];
     NSString* home = [NSHomeDirectory() stringByAppendingString:@"/Documents"];
     NSString *destinationPath = [home stringByAppendingString: @"/iTablet/Import/import.zip"];
     BOOL isFileExist =[filemanager fileExistsAtPath:destinationPath isDirectory:nil];
     
    resolve(@(isFileExist));
  } @catch (NSException *exception) {
    reject(@"",@"improtError",(NSError *)exception);
  }
}

/*
 * 判断压缩包是否存在，给RN发送消息，用户选择是否导入
 */
+(BOOL)getUriState:(NSURL *)url{
  
   NSString* head=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
  
  NSString* zipFilePath=[url absoluteString];
 
  zipFilePath = [@"/" stringByAppendingString:[[zipFilePath componentsSeparatedByString:@"Documents"] objectAtIndex:1]];
  zipFilePath=[[head stringByAppendingString:zipFilePath] stringByRemovingPercentEncoding];
  
  NSFileManager *filemanager = [NSFileManager defaultManager];
  
  NSString *destinationFolder = [head stringByAppendingString: @"/iTablet/Import"];
  NSString *destinationPath = [head stringByAppendingString: @"/iTablet/Import/import.zip"];
  BOOL isFileExist =[filemanager fileExistsAtPath:zipFilePath isDirectory:nil];
  
  if(isFileExist){
    BOOL isFolderExist =[filemanager fileExistsAtPath:destinationFolder isDirectory:nil];
    if(!isFolderExist) {
      [filemanager createDirectoryAtPath:destinationFolder withIntermediateDirectories:YES attributes:nil error:nil];
    }
    BOOL isCopySucces = [FileTools copyFile:zipFilePath targetPath:destinationPath];
    if(isCopySucces){
      [FileTools deleteFile:zipFilePath];
      [filetools sendEventWithName:MESSAGE_IMPORTEXTERNALDATA
                              body:[NSNumber numberWithBool:YES]];
    }
  }
  
  return isFileExist;
}
/*
 * 微信分享完成或取消回调触发，给RN发信息通知分享成功 6.7.2版本微信更新后无法获取是否分享成功，success和cancel统一走success回调
 */
+(void)sendShareResult{
  [filetools sendEventWithName:MESSAGE_SHARERESULT body:nil];
}
@end
