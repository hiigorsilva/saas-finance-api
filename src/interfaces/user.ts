enum FINANCIAL_PROFILE {
  DEBTOR,
  SPENDER,
  DETACHED,
  SAVER,
  INVESTOR,
}

export interface User {
  id: string
  name: string
  email: string
  passwordHashed: string
  financialProfile: FINANCIAL_PROFILE | null
  createdAt: Date | null
  updatedAt: Date | null
  deletedAt: Date | null
}
