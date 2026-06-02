export const uploadService = {
  uploadImg
}

async function uploadImg(file: File, publicId: string) {
  const CLOUD_NAME = "dhixlriwm"
  const UPLOAD_PRESET = "tiran_preset" // User needs to create this in Cloudinary
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('public_id', publicId)

  try {
    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Failed to upload', err)
    throw err
  }
}
