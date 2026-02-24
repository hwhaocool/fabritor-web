import { useContext, useState, useEffect } from 'react';
import { Typography, Button, message, Input } from 'antd';
import { CopyOutlined, SaveOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import { GloablStateContext } from '@/context';

const { Text } = Typography;
const { TextArea } = Input;

export default function JsonPanel() {
  const { editor } = useContext(GloablStateContext);
  const [jsonString, setJsonString] = useState('');
  const [editing, setEditing] = useState(false);
  const [originalJson, setOriginalJson] = useState('');

  const handleEdit = () => {
    setOriginalJson(jsonString);
    setEditing(true);
  };

  const handleCancel = () => {
    setJsonString(originalJson);
    setEditing(false);
  };

  const updateJson = (): void => {
    if (!editor?.canvas) return;
    try {
      const json = editor.canvas2Json();
      setJsonString(JSON.stringify(json, null, 2));
    } catch (e) {
      console.error('Failed to generate JSON:', e);
      setJsonString('Failed to generate JSON');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      message.success('JSON 已复制到剪贴板');
    } catch (e) {
      message.error('复制失败');
    }
  };

  const handleApply = async () => {
    if (!editor?.canvas) return;
    try {
      const json = JSON.parse(jsonString);
      await editor.loadFromJSON(json);
      message.success('JSON 已应用');
      setEditing(false);
      setOriginalJson('');
    } catch (e) {
      message.error('JSON 格式错误，无法应用');
      console.error('Failed to parse JSON:', e);
    }
  };

  useEffect(() => {
    updateJson();

    if (!editor?.canvas) return;

    const handleObjectModified = (): void => {
      updateJson();
      setEditing(false);
      setOriginalJson('');
    };

    editor.canvas.on('object:modified', handleObjectModified);
    editor.canvas.on('object:added', handleObjectModified);
    editor.canvas.on('object:removed', handleObjectModified);

    return () => {
      editor.canvas.off('object:modified', handleObjectModified);
      editor.canvas.off('object:added', handleObjectModified);
      editor.canvas.off('object:removed', handleObjectModified);
    };
  }, [editor]);

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button
          id="json-panel-btn-copy"
          icon={<CopyOutlined />}
          onClick={handleCopy}
        >
          复制
        </Button>
        {editing ? (
          <>
            <Button
              id="json-panel-btn-cancel"
              icon={<CloseOutlined />}
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              id="json-panel-btn-apply"
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleApply}
            >
              应用
            </Button>
          </>
        ) : (
          <Button
            id="json-panel-btn-edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            编辑
          </Button>
        )}
      </div>
      <Text style={{ marginBottom: 16, display: 'block', fontWeight: 'bold' }}>
        Canvas JSON Data
      </Text>
      {editing ? (
        <TextArea
          id="json-panel-textarea"
          value={jsonString}
          onChange={(e) => setJsonString(e.target.value)}
          style={{
            backgroundColor: '#fff',
            padding: 12,
            borderRadius: 4,
            fontSize: 12,
            overflow: 'auto',
            flex: 1,
            minHeight: '300px',
            fontFamily: 'monospace'
          }}
        />
      ) : (
        <pre
          id="json-panel-display"
          style={{
            backgroundColor: '#f5f5f5',
            padding: 12,
            borderRadius: 4,
            fontSize: 12,
            overflow: 'auto',
            flex: 1,
            minHeight: '300px',
            margin: 0,
            fontFamily: 'monospace'
          }}
        >
          {jsonString}
        </pre>
      )}
      
    </div>
  );
}
