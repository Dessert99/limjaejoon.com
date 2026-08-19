'use client';

import { CalendarIcon } from 'lucide-react';
import { composeSlug } from '../../lib/postSlug';
import { Button } from '@/views/blog/components/ui/button';
import { Calendar } from '@/views/blog/components/ui/calendar';
import { Input } from '@/views/blog/components/ui/input';
import { Label } from '@/views/blog/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/views/blog/components/ui/popover';

const toDate = (value: string): Date | undefined => {
  const [year, month, day] = value.split('-').map(Number);

  return year && month && day ? new Date(year, month - 1, day) : undefined;
};

const toValue = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

type SlugFieldProps = {
  date: string;
  topic: string;
  onDateChange: (date: string) => void;
  onTopicChange: (topic: string) => void;
};

export function SlugField({
  date,
  topic,
  onDateChange,
  onTopicChange,
}: SlugFieldProps) {
  const slug = composeSlug(date, topic);

  return (
    <div className='flex flex-col gap-2'>
      <Label htmlFor='post-topic'>주소</Label>

      <div className='flex flex-wrap gap-2'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='justify-start font-normal'>
              <CalendarIcon />
              {date || '날짜 고르기'}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align='start'
            className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={toDate(date)}
              onSelect={(picked) => {
                if (picked) {
                  onDateChange(toValue(picked));
                }
              }}
            />
          </PopoverContent>
        </Popover>

        <Input
          id='post-topic'
          value={topic}
          placeholder='주제 (예: react)'
          className='w-auto min-w-48 flex-1'
          onChange={(event) => {
            onTopicChange(event.target.value);
          }}
        />
      </div>

      <p className='text-sm text-blog-muted-foreground'>
        /blog/<span className='text-blog-foreground'>{slug || '…'}</span>
      </p>
    </div>
  );
}
