// src/utils/deltaToDocx.ts
// Importación dinámica para evitar errores de SSR
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let generateWord: any = null;

async function getGenerateWord() {
  if (!generateWord && typeof window !== 'undefined') {
    // Solo importar en el cliente
    const quillToWordModule = await import('quill-to-word');
    generateWord = quillToWordModule.generateWord;
  }
  return generateWord;
}

type QuillDelta = {
  ops: Array<{
    insert?: string | object;
    attributes?: Record<string, unknown>;
    retain?: number;
    delete?: number;
  }>;
};

export async function convertDeltaToDocx(delta: QuillDelta): Promise<Blob> {
  try {
    console.log('Converting Delta to DOCX:', delta);
    
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
      throw new Error('convertDeltaToDocx can only be used in the browser');
    }
    
    // Obtener generateWord dinámicamente
    const generateWordFunction = await getGenerateWord();
    if (!generateWordFunction) {
      throw new Error('Failed to load quill-to-word library');
    }
    
    // Normalizar el Delta para que sea compatible con quill-to-word
    const normalizedDelta = {
      ...delta,
      ops: delta.ops.map(op => {
        if (op.attributes) {
          const normalizedAttributes = { ...op.attributes };
          
          // Convertir size de "48px" a número 48
          if (normalizedAttributes.size && typeof normalizedAttributes.size === 'string') {
            const sizeMatch = normalizedAttributes.size.match(/(\d+)px?/);
            if (sizeMatch) {
              normalizedAttributes.size = parseInt(sizeMatch[1]);
              console.log(`    * Converted size from "${op.attributes.size}" to ${normalizedAttributes.size}`);
            }
          }
          
          // Convertir color de "#28a745" a formato sin #
          if (normalizedAttributes.color && typeof normalizedAttributes.color === 'string') {
            const colorStr = normalizedAttributes.color.replace('#', '');
            normalizedAttributes.color = colorStr;
            console.log(`    * Converted color from "${op.attributes.color}" to "${colorStr}"`);
          }
          
          return { ...op, attributes: normalizedAttributes };
        }
        return op;
      })
    };
    
    // Debug: Analizar el Delta en detalle
    console.log('Delta operations count:', normalizedDelta.ops.length);
    normalizedDelta.ops.forEach((op, index) => {
      console.log(`Op ${index}:`, {
        insert: op.insert,
        attributes: op.attributes,
        type: typeof op.insert
      });
      
      // Analizar atributos específicos
      if (op.attributes) {
        console.log(`  - Attributes found:`, op.attributes);
        if (op.attributes.bold) console.log(`    * Bold: ${op.attributes.bold}`);
        if (op.attributes.color) console.log(`    * Color: ${op.attributes.color}`);
        if (op.attributes.size) console.log(`    * Size: ${op.attributes.size} (type: ${typeof op.attributes.size})`);
        if (op.attributes.italic) console.log(`    * Italic: ${op.attributes.italic}`);
      }
    });
    
    // Configuración mejorada con estilos personalizados
    const config = {
      exportAs: 'blob' as const,
      // Configurar estilos personalizados para mejorar la conversión
      paragraphStyles: {
        normal: {
          run: {
            font: 'Arial',
            size: 12, // Tamaño base en puntos
            color: '000000' // Color negro por defecto
          }
        }
      }
    };
    
    console.log('Using config:', config);
    console.log('Normalized Delta:', normalizedDelta);
    
    // Usar quill-to-word para convertir el delta directamente a un Blob
    const result = await generateWordFunction(normalizedDelta, config);
    
    console.log('generateWordFunction result type:', typeof result);
    console.log('generateWordFunction result:', result);
    console.log('Is instance of Blob?', result instanceof Blob);
    console.log('Constructor name:', result?.constructor?.name);
    console.log('Blob size:', result instanceof Blob ? result.size : 'N/A');
    console.log('Blob type:', result instanceof Blob ? result.type : 'N/A');
    
    // Si es un Blob, devolverlo directamente
    if (result instanceof Blob) {
      console.log('Successfully got Blob from generateWordFunction');
      return result;
    }
    
    throw new Error(`Expected Blob but got: ${typeof result}, constructor: ${result?.constructor?.name}`);
  } catch (error) {
    console.error('Error converting Delta to DOCX:', error);
    throw new Error('Failed to convert content to Word document');
  }
}

export function parseContentForDelta(content: string): { delta?: QuillDelta; html?: string } {
  try {
    const parsed = JSON.parse(content);
    if (parsed.delta) {
      return { delta: parsed.delta, html: parsed.html };
    }
  } catch {
    // Si no es JSON válido, tratarlo como HTML
    return { html: content };
  }
  return { html: content };
}
