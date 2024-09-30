import { useEffect, useState } from "react";
import { apiGetProductsUser } from "src/admin/products/ProductActions";
import { postPurchaseApi } from "src/purchase/PurchaseAction";
import { useDispatch, useSelector } from "src/redux/hooks";
import { EUserTypeE } from "src/types/enums";
import { IUserState } from "src/types/user";
import Swal from 'sweetalert2';

// Definir el tipo para los productos en el carrito
interface CartItem {
  producId: number;
  name: string;
  quantity: number;
  price: number;
  priceTotalWithDiscount: number,
  value: number;
}

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [operationNumber, setOperationNumber] = useState("");

  const { products, loadingProduct } = useSelector(({ ProductReducer }) => {
    const { products, loadingProduct } = ProductReducer;
    return { products, loadingProduct };
  });

  const {
    dataUser: { userType },
  } = useSelector((state) => state.UserReducer as IUserState);

  const handleDiscountProduct = () => {
    switch (userType) {
      case EUserTypeE.DISTRIBUTOR:
        return 25;
      case EUserTypeE.BUILDER:
        return 35;
      case EUserTypeE.WHOLESALER:
      case EUserTypeE.SENIOR_WHOLESALER:
      case EUserTypeE.GOLDEN_PRESIDENT:
      case EUserTypeE.SILVER_PRODUCER:
        return 42;
      default:
        return 0;
    }
  };

  const handleCalculateDiscount = (price: number) => {
    const discountPercentage = handleDiscountProduct();
    const discountAmount = (price * discountPercentage) / 100;
    const finalPrice = price - discountAmount;
    return finalPrice;
  };

  const handleQuantityChange = (productId: number, value: string) => {
    const newQuantity = parseInt(value, 10);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: isNaN(newQuantity) ? 0 : newQuantity,
    }));
  };

  const handlePay = async () => {

    const totalPts = cart.reduce(
        (acc, item) =>
          acc + item.value * item.quantity,
        0
      )


    const totalToPay = cart.reduce(
        (acc, item) =>
          acc + item.price * item.quantity,
        0
      )
      
    const data = {
        cart,
        totalPts,
        totalToPay,
        operationNumber
    }

    await dispatch(postPurchaseApi(data, clear));

    // Swal.fire({
    //     icon: 'success',
    //     title: 'Compra realizada con exito',
    //     text: 'Su compra ha sido enviada para ser aprobada!',
    //     confirmButtonText: 'Aceptar'
    //   });
  };

  const clear = () => {
    setCart([]);
    setShowModal(false);
  }

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 0;

    if (quantity > 0) {
      setCart((prevCart) => {
        const existingProductIndex = prevCart.findIndex(
          (item) => item.producId === product.id
        );

        if (existingProductIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingProductIndex].quantity += quantity;
          return updatedCart;
        } else {
          return [
            ...prevCart,
            {
                producId: product.id,
              name: product.name,
              quantity,
              price: handleCalculateDiscount(product.price),
              priceTotalWithDiscount: handleCalculateDiscount(product.price) * quantity,
              value: product.value,
            },
          ];
        }
      });

      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [product.id]: 0,
      }));
    }
  };

  const totalProductsInCart = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.producId !== id);
      if (newCart.length === 0) {
        setShowModal(false);
      }
      return newCart;
    });
  };

  useEffect(() => {
    dispatch(apiGetProductsUser());
  }, [dispatch]);

  return (
    <>
      <main className="py-5 py-lg-8 bg-surface-secondary">
        <div className="container-xl">
          <div className="mt-n56 position-relative z-index-100">
            <div className="container mt-5">
              <div className="mb-5">
                <button
                  className="btn btn-white position-relative"
                  onClick={() => setShowModal(true)} // Abrir modal al hacer clic
                  disabled={totalProductsInCart === 0} // Deshabilitar si no hay productos
                >
                  <img src="/images/shoppingCart.svg" alt="Shopping Cart" />
                  {totalProductsInCart > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {totalProductsInCart}
                    </span>
                  )}
                </button>
              </div>

              <div className="row">
                {!loadingProduct &&
                  products.map((product: any, index: number) => (
                    <div className="col-md-4 mb-5" key={index}>
                      <div className="card product-card">
                        <img
                          src={product.img}
                          className="card-img-top product-image"
                          alt="Product Image"
                        />
                        <div className="card-body">
                          <h5 className="card-text">{product.name}</h5>
                          <h6 className="card-text mb-5">
                            {product.description}
                          </h6>
                          <p className="card-text">
                            Descuento:{" "}
                            <strong>{handleDiscountProduct()}%</strong>
                          </p>
                          <p className="card-text">
                            Precio: <strong>${product.price}</strong>
                          </p>
                          <p className="card-text">
                            Precio con descuento:{" "}
                            <strong>
                              ${handleCalculateDiscount(product.price)}
                            </strong>
                          </p>
                          <p className="card-text">
                            Valor: <strong>{product.value} pts</strong>
                          </p>
                          <div className="d-flex align-items-start mt-5">
                            <input
                              type="number"
                              placeholder="Cantidad"
                              id={`quantity-${index}`}
                              className="form-control form-control-sm me-2"
                              min="1"
                              value={quantities[product.id] || ""}
                              onChange={(e) =>
                                handleQuantityChange(product.id, e.target.value)
                              }
                            />
                            <button
                              className="btn btn-sm btn-primary"
                              disabled={
                                !quantities[product.id] ||
                                quantities[product.id] <= 0
                              }
                              onClick={() => handleAddToCart(product)}
                            >
                              <img
                                src="/images/shoppingPlus.svg"
                                alt="Shopping Plus"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Modal para mostrar el carrito */}
              {showModal && (
                <div
                  className="modal fade show"
                  style={{ display: "block" }}
                  tabIndex={-1}
                  onClick={() => setShowModal(false)}
                >
                  <div className="modal-dialog"  onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Carrito de Compras</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowModal(false)}
                        ></button>
                      </div>
                      <div
                        className="modal-body"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        {cart.length === 0 ? (
                          <p>No hay productos en el carrito.</p>
                        ) : isPurchasing ? (
                          <div>
                            <label htmlFor="operationNumber">
                              Número de operación bancaria:
                            </label>
                            <input
                              type="number"
                              id="operationNumber"
                              value={operationNumber}
                              onChange={(e) =>{
                                e.stopPropagation();
                                setOperationNumber(e.target.value)
                              }
                              }
                              className="form-control"
                            />
                          </div>
                        ) : (
                          <ul className="list-group">
                            {cart.map((item) => (
                              <li
                                className="list-group-item d-flex justify-content-between align-items-start"
                                key={item.producId}
                              >
                                <div className="me-auto">
                                  <h5 className="mb-1">
                                    <strong>{item.name}</strong>
                                  </h5>
                                  <div>
                                    <strong>Cantidad:</strong> {item.quantity}
                                  </div>
                                  <div>
                                    <strong>
                                      Precio por unidad (con descuento):
                                    </strong>{" "}
                                    ${item.price}
                                  </div>
                                  <div>
                                    <strong>
                                      Precio total (con descuento):
                                    </strong>{" "}
                                    ${item.priceTotalWithDiscount}
                                  </div>
                                  <div>
                                    <strong>Valor:</strong> {item.value} pts
                                  </div>
                                </div>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFromCart(item.producId);
                                  }}
                                >
                                  <img src="/images/trash.svg" alt="trash" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="modal-footer d-flex justify-content-between">
                        {cart.length > 0 && !isPurchasing && (
                          <div>
                            <h4 className="mb-0">
                              <strong>Total a pagar: </strong>
                              <strong>
                                $
                                {cart
                                  .reduce(
                                    (acc, item) =>
                                      acc +
                                      item.price *
                                        item.quantity,
                                    0
                                  )
                                  .toFixed(2)}
                              </strong>
                            </h4>
                            <h6 className="mb-0 mt-1">
                              <strong>Total en puntos: </strong>
                              <strong>
                                {cart.reduce(
                                  (acc, item) =>
                                    acc + item.value * item.quantity,
                                  0
                                )}{" "}
                                pts
                              </strong>
                            </h6>
                          </div>
                        )}
                        {!isPurchasing ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsPurchasing(true)}} 
                          >
                            Comprar
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-success"
                            disabled={operationNumber === "" || operationNumber === '0'}
                            onClick={handlePay}
                          >
                            Pagar
                          </button>
                        )}
                        {isPurchasing && (
                            <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setOperationNumber("");
                                setIsPurchasing(false)
                                
                            }}
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowModal(false)}
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
