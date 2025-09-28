<template>
  <div class="file-upload">
    <header class="page-header">
      <h1>File Upload</h1>
      <p>Advanced file upload with progress tracking and preview</p>
    </header>

    <div class="upload-container">
      <div class="upload-zone"
           :class="{ 'dragover': isDragOver, 'has-files': files.length > 0 }"
           @dragover.prevent="handleDragOver"
           @dragleave.prevent="handleDragLeave"
           @drop.prevent="handleDrop">

        <div v-if="files.length === 0" class="upload-prompt">
          <div class="upload-icon">📁</div>
          <h3>Drag & drop files here</h3>
          <p>or click to select files</p>
          <input
            ref="fileInput"
            type="file"
            multiple
            @change="handleFileSelect"
            class="file-input"
          />
          <button @click="$refs.fileInput.click()" class="select-btn">
            Select Files
          </button>
        </div>

        <div v-else class="file-list">
          <div v-for="(file, index) in files" :key="index" class="file-item">
            <div class="file-info">
              <div class="file-icon">{{ getFileIcon(file.type) }}</div>
              <div class="file-details">
                <h4>{{ file.name }}</h4>
                <p>{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <div class="file-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: uploadProgress[index] + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ uploadProgress[index] }}%</span>
            </div>
            <button @click="removeFile(index)" class="remove-btn">×</button>
          </div>
        </div>
      </div>

      <div v-if="files.length > 0" class="upload-actions">
        <button
          @click="uploadFiles"
          :disabled="isUploading"
          class="upload-btn"
        >
          {{ isUploading ? 'Uploading...' : 'Upload Files' }}
        </button>
        <button @click="clearFiles" class="clear-btn">Clear All</button>
      </div>
    </div>

    <div v-if="uploadedFiles.length > 0" class="uploaded-files">
      <h2>Uploaded Files</h2>
      <div class="uploaded-grid">
        <div v-for="file in uploadedFiles" :key="file.id" class="uploaded-item">
          <div class="uploaded-preview">
            <img v-if="file.type.startsWith('image/')" :src="file.url" :alt="file.name" />
            <div v-else class="file-placeholder">{{ getFileIcon(file.type) }}</div>
          </div>
          <p>{{ file.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface UploadedFile {
  id: string
  name: string
  type: string
  url: string
}

// Reactive state
const files = ref<File[]>([])
const uploadProgress = reactive<number[]>([])
const isUploading = ref(false)
const isDragOver = ref(false)
const uploadedFiles = ref<UploadedFile[]>([])

// File handling methods
const handleDragOver = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const droppedFiles = Array.from(event.dataTransfer?.files || [])
  addFiles(droppedFiles)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFiles = Array.from(target.files || [])
  addFiles(selectedFiles)
}

const addFiles = (newFiles: File[]) => {
  files.value.push(...newFiles)
  newFiles.forEach(() => uploadProgress.push(0))
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
  uploadProgress.splice(index, 1)
}

const clearFiles = () => {
  files.value = []
  uploadProgress.splice(0)
}

const uploadFiles = async () => {
  isUploading.value = true

  for (let i = 0; i < files.value.length; i++) {
    await uploadFile(files.value[i], i)
  }

  // Clear uploaded files after successful upload
  files.value = []
  uploadProgress.splice(0)
  isUploading.value = false
}

const uploadFile = async (file: File, index: number): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate file upload with progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        // Add to uploaded files
        uploadedFiles.value.push({
          id: Date.now() + index + '',
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file)
        })

        resolve()
      }
      uploadProgress[index] = Math.min(progress, 100)
    }, 100)
  })
}

// Utility methods
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return '🖼️'
  if (type.startsWith('video/')) return '🎥'
  if (type.startsWith('audio/')) return '🎵'
  if (type.includes('pdf')) return '📄'
  if (type.includes('text')) return '📝'
  return '📎'
}
</script>

<style scoped>
.file-upload {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #64748b;
  font-size: 1.1rem;
}

.upload-container {
  margin-bottom: 3rem;
}

.upload-zone {
  border: 3px dashed #cbd5e1;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  transition: all 0.3s;
  background: #f8fafc;
}

.upload-zone.dragover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.upload-zone.has-files {
  background: white;
  border-style: solid;
  border-color: #e2e8f0;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  font-size: 4rem;
  opacity: 0.6;
}

.file-input {
  display: none;
}

.select-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s;
}

.select-btn:hover {
  background: #2563eb;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.file-icon {
  font-size: 2rem;
}

.file-details h4 {
  margin: 0;
  color: #2c3e50;
}

.file-details p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.file-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.875rem;
  color: #64748b;
  min-width: 40px;
}

.remove-btn {
  background: #ef4444;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #dc2626;
}

.upload-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.upload-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s;
}

.upload-btn:hover:not(:disabled) {
  background: #059669;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #4b5563;
}

.uploaded-files h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.uploaded-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.uploaded-item {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s;
}

.uploaded-item:hover {
  transform: translateY(-2px);
}

.uploaded-preview {
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.uploaded-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-placeholder {
  font-size: 3rem;
  opacity: 0.6;
}

.uploaded-item p {
  margin: 0;
  font-size: 0.875rem;
  color: #2c3e50;
  word-break: break-word;
}

@media (max-width: 768px) {
  .file-upload {
    padding: 1rem;
  }

  .upload-zone {
    padding: 2rem 1rem;
  }

  .file-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .file-progress {
    width: 100%;
  }
}
</style>