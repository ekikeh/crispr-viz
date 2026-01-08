import { toPng, toSvg } from 'html-to-image';

export const exportElementAsImage = async (
  elementId: string, 
  fileName: string, 
  format: 'png' | 'svg' = 'png'
) => {
  const node = document.getElementById(elementId);
  if (!node) throw new Error(`Element with id '${elementId}' not found`);

  // Clone specific styles or add background color for better visibility in export
  const options = {
    quality: 0.95,
    backgroundColor: '#0f172a', // Match app background (slate-900)
    filter: (n: any) => {
        // Exclude elements with 'no-export' class
        return !n.classList?.contains('no-export');
    }
  };

  try {
    let dataUrl: string;
    
    if (format === 'svg') {
      dataUrl = await toSvg(node, options);
    } else {
      dataUrl = await toPng(node, options);
    }

    const link = document.createElement('a');
    link.download = `${fileName}.${format}`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export image:', err);
    throw err;
  }
};
