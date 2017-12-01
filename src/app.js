import camdict from './lib/camdict'
import * as syndict from './lib/syndict'

syndict.fetchWord('oxford').then(data => console.log(data))
