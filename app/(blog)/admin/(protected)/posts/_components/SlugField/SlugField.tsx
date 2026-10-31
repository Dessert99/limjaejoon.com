'use client';

import { CalendarIcon } from 'lucide-react';
import { composeSlug } from '@/domains/posts/lib/postSlug';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { parseDateValue, toDateValue } from '@/lib/date';

type SlugFieldProps = {
  date: string;
  topic: string;
  onDateChange: (date: string) => void;
  onTopicChange: (topic: string) => void;
};

/** 날짜와 주제로 글 주소를 만든다. 만들어질 주소를 아래에 미리 보여준다. */
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
              selected={parseDateValue(date)}
              onSelect={(picked) => {
                if (picked) {
                  onDateChange(toDateValue(picked));
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
