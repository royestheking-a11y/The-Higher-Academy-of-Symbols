import React from 'react';

const BRAND = {
  deep: '#062B24',
  mid: '#0B3A31',
  gold: '#C9A24A',
  goldLight: '#F0D98A',
  ivory: '#F8F4EA',
  sand: '#E8DDC7',
};

type Theme = 'light' | 'dark';

interface BaseProps {
  className?: string;
  theme?: Theme;
  style?: React.CSSProperties;
}

export function SkeletonBase({ className = '', theme = 'light', style }: BaseProps) {
  return (
    <div
      className={`skeleton-base skeleton-${theme} ${className}`}
      style={style}
    />
  );
}

export function SkeletonText({ lines = 1, theme = 'light', className = '', style }: BaseProps & { lines?: number }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          theme={theme}
          className={`h-4 w-full ${i === lines - 1 && lines > 1 ? 'w-2/3' : ''}`}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 48, theme = 'light', className = '', style }: BaseProps & { size?: number | string }) {
  return (
    <SkeletonBase
      theme={theme}
      className={`rounded-full shrink-0 ${className}`}
      style={{ width: size, height: size, ...style }}
    />
  );
}

export function SkeletonCard({ theme = 'light', className = '' }: BaseProps) {
  const isDark = theme === 'dark';
  
  return (
    <div className={`flex flex-col ${isDark ? 'skeleton-card-dark' : 'skeleton-card-light'} ${className}`}>
      {/* Header/Cover Image Area */}
      <div className="relative h-44 p-4">
        <SkeletonBase theme={isDark ? 'dark' : 'light'} className="absolute inset-0 rounded-none opacity-50" />
      </div>
      
      {/* Body Area */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Title */}
        <SkeletonText theme={isDark ? 'dark' : 'light'} lines={1} className="h-6 w-3/4 mb-1" />
        
        {/* Description */}
        <SkeletonText theme={isDark ? 'dark' : 'light'} lines={2} className="h-3" />
        
        {/* Meta info row */}
        <div className="flex gap-2 mt-2 pt-4 border-t border-opacity-10" style={{ borderColor: BRAND.gold }}>
          <SkeletonBase theme={isDark ? 'dark' : 'light'} className="h-4 w-1/4" />
          <SkeletonBase theme={isDark ? 'dark' : 'light'} className="h-4 w-1/4 mx-auto" />
          <SkeletonBase theme={isDark ? 'dark' : 'light'} className="h-4 w-1/4 ms-auto" />
        </div>
        
        {/* Price & Action row */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <SkeletonBase theme={isDark ? 'dark' : 'light'} className="h-6 w-16" />
          <div className="flex gap-2 w-1/2">
            <SkeletonBase theme={isDark ? 'dark' : 'light'} className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="w-full max-w-2xl">
      <SkeletonBase theme="dark" className="h-8 w-48 rounded-full mb-6" />
      <SkeletonText theme="dark" lines={2} className="h-12 w-full mb-6 opacity-80" />
      <SkeletonText theme="dark" lines={3} className="h-4 w-5/6 mb-8 opacity-60" />
      <div className="flex gap-4">
        <SkeletonBase theme="dark" className="h-12 w-40 rounded-full" />
        <SkeletonBase theme="dark" className="h-12 w-40 rounded-full opacity-70" />
      </div>
    </div>
  );
}

export function SkeletonArticle() {
  return (
    <div className="w-full">
      {/* Header Area */}
      <div className="p-8 sm:p-12" style={{ background: BRAND.mid }}>
        <div className="max-w-4xl mx-auto">
          <SkeletonBase theme="dark" className="h-6 w-32 rounded-full mb-6 opacity-30" />
          <SkeletonText theme="dark" lines={2} className="h-10 w-full mb-8 opacity-40" />
          <div className="flex gap-4">
            <SkeletonAvatar theme="dark" size={32} className="opacity-30" />
            <SkeletonBase theme="dark" className="h-4 w-24 rounded-full mt-2 opacity-30" />
            <SkeletonBase theme="dark" className="h-4 w-24 rounded-full mt-2 opacity-30" />
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <SkeletonBase theme="light" className="h-64 sm:h-80 w-full rounded-3xl mb-10 opacity-60" />
            <SkeletonText theme="light" lines={15} className="w-full opacity-50" />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <SkeletonBase theme="light" className="h-40 w-full rounded-2xl opacity-40" />
            <div className="space-y-4">
              <SkeletonBase theme="light" className="h-6 w-32 rounded-full opacity-30" />
              <SkeletonBase theme="light" className="h-24 w-full rounded-xl opacity-30" />
              <SkeletonBase theme="light" className="h-24 w-full rounded-xl opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Skeleton = {
  Base: SkeletonBase,
  Text: SkeletonText,
  Avatar: SkeletonAvatar,
  Card: SkeletonCard,
  Hero: SkeletonHero,
  Article: SkeletonArticle,
};
