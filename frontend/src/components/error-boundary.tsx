"use client";

import { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center text-white p-4 md:p-8 max-w-2xl w-full">
            <div className="text-red-400 mb-4">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">组件渲染错误</h3>
            
            {/* 移动端简化显示 */}
            <div className="block md:hidden mb-4 p-3 bg-red-900/30 rounded-lg border border-red-500/30 text-left">
              <div className="mb-2">
                <span className="text-xs font-semibold text-red-300">错误：</span>
                <p className="text-xs text-red-100 mt-1 bg-red-900/50 p-2 rounded break-words">
                  {this.state.error?.message || '未知错误'}
                </p>
              </div>
            </div>

            {/* 桌面端详细显示 */}
            <div className="hidden md:block mb-6 p-4 bg-red-900/30 rounded-lg border border-red-500/30 text-left">
              <div className="mb-3">
                <span className="text-sm font-semibold text-red-300">错误信息：</span>
                <p className="text-sm text-red-100 mt-1 font-mono bg-red-900/50 p-2 rounded break-words">
                  {this.state.error?.message || '未知错误'}
                </p>
              </div>
              
              {this.state.error?.stack && (
                <div>
                  <span className="text-sm font-semibold text-red-300">堆栈信息：</span>
                  <p className="text-sm text-red-100 mt-1 font-mono bg-red-900/50 p-2 rounded break-words whitespace-pre-wrap text-xs">
                    {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                  </p>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400 space-y-1">
              <p>• 组件渲染时发生了错误，已知safari播放器无法播放部分视频，请更换例如Edge或者Chrome来观看</p>
              <p className="hidden md:block">• 请刷新页面重试</p>
              <p className="hidden md:block">• 如问题持续，请联系管理员</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}