import { useState, useEffect } from 'react';
import { Spin, Typography, Alert, Tabs } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Trans } from '@/i18n/utils';

import './index.scss';

const { Title } = Typography;

type MarkdownContent = {
  content: string;
  loading: boolean;
  error: string;
};

export default function ApiPanel() {
  const [activeTab, setActiveTab] = useState('api');
  const [apiContent, setApiContent] = useState<MarkdownContent>({
    content: '',
    loading: true,
    error: ''
  });
  const [jsonContent, setJsonContent] = useState<MarkdownContent>({
    content: '',
    loading: true,
    error: ''
  });

  useEffect(() => {
    const loadApiMarkdown = async () => {
      try {
        setApiContent(prev => ({ ...prev, loading: true }));
        const response = await fetch('/api.md');
        if (!response.ok) {
          throw new Error('Failed to load api.md file');
        }
        const text = await response.text();
        setApiContent({ content: text, loading: false, error: '' });
      } catch (e) {
        setApiContent({
          content: '',
          loading: false,
          error: e.message || 'Failed to load API documentation'
        });
        console.error('Failed to load api.md:', e);
      }
    };

    loadApiMarkdown();
  }, []);

  useEffect(() => {
    const loadJsonMarkdown = async () => {
      try {
        setJsonContent(prev => ({ ...prev, loading: true }));
        const response = await fetch('/json.md');
        if (!response.ok) {
          throw new Error('Failed to load json.md file');
        }
        const text = await response.text();
        setJsonContent({ content: text, loading: false, error: '' });
      } catch (e) {
        setJsonContent({
          content: '',
          loading: false,
          error: e.message || 'Failed to load JSON documentation'
        });
        console.error('Failed to load json.md:', e);
      }
    };

    loadJsonMarkdown();
  }, []);

  const renderMarkdown = (data: MarkdownContent) => {
    if (data.loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Spin />
        </div>
      );
    }

    if (data.error) {
      return (
        <Alert
          message="加载失败"
          description={data.error}
          type="error"
          showIcon
        />
      );
    }

    return (
      <div className="markdown-content" style={{
        fontSize: 14,
        lineHeight: 1.7
      }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.content}
        </ReactMarkdown>
      </div>
    );
  };

  const items = [
    {
      label: 'API',
      key: 'api',
      children: renderMarkdown(apiContent)
    },
    {
      label: 'JSON',
      key: 'json',
      children: renderMarkdown(jsonContent)
    }
  ];

  return (
    <div style={{ padding: 16, height: '100%', overflow: 'auto' }}>
      <Title level={4} style={{ marginBottom: 16 }}>
        <Trans i18nKey="panel.api.title" />
      </Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        style={{ height: 'calc(100% - 40px)' }}
      />
    </div>
  );
}
