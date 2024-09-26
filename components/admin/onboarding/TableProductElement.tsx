import { useRouter } from 'next/navigation'
import { useDispatch } from 'src/redux/hooks'
import { clearProducts, set } from 'src/admin/products/ProductActions'
import { IProductDataState } from 'src/types/admin/products'

export const TableProductElement = ({ product } : { product: IProductDataState }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { id, name, price, value, img, amount } = product;

  const handleManageClick = async () => {
    dispatch(set({ prop: 'product', value: product }));
  };

  return (
    <>
      <tr key={id} className='cursor-pointer' onClick={handleManageClick}>
        <td>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }}>
            {name}
          </a>
        </td>
        <td> ${price} </td>
        <td className='d-xl-table-cell'>
          {value} Pts
        </td>
        <td className='d-xl-table-cell'>
          {amount}
        </td>
        <td className='text-end'>
          {img ? (
            <img 
              src={img} 
              alt={name} 
              style={{ width: '50%', height: '150px'}} 
            />
          ) : (
            'No Image'
          )}
        </td>
        {/* <td> <i className='bi bi-pencil' ></i></td> */}
      </tr>
    </>
  );
};
