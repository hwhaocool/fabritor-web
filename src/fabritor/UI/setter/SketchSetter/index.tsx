import { useContext, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { Form, Radio, Space } from 'antd';
import ColorSetter from '../ColorSetter';
import SizeSetter from '../SizeSetter';
import { GloablStateContext } from '@/context';
import { transformColors2Fill, transformFill2Colors } from '@/utils';
import { useTranslation } from '@/i18n/utils';

const { Item: FormItem } = Form;

interface ColorStop {
  offset: number;
  color: string;
}

interface GradientConfig {
  angle?: number;
  colorStops: ColorStop[];
}

interface GradientPreset {
  type: 'solid' | 'linear' | 'radial';
  gradient?: GradientConfig;
  color?: string;
}

const GRADIENT_PRESETS: Record<string, GradientPreset[]> = {
  linear: [
    {
      type: 'linear',
      gradient: {
        angle: 45,
        colorStops: [
          { offset: 0, color: '#667eea' },
          { offset: 1, color: '#764ba2' }
        ]
      }
    },
    {
      type: 'linear',
      gradient: {
        angle: 135,
        colorStops: [
          { offset: 0, color: '#ff9a9e' },
          { offset: 1, color: '#fecfef' }
        ]
      }
    },
    {
      type: 'linear',
      gradient: {
        angle: 90,
        colorStops: [
          { offset: 0, color: '#a18cd1' },
          { offset: 1, color: '#fbc2eb' }
        ]
      }
    },
    {
      type: 'linear',
      gradient: {
        angle: 180,
        colorStops: [
          { offset: 0, color: '#84fab0' },
          { offset: 1, color: '#8fd3f4' }
        ]
      }
    },
    {
      type: 'linear',
      gradient: {
        angle: 45,
        colorStops: [
          { offset: 0, color: '#fa709a' },
          { offset: 1, color: '#fee140' }
        ]
      }
    },
    {
      type: 'linear',
      gradient: {
        angle: 90,
        colorStops: [
          { offset: 0, color: '#30cfd0' },
          { offset: 1, color: '#330867' }
        ]
      }
    }
  ],
  radial: [
    {
      type: 'radial',
      gradient: {
        colorStops: [
          { offset: 0, color: '#f6d365' },
          { offset: 1, color: '#fda085' }
        ]
      }
    },
    {
      type: 'radial',
      gradient: {
        colorStops: [
          { offset: 0, color: '#a1c4fd' },
          { offset: 1, color: '#c2e9fb' }
        ]
      }
    },
    {
      type: 'radial',
      gradient: {
        colorStops: [
          { offset: 0, color: '#f093fb' },
          { offset: 1, color: '#f5576c' }
        ]
      }
    },
    {
      type: 'radial',
      gradient: {
        colorStops: [
          { offset: 0, color: '#89f7fe' },
          { offset: 1, color: '#66a6ff' }
        ]
      }
    },
    {
      type: 'radial',
      gradient: {
        colorStops: [
          { offset: 0, color: '#cd9cf2' },
          { offset: 1, color: '#f6f3ff' }
        ]
      }
    },
    {
      type: 'radial',
      gradient: {
        colorStops: [
          { offset: 0, color: '#ffecd2' },
          { offset: 1, color: '#fcb69f' }
        ]
      }
    }
  ]
};

export default function SketchSetter() {
  const [form] = Form.useForm();
  const { editor } = useContext(GloablStateContext);
  const { t } = useTranslation();
  const [fillType, setFillType] = useState<'solid' | 'linear' | 'radial'>('solid');

  const handleFill = (_fill: GradientPreset) => {
    const { sketch, canvas } = editor;
    let fill = transformColors2Fill(_fill);
    if (typeof fill !== 'string') {
      fill = new fabric.Gradient(fill);
    }
    sketch.set('fill', fill);
    canvas.requestRenderAll();
  }

  const handleFillTypeChange = (type: 'solid' | 'linear' | 'radial') => {
    setFillType(type);
    const currentFill = form.getFieldValue('fill') as GradientPreset;
    if (type === 'solid') {
      form.setFieldValue('fill', { type: 'solid', color: currentFill?.color || '#ffffff' });
    } else {
      const presets = GRADIENT_PRESETS[type];
      form.setFieldValue('fill', presets[0]);
    }
    handleFill(form.getFieldValue('fill'));
  }

  const handlePresetSelect = (preset: GradientPreset) => {
    form.setFieldValue('fill', preset);
    handleFill(preset);
  }

  const handleValuesChange = (values: any) => {
    Object.keys(values).forEach((key) => {
      if (key === 'size') {
        editor.setSketchSize({ width: values[key][0], height: values[key][1] });
      } else if (key === 'fill') {
        if (values[key]?.type) {
          setFillType(values[key].type);
        }
        handleFill(values[key]);
      }
    });
    editor.fireCustomModifiedEvent();
  }

  useEffect(() => {
    if (!editor) return;
    const { sketch } = editor;
    const fillValue = transformFill2Colors(sketch.fill);
    setFillType(fillValue?.type || 'solid');
    form.setFieldsValue({
      size: [sketch.width, sketch.height],
      fill: fillValue
    });
  }, [editor]);

  const renderGradientPresets = () => {
    if (fillType === 'solid') return null;

    const presets = GRADIENT_PRESETS[fillType];

    return (
      <div style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
          {t('setter.sketch.gradient_presets')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {presets.map((preset, index: number) => {
            const gradientStyle = preset.type === 'linear'
              ? `linear-gradient(${preset.gradient?.angle}deg, ${preset.gradient?.colorStops.map((s: ColorStop) => `${s.color} ${s.offset * 100}%`).join(', ')})`
              : `radial-gradient(circle at center, ${preset.gradient?.colorStops.map((s: ColorStop) => `${s.color} ${s.offset * 100}%`).join(', ')})`;
            return (
              <div
                key={index}
                onClick={() => handlePresetSelect(preset)}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: gradientStyle,
                  borderRadius: 4,
                  cursor: 'pointer',
                  border: '2px solid #e8e8e8',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1890ff';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e8e8e8';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Form
      layout="vertical"
      colon={false}
      form={form}
      onValuesChange={handleValuesChange}
    >
      <FormItem label={t('setter.sketch.size')} name="size">
        <SizeSetter />
      </FormItem>
      <FormItem label={t('setter.sketch.fill')}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio.Group
            value={fillType}
            onChange={(e) => handleFillTypeChange(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="horizontal">
              <Radio.Button value="solid">{t('setter.sketch.solid')}</Radio.Button>
              <Radio.Button value="linear">{t('setter.sketch.linear')}</Radio.Button>
              <Radio.Button value="radial">{t('setter.sketch.radial')}</Radio.Button>
            </Space>
          </Radio.Group>
          <FormItem name="fill" noStyle>
            <ColorSetter type="sketch" />
          </FormItem>
          {renderGradientPresets()}
        </Space>
      </FormItem>
    </Form>
  );
}
