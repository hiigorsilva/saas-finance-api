import { MeController } from '../controllers/me.controller'
import { UserRepository } from '../repositories/user.repository'
import { MeService } from '../services/me.service'

const userRepository = new UserRepository()
const meService = new MeService(userRepository)
export const meController = new MeController(meService)
