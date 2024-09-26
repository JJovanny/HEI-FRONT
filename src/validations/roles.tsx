import { useSelector } from 'src/redux/hooks'
import { EUserType } from 'src/types/enums'
import { IUserState } from 'src/types/user'

const AdminChecker = ({ children }) => {
  const userData = useSelector(state => state.AdminUserReducer.userData)

  const isAdmin = () => {
    const roles = userData ? userData.roles : []
    return roles.includes('SUPER_ADMIN')
  }

  return isAdmin() ? children : null
}

const SupplierChecker = ({ children }) => {
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const userType = dataUser?.userType

  const isSupplier = () => {
    const role = userType
    return role === 'SUPPLIER'
  }

  return isSupplier() ? children : null
}

const SupplierOrBothChecker = ({ children }) => {
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const userType = dataUser?.userType

  const isSupplier = () => {
    const role = userType
    return role === EUserType.SUPPLIER || role === EUserType.BOTH
  }

  return isSupplier() ? children : null
}

const PayeerOrBothChecker = ({ children }) => {
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const userType = dataUser?.userType

  const isPayerOrBoth = () => {
    const role = userType
    return role === EUserType.PAYER || role === EUserType.BOTH
  }

  return isPayerOrBoth() ? children : null
}

const IsFinancialChecker = ({ children }) => {
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const userType = dataUser?.userType

  const isFinancial = () => {
    const role = userType
    return role === EUserType.FINANCIAL
  }

  return isFinancial() ? children : null
}

const IsNotAdminChecker = ({ children }) => {
  const userData = useSelector(state => state.AdminUserReducer.userData)

  const isNotAdmin = () => {
    const roles = userData ? userData.roles : []
    return roles.includes('SUPER_ADMIN')
  }

  return !isNotAdmin() ? children : null
}

const IsNotSupplierChecker = ({ children }) => {
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const userType = dataUser?.userType

  const isNotSupplier = () => {
    const role = userType
    return role !== 'SUPPLIER'
  }

  return isNotSupplier() ? children : null
}

export {
  AdminChecker,
  SupplierChecker,
  IsNotSupplierChecker,
  IsNotAdminChecker,
  IsFinancialChecker,
  SupplierOrBothChecker,
  PayeerOrBothChecker
}
