import { useContext, useState } from 'react';
import { Typography, Button, Input, Space } from 'antd';
import { GloablStateContext } from '@/context';
import { message } from 'antd';

const { Text } = Typography;
const { TextArea } = Input;

export default function ImportPanel() {
  const { editor } = useContext(GloablStateContext);
  const [jsonString, setJsonString] = useState('');

  const handleLoadFabritorWeb = async () => {
    if (!editor?.canvas) return;
    if (!jsonString.trim()) {
      message.warning('请先输入 JSON');
      return;
    }
    try {
      const json = JSON.parse(jsonString);
      await editor.loadFromJSON(json);
      message.success('加载成功');
    } catch (e) {
      message.error('JSON 格式错误，无法加载');
      console.error('Failed to parse JSON:', e);
    }
  };

  const handleLoadGaoding = () => {
    // TODO: 实现稿定设计加载逻辑
    message.info('稿定设计加载功能待实现');
  };

  const handleClear = () => {
    setJsonString('');
  };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Text style={{ marginBottom: 16, display: 'block' }}>
        输入json，然后点击加载按钮，即可加载
      </Text>
      <TextArea
        value={jsonString}
        onChange={(e) => setJsonString(e.target.value)}
        style={{
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: 4,
          fontSize: 12,
          overflow: 'auto',
          flex: 1,
          minHeight: '600px',
          fontFamily: 'monospace'
        }}
        rows={60}
        placeholder="请输入 JSON 数据..."
      />
      <div style={{ marginTop: 16 }}>
        <Space>
          <Button
            id="import-panel-btn-fabritor"
            type="primary"
            onClick={handleLoadFabritorWeb}
          >
            加载fabritor-web
          </Button>
          <Button
            id="import-panel-btn-gaoding"
            onClick={handleLoadGaoding}
          >
            加载稿定设计
          </Button>
          <Button
            id="import-panel-btn-clear"
            onClick={handleClear}
          >
            清空
          </Button>
        </Space>
      </div>
    </div>
  );
}
