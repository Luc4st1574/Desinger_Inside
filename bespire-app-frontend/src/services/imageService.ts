const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function uploadImageToBackend(formData: FormData): Promise<{ url: string, fileId: string }> {
  try {
    console.log("Uploading image to backend:", apiUrl + '/upload/image');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log("Uploading image to backend:", apiUrl + '/upload/image', "with headers:", headers);

    const res = await fetch(apiUrl + '/upload/image', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      // Intentar obtener el mensaje de error del backend
      let errorMessage = 'Image upload failed';
      
      try {
        const errorData = await res.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Si no se puede parsear la respuesta, usar el status
        if (res.status === 400) {
          errorMessage = 'Tipo de archivo no soportado o archivo inválido';
        } else if (res.status === 413) {
          errorMessage = 'El archivo es demasiado grande';
        } else if (res.status === 500) {
          errorMessage = 'Error del servidor al procesar el archivo';
        } else {
          errorMessage = `Error del servidor (${res.status})`;
        }
      }
      
      const error = new Error(errorMessage);
      Object.defineProperty(error, 'response', { 
        value: { status: res.status, data: { message: errorMessage } }, 
        enumerable: false 
      });
      throw error;
    }
    
    return res.json();
  } catch (error) {
    console.log(error);
    // Si es un error de red o cualquier otro error
    if (error instanceof Error && error.message === 'Failed to fetch') {
      throw new Error('Error de conexión con el servidor');
    }
    throw error;
  }
}
