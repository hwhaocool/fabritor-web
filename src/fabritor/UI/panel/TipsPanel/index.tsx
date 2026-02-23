import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Spin, Typography, Alert } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Trans } from '@/i18n/utils';
import { TipsPanelContext } from '../index';

import './index.scss';

const { Title } = Typography;

export default function TipsPanel() {
  const context = useContext(TipsPanelContext);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [panelWidth, setPanelWidth] = useState(context?.panelWidth || 360);
  const [isResizing, setIsResizing] = useState(false);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const panelWidthRef = useRef(panelWidth);

  // Keep panelWidthRef in sync with panelWidth
  useEffect(() => {
    panelWidthRef.current = panelWidth;
  }, [panelWidth]);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        const response = await fetch('/json.md');
        if (!response.ok) {
          throw new Error('Failed to load markdown file');
        }
        const text = await response.text();
        setContent(text);
        setError('');
      } catch (e) {
        setError(e.message || 'Failed to load tips');
        console.error('Failed to load markdown:', e);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, []);

  // Handle resize drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = panelWidthRef.current;
    e.preventDefault();
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startXRef.current;
      const newWidth = Math.max(280, Math.min(800, startWidthRef.current + deltaX));
      setPanelWidth(newWidth);
      // Sync width to parent Panel component
      if (context?.onWidthChange) {
        context.onWidthChange(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, context]);

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
          message={<Trans i18nKey="panel.tips.load_error" />}
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: panelWidth,
        minWidth: 280,
        maxWidth: 800,
      }}
    >
      <div style={{ padding: 16, height: '100%', overflow: 'auto', flex: 1 }}>
        <Title level={4} style={{ marginBottom: 16 }}>
          <Trans i18nKey="panel.tips.title" />
        </Title>
        <div className="markdown-content" style={{
          fontSize: 13,
          lineHeight: 1.6
        }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
      {/* Resize handle */}
      <div
        ref={resizeHandleRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          right: -3,
          top: 0,
          bottom: 0,
          width: 10,
          cursor: 'col-resize',
          backgroundColor: isResizing ? '#1890ff' : 'transparent',
          borderRight: isResizing ? '2px solid #1890ff' : '2px solid transparent',
          transition: isResizing ? 'none' : 'all 0.2s',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          if (!isResizing) {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isResizing) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      />
    </div>
  );
}
