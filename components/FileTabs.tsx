'use client';

import { File, Star, Trash } from 'lucide-react';
import { Tabs, Tab } from '@heroui/tabs';
import Badge from '@/components/ui/Badge';
import type { File as FileType } from '@/lib/db/schema';

interface FileTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  files: FileType[];
  starredCount: number;
  trashCount: number;
}

export default function FileTabs({
  activeTab,
  onTabChange,
  files,
  starredCount,
  trashCount,
}: FileTabsProps) {
  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={(key) => onTabChange(key as string)}
      variant='underlined'
      color='default'
      classNames={{
        base: 'w-full overflow-x-auto',
        tabList: 'gap-2 sm:gap-4 md:gap-6 flex-nowrap min-w-full',
        tab: 'py-3 whitespace-nowrap',
        cursor: 'bg-primary',
      }}
    >
      <Tab
        key='all'
        title={
          <div className='flex items-center gap-2 sm:gap-3 text-blue'>
            <File className='h-4 w-4 sm:h-5 sm:w-5' />
            <span className='font-medium'>All Files</span>
            <Badge
              className='bg-blue'
              size='sm'
              aria-label={`${files.filter((file) => !file.isTrashed).length} files`}
            >
              {files.filter((file) => !file.isTrashed).length}
            </Badge>
          </div>
        }
      />
      <Tab
        key='starred'
        title={
          <div className='flex items-center gap-2 sm:gap-3 text-yellow-500'>
            <Star className='h-4 w-4 sm:h-5 sm:w-5' />
            <span className='font-medium'>Starred</span>
            <Badge
              className='bg-yellow-500'
              size='sm'
              aria-label={`${starredCount} starred files`}
            >
              {starredCount}
            </Badge>
          </div>
        }
      />
      <Tab
        key='trash'
        className='text-pink'
        title={
          <div className='flex items-center gap-2 sm:gap-3 text-pink'>
            <Trash className='h-4 w-4 sm:h-5 sm:w-5' />
            <span className='font-medium'>Trash</span>
            <Badge
              className='bg-pink'
              size='sm'
              aria-label={`${trashCount} files in trash`}
            >
              {trashCount}
            </Badge>
          </div>
        }
      />
    </Tabs>
  );
}
