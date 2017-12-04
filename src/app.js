import * as camdict from './lib/camdict'
import * as syndict from './lib/syndict'

camdict.fetchWord('rewind').then(data => console.log(data))
