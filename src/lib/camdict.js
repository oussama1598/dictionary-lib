import Xray from 'x-ray'

const URI = 'https://dictionary.cambridge.org/dictionary'
const dictionaries = {
  'en': 'english',
  'en-ar': 'english-arabic',
  'en-fr': 'english-french',
  'en-es': 'english-spanish'
}
const x = Xray({
  filters: {
    trim (val) {
      return val.trim()
    },
    column (val) {
      return val.replace(':', '')
    }
  }
})

function generateUrlTemplate (dictionary, word) {
  return `${URI}/${dictionaries[dictionary]}/${word}`
}

export function fetchWord (word) {
  if (!word) throw new Error('word is required')

  const url = generateUrlTemplate('en', word)

  return new Promise((resolve, reject) => {
    x(url, 'div[data-tab="ds-british"] .entry-body', {
      type: '.pos',
      prononciations: {
        us: x('.pos-header span[pron-region="US"]', {
          prononciation: '.pron',
          audio: '.audio_play_button@data-src-mp3'
        }),
        uk: x('.pos-header span[pron-region="UK"]', {
          prononciation: '.pron',
          audio: '.audio_play_button@data-src-mp3'
        })
      },
      meanings: x('div[data-tab="ds-british"] .def-block', [{
        meaning: '.def | trim | column',
        examples: ['.def-body .examp | trim | column']
      }])
    })((err, result) => {
      if (err) return reject(err)

      resolve(result)
    })
  })
}

export function translateWord (word, dictionary = 'en-fr') {
  if (!word) throw new Error('word is required')
  if (!dictionaries[dictionary]) throw new Error('No translation available for this language')

  const url = generateUrlTemplate(dictionary, word)

  return new Promise((resolve, reject) => {
    x(url, '.entry-body', {
      type: '.pos',
      prononciations: {
        us: x('.pos-head span[pron-region="US"]', {
          prononciation: '.pron',
          audio: '.audio_play_button@data-src-mp3'
        }),
        uk: x('.pos-head span[pron-region="UK"]', {
          prononciation: '.pron',
          audio: '.audio_play_button@data-src-mp3'
        })
      },
      meanings: x('.def-block', [{
        meaning: '.def | trim | column',
        translation: '.trans | trim',
        examples: x('.def-body .examp', [{
          example: '.eg | trim | column',
          translation: '.trans | trim'
        }])
      }])
    })((err, result) => {
      if (err) return reject(err)

      resolve(result)
    })
  })
}
