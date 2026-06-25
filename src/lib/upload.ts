import axios from 'axios';

// Uploads an image to imgbb and returns the hosted URL.
export async function uploadImage(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key || key === 'your_imgbb_key') {
    throw new Error('Image upload is not configured (missing NEXT_PUBLIC_IMGBB_KEY).');
  }
  const form = new FormData();
  form.append('image', file);
  const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${key}`, form);
  return data.data.url as string;
}
