import React, { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
  darkMode?: boolean;
}

// 代码复制组件
const CopyButton: React.FC<{ code: string; darkMode?: boolean }> = ({ code, darkMode = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        border: 'none',
        borderRadius: '6px',
        padding: '6px 10px',
        fontSize: '12px',
        color: darkMode ? '#d4d4d4' : '#374151',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        opacity: 0.7,
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.7';
        e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      }}
    >
      {copied ? '✓ 已复制' : '📋 复制'}
    </button>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = memo(({ content, className, style, darkMode = false }) => {
  return (
    <div className={className} style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const code = String(children).replace(/\n$/, '');
            
            if (!inline && match) {
              // 代码块 - 使用语法高亮
              return (
                <div style={{ position: 'relative', margin: '16px 0' }}>
                  <SyntaxHighlighter
                    style={darkMode ? oneDark : oneLight}
                    language={language}
                    PreTag="div"
                    customStyle={{
                      borderRadius: '12px',
                      padding: '20px',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                      backgroundColor: darkMode ? '#1e1e1e' : '#f8fafc',
                      border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                  <CopyButton code={code} darkMode={darkMode} />
                  {/* 语言标签 */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '20px',
                    backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.9)',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {language || 'text'}
                  </div>
                </div>
              );
            }
            
            // 内联代码
            return (
              <code 
                className={className}
                style={{
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                  color: darkMode ? '#fbbf24' : '#dc2626',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.9em',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontWeight: '500',
                  border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote({ children, ...props }: any) {
            return (
              <blockquote
                style={{
                  borderLeft: `4px solid ${darkMode ? '#3b82f6' : '#3b82f6'}`,
                  paddingLeft: '16px',
                  margin: '16px 0',
                  fontStyle: 'italic',
                  color: darkMode ? '#9ca3af' : '#64748b',
                  backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : '#f0f9ff',
                  padding: '12px 16px',
                  borderRadius: '0 8px 8px 0',
                  border: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid #bfdbfe',
                }}
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          table({ children, ...props }: any) {
            return (
              <div style={{ overflowX: 'auto', margin: '16px 0' }}>
                <table
                  style={{
                    borderCollapse: 'collapse',
                    width: '100%',
                    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                  {...props}
                >
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }: any) {
            return (
              <th
                style={{
                  padding: '12px',
                  backgroundColor: darkMode ? '#374151' : '#f1f5f9',
                  borderBottom: darkMode ? '2px solid #4b5563' : '2px solid #e2e8f0',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: darkMode ? '#f9fafb' : '#334155',
                }}
                {...props}
              >
                {children}
              </th>
            );
          },
          td({ children, ...props }: any) {
            return (
              <td
                style={{
                  padding: '12px',
                  borderBottom: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
                  color: darkMode ? '#d1d5db' : '#374151',
                }}
                {...props}
              >
                {children}
              </td>
            );
          },
          h1({ children, ...props }: any) {
            return (
              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  marginTop: '24px',
                  marginBottom: '16px',
                  color: darkMode ? '#f1f5f9' : '#1e293b',
                  borderBottom: darkMode ? '2px solid #374151' : '2px solid #e2e8f0',
                  paddingBottom: '8px',
                }}
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: any) {
            return (
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginTop: '20px',
                  marginBottom: '12px',
                  color: darkMode ? '#e5e7eb' : '#334155',
                }}
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: any) {
            return (
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginTop: '16px',
                  marginBottom: '8px',
                  color: darkMode ? '#d1d5db' : '#475569',
                }}
                {...props}
              >
                {children}
              </h3>
            );
          },
          p({ children, ...props }: any) {
            return (
              <p
                style={{
                  marginBottom: '12px',
                  lineHeight: '1.6',
                  color: darkMode ? '#d1d5db' : '#334155',
                }}
                {...props}
              >
                {children}
              </p>
            );
          },
          ul({ children, ...props }: any) {
            return (
              <ul
                style={{
                  marginLeft: '20px',
                  marginBottom: '12px',
                  listStyleType: 'disc',
                  color: darkMode ? '#d1d5db' : '#374151',
                }}
                {...props}
              >
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: any) {
            return (
              <ol
                style={{
                  marginLeft: '20px',
                  marginBottom: '12px',
                  listStyleType: 'decimal',
                  color: darkMode ? '#d1d5db' : '#374151',
                }}
                {...props}
              >
                {children}
              </ol>
            );
          },
          li({ children, ...props }: any) {
            return (
              <li
                style={{
                  marginBottom: '4px',
                  lineHeight: '1.5',
                  color: darkMode ? '#d1d5db' : '#374151',
                }}
                {...props}
              >
                {children}
              </li>
            );
          },
          a({ children, ...props }: any) {
            return (
              <a
                style={{
                  color: darkMode ? '#60a5fa' : '#3b82f6',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#93c5fd' : '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#60a5fa' : '#3b82f6';
                }}
                {...props}
              >
                {children}
              </a>
            );
          },
          strong({ children, ...props }: any) {
            return (
              <strong
                style={{
                  fontWeight: '700',
                  color: darkMode ? '#f1f5f9' : '#1e293b',
                }}
                {...props}
              >
                {children}
              </strong>
            );
          },
          em({ children, ...props }: any) {
            return (
              <em
                style={{
                  fontStyle: 'italic',
                  color: darkMode ? '#9ca3af' : '#475569',
                }}
                {...props}
              >
                {children}
              </em>
            );
          },
          hr(props: any) {
            return (
              <hr
                style={{
                  border: 'none',
                  borderTop: darkMode ? '2px solid #374151' : '2px solid #e2e8f0',
                  margin: '24px 0',
                }}
                {...props}
              />
            );
          },
          // 任务列表支持
          input(props: any) {
            if (props.type === 'checkbox') {
              return (
                <input
                  style={{
                    marginRight: '8px',
                    transform: 'scale(1.1)',
                    accentColor: '#3b82f6',
                  }}
                  {...props}
                />
              );
            }
            return <input {...props} />;
          },
          // LaTeX块级公式样式
          div({ children, ...props }: any) {
            if (props.className?.includes('math-display')) {
              return (
                <div
                  style={{
                    margin: '20px 0',
                    textAlign: 'center',
                    padding: '16px',
                    backgroundColor: darkMode ? '#1f2937' : '#fefefe',
                    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                  {...props}
                >
                  {children}
                </div>
              );
            }
            return <div {...props}>{children}</div>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;