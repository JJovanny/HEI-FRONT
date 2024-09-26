import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { NotFound } from 'ui/NotFound'
import { TableProductElement } from './TableProductElement'
import { apiGetProducts, postPutProduct, clearProducts } from 'src/admin/products/ProductActions'
import Swal from 'sweetalert2';
import { set } from 'src/admin/products/ProductActions'

export const OnboardingProfilesList = () => {
  const dispatch = useDispatch()

  const { accessToken } = useSelector(state => state.AdminUserReducer)
  const { products, loadingProduct, product } = useSelector(({ ProductReducer }) => {
    const { products, loadingProduct, count, product } = ProductReducer
    // , page, count, limit

    return { products, loadingProduct, count, product }
  })


  const [productData, setProduct] = useState({
    name: '',
    price: 0,
    value: 0,
    description: '',
    img: '',
    amount: 0,
    id: '',
    showHome: false,
  });


  useEffect(() => {
    dispatch(clearProducts())
    accessToken && dispatch(apiGetProducts())
    return () => { }
  }, [])

  useEffect(() => {
    if (product && product.id && product.id !== '') {
      setProduct({
        name: product.name,
        price: product.price,
        value: product.value,
        img: product.img,
        amount: product.amount,
        id: product.id,
        description: product.description,
        showHome: product.showHome,
      });

      document.getElementById('create')?.click()

    } else {
      setProduct({
        name: '',
        price: 0,
        value: 0,
        img: '',
        amount: 0,
        id: '',
        description: '',
        showHome: false,
      });
    }
  }, [product]);

  const [base64Image, setBase64Image] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setBase64Image(result);
        setProduct((prev) => ({
          ...prev,
          img: result
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {

    const { id, ...productInfo } = productData

    let producPayload = productInfo
    if (id && id !== '') {
      producPayload["id"] = id;
    }

    await dispatch(postPutProduct(producPayload));

    await dispatch(apiGetProducts());

    Swal.fire({
      icon: 'success',
      title: 'Producto creado',
      text: 'El producto se ha creado correctamente.',
      confirmButtonText: 'Aceptar'
    });

    document.getElementById('btn-close')?.click()

    setProduct({
      name: '',
      price: 0,
      value: 0,
      img: '',
      amount: 0,
      id: '',
      description: '',
      showHome: false,
    });
    setBase64Image('');
  };


  const handleCreate = async () => {

    await dispatch(set({
      prop: 'product', value: {
        id: '',
        name: '',
        description: '',
        price: 0,
        amount: 0,
        value: 0,
        img: '',
        showHome: false,
      }
    }));

    document.getElementById('create')?.click()
  }


  return (
    <>
      <main className='pt-5 pt-lg-8 bg-surface-secondary'>
        <div className='container-xl pt-6'>


          <div className="modal fade" id="productModal" tabIndex={-1} aria-labelledby="productModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="productModalLabel">Producto</h5>
                  <button type="button" id='btn-close' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {/* Formulario para crear producto */}
                  <form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Nombre</label>
                      <input type="text" className="form-control" id="name" name="name" value={productData.name} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Descripcion</label>
                      <input type="text" className="form-control" id="description" name="description" value={productData.description} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">Precio</label>
                      <input type="text" className="form-control" id="price" name="price" value={productData.price} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="value" className="form-label">Valor</label>
                      <input type="text" className="form-control" id="value" name="value" value={productData.value} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="amount" className="form-label">Cantidad</label>
                      <input type="number" className="form-control" id="amount" name="amount" value={productData.amount} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="img" className="form-label">Imagen</label>
                      <input type="file" className="form-control" id="img" name="img" onChange={handleImageUpload} />
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="showHome"
                        name="showHome"
                        checked={productData.showHome}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="showHome">Mostrar en página principal</label>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>Guardar Producto</button>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-n56 position-relative z-index-100'>


            <button type="button" className="btn btn-primary mb-5 " onClick={handleCreate}>
              Crear Producto
            </button>

            <button type="button" id="create" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#productModal">
              Crear Producto
            </button>

            <div className='card rounded shadow overflow-hidden'>
              <div className='card-body p-0'>
                {/** Tabs Contents */}

                <div className='table-responsive'>
                  <table className='table table-hover table-nowrap'>
                    <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                      <tr>
                        <th scope='col'>Nombre</th>
                        <th scope='col'>Precio</th>
                        <th scope='col' className='d-xl-table-cell'>Valor</th>
                        <th scope='col' className='d-xl-table-cell'>Cantidad</th>
                        <th scope='col' />
                      </tr>
                    </thead>
                    <tbody>
                      {!loadingProduct && products.map((product) =>
                        <TableProductElement
                          key={product.id}
                          product={product}
                        />)}
                    </tbody>
                  </table>
                  {loadingProduct && <div className='d-flex justify-content-center' style={{ margin: '10px 0px', height: '20vh' }}><Loading /></div>}
                  {products.length === 0 && !loadingProduct && <NotFound string={strings('alert.admin.products')} mb />}

                  {/** pagination
                      <div className='py-4 text-center'>
                        <div className='card-footer border-0 py-3 text-center'>
                          {/** Previous
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
                          {/** Actual page
                          <a className='btn d-inline-flex btn-sm btn-neutral border-secondary mx-1'>
                            <span>{page}</span>
                          </a>
                          {/** Next
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
                          {strings('placeholder.showResults', { actualResultsShowed: invoices.length, totalResults: count })}
                        </p>
                      </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
