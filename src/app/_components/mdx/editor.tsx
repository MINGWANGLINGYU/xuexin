'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import type { FC } from 'react';

import { debounce, isNil } from 'lodash';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { MdxEditorProps, MdxHydrateProps } from './types';

import { useThemeColor } from '../theme/hooks';
import $styles from './editor.module.css';
import { MdxHydrate } from './hydrate';
import { serializeMdx } from './utils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export const MdxEditor: FC<MdxEditorProps> = (props) => {
    const { content, setContent, disabled } = props;
    const [serialized, setSerialized] = useState<MdxHydrateProps['serialized']>();
    const theme = useThemeColor();
    const containerRef = useRef<HTMLDivElement>(null);
    const [editorHeight, setEditorHeight] = useState<number>();

    // 防抖效果，减少序列化次数
    const debouncedSerialize = useCallback(
        debounce(async (text: string) => {
            const serialized = await serializeMdx(text);
            setSerialized(serialized);
        }, 1000),
        [],
    );

    useEffect(() => {
        if (!isNil(content)) debouncedSerialize(content);
        return () => {
            debouncedSerialize.cancel();
        };
    }, [content]);

    const updateHeight = useCallback(() => {
        if (containerRef.current) {
            const parentHeight = containerRef.current.clientHeight;
            if (parentHeight) {
                // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
                setEditorHeight(parentHeight);
            }
        }
    }, [containerRef.current]);

    useEffect(() => {
        if (!isNil(serialized) && isNil(editorHeight)) updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, [serialized]);

    return (
        serialized && (
            <div ref={containerRef} data-color-mode={theme} className={$styles.container}>
                <div className="wmde-markdown-var"> </div>
                <MDEditor
                    value={content}
                    onChange={setContent}
                    height={editorHeight}
                    minHeight={editorHeight}
                    textareaProps={{ disabled }}
                    visibleDragbar
                    components={{
                        preview: () => <MdxHydrate serialized={serialized} toc={false} />,
                    }}
                />
            </div>
        )
    );
};
