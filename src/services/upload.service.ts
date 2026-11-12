import type { UploadSignatureResponse } from './site-media.service'
import { CLOUDINARY_CLOUD_ID } from '../utils/cloudinary'

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  format: string
  width?: number
  height?: number
  duration?: number
  bytes: number
}

export const uploadService = {
  uploadImg,
  uploadDirectWithSignature,
  uploadUnsignedDirect
}

async function uploadImg(file: File, publicId: string) {
  const UPLOAD_PRESET = 'tiran_preset'
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_ID}/image/upload`

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
    if (!res.ok) {
      console.error('Cloudinary upload error:', data)
      throw new Error(data.error?.message || 'Failed to upload to Cloudinary')
    }
    return data
  } catch (err) {
    console.error('Failed to upload', err)
    throw err
  }
}

function _xhrUpload(
  uploadUrl: string,
  formData: FormData,
  errorLabel: string,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uploadUrl)

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      }
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data)
        } else {
          console.error(errorLabel, data)
          reject(new Error(data.error?.message || 'Upload to Cloudinary failed'))
        }
      } catch {
        reject(new Error('Invalid response from Cloudinary'))
      }
    }

    xhr.onerror = () => {
      reject(new Error('Network error during upload to Cloudinary'))
    }

    xhr.send(formData)
  })
}

async function uploadDirectWithSignature(
  file: File,
  signatureData: UploadSignatureResponse,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image'
  const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', signatureData.apiKey)
  formData.append('timestamp', signatureData.timestamp.toString())
  formData.append('signature', signatureData.signature)
  formData.append('public_id', signatureData.publicId)
  formData.append('folder', signatureData.folder)

  return _xhrUpload(uploadUrl, formData, 'Cloudinary signed upload failed:', onProgress)
}

async function uploadUnsignedDirect(
  file: File,
  publicId: string,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const UPLOAD_PRESET = 'tiran_preset'
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image'
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_ID}/${resourceType}/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('public_id', publicId)

  return _xhrUpload(uploadUrl, formData, 'Cloudinary direct unsigned upload failed:', onProgress)
}
