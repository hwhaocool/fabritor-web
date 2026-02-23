import { useState, useEffect } from 'react';
import { Spin, Typography, Alert } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Trans } from '@/i18n/utils';

import './index.scss';

const { Title } = Typography;

export default function ApiPanel() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api.md');
        if (!response.ok) {
          throw new Error('Failed to load markdown file');
        }
        const text = await response.text();
        setContent(text);
        setError('');
      } catch (e) {
        setError(e.message || 'Failed to load API documentation');
        console.error('Failed to load markdown:', e);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <Alert
          message={<Trans i18nKey="panel.api.load_error" />}
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 16, height: '100%', overflow: 'auto' }}>
      <Title level={4} style={{ marginBottom: 16 }}>
        <Trans i18nKey="panel.api.title" />
      </Title>
      <div className="markdown-content" style={{
        fontSize: 14,
        lineHeight: 1.7
      }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
