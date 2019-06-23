import React from 'react'
import languageManager from './../languageManager'
const currentLang = languageManager.getCurrentLanguage().name
const imgs = ['jpg', 'jpeg', 'gif', 'bmp', 'png']
const videos = ['mp4', '3gp', 'ogg', 'wmv', 'flv', 'avi']
const audios = ['wav', 'mp3', 'ogg']

export default {
  applyeLangs (value) {
    const langs = languageManager.getAllLanguages()
    const data = {}
    for (const key in langs) {
      data[key] = value
    }
    return data
  },
  getAssetIconByURL (url, customClass) {
    if (url) {
      const ext = url
        .split('/')
        .pop()
        .split('.')
        .pop()
      const cls = 'unkownFileType ' + customClass

      if (!ext) {
        return (
          <div className={cls}>
            <i className='icon-file-text un-icon' />
            <span className='un-text'>uknown</span>
          </div>
        )
      } else {
        if (imgs.indexOf(ext.toLowerCase()) !== -1) {
          return <img src={url} alt='' />
        } else if (videos.indexOf(ext.toLowerCase()) !== -1) {
          return <i className='icon-video' />
        } else if (audios.indexOf(ext.toLowerCase()) !== -1) {
          return <i className='icon-audio' />
        } else {
          return (
            <div className={cls}>
              <i className='icon-file-text un-icon' />
              <span className='un-text'>.{ext}</span>
            </div>
          )
        }
      }
    }
  },
  getRequestMediaComponentByURL (url, customClass) {
    if (url) {
      const ext = url
        .split('/')
        .pop()
        .split('.')
        .pop()
      const cls = 'unkownFileType ' + customClass

      if (!ext) {
        return (
          <div className={cls}>
            <i className='icon-file-text un-icon' />
            <span className='un-text'>uknown</span>
          </div>
        )
      } else {
        if (imgs.indexOf(ext.toLowerCase()) !== -1) {
          return <img src={url} alt='' />
        } else if (videos.indexOf(ext.toLowerCase()) !== -1) {
          return (
            <video controls>
              <source src={url} />
            </video>
          )
        } else if (audios.indexOf(ext.toLowerCase()) !== -1) {
          return (
            <audio controls>
              <source src={url} />
            </audio>
          )
        } else {
          return (
            <div className={cls}>
              <i className='icon-file-text un-icon' />
              <span className='un-text'>.{ext}</span>
            </div>
          )
        }
      }
    }
  },
  getRequestMediaThumbComponentByURL (url, customClass) {
    if (url) {
      const ext = url
        .split('/')
        .pop()
        .split('.')
        .pop()
      const cls = 'unkownFileType ' + customClass

      if (!ext) {
        return (
          <div className={cls}>
            <i className='icon-file-text un-icon' />
            <span className='un-text'>uknown</span>
          </div>
        )
      } else {
        if (imgs.indexOf(ext.toLowerCase()) !== -1) {
          return <img src={url} alt='' />
        } else if (videos.indexOf(ext.toLowerCase()) !== -1) {
          return (
            <video>
              <source src={url} />
            </video>
          )
        } else if (audios.indexOf(ext.toLowerCase()) !== -1) {
          return <i className='icon-audio' />
        } else {
          return (
            <div className={cls}>
              <i className='icon-file-text un-icon' />
              <span className='un-text'>.{ext}</span>
            </div>
          )
        }
      }
    }
  },
  getMediaComponentByUrl (file, customClass) {
    const url = file.url[currentLang]
    if (url) {
      const ext = url
        .split('/')
        .pop()
        .split('.')
        .pop()
      const cls = 'unkownFileType ' + customClass
      const name = file.name

      if (!ext) {
        return (
          <div className={cls}>
            <i className='icon-file-text un-icon' />
            <span className='un-text'>uknown</span>
          </div>
        )
      } else {
        if (imgs.indexOf(ext.toLowerCase()) !== -1) {
          return <img src={url} alt='' />
        } else if (videos.indexOf(ext.toLowerCase()) !== -1) {
          return (
            <video controls>
              <source src={url} />
            </video>
          )
        } else if (audios.indexOf(ext.toLowerCase()) !== -1) {
          return (
            <audio controls>
              <source src={url} />
            </audio>
          )
        } else {
          return (
            <div className={cls}>
              <i className='icon-file-text un-icon' />
              <span className='un-text'>{name}</span>
            </div>
          )
        }
      }
    }
  },
  getMediaThumbnailByUrl (url, customClass) {
    if (url) {
      const ext = url
        .split('/')
        .pop()
        .split('.')
        .pop()

      const cls = 'unkownFileType ' + customClass

      if (!ext) {
        return (
          <div className={cls}>
            <i className='icon-file-text un-icon' />
            <span className='un-text'>uknown</span>
          </div>
        )
      } else {
        if (imgs.indexOf(ext.toLowerCase()) !== -1) {
          return <img src={url} alt='' />
        } else if (videos.indexOf(ext.toLowerCase()) !== -1) {
          return (
            <div className='thumbnail-video'>
              <video>
                <source src={url} />
              </video>
              <div className='thumbnail-cover'>
                <i className='icon-video' />
              </div>
            </div>
          )
        } else if (audios.indexOf(ext.toLowerCase()) !== -1) {
          return <i className='icon-audio' />
        } else {
          return (
            <div className={cls}>
              <i className='icon-file-text un-icon' />
              <span className='un-text'>.{ext}</span>
            </div>
          )
        }
      }
    }
  },
  getMediaLocalFile (file, customClass) {
    if (file) {
      const result = window.URL.createObjectURL(file)
      const type = file.type
      const cls = 'unkownFileType ' + customClass

      if (type.includes('image')) return <img src={result} alt='' />
      if (type.includes('video')) {
        return (
          <video>
            <source src={result} />
          </video>
        )
      }
      if (type.includes('audio')) return <i className='icon-audio' />

      return (
        <div className={cls}>
          <i className='icon-file-text un-icon' />
          <span className='un-text'>{file.name}</span>
        </div>
      )
    }
  },
  getMediaLocalFilePreview (file, customClass) {
    if (file) {
      const result = window.URL.createObjectURL(file)
      const type = file.type
      const cls = 'unkownFileType ' + customClass

      if (type.includes('image')) return <img src={result} alt='' />
      if (type.includes('video')) {
        return (
          <video controls>
            <source src={result} />
          </video>
        )
      }
      if (type.includes('audio')) {
        return (
          <audio controls>
            <source src={result} />
          </audio>
        )
      }

      return (
        <div className={cls}>
          <i className='icon-file-text un-icon' />
          <span className='un-text'>{file.name}</span>
        </div>
      )
    }
  }
}
