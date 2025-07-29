#!/bin/bash

# MKV转MP4批量转码脚本
# 使用与前端相同的转码参数，将MKV文件转换为浏览器兼容的MP4格式

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查FFmpeg是否安装
check_ffmpeg() {
    if ! command -v ffmpeg &> /dev/null; then
        log_error "FFmpeg未安装，请先安装FFmpeg"
        log_info "Ubuntu/Debian: sudo apt install ffmpeg"
        log_info "macOS: brew install ffmpeg"
        log_info "Windows: 下载FFmpeg并添加到PATH"
        exit 1
    fi
}

# 显示帮助信息
show_help() {
    echo "MKV转MP4批量转码脚本"
    echo ""
    echo "用法: $0 [选项] [目录]"
    echo ""
    echo "选项:"
    echo "  -h, --help          显示帮助信息"
    echo "  -o, --output DIR    指定输出目录 (默认: ./converted)"
    echo "  -k, --keep          保留原始文件"
    echo "  -q, --quality NUM   视频质量 (18-28, 默认: 23)"
    echo "  -t, --threads NUM   线程数 (默认: 自动)"
    echo "  --dry-run          只显示将要处理的文件，不实际转码"
    echo ""
    echo "参数:"
    echo "  目录                要处理的目录 (默认: 当前目录)"
    echo ""
    echo "示例:"
    echo "  $0                              # 转换当前目录所有MKV文件"
    echo "  $0 /path/to/videos              # 转换指定目录的MKV文件"
    echo "  $0 -o ./mp4_files -k            # 转换到指定目录并保留原文件"
    echo "  $0 -q 20 -t 4                   # 使用更高质量和4线程"
}

# 默认参数
SOURCE_DIR="."
OUTPUT_DIR="./converted"
KEEP_ORIGINAL=false
QUALITY=23
THREADS=""
DRY_RUN=false

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -k|--keep)
            KEEP_ORIGINAL=true
            shift
            ;;
        -q|--quality)
            QUALITY="$2"
            shift 2
            ;;
        -t|--threads)
            THREADS="-threads $2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -*)
            log_error "未知选项: $1"
            show_help
            exit 1
            ;;
        *)
            SOURCE_DIR="$1"
            shift
            ;;
    esac
done

# 检查FFmpeg
check_ffmpeg

# 验证源目录
if [[ ! -d "$SOURCE_DIR" ]]; then
    log_error "源目录不存在: $SOURCE_DIR"
    exit 1
fi

# 查找MKV文件
log_info "在目录 '$SOURCE_DIR' 中查找MKV文件..."
mapfile -t mkv_files < <(find "$SOURCE_DIR" -type f -iname "*.mkv" | sort)

if [[ ${#mkv_files[@]} -eq 0 ]]; then
    log_warning "未找到MKV文件"
    exit 0
fi

log_info "找到 ${#mkv_files[@]} 个MKV文件"

# 显示将要处理的文件
echo ""
log_info "将要处理的文件:"
for file in "${mkv_files[@]}"; do
    echo "  - $(basename "$file")"
done
echo ""

# Dry run模式
if [[ "$DRY_RUN" == true ]]; then
    log_info "Dry run模式，不执行实际转码"
    exit 0
fi

# 创建输出目录
if [[ ! -d "$OUTPUT_DIR" ]]; then
    log_info "创建输出目录: $OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR"
fi

# 转码统计
total_files=${#mkv_files[@]}
success_count=0
error_count=0
start_time=$(date +%s)

log_info "开始批量转码..."
echo ""

# 处理每个MKV文件
for i in "${!mkv_files[@]}"; do
    file="${mkv_files[$i]}"
    filename=$(basename "$file")
    name="${filename%.*}"
    output_file="$OUTPUT_DIR/${name}.mp4"
    
    current=$((i + 1))
    log_info "[$current/$total_files] 正在处理: $filename"
    
    # 检查输出文件是否已存在
    if [[ -f "$output_file" ]]; then
        log_warning "输出文件已存在，跳过: $output_file"
        ((success_count++))
        continue
    fi
    
    # FFmpeg转码命令 (与前端相同的参数)
    ffmpeg_cmd="ffmpeg -i \"$file\" \
        -c:v copy \
        -c:a aac \
        -movflags faststart \
        $THREADS \
        -y \
        \"$output_file\""
    
    # 执行转码
    if eval $ffmpeg_cmd > /dev/null 2>&1; then
        # 检查输出文件是否成功创建
        if [[ -f "$output_file" ]]; then
            original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            converted_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
            
            # 格式化文件大小
            original_size_mb=$((original_size / 1024 / 1024))
            converted_size_mb=$((converted_size / 1024 / 1024))
            
            log_success "转码完成: $filename (${original_size_mb}MB → ${converted_size_mb}MB)"
            
            # 删除原文件（如果不保留）
            if [[ "$KEEP_ORIGINAL" == false ]]; then
                rm "$file"
                log_info "已删除原文件: $filename"
            fi
            
            ((success_count++))
        else
            log_error "转码失败: $filename (输出文件未创建)"
            ((error_count++))
        fi
    else
        log_error "转码失败: $filename"
        ((error_count++))
    fi
    
    echo ""
done

# 计算总耗时
end_time=$(date +%s)
duration=$((end_time - start_time))
hours=$((duration / 3600))
minutes=$(((duration % 3600) / 60))
seconds=$((duration % 60))

# 显示最终统计
echo "=================================="
log_info "批量转码完成"
echo ""
log_info "处理统计:"
log_success "成功: $success_count 个文件"
if [[ $error_count -gt 0 ]]; then
    log_error "失败: $error_count 个文件"
fi
log_info "总耗时: ${hours}小时${minutes}分钟${seconds}秒"
log_info "输出目录: $OUTPUT_DIR"

if [[ "$KEEP_ORIGINAL" == false ]]; then
    log_info "原始文件已删除"
else
    log_info "原始文件已保留"
fi

echo "=================================="