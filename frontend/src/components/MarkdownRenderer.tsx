import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = memo(({ content, className, style }) => {
  return (
    <div className={className} style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ children, className, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            
            if (match) {
              // 代码块
              return (
                <pre style={{
                  backgroundColor: '#1e1e1e',
                  padding: '16px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  margin: '16px 0',
                }}>
                  <code style={{
                    color: '#d4d4d4',
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: '14px',
                  }}>
                    {children}
                  </code>
                </pre>
              );
            }
            
            // 内联代码
            return (
              <code 
                className={className}
                style={{
                  backgroundColor: '#f1f5f9',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.9em',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
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
                  borderLeft: '4px solid #e2e8f0',
                  paddingLeft: '16px',
                  margin: '16px 0',
                  fontStyle: 'italic',
                  color: '#64748b',
                  backgroundColor: '#f8fafc',
                  padding: '12px 16px',
                  borderRadius: '0 8px 8px 0',
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
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
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
                  backgroundColor: '#f1f5f9',
                  borderBottom: '2px solid #e2e8f0',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#334155',
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
                  borderBottom: '1px solid #e2e8f0',
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
                  color: '#1e293b',
                  borderBottom: '2px solid #e2e8f0',
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
                  color: '#334155',
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
                  color: '#475569',
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
                  color: '#334155',
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
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                target="_blank"
                rel="noopener noreferrer"
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
                  color: '#1e293b',
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
                  color: '#475569',
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
                  borderTop: '2px solid #e2e8f0',
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
                    backgroundColor: '#fefefe',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    overflowX: 'auto',
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