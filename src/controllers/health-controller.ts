import { ok } from '../shared/utils/http'

export class GetHealthStatusController {
  static async handle() {
    const status = 'Ok'
    return ok({ status })
  }
}
