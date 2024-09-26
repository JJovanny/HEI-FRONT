import { ITax } from 'src/types/tax'

export default class TaxManager {
  static getId = (tax: ITax) => {
    return tax?.id ? tax.id : ''
  }

  static getName = (tax: ITax) => {
    return tax?.name ? tax.name : ''
  }

  static getPercentage = (tax: ITax) => {
    return tax?.percentage ? tax.percentage : ''
  }
}
