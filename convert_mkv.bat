@echo off
REM MKV转MP4批量转码Windows批处理脚本
REM 使用与前端相同的转码参数，将MKV文件转换为浏览器兼容的MP4格式

setlocal enabledelayedexpansion

REM 默认参数
set "SOURCE_DIR=%~1"
set "OUTPUT_DIR=converted"
set "KEEP_ORIGINAL=false"
set "QUALITY=23"
set "THREADS="

REM 如果没有指定源目录，使用当前目录
if "%SOURCE_DIR%"=="" set "SOURCE_DIR=."

REM 显示帮助信息
if "%~1"=="--help" goto :help
if "%~1"=="-h" goto :help

echo.
echo ================================
echo   MKV转MP4批量转码工具 (Windows)
echo ================================
echo.

REM 检查FFmpeg是否安装
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo [错误] FFmpeg未安装或未添加到PATH
    echo.
    echo 请从 https://ffmpeg.org/download.html 下载FFmpeg
    echo 并将ffmpeg.exe添加到系统PATH环境变量中
    echo.
    pause
    exit /b 1
)

echo [信息] FFmpeg检查通过

REM 验证源目录
if not exist "%SOURCE_DIR%" (
    echo [错误] 源目录不存在: %SOURCE_DIR%
    pause
    exit /b 1
)

REM 创建输出目录
if not exist "%OUTPUT_DIR%" (
    echo [信息] 创建输出目录: %OUTPUT_DIR%
    mkdir "%OUTPUT_DIR%"
)

echo [信息] 在目录 '%SOURCE_DIR%' 中查找MKV文件...

REM 统计MKV文件数量
set "file_count=0"
for /r "%SOURCE_DIR%" %%f in (*.mkv) do (
    set /a file_count+=1
)

if !file_count! equ 0 (
    echo [警告] 未找到MKV文件
    pause
    exit /b 0
)

echo [信息] 找到 !file_count! 个MKV文件
echo.

REM 显示将要处理的文件
echo 将要处理的文件:
for /r "%SOURCE_DIR%" %%f in (*.mkv) do (
    echo   - %%~nxf
)
echo.

set /p "confirm=是否继续处理这些文件? (Y/N): "
if /i not "%confirm%"=="Y" (
    echo 操作已取消
    pause
    exit /b 0
)

echo.
echo [信息] 开始批量转码...
echo.

REM 转码统计
set "success_count=0"
set "error_count=0"
set "current=0"

REM 记录开始时间
for /f "tokens=1-4 delims=:.," %%a in ("%time%") do (
    set /a "start_time=(((%%a*60)+1%%b %% 100)*60+1%%c %% 100)*100+1%%d %% 100"
)

REM 处理每个MKV文件
for /r "%SOURCE_DIR%" %%f in (*.mkv) do (
    set /a current+=1
    set "input_file=%%f"
    set "filename=%%~nxf"
    set "name=%%~nf"
    set "output_file=%OUTPUT_DIR%\!name!.mp4"
    
    echo [!current!/!file_count!] 正在处理: !filename!
    
    REM 检查输出文件是否已存在
    if exist "!output_file!" (
        echo [警告] 输出文件已存在，跳过: !output_file!
        set /a success_count+=1
        echo.
        goto :continue
    )
    
    REM 执行FFmpeg转码 (与前端相同的参数)
    ffmpeg -i "!input_file!" -c:v copy -c:a aac -movflags faststart -y "!output_file!" >nul 2>&1
    
    if errorlevel 1 (
        echo [错误] 转码失败: !filename!
        set /a error_count+=1
    ) else (
        if exist "!output_file!" (
            REM 获取文件大小
            for %%A in ("!input_file!") do set "original_size=%%~zA"
            for %%A in ("!output_file!") do set "converted_size=%%~zA"
            
            REM 转换为MB
            set /a original_mb=!original_size!/1024/1024
            set /a converted_mb=!converted_size!/1024/1024
            
            echo [成功] 转码完成: !filename! (!original_mb!MB → !converted_mb!MB)
            
            REM 如果不保留原文件，则删除
            if "!KEEP_ORIGINAL!"=="false" (
                del "!input_file!"
                echo [信息] 已删除原文件: !filename!
            )
            
            set /a success_count+=1
        ) else (
            echo [错误] 转码失败: !filename! (输出文件未创建)
            set /a error_count+=1
        )
    )
    
    echo.
    :continue
)

REM 计算总耗时
for /f "tokens=1-4 delims=:.," %%a in ("%time%") do (
    set /a "end_time=(((%%a*60)+1%%b %% 100)*60+1%%c %% 100)*100+1%%d %% 100"
)

set /a "duration=(end_time-start_time)/100"
set /a "hours=duration/3600"
set /a "minutes=(duration%%3600)/60"
set /a "seconds=duration%%60"

REM 显示最终统计
echo ==================================================
echo [信息] 批量转码完成
echo.
echo 处理统计:
echo [成功] 成功: !success_count! 个文件
if !error_count! gtr 0 (
    echo [错误] 失败: !error_count! 个文件
)
echo [信息] 总耗时: !hours!小时!minutes!分钟!seconds!秒
echo [信息] 输出目录: %OUTPUT_DIR%

if "!KEEP_ORIGINAL!"=="false" (
    echo [信息] 原始文件已删除
) else (
    echo [信息] 原始文件已保留
)

echo ==================================================
echo.
pause
exit /b 0

:help
echo.
echo MKV转MP4批量转码工具 (Windows版)
echo.
echo 用法: %~nx0 [目录]
echo.
echo 参数:
echo   目录           要处理的目录 (默认: 当前目录)
echo.
echo 选项:
echo   --help, -h     显示帮助信息
echo.
echo 示例:
echo   %~nx0                    # 转换当前目录所有MKV文件
echo   %~nx0 C:\Videos          # 转换指定目录的MKV文件
echo.
echo 说明:
echo   - 转码参数与前端VideoPlayer保持一致
echo   - 视频流复制，音频转换为AAC格式
echo   - 输出文件保存到 'converted' 目录
echo   - 转码成功后会删除原始MKV文件
echo.
pause
exit /b 0