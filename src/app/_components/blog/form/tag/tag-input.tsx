'use client';

import type { KeyboardEventHandler } from 'react';

import type { TagItem } from '@/server/tag/type';

import { cn } from '@/app/_components/shadcn/utils';

import { Input } from '../../../shadcn/ui/input';
import { TagLink } from './tag-link';

const emptyTags: TagItem[] = [];

interface TagInputProps {
    tags: TagItem[];
    setTags: (tags: TagItem[]) => void;
    autocompleteOptions?: TagItem[];
    activeTagIndex?: number | null;
    setActiveTagIndex?: (index: number | null) => void;
    className?: string;
    placeholder?: string;
}

export const TagInput = ({
    tags,
    setTags,
    autocompleteOptions = emptyTags,
    activeTagIndex,
    setActiveTagIndex,
    className,
    placeholder,
}: TagInputProps) => {
    const addText = (text: string) => {
        const value = text.trim();
        if (!value || tags.some((tag) => tag.text === value)) return;
        const exists = autocompleteOptions.find((tag) => tag.text === value);
        setTags([...tags, exists ?? { id: value, text: value }]);
    };

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (['Enter', ',', '，'].includes(event.key)) {
            event.preventDefault();
            addText(event.currentTarget.value);
            event.currentTarget.value = '';
            setActiveTagIndex?.(null);
        }
        if (event.key === 'Backspace' && !event.currentTarget.value && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    return (
        <div
            className={cn(
                'flex min-h-9 flex-wrap items-center gap-2 rounded-md border px-2 py-1',
                className,
            )}
        >
            {tags.map((tag, index) => (
                <button
                    key={`${tag.id}-${tag.text}`}
                    type="button"
                    className={cn('rounded-sm', activeTagIndex === index && 'ring-2 ring-ring')}
                    onClick={() => setTags(tags.filter((item) => item.text !== tag.text))}
                    onFocus={() => setActiveTagIndex?.(index)}
                    onBlur={() => setActiveTagIndex?.(null)}
                >
                    <TagLink tag={tag} asSpan />
                </button>
            ))}
            <Input
                list="tag-options"
                placeholder={placeholder}
                className="h-7 min-w-32 flex-1 border-0 px-0 shadow-none focus-visible:ring-0"
                onKeyDown={onKeyDown}
                onBlur={(event) => {
                    addText(event.currentTarget.value);
                    event.currentTarget.value = '';
                }}
            />
            <datalist id="tag-options">
                {autocompleteOptions.map((tag) => (
                    <option key={tag.id} value={tag.text} />
                ))}
            </datalist>
        </div>
    );
};
