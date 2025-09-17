import React, { useEffect, useRef, useState } from 'react';
import styles from './pdfCanvas.module.css';

interface AnnotationPoint {
  x: number;
  y: number;
  canvasX: number;
  canvasY: number;
  id: string;
}

const PdfAnnotationDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [annotations, setAnnotations] = useState<AnnotationPoint[]>([]);
  const [isDrawMode, setIsDrawMode] = useState(true);
  const [selectedTool, setSelectedTool] = useState<'circle' | 'square' | 'text'>('circle');
  const [annotationColor, setAnnotationColor] = useState('#ff0000');

  useEffect(() => {
    // デモ用のPDF風背景を描画
    renderDemoPdf();
  }, []);

  const renderDemoPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // A4サイズ風の設定
    canvas.width = 595;
    canvas.height = 842;
    // 白背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // デモ用のテキストとレイアウト
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.fillText('PDF注釈システム - デモ', 50, 60);
    ctx.font = '16px Arial';
    ctx.fillText('このエリアをクリックして注釈を追加できます', 50, 100);
    ctx.fillText('• 赤い円: クリック位置にマーカーを追加', 70, 140);
    ctx.fillText('• 青い四角: 範囲選択マーカー', 70, 170);
    ctx.fillText('• テキスト注釈: コメント追加', 70, 200);
    // サンプルコンテンツ
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.moveTo(50, 250 + i * 30);
      ctx.lineTo(545, 250 + i * 30);
      ctx.stroke();
    }
    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.fillText('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 60, 270);
    ctx.fillText('Sed do eiusmod tempor incididunt ut labore et dolore magna.', 60, 300);
    ctx.fillText('Ut enim ad minim veniam, quis nostrud exercitation ullamco.', 60, 330);

    // オーバーレイの初期化
    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.width = canvas.width;
    overlay.height = canvas.height;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawMode) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = overlay.getContext('2d');
    if (!ctx) return;

    const rect = overlay.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    // PDF座標への変換（デモ用）
    const pdfX = canvasX;
    const pdfY = overlay.height - canvasY; // Y軸反転
    const newAnnotation: AnnotationPoint = {
      x: pdfX,
      y: pdfY,
      canvasX,
      canvasY,
      id: `annotation-${Date.now()}`,
    };

    // 選択されたツールに応じて描画
    drawAnnotation(ctx, canvasX, canvasY, selectedTool, annotationColor);
    setAnnotations((prev) => [...prev, newAnnotation]);
  };

  const drawAnnotation = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    tool: string,
    color: string,
  ) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    switch (tool) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(x - 8, y - 8, 16, 16);
        break;
      case 'text':
        ctx.font = '12px Arial';
        ctx.fillText('📝', x - 6, y + 4);
        break;
    }
  };

  const clearAnnotations = (): void => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = overlay.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, overlay.width, overlay.height);
    setAnnotations([]);
  };

  return (
    <div className={styles.container}>
      <h2>PDF注釈システム - 実動デモ</h2>
      <div className={styles.controlPanel}>
        <button
          onClick={() => setIsDrawMode(!isDrawMode)}
          className={
            isDrawMode ? styles.drawModeSelectBtnActive : styles.drawModeSelectBtnDeactivated
          }
        >
          {isDrawMode ? '描画モード ON' : '描画モード OFF'}
        </button>
        <select
          value={selectedTool}
          onChange={(e) => setSelectedTool(e.target.value as 'circle' | 'square' | 'text')}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="circle">🔴 円形マーカー</option>
          <option value="square">🟦 四角マーカー</option>
          <option value="text">📝 テキスト注釈</option>
        </select>
        <input
          type="color"
          value={annotationColor}
          onChange={(e) => setAnnotationColor(e.target.value)}
          style={{ width: '40px', height: '35px', border: 'none', borderRadius: '4px' }}
        />
        <button onClick={clearAnnotations}>🗑️ 全削除</button>
      </div>
      <div className={styles.pdfDisplay}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
        <canvas
          ref={overlayRef}
          className={isDrawMode ? styles.canvasActive : styles.canvasDeactivated}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  );
};

export default PdfAnnotationDemo;
