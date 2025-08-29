import { RemoveUserController } from '../controllers/remove-user.controller'
import { UserRepository } from '../repositories/user.repository'
import { RemoveUserService } from '../services/remove-user.service'

const userRepository = new UserRepository()
const removeUserService = new RemoveUserService(userRepository)
export const removeUserController = new RemoveUserController(removeUserService)
