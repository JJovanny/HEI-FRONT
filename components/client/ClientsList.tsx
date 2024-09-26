import { TableClient } from './TableClient'
import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetSupplierClients, clearClientsData, clearClientsFilters, setClientDataProps } from 'src/client/ClientActions'
import { useEffect, useState } from 'react'
import { UserFilter } from 'components/filter/UserFilter'
import { NotFound } from 'ui/NotFound'
import { postUser } from 'src/user/UserActions'

export const ClientsList = () => {
  const dispatch = useDispatch()
  const { clients, isLoadingGetClients, page, limit, count, filters } = useSelector(state => state.ClientReducer)
  const clear = filters?.clear
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    ci: '',
    email: '',
    password: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    dispatch(clearClientsFilters())
    dispatch(clearClientsData())
    
    return () => {}
  }, [])


  useEffect(() => {
    dispatch(apiGetSupplierClients())
    return () => {}
  }, [page, clear])

  const handleChangePage = (newPage) => {
    dispatch(setClientDataProps({ prop: 'page', value: newPage }))
  } 


useEffect(() => {
  const { firstName, lastName, phoneNumber, ci, email, password } = userData;
  const valid: boolean = !!firstName && !!lastName && !!phoneNumber && !!ci && !!email && !!password;
  setIsFormValid(valid);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    await dispatch(postUser(userData));
    document.getElementById('close-modal')?.click(); 
    await dispatch(apiGetSupplierClients())
    setUserData({ firstName: '', lastName: '', phoneNumber: '', ci: '', email: '', password: '' }); 
  };


  const handleShowModal = async () => {
    document.getElementById('create-user')?.click()
  }

  return (
    <main className='py-5 py-lg-8 bg-surface-secondary'>
      {/* <!-- Container --> */}
      <div className='container-xl'>
        <div className='mt-n56 position-relative z-index-100'>


        <button
            type='button'
            id='create-user'
            className='d-none'
            data-bs-target='#createUserModal'
            data-bs-toggle='modal'
          />

        <div className='justify-content-end d-flex'>
          <button onClick={handleShowModal} className='btn btn-primary btn-sm m-2'>Crear usuario</button>
        </div>

        {/* Modal */}
        <div className='modal fade' id='createUserModal' tabIndex={-1} aria-labelledby='createUserModalLabel' aria-hidden='true'>
            <div className='modal-dialog modal-center'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='createUserModalLabel'>Crear Usuario</h5>
                  <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                </div>
                <div className='modal-body'>
                  <form>
                    <div className='mb-3'>
                      <label htmlFor='firstName' className='form-label'>Nombre</label>
                      <input
                        type='text'
                        className='form-control'
                        id='firstName'
                        name='firstName'
                        value={userData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='lastName' className='form-label'>Apellidos</label>
                      <input
                        type='text'
                        className='form-control'
                        id='lastName'
                        name='lastName'
                        value={userData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='phoneNumber' className='form-label'>Teléfono</label>
                      <input
                        type='text'
                        className='form-control'
                        id='phoneNumber'
                        name='phoneNumber'
                        value={userData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='ci' className='form-label'>Cédula</label>
                      <input
                        type='text'
                        className='form-control'
                        id='ci'
                        name='ci'
                        value={userData.ci}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='email' className='form-label'>Email</label>
                      <input
                        type='email'
                        className='form-control'
                        id='email'
                        name='email'
                        value={userData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='password' className='form-label'>Contraseña</label>
                      <input
                        type='password'
                        className='form-control'
                        id='password'
                        name='password'
                        value={userData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </form>
                </div>
                <div className='modal-footer'>
                  <button type='button' className='btn btn-secondary' data-bs-dismiss='modal' id='close-modal'>Cerrar</button>
                  <button type='button' className='btn btn-primary' onClick={handleSubmit} disabled={!isFormValid}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
          

          <div className='card rounded shadow overflow-hidden'>
            <div className='card-body p-0'>

              <div className='row g-0'>
                {/* <div className='col-md-4 col-xl-3 filters h-100 p-4 p-md-5 p-xl-7 border-end-md border-bottom border-bottom-md-0'>
                  <UserFilter areSuppliers={false} />
                </div> */}
                <div className='col-md-12 col-xl-12 h-100'>
                  <div className='table-responsive'>
                    <table className='table table-hover table-nowrap'>
                      <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                        <tr>
                          <th scope='col'>Nombre</th>
                          <th scope='col' className='d-none d-lg-table-cell'>Apellidos</th>
                          <th scope='col'>Cedula</th>
                          <th scope='col'>Email</th>
                          <th scope='col'>Telefono</th>
                          <th scope='col'>Fecha ingreso</th>
                        </tr>
                      </thead>
                      <tbody style={{ cursor: 'pointer' }}>
                        {(!isLoadingGetClients && clients && Array.isArray(clients)) && clients?.map((client) =>
                          <TableClient
                            key={client?.id}
                            id={client?.id}
                            firstName={client?.firstName}
                            lastName={client?.lastName}
                            phoneNumber={client?.phoneNumber}
                            email={client?.email}
                            ci={client?.ci}
                            createdAt={client?.createdAt}
                          />)}
                      </tbody>
                    </table>
                    {clients?.length === 0 && !isLoadingGetClients && <NotFound string={strings('alert.customers')} />}

                    {isLoadingGetClients && <div className='d-flex justify-content-center' style={{ margin: '10px 0px', height: '20vh' }}><Loading /></div>}

                    <div className='py-4 text-center'>
                      <div className='card-footer border-0 py-3 text-center'>
                        {/** Previous */}
                        <a
                          onClick={() => handleChangePage(page - 1)}
                          className={page === 1
                            ? 'btn d-inline-flex btn-sm btn-neutral mx-1 disabled'
                            : 'btn d-inline-flex btn-sm btn-neutral mx-1 border-secondary'}
                        >
                          <span className='me-2'>
                            <i className='bi bi-chevron-double-left' />
                          </span>
                          <span>{strings('button.previous')}</span>
                        </a>
                        {/** Actual page */}
                        <a className='btn d-inline-flex btn-sm btn-neutral border-secondary mx-1'>
                          <span>{page}</span>
                        </a>
                        {/** Next */}
                        <a
                          onClick={() => handleChangePage(page + 1)}
                          className={page * limit >= count
                            ? 'btn d-inline-flex btn-sm btn-neutral mx-1 disabled'
                            : 'btn d-inline-flex btn-sm btn-neutral mx-1 border-secondary'}
                        >
                          <span className='me-2'>
                            <i className='bi bi-chevron-double-right' />
                          </span>
                          <span>{strings('button.next')}</span>
                        </a>
                      </div>
                      <p className='text-xs text-muted'>
                        {strings('placeholder.showResults', { actualResultsShowed: clients?.length, totalResults: count })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
