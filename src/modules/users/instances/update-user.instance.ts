import { UpdateUserController } from '../controllers/update-user.controller'
import { UserRepository } from '../repositories/user.repository'
import { UpdateUserService } from '../services/update-user.service'

const updateUserRepository = new UserRepository()
const updateUserService = new UpdateUserService(updateUserRepository)
export const updateUserController = new UpdateUserController(updateUserService)
