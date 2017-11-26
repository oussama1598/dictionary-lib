import { fetchWord, translateWord } from './lib/camdict'

translateWord('edible', 'en-es').then(data => console.log(data.meanings[0]))
