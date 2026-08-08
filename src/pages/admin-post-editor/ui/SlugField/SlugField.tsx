'use client';

/** 주소 짓기 — 고른 날짜와 친 주제를 합쳐 `2026-08-29-react` 꼴의 slug 를 만든다 */
import { CalendarIcon } from 'lucide-react';
import { composeSlug } from '@/features/manage-post';
import {
  Button,
  Calendar,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui';

// 문자열↔Date 를 손으로 만든다 — new Date('2026-08-29') 는 UTC 로 읽혀 서쪽 시간대에서 하루 앞 날짜로 보인다
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

/** 날짜와 주제를 따로 받고, 합쳐진 결과를 그 자리에서 보여준다 */
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

      {/* 합쳐진 결과를 그대로 보여준다 — 주제를 눕히는 규칙이 있어 친 그대로 주소가 되지 않는다 */}
      <p className='text-body-sm text-muted-foreground'>
        /blog/<span className='text-foreground'>{slug || '…'}</span>
      </p>
    </div>
  );
}
