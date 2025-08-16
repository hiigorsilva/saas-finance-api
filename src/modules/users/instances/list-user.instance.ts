import { ListUserController } from '../controllers/list-user.controller'
import { UserRepository } from '../repositories/user.repository'
import { ListUserService } from '../services/list-user.service'

const userRepository = new UserRepository()
const listUserService = new ListUserService(userRepository)
export const listUserController = new ListUserController(listUserService)
