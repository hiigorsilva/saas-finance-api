import { UserRepository } from '../../users/repositories/user.repository'
import { RegisterController } from '../controllers/register.controller'
import { RegisterService } from '../services/register.service'

const userRepository = new UserRepository()
const registerService = new RegisterService(userRepository)
export const registerController = new RegisterController(registerService)
