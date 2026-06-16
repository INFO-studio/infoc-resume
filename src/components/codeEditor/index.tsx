import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { Compartment, EditorState } from '@codemirror/state';
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import { type FC, useCallback, useEffect, useRef } from 'react';

export type CodeEditorProps = {
  value: string;
  onChange: (next: string) => void;
  language?: 'typescript' | 'javascript';
  readOnly?: boolean;
  placeholder?: string;
};

const tsExt = (opts?: { jsx?: boolean }) => javascript({ ...opts, typescript: true });

const themeBase = EditorView.theme({
  '&': {
    height: '100%',
    background: 'var(--color-neutral-5, #fff)',
    fontSize: '13px',
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  '.cm-content': {
    padding: '12px 0',
    caretColor: 'var(--color-primary-fg, #302E81)',
    lineHeight: '1.6',
  },
  '.cm-line': { padding: '0 12px' },
  '.cm-scroller': { overflow: 'auto' },
  '.cm-gutters': {
    background: 'var(--color-neutral-4, #E5E7EB)',
    color: 'var(--color-neutral-3, #9CA3AF)',
    border: 'none',
    userSelect: 'none',
  },
  '.cm-activeLineGutter': {
    background: 'var(--color-primary-bg, #DBE9FE)',
    color: 'var(--color-primary-fg, #302E81)',
  },
  '.cm-activeLine': {
    background: 'color-mix(in srgb, var(--color-primary-bg, #DBE9FE) 55%, transparent)',
  },
  '.cm-selectionBackground, ::selection': {
    background: 'color-mix(in srgb, var(--color-primary-bg, #DBE9FE) 100%, transparent) !important',
  },
  '.cm-foldPlaceholder': {
    background: 'var(--color-code-bg, #F3F3F3)',
    border: '1px solid var(--color-neutral-3)',
    borderRadius: '3px',
    padding: '0 4px',
    color: 'var(--color-neutral-2)',
  },
  '.cm-tooltip': {
    background: 'var(--color-neutral-5)',
    border: '1px solid var(--color-neutral-3)',
    borderRadius: '6px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      background: 'var(--color-primary-bg, #DBE9FE)',
      color: 'var(--color-primary-fg, #302E81)',
    },
  },
});

const CodeEditor: FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'typescript',
  readOnly,
  placeholder,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const readOnlyRef = useRef(new Compartment());
  const languageRef = useRef(new Compartment());
  const placeholderRef = useRef(new Compartment());
  const ignoreNextChangeRef = useRef(false);
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;

  const createExtensions = useCallback(
    (currentLang: 'typescript' | 'javascript', currentReadOnly?: boolean, ph?: string) => {
      const langExt =
        currentLang === 'typescript'
          ? tsExt({ jsx: false })
          : javascript({ jsx: false, typescript: false });
      const updateListener = EditorView.updateListener.of((update) => {
        if (ignoreNextChangeRef.current) {
          ignoreNextChangeRef.current = false;
          return;
        }
        if (update.docChanged) {
          onChangeRef.current(update.state.doc.toString());
        }
      });
      return [
        lineNumbers(),
        foldGutter(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        readOnlyRef.current.of(currentReadOnly ? EditorView.editable.of(false) : []),
        languageRef.current.of(langExt),
        placeholderRef.current.of(
          ph ? EditorView.contentAttributes.of({ 'data-placeholder': ph }) : [],
        ),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap,
          indentWithTab,
        ]),
        themeBase,
        updateListener,
      ];
    },
    [],
  );

  // 挂载（初始 doc 用 value；后续变更由下方受控 effect 同步，勿把 value 加入 deps）
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount once; value synced in dedicated effect
  useEffect(() => {
    if (!hostRef.current) return;
    const state = EditorState.create({
      doc: value,
      extensions: createExtensions(language, readOnly, placeholder),
    });
    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // —— 按设计：首次挂载时用 value，之后完全靠 props 的同步 effect 更新
  }, [language, readOnly, placeholder, createExtensions]);

  // 响应 language / readOnly / placeholder 变化（不重建 view）
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const langExt =
      language === 'typescript'
        ? tsExt({ jsx: false })
        : javascript({ jsx: false, typescript: false });
    view.dispatch({
      effects: [
        readOnlyRef.current.reconfigure(readOnly ? EditorView.editable.of(false) : []),
        languageRef.current.reconfigure(langExt),
        placeholderRef.current.reconfigure(
          placeholder ? EditorView.contentAttributes.of({ 'data-placeholder': placeholder }) : [],
        ),
      ],
    });
  }, [language, readOnly, placeholder]);

  // 受控：外部 value 变更同步到编辑器
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      ignoreNextChangeRef.current = true;
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } });
    }
  }, [value]);

  return <div ref={hostRef} className="h-full w-full" />;
};

export default CodeEditor;
