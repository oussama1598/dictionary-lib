import Xray from 'x-ray'

const URI = 'http://www.thesaurus.com/browse'
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

export function fetchWord (word) {
  if (!word) throw new Error('word is required')

  return new Promise((resolve, reject) => {
    x(`${URI}/${word}`, {
      synonymous: x('.relevancy-list', ['ul li .text']),
      antonyms: x('.antonyms ul li', ['.text'])
    })((err, result) => {
      if (err) return reject(err)

      resolve(result)
    })
  })
}
