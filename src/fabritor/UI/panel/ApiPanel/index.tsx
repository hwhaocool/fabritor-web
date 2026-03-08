import { useState } from 'react';
import { Typography, Tabs } from 'antd';
import { Trans } from '@/i18n/utils';
import { apiHtml, jsonHtml } from './markdownHtml';

import './index.scss';

const { Title } = Typography;

export default function ApiPanel() {
  const [activeTab, setActiveTab] = useState('api');

  const renderHtmlContent = (html: string) => {
    return (
      <div
        className="markdown-content"
        style={{
          fontSize: 14,
          lineHeight: 1.7
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  const items = [
    {
      label: 'API',
      key: 'api',
      children: renderHtmlContent(apiHtml)
    },
    {
      label: 'JSON',
      key: 'json',
      children: renderHtmlContent(jsonHtml)
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
